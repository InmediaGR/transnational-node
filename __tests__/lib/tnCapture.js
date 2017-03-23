'use strict';

const TNCapture = require('../../lib/tnCapture');
const credentialParams = require('../../lib/constants').Constants.testCredentials;

describe('TNCapture', () => {
  describe('captureTransaction', () => {
    test('captures a valid transaction', () => {
      const validParams = Object.assign(
        {},
        credentialParams,
        {
          transactionId: 3544642017,
          amount: '1.11',
        }
      );
      return TNCapture.captureTransaction(validParams).then(result => {
        expect(result.success).toBeTruthy();
      });
    });
  });
});
