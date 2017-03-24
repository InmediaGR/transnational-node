'use strict';

const Constants = require('./constants').Constants;
const CustomerVaultResponse = require('./customerVaultResponse');
const request = require('request');
const logger = require('./logger').logger;
const config = require('./config').Config;
const ValidateResponse = require('./validateResponse');

const validateCard = (validationParams) => {
  return new Promise((resolve, reject) => {
    const validateOpts = {
      url: Constants.endpoint.sandbox,
      method: 'POST',
      timeout: config.timeout,
      form: validationParams
    };

    request(validateOpts, (error, response, body) => {
      if (error) {
        logger.error('TNCustomerVault[addAccount] - ERROR: ', error);
        reject(error);
      } else {
        const validationResponse = new ValidateResponse(body);
        if (validationResponse.success) {
          resolve(validationResponse);
        } else {
          reject(validationResponse);
        }
      }
    });
  });
}

class TNCustomerVault {

  static addCustomer(params) {
    if (!params) {
      throw new Error('TransNational[TNCustomerVault]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    requestParams.customer_vault = 'add_customer';
    requestParams.firstname = params.firstName;
    requestParams.lastname = params.lastName;
    requestParams.address1 = params.address1;
    requestParams.city = params.city;
    requestParams.state = params.state;
    requestParams.zip = params.zip;
    requestParams.email = params.email;
    requestParams.phone = params.phone;
    requestParams.billing_id = params.description;
    if (params.creditCard) {
      requestParams.ccnumber = params.creditCard.accountNumber;
      requestParams.ccexp = params.creditCard.expirationDate;
      requestParams.cvv = params.creditCard.cvv;
      requestParams.payment = 'creditcard';
    } else if (params.check) {
      requestParams.checkaba = params.check.routingNumber;
      requestParams.checkaccount = params.check.accountNumber;
      requestParams.checkname = params.check.nameOnAccount;
      requestParams.account_type = params.check.accountType;
      requestParams.account_holder_type = params.check.accountHolderType || 'personal';
      requestParams.payment = 'check';
    } else {
      throw new Error('TransNational[TNCustomerVault]: missing required parameter(s) - check or credit card information');
    }

    const addNewCustomer = () => {
      return new Promise((resolve, reject) => {
        const requestOpts = {
          url: Constants.endpoint.sandbox,
          method: 'POST',
          timeout: config.timeout,
          form: requestParams
        };

        request(requestOpts, (error, response, body) => {
          if (error) {
            logger.error('TNCustomerVault[addCustomer] - ERROR: ', error);
            reject(error);
          } else {
            resolve(new CustomerVaultResponse(body));
          }
        });
      });
    }

    if (params.creditCard) {
      // validate the card first
      const validateParams = Object.assign(
        {},
        requestParams,
        { customer_vault: null, billing_id: null },
        { type: 'validate', payment: 'creditcard' }
      );
      return validateCard(validateParams).then(addNewCustomer);
    } else {
      return addNewCustomer();
    }
  }

  static deleteCustomer(params) {
    if (!params) {
      throw new Error('TransNational[TNCustomerVault]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!params.customerVaultId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (customerVaultId)');
    }
    requestParams.customer_vault = 'delete_customer';
    requestParams.customer_vault_id = params.customerVaultId;

    return new Promise((resolve, reject) => {
      const requestOpts = {
        url: Constants.endpoint.sandbox,
        method: 'POST',
        timeout: config.timeout,
        form: requestParams
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('TNCustomerVault[deleteCustomer] - ERROR: ', error);
          reject(error);
        } else {
          resolve(new CustomerVaultResponse(body));
        }
      });
    });
  }

  static addAccount(params) {
    if (!params) {
      throw new Error('TransNational[TNCustomerVault]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!params.customerVaultId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (customerVaultId)');
    }
    requestParams.customer_vault = 'add_billing';
    requestParams.customer_vault_id = params.customerVaultId;
    requestParams.fistname = params.firstName;
    requestParams.lastname = params.lastName;
    requestParams.address1 = params.address1;
    requestParams.city = params.city;
    requestParams.state = params.state;
    requestParams.zip = params.zip;
    requestParams.email = params.email;
    if (!params.description) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (description)');
    }
    requestParams.billing_id = params.description;
    if (params.creditCard) {
      requestParams.ccnumber = params.creditCard.accountNumber;
      requestParams.ccexp = params.creditCard.expirationDate;
      requestParams.cvv = params.creditCard.cvv;
      requestParams.method = 'creditcard';
    } else if (params.check) {
      requestParams.checkaba = params.check.routingNumber;
      requestParams.checkaccount = params.check.accountNumber;
      requestParams.checkname = params.check.nameOnAccount;
      requestParams.account_type = params.check.accountType;
      requestParams.account_holder_type = params.check.accountHolderType || 'personal';
      requestParams.method = 'check';
    } else {
      throw new Error('TransNational[TNCustomerVault]: missing required parameter(s) - check or credit card information');
    }

