import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileModel } from '../schemas/profile.model';
import { Model } from 'mongoose';
import { Page } from 'src/commons';

/*
 * DAO de mongo para el perfil
 */

@Injectable()
export class MongoProfileDao {
    constructor(
        @InjectModel(ProfileModel.name)
        private readonly mongoRepository: Model<ProfileModel>,
    ) {}

    public async findByUserId(userId: string): Promise<ProfileModel | null> {
        return await this.mongoRepository.findOne({ userId: userId }).exec();
    }

    public async save(profileModel: ProfileModel): Promise<ProfileModel> {
        const createdProfile = new this.mongoRepository(profileModel);
        return await createdProfile.save();
    }

    public async findAll(
        size: number,
        page: number,
        name?: string,
    ): Promise<Page<ProfileModel>> {
        const skip: number = (page - 1) * size;

        const sortConfig: any = name ? { fullName: 1 } : { createdAt: -1 };
        const filter: Record<string, any> = {};

        if (name) {
            filter.fullName = { $regex: name, $options: 'i' };
        }

        const [models, total] = await Promise.all([
            this.mongoRepository
                .find(filter)
                .sort(sortConfig)
                .skip(skip)
                .limit(size)
                .exec(),
            this.mongoRepository.countDocuments(filter).exec(),
        ]);

        const modelsPage: Page<ProfileModel> = new Page(
            models,
            total,
            page,
            size,
        );

        return modelsPage;
    }

    public async update(
        id: string,
        profileModel: ProfileModel,
    ): Promise<ProfileModel | null> {
        return await this.mongoRepository
            .findByIdAndUpdate(id, profileModel, { returnDocument: 'after' })
            .exec();
    }

    public async delete(model: ProfileModel): Promise<void> {
        await this.mongoRepository.findByIdAndDelete(model._id).exec();
    }
}
