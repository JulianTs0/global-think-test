import { User } from 'src/commons';
import { EditRes } from '../../response/edit.response.dto';
import { EditReq } from '../../request/edit.request.dto';

export class EditMapper {
    public toRequest(): EditReq {
        const request = new EditReq({});
        return request;
    }

    public toResponse(user: User): EditRes {
        const response = new EditRes({});

        return response;
    }
}
