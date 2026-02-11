import { Injectable } from '@nestjs/common';

// Interfaz que se va a implementar para encriptar una contraseña y compararla

@Injectable()
export abstract class PasswordEncoderI {
    abstract hash(rawPassword: string): Promise<string>;
    abstract compare(
        rawPassword: string,
        encryptedPassword: string,
    ): Promise<boolean>;
}
