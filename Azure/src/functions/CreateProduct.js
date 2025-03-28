const { app } = require('@azure/functions')
const { Client } = require('azure-iot-device')
const { Mqtt } = require('azure-iot-device-mqtt')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS
const connectionString = process.env.IOT_HUB_CONNECTION_STRING
const client = Client.fromConnectionString(connectionString, Mqtt)

app.http('createProduct', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'products/new',
    handler: async (request, context) => {
        const { id, labels, producer, price, discount = 0, name } = await request.json()
        context.log(labels)
        if (!labels || !producer || price === undefined || !name || !id) {
            return {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Missing required parameters." })
            }
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

            // Publish an event for each label
            for (const labelId of labels) {
                const eventMessage = {
                    label_id: labelId,
                    product: {
                        id,
                        producer,
                        price,
                        discount,
                        name
                    }
                }

                const message = new Message(JSON.stringify(eventMessage))
                message.properties.add('contentType', 'application/json')

                // Send message to IoT Hub
                client.sendEvent(message, (err, res) => {
                    if (err) {
                        context.log(`Error sending event for label ${labelId}:`, err)
                    } else {
                        context.log(`Event sent for label ${labelId}:`, res)
                    }
                })
            }

            return {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(createdProduct)
            }
        } catch (error) {
            return {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Error creating product." })
            }
        }
    }
})
