import {Server} from 'http';
import {Context} from 'aws-lambda';
import {proxy, Response} from 'aws-serverless-express';
import {bootstrap} from './app';

let cachedServer: Server;

export async function handler(event: any, context: Context): Promise<Response> {
    if (!cachedServer) {
        cachedServer = await bootstrap();
    }
    return proxy(cachedServer, event, context, 'PROMISE').promise;
}
