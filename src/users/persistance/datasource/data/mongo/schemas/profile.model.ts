import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Modelo de la bdd

@Schema({ timestamps: true, collection: 'profiles' })
export class ProfileModel {
    @Prop({ type: String })
    public _id: string;

    @Prop({ required: true, index: true })
    public userId: string;

    @Prop({ required: true, maxlength: 100 })
    public fullName: string;

    @Prop({ required: true, maxlength: 200 })
    public shortDescription: string;

    @Prop({ maxlength: 50 })
    public phoneNumber?: string;

    @Prop({ type: String })
    public address?: string;

    public createdAt!: Date;

    public updatedAt!: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileModel);

export type ProfileDocument = HydratedDocument<ProfileModel>;
