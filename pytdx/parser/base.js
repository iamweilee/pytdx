// # coding=utf-8

// from pytdx.log import DEBUG, log
// import zlib
// import struct
// import sys
const zlib = require('zlib');
const bufferpack = require('bufferpack');
const logger = require('../log');

class SocketClientNotReady extends Error {} // { constructor(...args) { super(...args) } }


class SendPkgNotReady extends Error {}


class SendRequestPkgFails extends Error {}


class ResponseHeaderRecvFails extends Error {}


class ResponseRecvFails extends Error {}

const RSP_HEADER_LEN = 0x10

class BaseParser {
  constructor(client) {
    this.client = client;
    this.data = null;
    this.send_pkg = null;

    this.rsp_header = null;
    this.rsp_body = null;
    this.rsp_header_len = RSP_HEADER_LEN;
  }

  setParams(...args) {}
  parseResponse(body_buf) {}
  setup() {}
  call_api() {
    this.setup();

    if (!this.client) {
      throw new SocketClientNotReady('socket client not ready');
    }

    if (!this.send_pkg) {
      throw new SendPkgNotReady('send pkg not ready');
    }

    logger.debug('send package:', this.send_pkg);

    this.client.end(this.send_pkg, (d) => {
      logger.debug('d', d)
    });

    const nsended = this.client.bytesWritten; // bytesRead

    logger.debug('nsended', nsended, this.send_pkg.length)

    // logger.debug('send package:', this.send_pkg);

    if (nsended !== this.send_pkg.length) {
      logger.debug('send bytes error');
      throw new SendRequestPkgFails('send fails');
    }
    else {
      const head_buf = this.client.recv(this.rsp_header_len);
      logger.debug('recv head_buf', head_buf, '|len is :', head_buf.length);

      if (head_buf.length === this.rsp_header_len) {
        const { zipsize, unzipsize } = bufferpack.unpack('<IIIHH', head_buf); // _, _, _, zipsize, unzipsize = struct.unpack("<IIIHH", head_buf)
        logger.debug('zip size is: ', zipsize);
        let body_buf = new ByteArray(); // body_buf = bytearray()
        while(true) {
          const buf = this.client.recv(zipsize);
          body_buf.push(buf); // body_buf.extend(buf);
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
          if (sys.version_info[0] === 2) {
            unziped_data = zlib.unzipSync(Buffer.from(body_buf)); // unziped_data = zlib.decompress(buffer(body_buf));
          }
          else {
            unziped_data = zlib.unzipSync(body_buf); // zlib.decompress
          }
          body_buf = unziped_data;
        }

        log.debug('recv body: ', body_buf);

        return this.parseResponse(body_buf);
      }
      else {
        logger.debug('head_buf is not 0x10');
        throw new ResponseHeaderRecvFails('head_buf is not 0x10');
      }
    }
  }
}

module.exports = BaseParser;