import {Module} from '@nestjs/common';
import {DatabaseModule} from '../database/database.module';
import {userProviders} from './user.providers';
import {UserService} from './user.service';
import {UsersResolver} from './user.resolver';
import {GqlModuleOptions, GraphQLModule} from "@nestjs/graphql";
import {GqlModuleAsyncOptions} from "@nestjs/graphql/dist/interfaces/gql-module-options.interface";


@Module({
    imports: [
        DatabaseModule,
        GraphQLModule.forRootAsync({
            useFactory: () => {
                const schemaModuleOptions: Partial<GqlModuleOptions> = {};

                // If we are in development, we want to generate the schema.graphql
                if (process.env.NODE_ENV !== 'production' || process.env.IS_OFFLINE) {
                    schemaModuleOptions.autoSchemaFile = 'src/user/user.schema.gql';
                } else {
                    // For production, the file should be generated
                    schemaModuleOptions.typePaths = ['*.gql'];
                }

                return {
                    context: ({req}) => ({req}),
                    useGlobalPrefix:true,
                    playground: true, // Allow playground in production
                    introspection: true, // Allow introspection in production
                    ...schemaModuleOptions,
                };
            }
        } as GqlModuleAsyncOptions),
    ],
    providers: [
        ...userProviders,
        UserService,
        UsersResolver
    ]
})
export class UserModule {
}
