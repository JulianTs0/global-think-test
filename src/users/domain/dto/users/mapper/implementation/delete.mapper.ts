import { DeleteReq } from '../../request/delete.request.dto';

export class DeleteMapper {
    public toRequest(): DeleteReq {
        const request = new DeleteReq({});
        return request;
    }
}
