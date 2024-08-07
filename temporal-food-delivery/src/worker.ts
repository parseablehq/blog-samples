import { DefaultLogger, Runtime, Worker } from '@temporalio/worker';
import * as activities from './activities';
import { ParseableTransport } from 'parseable-winston';
import winston from 'winston';

const parseable = new ParseableTransport({
  url: "http://ec2-3-136-154-35.us-east-2.compute.amazonaws.com:443/api/v1/logstream",
  username: "admin",
  password: "admin",
  http2: false,
  logstream: "temporalactivity",
});

const winstonLogger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: winston.format.json(),
  transports: [parseable, new winston.transports.Console()],
});

async function run() {
  Runtime.install({
    logger: new DefaultLogger("DEBUG", (entry) => {
      const { message, meta, level } = entry;

      if (meta?.sdkComponent === 'activity') {
        if (level === 'DEBUG') {
          winstonLogger.debug(message, meta);
        } else if (level === 'ERROR') {
          winstonLogger.error(message, meta);
        } else if (level === 'WARN') {
          winstonLogger.warn(message, meta);
        } else {
          // for Info, Trace etc
          winstonLogger.info(message, meta);
        }
      }
    })
  });

  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows'),
    activities,
    taskQueue: 'schedules',
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
