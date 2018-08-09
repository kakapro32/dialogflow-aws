const {
  map, filter, isEmpty, forEach, unionBy
} = require('lodash');
const bodybuilder = require('bodybuilder');
const esb = require('elastic-builder');
const processSuggestResult = (result, isBot) => {
  let aSuggest = [];
  let qSuggest = [];
  let data = result.hits.hits;
  try {
    if (typeof result.suggest !== 'undefined') {
      aSuggest = result.suggest['a-suggest']
        ? result.suggest['a-suggest'][0].options
        : [];
      qSuggest = result.suggest['q-suggest']
        ? result.suggest['q-suggest'][0].options
        : [];
      data = unionBy(qSuggest, result.hits.hits, aSuggest, '_id');
    }
    return getSourceData(data, isBot);
  } catch (err) {
    console.log(err);
    return [];
  }
};

function getSourceData(data, isBot) {
  let sourceData = map(data, '_source');
  if (isBot === 1) {
    sourceData = filter(sourceData, (item) => item.is_bot === '1');
  }
  return sourceData;
}

const getBody = (query, language) => {
  const body = {
    size: 100,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            type: 'best_fields',
            cutoff_frequency: 0.0007,
            operator: 'and',
            fields: ['question^2', 'answer']
          }
        },
        should: {
          multi_match: {
            query,
            type: 'phrase',
            fields: ['question^2', 'answer']
          }
        }
      }
    },
    suggest: {
      'q-suggest': {
        prefix: query,
        completion: {
          field: 'question.completion',
          contexts: {
            language: ['en']
          }
        }
      },
      'a-suggest': {
        prefix: query,
        completion: {
          field: 'answer.completion',
          contexts: {
            language: ['en']
          }
        }
      }
    }
  };
  return body;
};

const buildParams = (params) => {
  const r = [];
  forEach(params, (value, key) => {
    if (typeof value === 'object') {
      forEach(value, (v, k) => {
        const obj = {};
        obj[`${key}.${k}`] = v;
        r.push(obj);
      });
    } else {
      const obj = {};
      obj[key] = value;
      r.push(obj);
    }
  });
  return r;
};

const generateBulkBody = (index, type, data) => {
  if (data.length === 0) {
    return [];
  }
  const bulkBody = [];
  data.forEach((item) => {
    bulkBody.push({
      index: {
        _id: item.id,
        _index: index,
        _type: type
      }
    });
    if (item.metadata) {
      item.metadata = JSON.parse(item.metadata);
    }
    bulkBody.push(item);
  });
  return bulkBody;
};

const countError = (response) => {
  let errorCount = 0;
  response.items.forEach((item) => {
    if (item.index && item.index.error) {
      errorCount += 1;
    }
  });
  return errorCount;
};

function buildQuery(params) {
  const esb = require('elastic-builder');
  const buildShould = esb => {
    const arrShould = [];
    forEach(params, (value, key) => {
      arrShould.push(esb.termsQuery('metadata.' + key, value));
    });
    return arrShould;
  };
  const requestBody = esb.requestBodySearch()
    .query(
      esb.nestedQuery()
        .path('metadata')
        .query(
          esb.boolQuery.should(buildShould(esb))
        )
    ).size(100);
  return requestBody.toJSON;
}

function getExportOptions(index, type, language) {
  return language
    ? {
      index,
      type,
      body: {
        size: 10000,
        query: {
          match: {
            language
          }
        }
      }
    }
    : { index, type, body: { size: 10000 } };
}

module.exports = {
  getSourceData,
  getExportOptions,
  buildQuery,
  getBody,
  countError,
  generateBulkBody,
  processSuggestResult,
  buildParams
};
