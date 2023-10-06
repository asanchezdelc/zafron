
const incr = function (redis, key, cb) {
  redis.pipeline()
      .incr(key)
      .pexpire(key, this.timeWindow)
      .exec((err, result) => {
        if (err) return cb(err, { current: 0 })
        if (result[0][0]) return cb(result[0][0], { current: 0 })
        cb(null, { current: result[0][1], ttl: this.timeWindow })
      })
}

async function allowed(redisClient, clientId) {
  // lets use a simple counter using redis incr
  // if the counter is above a certain threshold
  // we can reject the message
  // if the counter is below the threshold
  // we can accept the message and increment the counter
  let current = 0;
  let ttl = 0;
  let maximum = 100;

  // mqtt:limiter:serial
  const key = `mqtt:limiter:${clientId}`;

  // Increment the rate-limit
  try {
    const res = await new Promise(function (resolve, reject) {
      incr(redisClient, key, function (err, res) {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      }, maximum);
    });

    current = res.current;
    ttl = res.ttl;
  } catch (err) {
    throw err;
  }

  if (current <= maximum) {
    // Accept the message
    return true;
  }

  // Reject the message
  return false;
}

exports.allowed = allowed;