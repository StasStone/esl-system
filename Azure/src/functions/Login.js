const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_USERS
const jwtPrivate = fs.readFileSync('/Users/stanislau/Developer/esl-system/Azure/jwtRS256.key', 'utf8')

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
            let query = 'SELECT c.email, c.password, c.id FROM c WHERE 1=1'

            // Execute the query with the email parameter
            const { resources: users } = await container.items
                .query(query)
                .fetchAll()

            const filteredUsers = users.filter((user) => user.email === email)

            // If no user is found, return an error
            if (filteredUsers.length === 0) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid email or password' })
                }
            }

            const user = filteredUsers[0]

            // Compare the provided password with the stored (hashed) password

            const passwordMatch = await new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, match) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(match)
                    }
                })
            })

            if (!passwordMatch) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid email or password' })
                }
            }

            // Successful login, return JWT token
            const token = jwt.sign({ userId: user.id }, jwtPrivate, { algorithm: "RS256", expiresIn: "1h" })

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Login successful', token })
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
