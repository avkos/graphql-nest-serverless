import {bootstrap} from './app';

async function start() {
    const app = await bootstrap()
    await app.listen(3001);
}

start();
