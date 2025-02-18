const { CosmosClient } = require('@azure/cosmos')

// Retrieve CosmosDB configuration from environment variables
const endpoint = process.env.COSMOS_DB_ENDPOINT
const key = process.env.COSMOS_DB_KEY

// Create and export a single instance of CosmosClient
const cosmosClient = new CosmosClient({ endpoint, key })

module.exports = cosmosClient