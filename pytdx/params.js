// coding=utf-8

//市场

const MARKET_SZ = 0  // 深圳
const MARKET_SH = 1  // 上海

//K线种类
// K 线种类
// 0 -   5 分钟K 线
// 1 -   15 分钟K 线
// 2 -   30 分钟K 线
// 3 -   1 小时K 线
// 4 -   日K 线
// 5 -   周K 线
// 6 -   月K 线
// 7 -   1 分钟
// 8 -   1 分钟K 线
// 9 -   日K 线
// 10 -  季K 线
// 11 -  年K 线

const KLINE_TYPE_5MIN = 0
const KLINE_TYPE_15MIN = 1
const KLINE_TYPE_30MIN = 2
const KLINE_TYPE_1HOUR = 3
const KLINE_TYPE_DAILY = 4
const KLINE_TYPE_WEEKLY = 5
const KLINE_TYPE_MONTHLY = 6
const KLINE_TYPE_1MIN = 8
const KLINE_TYPE_RI_K = 9
const KLINE_TYPE_3MONTH = 10
const KLINE_TYPE_YEARLY = 11

module.exports = {
  MARKET_SZ,
  MARKET_SH,
  KLINE_TYPE_5MIN,
  KLINE_TYPE_15MIN,
  KLINE_TYPE_30MIN,
  KLINE_TYPE_1HOUR,
  KLINE_TYPE_DAILY,
  KLINE_TYPE_WEEKLY,
  KLINE_TYPE_MONTHLY,
  KLINE_TYPE_1MIN,
  KLINE_TYPE_RI_K,
  KLINE_TYPE_3MONTH,
  KLINE_TYPE_YEARLY
};