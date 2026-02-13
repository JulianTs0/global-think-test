import { Injectable } from '@nestjs/common';
import { Page, PageContent, User } from 'src/commons';
import { UserRepositoryI } from 'src/users/domain';
import { MongoUserDao } from '../datasource/data/mongo/dao/mongo-user.dao';
import { UserEntityMapper } from '../datasource/data/mongo/mapper/user-entity.mapper';
import { UserModel } from '../datasource/data/mongo/schemas/user.model';

/*
 * Implementacion del del repositorio de usuarios, puede hablar tanto en
 * idioma del negocio como en la bdd, gracias al UserEntityMapper, transforma
 * dominio en bdd, y bdd en dominio, aplicando pequeña logica
 */

@Injectable()
export class UserRepository implements UserRepositoryI {
    constructor(private readonly dao: MongoUserDao) { }

    public async findById(id: string): Promise<User | null> {
        const model: UserModel | null = await this.dao.findById(id);
        return UserEntityMapper.toDomain(model);
    }

    public async findByIds(ids: string[]): Promise<User[]> {
        const models: UserModel[] = await this.dao.findByIds(ids);
        return UserEntityMapper.toDomainList(models);
    }

    public async findByEmail(email: string): Promise<User | null> {
        const model: UserModel | null = await this.dao.findByEmail(email);
        return UserEntityMapper.toDomain(model);
    }

    public async save(user: User): Promise<User> {
        const userModel: UserModel = UserEntityMapper.toModel(user)!;
        const saved = await this.dao.save(userModel);
        return UserEntityMapper.toDomain(saved)!;
    }

    public async update(id: string, user: User): Promise<User> {
        const userModel: UserModel = UserEntityMapper.toModel(user)!;
        const updated: UserModel | null = await this.dao.update(id, userModel);
        return UserEntityMapper.toDomain(updated)!;
    }

    public async delete(user: User): Promise<void> {
        const userModel: UserModel = UserEntityMapper.toModel(user)!;
        await this.dao.delete(userModel);
    }
}
