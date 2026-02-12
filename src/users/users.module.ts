import { forwardRef, Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/app-config.module';
import { UserService, UserServiceI, UserRepositoryI } from 'src/users/domain';
import { MongooseModule } from '@nestjs/mongoose';
import {
    UserModel,
    UserSchema,
    MongoUserDao,
    UserRepository,
} from 'src/users/persistance';
import { UserController } from 'src/users/presentation';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
        AppConfigModule,
        MongooseModule.forFeature([
            {
                name: UserModel.name,
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UserController],
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
export class UsersModule {}
