import { Profile, User } from 'src/commons';
import { GetByIdRes } from '../../response/get-by-id.response.dto';
import { GetByIdReq } from '../../request/get-by-id.request.dto';

export class GetByIdMapper {
    public toRequest(id: string, user: User): GetByIdReq {
        return new GetByIdReq({
            id: id,
            authUser: user,
        });
    }

    public toResponse(user: User, profile: Profile): GetByIdRes {
        return new GetByIdRes({
            id: user.id,
            fullName: profile.fullName,
            shortDescription: profile.shortDescription,
            email: user.email,
            phoneNumber: profile.phoneNumber,
            address: profile.address,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
}
