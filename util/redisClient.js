const { createClient } = require('redis');
require('dotenv').config();

let redisClient = null;

if (process.env.REDIS_URL) {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  (async () => {
    try {
      await redisClient.connect();
      console.log('Connected to Redis');
    } catch (err) {
      console.error('Failed to connect to Redis', err);
      redisClient = null;
    }
  })();
}

async function clearListCache() {
  if (!redisClient) return;
  try {
    // Scan for keys matching list:page:* and delete them in batches
    let cursor = '0';
    do {
      const reply = await redisClient.scan(cursor, { MATCH: 'list:page:*', COUNT: 100 });
      cursor = reply.cursor;
      const keys = reply.keys || [];
      if (keys.length) {
        await redisClient.del(keys);
      }
    } while (cursor !== '0');
  } catch (err) {
    console.error('Error clearing list cache:', err);
  }
}

module.exports = { redisClient, clearListCache };
