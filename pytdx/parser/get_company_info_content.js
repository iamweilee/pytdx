// 读取公司信息详情
// 参数：市场代码， 股票代码, 文件名, 起始位置， 数量, 如：0,000001,000001.txt,2054363,9221

const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class GetCompanyInfoContent extends BaseParser {
  setParams(market, code, filename, start, length) {
    if (filename.length !== 80) {
      filename = filename.padEnd(80, '\x00'); // filename = filename.ljust(80, b'\x00')
    }

    const pkg = Buffer.from('0c07109c000168006800d002', 'hex');
    let pkgArr = this.bufferToBytes(pkg);
    const pkg_param = bufferpack.pack('<H6sH80sIII', [market, code, 0, filename, start, length, 0]);
    pkgArr = pkgArr.concat(this.bufferToBytes(pkg_param));
    this.send_pkg = this.bytesToBuffer(pkgArr);
  }

  parseResponse(body_buf) {
    let pos = 0;
    const [ _, length ] = bufferpack.unpack('<10sH', body_buf.slice(0, 12)); // _, length = struct.unpack(u'<10sH', body_buf[:12])
    pos += 12;
    const content = body_buf.slice(pos, pos + length);
    return this.decode(content, 'gbk'); // content.decode('gbk');
  }

  setup() {}
}

module.exports = GetCompanyInfoContent;