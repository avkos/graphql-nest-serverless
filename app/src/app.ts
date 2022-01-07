import {NestFactory} from '@nestjs/core';
import {ExpressAdapter} from '@nestjs/platform-express';
import {INestApplication} from '@nestjs/common';
import {AppModule} from './app.module';
import * as express from 'express';
import {Express} from 'express';
import {Server} from "http";
import {createServer} from 'aws-serverless-express';

export async function createApp(
    expressApp: Express,
): Promise<INestApplication> {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
    );
    app.setGlobalPrefix('api');
    return app;
}

export async function bootstrap(): Promise<Server> {
    const expressApp = express();
    const app = await createApp(expressApp);
    await app.init();
    return createServer(expressApp);
}
