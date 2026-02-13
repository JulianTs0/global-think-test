import { PageContent, Profile } from 'src/commons';

export abstract class ProfileRepositoryI {
    abstract save(profile: Profile): Promise<Profile>;
    abstract findByUserId(userId: string): Promise<Profile | null>;
    abstract findAll(
        size: number,
        page: number,
        name?: string,
    ): Promise<PageContent<Profile>>;
    abstract update(id: string, profile: Profile): Promise<Profile>;
    abstract delete(profile: Profile): Promise<void>;
}
