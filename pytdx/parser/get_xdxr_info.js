
// 读取除权除息信息
// 参数：市场代码， 股票代码， 如： 0,000001 或 1,600300

// need to fix

// get_volume ?

// 4098 ---> 3.0

// 2434.0062499046326 ---> 2.6

// 1218.0031249523163 ---> 2.3

const bufferpack = require('bufferpack');
const BaseParser = require('./base');

class GetXdXrInfo extends BaseParser {
  setParams(market, code) {
    const pkg = Buffer.from('0c1f187600010b000b000f000100', 'hex');
    let pkgArr = this.bufferToBytes(pkg);
    const pkg_param = bufferpack.pack('<B6s', [market, code]);
    pkgArr = pkgArr.concat(this.bufferToBytes(pkg_param));
    this.send_pkg = this.bytesToBuffer(pkgArr);
  }

  parseResponse(body_buf) {
    var pos = 0

    if (body_buf.length < 11) {
      return [];
    }

    pos += 9; // skip 9
    const [num] = bufferpack.unpack('<H', body_buf.slice(pos, pos + 2));
    pos += 2;

    const rows = [];
    
    for (let i = 0; i < num; i++) {
      const [market, code] = bufferpack.unpack('<B6s', body_buf.slice(pos, pos + 7));
      pos += 7;
      pos += 1; // skip a byte
      var [year, month, day, hour, minite, pos] = this.get_datetime(9, body_buf, pos);
      pos += 1; // skip a byte

      // b'\x00\xe8\x00G' => 33000.00000
      // b'\x00\xc0\x0fF' => 9200.00000
      // b'\x00@\x83E' => 4200.0000

      const [cash_raw, peigu_price_raw, songgu_num_raw, peigu_percent_raw] = bufferpack.unpack('<IIII', body_buf.slice(pos, pos + 16));
      // console.log('peigu_price_raw, songgu_num_raw, peigu_percent_raw', peigu_price_raw, songgu_num_raw, peigu_percent_raw)
      pos += 16;

      rows.push({
        market,
        code,
        year,
        month,
        day,
        cash: this.get_v(cash_raw),
        peigu_price: this.get_v(peigu_price_raw),
        songgu_num: this.get_v(songgu_num_raw),
        peigu_percent: this.get_v(peigu_percent_raw)
      });
    }

    return rows;
  }

  setup() {}

  get_v(v) {
    if (v == 0) {
      return 0;
    }
    else {
      return this.get_volume(v);
    }
  }
                
}

module.exports = GetXdXrInfo;