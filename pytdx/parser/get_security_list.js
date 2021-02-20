// 获取股票列表
const bufferpack = require('bufferpack');
const BaseParser = require('./base');
class GetSecurityList extends BaseParser {
  setParams(market, start) {
    market = '' + market;
    start = '' + start;
    const pkg = Buffer.from('0c0118640101060006005004', 'hex');
    const pkg_param = bufferpack.pack('<HH', [market, start]);
    let arr = this.bufferToBytes(pkg);
    arr = arr.concat(this.bufferToBytes(pkg_param));
    this.send_pkg = this.bytesToBuffer(arr);
  }

  parseResponse(body_buf) {
    let pos = 0;
    const [num] = bufferpack.unpack('<H', body_buf.slice(0, 2));
    pos += 2;
    const stocks = [];
    for (let i = 0; i < num; i++) {
      // b'880023d\x00\xd6\xd0\xd0\xa1\xc6\xbd\xbe\xf9.9\x04\x00\x02\x9a\x99\x8cA\x00\x00\x00\x00'
      // 880023 100 中小平均 276782 2 17.575001 0 80846648
      const one_bytes = body_buf.slice(pos, pos + 29);
      let [code, volunit, name_bytes, reversed_bytes1, pre_close_raw, reversed_bytes2] = bufferpack.unpack('<6sH8s5sI4s', one_bytes);

      // code = this.decode(code, 'utf-8');
      const name = this.decode(name_bytes, 'gbk'); // name_bytes.decode('gbk');
      const pre_close = this.get_volume(pre_close_raw);
      pos += 29;
      
      stocks.push({
        code,
        volunit,
        name,
        pre_close
      });
    }

    return stocks;
  }

  setup() {}
}


module.exports = GetSecurityList;