// 查询历史分时行情
// 参数：市场代码， 股票代码，时间 如： 0,'000001',20161209 或 1,'600300',20161209

const bufferpack = require('bufferpack');
const BaseParser = require('./base');

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

    const pkg = Buffer.from('0c01300001010d000d00b40f', 'hex');
    let pkgArr = this.bufferToBytes(pkg);
    const pkg_param = bufferpack.pack('<IB6s', [date, market, code]);
    pkgArr = pkgArr.concat(this.bufferToBytes(pkg_param));
    this.send_pkg = this.bytesToBuffer(pkgArr);
  }

  parseResponse(body_buf) {
    var pos = 0;
    const [num] = bufferpack.unpack('<H', body_buf.slice(pos, pos + 2)); // (num, ) = struct.unpack("<H", body_buf[:2])
    let last_price = 0;
    // 跳过了4个字节，实在不知道是什么意思
    pos += 6;
    const prices = [];
    for (let i = 0; i < num; i++) {
      var [ price_raw, pos ] = this.get_price(body_buf, pos);
      var [ reversed1, pos ] = this.get_price(body_buf, pos);
      var [ vol, pos ] = this.get_price(body_buf, pos);
      last_price = last_price + price_raw;

      prices.push({
        price: last_price / 100,
        vol
      });
    }
    return prices;
  }

  setup() {}
}

module.exports = GetHistoryMinuteTimeData;