import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import { Environment } from './env.enum';

/*
 * Funcion para validar las variables de entorno, con la dependencia
 * class validator creo un pequeño dto para validar todas las vairables
 * y creo la funcion para primero transformar todos los datos de las variables
 * a su tipo de typescript, y luego validar las etiquetas
 */

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
