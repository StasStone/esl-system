const { app } = require('@azure/functions')
const { Client } = require('azure-iothub')
const { Message } = require('azure-iot-common')
const { v4 } = require('uuid')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const productsContainerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS
const updatesContainerId = process.env.COSMOS_DB_CONTAINER_UPDATES
const labelsContainerId = process.env.COSMOS_DB_CONTAINER_LABELS
const connectionString = process.env.IOT_HUB_CONNECTION_STRING
const client = Client.fromConnectionString(connectionString)

app.http('deleteProducts', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    route: 'products/{id}/{partitionKey}',
    handler: async (request, context) => {
        const { id: product_id, partitionKey } = request.params

        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const productsContainer = database.container(productsContainerId)

            // Define a query to select all labels
            const { resource: item } = await productsContainer.item(product_id, partitionKey).read()

            context.log(item)

            if (!item) {
                return {
                    status: 404,
                    body: JSON.stringify({ error: 'Item not found' })
                }
            }
            const labelsContainer = database.container(labelsContainerId)
            const updatesContainer = database.container(updatesContainerId)
            const update_id = v4()

            await client.open()

            const messagePromises = item.labels.map(async label_id => {
                const { resources: [label] } = await labelsContainer.items
                    .query({
                        query:
                            "SELECT c.gateway_id, c.id, c.product_id FROM c WHERE c.id = @labelId",
                        parameters: [
                            { name: '@labelId', value: label_id },
                        ]
                    })
                    .fetchAll()

                const { gateway_id } = label

                try {
                    const updateMessage = {
                        id: update_id,
                        label_id,
                        product_id,
                        producer: '',
                        price: '',
                        discount: '',
                        name: '',
                        status: 'Pending'
                    }

                    await updatesContainer.items.upsert(updateMessage)

                    const message = new Message(JSON.stringify(updateMessage))
                    message.contentType = "application/json"
                    message.contentEncoding = "utf-8"
                    message.messageId = v4()
                    message.to = gateway_id
                    await client.send(gateway_id, message)

                    await labelsContainer.item(label_id, gateway_id)
                        .replace({ ...label, product_id: '' })
                } catch (err) {
                    throw new Error(err.message)
                }
            })

            await productsContainer.item(product_id, partitionKey).delete()

            await Promise.all(messagePromises)
            await client.close()

            return {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Product deleted successfully"
                })
            }
        } catch (error) {
            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error deleting product" })
            }
        }
    }
})
