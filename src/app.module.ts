import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { GlobalConstraintHandler, GlobalExceptionHandler } from 'src/commons';

@Module({
    imports: [AppConfigModule, DatabaseModule, AuthModule, UsersModule],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionHandler,
        },
        {
            provide: APP_PIPE,
            useClass: GlobalConstraintHandler,
        },
    ],
})
export class AppModule {}
