const { success, failure } = require('./models/response');
const Helper = require('./helper');
const Dialogflow = require('./models/dialogflow');

module.exports.import = async (event, context, callback) => {
  try {
    const { body } = await Helper.parser.parseEvent(event);
    const { file } = body;
    const data = await Helper.csv.stringToRow(file.toString());
    Dialogflow.importData(data);
    callback(null, success({ result: true }));
  } catch (err) {
    callback(null, failure({ error: true }));
  }
};
