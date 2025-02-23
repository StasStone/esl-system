const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_LABELS

app.http('getLabels', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'labels',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const filters = await request.json()

            // Define a query to filter labels
            let query = 'SELECT c.id, c.product_id, c.last_updated FROM c WHERE 1=1'
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

            const { resources: labels } = await container.items
                .query(querySpec)
                .fetchAll()
            let filteredLabels = labels

            filteredLabels = labels.filter(data =>
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
                body: JSON.stringify({ labels: filteredLabels })
            }
        } catch (error) {
            context.log.error('Error retrieving labels:', error)

            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error retrieving labels' })
            }
        }
    }
})
