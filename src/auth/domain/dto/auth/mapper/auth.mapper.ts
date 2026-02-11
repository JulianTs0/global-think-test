import { AuthUserMapper } from './implementation/auth-user.mapper';
import { LoginMapper } from './implementation/login.mapper';
import { RegisterMapper } from './implementation/register.mapper';

/*
 * Mapper central que organiza a todos los mappers de dtos para
 * hacer que el service no tenga que tener la logica de transformacion
 * de datos crudos a respuestas
 */

export class AuthMapper {
    public static auth(): AuthUserMapper {
        return new AuthUserMapper();
    }

    public static login(): LoginMapper {
        return new LoginMapper();
    }

    public static register(): RegisterMapper {
        return new RegisterMapper();
    }
}
