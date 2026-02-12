import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/config';
import { AuthUser, User } from 'src/commons';
import {
    EditBody,
    EditRes,
    GetByIdReq,
    GetByIdRes,
    SearchUsersReq,
    SearchUsersRes,
    UserMapper,
    UserServiceI,
} from 'src/users/domain';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserServiceI) {}

    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiOperation({
        summary: 'Obtener usuario por ID',
        description:
            'Retorna la información detallada de un usuario específico.',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario encontrado.',
        type: GetByIdRes,
    })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    public async getById(@Param() request: GetByIdReq): Promise<GetByIdRes> {
        return await this.userService.getById(request);
    }

    @UseGuards(AuthGuard)
    @Get()
    @ApiOperation({
        summary: 'Buscar usuarios',
        description:
            'Busca usuarios con paginación y filtro opcional por nombre.',
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuarios obtenida exitosamente.',
        type: SearchUsersRes,
    })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    public async findByName(
        @Query() request: SearchUsersReq,
    ): Promise<SearchUsersRes> {
        return this.userService.searchUsers(request);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    @ApiOperation({
        summary: 'Editar usuario',
        description: 'Actualiza la información de un usuario.',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario actualizado exitosamente.',
        type: EditRes,
    })
    @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    public async edit(
        @Param('id') id: string,
        @Body() body: EditBody,
        @AuthUser() user: User,
    ): Promise<EditRes> {
        return await this.userService.edit(
            UserMapper.edit().toRequest(id, body, user),
        );
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Eliminar usuario',
        description: 'Elimina a un usuario del sistema.',
    })
    @ApiResponse({
        status: 204,
        description: 'Usuario eliminado exitosamente.',
    })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    public async delete(
        @Param('id') id: string,
        @AuthUser() user: User,
    ): Promise<void> {
        return await this.userService.delete(
            UserMapper.delete().toRequest(id, user),
        );
    }
}
