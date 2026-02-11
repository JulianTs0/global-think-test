import { ApiProperty } from '@nestjs/swagger';

export class AuthRes {
    @ApiProperty({ description: 'Identificador único del usuario' })
    public readonly id: string;

    @ApiProperty({ description: 'Nombre completo del usuario' })
    public readonly fullName: string;

    @ApiProperty({ description: 'Descripción corta', nullable: true })
    public readonly shortDescription: string | null;

    @ApiProperty({ description: 'Correo electrónico' })
    public readonly email: string;

    @ApiProperty({ description: 'Número de teléfono', nullable: true })
    public readonly phoneNumber: string | null;

    @ApiProperty({ description: 'Fecha de creación del usuario' })
    public readonly createdAt: Date;

    @ApiProperty({ description: 'Fecha de última actualización' })
    public readonly updateAt: Date;

    constructor(init?: Partial<AuthRes>) {
        Object.assign(this, init);
    }
}
