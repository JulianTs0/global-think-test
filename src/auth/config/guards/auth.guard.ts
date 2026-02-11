import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthServiceI } from 'src/auth/domain';
import { User } from 'src/commons';

/*
 * Decidi implementar un validacion manual usando el authHelper el
 * cual centraliza todos los procesos de seguirdad y validacion ya
 * que al ser una implmentacion mia tengo mas control sobre como se hacen las cosas
 * NOTA: Yo se que existe una libreria llamada Passport, que hace practicamente lo
 * mismo que lo que hago yo, y la podria usar tranquilamente pero decidi hacerlo manual
 */

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthServiceI) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authHeader: string = request.headers['authorization'];

        const user: User = await this.authService.validateToken(authHeader);

        request['user'] = user;

        return true;
    }
}
