const { app } = require('@azure/functions')
const { v4 } = require('uuid')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_TEMPLATES

app.http('createTemplate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'templates/new',
    handler: async (request, context) => {
        const { items, store_id } = await request.json()

        if (!items) {
            return {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing template items" })
            }
        }

        const newTemplate = {
            template_id: v4(),
            store_id,
            ...items
        }

        try {
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const { resource: createdTemplate } = await container.items.upsert(newTemplate)

            context.log(createdTemplate)

            return {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdTemplate)
            }
        } catch (error) {
            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error creating template." })
            }
        }
    }
})
