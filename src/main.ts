import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get(AppConfigService);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Prueba Tecnica de Global Think')
        .setDescription('Documentación de la AP')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(config.appPort);
}
bootstrap();
