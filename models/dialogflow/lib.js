const { intentsClient, sessionClient } = require('./config');

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionId = 'quickstart-session-id';
const batchUpdateIntents = (intents) => {
  const agentPath = intentsClient.projectAgentPath(projectId);
  return intentsClient
    .batchUpdateIntents({
      parent: agentPath,
      intentView: 'INTENT_VIEW_FULL',
      intentBatchInline: {
        intents,
      },
    })
    .then((responses) => {
      const operation = responses[0];
      return operation;
    })
    .then((responses) => {
      const result = responses[0];
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};
const listIntents = () => {
  const projectAgentPath = intentsClient.projectAgentPath(projectId);

  const request = {
    parent: projectAgentPath,
  };

  return intentsClient
    .listIntents(request)
    .then(responses => responses[0])
    .catch((err) => {
      console.error('Failed to list intents:', err);
    });
};

const deleteIntent = (intent) => {
  const request = { name: intent.name };
  return intentsClient
    .deleteIntent(request)
    .then(() => {
      console.log(`Intent ${intent.displayName} deleted`);
    })
    .catch((err) => {
      console.error(`Failed to delete intent ${intent.displayName}:`, err);
    });
};

const detectIntent = (query, languageCode = 'en-Us') => {
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode,
        intentView: 'INTENT_VIEW_FULL',
      },
    },
  };

  return new Promise((resolve, reject) => {
    sessionClient
      .detectIntent(request)
      .then((responses) => {
        console.log('Detected intent');
        console.log(JSON.stringify(responses));
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);
        if (result.intent) {
          console.log(`  Intent: ${result.intent.displayName}`);
          resolve(result);
        } else {
          console.log('  No intent matched.');
          resolve(false);
        }
      })
      .catch((err) => {
        console.error('ERROR:', err);
        reject(err);
      });
  });
};

module.exports = {
  batchUpdateIntents,
  listIntents,
  deleteIntent,
  detectIntent,
};
