const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_LABELS

app.http('deleteLabels', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'labels/{id}/{partitionKey}',
    handler: async (request, context) => {
        const { id, partitionKey } = request.params
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const { resource: item } = await container.item(id, partitionKey).read()

            context.log(item)

            if (!item) {
                return {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ error: 'Label not found' })
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
            context.log(error)
            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error retrieving labels" })
            }
        }
    }
})
