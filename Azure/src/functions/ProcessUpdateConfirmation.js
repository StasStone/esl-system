const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const updatesContainerId = process.env.COSMOS_DB_CONTAINER_UPDATES
const productsContainerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS

app.eventHub('processUpdateConfirmation', {
    eventHubName: 'IOT_HUB_NAME',
    connection: 'IOT_HUB_ENDPOINT',
    cardinality: 'many',
    handler: async (messages, context) => {
        const database = cosmosClient.database(databaseId)
        const containerUpdates = database.container(updatesContainerId)
        const containerProducts = database.container(productsContainerId)

        for (const message of messages) {
            try {

                const { update_id, status } = message

                if (!update_id || !status) {
                    context.log('Invalid message format, ignoring...')
                    continue
                }
                const updateQuerySpec = {
                    query:
                        'SELECT c.product_id, c.name, c.price, c.discount, c.producer FROM c WHERE c.id = @updateId',
                    parameters: [{ name: '@updateId', value: update_id }]
                }

                const { resources: [updateData] } = await containerUpdates.items
                    .query(updateQuerySpec)
                    .fetchAll()

                const { discount: newDiscount, name: newName, producer: newProducer, price: newPrice, product_id } = updateData

                const productQuerySpec = {
                    query:
                        'SELECT c.id, c.name, c.price, c.discount, c.producer, c.labels FROM c WHERE c.id = @productId',
                    parameters: [{ name: '@productId', value: product_id }]
                }

                // Delete update from updates container
                await containerUpdates.item(update_id, product_id).delete()

                const remainingUpdatesQuery = {
                    query: `
                      SELECT VALUE COUNT(1) 
                      FROM c 
                      WHERE c.product_id = @productId
                    `,
                    parameters: [{ name: '@productId', value: product_id }]
                }

                const { resources: [count] } = await containerUpdates.items
                    .query(remainingUpdatesQuery)
                    .fetchAll()


                const { resources: [product] } = await containerProducts.items
                    .query(productQuerySpec)
                    .fetchAll()
                const oldProducer = product.producer
                if (status === 'Success') {
                    if (product) {
                        product.discount = newDiscount
                        product.name = newName
                        product.producer = newProducer
                        product.price = newPrice
                    }
                }

                product.updating = count > 0
                context.log(product)
                await containerProducts
                    .item(product_id, oldProducer)
                    .replace(product)

            } catch (error) {
                context.log(
                    `Error processing update confirmation: ${error.message}`
                )
            }
        }
    }
})
