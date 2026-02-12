import { User } from 'src/commons';
import { EditBody } from './edit.body.dto';

export class EditReq {
    public id: string;

    public authUser: User;

    public body: EditBody;

    constructor(init?: Partial<EditReq>) {
        Object.assign(this, init);
    }
}
