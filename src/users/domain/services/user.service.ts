import { Injectable } from '@nestjs/common';
import { DeleteReq } from '../dto/users/request/delete.request.dto';
import { EditReq } from '../dto/users/request/edit.request.dto';
import { EditRes } from '../dto/users/response/edit.response.dto';
import { GetByIdReq } from '../dto/users/request/get-by-id.request.dto';
import { GetByIdRes } from '../dto/users/response/get-by-id.response.dto';
import { UserServiceI } from './user-service.interface';
import { User } from 'src/commons';
import { UserRepositoryI } from '../repository/user-repository.interface';

/*
 * Implementacion del user service, ademas de tener los metodos de servicio
 * para exponer tiene metodos privados que solo se consumen en el authService
 * para registar un usuario nuevo
 */

@Injectable()
export class UserService implements UserServiceI {
    constructor(private readonly userRepository: UserRepositoryI) { }

    public async getById(request: GetByIdReq): Promise<GetByIdRes> {
        return Promise.resolve({} as GetByIdRes);
    }

    public async delete(request: DeleteReq): Promise<void> {
        return Promise.resolve();
    }

    public async edit(request: EditReq): Promise<EditRes> {
        return Promise.resolve({} as EditReq);
    }

    public async register(user: User): Promise<User> {
        const saved: User = await this.userRepository.save(user);
        return Promise.resolve(saved);
    }

    public async findById(id: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findById(id);
        return user;
    }

    public async findByEmail(email: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findByEmail(email);
        return user;
    }
}
