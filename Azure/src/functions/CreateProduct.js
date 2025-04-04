const { app } = require('@azure/functions')
const crypto = require('crypto')
const { v4 } = require('uuid')
const { Client } = require('azure-iothub')
const { Message } = require('azure-iot-common')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const updatesContainerId = process.env.COSMOS_DB_CONTAINER_UPDATES
const productsContainerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS
const connectionString = process.env.IOT_HUB_CONNECTION_STRING
const client = Client.fromConnectionString(connectionString)

function generateHash(payload) {
    return crypto
        .createHash('sha256')
        .update(JSON.stringify(payload))
        .digest('hex')
}

app.http('createProduct', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'products/new',
    handler: async (request, context) => {
        const {
            id,
            labels,
            producer,
            price,
            discount = 0,
            name
        } = await request.json()

        if (!labels || !producer || price === undefined || !name || !id) {
            return { status: 400, body: { error: 'Missing required parameters.' } }
        }

        const database = cosmosClient.database(databaseId)
        const containerProducts = database.container(productsContainerId)
        const containerUpdates = database.container(updatesContainerId)

        // Fetch existing product data
        const query = 'SELECT * FROM c WHERE c.id = @id'
        const params = [{ name: `@id`, value: id }]
        const { resources: products } = await containerProducts.items
            .query({ query, parameters: params })
            .fetchAll()

        let newProductData = {
            labels: [],
            id,
            producer,
            price,
            discount,
            name,
            updating,
        }

        if (products.length) {
            newProductData = { ...products[0], updating }
        }

        if (!oldProductData.updating) {
            await containerProducts.items.upsert(newProductData)
        }

        try {
            const updatePayload = { producer, price, discount, name }
            const updateHash = generateHash(updatePayload)
            const update_id = v4()

            const { resources: existingUpdates } = await containerUpdates.items
                .query({
                    query:
                        "SELECT * FROM c WHERE c.product_id = @productId AND c.updateHash = @updateHash AND c.status = 'Pending'",
                    parameters: [
                        { name: '@productId', value: id },
                        { name: '@updateHash', value: updateHash }
                    ]
                })
                .fetchAll()

            if (existingUpdates.length > 0) {
                return { status: 200, body: { message: 'Duplicate update ignored.' } }
            }

            await client.open() // Open IoT Hub connection

            const messagePromises = labels.map(async label_id => {
                try {
                    const updateMessage = {
                        id,
                        label_id,
                        product_id,
                        producer,
                        price,
                        discount,
                        name,
                        updateHash,
                        status: 'Pending'
                    }

                    await containerUpdates.items.upsert(updateMessage)
                    const message = new Message(JSON.stringify(updateMessage))
                    message.contentType = "application/json"
                    message.contentEncoding = "utf-8"
                    message.messageId = v4()
                    message.to = "gateway-test"
                    context.log(message)
                    await client.send('gateway-test', message)
                    context.log(`Event sent for label ${label_id}`)
                } catch (err) {
                    throw new Error(err.message)
                }
            })

            await Promise.all(messagePromises) // Wait for all messages to be sent
            await client.close() // Close IoT Hub connection

            return { status: 201, body: { message: 'Product is being updated' } }
        } catch (error) {
            context.log(error)
            return { status: 500, body: { error: 'Error creating product.' } }
        }
    }
})
