'use strict';

const ResponseBase = require('./responseBase');

class CaptureResponse extends ResponseBase {
  constructor(params) {
    super(params);
    this.responseType = 'CaptureResponse';
  }
}

module.exports = CaptureResponse;
