import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';
import {
    AuthReq,
    AuthRes,
    LoginReq,
    LoginRes,
    AuthServiceI,
    RegisterReq,
    RegisterRes,
} from 'src/auth/domain';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

// Controller del modulo de autenticacion

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthServiceI) {}

    @Post('/login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Autentica a un usuario con sus credenciales.',
    })
    @ApiResponse({ status: 200, description: 'Login exitoso.', type: LoginRes })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    public async login(@Body() loginRequest: LoginReq): Promise<LoginRes> {
        return await this.authService.login(loginRequest);
    }

    @Get()
    @ApiOperation({
        summary: 'Verificar autenticación',
        description: 'Valida el token de autorización.',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuario autenticado.',
        type: AuthRes,
    })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    public async auth(@Headers() request: AuthReq): Promise<AuthRes> {
        return await this.authService.auth(request);
    }

    @Post('/register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Registrar usuario',
        description:
            'Crea una nueva cuenta de usuario con la información proporcionada.',
    })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente.',
        type: RegisterRes,
    })
    @ApiResponse({ status: 400, description: 'Datos de registro inválidos.' })
    @ApiResponse({
        status: 409,
        description: 'El correo electrónico ya está registrado.',
    })
    async register(@Body() request: RegisterReq): Promise<RegisterRes> {
        return await this.authService.register(request);
    }
}
