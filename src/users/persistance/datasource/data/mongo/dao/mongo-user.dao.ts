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

    public async findByIds(ids: string[]): Promise<UserModel[]> {
        return await this.mongoRepository.find({ _id: { $in: ids } }).exec();
    }

    public async findByEmail(email: string): Promise<UserModel | null> {
        return await this.mongoRepository.findOne({ email: email }).exec();
    }

    public async save(userModel: UserModel): Promise<UserModel> {
        const createdUser = new this.mongoRepository(userModel);

        return await createdUser.save();
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
