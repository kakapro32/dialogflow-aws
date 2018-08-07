
const elasticsearch = require('elasticsearch');
const { constant } = require('../../helper');

const settings = {
  index: {
    analysis: {
      filter: {},
      analyzer: {
        keyword_analyzer: {
          filter: ['lowercase', 'asciifolding', 'trim'],
          char_filter: [],
          type: 'custom',
          tokenizer: 'keyword',
        },
        edge_ngram_analyzer: {
          filter: ['lowercase'],
          tokenizer: 'edge_ngram_tokenizer',
        },
        edge_ngram_search_analyzer: {
          tokenizer: 'lowercase',
        },
      },
      tokenizer: {
        edge_ngram_tokenizer: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 5,
          token_chars: ['letter'],
        },
      },
    },
  },
};

const bodyConfig = {
  faq: {
    settings,
    mappings: {
      faq: {
        properties: {
          question: {
            type: 'text',
            fields: {
              keywordstring: {
                type: 'text',
                analyzer: 'keyword_analyzer',
              },
              edgengram: {
                type: 'text',
                analyzer: 'edge_ngram_analyzer',
                search_analyzer: 'edge_ngram_search_analyzer',
              },
              completion: {
                type: 'completion',
                contexts: [
                  {
                    name: 'language',
                    type: 'category',
                    path: 'language',
                  },
                ],
              },
            },
            analyzer: 'standard',
          },
          answer: {
            type: 'text',
            fields: {
              keywordstring: {
                type: 'text',
                analyzer: 'keyword_analyzer',
              },
              edgengram: {
                type: 'text',
                analyzer: 'edge_ngram_analyzer',
                search_analyzer: 'edge_ngram_search_analyzer',
              },
              completion: {
                type: 'completion',
                contexts: [
                  {
                    name: 'language',
                    type: 'category',
                    path: 'language',
                  },
                ],
              },
            },
            analyzer: 'standard',
          },

        },
      },
    },
  },
};

const client = new elasticsearch.Client({
  host: constant.urlES,
  log: 'trace',
});

module.exports = {
  bodyConfig,
  client,
};
