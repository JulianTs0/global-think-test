import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Objeto weapter del config service para obtener las variables del env

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {}

    get appPort(): string {
        return this.configService.getOrThrow<string>('PORT');
    }
}
