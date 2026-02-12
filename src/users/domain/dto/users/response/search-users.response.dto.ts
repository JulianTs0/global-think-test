import { GetByIdRes } from './get-by-id.response.dto';

export class SearchUsersRes {
    public users: GetByIdRes[];

    public nextPage: number | null;

    constructor(init?: Partial<SearchUsersRes>) {
        Object.assign(this, init);
    }
}
