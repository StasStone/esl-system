const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_TEMPLATES

app.http('getTemplate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'products',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { template_id } = await request.json()

            context.log(template_id)

            // Define a query to filter products
            let query =
                'SELECT c.id, c.name, c.price, c.discount, c.producer, c.labels FROM c WHERE c.template_id = @Template'
            const params = [{ name: `@Template`, value: template_id }]
            const querySpec = {
                query,
                parameters: params
            }

            const template = await container.items
                .query(querySpec)
                .fetchAll()
            context.log(template)

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ template })
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
