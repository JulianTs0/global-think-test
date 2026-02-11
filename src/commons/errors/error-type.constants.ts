/*
 * Catalogo de errores que se usan en las excepciones
 * personalizadas donde se manejan los errores de negocio
 */

export const Errors = {
    INTERNAL_ERROR: {
        key: 'INTERNAL_ERROR',
        status: 500,
        message: 'Internal error',
    },
    USER_NOT_FOUND: {
        key: 'USER_NOT_FOUND',
        status: 404,
        message: 'User not found',
    },
    UNAUTHORIZED: {
        key: 'UNAUTHORIZED',
        status: 401,
        message: 'Unauthorized',
    },
    EMAIL_ALREADY_EXISTS: {
        key: 'EMAIL_ALREADY_EXISTS',
        status: 400,
        message: 'Email already exists',
    },
    INVALID_PASSWORD: {
        key: 'INVALID_PASSWORD',
        status: 400,
        message: 'Invalid password',
    },
    MISSING_REQUIRED_FIELDS: {
        key: 'MISSING_REQUIRED_FIELDS',
        status: 400,
        message: 'Missing required fields',
    },
    INVALID_FIELDS: {
        key: 'INVALID_FIELDS',
        status: 400,
        message: 'Invalid fields',
    },
} as const;

// Definicion del tipo para que el copilador ayude a seleccionarlos en el desarollo

export type ErrorType = (typeof Errors)[keyof typeof Errors];
