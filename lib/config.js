'use strict';

const p = require('process');
const loggingEnabled = p.env.TN_ENABLE_LOG == 'true';

const config = {
  'timeout': 120000,
  'logger': {
    'enabled': loggingEnabled,
    'location': './',
    'level': 'debug' // levels - error, warn, info, verbose, debug
  }
};

module.exports.Config = config;
