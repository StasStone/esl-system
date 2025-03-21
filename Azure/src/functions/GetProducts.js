const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS

app.http('getProducts', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'products',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { filters = {}, limit = 10, continuationToken } = await request.json()

            context.log(filters)

            // Define a query to filter products
            let query =
                'SELECT c.id, c.name, c.price, c.discount, c.producer, c.labels FROM c WHERE 1=1'
            const params = []
            Object.entries(filters).forEach(([key, filter], index) => {
                if (filter.active && filter.value) {
                    context.log(` AND c.${key} = @param${index}`)
                    query += ` AND c.${key} = @param${index}`
                    params.push({ name: `@param${index}`, value: filter.value })
                }
            })
            const querySpec = {
                query,
                parameters: params
            }

            // Execute query with pagination
            const queryIterator = container.items.query(querySpec, {
                maxItemCount: limit,
                continuationToken: continuationToken || undefined
            })

            const { resources: products, continuationToken: nextContinuationToken } = await queryIterator.fetchNext()

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ products: products, continuationToken: nextContinuationToken })
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
