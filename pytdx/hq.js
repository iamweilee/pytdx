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
const { PromiseSocket, TimeoutError } = require('promise-socket');
const TDXParams = require('./params');
const logger = require('./log');
const {
  SetupCmd1,
  SetupCmd2,
  SetupCmd3
} = require('./parser/setup_commands');
const GetSecurityCountCmd = require('./parser/get_security_count');
const GetSecurityList = require('./parser/get_security_list');
const GetSecurityQuotesCmd = require('./parser/get_security_quotes');
const GetFinanceInfo = require('./parser/get_finance_info');
const GetXdXrInfo = require('./parser/get_xdxr_info');
const GetSecurityBarsCmd = require('./parser/get_security_bars');
const GetIndexBarsCmd = require('./parser/get_index_bars');
const GetMinuteTimeData = require('./parser/get_minute_time_data');
const GetHistoryMinuteTimeData = require('./parser/get_history_minute_time_data');
const GetHistoryTransactionData = require('./parser/get_history_transaction_data');
const GetTransactionData = require('./parser/get_transaction_data');
const GetCompanyInfoCategory = require('./parser/get_company_info_category');
const GetCompanyInfoContent = require('./parser/get_company_info_content');

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
  async connect(host, port) {
    const socket = new net.Socket();
    const promiseSocket = new PromiseSocket(socket);
    this.client = promiseSocket;
    promiseSocket.setTimeout(CONNECT_TIMEOUT);
    logger.debug('connecting to server %s on port %d', host, port);

    try {
      await promiseSocket.connect({ host, port });
    }
    catch(e) {
      if (e instanceof TimeoutError) {
        logger.error('socket timeout');
      }
    }
    logger.debug("connected!");

    if (this.need_setup) {
      await this.setup();
    }

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

  async setup() {
    await new SetupCmd1(this.client).call_api();
    await new SetupCmd2(this.client).call_api();
    await new SetupCmd3(this.client).call_api();
  }

  // api list
  async get_security_count(market) {
    const cmd = new GetSecurityCountCmd(this.client);
    cmd.setParams(market);
    return await cmd.call_api();
  }

  async get_security_list(market, start) {
    const cmd = new GetSecurityList(this.client);
    cmd.setParams(market, start);
    return await cmd.call_api();
  }

  async get_security_quotes(all_stock) {
    const cmd = new GetSecurityQuotesCmd(this.client);
    cmd.setParams(all_stock);
    return await cmd.call_api();
  }
  
  async get_finance_info(market, code) {
    const cmd = new GetFinanceInfo(this.client);
    cmd.setParams(market, code);
    return await cmd.call_api();
  }

  async get_xdxr_info(market, code) {
    const cmd = new GetXdXrInfo(this.client);
    cmd.setParams(market, code);
    return await cmd.call_api();
  }
  
  async get_security_bars(category, market, code, start, count) {
    const cmd = new GetSecurityBarsCmd(this.client);
    cmd.setParams(category, market, code, start, count);
    return await cmd.call_api();
  }
  
  async get_index_bars(category, market, code, start, count) {
    const cmd = new GetIndexBarsCmd(this.client);
    cmd.setParams(category, market, code, start, count);
    return await cmd.call_api();
  }

  async get_minute_time_data(market, code) {
    const cmd = new GetMinuteTimeData(this.client);
    cmd.setParams(market, code);
    return await cmd.call_api();
  }
  
  async get_history_minute_time_data(market, code, date) {
    const cmd = new GetHistoryMinuteTimeData(this.client);
    cmd.setParams(market, code, date);
    return await cmd.call_api();
  }

  async get_transaction_data(market, code, start, count) {
    const cmd = new GetTransactionData(this.client);
    cmd.setParams(market, code, start, count);
    return await cmd.call_api();
  }
  
  async get_history_transaction_data(market, code, start, count, date) {
    const cmd = new GetHistoryTransactionData(this.client);
    cmd.setParams(market, code, start, count, date);
    return await cmd.call_api();
  }
  
  async get_company_info_category(market, code) {
    const cmd = new GetCompanyInfoCategory(this.client);
    cmd.setParams(market, code);
    return await cmd.call_api();
  }
  
  async get_company_info_content(market, code, filename, start, length) {
    const cmd = new GetCompanyInfoContent(this.client);
    cmd.setParams(market, code, filename, start, length);
    return await cmd.call_api();
  }
  
}

module.exports = TdxHq_API;