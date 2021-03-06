// # coding=utf-8

// const bufferpack = require('bufferpack');
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
  /*
  u'0c 03 18 99 00 01 20 00 20 00 db 0f d5'
  u'd0 c9 cc d6 a4 a8 af 00 00 00 8f c2 25'
  u'40 13 00 00 d5 00 c9 cc bd f0 d7 ea 00'
  u'00 00 02'
  */
  setup() {
    let arr = this.bufferToBytes(Buffer.from('0c031899000120002000db0fd5', 'hex'));
    arr = arr.concat(this.bufferToBytes(Buffer.from('d0c9ccd6a4a8af0000008fc225', 'hex')));
    arr = arr.concat(this.bufferToBytes(Buffer.from('40130000d500c9ccbdf0d7ea00', 'hex')));
    arr = arr.concat(this.bufferToBytes(Buffer.from('000002', 'hex')));
    // this.send_pkg = Buffer.from('0c031899000120002000db0fd5 d0c9ccd6a4a8af0000008fc225 40130000d500c9ccbdf0d7ea00 000002', 'hex');
    this.send_pkg = this.bytesToBuffer(arr);
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
