import { PageContent, User } from 'src/commons';
import { SearchUsersRes } from '../../response/search-users.response.dto';
import { GetByIdRes } from '../../response/get-by-id.response.dto';

export class SearchUsersMapper {
    public toResponse(page: PageContent<User>): SearchUsersRes {
        const userResponses = page.content.map(
            (user) =>
                new GetByIdRes({
                    id: user.id,
                    fullName: user.fullName,
                    shortDescription: user.shortDescription,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }),
        );

        return new SearchUsersRes({
            users: userResponses,
            nextPage: page.nextPage,
        });
    }
}
