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
