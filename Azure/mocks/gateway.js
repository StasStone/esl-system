const { Client } = require('azure-iot-device')
const { Mqtt } = require('azure-iot-device-mqtt')
// Replace with your actual device connection string
const connectionString = process.env.IOT_HUB_EVENT_HUB_CONNECTION_STRING

const client = Client.fromConnectionString(connectionString, Mqtt)

async function connectDevice() {
    try {
        await client.open()
        console.log('✅ Device connected to IoT Hub!')

        // Listen for cloud-to-device messages
        client.on('message', msg => {
            console.log(`📩 Message received: ${msg.data.toString()}`)
            client.complete(msg) // Acknowledge message receipt
        })
    } catch (err) {
        console.error('❌ Could not connect:', err)
    }
}

connectDevice()
