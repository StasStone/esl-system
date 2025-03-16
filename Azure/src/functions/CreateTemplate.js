const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_TEMPLATES

app.http('createTemplate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'templates/new',
    handler: async (request, context) => {
        const { items } = await request.json()

        if (items.length === 0) {
            context.res = {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing template items" })
            }
            return
        }

        try {
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const { resource: createdTemplate } = await container.items.upsert(newTemplate)

            context.log(createdProduct)

            context.res = {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdTemplate)
            }
        } catch (error) {
            context.res = {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error creating template." })
            }
        }
    }
})
