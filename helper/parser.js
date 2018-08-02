const Busboy = require('busboy');

const getContentType = (event) => {
  const contentType = event.headers['content-type'];
  if (!contentType) {
    return event.headers['Content-Type'];
  }
  return contentType;
};

const parseEvent = event => new Promise((resolve, reject) => {
  const eventLocal = event;
  const busboy = new Busboy({
    headers: {
      'content-type': getContentType(eventLocal),
    },
  });

  const result = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    file.on('data', (data) => {
      result.file = data;
    });

    file.on('end', () => {
      result.filename = filename;
      result.contentType = mimetype;
    });
  });

  busboy.on('field', (fieldname, value) => {
    result[fieldname] = value;
  });

  busboy.on('error', error => reject(new Error(`Parse error: ${error}`)));
  busboy.on('finish', () => {
    eventLocal.body = result;
    resolve(eventLocal);
  });

  busboy.write(eventLocal.body, eventLocal.isBase64Encoded ? 'base64' : 'binary');
  busboy.end();
});

module.exports = {
  parseEvent,
};
