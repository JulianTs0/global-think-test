import { Injectable } from '@nestjs/common';
import { PasswordEncoderI } from '../providers/password-encoder.interface';
import { TokenHandlerI } from '../providers/token-handler.interface';
import { Token, User } from 'src/commons';

/*
 * Clase auxiliar que permite utilizar todos los procesos de
 * autorizacion y seguridad del perfil del usuario
 */

@Injectable()
export class AuthHelper {
    constructor(
        private readonly passwordEncoder: PasswordEncoderI,

        private readonly tokenHandler: TokenHandlerI,
    ) { }

    public async hashPassword(password: string): Promise<string> {
        return this.passwordEncoder.hash(password);
    }

    public async validatePassword(
        user: User,
        password: string,
    ): Promise<boolean> {
        return this.passwordEncoder.compare(password, user.passwordHash);
    }

    public async parseToken(tokenContainer: string): Promise<string | null> {
        if (!tokenContainer) return null;

        const parts = tokenContainer.split(' ');

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }

        const token = parts[1];

        if (await this.tokenHandler.verifyToken(token)) {
            return token;
        } else {
            return null;
        }
    }

    public async createToken(user: User): Promise<Token> {
        const token: Token = new Token();
        token.accessToken = await this.tokenHandler.createToken(user);
        return token;
    }

    public async getSubject(token: string): Promise<string> {
        return await this.tokenHandler.getSubject(token);
    }
}
