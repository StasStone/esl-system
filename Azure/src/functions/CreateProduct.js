const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS

app.http('createProduct', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'products/new',
    handler: async (request, context) => {
        const { id, labels, producer, price, discount = 0, name } = await request.json()
        context.log(labels)
        if (!labels || !producer || price === undefined || !name || !id) {
            context.res = {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing required parameters." })
            }
            return
        }

        const newProduct = {
            id,
            producer,
            price,
            discount,
            name,
            labels
        }

        try {
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const { resource: createdProduct } = await container.items.upsert(newProduct)

            context.log(createdProduct)

            context.res = {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdProduct)
            }
        } catch (error) {
            context.res = {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error creating product." })
            }
        }
    }
})
