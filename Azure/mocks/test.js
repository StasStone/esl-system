// Import necessary modules from Azure IoT SDK
const { ServiceClient, Message } = require('azure-iot-service')

// Replace with your IoT Hub connection string (Service Connection String)
const serviceConnectionString = process.env.IOT_HUB_CONNECTION_STRING
const deviceId = 'gateway-test'

// Initialize the IoT Hub service client
const serviceClient = ServiceClient.fromConnectionString(
    serviceConnectionString
)

// Function to send C2D message
function sendC2DMessage() {
    // Create a message to send
    const msg = new Message('Hello from the IoT Hub service!')

    // Send the message to the specified device
    serviceClient.send(deviceId, msg, err => {
        if (err) {
            console.log('Error sending C2D message: ', err)
        } else {
            console.log('C2D message sent successfully!')
        }
    })
}

// Test: Send the message
sendC2DMessage()
