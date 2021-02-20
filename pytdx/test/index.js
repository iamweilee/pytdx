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
  const quotes = await api.get_security_quotes([[0, '000001'], [1, '600300'], [0,'000002']]);
  console.log(quotes)
})()