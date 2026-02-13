import { Profile, User } from 'src/commons';
import { EditRes } from '../../response/edit.response.dto';
import { EditReq } from '../../request/edit.request.dto';
import { EditBody } from '../../request/edit.body.dto';

export class EditMapper {
    public toRequest(id: string, body: EditBody, user: User): EditReq {
        const request = new EditReq({
            id: id,
            body: body,
            authUser: user,
        });
        return request;
    }

    public toResponse(user: User, profile: Profile): EditRes {
        return new EditRes({
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
