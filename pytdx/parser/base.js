// # coding=utf-8

// from pytdx.log import DEBUG, log
// import zlib
// import struct
// import sys
const zlib = require('zlib');
const bufferpack = require('bufferpack');
const iconv = require('iconv-lite');
const logger = require('../log');
const {
  hexToBytes,
  bytesToHex,
  bufferToBytes,
  bytesToBuffer,
  get_volume,
  get_price,
  find_csa
} = require('../helper');

class SocketClientNotReady extends Error {} // { constructor(...args) { super(...args) } }


class SendPkgNotReady extends Error {}


class SendRequestPkgFails extends Error {}


class ResponseHeaderRecvFails extends Error {}


class ResponseRecvFails extends Error {}

class MethodNotImplemented extends Error {}

const RSP_HEADER_LEN = 0x10

let totalSended = 0;
class BaseParser {
  constructor(client) {
    this.client = client;
    this.data = null;
    this.send_pkg = null;

    this.rsp_header = null;
    this.rsp_body = null;
    this.rsp_header_len = RSP_HEADER_LEN;
  }

  setParams() { throw new MethodNotImplemented(); }
  parseResponse() { throw new MethodNotImplemented(); }
  setup() { throw new MethodNotImplemented(); }
  async call_api() {
    await this.setup();

    if (!this.client) {
      throw new SocketClientNotReady('socket client not ready');
    }

    if (!this.send_pkg) {
      throw new SendPkgNotReady('send pkg not ready');
    }

    logger.debug('send package:', this.send_pkg);

    await this.client.write(this.send_pkg);

    let nsended = this.client.socket.bytesWritten; // bytesRead
    logger.debug('raw nsended', nsended)
    const raw_nsended = nsended;
    nsended = nsended - totalSended;
    totalSended = raw_nsended

    logger.debug('nsended', nsended, this.send_pkg.length)

    // logger.debug('send package:', this.send_pkg);

    if (nsended !== this.send_pkg.length) {
      logger.debug('send bytes error');
      throw new SendRequestPkgFails('send fails');
    }
    else {
      const head_buf = await this.client.read(this.rsp_header_len);
      logger.debug('recv head_buf', head_buf, '|len is :', head_buf.length);

      if (head_buf.length === this.rsp_header_len) {
        const list = bufferpack.unpack('<IIIHH', head_buf); // _, _, _, zipsize, unzipsize = struct.unpack("<IIIHH", head_buf)
        const zipsize = list[3], unzipsize = list[4];
        // console.log(data)
        logger.debug('zip size is: ', zipsize);
        let body_buf = [], buf; // body_buf = bytearray()
        while(true) {
          buf = await this.client.read(zipsize);
          for (let i = 0; i < buf.length; i++) {
            body_buf.push(buf[i]);
          }
          // body_buf.
          // body_buf.push(buf); // body_buf.extend(buf);
          logger.debug('buf.length', buf.length, 'body_buf.length', body_buf.length);
          if (!buf || !buf.length || body_buf.length === zipsize) {
            break;
          }
        }

        if (!buf.length) {
          logger.debug('接收数据体失败服务器断开连接');
          throw new ResponseRecvFails('接收数据体失败服务器断开连接');
        }

        if (zipsize === unzipsize) {
          logger.debug('不需要解压');
        }
        else {
          // 解压
          logger.debug('需要解压');
          let unziped_data;
          unziped_data = zlib.unzipSync(Buffer.from(body_buf)); // unziped_data = zlib.decompress(buffer(body_buf));
          // unziped_data = zlib.unzipSync(body_buf); // zlib.decompress
          body_buf = unziped_data;
        }

        // logger.debug('recv body ', JSON.stringify(body_buf, 2, null));

        return this.parseResponse(body_buf);
      }
      else {
        logger.debug('head_buf is not 0x10');
        throw new ResponseHeaderRecvFails('head_buf is not 0x10');
      }
    }
  }

  hexToBytes(arg) { return hexToBytes(arg); }
  bytesToHex(arg) { return bytesToHex(arg); }
  bufferToBytes(arg) { return bufferToBytes(arg); }
  bytesToBuffer(arg) { return bytesToBuffer(arg); }
  get_volume(arg) { return get_volume(arg); }
  get_price(arg1, arg2) { return get_price(arg1, arg2); }
  find_csa(arg1, arg2, arg3) { return find_csa(arg1, arg2, arg3); }
  decode(buf, charset) {
    if (typeof buf === 'string') { // 如果是字符串, 先以二进制转为Buffer再转为字节数组, 然后去除NULL后再转回为Buffer
      buf = Buffer.from(buf, 'binary');
      const bytes = this.bufferToBytes(buf);
      buf = this.bytesToBuffer(bytes.filter(n => n)); // 去除u\0000
    }
    return iconv.decode(buf, charset);
  }
  encode(str, charset) { return iconv.encode(str, charset); }
}

module.exports = BaseParser;