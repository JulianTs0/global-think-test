import { User } from 'src/commons';
import { DeleteReq } from '../../request/delete.request.dto';

export class DeleteMapper {
    public toRequest(id: string, user: User): DeleteReq {
        const request = new DeleteReq({
            id: id,
            authUser: user,
        });
        return request;
    }
}
