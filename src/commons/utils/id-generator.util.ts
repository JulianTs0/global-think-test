import * as crypto from 'node:crypto';

export class IdGenerator {
    public constructor() { }

    public static generateUUID(): string {
        return crypto.randomUUID();
    }
}
