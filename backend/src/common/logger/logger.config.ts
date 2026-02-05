import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const createWinstonConfig = (): WinstonModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  const transports: winston.transport[] = [
    // 콘솔 트랜스포트 (항상)
    new winston.transports.Console({
      level: isProduction ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        isProduction
          ? winston.format.json()
          : utilities.format.nestLike('Backend', {
              colors: true,
              prettyPrint: true,
            }),
      ),
    }),
  ];

  // 프로덕션: 파일 로깅
  if (isProduction) {
    // 일반 로그 (7일 보관)
    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: process.env.LOG_DIR || 'logs',
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '7d',
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    );

    // 에러 로그 (14일 보관)
    transports.push(
      new winston.transports.DailyRotateFile({
        dirname: process.env.LOG_DIR || 'logs',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    );
  }

  return { transports };
};
