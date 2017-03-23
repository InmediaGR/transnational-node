'use strict';

const TNSale = require('../../lib/tnSale');
const visa = require('../../lib/constants').Constants.testAccounts.creditCardVisa;
const testAchAccounts = require('../../lib/constants').Constants.testAccounts.achAccounts;
const credentialParams = require('../../lib/constants').Constants.testCredentials;

const customerParams = {
  firstName: 'Johnny',
  lastName: 'Test',
  address1: '1500 Airport Rd',
  city: 'Normal',
  state: 'IL',
  zip: '61761',
  email: 'developer@example.com',
  phone: '2125551212',
};

const achCheckingParams = testAchAccounts.checking;
const achSavingsParams = testAchAccounts.savings;

const saleParams = {
  amount: '1.00',
  description: 'test sale',
  orderId: 1234,
};

function constructCreditCardParams() {
  return Object.assign(
    {},
    customerParams,
    saleParams,
    credentialParams,
    { creditCard: visa }
  );
}

function constructAchParams(accountType) {
  return Object.assign(
    {},
    customerParams,
    saleParams,
    credentialParams,
    { check: (accountType === 'checking' ? achCheckingParams : achSavingsParams) }
  );
}

function constructCreditCardSale() {
  return new TNSale(constructCreditCardParams());
}

function constructCheckingAccountSale() {
  return new TNSale(constructAchParams('checking'));
}

function constructSavingsAccountSale() {
  return new TNSale(constructAchParams('savings'));
}

function constructEmptySale() {
  return new TNSale({});
}

describe('constructing a TNSale object', () => {
  test('constructs a TNSale object', () => {
    const sale = new TNSale(constructCreditCardParams());
    expect(sale).not.toBeNull();
  });

  test('constructs a TNSale with valid customer information', () => {
    const sale = constructCreditCardSale();
    expect(sale.customer.firstname).toBe(customerParams.firstName);
    expect(sale.customer.lastname).toBe(customerParams.lastName);
    expect(sale.customer.address1).toBe(customerParams.address1);
    expect(sale.customer.city).toBe(customerParams.city);
    expect(sale.customer.state).toBe(customerParams.state);
    expect(sale.customer.zip).toBe(customerParams.zip);
    expect(sale.customer.email).toBe(customerParams.email);
    expect(sale.customer.phone).toBe(customerParams.phone);
  });

  test('constructs a TNSale with valid credentials', () => {
    const sale = constructCreditCardSale();
    expect(sale.username).toBe(credentialParams.credentials.username);
    expect(sale.password).toBe(credentialParams.credentials.password);
  });

  test('constructs a TNSale with valid sales information', () => {
    const sale = constructCreditCardSale();
    expect(sale.sale.amount).toBe(saleParams.amount);
    expect(sale.sale.orderdescription).toBe(saleParams.description);
    expect(sale.sale.orderid).toBe(saleParams.orderId);
  });

  test('constructs a TNSale with valid credit card information', () => {
    const sale = constructCreditCardSale();
    expect(sale.creditCard.ccnumber).toBe(visa.accountNumber);
    expect(sale.creditCard.ccexp).toBe(visa.expirationDate);
    expect(sale.creditCard.cvv).toBe(visa.cvv);
  });

  test('constructs a TNSale with valid checking accoung information', () => {
    const sale = constructCheckingAccountSale();
    expect(sale.check.checkaccount).toBe(achCheckingParams.accountNumber);
    expect(sale.check.checkaba).toBe(achCheckingParams.routingNumber);
    expect(sale.check.checkname).toBe(achCheckingParams.nameOnAccount);
    expect(sale.check.account_type).toBe(achCheckingParams.accountType);
    expect(sale.check.account_holder_type).toBe(achCheckingParams.accountHolderType);
  });

  test('constructs a TNSale with valid savings accoung information', () => {
    const sale = constructSavingsAccountSale();
    expect(sale.check.checkaccount).toBe(achSavingsParams.accountNumber);
    expect(sale.check.checkaba).toBe(achSavingsParams.routingNumber);
    expect(sale.check.checkname).toBe(achSavingsParams.nameOnAccount);
    expect(sale.check.account_type).toBe(achSavingsParams.accountType);
    expect(sale.check.account_holder_type).toBe(achSavingsParams.accountHolderType);
  });

  test('throws error when credentials are missing', () => {
    expect(constructEmptySale).toThrow(/TransNational\[RequestBase\]: missing credentials/);
  });

  test('throws error when both credit card and check are missing', () => {
    expect(() => new TNSale(credentialParams)).toThrow(/TransNational\[TNSale\]: missing required parameter\(s\) - check or credit card information/);
  });

  test('throws error when params is null or undefined', () => {
    expect(() => new TNSale(null)).toThrow(/TransNational\[TNSale\]: missing params/);
    expect(() => new TNSale()).toThrow(/TransNational\[TNSale\]: missing params/);
  })
});

describe('executing a sale', () => {
  describe('with valid credit card parameters', () => {
    test('completes a successful credit card sale', () => {
      const sale = constructCreditCardSale();
      return sale.execute().then(result => {
        expect(result.responseText).toBe('SUCCESS');
      });
    });
  });

  describe('with valid ach checking account parameters', () => {
    test('completes a successful ach sale', () => {
      const sale = constructCheckingAccountSale();
      return sale.execute().then(result => {
        expect(result.responseText).toBe('SUCCESS');
      })
    });
  });

  describe('with valid ach savings account parameters', () => {
    test('completes a successful ach sale', () => {
      const sale = constructSavingsAccountSale();
      return sale.execute().then(result => {
        expect(result.responseText).toBe('SUCCESS');
      })
    });
  });

  describe('with a saved credit card billing profile', () => {
    test('valid params', () => {
      const validParams = Object.assign(
        {},
        credentialParams,
        {
          customerVaultId: 1759689577,
          billingId: 'Test Visa',
          amount: '2.35',
        }
      );
      return TNSale.customerVaultSale(validParams).then(result => {
        expect(result.responseText).toBe('SUCCESS');
      })
    });

    test('invalid billing id', () => {
      const invalidParams = Object.assign(
        {},
        credentialParams,
        {
          customerVaultId: 1759689577,
          billingId: 'Does not exist',
          amount: '1.11',
        }
      );
      return TNSale.customerVaultSale(invalidParams).then(result => {
        expect(result.responseText).toMatch(/^Invalid Billing Id/);
      })
    });
  });

  describe('with a saved checking account billing profile', () => {
    test('valid params', () => {
      const validParams = Object.assign(
        {},
        credentialParams,
        {
          customerVaultId: 1759689577,
          billingId: 'Test checking',
          amount: '1.11',
        }
      );
      return TNSale.customerVaultSale(validParams).then(result => {
        expect(result.responseText).toBe('SUCCESS');
      });
    });
  });
});
