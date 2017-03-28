'use strict';

const logger = require('./logger').logger;

const responseCodes = {
  '100': 'Transaction was approved',
  '200': 'Transaction was Declined by Processor',
  '201': 'Do not honor',
  '202': 'Insufficient Funds',
  '203': 'Over Limit',
  '204': 'Transaction not allowed',
  '220': 'Incorrect payment data',
  '223': 'Expired card',
  '224': 'Invalid expiration date',
  '225': 'Inavalid card security code',
  '251': 'Lost card',
  '252': 'Stolen card',
  '253': 'Fraudulant card',
  '260': 'Declined with further instructions available', // see response text
  '300': 'Transaction was rejected by gateway',
  '400': 'Transaction error returned by processor',
  '420': 'Communication error',
  '421': 'Communication error with Issuer',
  '430': 'Duplicate transaction at processor',
  '461': 'Unsupported card type',
};

class ResponseBase {
  constructor(params) {
    this.params = this.parseResponse(params);
    this.authCode = this.params.authcode || null;
    this.transactionId = this.params.transactionid || null;
    this.avsResponse = this.params.avsresponse || null;
    this.cvvResponse = this.params.cvvresponse || null;
    this.orderId = this.params.orderid || null;
    this.response = this.params.response || null;
    this.responseText = this.params.responsetext || null;
    this.responseCode = this.params.response_code || null;
    this.type = this.params.type || null;
    this.success = this.response === '1';
    this.responseCodeDescription = this.getResponseCodeDescription(this.params.response_code);
  }

  parseResponse(response) {
    let obj = {};
    response.split('&').forEach(param => {
      try {
        const parts = param.split('=');
        obj[parts[0]] = parts[1];
      } catch (error) {
        // ignore
      }
    });
    return obj;
  }

  getResponseCodeDescription(responseCode) {
    try {
      return responseCodes[responseCode];
    } catch (err) {
      logger.error('Response code not found: ', responseCode);
      return null;
    }
  }
}

module.exports = ResponseBase;
