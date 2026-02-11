import { User } from 'src/commons';
import {
    AuthReq,
    AuthRes,
    LoginRes,
    LoginReq,
    RegisterReq,
    RegisterRes,
} from '..';

/*
 * Interfaz del servicio de aunteticacion, este contrato permite logearse
 * , autenticarse y registrarse
 */

export abstract class AuthServiceI {
    abstract auth(request: AuthReq): Promise<AuthRes>;
    abstract login(request: LoginReq): Promise<LoginRes>;
    abstract register(request: RegisterReq): Promise<RegisterRes>;

    abstract validateToken(rawToken: string): Promise<User>;
}
