'use strict';

const request = require('request');
const CaptureResponse = require('./captureResponse');
const Constants = require('./constants').Constants;
const logger = require('./logger').logger;
const config = require('./config').Config;

class TNCapture {
  static captureTransaction(params) {
    if (!params) {
      throw new Error('TransNational[TNCapture]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNCapture]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNCapture]: missing credentials');
    }
    if (!params.transactionId) {
      throw new Error('TransNational[TNCapture]: missing parameter (transactionId)');
    }
    if (!params.amount) {
      throw new Error('TransNational[TNCapture]: missing parameter (amount)');
    }
    requestParams.type = 'capture';
    requestParams.transaction_id = params.transactionId;
    requestParams.amount = params.amount;

    return new Promise((resolve, reject) => {
      const requestOpts = {
        url: Constants.endpoint.sandbox,
        method: 'POST',
        timeout: config.timeout,
        form: requestParams
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('TNCapture[captureTransaction] - ERROR: ', error);
          reject(error);
        } else {
          const captureResponse = new CaptureResponse(body);
          if (captureResponse.success) {
            resolve(captureResponse);
          } else {
            reject(captureResponse);
          }
        }
      });
    });
  }
}

module.exports = TNCapture;
