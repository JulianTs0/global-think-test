import { User } from 'src/commons';

export class DeleteReq {
    public id: string;

    public authUser: User;

    constructor(init?: Partial<DeleteReq>) {
        Object.assign(this, init);
    }
}
