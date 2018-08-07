const { client, bodyConfig } = require('./config');
const {
  getExportOptions,
  processSuggestResult,
  getBody,
  generateBulkBody,
  countError,
  buildQuery,
  getSourceData
} = require('./helper');

const find = (index, type, body) => new Promise((resolve, reject) => {
  client
    .search({ index, type, body })
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      console.error('ElasticSearch.find error: ', err);
      reject(err);
    });
});

const findAll = async (index, type, language, isBot) => {
  try {
    const options = getExportOptions(index, type, language);
    const response = await client.search(options);
    const { hits } = response.hits;
    if (typeof hits[0] === 'undefined') {
      return Promise.reject(new Error('emty data'));
    }
    return Promise.resolve(getSourceData(hits, isBot));
  } catch (err) {
    console.log(`ElasticSearch.findAll error: ${err}`);
    return Promise.reject(err);
  }
};

const initIndex = async (index, type) => {
  const indexExist = await client.indices.exists({ index });
  return indexExist
    ? Promise.resolve(true)
    : client.indices.create({ index, body: bodyConfig[type] });
};

const getAnswers = async (index, type, queryResult) => {
  try {
    const result = await client.search({ index, type, body: getBody(queryResult) });
    return getSourceData(result.hits.hits);
  } catch (err) {
    console.log(err);
    return [];
  }
};

module.exports = {
  getAnswers,
  buildQuery,
  initIndex,
  countError,
  processSuggestResult,
  generateBulkBody,
  find,
  findAll,
  getBody,
  client
};
