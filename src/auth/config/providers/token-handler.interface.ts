import { Injectable } from '@nestjs/common';
import { User } from 'src/commons';

/*
 * Intefaz que se va usar para manejar tokens, crearlos
 * verificarlos y obtener datos del token
 */

@Injectable()
export abstract class TokenHandlerI {
    abstract createToken(user: User): Promise<string>;

    abstract verifyToken(token: string): Promise<boolean>;

    abstract getSubject(token: string): Promise<string>;

    abstract getExpirationDate(token: string): Promise<Date>;
}
