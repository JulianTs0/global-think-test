import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '../schemas/user.model';
import { Page } from 'src/commons';
import { Model } from 'mongoose';

/*
 * Este es un DAO de mongo el cual solo habla en idioma de la bdd
 * recibe modelos los guarda o los busca con datos
 */

@Injectable()
export class MongoUserDao {
    constructor(
        @InjectModel(UserModel.name)
        private readonly mongoRepository: Model<UserModel>,
    ) { }

    public async findById(id: string): Promise<UserModel | null> {
        return await this.mongoRepository.findById(id).exec();
    }

    public async findByEmail(email: string): Promise<UserModel | null> {
        return await this.mongoRepository.findOne({ email: email }).exec();
    }

    public async save(userModel: UserModel): Promise<UserModel> {
        const createdUser = new this.mongoRepository(userModel);

        return await createdUser.save();
    }

    public async findAll(size: number, page: number): Promise<Page<UserModel>> {
        const skip: number = (page - 1) * size;

        const sortConfig: any = { createdAt: -1 };
        const filter: Record<string, any> = {};

        const [models, total] = await Promise.all([
            this.mongoRepository
                .find(filter)
                .sort(sortConfig)
                .skip(skip)
                .limit(size)
                .exec(),
            this.mongoRepository.countDocuments(filter).exec(),
        ]);

        const modelsPage: Page<UserModel> = new Page(models, total, page, size);

        return modelsPage;
    }

    public async update(
        id: string,
        userModel: UserModel,
    ): Promise<UserModel | null> {
        return await this.mongoRepository
            .findByIdAndUpdate(id, userModel, { returnDocument: 'after' })
            .exec();
    }

    public async delete(model: UserModel): Promise<void> {
        await this.mongoRepository.findByIdAndDelete(model._id).exec();
    }
}
