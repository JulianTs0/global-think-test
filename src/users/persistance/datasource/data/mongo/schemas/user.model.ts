import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Modelo de la bdd

@Schema({ timestamps: true, collection: 'users' })
export class UserModel {
    @Prop({ type: String })
    public _id: string;

    @Prop({ required: true, unique: true, maxlength: 100 })
    public email: string;

    @Prop({ required: true, maxlength: 255 })
    public passwordHash: string;

    public createdAt!: Date;

    public updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);

export type UserDocument = HydratedDocument<UserModel>;