    const addNewAccount = () => {
      return new Promise((resolve, reject) => {
        const addAccountOpts = {
          url: Constants.endpoint.sandbox,
          method: 'POST',
          timeout: config.timeout,
          form: requestParams
        };

        request(addAccountOpts, (error, response, body) => {
          if (error) {
            logger.error('TNCustomerVault[addAccount] - ERROR: ', error);
            reject(error);
          } else {
            const addAccountResponse = new CustomerVaultResponse(body);
            if (addAccountResponse.success) {
              resolve(addAccountResponse);
            } else {
              reject(addAccountResponse);
            }
          }
        });
      });
    }

    if (requestParams.method === 'creditcard') {
      // validate the card first
      const validateParams = Object.assign(
        {},
        requestParams,
        { customer_vault: null, billing_id: null }, // these aren't valid params for a validation request
        { type: 'validate', payment: 'creditcard', method: null }
      );
      return validateCard(validateParams).then(addNewAccount);
    } else {
      return addNewAccount();
    }
  }

  static deleteAccount(params) {
    if (!params) {
      throw new Error('TransNational[TNCustomerVault]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!params.customerVaultId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (customerVaultId)');
    }
    if (!params.billingId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (billingId)');
    }
    requestParams.customer_vault = 'delete_billing';
    requestParams.customer_vault_id = params.customerVaultId;
    requestParams.billing_id = params.billingId;

    return new Promise((resolve, reject) => {
      const requestOpts = {
        url: Constants.endpoint.sandbox,
        method: 'POST',
        timeout: config.timeout,
        form: requestParams
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('TNCustomerVault[delteAccount] - ERROR: ', error);
          reject(error);
        } else {
          const deleteAccountResponse = new CustomerVaultResponse(body);
          if (deleteAccountResponse.success) {
            resolve(deleteAccountResponse);
          } else {
            reject(deleteAccountResponse);
          }
        }
      });
    });
  }

  static updateAccount(params) {
    if (!params) {
      throw new Error('TransNational[TNCustomerVault]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!params.customerVaultId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (customerVaultId)');
    }
    if (!params.billingId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (billingId)');
    }
    requestParams.customer_vault = 'update_billing';
    requestParams.customer_vault_id = params.customerVaultId;
    requestParams.billing_id = params.billingId;
    if (params.creditCard) {
      if (params.creditCard.hasOwnProperty('accountNumber')) {
        requestParams.ccnumber = params.creditCard.accountNumber;
      }
      if (params.creditCard.hasOwnProperty('expirationDate')) {
        requestParams.ccexp = params.creditCard.expirationDate;
      }
      if (params.creditCard.hasOwnProperty('cvv')) {
        requestParams.cvv = params.creditCard.cvv;
      }
    } else if (params.check) {
      if (params.check.hasOwnProperty('routingNumber')) {
        requestParams.checkaba = params.check.routingNumber;
      }
      if (params.check.hasOwnProperty('accountNumber')) {
        requestParams.checkaccoung = params.check.accountNumber;
      }
      if (params.check.hasOwnProperty('nameOnAccount')) {
        requestParams.checkname = params.check.nameOnAccount;
      }
      if (params.check.hasOwnProperty('accountType')) {
        requestParams.account_type = params.check.accountType;
      }
      if (params.check.hasOwnProperty('accountHolderType')) {
        requestParams.account_holder_type = params.check.accountHolderType;
      }
    } else {
      throw new Error('TransNational[TNCustomerVault]: missing required parameter(s) - check or credit card information');
    }

    return new Promise((resolve, reject) => {
      const requestOpts = {
        url: Constants.endpoint.sandbox,
        method: 'POST',
        timeout: config.timeout,
        form: requestParams
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('TNCustomerVault[updateAccount] - ERROR: ', error);
          reject(error.message);
        } else {
          const updateAccountResponse = new CustomerVaultResponse(body);
          if (updateAccountResponse.success) {
            resolve(updateAccountResponse);
          } else {
            reject(updateAccountResponse);
          }
        }
      });
    });
  }

  static updateAccountPriority(params) {
    if (!params) {
      throw new Error('TransNational[TNCustomerVault]: missing params');
    }
    let requestParams = {};
    try {
      requestParams.username = Constants.credentials.username || params.credentials.username;
      requestParams.password = Constants.credentials.password || params.credentials.password;
    } catch(err) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!requestParams.username || !requestParams.password) {
      throw new Error('TransNational[TNCustomerVault]: missing credentials');
    }
    if (!params.customerVaultId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (customerVaultId)');
    }
    if (!params.billingId) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (billingId)');
    }
    if (!params.priority) {
      throw new Error('TransNational[TNCustomerVault]: missing parameter (priority)');
    }
    requestParams.customer_vault = 'update_billing';
    requestParams.customer_vault_id = params.customerVaultId;
    requestParams.billing_id = params.billingId;
    requestParams.priority = params.priority;

    return new Promise((resolve, reject) => {
      const requestOpts = {
        url: Constants.endpoint.sandbox,
        method: 'POST',
        timeout: config.timeout,
        form: requestParams
      };

      request(requestOpts, (error, response, body) => {
        if (error) {
          logger.error('TNCustomerVault[updateAccountPriority] - ERROR: ', error);
          reject(error);
        } else {
          const updateAccountResponse = new CustomerVaultResponse(body);
          if (updateAccountResponse.success) {
            resolve(updateAccountResponse);
          } else {
            reject(updateAccountResponse);
          }
        }
      });
    })
  }
}

module.exports = TNCustomerVault;
