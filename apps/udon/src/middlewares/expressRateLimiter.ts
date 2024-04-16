import { RateLimiterRedis } from 'rate-limiter-flexible';
import { NextFunction, Request, Response } from 'express';

import { getRedisClient } from 'src/utils/redis';
import { RedisConnections } from 'src/utils/redis/getRedisClient';

const EXPRESS_REQ_PER_IP = process.env.DB_EXPRESS_REQ_PER_IP
  ? Number(process.env.DB_EXPRESS_REQ_PER_IP)
  : 35;

const redisClient = getRedisClient(RedisConnections.general);

/*
 * A hard rate limit on endpoint from each ip
 * > points (requests) per second (duration)
 */
const rateLimiter = new RateLimiterRedis({
  keyPrefix: 'middleware',
  points: EXPRESS_REQ_PER_IP,
  duration: 1,
  storeClient: redisClient,
});

const ipRateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send('Too Many Requests');
    });
};

export default ipRateLimiterMiddleware;
