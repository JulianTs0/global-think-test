import { Profile } from 'src/commons';
import { ProfileModel } from '../schemas/profile.model';

// Mapper auxiliar para pasar entidades de dominio a modelos de la bdd

export class ProfileEntityMapper {
    public static toDomain(profileModel: ProfileModel | null): Profile | null {
        if (profileModel == null) return null;

        const entity: Profile = new Profile();
        entity.id = profileModel._id.toString();
        entity.userId = profileModel.userId;
        entity.fullName = profileModel.fullName;
        entity.shortDescription = profileModel.shortDescription;
        entity.phoneNumber = profileModel.phoneNumber ?? null;
        entity.address = profileModel.address ?? null;
        entity.createdAt = profileModel.createdAt;
        entity.updatedAt = profileModel.updatedAt;

        return entity;
    }

    public static toModel(profile: Profile | null): ProfileModel | null {
        if (profile == null) return null;

        const model: ProfileModel = new ProfileModel();

        model._id = profile.id;
        model.userId = profile.userId;
        model.fullName = profile.fullName;
        model.shortDescription = profile.shortDescription ?? '';
        model.phoneNumber = profile.phoneNumber || undefined;
        model.address = profile.address || undefined;
        model.createdAt = profile.createdAt;
        model.updatedAt = profile.updatedAt;

        return model;
    }

    public static toDomainList(profileModels: ProfileModel[]): Profile[] {
        if (profileModels == null) return [];

        return profileModels
            .map((p) => this.toDomain(p))
            .filter((p): p is Profile => p != null);
    }

    public static toModelList(profiles: Profile[]): ProfileModel[] {
        if (profiles == null) return [];

        return profiles
            .map((p) => this.toModel(p))
            .filter((p): p is ProfileModel => p != null);
    }
}
