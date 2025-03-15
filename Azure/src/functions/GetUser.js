const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_USERS

app.http('getUser', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'users/{user_id}',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { user_id } = request.params

            context.log(user_id)

            // Define a query to find the user by email
            let query = `SELECT c.email FROM c WHERE c.user_id = @userId`

            // Execute the query with the email parameter
            const { resources: users } = await container.items
                .query(query, { parameters: [{ name: '@userId', value: user_id }] })
                .fetchAll()

            context.log(users)

            // If no user is found, return an error
            if (users.length === 0) {
                return {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'User not found' })
                }
            }
            const user = users[0]

            return {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user })
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
