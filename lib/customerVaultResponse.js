'use strict';

const ResponseBase = require('./responseBase');

class CustomerVaultResponse extends ResponseBase {
  constructor(params) {
    super(params);
    this.customerVaultId = this.params.customer_vault_id;
    this.responseType = 'CustomerVaultResponse';
  }
}

module.exports = CustomerVaultResponse;
