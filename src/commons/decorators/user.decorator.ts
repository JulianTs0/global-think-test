import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/*
 * Decorador simple y auxiliar para sacar el usuario que esta dentro de
 * la request
 */
export const User = createParamDecorator((ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    return user;
});
