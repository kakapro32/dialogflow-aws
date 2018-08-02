const { success, failure } = require('./models/response');

module.exports.test = async (event, context, callback) => {
  try {
    callback(null, success({ result: true }));
  } catch (err) {
    callback(null, failure({ error: true }));
  }
};
