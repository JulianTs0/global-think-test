import { User } from 'src/commons';
import { GetByIdRes } from '../../response/get-by-id.response.dto';

export class GetByIdMapper {
    public toResponse(user: User): GetByIdRes {
        const response = new GetByIdRes({});

        return response;
    }
}
