import { User } from 'src/commons';
import { AuthRes } from '../../response/auth.response.dto';

export class AuthUserMapper {
    public toResponse(user: User): AuthRes {
        const response = new AuthRes({
            id: user.id,
            fullName: user.fullName,
            shortDescription: user.shortDescription,
            email: user.email,
            phoneNumber: user.phoneNumber,
            createdAt: user.createdAt,
            updateAt: user.updatedAt,
        });

        return response;
    }
}
