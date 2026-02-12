export class EditRes {
    public id: string;

    public fullName: string;

    public shortDescription: string | null;

    public email: string;

    public phoneNumber: string | null;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(init?: Partial<EditRes>) {
        Object.assign(this, init);
    }
}
