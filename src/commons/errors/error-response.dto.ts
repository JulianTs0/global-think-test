import { ErrorType } from './error-type.constants';

// Dto de la respuesta que se va a mostrar por la api cuando ocurra un error

export class ErrorResponse {
    constructor(
        public readonly status: number,
        public readonly message: string,
    ) {}

    static fromErrorType(errorType: ErrorType): ErrorResponse {
        return new ErrorResponse(errorType.status, errorType.message);
    }
}
