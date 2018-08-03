const DOMAINS = {
  dev: 'http://localhost:9200',
  staging: 'https://search-elasticsearch-ldecoiqsizmt5q5jdp527oohve.us-east-2.es.amazonaws.com',
};

module.exports = {
  urlES: DOMAINS[process.env.APP_ENV],
};
