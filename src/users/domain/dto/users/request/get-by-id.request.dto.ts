import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/commons';

export class GetByIdReq {
    @ApiProperty({
        description: 'ID del usuario',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsString()
    public readonly id: string;

    public readonly authUser: User;

    constructor(init?: Partial<GetByIdReq>) {
        Object.assign(this, init);
    }
}
