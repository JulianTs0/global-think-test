import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegexValidators } from 'src/commons';
import { ApiProperty } from '@nestjs/swagger';

export class LoginReq {
    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@ejemplo.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'Password123!',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(RegexValidators.PASSWORD)
    readonly password: string;

    constructor(init?: Partial<LoginReq>) {
        Object.assign(this, init);
    }
}
