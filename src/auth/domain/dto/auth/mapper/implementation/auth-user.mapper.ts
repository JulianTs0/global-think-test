import { Profile, User } from 'src/commons';
import { AuthRes } from '../../response/auth.response.dto';

export class AuthUserMapper {
    public toResponse(user: User, profile: Profile): AuthRes {
        const response = new AuthRes({
            id: user.id,
            fullName: profile.fullName,
            shortDescription: profile.shortDescription,
            email: user.email,
            phoneNumber: profile.phoneNumber,
            createdAt: user.createdAt,
            updateAt: user.updatedAt,
        });

        return response;
    }
}
