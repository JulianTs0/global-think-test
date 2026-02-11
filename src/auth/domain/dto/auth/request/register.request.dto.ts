import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';
import { RegexValidators } from 'src/commons';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterReq {
    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Perez',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(RegexValidators.NAME)
    readonly fullName: string;

    @ApiProperty({
        description: 'Descripción corta del perfil',
        example: 'Desarrollador Full Stack',
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    readonly shortDescription: string | null;

    @ApiProperty({
        description: 'Correo electrónico',
        example: 'juan.perez@ejemplo.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    readonly email: string;

    @ApiProperty({
        description: 'Contraseña',
        example: 'Password123!',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(RegexValidators.PASSWORD)
    readonly password: string;

    @ApiProperty({
        description: 'Número de teléfono',
        example: '+1234567890',
        required: false,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Matches(RegexValidators.PHONE)
    readonly phoneNumber: string | null;
}
