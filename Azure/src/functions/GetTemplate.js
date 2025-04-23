const { app } = require('@azure/functions')
const cosmosClient = require('../CosmosClient')

const databaseId = process.env.COSMOS_DB_DATABASE_ID
const containerId = process.env.COSMOS_DB_CONTAINER_TEMPLATES

app.http('getTemplate', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'templates/{template_id}',
    handler: async (request, context) => {
        try {
            // Get a reference to the database and container
            const database = cosmosClient.database(databaseId)
            const container = database.container(containerId)
            const { template_id } = request.params

            // Define a query to filter products
            let query =
                'SELECT c.id, c.name, c.price, c.producer, c.discount, c.current from c WHERE c.id = @Template'
            const params = [{ name: `@Template`, value: template_id }]
            const querySpec = {
                query,
                parameters: params
            }

            const { resources } = await container.items
                .query(querySpec)
                .fetchAll()

            const template = resources[0]
            const createdTemplate = { id: template_id, current: template.current || false, items: { name: template.name, price: template.price, producer: template.producer, discount: template.discount } }
            context.log(createdTemplate)
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ template: createdTemplate })
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
