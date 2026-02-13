import { PageContent, Profile, User } from 'src/commons';
import { SearchUsersRes } from '../../response/search-users.response.dto';
import { GetByIdRes } from '../../response/get-by-id.response.dto';
import { SearchUsersReq } from '../../request/search-users.request.dto';

export class SearchUsersMapper {
    public toRequest(
        query: Partial<SearchUsersReq>,
        user: User,
    ): SearchUsersReq {
        return new SearchUsersReq({
            ...query,
            authUser: user,
        });
    }

    public toResponse(
        page: PageContent<Profile>,
        users: User[],
    ): SearchUsersRes {
        const userMap = new Map<string, User>(users.map((u) => [u.id, u]));

        const userResponses = page.content.map((profile) => {
            const user = userMap.get(profile.userId);
            if (!user) return null;

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
        });

        return new SearchUsersRes({
            users: userResponses.filter((u): u is GetByIdRes => u !== null),
            nextPage: page.nextPage,
        });
    }
}
