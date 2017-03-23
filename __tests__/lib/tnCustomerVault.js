'use strict';

const TNCustomerVault = require('../../lib/tnCustomerVault');
const visa = require('../../lib/constants').Constants.testAccounts.creditCardVisa;
const masterCard = require('../../lib/constants').Constants.testAccounts.creditCardMasterCard;
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

function constructValidNewCustomerParams() {
  return Object.assign(
    {},
    credentialParams,
    customerParams,
    { creditCard: visa },
    { description: 'New customer test account' }
  );
}

describe('TNCustomerVault', () => {
  describe('adding a customer', () => {
    test('with valid parameters', () => {
      const validParams = constructValidNewCustomerParams();
      return TNCustomerVault.addCustomer(validParams).then(result => {
        expect(result.responseText).toBe('Customer Added');
      });
    });

    test('with missing credentials', () => {
      const invalidParams = Object.assign(
        {},
        customerParams,
        { creditCard: visa }
      );
      const addInvalidCustomer = () => {
        return TNCustomerVault.addCustomer(invalidParams);
      }
      expect(addInvalidCustomer).toThrow(/TransNational\[TNCustomerVault\]: missing credentials/);
    });

    test('with missing payment parameters', () => {
      const invalidParams = Object.assign(
        {},
        credentialParams,
        customerParams,
      );
      const addInvalidCustomer = () => {
        return TNCustomerVault.addCustomer(invalidParams);
      }
      expect(addInvalidCustomer).toThrow(/TransNational\[TNCustomerVault\]: missing required parameter\(s\) - check or credit card information/);
    })
  });

  describe('deleting a customer', () => {
    test('with valid parameters', () => {
      return TNCustomerVault.addCustomer(constructValidNewCustomerParams()).then(newVault => {
        const validParams = Object.assign(
          {},
          credentialParams,
          { customerVaultId: newVault.customerVaultId }
        );
        return TNCustomerVault.deleteCustomer(validParams).then(result => {
          expect(result.responseText).toBe('Customer Deleted');
        });
      });
    });

    test('with missing credentials', () => {
      const invalidParams = { customerVaultId: 12345 };
      const deleteInvalidCustomer = () => {
        return TNCustomerVault.deleteCustomer(invalidParams);
      }
      expect(deleteInvalidCustomer).toThrow(/TransNational\[TNCustomerVault\]: missing credentials/);
    });

    test('with missing customer vault id', () => {
      const invalidParams = credentialParams;
      const deleteInvalidCustomer = () => {
        return TNCustomerVault.deleteCustomer(invalidParams);
      }
      expect(deleteInvalidCustomer).toThrow(/TransNational\[TNCustomerVault\]: missing parameter \(customerVaultId\)/);
    });
  });

  describe('adding an account to a vault', () => {
    test('with a valid credit card', () => {
      return TNCustomerVault.addCustomer(constructValidNewCustomerParams()).then(newVault => {
        const validParams = Object.assign(
          {},
          credentialParams,
          { customerVaultId: newVault.customerVaultId, description: 'New Test Account' },
          customerParams,
          { creditCard: masterCard }
        );
        return TNCustomerVault.addAccount(validParams).then(result => {
          expect(result.responseText).toBe('Billing Information Added');
        });
      });
    });
  });

  describe('deleting an account from a vault', () => {
    test('with valid parameters', () => {
      return TNCustomerVault.addCustomer(constructValidNewCustomerParams()).then(newVault => {
        const validAccountParams = Object.assign(
          {},
          credentialParams,
          { customerVaultId: newVault.customerVaultId, description: 'Account to delete' },
          customerParams,
          { creditCard: masterCard }
        );
        return TNCustomerVault.addAccount(validAccountParams).then(newAccount => {
          const validParams = Object.assign(
            {},
            credentialParams,
            { customerVaultId: newVault.customerVaultId, billingId: 'Account to delete' }
          );
          return TNCustomerVault.deleteAccount(validParams).then(result => {
            expect(result.responseText).toBe('Billing Information Deleted');
          });
        });
      })
    });
  });

  describe('updating account priority', () => {
    test('with valid parameters', () => {
      return TNCustomerVault.addCustomer(constructValidNewCustomerParams()).then(newVault => {
        const validAccountParams = Object.assign(
          {},
          credentialParams,
          { customerVaultId: newVault.customerVaultId, description: 'Account to update' },
          customerParams,
          { creditCard: masterCard }
        );
        return TNCustomerVault.addAccount(validAccountParams).then(newAccount => {
          const validParams = Object.assign(
            {},
            credentialParams,
            { customerVaultId: newVault.customerVaultId,
              billingId: 'Account to update',
              priority: '1' }
          );
          return TNCustomerVault.updateAccountPriority(validParams).then(result => {
            expect(result.responseText).toBe('Billing Information Updated');
          });
        });
      })
    });
  });

  describe('updating an account', () => {
    test('with valid parameters', () => {
      const validParams = Object.assign(
        {},
        credentialParams,
        { customerVaultId: 1759689577, billingId: 'Test Visa' },
        {
          creditCard: {
            expirationDate: '0719',
          },
        }
      );
      return TNCustomerVault.updateAccount(validParams).then(result => {
        expect(result.success).toBeTruthy();
      });
    });
  })
});
