import {Connection} from 'typeorm';
import {User} from './user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';
export const userProviders = [
    {
        provide: USER_REPOSITORY,
        useFactory: (connection: Connection) => connection.getRepository(User),
        inject: [DATABASE_CONNECTION]
    }
];
