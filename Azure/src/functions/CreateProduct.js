const { app } = require('@azure/functions')
const crypto = require('crypto')
const { v4 } = require('uuid')
const { Client } = require('azure-iothub')
const { Message } = require('azure-iot-common')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const updatesContainerId = process.env.COSMOS_DB_CONTAINER_UPDATES
const labelsContainerId = process.env.COSMOS_DB_CONTAINER_LABELS
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
            id: product_id,
            labels,
            producer,
            price,
            discount = 0,
            name,
            updating
        } = await request.json()

        if (!labels || !producer || price === undefined || !name || !product_id) {
            return { status: 400, body: { error: 'Missing required parameters.' } }
        }

        const database = cosmosClient.database(databaseId)
        const containerProducts = database.container(productsContainerId)
        const containerLabels = database.container(labelsContainerId)
        const containerUpdates = database.container(updatesContainerId)

        // Fetch existing product data
        const query = 'SELECT * FROM c WHERE c.id = @id'
        const params = [{ name: `@id`, value: product_id }]
        const { resources: products } = await containerProducts.items
            .query({ query, parameters: params })
            .fetchAll()

        let newProductData = {
            labels,
            product_id,
            producer,
            price,
            discount,
            name,
            updating
        }

        if (!products.length) {
            await containerProducts.items.upsert(newProductData)
        } else {
            await containerProducts.items.upsert({ ...products[0], updating })
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
                        { name: '@productId', value: product_id },
                        { name: '@updateHash', value: updateHash }
                    ]
                })
                .fetchAll()

            if (existingUpdates.length > 0) {
                return { status: 200, body: { message: 'Duplicate update ignored.' } }
            }

            await client.open() // Open IoT Hub connection

            const messagePromises = labels.map(async label_id => {
                const { resources: [gateway] } = await containerLabels.items
                    .query({
                        query:
                            "SELECT c.gateway_id FROM c WHERE c.id = @labelId",
                        parameters: [
                            { name: '@labelId', value: label_id },
                        ]
                    })
                    .fetchAll()

                const { gateway_id } = gateway

                try {
                    const updateMessage = {
                        id: update_id,
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
                    message.to = gateway_id

                    await client.send('gateway-test', message)
                    context.log(`Event sent for label ${label_id}`)
                } catch (err) {
                    throw new Error(err.message)
                }
            })

            await Promise.all(messagePromises)
            await client.close()

            return { status: 201, body: { message: 'Product is being updated' } }
        } catch (error) {
            context.log(error)
            return { status: 500, body: { error: 'Error creating product.' } }
        }
    }
})
