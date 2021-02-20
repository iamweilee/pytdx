// # coding=utf-8

// from pytdx.parser.base import BaseParser
// from pytdx.helper import get_datetime, get_volume, get_price
// from collections import OrderedDict
// import struct
const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');
// 查询历史分时行情
class GetHistoryMinuteTimeData extends BaseParser {
  /**
   * @param {*} market 0/1
   * @param {*} code '000001'
   * @param {*} date 20161201 类似这样的整型
   */
  setParams(market, code, date) {
    if (typeof date === 'string') {
      date = +date;
    }

    if (typeof code === 'string') {
      code = code.encode('utf-8');
    }

    const pkg = ByteArray.fromhex('0c 01 30 00 01 01 0d 00 0d 00 b4 0f'); // pkg = bytearray.fromhex(u'0c 01 30 00 01 01 0d 00 0d 00 b4 0f')
    pkg.push(bufferpack.pack('<IB6s', date, market, code)); // pkg.extend(struct.pack("<IB6s", date, market, code))
    this.send_pkg = pkg;
  }

  parseResponse(body_buf) {
    let pos = 0;
    const { num } = bufferpack.unpack('<H', body_buf.slice(0, 2)); // (num, ) = struct.unpack("<H", body_buf[:2])
    let last_price = 0;
    // 跳过了4个字节，实在不知道是什么意思
    pos += 6;
    const prices = [];
    for (let i = 0; i < num; i++) {
      let { price_raw, pos } = get_price(body_buf, pos);
      let { reversed1, pos } = get_price(body_buf, pos);
      let { vol, pos } = get_price(body_buf, pos);
      last_price = last_price + price_raw;
      price = {
        price: last_price / 100,
        vol
      };
      prices.push(price);
    }
    return prices;
  }
}

module.exports = GetHistoryMinuteTimeData;