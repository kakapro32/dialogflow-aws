const { success, failure } = require('./models/response');
const Helper = require('./helper');
// const Dialogflow = require('./models/dialogflow');
const ElasticSearch = require('./models/elasticsearch/lib');

module.exports.import = async (event, context, callback) => {
  try {
    const { body } = await Helper.parser.parseEvent(event);
    const { page_id: pageId, file, type } = body;
    const index = `${pageId}_${type}`;
    const data = await Helper.csv.stringToRow(file.toString());
    const bulkBody = ElasticSearch.generateBulkBody(index, type, data);
    if (bulkBody.length === 0) {
      callback(null, failure(JSON.stringify({ error: 'empty csv data' })));
    }
    await ElasticSearch.initIndex(index, type);
    const result = await ElasticSearch.client.bulk({ body: bulkBody });
    const errorCount = ElasticSearch.countError(result);
    callback(
      null,
      success({
        success: true,
        message: `Successfully indexed ${data.length - errorCount} out of ${data.length} items`
      }),
    );
    callback(null, success({ result: true }));
  } catch (err) {
    console.log(err);
    callback(null, failure({ error: true }));
  }
};


module.exports.search = async (event, context, callback) => {
  try {
    const {
      page_id: pageId,
      q,
      type
    } = event.queryStringParameters;
    const index = `${pageId}_${type}`;
    const data = await ElasticSearch.getAnswers(index, type, q);
    callback(null, success({ intent: 'default', data }));
  } catch (err) {
    callback(null, failure({ error: true }));
  }
};

module.exports.searchFilter = async (event, context, callback) => {
  try {
    const {
      page_id: pageId,
      q,
      type
    } = event.queryStringParameters;
    const index = `${pageId}_${type}`;
    const data = await ElasticSearch.getAnswers(index, type, q);
    callback(null, success({ intent: 'default', data }));
  } catch (err) {
    callback(null, failure({ error: true }));
  }
};

