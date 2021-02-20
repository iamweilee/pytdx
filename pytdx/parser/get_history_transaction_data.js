// 查询历史分笔成交

const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class GetHistoryTransactionData extends BaseParser {
  setParams(market, code, start, count, date) {
    if (typeof code === 'string') {
      code = code.encode('utf-8');
    }

    if (typeof date === 'string') {
      date = +date;
    }

    const pkg = ByteArray.fromhex('0c 01 30 01 00 01 12 00 12 00 b5 0f');
    pkg.push(bufferpack.pack('<IH6sHH'), date, market, code, start, count);
    this.send_pkg = pkg;
  }

  parseResponse(body_buf) {
    let pos = 0;
    const { num } = bufferpack.unpack('<H', body_buf.slice(0, 2));
    pos += 2;
    const ticks = [];
    // skip 4 bytes
    pos += 4;

    let last_price = 0;

    for (let i = 0; i < num; i++) {
      // ??? get_time
      // \x80\x03 = 14:56
      let { hour, minute, pos } = get_time(body_buf, pos);
      let { price_raw, pos } = get_price(body_buf, pos);
      let { vol, pos } = get_price(body_buf, pos);
      let { buyorsell, pos } = get_price(body_buf, pos);
      let { pos } = get_price(body_buf, pos);

      last_price += price_raw;

      const tick = {
        time: hour + ':' + minute, // "%02d:%02d" % (hour, minute)
        price: last_price / 100,
        vol,
        buyorsell
      };

      ticks.push(tick);
    }

    return ticks;
  }
}

module.exports = GetHistoryTransactionData;