const { app } = require('@azure/functions')
const { v4 } = require('uuid')
const { Client } = require('azure-iothub')
const { Message } = require('azure-iot-common')
const cosmosClient = require('../CosmosClient')
const bcrypt = require('bcrypt-nodejs')
const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_USERS

const connectionString = process.env.IOT_HUB_CONNECTION_STRING
const client = Client.fromConnectionString(connectionString)

app.http('updateUser', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    route: 'users',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { user } = await request.json()

            let query = 'SELECT c.id, c.email, c.store_id FROM c WHERE c.id=@User'
            const params = [{ name: `@User`, value: user.id }]
            const querySpec = {
                query,
                parameters: params
            }

            const { resources: users } = await container.items
                .query(querySpec)
                .fetchAll()
            const existingUser = users[0]

            let newPassword = existingUser.password

            if (user.password !== "old") {
                newPassword = await new Promise((resolve, reject) => {
                    bcrypt.hash(user.password, null, null, (err, result) => {
                        if (err) reject(err)
                        resolve(result)
                    })
                })
            }

            const newUser = {
                ...existingUser,
                password: newPassword
            }

            // Execute the query with the email parameter
            const { resource: updatedUser } = await container.item(existingUser.id, existingUser.id).replace(newUser)

            await client.open()

            const message = new Message(JSON.stringify({ interval: user.interval }))
            message.contentType = "application/json"
            message.contentEncoding = "utf-8"
            message.messageId = v4()

            await client.send('gateway-test', message)
            await client.close()

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: { email: updatedUser.email, password: updatedUser.password, store_id: updatedUser.store_id, id: updatedUser.id } })
            }
        } catch (error) {
            context.log(error.message)
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Internal server error' })
            }
        }
    }
})
