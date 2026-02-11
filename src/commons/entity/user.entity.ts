// Entidad de dominio del usuario

export class User {
    public id: string;

    public fullName: string;

    public shortDescription: string | null;

    public email: string;

    public passwordHash: string;

    public phoneNumber: string | null;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }

    static fromObject(object: { [key: string]: any }): User | null {
        if (!object) return null;

        const user = new User();
        user.id = object.id;
        user.fullName = object.fullName;
        user.shortDescription = object.shortDescription;
        user.email = object.email;
        user.passwordHash = object.passwordHash;
        user.createdAt = object.createdAt;
        user.updatedAt = object.updateAt;
        user.phoneNumber = object.phoneNumber;

        return user;
    }
}
