// # coding=utf-8

// #
// # Just for practising
// #


// import os
// import socket
// import sys
// import pandas as pd

// if __name__ == '__main__':
//     sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

// from pytdx.log import DEBUG, log
// from pytdx.parser.get_security_bars import GetSecurityBarsCmd
// from pytdx.parser.get_security_quotes import GetSecurityQuotesCmd
// from pytdx.parser.get_security_count import GetSecurityCountCmd
// from pytdx.parser.get_security_list import GetSecurityList
// from pytdx.parser.get_index_bars import GetIndexBarsCmd
// from pytdx.parser.get_minute_time_data import GetMinuteTimeData
// from pytdx.parser.get_history_minute_time_data import GetHistoryMinuteTimeData
// from pytdx.parser.get_transaction_data import GetTransactionData
// from pytdx.parser.get_history_transaction_data import GetHistoryTransactionData
// from pytdx.parser.get_company_info_category import GetCompanyInfoCategory
// from pytdx.parser.get_company_info_content import GetCompanyInfoContent
// from pytdx.parser.get_xdxr_info import GetXdXrInfo
// from pytdx.parser.get_finance_info import GetFinanceInfo

// from pytdx.params import TDXParams

// from pytdx.parser.setup_commands import SetupCmd1, SetupCmd2, SetupCmd3
const net = require('net');
const TDXParams = require('./params');
const logger = require('./log');
const {
  SetupCmd1,
  SetupCmd2,
  SetupCmd3
} = require('./parser/setup_commands');
const GetSecurityCountCmd = require('./parser/get_security_count');

const CONNECT_TIMEOUT = 5000
const RECV_HEADER_LEN = 0x10

class TdxHq_API {
  constructor() {
    this.need_setup = true;
  }

  /**
   * @param {*} host 服务器ip 地址
   * @param {*} port 服务器端口
   * @return 是否连接成功 true/false
   */
  connect(host, port) {
    this.client = net.createConnection({ host, port });
    this.client.setTimeout(CONNECT_TIMEOUT);
    this.client.on('connect', () => {
      logger.debug('连接到服务器！');
      if (this.need_setup) {
        this.setup();
      }
    });
    this.client.on('data', data => {
      logger.debug(data.toString());
      // this.client.end();
    });
    this.client.on('timeout', () => {
      logger.error('socket timeout');
    });
    this.client.on('error', err => {
      logger.error('服务器异常：', err);
    });
    this.client.on('close', () => { 
      logger.debug('断开与服务器的连接');
    });
    
    logger.debug('connecting to server %s on port %d', host, port);

    return this;
    // try {
    //   this.client.connect();
    // }
    // catch(e) {
    //   logger.error(e);
    //   logger.debug('connection expired');
    //   return false;
    // }
    // logger.debug('connected!');

    
  }

  disconnect() {
    if (this.client) {
      logger.debug('disconnecting');
      this.client.destroy();
      logger.debug('disconnected');
    }
  }

  close() {
    this.disconnect();
  }

  setup() {
    new SetupCmd1(this.client).call_api();
    new SetupCmd2(this.client).call_api();
    new SetupCmd3(this.client).call_api();
  }

  // api list
  get_security_count(market) {
    const cmd = new GetSecurityCountCmd(this.client);
    cmd.setParams(market);
    return cmd.call_api();
  }
}

module.exports = TdxHq_API;