const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

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
            const { email, password } = await request.json()


            const hashedPassword = await new Promise((resolve, reject) => {
                bcrypt.hash(user.password, null, null, (err, result) => {
                    if (err) reject(err)
                    resolve(result)
                })
            })

            const newUser = {
                ...user,
                password: hashedPassword,
                created_at: "today"
            }

            // Execute the query with the email parameter
            const { resources: createdUser } = await container.items.upsert(newUser)

            context.log(createdUser)
            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createdUser)
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
