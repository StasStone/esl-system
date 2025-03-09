const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')
const bcrypt = require('bcrypt-nodejs')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_USERS

app.http('login', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'login',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { email, password } = await request.json()

            // Define a query to find the user by email
            let query = 'SELECT c.email, c.password FROM c WHERE c.email = @Email'

            // Execute the query with the email parameter
            const { resources: users } = await container.items
                .query(query, { parameters: [{ name: '@Email', value: email }] })
                .fetchAll()

            // If no user is found, return an error
            if (users.length === 0) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid email or password' })
                }
            }

            const user = users[0]

            // Compare the provided password with the stored (hashed) password
            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid email or password' })
                }
            }

            // Successful login, you can return the user data or a token (e.g., JWT)
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Login successful', user: { email: user.email } })
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
