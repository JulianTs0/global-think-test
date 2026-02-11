import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/config/app-config.module';
import { AuthController } from './presentation';
import {
    AuthHelper,
    BcryptEncoder,
    JWTHandler,
    PasswordEncoderI,
    TokenHandlerI,
} from './config';
import { AuthService, AuthServiceI } from './domain';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [AppConfigModule, JwtModule.register({}), UsersModule],
    controllers: [AuthController],
    providers: [
        AuthHelper,
        {
            provide: PasswordEncoderI,
            useClass: BcryptEncoder,
        },
        {
            provide: TokenHandlerI,
            useClass: JWTHandler,
        },

        AuthService,
        {
            provide: AuthServiceI,
            useExisting: AuthService,
        },
    ],
    exports: [AuthService, AuthServiceI],
})
export class AuthModule { }
