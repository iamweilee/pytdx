const TdxHq_API = require('../hq');

const api = new TdxHq_API();

// ['招商证券深圳行情', '119.147.212.81:7709']

// api.get_security_count(0);
(async() => {
  await api.connect('119.147.212.81', 7709);
  await api.get_security_count(0);
})()