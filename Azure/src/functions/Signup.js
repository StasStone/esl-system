const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')
const bcrypt = require('bcrypt-nodejs')
const { v4 } = require('uuid')
const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_USERS

app.http('signup', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'signup',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { email, password } = await request.json()
            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, null, null, (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                })
            })

            const newUser = {
                email,
                user_id: v4(),
                password: hashedPassword,
                created_at: "today"
            }

            const { resource: createdUser } = await container.items.upsert(newUser)
            // Successful login, you can return the user data or a token (e.g., JWT)
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Signup successful', user: createdUser })
            }
        } catch (error) {
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Internal server error' })
            }
        }
    }
})
