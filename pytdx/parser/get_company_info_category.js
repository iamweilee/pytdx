// # coding=utf-8

// from pytdx.parser.base import BaseParser
// from pytdx.helper import get_datetime, get_volume, get_price
// from collections import OrderedDict
// import struct
const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class GetCompanyInfoCategory extends BaseParser {
  
  setParams(market, code) {
    if (typeof code === 'string') {
      code = code.encode('utf-8');
    }

    const pkg = ByteArray.fromhex('0c 0f 10 9b 00 01 0e 00 0e 00 cf 02'); // pkg = bytearray.fromhex(u'0c 0f 10 9b 00 01 0e 00 0e 00 cf 02')
    pkg.push(bufferpack.pack('<H6sI', market, code, 0)); // pkg.extend(struct.pack(u"<H6sI", market, code, 0))
    this.send_pkg = pkg;
  }

  /**
   * 10 00 d7 ee d0 c2 cc e1 ca be 00 00 ..... 36 30 30 33 30 30 2e 74 78 74 .... e8 e3 07 00 92 1f 00 00 .....
   * 10.... name
   * 36.... filename
   * 
   * e8 e3 07 00 --- start
   * 92 1f 00 00 --- length
   */
  parseResponse(body_buf) {
    let pos = 0;
    const { num } = bufferpack.unpack('<H', body_buf.slice(0, 2)); // (num, ) = struct.unpack("<H", body_buf[:2])
    pos += 2;

    const category = [];

    for (let i = 0; i < num; i++) {
      const { name, filename, start, length } = bufferpack.unpack('<64s80sII', body_buf.slice(pos, pos+ 152)); // (name, filename, start, length) = struct.unpack(u"<64s80sII", body_buf[pos: pos+ 152])
      p += 152;
      // entry = OrderedDict(
      //   [
      //       ('name', get_str(name)),
      //       ('filename', get_str(filename)),
      //       ('start', start),
      //       ('length', length),
      //   ]
      // )
      // category.append(entry)
      category.push({
        name: get_str(name),
        filename: get_str(filename),
        start,
        length
      });
    }

    return category;
  }
}

function get_str(b) {
  const p = b.find('\x00');
  if (p !== -1) {
    b = b.slice(0, p);
  }
  try {
    n = b.decode('gbk');
  }
  catch(e) {
    n = 'unkown_str';
  }

  return n;
}

module.exports = GetCompanyInfoCategory;