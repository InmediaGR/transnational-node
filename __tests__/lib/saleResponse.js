'use strict';

const SaleResponse = require('../../lib/saleResponse');

const validResponseBody = 'response=1&responsetext=SUCCESS&authcode=123456&transactionid=3541301565&avsresponse=N&cvvresponse=M&orderid=1234&type=&response_code=100';

describe('SaleResponse', () => {
  describe('with valid parameters', () => {
    let validResponse = null;

    const createValidResponse = () => {
      validResponse = new SaleResponse(validResponseBody);
    }

    beforeEach(() => {
      return createValidResponse();
    });

    test('response is set correctly', () => {
      expect(validResponse.response).toBe('1');
    });

    test('responseText is set correctly', () => {
      expect(validResponse.responseText).toBe('SUCCESS');
    });

    test('responseCode is set correctly', () => {
      expect(validResponse.responseCode).toBe('100');
    });

    test('authCode is set correctly', () => {
      expect(validResponse.authCode).toBe('123456');
    });

    test('transactionId is set correctly', () => {
      expect(validResponse.transactionId).toBe('3541301565');
    });

    test('avsResponse is set correctly', () => {
      expect(validResponse.avsResponse).toBe('N');
    })

    test('cvvResponse is set correctly', () => {
      expect(validResponse.cvvResponse).toBe('M');
    });

    test('orderId is set correctly', () => {
      expect(validResponse.orderId).toBe('1234');
    })
  });
});
