'use strict';

const config = {
  'timeout': 120000,
  'logger': {
    'enabled': true,
    'location': './',
    'level': 'debug' // levels - error, warn, info, verbose, debug
  }
};

module.exports.Config = config;
