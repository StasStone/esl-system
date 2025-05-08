const { Client, Message } = require('azure-iot-device')
const { Mqtt } = require('azure-iot-device-mqtt')

const connectionString = process.env.IOT_HUB_CONNECTION_STRING

const client = Client.fromConnectionString("HostName=esl-broker.azure-devices.net;DeviceId=gateway-test;SharedAccessKey=o+wPfL3/a4YFpwJXaqn9n5Bzq06Ger9dh8THDbjTXRI=", Mqtt)

async function connectDevice() {
    try {
        await client.open()
        console.log('Device connected to IoT Hub!')

        // Listen for cloud-to-device messages
        client.on('message', async msg => {
            const receivedData = msg.data.toString()
            console.log(`📩 Message received: ${receivedData}`)

            // Simulate processing delay
            await new Promise(res => setTimeout(res, 1000))

            try {
                const parsed = JSON.parse(receivedData)
                update_id = parsed.id || 'unknown'
            } catch (err) {
                console.warn('Could not parse message as JSON. Proceeding with raw data.')
            }

            // Simulate update result
            const status = Math.random() > 0.2 ? 'Success' : 'Failed'
            const resultPayload = {
                update_id,
                status,
                timestamp: new Date().toISOString()
            }

            const resultMessage = new Message(JSON.stringify(resultPayload))
            resultMessage.contentType = 'application/json'
            resultMessage.contentEncoding = 'utf-8'

            client.sendEvent(resultMessage, err => {
                if (err) {
                    console.error('Failed to send update result:', err.message)
                } else {
                    console.log(`Sent update result: ${JSON.stringify(resultPayload)}`)
                }
            })

            // Acknowledge the original message
            client.complete(msg)
        })
    } catch (err) {
        console.error('Could not connect:', err)
    }
}

connectDevice()
