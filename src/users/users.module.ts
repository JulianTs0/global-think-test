import { forwardRef, Module } from '@nestjs/common';
import { AppConfigModule } from 'src/config/app-config.module';
import { UserService, UserServiceI, UserRepositoryI } from 'src/users/domain';
import { ProfileRepositoryI } from 'src/users/domain/repository/profile-repository.interface';
import { MongooseModule } from '@nestjs/mongoose';
import {
    UserModel,
    UserSchema,
    MongoUserDao,
    UserRepository,
    ProfileModel,
    ProfileSchema,
    MongoProfileDao,
    ProfileRepository,
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
            {
                name: ProfileModel.name,
                schema: ProfileSchema,
            },
        ]),
    ],
    controllers: [UserController],
    providers: [
        MongoUserDao,
        MongoProfileDao,
        {
            provide: UserRepositoryI,
            useClass: UserRepository,
        },
        {
            provide: ProfileRepositoryI,
            useClass: ProfileRepository,
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
