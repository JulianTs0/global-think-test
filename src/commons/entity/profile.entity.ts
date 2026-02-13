// Entidad de dominio del perfil
export class Profile {
    public id: string;

    public userId: string;

    public fullName: string;

    public shortDescription: string | null;

    public phoneNumber: string | null;

    public address: string | null;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(init?: Partial<Profile>) {
        Object.assign(this, init);
    }

    static fromObject(object: { [key: string]: any }): Profile | null {
        if (!object) return null;

        const profile = new Profile();
        profile.id = object.id;
        profile.userId = object.userId;
        profile.fullName = object.fullName;
        profile.shortDescription = object.shortDescription;
        profile.phoneNumber = object.phoneNumber;
        profile.address = object.address;
        profile.createdAt = object.createdAt;
        profile.updatedAt = object.updatedAt;

        return profile;
    }
}
