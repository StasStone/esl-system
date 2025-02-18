const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_LABELS


app.http('labels', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'labels',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`)
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            // Define a query to select all labels
            const querySpec = {
                query: 'SELECT * FROM c'
            }

            const { resources: labels } = await container.items
                .query(querySpec)
                .fetchAll()

            return {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ labels })
            }
        } catch (error) {
            context.log.error("Error retrieving labels:", error)

            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error retrieving labels" })
            }
        }
    }
})
