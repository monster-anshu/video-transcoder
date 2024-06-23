import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './infra/aws-sqs';
import './infra/docker';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap;
// bootstrap();
