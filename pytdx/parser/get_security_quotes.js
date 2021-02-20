const bufferpack = require('bufferpack');
const BaseParser = require('./base');

class GetSecurityQuotesCmd extends BaseParser {
  /**
   * @param {*} all_stock 一个包含 (market, code) 元组的列表， 如 [ [0, '000001'], [1, '600001'] ]
   */
  setParams(all_stock) {
    const stock_len = all_stock.length;
    if (stock_len <= 0) {
      return false;
    }

    const pkgdatalen = stock_len * 7 + 12;
    const values = [
      0x10c,
      0x02006320,
      pkgdatalen,
      pkgdatalen,
      0x5053e,
      0,
      0,
      stock_len,
    ];

    const pkg_header = bufferpack.pack('<<HIHHIIHH', values);
    let pkgArr = this.bufferToBytes(pkg_header);

    all_stock.forEach(([market, code]) => {
      if (typeof code === 'string') {
        // code = this.decode(code, 'utf-8');
        // console.log('[market, code]', market, code)
        const one_stock_pkg = bufferpack.pack('<B6s', [market, code]);
        pkgArr = pkgArr.concat(this.bufferToBytes(one_stock_pkg));
      }
    });

    this.send_pkg = this.bytesToBuffer(pkgArr);
  }

  parseResponse(body_buf) {
    var pos = 0;
    pos += 2; // skip b1 cb
    const [num_stock] = bufferpack.unpack('<H', body_buf.slice(pos, pos + 2));
    pos += 2;

    const stocks = [];

    for (let i = 0; i < num_stock; i++) {
      // print (body_buf.slice(pos))
      // b'\x00000001\x95\n\x87\x0e\x01\x01\x05\x00\xb1\xb9\xd6\r\xc7\x0e\x8d\xd7\x1a\x84\x04S\x9c<M\xb6\xc8\x0e\x97\x8e\x0c\x00\xae\n\x00\x01\xa0\x1e\x9e\xb3\x03A\x02\x84\xf9\x01\xa8|B\x03\x8c\xd6\x01\xb0lC\x04\xb7\xdb\x02\xac\x7fD\x05\xbb\xb0\x01\xbe\xa0\x01y\x08\x01GC\x04\x00\x00\x95\n'
      const [market, code, active1] = bufferpack.unpack('<B6sH', body_buf.slice(pos, pos + 9));
      pos += 9;
      var [price, pos] = this.get_price(body_buf, pos);
      var [last_close_diff, pos] = this.get_price(body_buf, pos)
      var [open_diff, pos] = this.get_price(body_buf, pos)
      var [high_diff, pos] = this.get_price(body_buf, pos)
      var [low_diff, pos] = this.get_price(body_buf, pos)
      // 不确定这里应该是用 this.get_price 跳过还是直接跳过4个bytes
      var reversed_bytes0 = body_buf.slice(pos, pos + 4)
      // console.log('reversed_bytes0', reversed_bytes0)
      pos += 4
      // var [reversed_bytes0, pos] = this.get_price(body_buf, pos)
      // 应该是 -price
      var [reversed_bytes1, pos] = this.get_price(body_buf, pos)
      // console.log(reversed_bytes1 == -price)
      var [vol, pos] = this.get_price(body_buf, pos)
      var [cur_vol, pos] = this.get_price(body_buf, pos)
      var [amount_raw] = bufferpack.unpack('<I', body_buf.slice(pos, pos + 4))
      var amount = this.get_volume(amount_raw)
      pos += 4
      var [s_vol, pos] = this.get_price(body_buf, pos)
      var [b_vol, pos] = this.get_price(body_buf, pos)
      var [reversed_bytes2, pos] = this.get_price(body_buf, pos)
      var [reversed_bytes3, pos] = this.get_price(body_buf, pos)

      var [bid1, pos] = this.get_price(body_buf, pos)
      var [ask1, pos] = this.get_price(body_buf, pos)
      var [bid_vol1, pos] = this.get_price(body_buf, pos)
      var [ask_vol1, pos] = this.get_price(body_buf, pos)

      var [bid2, pos] = this.get_price(body_buf, pos)
      var [ask2, pos] = this.get_price(body_buf, pos)
      var [bid_vol2, pos] = this.get_price(body_buf, pos)
      var [ask_vol2, pos] = this.get_price(body_buf, pos)

      var [bid3, pos] = this.get_price(body_buf, pos)
      var [ask3, pos] = this.get_price(body_buf, pos)
      var [bid_vol3, pos] = this.get_price(body_buf, pos)
      var [ask_vol3, pos] = this.get_price(body_buf, pos)

      var [bid4, pos] = this.get_price(body_buf, pos)
      var [ask4, pos] = this.get_price(body_buf, pos)
      var [bid_vol4, pos] = this.get_price(body_buf, pos)
      var [ask_vol4, pos] = this.get_price(body_buf, pos)

      var [bid5, pos] = this.get_price(body_buf, pos)
      var [ask5, pos] = this.get_price(body_buf, pos)
      var [bid_vol5, pos] = this.get_price(body_buf, pos)
      var [ask_vol5, pos] = this.get_price(body_buf, pos)

      var [
        reversed_bytes4, reversed_bytes5, reversed_bytes6,
        reversed_bytes7, reversed_bytes8, reversed_bytes9,
        active2
      ] = bufferpack.unpack('<HbbbbHH', body_buf.slice(pos, pos + 10))

      pos += 10 // TODO: 处理同时查询多只股票解析响应数据异常的问题

      stocks.push({
        market,
        // code: this.decode(code, 'utf-8'),
        code,
        active1,
        price: this._cal_price(price, 0),
        last_close: this._cal_price(price, last_close_diff),
        open: this._cal_price(price, open_diff),
        high: this._cal_price(price, high_diff),
        low: this._cal_price(price, low_diff),
        reversed_bytes0: this.bytesToBuffer(reversed_bytes0).readUInt32LE(0), // readUInt32BE
        reversed_bytes1,
        vol,
        cur_vol,
        amount,
        s_vol,
        b_vol,
        reversed_bytes2,
        reversed_bytes3,
        bid1: this._cal_price(price, bid1),
        ask1: this._cal_price(price, ask1),
        bid_vol1,
        ask_vol1,
        bid2: this._cal_price(price, bid2),
        ask2: this._cal_price(price, ask2),
        bid_vol2,
        ask_vol2,
        bid3: this._cal_price(price, bid3),
        ask3: this._cal_price(price, ask3),
        bid_vol3,
        ask_vol3,
        bid4: this._cal_price(price, bid4),
        ask4: this._cal_price(price, ask4),
        bid_vol4,
        ask_vol4,
        bid5: this._cal_price(price, bid5),
        ask5: this._cal_price(price, ask5),
        bid_vol5,
        ask_vol5,
        reversed_bytes4,
        reversed_bytes5,
        reversed_bytes6,
        reversed_bytes7,
        reversed_bytes8,
        reversed_bytes9,
        active2
      });
    }

    return stocks;
  }

  setup() {}

  _cal_price(base_p, diff) {
    return (base_p + diff) / 100
  }
}

module.exports = GetSecurityQuotesCmd;