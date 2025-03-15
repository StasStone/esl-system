const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')
const bcrypt = require('bcrypt-nodejs')
const { v4 } = require('uuid')
const jwt = require('jsonwebtoken')
const fs = require('fs')

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
            const jwtPrivate = fs.readFileSync('/Users/stanislau/Developer/esl-system/Azure/jwtRS256.key', 'utf8')

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

            const token = jwt.sign({ userId: newUser.user_id }, jwtPrivate, { algorithm: "RS256", expiresIn: "1h" })

            if (!createdUser || !token) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Duplicate email' })
                }
            }

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Signup successful', token })
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
