import {
    DeleteReq,
    EditReq,
    EditRes,
    GetByIdReq,
    GetByIdRes,
} from 'src/users/domain';
import { User } from 'src/commons';

/*
 * Interfaz del servicio de usuarios, este contrato permite obtener por id,
 * eliminar, editar, buscar por mail, registrarse
 */

export abstract class UserServiceI {
    abstract getById(request: GetByIdReq): Promise<GetByIdRes>;
    abstract delete(request: DeleteReq): Promise<void>;
    abstract edit(request: EditReq): Promise<EditRes>;

    abstract register(user: User): Promise<User>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findById(id: string): Promise<User | null>;
}
