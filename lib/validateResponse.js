'use strict';

const ResponseBase = require('./responseBase');

class ValidateResponse extends ResponseBase {
  constructor(params) {
    super(params);
    this.customerVaultId = this.params.customer_vault_id;
    this.responseType = 'ValidateResponse';
  }
}

module.exports = ValidateResponse;
