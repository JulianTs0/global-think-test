import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordEncoderI } from './password-encoder.interface';

// Implementacion que encripta la contraseña con el algoritmo ByCrypt

@Injectable()
export class BcryptEncoder implements PasswordEncoderI {
    private readonly saltRounds = 12;

    public async hash(rawPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.saltRounds);
        return bcrypt.hash(rawPassword, salt);
    }

    public async compare(
        rawPassword: string,
        encryptedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(rawPassword, encryptedPassword);
    }
}
