import { ApiProperty } from '@nestjs/swagger';

// Dto wrapper para envolver el token

export class Token {
    @ApiProperty({
        description: 'Token de acceso JWT',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    })
    public accessToken: string;

    constructor(init?: Partial<Token>) {
        Object.assign(this, init);
    }
}
