// 获取k线, category-> K线种类
// 0 5分钟K线 1 15分钟K线 2 30分钟K线 3 1小时K线 4 日K线
// 5 周K线
// 6 月K线
// 7 1分钟
// 8 1分钟K线 9 日K线
// 10 季K线
// 11 年K线
// market -> 市场代码 0:深圳，1:上海
// stockcode -> 证券代码;
// start -> 指定的范围开始位置;
// count -> 用户要请求的 K 线数目，最大值为 800

// 如： 9,0,'000001',0,100


// param: category=9, market=0, stockcode=000001, start=0, count=10
// send: 0c01086401011c001c002d0500003030303030310900010000000a0000000000000000000000
// recv: b1cb74000c01086401002d05aa00aa000a006ec73301b28c011e3254a081ad4816d6984d6fc7330154ae0182024ab0a51d4978090c4e70c733015414285e8003bb488b59a64d71c73301140086015ec059274945cb154e74c73301006828724060f648ae0edc4d75c73301000a1e7c40f6da48a37dc24d76c7330100680ad0018052b748ad68a24d77c7330100680072a0f0a448f8b9914d78c733010054285ee0a48b48c294764d7bc733010aa401b8014a001def4874abd44d
const bufferpack = require('bufferpack');
const BaseParser = require('./base');

class GetSecurityBarsCmd extends BaseParser {
  setParams(category, market, code, start, count) {
    this.category = category;

    const values = [
      0x10c,
      0x01016408,
      0x1c,
      0x1c,
      0x052d,
      market,
      code,
      category,
      1,
      start,
      count,
      0, 0, 0  // I + I +  H total 10 zero
    ]

    const pkg = bufferpack.pack('<HIHHHH6sHHHHIIH', values);
    this.send_pkg = pkg;
  }

  parseResponse(body_buf) {
    var pos = 0

    const [ret_count] = bufferpack.unpack('<H', body_buf.slice(0, 2));
    pos += 2

    const klines = []

    let pre_diff_base = 0

    for (let i = 0; i < ret_count; i++) {
      var [year, month, day, hour, minute, pos] = this.get_datetime(this.category, body_buf, pos);
      var [price_open_diff, pos] = this.get_price(body_buf, pos)
      var [price_close_diff, pos] = this.get_price(body_buf, pos)

      var [price_high_diff, pos] = this.get_price(body_buf, pos)
      var [price_low_diff, pos] = this.get_price(body_buf, pos)

      const [vol_raw] = bufferpack.unpack('<I', body_buf.slice(pos, pos + 4))
      const vol = this.get_volume(vol_raw)

      pos += 4
      const [dbvol_raw] = bufferpack.unpack('<I', body_buf.slice(pos, pos + 4))
      const dbvol = this.get_volume(dbvol_raw)
      pos += 4

      const open = this._cal_price1000(price_open_diff, pre_diff_base)

      price_open_diff = price_open_diff + pre_diff_base

      const close = this._cal_price1000(price_open_diff, price_close_diff)
      const high = this._cal_price1000(price_open_diff, price_high_diff)
      const low = this._cal_price1000(price_open_diff, price_low_diff)

      pre_diff_base = price_open_diff + price_close_diff

      klines.push({
        open,
        close,
        high,
        low,
        vol,
        dbvol,
        year,
        month,
        day,
        hour,
        minute,
        datetime: this.formatDatetime(year, month, day, hour, minute)
      });
    }
        
    return klines
  }

  setup() {}

  _cal_price1000(base_p, diff) {
    return (base_p + diff) / 1000
  }

}

module.exports = GetSecurityBarsCmd;