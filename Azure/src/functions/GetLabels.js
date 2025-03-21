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
            // Get database and container references
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { filters = {}, limit = 10, continuationToken } = await request.json()

            // Define query with filters
            let query = 'SELECT c.id, c.product_id, c.last_updated FROM c WHERE 1=1'
            const params = []
            Object.entries(filters).forEach(([key, filter], index) => {
                if (filter.active && filter.value) {
                    query += ` AND c.${key} = @param${index}`
                    params.push({ name: `@param${index}`, value: filter.value })
                }
            })

            const querySpec = { query, parameters: params }

            // Execute query with pagination
            const queryIterator = container.items.query(querySpec, {
                maxItemCount: limit,
                continuationToken: continuationToken || undefined
            })

            const { resources: labels, continuationToken: nextContinuationToken } = await queryIterator.fetchNext()

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labels,
                    continuationToken: nextContinuationToken
                })
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
