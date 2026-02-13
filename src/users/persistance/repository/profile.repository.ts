import { Injectable } from '@nestjs/common';
import { Page, PageContent, Profile } from 'src/commons';
import { ProfileRepositoryI } from 'src/users/domain/repository/profile-repository.interface';
import { MongoProfileDao } from '../datasource/data/mongo/dao/mongo-profile.dao';
import { ProfileEntityMapper } from '../datasource/data/mongo/mapper/profile-entity.mapper';
import { ProfileModel } from '../datasource/data/mongo/schemas/profile.model';

@Injectable()
export class ProfileRepository implements ProfileRepositoryI {
    constructor(private readonly dao: MongoProfileDao) {}

    public async findByUserId(userId: string): Promise<Profile | null> {
        const model: ProfileModel | null = await this.dao.findByUserId(userId);
        return ProfileEntityMapper.toDomain(model);
    }

    public async save(profile: Profile): Promise<Profile> {
        const profileModel: ProfileModel =
            ProfileEntityMapper.toModel(profile)!;
        const saved = await this.dao.save(profileModel);
        return ProfileEntityMapper.toDomain(saved)!;
    }

    public async findAll(
        size: number,
        page: number,
        name?: string,
    ): Promise<PageContent<Profile>> {
        const models: Page<ProfileModel> = await this.dao.findAll(
            size,
            page,
            name,
        );

        return new PageContent<Profile>({
            content: ProfileEntityMapper.toDomainList(models.content),
            page: models.page,
            nextPage: models.hasNext ? models.page + 1 : null,
        });
    }

    public async update(id: string, profile: Profile): Promise<Profile> {
        const profileModel: ProfileModel =
            ProfileEntityMapper.toModel(profile)!;
        const updated: ProfileModel | null = await this.dao.update(
            id,
            profileModel,
        );
        return ProfileEntityMapper.toDomain(updated)!;
    }

    public async delete(profile: Profile): Promise<void> {
        const profileModel: ProfileModel =
            ProfileEntityMapper.toModel(profile)!;
        await this.dao.delete(profileModel);
    }
}
