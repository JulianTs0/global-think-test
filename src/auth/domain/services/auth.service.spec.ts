import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserServiceI } from 'src/users/domain';
import { AuthHelper } from 'src/auth/config';
import { LoginReq } from '../dto/auth/request/login.request.dto';
import { RegisterReq } from '../dto/auth/request/register.request.dto';
import { Errors, ServiceException, User, Token } from 'src/commons';

describe('AuthService', () => {
    // Injecciones mock

    let service: AuthService;
    let userService: UserServiceI;
    let authHelper: AuthHelper;

    const mockUserService = {
        findByEmail: jest.fn(),
        register: jest.fn(),
        findById: jest.fn(),
    };

    const mockAuthHelper = {
        validatePassword: jest.fn(),
        createToken: jest.fn(),
        hashPassword: jest.fn(),
        parseToken: jest.fn(),
        getSubject: jest.fn(),
    };

    // Antes de cada test configuramos el modulo con las injecciones mock y vaciamos los mocks

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserServiceI,
                    useValue: mockUserService,
                },
                {
                    provide: AuthHelper,
                    useValue: mockAuthHelper,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserServiceI>(UserServiceI);
        authHelper = module.get<AuthHelper>(AuthHelper);

        jest.clearAllMocks();
    });

    // Login

    describe('login', () => {
        it('Debe retornar un token si el email existe y la contraseña es correcta', async () => {
            // Preparacion
            const loginDto = new LoginReq({
                email: 'julian@test.com',
                password: 'Password123!',
            });
            const mockUser = new User();
            mockUser.id = 'user-123';
            mockUser.email = 'julian@test.com';
            const mockToken = new Token({ accessToken: 'fake-jwt-token' });

            (mockUserService.findByEmail as jest.Mock).mockResolvedValue(
                mockUser,
            );
            // Encuentra usuario
            (mockAuthHelper.validatePassword as jest.Mock).mockResolvedValue(
                true,
            );
            // Password OK
            (mockAuthHelper.createToken as jest.Mock).mockResolvedValue(
                mockToken,
            );
            // Crea token

            // Actuamos sobre el service real
            const result = await service.login(loginDto);

            // Comprobamos
            expect(result).toBeDefined();
            expect(result.token.accessToken).toEqual(mockToken.accessToken);
            expect(userService.findByEmail).toHaveBeenCalledWith(
                loginDto.email,
            );
            expect(authHelper.createToken).toHaveBeenCalledWith(mockUser);
        });

        it('Debe lanzar USER_NOT_FOUND si el email no existe', async () => {
            // Preparacion
            (mockUserService.findByEmail as jest.Mock).mockResolvedValue(null);
            const loginDto = new LoginReq({
                email: 'noexiste@test.com',
                password: 'Password123!',
            });

            // Actuamos
            const result = service.login(loginDto);

            // Comprobamos
            await expect(result).rejects.toThrow(ServiceException);

            await expect(result).rejects.toThrow(Errors.USER_NOT_FOUND.message);
        });

        it('Debe lanzar INVALID_PASSWORD si la contraseña es incorrecta', async () => {
            // Preparacion
            const mockUser = new User();

            (mockUserService.findByEmail as jest.Mock).mockResolvedValue(
                mockUser,
            ); // Encuentra usuario
            (mockAuthHelper.validatePassword as jest.Mock).mockResolvedValue(
                false,
            ); // Password incorrecta

            const loginDto = new LoginReq({
                email: 'julian@test.com',
                password: 'bad-password',
            });

            // Actuamos
            const result = service.login(loginDto);

            // Comprobamos
            await expect(result).rejects.toThrow(ServiceException);
            await expect(result).rejects.toThrow(
                Errors.INVALID_PASSWORD.message,
            );
        });
    });

    describe('register', () => {
        it('Debe registrar un usuario nuevo exitosamente', async () => {
            // Preparacion
            const registerDto = new RegisterReq({
                email: 'nuevo@test.com',
                password: 'Password123!',
                fullName: 'Nuevo Usuario',
                shortDescription: 'Desc',
            });

            const savedUser = new User();
            savedUser.id = 'new-uuid';
            savedUser.email = 'nuevo@test.com';

            (mockUserService.findByEmail as jest.Mock).mockResolvedValue(null);
            // No existe un usuario con ese mail
            (mockAuthHelper.hashPassword as jest.Mock).mockResolvedValue(
                'hashed-pass',
            );
            // Hashea password
            (mockUserService.register as jest.Mock).mockResolvedValue(
                savedUser,
            );
            // Guarda en BD

            // Actuamos
            const result = await service.register(registerDto);

            // Comprobamos
            expect(result).toBeDefined();
            expect(result.id).toEqual(savedUser.id);

            expect(userService.register).toHaveBeenCalledWith(
                expect.objectContaining({
                    passwordHash: 'hashed-pass',
                    email: 'nuevo@test.com',
                }),
            );
        });

        it('Debe lanzar EMAIL_ALREADY_EXISTS si el usuario ya existe', async () => {
            // Preparacion
            const existingUser = new User();

            (mockUserService.findByEmail as jest.Mock).mockResolvedValue(
                existingUser,
            ); // Ya existe un usuario

            const registerDto = new RegisterReq({
                email: 'existe@test.com',
                password: '123',
            } as any);

            // Actuamos

            const result = service.register(registerDto);

            // Comprobamos

            await expect(result).rejects.toThrow(ServiceException);

            await expect(result).rejects.toThrow(
                Errors.EMAIL_ALREADY_EXISTS.message,
            );
        });
    });

    describe('validateToken', () => {
        it('Debe retornar el usuario si el token es válido', async () => {
            // Preparacion
            const rawToken = 'Bearer valid.token.jwt';
            const mockUser = new User();
            mockUser.id = 'user-id-123';

            (mockAuthHelper.parseToken as jest.Mock).mockReturnValue(
                'valid.token.jwt',
            );
            // Parsea OK
            (mockAuthHelper.getSubject as jest.Mock).mockResolvedValue(
                'user-id-123',
            );
            // Obtiene ID del token
            (mockUserService.findById as jest.Mock).mockResolvedValue(mockUser);
            // Encuentra usuario en BD

            // Actuamos
            const result = await service.validateToken(rawToken);

            // Comprobamos
            expect(result).toEqual(mockUser);
        });

        it('Debe lanzar UNAUTHORIZED si el token tiene formato inválido', async () => {
            // Preparacion
            (mockAuthHelper.parseToken as jest.Mock).mockReturnValue(null);
            const badToken: string = 'token';

            // Actuamos

            const result = service.validateToken(badToken);

            // Comprobamos
            await expect(result).rejects.toThrow(ServiceException);

            await expect(result).rejects.toThrow(Errors.UNAUTHORIZED.message);
        });

        it('Debe lanzar USER_NOT_FOUND si el token es válido pero el usuario fue borrado', async () => {
            // Preparacion
            const deleteToken: string = 'Bearer valid.token';

            (mockAuthHelper.parseToken as jest.Mock).mockReturnValue(
                'valid.token',
            );
            // El token es valido
            (mockAuthHelper.getSubject as jest.Mock).mockResolvedValue(
                'deleted-user-id',
            );
            // El token tiene la id de un usuario eliminado
            (mockUserService.findById as jest.Mock).mockResolvedValue(null);
            // El usuario ya no existe en BD

            // Actuamos

            const result = service.validateToken(deleteToken);

            // Comprobamos
            await expect(result).rejects.toThrow(ServiceException);
        });
    });
});
