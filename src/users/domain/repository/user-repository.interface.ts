import { PageContent, User } from 'src/commons';

// Interfaz para el uso de repositorios de usuarios

export abstract class UserRepositoryI {
    abstract save(user: User): Promise<User>;
    abstract findById(id: string): Promise<User | null>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findAll(
        size: number,
        page: number,
        name?: string,
    ): Promise<PageContent<User>>;
    abstract update(id: string, user: User): Promise<User>;
    abstract delete(user: User): Promise<void>;
}
