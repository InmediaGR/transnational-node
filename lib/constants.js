'use strict';

const p = require('process');

const constants = {
  endpoint: {
    sandbox: 'https://secure.networkmerchants.com/api/transact.php',
    production: 'https://secure.networkmerchants.com/api/transact.php',
  },
  credentials: {
    username: p.env.TN_USER,
    password: p.env.TN_PASSWORD,
  },
  testCredentials: {
    credentials: {
      username: 'demo',
      password: 'password,'
    },
  },
  testAccounts: {
    creditCardVisa: {
      accountNumber: '4111111111111111',
      expirationDate: '1018',
      cvv: '999',
    },
    creditCardMasterCard: {
      accountNumber: '5431111111111111',
      expirationDate: '1120',
      cvv: '999',
    },
    achAccounts: {
      checking: {
        accountNumber: '123123123',
        routingNumber: '123123123',
        nameOnAccount: 'Johnny Test',
        accountType: 'checking',
        accountHolderType: 'personal',
      },
      savings: {
        accountNumber: '123123123',
        routingNumber: '123123123',
        nameOnAccount: 'Johnny Test',
        accountType: 'savings',
        accountHolderType: 'personal',
      },
    },
  },
};

module.exports.Constants = constants;
