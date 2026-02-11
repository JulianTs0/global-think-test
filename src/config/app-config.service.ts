import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './validator/env.enum';

// Objeto wraper del config service para obtener las variables del env

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    get appPort(): string {
        return this.configService.getOrThrow<string>('PORT');
    }

    get dataBaseUri(): string {
        return this.configService.getOrThrow<string>('MONGO_URI');
    }

    get nodeEnv(): Environment {
        return this.configService.getOrThrow<Environment>('NODE_ENV');
    }

    get jwtSecret(): string {
        return this.configService.getOrThrow<string>('JWT_SECRET');
    }

    get jwtExpiration(): number {
        return parseInt(
            this.configService.getOrThrow<string>('JWT_EXPIRATION'),
            10,
        );
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
