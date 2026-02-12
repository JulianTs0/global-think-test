import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsPositive,
} from 'class-validator';

export class SearchUsersReq {
    @ApiProperty({
        description: 'Cantidad de elementos por página',
        example: 10,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    public size: number;

    @ApiProperty({
        description: 'Número de página',
        example: 1,
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    public page: number;

    @ApiPropertyOptional({
        description: 'Nombre completo del usuario para filtrar',
        example: 'Juan Pérez',
    })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    public fullName: string;

    constructor(init?: Partial<SearchUsersReq>) {
        Object.assign(this, init);
    }
}
