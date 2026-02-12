export class GetByIdRes {
    public id: string;

    public fullName: string;

    public shortDescription: string | null;

    public email: string;

    public phoneNumber: string | null;

    public createdAt: Date;

    public updatedAt: Date;

    constructor(init?: Partial<GetByIdRes>) {
        Object.assign(this, init);
    }
}
