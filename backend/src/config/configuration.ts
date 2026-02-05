export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000', 10),
  hostUrl: process.env.HOST_URL,
  logDir: process.env.LOG_DIR,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    useExtension: process.env.USE_REDIS_EXTENSION === 'true',
  },
});
