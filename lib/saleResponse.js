'use strict';

const ResponseBase = require('./responseBase');

const cvvResponseCodes = {
  'M': 'CVV2/CVC2 Match',
  'N': 'CVV2/CVC2 Match',
  'P': 'Not Processed',
  'S': 'Merchant has indicated that CVV2/CVC2 is not present on card',
  'U': 'Issuer is not certified and/or has not provided Visa encryption keys',
};

class SaleResponse extends ResponseBase {
  constructor(params) {
    super(params);
    this.responseType = 'SaleResponse';
  }
}

module.exports = SaleResponse;
