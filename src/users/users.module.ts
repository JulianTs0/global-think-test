import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/app-config.module';
import { UserService, UserServiceI, UserRepositoryI } from './domain';
import { MongooseModule } from '@nestjs/mongoose';
import {
    UserModel,
    UserSchema,
    MongoUserDao,
    UserRepository,
} from './persistance';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forFeature([
            {
                name: UserModel.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [
        MongoUserDao,
        {
            provide: UserRepositoryI,
            useClass: UserRepository,
        },
        UserService,
        {
            provide: UserServiceI,
            useExisting: UserService,
        },
    ],
    exports: [UserService, UserServiceI],
})
export class UsersModule { }
