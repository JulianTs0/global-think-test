import { User } from 'src/commons';
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

    public toResponse(user: User): EditRes {
        return new EditRes({
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
