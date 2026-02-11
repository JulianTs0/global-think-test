import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../schemas/user.model';

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
}
