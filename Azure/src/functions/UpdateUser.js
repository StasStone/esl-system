const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')
const bcrypt = require('bcrypt-nodejs')
const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_USERS

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

            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(user.password, null, null, (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                })
            })

            let query = 'SELECT c.id, c.email, c.user_id, c.store_id FROM c WHERE c.user_id=@User'
            const params = [{ name: `@User`, value: user.user_id }]
            const querySpec = {
                query,
                parameters: params
            }

            const { resources: users } = await container.items
                .query(querySpec)
                .fetchAll()
            const existingUser = users[0]

            const newUser = {
                ...existingUser,
                password: hashedPassword
            }

            context.log(newUser)

            // Execute the query with the email parameter
            const { resource: updatedUser } = await container.item(existingUser.id, user.user_id).replace(newUser)

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: { email: updatedUser.email, password: updatedUser.password, store_id: updatedUser.store_id, user_id: updatedUser.user_id } })
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
