const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const productsContainerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS
const updatesContainerId = process.env.COSMOS_DB_CONTAINER_UPDATES

app.http('getProducts', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'products',
    handler: async (request, context) => {
        try {
            const database = cosmosClient.database(databaseId)
            const productsContainer = database.container(productsContainerId)
            const updatesContainer = database.container(updatesContainerId)
            const { filters = {}, limit = 10, continuationToken } = await request.json()

            // Define a query to filter products
            let query =
                'SELECT c.id, c.name, c.price, c.discount, c.producer, c.labels, c.updating FROM c WHERE 1=1'

            // Execute query with pagination
            const queryIterator = productsContainer.items.query(query, {
                maxItemCount: limit,
                continuationToken: continuationToken || undefined
            })

            const { resources: products, continuationToken: nextContinuationToken } = await queryIterator.fetchNext()

            // Identify products that are updating
            const updatingProducts = products.filter(p => p.updating)

            // Fetch latest updates for those products
            if (updatingProducts.length > 0) {
                const updateQueries = updatingProducts.map(p => ({
                    query: 'SELECT TOP 1 c.product_id, c.name, c.price, c.discount, c.producer FROM c WHERE c.product_id = @productId ORDER BY c._ts DESC',
                    parameters: [{ name: '@productId', value: p.id }]
                }))

                const updatePromises = updateQueries.map(q =>
                    updatesContainer.items.query(q).fetchNext()
                )

                const updatesResults = await Promise.all(updatePromises)
                const updatesMap = Object.fromEntries(
                    updatesResults
                        .filter(res => res.resources.length > 0)
                        .map(res => {
                            const resource = res.resources[0]
                            const { product_id: id, name, price, discount, producer } = resource
                            return [res.resources[0].product_id, { id, name, price, discount, producer }]
                        })
                )

                // Replace updating products with their updates
                for (let i = 0; i < products.length; i++) {
                    if (updatesMap[products[i].id]) {
                        const { updating, labels } = products[i]
                        products[i] = { ...updatesMap[products[i].id], labels, updating } // Replace with latest update
                    }
                }
            }

            const filteredProducts = products.filter(product => {
                return Object.entries(filters).every(([key, filter]) => {
                    if (!filter) return true
                    return product[key] == filter
                })
            })

            context.log(filteredProducts)

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products: filteredProducts, continuationToken: nextContinuationToken })
            }
        } catch (error) {
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error retrieving products' })
            }
        }
    }
})
