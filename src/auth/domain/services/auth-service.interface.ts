import { User } from 'src/commons';
import { AuthReq } from '../dto/auth/request/auth.request.dto';
import { AuthRes } from '../dto/auth/response/auth.response.dto';
import { LoginRes } from '../dto/auth/response/login.response.dto';
import { LoginReq } from '../dto/auth/request/login.request.dto';
import { RegisterReq } from '../dto/auth/request/register.request.dto';
import { RegisterRes } from '../dto/auth/response/register.response.dto';

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
