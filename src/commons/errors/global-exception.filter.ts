import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { Errors } from './error-type.constants';
import { ErrorResponse } from './error-response.dto';
import { ServiceException } from './service.exception';

/*
 * Este handler lo que hace es capturar cualquier excepcions
 * no manejada, lo cual me permite tirar excepciones sin preocuparme
 * del try catch ya que esto lo maneja, y centralizo el manejo aca,
 * ademas filtro mis excepciones de las ajenas
 */

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const httpHost = host.switchToHttp();
        const response = httpHost.getResponse<Response>();

        let errorResponse: ErrorResponse = ErrorResponse.fromErrorType(
            Errors.INTERNAL_ERROR,
        );

        if (exception instanceof HttpException) {
            if (exception instanceof ServiceException) {
                errorResponse = exception.toResponse();
            } else {
                const status: number = exception.getStatus();
                const res = exception.getResponse();
                const message: string =
                    typeof res === 'object' && (res as any).message
                        ? (res as any).message
                        : res;

                errorResponse = new ErrorResponse(status, message);
            }
        }

        response.status(errorResponse.status).json(errorResponse);
    }
}
