const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')
const bcrypt = require('bcrypt-nodejs')
const { v4 } = require('uuid')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_USERS
const jwtPrivate = fs.readFileSync('/Users/stanislau/Developer/esl-system/Azure/jwtRS256.key', 'utf8')

app.http('signup', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'signup',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const { email, password, store_id } = await request.json()

            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(password, null, null, (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                })
            })

            const newUser = {
                email,
                id: v4(),
                store_id,
                password: hashedPassword,
                created_at: "today"
            }

            let query = 'SELECT c.email FROM c WHERE c.email = @Email'

            const { resources: users } = await container.items
                .query(query, { parameters: [{ name: '@Email', value: email }] })
                .fetchAll()

            if (users.length) {
                return {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'Duplicate email' })
                }
            }

            await container.items.upsert(newUser)

            const token = jwt.sign({ userId: newUser.id }, jwtPrivate, { algorithm: "RS256", expiresIn: "1h" })

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
