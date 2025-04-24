const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_TEMPLATES

app.http('getTemplates', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'templates',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)

            const query = 'SELECT c.id, c.title from c WHERE 1=1'

            const { resources: templates } = await container.items
                .query(query)
                .fetchAll()

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ templates })
            }
        } catch (error) {
            return {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'Error retrieving templates' })
            }
        }
    }
})
