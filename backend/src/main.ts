import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { CollaborationService } from './collaboration/collaboration.service';
import { Server, IncomingMessage } from 'http';
import { Duplex } from 'stream';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isProduction = process.env.NODE_ENV === 'production';
  const hostUrl = process.env.HOST_URL;
  const vercelProjectName = process.env.VERCEL_PROJECT_NAME;
  const vercelUsername = process.env.VERCEL_USERNAME;

  // Vercel preview 패턴: 프로젝트명-git-브랜치-유저명.vercel.app
  const vercelPreviewPattern =
    vercelProjectName && vercelUsername
      ? new RegExp(
          `^https://${vercelProjectName}-git-[a-z0-9-]+-${vercelUsername}\\.vercel\\.app$`,
        )
      : null;

  const isAllowedOrigin = (origin: string | undefined | null): boolean => {
    if (!isProduction) return true;
    if (!origin) return true;
    if (origin === hostUrl) return true;
    if (vercelPreviewPattern?.test(origin)) return true;
    return false;
  };

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, origin?: boolean) => void,
    ) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
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

  // Swagger 설정
  const configSwagger = new DocumentBuilder()
    .setTitle('Web15 IPConfig API')
    .setDescription('Web15 IPConfig API description')
    .setVersion('1.0')
    .addTag('Web15 IPConfig')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, documentFactory);

  // AsyncAPI 설정
  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('WebSocket API Docs')
    .setDescription('Web15 IPConfig API description')
    .setVersion('1.0')
    .addTag('Web15 IPConfig')
    .build();

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  await AsyncApiModule.setup('asyncapi', app, asyncapiDocument);

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
