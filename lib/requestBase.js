'use strict';

const request = require('request');
const logger = require('./logger').logger;
const constants = require('./constants').Constants;
const config = require('./config').Config;

class RequestBase {
  constructor(params) {
    try {
      this.requestCredentials = {
        username: constants.credentials.username || params.credentials.username,
        password: constants.credentials.password || params.credentials.password,
      }
    } catch(err) {
      throw new Error('TransNational[RequestBase]: missing credentials');
    }
    if (!this.requestCredentials.username || !this.requestCredentials.password) {
      throw new Error('TransNational[RequestBase]: missing credentials');
    }
    this.endpoint = constants.endpoint.sandbox;
  }

  // execute() {
  //   return new Promise((resolve, reject) => {
  //     const params = Object.assign(
  //       {},
  //       this.requestCredentials,
  //       this.customer,
  //       this.sale,
  //       (this.creditCard ? this.creditCard : this.check)
  //     );
  //
  //     // logger.debug('REQUEST: ', JSON.stringify(params, 2, null));
  //
  //     const requestOpts = {
  //       url: this.endpoint,
  //       method: 'POST',
  //       timeout: config.timeout,
  //       form: params
  //     };
  //
  //     request(requestOpts, (error, response, body) => {
  //       if (error) {
  //         logger.error('ERROR: ', error);
  //         reject(error);
  //       } else {
  //         const parsedResponse = this.parseResponse(body);
  //         // logger.debug('RESPONSE: ', JSON.stringify(parsedResponse));
  //         resolve(parsedResponse);
  //       }
  //     })
  //   });
  // }
}

module.exports = RequestBase;
