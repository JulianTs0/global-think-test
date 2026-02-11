import { ApiProperty } from '@nestjs/swagger';

export class RegisterRes {
    @ApiProperty({
        description: 'Identificador único del usuario registrado',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    public readonly id: string;

    constructor(init?: Partial<RegisterRes>) {
        Object.assign(this, init);
    }
}
