import { DeleteMapper } from './implementation/delete.mapper';
import { EditMapper } from './implementation/edit.mapper';
import { GetByIdMapper } from './implementation/get-by-id.mapper';
import { SearchUsersMapper } from './implementation/search-users.mapper';
/*
 * Mapper central que organiza a todos los mappers de dtos para
 * hacer que el service no tenga que tener la logica de transformacion
 * de datos crudos a respuestas
 */

export class UserMapper {
    public static getById(): GetByIdMapper {
        return new GetByIdMapper();
    }

    public static edit(): EditMapper {
        return new EditMapper();
    }

    public static delete(): DeleteMapper {
        return new DeleteMapper();
    }

    public static searchUsers(): SearchUsersMapper {
        return new SearchUsersMapper();
    }
}
