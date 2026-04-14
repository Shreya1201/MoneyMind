const redis = require('redis');

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379'
});

client.connect();

const getCache = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value) => {
  await client.set(key, JSON.stringify(value), {
    EX: 300 // expires in 5 min
  });
};

module.exports = { getCache, setCache };