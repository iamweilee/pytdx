// 获取股票数量 深市
// 参数：市场代码， 股票代码， 如： 0 或 1

// 发送
// 0c 0c 18 6c 00 01 08 00 08 00 4e 04 00 00 75 c7 33 01


// 接收
// Bc cb 74 00 0c 0c 18 6c 00 00 4e 04 02 00 02 00 e7 19

// In [61]: 0x19e7
// Out[61]: 6631


// 沪市

// 发送
// 0c 0c 18 6c 00 01 08 00 08 00 4e 04 01 00 75 c7 33 01

// 接收
// Bc cb 74 00 0c 0c 18 6c 00 00 4e 04 02 00 02 00 b3 33

// In [63]: 0x333b
// Out[63]: 13115
// 获取市场股票数量
const bufferpack = require('bufferpack');
// const logger = require('../log');
const BaseParser = require('./base');

class GetSecurityCountCmd extends BaseParser {
  setParams(market) {
    market = '' + market;
    console.log('market', market)
    let pkg = Buffer.from('0c0c186c0001080008004e04', 'hex'); // pkg = bytearray.fromhex(u"0c 0c 18 6c 00 01 08 00 08 00 4e 04")
    const market_pkg = bufferpack.pack('<H', market);
    let pkgArr = this.bufferToBytes(pkg);
    pkgArr = pkgArr.concat(this.bufferToBytes(market_pkg));
    pkgArr = pkgArr.concat(this.bufferToBytes(Buffer.from('75c73301', 'hex'))); // pkg.extend(b'\x75\xc7\x33\x01')
    this.send_pkg = this.bytesToBuffer(pkgArr);
    // console.log('setParams', this.send_pkg); // <Buffer 0c 0c 18 6c 00 01 08 00 08 00 4e 04 00 00 75 c7 33 01>
  }
  // setParams(market) {
  //   const pkg = new ByteArray(Buffer.from('0c0c186c0001080008004e04', 'hex'))
  //   const extend = new ByteArray(Buffer.from('75c73301', 'hex'))

  //   pkg.position = pkg.bytesAvailable
  //   pkg.endian = Endian.LITTLE_ENDIAN // <

  //   pkg.writeShort(market) // H, writes market_pkg
  //   pkg.writeBytes(extend)
  //   this.send_pkg = pkg.buffer;
  //   console.log('setParams', this.send_pkg) // <Buffer 0c 0c 18 6c 00 01 08 00 08 00 4e 04 00 00 75 c7 33 01>
  // }

  parseResponse(body_buf) {
    const [count] = bufferpack.unpack('<H', body_buf.slice(0, 2));
    return count;
  }

  setup() {}
}

module.exports = GetSecurityCountCmd;
