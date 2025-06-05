import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap()
{
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();