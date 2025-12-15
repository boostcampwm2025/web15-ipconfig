import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
}
bootstrap();
