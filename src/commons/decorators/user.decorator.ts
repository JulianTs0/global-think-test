import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../entity/user.entity';

/*
 * Decorador simple y auxiliar para sacar el usuario que esta dentro de
 * la request
 */
export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();

        const user: User = request.user;
        return user;
    },
);
