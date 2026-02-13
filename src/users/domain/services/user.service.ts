import { Injectable } from '@nestjs/common';
import { DeleteReq } from '../dto/users/request/delete.request.dto';
import { EditReq } from '../dto/users/request/edit.request.dto';
import { EditRes } from '../dto/users/response/edit.response.dto';
import { GetByIdReq } from '../dto/users/request/get-by-id.request.dto';
import { GetByIdRes } from '../dto/users/response/get-by-id.response.dto';
import { UserServiceI } from './user-service.interface';
import {
    Errors,
    PageContent,
    ServiceException,
    User,
    Profile,
} from 'src/commons';
import { UserRepositoryI } from '../repository/user-repository.interface';
import { ProfileRepositoryI } from '../repository/profile-repository.interface';
import { SearchUsersReq } from '../dto/users/request/search-users.request.dto';
import { SearchUsersRes } from '../dto/users/response/search-users.response.dto';
import { UserMapper } from '../dto/users/mapper/user.mapper';

@Injectable()
export class UserService implements UserServiceI {
    constructor(
        private readonly userRepository: UserRepositoryI,
        private readonly profileRepository: ProfileRepositoryI,
    ) { }

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

        const profile: Profile | null =
            await this.profileRepository.findByUserId(request.id);
        if (!profile) {
            throw new ServiceException(Errors.USER_NOT_FOUND);
        }

        return UserMapper.getById().toResponse(user, profile);
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

        const profile: Profile | null =
            await this.profileRepository.findByUserId(user.id);
        if (profile) {
            await this.profileRepository.delete(profile);
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

        const profile: Profile | null =
            await this.profileRepository.findByUserId(user.id);
        if (!profile) {
            throw new ServiceException(Errors.USER_NOT_FOUND);
        }

        profile.fullName = request.body.fullName;
        profile.shortDescription = request.body.shortDescription;
        profile.phoneNumber = request.body.phoneNumber;
        profile.address = request.body.address;

        user.email = request.body.email;

        const updatedProfile: Profile = await this.profileRepository.update(
            profile.id,
            profile,
        );
        const updatedUser: User = await this.userRepository.update(
            user.id,
            user,
        );

        return UserMapper.edit().toResponse(updatedUser, updatedProfile);
    }

    public async searchUsers(request: SearchUsersReq): Promise<SearchUsersRes> {
        if (!request.authUser) {
            throw new ServiceException(Errors.UNAUTHORIZED);
        }

        const profilePage: PageContent<Profile> =
            await this.profileRepository.findAll(
                request.size,
                request.page,
                request.fullName,
            );

        const userIds = profilePage.content.map((p) => p.userId);

        const users: User[] = (
            await Promise.all(
                userIds.map((id) => this.userRepository.findById(id)),
            )
        ).filter((u): u is User => u !== null);

        return UserMapper.searchUsers().toResponse(profilePage, users);
    }

    public async register(user: User, profile: Profile): Promise<User> {
        const savedUser: User = await this.userRepository.save(user);

        profile.userId = savedUser.id;
        await this.profileRepository.save(profile);

        return savedUser;
    }

    public async findById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    public async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findByEmail(email);
    }

    public async findProfileByUserId(userId: string): Promise<Profile | null> {
        return await this.profileRepository.findByUserId(userId);
    }
}
