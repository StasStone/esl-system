const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS

app.http('deleteLabels', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'products/{id}/{partitionKey}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`)
        const { id, partitionKey } = request.params
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            // Define a query to select all labels
            const { resource: item } = await container.item(id, partitionKey).read()

            if (!item) {
                return {
                    status: 404,
                    body: JSON.stringify({ error: 'Item not found' })
                }
            }

            await container.item(id, partitionKey).delete()
            return {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Label deleted successfully"
                })
            }
        } catch (error) {
            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error retrieving products" })
            }
        }
    }
})
