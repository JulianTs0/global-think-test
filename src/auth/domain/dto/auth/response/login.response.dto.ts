import { Token } from 'src/commons';

export class LoginRes {
    public readonly token: Token;

    constructor(init?: Partial<LoginRes>) {
        Object.assign(this, init);
    }
}
