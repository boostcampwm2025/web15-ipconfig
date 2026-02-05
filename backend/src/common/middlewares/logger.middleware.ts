import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - startTime;

      let level = 'info';
      if (statusCode >= 500) {
        level = 'error';
      } else if (statusCode >= 400) {
        level = 'warn';
      }

      // 검색이 용이하도록 주요 데이터를 메타 데이터(객체)로 분리
      this.logger.log(level, `${method} ${originalUrl} ${statusCode}`, {
        context: 'HTTP', // 로그 발생 위치
        http: {
          method,
          url: originalUrl,
          statusCode,
          contentLength,
          duration,
          userAgent,
          ip,
        },
      });
    });

    next();
  }
}
