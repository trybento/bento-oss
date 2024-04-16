import { URL } from 'url';

const REDIS_URL = new URL(process.env.REDIS_URL!);
const REDIS_PORT = REDIS_URL.port ? Number(REDIS_URL.port) : 6379;

const config = {
  port: REDIS_PORT,
  host: REDIS_URL.hostname,
  password: REDIS_URL.password,
  // If using secure redis (rediss) set empty tls
  tls: REDIS_URL.protocol === 'rediss' ? {} : undefined,
};

export default config;
