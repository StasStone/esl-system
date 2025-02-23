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
            const filters = await request.json()

            // Define a query to filter products
            let query = 'SELECT c.id, c.prive, c.discoutn, c.producer, c.inventory_count FROM c WHERE 1=1'
            const params = []
            Object.entries(filters).forEach(([key, filter], index) => {
                if (filter.active && filter.value) {
                    query += ` AND c.${key} = @param${index}`
                    params.push({ name: `@param${index}`, value: filter.value })
                }
            })

            const querySpec = {
                query,
                parameters: params
            }

            const { resources: products } = await container.items
                .query(querySpec)
                .fetchAll()

            let filteredProducts = products

            filteredProducts = labels.filter(data =>
                Object.entries(filters).every(([key, filter]) => {
                    if (!filter.active || !filter.value) return true
                    const dataValue = data[key]
                    return dataValue?.toString().toLowerCase() === filter.value
                })
            )

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ labels: filteredProducts })
            }
        } catch (error) {
            context.log.error('Error retrieving products:', error)

            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error retrieving products' })
            }
        }
    }
})
