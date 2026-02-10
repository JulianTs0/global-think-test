import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { Environment } from './env.enum';

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: string;

    @IsNumber()
    PORT: number;

    @IsString()
    MONGO_URI: string;
}

export function validateEnvFile(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }

    return validatedConfig;
}
