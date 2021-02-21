// 查询公司信息目录
// 参数：市场代码， 股票代码， 如： 0,000001 或 1,600300

const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class GetCompanyInfoCategory extends BaseParser {
  
  setParams(market, code) {
    const pkg = Buffer.from('0c0f109b00010e000e00cf02', 'hex');
    let pkgArr = this.bufferToBytes(pkg);
    const pkg_param = bufferpack.pack('<H6sI', [market, code, 0]);
    pkgArr = pkgArr.concat(this.bufferToBytes(pkg_param));
    this.send_pkg = this.bytesToBuffer(pkgArr);
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
    const [num] = bufferpack.unpack('<H', body_buf.slice(pos, pos + 2)); // (num, ) = struct.unpack("<H", body_buf[:2])
    pos += 2;

    const category = [];

    for (let i = 0; i < num; i++) {
      const [ name, filename, start, length ] = bufferpack.unpack('<64s80sII', body_buf.slice(pos, pos + 152)); // (name, filename, start, length) = struct.unpack(u"<64s80sII", body_buf[pos: pos+ 152])
      pos += 152;

      category.push({
        name: this.get_str(name),
        filename: this.get_str(filename),
        start,
        length
      });
    }

    return category;
  }

  setup() {}

  get_str(b) {
    const p = b.indexOf('\x00');

    if (p !== -1) {
      b = b.slice(0, p);
    }
    let n;
    try {
      n = this.decode(b, 'gbk');
    }
    catch(e) {
      n = 'unkown_str';
    }
  
    return n;
  }
}

module.exports = GetCompanyInfoCategory;