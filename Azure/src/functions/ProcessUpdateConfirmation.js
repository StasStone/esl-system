// const { app } = require('@azure/functions')
// const cosmosClient = require('../CosmosClient')

// const databaseId = process.env.COSMOS_DB_DATABASE_ID
// const updatesContainerId = process.env.COSMOS_DB_CONTAINER_UPDATES
// const productsContainerId = process.env.COSMOS_DB_CONTAINER_PRODUCTS

// app.eventHub('processUpdateConfirmation', {
//     eventHubName: process.env.IOT_HUB_EVENT_HUB_NAME,
//     connection: process.env.IOT_HUB_CONNECTION_STRING,
//     cardinality: 'many',
//     handler: async (messages, context) => {
//         const database = cosmosClient.database(databaseId)
//         const containerUpdates = database.container(updatesContainerId)
//         const containerProducts = database.container(productsContainerId)

//         for (const message of messages) {
//             try {
//                 context.log(`Received confirmation: ${JSON.stringify(message)}`)

//                 const { update_id, status, product_id } = message

//                 if (!update_id || !status || !product_id) {
//                     context.log('Invalid message format, ignoring...')
//                     continue
//                 }

//                 if (status === 'Failed') {
//                     // Delete update from updates container
//                     await containerUpdates.item(update_id, update_id).delete()
//                     context.log(`Deleted failed update: ${update_id}`)

//                     // Reset the "updating" flag in products container
//                     const { resource: product } = await containerProducts
//                         .item(product_id, product_id)
//                         .read()

//                     if (product) {
//                         product.updating = false
//                         await containerProducts
//                             .item(product_id, product_id)
//                             .replace(product)
//                         context.log(`Updated product ${product_id} to set updating=false`)
//                     }
//                 } else {
//                     context.log(`Update ${update_id} succeeded, no action needed.`)
//                 }
//             } catch (error) {
//                 context.log.error(
//                     `Error processing update confirmation: ${error.message}`
//                 )
//             }
//         }
//     }
// })
