// 查询分笔成交
// 参数：市场代码， 股票代码，起始位置， 数量 如： 0,000001,0,10

const bufferpack = require('bufferpack');
const BaseParser = require('./base');

class GetTransactionData extends BaseParser {
  setParams(market, code, start, count) {
    const pkg = Buffer.from('0c17080101010e000e00c50f', 'hex');
    let pkgArr = this.bufferToBytes(pkg);
    const pkg_param = bufferpack.pack('<H6sHH', [market, code, start, count]);
    pkgArr = pkgArr.concat(this.bufferToBytes(pkg_param));
    this.send_pkg = this.bytesToBuffer(pkgArr);
  }

  parseResponse(body_buf) {
    var pos = 0;
    const [count] = bufferpack.unpack('<H', body_buf.slice(pos, pos + 2));
    pos += 2;

    const ticks = [];

    let last_price = 0;

    for (let i = 0; i < count; i++) {
      // ??? get_time
      // \x80\x03 = 14:56
      // console.log('body_buf.length, pos', i, body_buf.length, pos)
      var [ hour, minute, pos ] = this.get_time(body_buf, pos);
      var [ price_raw, pos ] = this.get_price(body_buf, pos);
      var [ vol, pos ] = this.get_price(body_buf, pos);
      var [ num, pos ] = this.get_price(body_buf, pos);
      var [ buyorsell, pos ] = this.get_price(body_buf, pos);
      var [ _, pos ] = this.get_price(body_buf, pos);

      last_price += price_raw;

      ticks.push({
        time: this.padStart(hour, 2) + ':' + this.padStart(minute, 2), // "%02d:%02d" % (hour, minute)
        price: last_price / 100,
        vol,
        num,
        buyorsell
      });
    }

    return ticks;
  }

  setup() {}
}

module.exports = GetTransactionData;
