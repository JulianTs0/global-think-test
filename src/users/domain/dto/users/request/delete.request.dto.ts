import { User } from 'src/commons';

export class DeleteReq {
    public readonly id: string;

    public readonly authUser: User;

    constructor(init?: Partial<DeleteReq>) {
        Object.assign(this, init);
    }
}
