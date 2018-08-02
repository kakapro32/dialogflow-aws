const buildResponse = (statusCode, body, headers) => ({
  statusCode,
  headers: headers || {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
});
const success = (body, headers) => buildResponse(200, body, headers);

const failure = (body, headers) => buildResponse(500, body, headers);

module.exports = {
  success,
  failure,
};
