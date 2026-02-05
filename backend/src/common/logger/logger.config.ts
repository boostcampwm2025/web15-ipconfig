import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { ConfigService } from '@nestjs/config';

export const createWinstonConfig = (
  configService: ConfigService,
): WinstonModuleOptions => {
  const isProduction = configService.get<string>('nodeEnv') === 'production';
  const logDir = configService.get<string>('logDir');

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
        dirname: logDir,
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
        dirname: logDir,
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
