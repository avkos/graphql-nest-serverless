import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { bootstrap } from './app';

async function start() {
  const app = await bootstrap()
  await app.listen(3001);
}
start();
