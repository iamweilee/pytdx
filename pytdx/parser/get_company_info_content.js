// 读取公司信息详情
const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class GetCompanyInfoContent extends BaseParser {
  setParams(market, code, filename, start, length) {
    if (typeof code === 'string') {
      code = code.encode('utf-8');
    }

    if (typeof filename === 'string') {
      filename === filename.encode('utf-8');
    }

    if (filename.length !== 80) {
      filename = filename.ljust(80, '\x00'); // filename = filename.ljust(80, b'\x00')
    }

    const pkg = ByteArray.fromhex('0c 07 10 9c 00 01 68 00 68 00 d0 02'); // pkg = bytearray.fromhex(u'0c 07 10 9c 00 01 68 00 68 00 d0 02')
    pkg.push(bufferpack.pack('<H6sH80sIII', market, code, 0, filename, start, length, 0)); // pkg.extend(struct.pack(u"<H6sH80sIII", market, code, 0, filename, start, length, 0))
    this.send_pkg = pkg;
  }

  parseResponse(body_buf) {
    let pos = 0;
    const { length } = bufferpack.unpack('<10sH', body_buf.slice(0, 12)); // _, length = struct.unpack(u'<10sH', body_buf[:12])
    pos += 12;
    const content = body_buf.slice(pos, pos + length);
    return content.decode('gbk');
  }
}

module.exports = GetCompanyInfoContent;