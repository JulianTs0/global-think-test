import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
} from 'class-validator';
import { RegexValidators } from 'src/commons';

export class EditBody {
    @ApiProperty({
        description: 'Nombre completo del usuario',
        example: 'Juan Pérez',
    })
    @IsNotEmpty()
    @IsString()
    @Matches(RegexValidators.NAME)
    public fullName: string;

    @ApiProperty({
        description: 'Descripción corta del usuario',
        example: 'Desarrollador Fullstack',
        nullable: true,
    })
    @IsNotEmpty()
    @IsString()
    public shortDescription: string | null;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'juan.perez@ejemplo.com',
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;

    @ApiPropertyOptional({
        description: 'Número de teléfono del usuario',
        example: '+541122334455',
        nullable: true,
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public phoneNumber: string | null;

    constructor(init?: Partial<EditBody>) {
        Object.assign(this, init);
    }
}
