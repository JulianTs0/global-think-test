import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/*
 * Un helper para ayudar con el testing con una bdd de prueba, por
 * cada prueba se van a eliminar todos los datos de la conección
 * generada en dicha prueba y al finalizar se van a cerrar la misma
 */

@Injectable()
export class TestDatabaseHelper {
    constructor(@InjectConnection() private readonly connection: Connection) { }

    async cleanDatabase() {
        const collections = Object.values(this.connection.collections);

        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }

    async closeConnection() {
        await this.connection.close();
    }
}
