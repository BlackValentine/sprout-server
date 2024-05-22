import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableCors({
    origin: [configService.get('FE_URL'), configService.get('ADMIN_URL')],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('Sprout Plant')
    .setDescription('My API Swagger description')
    .setVersion('1.0')
    .addServer('http://localhost:8080/', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}
bootstrap();
