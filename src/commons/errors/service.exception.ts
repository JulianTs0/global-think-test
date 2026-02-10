import { HttpException } from '@nestjs/common';
import { ErrorType } from './error-type.constants';
import { ErrorResponse } from './error-response.dto';

export class ServiceException extends HttpException {
    constructor(error: ErrorType) {
        super(error.message, error.status);
    }

    public toResponse(): ErrorResponse {
        return new ErrorResponse(this.getStatus(), this.message);
    }
}
