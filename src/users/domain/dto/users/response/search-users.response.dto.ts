import { GetByIdRes } from './get-by-id.response.dto';

export class SearchUsersRes {
    public readonly users: GetByIdRes[];

    public readonly nextPage: number | null;

    constructor(init?: Partial<SearchUsersRes>) {
        Object.assign(this, init);
    }
}
