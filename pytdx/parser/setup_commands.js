// # coding=utf-8

// from pytdx.parser.base import BaseParser
// from pytdx.helper import get_datetime, get_volume, get_price
// from collections import OrderedDict
// import struct
const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class SetupCmd1 extends BaseParser {
  setup() {
    this.send_pkg = Buffer.from('0c0218930001030003000d0001', 'hex'); // self.send_pkg = bytearray.fromhex(u'0c 02 18 93 00 01 03 00 03 00 0d 00 01')
  }

  parseResponse(body_buf) {
    return body_buf;
  }
}

class SetupCmd2 extends BaseParser {
  setup() {
    this.send_pkg = Buffer.from('0c0218940001030003000d0002', 'hex');
  }

  parseResponse(body_buf) {
    return body_buf;
  }
}

class SetupCmd3 extends BaseParser {
  setup() {
    this.send_pkg = Buffer.from('0c031899000120002000db0fd5d0c9ccd6a4a8af0000008fc22540130000d500c9ccbdf0d7ea00000002', 'hex');
  }

  parseResponse(body_buf) {
    return body_buf;
  }
}

module.exports = {
  SetupCmd1,
  SetupCmd2,
  SetupCmd3
};
