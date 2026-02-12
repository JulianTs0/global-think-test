import { DeleteReq } from '../dto/users/request/delete.request.dto';
import { EditReq } from '../dto/users/request/edit.request.dto';
import { EditRes } from '../dto/users/response/edit.response.dto';
import { GetByIdReq } from '../dto/users/request/get-by-id.request.dto';
import { GetByIdRes } from '../dto/users/response/get-by-id.response.dto';
import { SearchUsersReq } from '../dto/users/request/search-users.request.dto';
import { SearchUsersRes } from '../dto/users/response/search-users.response.dto';
import { User } from 'src/commons';

/*
 * Interfaz del servicio de usuarios, este contrato permite obtener por id,
 * eliminar, editar, buscar por mail, registrarse
 */

export abstract class UserServiceI {
    abstract getById(request: GetByIdReq): Promise<GetByIdRes>;
    abstract delete(request: DeleteReq): Promise<void>;
    abstract edit(request: EditReq): Promise<EditRes>;
    abstract searchUsers(request: SearchUsersReq): Promise<SearchUsersRes>;

    abstract register(user: User): Promise<User>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findById(id: string): Promise<User | null>;
}
