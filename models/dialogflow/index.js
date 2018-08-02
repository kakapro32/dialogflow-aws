const lib = require('./lib');

const importData = async () => {
  const result = await lib.batchUpdateIntents([]);
  return result;
};

module.exports = {
  importData,
};
