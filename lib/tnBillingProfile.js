'use strict';

const Constants = require('./constants').Constants;
const request = require('request');
const logger = require('./logger').logger;
const config = require('./config').Config;
const SaleResponse = require('./saleResponse');

class TNBillingProfile {
  static authorizeAccount(params) {
    if (!params) {
      throw new Error('TransNational[TNBillingProfile]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNBillingProfile]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNBillingProfile]: missing credentials');
    }
    if (!params.customerVaultId) {
      throw new Error('TransNational[TNBillingProfile]: missing parameter (customerVaultId)');
    }
    if (!params.billingId) {
      throw new Error('TransNational[TNBillingProfile]: missing parameter (billingId)');
    }
    if (!params.amount) {
      throw new Error('TransNational[TNBillingProfile]: missing parameter (amount)');
    }
    requestParams.customer_vault_id = params.customerVaultId;
    requestParams.billing_id = params.billingId;
    requestParams.amount = params.amount;
    requestParams.type = 'auth';

    return new Promise((resolve, reject) => {
      const requestOpts = {
        url: Constants.endpoint.sandbox,
        method: 'POST',
        timeout: config.timeout,
        form: requestParams
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('TNBillingProfile[authorizeAccount] - ERROR: ', error);
          reject(error);
        } else {
          const authorizeAccountResponse = new SaleResponse(body);
          if (authorizeAccountResponse.success) {
            resolve(authorizeAccountResponse);
          } else {
            reject(authorizeAccountResponse);
          }
        }
      });
    });
  }
}

module.exports = TNBillingProfile;
