import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Errors } from '../errors/error-type.constants';
import { ServiceException } from '../errors/service.exception';

/*
 * Esta handler maneja todas las constraint que fallan a la hora
 * de verificar los dtos de entrada, y tranforma esas excepciones
 * personalizadas de la dependencia a mis propias excepciones de negocio
 */

export class GlobalConstraintHandler extends ValidationPipe {
    constructor() {
        super({
            whitelist: true,
            transform: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const allConstraints = errors
                    .map((error) => error.constraints)
                    .filter((constraint) => constraint !== undefined)
                    .map((constraint) => Object.keys(constraint))
                    .flat();

                const hasMissingFields = allConstraints.includes('isNotEmpty');

                if (hasMissingFields) {
                    throw new ServiceException(Errors.MISSING_REQUIRED_FIELDS);
                }

                throw new ServiceException(Errors.INVALID_FIELDS);
            },
        });
    }
}
