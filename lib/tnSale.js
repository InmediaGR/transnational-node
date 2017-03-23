'use strict';

const RequestBase = require('./requestBase');
const request = require('request');
const SaleResponse = require('./saleResponse');
const Constants = require('./constants').Constants;
const logger = require('./logger').logger;
const config = require('./config').Config;

class TNSale extends RequestBase {
  constructor(params) {
    if (!params) {
      throw new Error('TransNational[TNSale]: missing params');
    }
    super(params);
    try {
      this.username = Constants.credentials.username || params.credentials.username;
      this.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNSale]: missing credentials');
    }
    if (!this.username || !this.password) {
      throw new Error('TransNational[TNSale]: missing credentials');
    }
    this.customer = {};
    this.customer.firstname = params.firstName;
    this.customer.lastname = params.lastName;
    this.customer.address1 = params.address1;
    this.customer.city = params.city;
    this.customer.state = params.state;
    this.customer.zip = params.zip;
    this.customer.email = params.email;
    this.customer.phone = params.phone;
    this.sale = {};
    this.sale.amount = params.amount;
    this.sale.orderdescription = params.description;
    this.sale.ipAddress = params.ipAddress;
    this.sale.orderid = params.orderId;
    this.sale.type = 'sale';
    if (params.creditCard) {
      this.creditCard = {};
      this.creditCard.ccnumber = params.creditCard.accountNumber;
      this.creditCard.ccexp = params.creditCard.expirationDate; // MMYY
      this.creditCard.cvv = params.creditCard.cvv;
      this.creditCard.payment = 'creditcard';
    } else if (params.check) {
      this.check = {};
      this.check.checkaba = params.check.routingNumber;
      this.check.checkaccount = params.check.accountNumber;
      this.check.checkname = params.check.nameOnAccount;
      this.check.account_type = params.check.accountType; // checking / savings
      this.check.account_holder_type = params.check.accountHolderType || 'personal'; // personal / business
      this.check.payment = 'check';
    } else {
      throw new Error('TransNational[TNSale]: missing required parameter(s) - check or credit card information');
    }
  }

  execute() {
    return new Promise((resolve, reject) => {
      const params = Object.assign(
        {},
        this.requestCredentials,
        this.customer,
        this.sale,
        (this.creditCard ? this.creditCard : this.check)
      );

      logger.debug('REQUEST: ', JSON.stringify(params, 2, null));

      const requestOpts = {
        url: this.endpoint,
        method: 'POST',
        timeout: config.timeout,
        form: params
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('ERROR: ', error);
          reject(error);
        } else {
          resolve(new SaleResponse(body));
        }
      })
    });
  }

  static customerVaultSale(params) {
    if (!params) {
      throw new Error('TransNational[TNSale]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNSale]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNSale]: missing credentials');
    }
    if (!params.customerVaultId) {
      throw new Error('TransNational[TNSale]: missing parameter (customerVaultId)');
    }
    if (!params.billingId) {
      throw new Error('TransNational[TNSale]: missing parameter (billingId)');
    }
    if (!params.amount) {
      throw new Error('TransNational[TNSale]: missing parameter (amount)');
    }
    requestParams.customer_vault_id = params.customerVaultId;
    requestParams.billing_id = params.billingId;
    requestParams.amount = params.amount;
    requestParams.type = 'sale';

    return new Promise((resolve, reject) => {
      const requestOpts = {
        url: Constants.endpoint.sandbox,
        method: 'POST',
        timeout: config.timeout,
        form: requestParams
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('TNSale[customerVaultSale]: ', error);
          reject(error);
        } else {
          resolve(new SaleResponse(body));
        }
      });
    });
  }
}

module.exports = TNSale;
