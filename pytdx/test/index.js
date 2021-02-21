const TdxHq_API = require('../hq');

const api = new TdxHq_API();

// ['招商证券深圳行情', '119.147.212.81:7709']

// api.get_security_count(0);
(async() => {
  await api.connect('119.147.212.81', 7709);
  // let num = await api.get_security_count(0);
  // console.log('0 api.get_security_count', num)
  // num = await api.get_security_count(1);
  // console.log('1 api.get_security_count', num)
  // const list = await api.get_security_list(0, 0);
  // console.log(list);
  // setInterval(async() => {
  //   const quotes = await api.get_security_quotes([[0, '000001'], [1, '600300'],  [0,'000002'], [0,'000008'], [0,'000011'], [0,'000012'], [0,'000014'], [0,'000016'], [0,'000017'], [0, '002351'], [1, '600520']]);  // 84, 165, 246
  //   console.log(quotes)
  // }, 100)
  // const finance_info = await api.get_finance_info(0, '000001');
  // console.log(finance_info);
  // const xdxr_info = await api.get_xdxr_info(0, '000001');
  // console.log(xdxr_info);
  // const bars = await api.get_security_bars(9, 0, '000001', 0, 10);
  // console.log(bars)
  // const index_bars = await api.get_index_bars(9, 1, '000001', 0, 100);
  // console.log(index_bars);
  // const time_data = await api.get_minute_time_data(0, '000001');
  // console.log(time_data);
  const his_time_data = await api.get_history_minute_time_data(0, '000001', 20161209)
  console.log(his_time_data)
})()