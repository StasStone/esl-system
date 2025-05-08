const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_LABELS

app.http('createLabel', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'labels/new',
    handler: async (request, context) => {
        const { product_id, id, last_updated, gateway_id } = await request.json()

        if (!last_updated || !gateway_id) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Missing required parameters.' })
            }
        }

        const newLabel = {
            id,
            product_id,
            gateway_id,
            last_updated
        }

        try {
            // Get a reference to the CosmosDB container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const { resource: existingLabel } = await container.item(id, gateway_id).read()

            if (existingLabel) {
                existingLabel.gateway_id = gateway_id
                existingLabel.product_id = product_id

                await container
                    .item(id, gateway_id)
                    .replace(existingLabel)
            } else {
                await container.items.create(newLabel)
            }

            return {
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLabel)
            }
        } catch (error) {
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error creating label.' })
            }
        }
    }
})
