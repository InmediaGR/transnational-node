'use strict';

const TNBillingProfile = require('../../lib/tnBillingProfile');
const credentialParams = require('../../lib/constants').Constants.testCredentials;

describe('TNBillingProfile', () => {
  describe('authorizeAccount', () => {
    test('authorizes a valid account', () => {
      const validParams = Object.assign(
        {},
        credentialParams,
        {
          customerVaultId: 1759689577,
          billingId: 'Test Visa',
          amount: '1.11'
        }
      );
      return TNBillingProfile.authorizeAccount(validParams).then(result => {
        expect(result.responseText).toBe('SUCCESS');
      });
    });
  });
});
