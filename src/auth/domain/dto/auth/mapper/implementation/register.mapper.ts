import { RegisterRes } from '../../response/register.response.dto';
import { User } from 'src/commons';

export class RegisterMapper {
    public toResponse(user: User): RegisterRes {
        const response = new RegisterRes({
            id: user.id,
        });
        return response;
    }
}
