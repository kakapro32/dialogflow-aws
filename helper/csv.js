

const csv = require('csvtojson');
const { zipObject } = require('lodash');

const formatData = (data) => {
  if (data.length === 0) {
    return [];
  }
  const headers = data[0];
  const result = [];
  for (let i = 1; i < data.length; i += 1) {
    const item = data[i];
    result.push(zipObject(headers, item));
  }
  return result;
};

const stringToRow = csvStr => new Promise((resolve, reject) => {
  csv({
    noheader: true,
    output: 'csv',
  })
    .fromString(csvStr)
    .then((csvRow) => {
      resolve(formatData(csvRow));
    })
    .catch((error) => {
      reject(new Error(`Parse error: ${error}`));
    });
});


module.exports = {
  stringToRow,
};
