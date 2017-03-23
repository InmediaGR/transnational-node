'use strict';

const winston = require('winston');
const config = require('./config').Config;

let logger = null;
const filterFields = [
  'ccnumber', 'cvv'
];

function isJson(str) {
  try {
    JSON.parse(str);
  } catch(e) {
    return false;
  }
  return true;
}

function maskFilteredFields(msg) {
  if (msg instanceof Object) {
    let prop;
    for (prop in msg) {
      let shouldBeFiltered = (filterFields.indexOf(prop) > -1);

      if (shouldBeFiltered === true) {
        msg[prop] = new Array(msg[prop].length + 1).join('*');
      } else if (msg.hasOwnProperty(prop)) {
        maskFilteredFields(msg[prop]);
      }
    }
  }

  return JSON.stringify(msg);
}

if (config.logger.enabled === true) {
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        filename: config.logger.location + '/transnational-api.log',
        level: config.logger.level
      })
    ]
  });

  logger.filters.push((level, msg, timestamp) => {
    if (isJson(msg)) {
      try {
        return maskFilteredFields(JSON.parse(msg));
      } catch(e) {
        return 'Error while logging the message.';
      }
    } else {
      return msg;
    }
  })
} else {
  logger = new (winston.Logger)({
    transports: []
  });
}

module.exports.logger = logger;
