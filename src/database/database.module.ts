import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from 'src/config/app-config.module';
import { AppConfigService } from 'src/config/app-config.service';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: async (configService: AppConfigService) => ({
                uri: configService.dataBaseUri,
                autoIndex: true,
            }),
        }),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule { }
