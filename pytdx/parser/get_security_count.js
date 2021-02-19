// # coding=utf-8

// from pytdx.parser.base import BaseParser
// from pytdx.helper import get_datetime, get_volume, get_price
// from collections import OrderedDict
// import struct


// 获取股票数量 深市

// 发送
// 0c 0c 18 6c 00 01 08 00 08 00 4e 04 00 00 75 c7 33 01


// 接收
// Bc cb 74 00 0c 0c 18 6c 00 00 4e 04 02 00 02 00 e7 19

// In [61]: 0x19e7
// Out[61]: 6631


// 沪市

// 发送
// 0c 0c 18 6c 00 01 08 00 08 00 4e 04 01 00 75 c7 33 01

// 接收
// Bc cb 74 00 0c 0c 18 6c 00 00 4e 04 02 00 02 00 b3 33

// In [63]: 0x333b
// Out[63]: 13115

const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class GetSecurityCountCmd extends BaseParser {
  setParams(market) {
    const pkg = ByteArray.fromhex('0c 0c 18 6c 00 01 08 00 08 00 4e 04'); // pkg = bytearray.fromhex(u"0c 0c 18 6c 00 01 08 00 08 00 4e 04")
    const market_pkg = bufferpack.pack('<H', market);
    pkg.push(market_pkg);
    pkg.push('\x75\xc7\x33\x01'); // pkg.extend(b'\x75\xc7\x33\x01')
    this.send_pkg = pkg;
  }

  parseResponse(body_buf) {
    const { num } = bufferpack.unpack('<H', body_buf.slice(0, 2));
    return num;
  }
}

module.exports = GetSecurityCountCmd;
