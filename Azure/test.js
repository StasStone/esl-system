const { EventHubConsumerClient } = require('@azure/event-hubs')

const connectionString = process.env.IOT_HUB_EVENT_HUB_CONNECTION_STRING
const consumerGroup = '$Default'

async function receiveMessages() {
    const client = new EventHubConsumerClient(consumerGroup, connectionString)
    const subscription = client.subscribe({
        processEvents: async (events, context) => {
            for (const event of events) {
                console.log('🔹 Received event:', event.body)
            }
        },
        processError: async (err, context) => {
            console.error('❌ Error receiving events:', err)
        }
    })

    setTimeout(async () => {
        await subscription.close()
        await client.close()
    }, 30000) // Run for 30 seconds
}

receiveMessages()
