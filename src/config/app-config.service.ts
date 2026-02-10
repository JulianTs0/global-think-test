import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './validator/env.enum';

// Objeto wraper del config service para obtener las variables del env

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) { }

    get appPort(): string {
        return this.configService.getOrThrow<string>('PORT');
    }

    get dataBaseUri(): string {
        return this.configService.getOrThrow<string>('MONGO_URI');
    }

    get nodeEnv(): Environment {
        return this.configService.getOrThrow<Environment>('NODE_ENV');
    }

    isProduction(): boolean {
        return this.nodeEnv === Environment.PROD;
    }

    isDevelopment(): boolean {
        return this.nodeEnv === Environment.DEV;
    }

    isTest(): boolean {
        return this.nodeEnv === Environment.TEST;
    }
}
