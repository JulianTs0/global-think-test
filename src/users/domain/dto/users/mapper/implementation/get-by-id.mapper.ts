import { User } from 'src/commons';
import { GetByIdRes } from '../../response/get-by-id.response.dto';
import { GetByIdReq } from '../../request/get-by-id.request.dto';

export class GetByIdMapper {
    public toRequest(id: string, user: User): GetByIdReq {
        return new GetByIdReq({
            id: id,
            authUser: user,
        });
    }

    public toResponse(user: User): GetByIdRes {
        return new GetByIdRes({
            id: user.id,
            fullName: user.fullName,
            shortDescription: user.shortDescription,
            email: user.email,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
}
