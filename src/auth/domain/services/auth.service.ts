import {
    Errors,
    IdGenerator,
    ServiceException,
    Token,
    User,
    Profile,
} from 'src/commons';
import { AuthServiceI } from './auth-service.interface';
import { Injectable } from '@nestjs/common';
import { AuthHelper } from 'src/auth/config';
import { AuthReq } from '../dto/auth/request/auth.request.dto';
import { AuthRes } from '../dto/auth/response/auth.response.dto';
import { LoginReq } from '../dto/auth/request/login.request.dto';
import { LoginRes } from '../dto/auth/response/login.response.dto';
import { RegisterRes } from '../dto/auth/response/register.response.dto';
import { AuthMapper } from '../dto/auth/mapper/auth.mapper';
import { UserServiceI } from 'src/users/domain';
import { RegisterReq } from '../dto/auth/request/register.request.dto';

/*
 * Implementacion del auth service, hay 2 metodos que hacen practicamente lo mismo
 * pero los mantengo porque uno es publico, el auth, y otro es privado de la aplicacion
 * ya que lo uso en la guard que valida el token en otros servicios
 */

@Injectable()
export class AuthService implements AuthServiceI {
    constructor(
        private readonly authHelper: AuthHelper,
        private readonly userSevice: UserServiceI,
    ) { }

    public async auth(request: AuthReq): Promise<AuthRes> {
        const user: User = await this.validateToken(request.authorization);

        const profile: Profile | null =
            await this.userSevice.findProfileByUserId(user.id);

        if (!profile) throw new ServiceException(Errors.USER_NOT_FOUND);

        return AuthMapper.auth().toResponse(user, profile);
    }

    public async login(request: LoginReq): Promise<LoginRes> {
        const user: User | null = await this.userSevice.findByEmail(
            request.email,
        );

        if (user == null) {
            throw new ServiceException(Errors.USER_NOT_FOUND);
        }

        if (!(await this.authHelper.validatePassword(user, request.password))) {
            throw new ServiceException(Errors.INVALID_PASSWORD);
        }

        const token: Token = await this.authHelper.createToken(user);

        return AuthMapper.login().toResponse(token);
    }

    public async register(request: RegisterReq): Promise<RegisterRes> {
        const userCheck: User | null = await this.userSevice.findByEmail(
            request.email,
        );

        if (userCheck != null) {
            throw new ServiceException(Errors.EMAIL_ALREADY_EXISTS);
        }

        const generatedId: string = IdGenerator.generateUUID();
        const paswordHash: string = await this.authHelper.hashPassword(
            request.password,
        );

        const user: User = new User();
        user.id = generatedId;
        user.email = request.email;
        user.passwordHash = paswordHash;

        const profile: Profile = new Profile();
        profile.id = IdGenerator.generateUUID();
        profile.userId = generatedId;
        profile.fullName = request.fullName;
        profile.shortDescription = request.shortDescription;
        profile.phoneNumber = request.phoneNumber ?? null;
        profile.address = request.address ?? null;

        const saved: User = await this.userSevice.register(user, profile);

        return AuthMapper.register().toResponse(saved);
    }

    public async validateToken(rawToken: string): Promise<User> {
        const token: string | null = await this.authHelper.parseToken(rawToken);
        if (token == null) throw new ServiceException(Errors.UNAUTHORIZED);

        const id: string = await this.authHelper.getSubject(token);
        const user: User | null = await this.userSevice.findById(id);
        if (user == null) throw new ServiceException(Errors.USER_NOT_FOUND);

        return user;
    }
}
