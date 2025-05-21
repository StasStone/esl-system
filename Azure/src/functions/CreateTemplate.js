const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')
const { v4 } = require('uuid')
const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_TEMPLATES

app.http('createTemplate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'templates/new',
    handler: async (request, context) => {
        const { items, store_id, current, template_id, title } = await request.json()
        context.log(template_id);

        if (!items) {
            return {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing template items" })
            }
        }

        const newTemplateData = {
            id: template_id === 'new' ? v4() : template_id,
            store_id,
            current,
            title,
            ...items
        }

        try {
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const { resource: newTemplate } = await container.items.upsert(newTemplateData)

            const createdTemplate = { id: newTemplate.id, title: newTemplate.title, name: newTemplate.name, price: newTemplate.price, producer: newTemplate.producer, discount: newTemplate.discount }

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
