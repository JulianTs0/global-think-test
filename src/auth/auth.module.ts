import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from 'src/config/app-config.module';
import { AuthController } from 'src/auth/presentation';
import {
    AuthGuard,
    AuthHelper,
    BcryptEncoder,
    JWTHandler,
    PasswordEncoderI,
    TokenHandlerI,
} from 'src/auth/config';
import { AuthService, AuthServiceI } from 'src/auth/domain';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        AppConfigModule,
        JwtModule.register({}),
        forwardRef(() => UsersModule),
    ],
    controllers: [AuthController],
    providers: [
        AuthGuard,
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
    exports: [AuthService, AuthServiceI, AuthGuard],
})
export class AuthModule {}
