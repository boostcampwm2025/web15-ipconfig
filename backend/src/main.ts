import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { CollaborationService } from './collaboration/collaboration.service';
import { Server, IncomingMessage } from 'http';
import { Duplex } from 'stream';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import { Logger } from 'winston';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Winston 로거를 NestJS 기본 로거로 사용
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const isProduction = process.env.NODE_ENV === 'production';
  const allowedOrigins = isProduction ? process.env.HOST_URL : '*';

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 쿠키/인증 헤더 허용 시 필수
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter 등록
  const logger = app.get<Logger>(WINSTON_MODULE_PROVIDER);
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  // Swagger 설정
  const configSwagger = new DocumentBuilder()
    .setTitle('Web15 IPConfig API')
    .setDescription('Web15 IPConfig API description')
    .setVersion('1.0')
    .addTag('Web15 IPConfig')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  // CollaborationService를 통해 Hocuspocus WebSocket 연결 처리
  const collaborationService = app.get(CollaborationService);
  const httpServer = app.getHttpServer() as Server;

  // Upgrade 요청 처리 (Socket.IO와 Hocuspocus 공존)
  httpServer.on(
    'upgrade',
    (request: IncomingMessage, socket: Duplex, head: Buffer) => {
      // '/collaboration' 경로로 시작하는 WebSocket 요청만 Hocuspocus가 처리
      if (collaborationService.isCollaborationPath(request.url)) {
        collaborationService.handleUpgrade(request, socket, head);
      }
    },
  );
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
