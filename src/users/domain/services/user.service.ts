import { Injectable } from '@nestjs/common';
import { DeleteReq } from '../dto/users/request/delete.request.dto';
import { EditReq } from '../dto/users/request/edit.request.dto';
import { EditRes } from '../dto/users/response/edit.response.dto';
import { GetByIdReq } from '../dto/users/request/get-by-id.request.dto';
import { GetByIdRes } from '../dto/users/response/get-by-id.response.dto';
import { UserServiceI } from './user-service.interface';
import { Errors, PageContent, ServiceException, User } from 'src/commons';
import { UserRepositoryI } from '../repository/user-repository.interface';
import { SearchUsersReq } from '../dto/users/request/search-users.request.dto';
import { SearchUsersRes } from '../dto/users/response/search-users.response.dto';
import { UserMapper } from '../dto/users/mapper/user.mapper';
/*
 * Implementacion del user service, ademas de tener los metodos de servicio
 * para exponer tiene metodos privados que solo se consumen en el authService
 * para registar un usuario nuevo
 */

@Injectable()
export class UserService implements UserServiceI {
    constructor(private readonly userRepository: UserRepositoryI) {}

    public async getById(request: GetByIdReq): Promise<GetByIdRes> {
        if (!request.authUser) {
            throw new ServiceException(Errors.UNAUTHORIZED);
        }

        const user: User | null = await this.userRepository.findById(
            request.id,
        );

        if (!user) {
            throw new ServiceException(Errors.USER_NOT_FOUND);
        }

        return UserMapper.getById().toResponse(user);
    }

    public async delete(request: DeleteReq): Promise<void> {
        if (!request.authUser) {
            throw new ServiceException(Errors.UNAUTHORIZED);
        }

        const user: User | null = await this.userRepository.findById(
            request.id,
        );

        if (!user) {
            throw new ServiceException(Errors.USER_NOT_FOUND);
        }

        if (user.id !== request.authUser.id) {
            throw new ServiceException(Errors.UNAUTHORIZED);
        }

        await this.userRepository.delete(user);
    }

    public async edit(request: EditReq): Promise<EditRes> {
        if (!request.authUser) {
            throw new ServiceException(Errors.UNAUTHORIZED);
        }

        const user: User | null = await this.userRepository.findById(
            request.id,
        );
        if (!user) {
            throw new ServiceException(Errors.USER_NOT_FOUND);
        }
        if (user.id !== request.authUser.id) {
            throw new ServiceException(Errors.UNAUTHORIZED);
        }

        user.fullName = request.body.fullName;
        user.shortDescription = request.body.shortDescription;
        user.email = request.body.email;
        user.phoneNumber = request.body.phoneNumber;

        const updated: User = await this.userRepository.update(
            request.id,
            user,
        );

        return UserMapper.edit().toResponse(updated!);
    }

    public async searchUsers(request: SearchUsersReq): Promise<SearchUsersRes> {
        if (!request.authUser) {
            throw new ServiceException(Errors.UNAUTHORIZED);
        }

        let userPage: PageContent<User> = await this.userRepository.findAll(
            request.size,
            request.page,
            request.fullName,
        );

        return UserMapper.searchUsers().toResponse(userPage);
    }

    public async register(user: User): Promise<User> {
        const saved: User | null = await this.userRepository.save(user);

        return saved;
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
