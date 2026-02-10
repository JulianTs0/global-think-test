import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

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
