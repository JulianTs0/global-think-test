import { User } from 'src/commons';
import { UserModel } from '../schemas/user.model';

// Mapper auxiliar para pasar entidades de dominio a modelos de la bdd

export class UserEntityMapper {
    public static toDomain(userModel: UserModel | null): User | null {
        if (userModel == null) return null;

        const entity: User = new User();
        entity.id = userModel._id.toString();
        entity.email = userModel.email;
        entity.passwordHash = userModel.passwordHash;
        entity.createdAt = userModel.createdAt;
        entity.updatedAt = userModel.updatedAt;

        return entity;
    }

    public static toModel(user: User | null): UserModel | null {
        if (user == null) return null;

        const model: UserModel = new UserModel();

        model._id = user.id;
        model.email = user.email;
        model.passwordHash = user.passwordHash;
        model.createdAt = user.createdAt;
        model.updatedAt = user.updatedAt;

        return model;
    }

    public static toDomainList(userModels: UserModel[]): User[] {
        if (userModels == null) return [];

        return userModels
            .map((u) => this.toDomain(u))
            .filter((u): u is User => u != null);
    }

    public static toModelList(users: User[]): UserModel[] {
        if (users == null) return [];

        return users
            .map((u) => this.toModel(u))
            .filter((u): u is UserModel => u != null);
    }
}
