const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_LABELS

app.http('createLabel', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'labels/new',
    handler: async (request, context) => {
        const { product_id, id, last_updated } = await request.json()

        if (!product_id || !last_updated) {
            context.res = {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing required parameters." })
            }
            return
        }

        const newLabel = {
            id,
            product_id,
            last_updated
        }

        try {
            // Get a reference to the CosmosDB container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            // Insert the new product into CosmosDB
            const { resource: createdLabel } = await container.items.create(newLabel)

            context.log("Label created successfully:", createdLabel)

            context.res = {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdLabel)
            }
        } catch (error) {
            context.res = {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error creating label." })
            }
        }
    }
})
