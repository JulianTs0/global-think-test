import { User } from 'src/commons';
import { EditBody } from './edit.body.dto';

export class EditReq {
    public readonly id: string;

    public readonly authUser: User;

    public readonly body: EditBody;

    constructor(init?: Partial<EditReq>) {
        Object.assign(this, init);
    }
}
