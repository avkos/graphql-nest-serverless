import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {ConfigModule} from '@nestjs/config';
import {DatabaseModule} from './database/database.module';
import {UserModule} from './user/user.module';
import { LocationController } from './location/location.controller';
import { LocationService } from './location/location.service';
@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        DatabaseModule,
        UserModule,
    ],
    controllers: [AppController,LocationController],
    providers: [LocationService],
})
export class AppModule {
}
