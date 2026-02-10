import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { Environment } from './validator/env.enum';
import { validateEnvFile } from './validator/env.validator';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            validate: validateEnvFile,
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === Environment.TEST
                    ? '.env.test'
                    : '.env',
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule { }
