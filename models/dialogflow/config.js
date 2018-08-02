const dialogflow = require('dialogflow');

const intentsClient = new dialogflow.IntentsClient();
const sessionClient = new dialogflow.SessionsClient();
const entityTypesClient = new dialogflow.EntityTypesClient();
const agentsClient = new dialogflow.AgentsClient();
module.exports = {
  intentsClient,
  sessionClient,
  entityTypesClient,
  agentsClient,
};
