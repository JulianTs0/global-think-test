export class EditRes {
    public readonly id: string;

    public readonly fullName: string;

    public readonly shortDescription: string | null;

    public readonly email: string;

    public readonly phoneNumber: string | null;

    public readonly address: string | null;

    public readonly createdAt: Date;

    public readonly updatedAt: Date;

    constructor(init?: Partial<EditRes>) {
        Object.assign(this, init);
    }
}
