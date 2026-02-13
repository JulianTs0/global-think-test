import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepositoryI } from '../repository/user-repository.interface';
import { ProfileRepositoryI } from '../repository/profile-repository.interface';
import {
    Errors,
    PageContent,
    ServiceException,
    User,
    Profile,
} from 'src/commons';
import { GetByIdReq } from '../dto/users/request/get-by-id.request.dto';
import { DeleteReq } from '../dto/users/request/delete.request.dto';
import { EditReq } from '../dto/users/request/edit.request.dto';
import { EditBody } from '../dto/users/request/edit.body.dto';
import { SearchUsersReq } from '../dto/users/request/search-users.request.dto';

describe('UserService', () => {
    // Variables

    let service: UserService;
    let userRepository: UserRepositoryI;
    let profileRepository: ProfileRepositoryI;

    // Mock del UserRepository

    const mockUserRepository = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findByIds: jest.fn(),
    };

    const mockProfileRepository = {
        findByUserId: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
    };

    const mockUser = new User({
        id: 'uuid-123',
        email: 'julian@test.com',
        passwordHash: 'hashed_password',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const mockProfile = new Profile({
        id: 'profile-123',
        userId: 'uuid-123',
        fullName: 'Julian Test',
        shortDescription: 'Junior Developer',
        phoneNumber: '+541122334455',
        address: 'Test Street 123',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Antes de cada test

    beforeEach(async () => {
        // Injeccion del repositorio mockeado

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepositoryI,
                    useValue: mockUserRepository,
                },
                {
                    provide: ProfileRepositoryI,
                    useValue: mockProfileRepository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<UserRepositoryI>(UserRepositoryI);
        profileRepository = module.get<ProfileRepositoryI>(ProfileRepositoryI);

        jest.clearAllMocks();
    });

    // Test del metodo getById

    describe('getById', () => {
        it('Debe retornar un usuario si existe', async () => {
            // Busca al usuario por ID
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );
            (mockProfileRepository.findByUserId as jest.Mock).mockResolvedValue(
                mockProfile,
            );

            const request = new GetByIdReq({
                id: 'uuid-123',
                authUser: mockUser,
            });

            const result = await service.getById(request);

            // Tests
            expect(result).toBeDefined();
            expect(result.fullName).toEqual(mockProfile.fullName);
            expect(userRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(profileRepository.findByUserId).toHaveBeenCalledWith(
                'uuid-123',
            );
        });

        it('Debe lanzar USER_NOT_FOUND si el usuario no existe', async () => {
            // No encuentra al usuario
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);

            const request = new GetByIdReq({
                id: 'uuid-inexistente',
                authUser: mockUser,
            });

            // Assert
            await expect(service.getById(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.getById(request)).rejects.toThrow(
                Errors.USER_NOT_FOUND.message,
            );
        });

        it('Debe lanzar UNAUTHORIZED si no se provee un usuario autenticado', async () => {
            const request = new GetByIdReq({ id: 'uuid-123' });

            // Assert
            await expect(service.getById(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.getById(request)).rejects.toThrow(
                Errors.UNAUTHORIZED.message,
            );
        });
    });

    // Test del metodo delete

    describe('delete', () => {
        it('Debe lanzar UNAUTHORIZED si no se provee un usuario autenticado', async () => {
            const request = new DeleteReq({ id: 'uuid-123' });

            // Assert
            await expect(service.delete(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.delete(request)).rejects.toThrow(
                Errors.UNAUTHORIZED.message,
            );
        });

        it('Debe eliminar un usuario si existe y es el usuario autenticado', async () => {
            // Encuentra al usuario
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );
            (mockProfileRepository.findByUserId as jest.Mock).mockResolvedValue(
                mockProfile,
            );
            // Simula eliminacion exitosa
            (mockUserRepository.delete as jest.Mock).mockResolvedValue(null);
            (mockProfileRepository.delete as jest.Mock).mockResolvedValue(null);

            const request = new DeleteReq({
                id: 'uuid-123',
                authUser: mockUser,
            });

            await service.delete(request);

            // Tests
            expect(userRepository.findById).toHaveBeenCalledWith('uuid-123');
            expect(profileRepository.findByUserId).toHaveBeenCalledWith(
                'uuid-123',
            );
            expect(profileRepository.delete).toHaveBeenCalledWith(mockProfile);
            expect(userRepository.delete).toHaveBeenCalledWith(mockUser);
        });

        it('Debe lanzar UNAUTHORIZED si el usuario intenta borrar a otro', async () => {
            // Encuentra al usuario
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const request = new DeleteReq({
                id: 'uuid-123',
                authUser: new User({ id: 'otro-uuid' }),
            });

            // Assert
            await expect(service.delete(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.delete(request)).rejects.toThrow(
                Errors.UNAUTHORIZED.message,
            );
        });

        it('Debe lanzar USER_NOT_FOUND si el usuario no existe', async () => {
            // No encuentra al usuario
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);

            const request = new DeleteReq({
                id: 'uuid-inexistente',
                authUser: mockUser,
            });

            // Assert
            await expect(service.delete(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.delete(request)).rejects.toThrow(
                Errors.USER_NOT_FOUND.message,
            );
        });
    });

    // Test del metodo edit

    describe('edit', () => {
        it('Debe lanzar UNAUTHORIZED si no se provee un usuario autenticado', async () => {
            const request = new EditReq({
                id: 'uuid-123',
                body: new EditBody({ fullName: 'New Name' }),
            });

            // Assert
            await expect(service.edit(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.edit(request)).rejects.toThrow(
                Errors.UNAUTHORIZED.message,
            );
        });

        it('Debe lanzar USER_NOT_FOUND si el usuario no existe', async () => {
            // No encuentra al usuario
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(null);

            const request = new EditReq({
                id: 'uuid-inexistente',
                authUser: mockUser,
                body: new EditBody({ fullName: 'New Name' }),
            });

            // Assert
            await expect(service.edit(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.edit(request)).rejects.toThrow(
                Errors.USER_NOT_FOUND.message,
            );
        });

        it('Debe editar un usuario exitosamente', async () => {
            const editBody = new EditBody({
                fullName: 'Julian Updated',
                shortDescription: 'Updated Desc',
                email: 'updated@test.com',
                phoneNumber: '+5491122334466',
                address: 'Updated Street 456',
            });
            const updatedUser = new User({
                ...mockUser,
                email: editBody.email,
            });
            const updatedProfile = new Profile({
                ...mockProfile,
                fullName: editBody.fullName,
                shortDescription: editBody.shortDescription,
                phoneNumber: editBody.phoneNumber,
                address: editBody.address,
            });

            // Encuentra al usuario original
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );
            (mockProfileRepository.findByUserId as jest.Mock).mockResolvedValue(
                mockProfile,
            );

            // Simula actualizacion
            (mockUserRepository.update as jest.Mock).mockResolvedValue(
                updatedUser,
            );
            (mockProfileRepository.update as jest.Mock).mockResolvedValue(
                updatedProfile,
            );

            const request = new EditReq({
                id: 'uuid-123',
                authUser: mockUser,
                body: editBody,
            });

            const result = await service.edit(request);

            // Tests
            expect(result).toBeDefined();
            expect(result.fullName).toBe(editBody.fullName);
            expect(result.address).toBe(editBody.address);
            expect(userRepository.update).toHaveBeenCalled();
            expect(profileRepository.update).toHaveBeenCalled();
        });

        it('Debe lanzar UNAUTHORIZED si el usuario intenta editar a otro', async () => {
            // Encuentra al usuario
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const request = new EditReq({
                id: 'uuid-123',
                authUser: new User({ id: 'otro-uuid' }),
                body: new EditBody({ fullName: 'New Name' }),
            });

            // Assert
            await expect(service.edit(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.edit(request)).rejects.toThrow(
                Errors.UNAUTHORIZED.message,
            );
        });

        it('Debe lanzar EMAIL_ALREADY_EXISTS si el email ya esta en uso', async () => {
            const editBody = new EditBody({
                email: 'existente@test.com',
                fullName: 'New Name',
            });

            // Encuentra al usuario original
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );
            (mockProfileRepository.findByUserId as jest.Mock).mockResolvedValue(
                mockProfile,
            );

            // Simula que ya existe otro usuario con ese email
            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(
                new User({ id: 'otro-user', email: 'existente@test.com' }),
            );

            const request = new EditReq({
                id: 'uuid-123',
                authUser: mockUser,
                body: editBody,
            });

            // Assert
            await expect(service.edit(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.edit(request)).rejects.toThrow(
                Errors.EMAIL_ALREADY_EXISTS.message,
            );
        });
    });

    // Test del metodo searchUsers

    describe('searchUsers', () => {
        it('Debe lanzar UNAUTHORIZED si no se provee un usuario autenticado', async () => {
            const request = new SearchUsersReq({ page: 1, size: 10 });

            // Assert
            await expect(service.searchUsers(request)).rejects.toThrow(
                ServiceException,
            );
            await expect(service.searchUsers(request)).rejects.toThrow(
                Errors.UNAUTHORIZED.message,
            );
        });

        it('Debe retornar una lista paginada de usuarios', async () => {
            const pageContent = new PageContent<Profile>({
                content: [mockProfile],
                page: 1,
                nextPage: null,
            });

            // Retorna la pagina de perfiles
            (mockProfileRepository.findAll as jest.Mock).mockResolvedValue(
                pageContent,
            );
            // Retorna lista de usuarios
            (mockUserRepository.findByIds as jest.Mock).mockResolvedValue([
                mockUser,
            ]);

            const request = new SearchUsersReq({
                page: 1,
                size: 10,
                fullName: 'Julian',
                authUser: mockUser,
            });

            const result = await service.searchUsers(request);

            // Tests
            expect(result).toBeDefined();
            expect(result.users.length).toBe(1);
            expect(result.users[0].fullName).toBe(mockProfile.fullName);
            expect(userRepository.findByIds).toHaveBeenCalledWith([
                mockProfile.userId,
            ]);
        });
    });

    // Test de metodos de busqueda y registro

    describe('Persistencia y Busqueda', () => {
        it('Debe registrar un usuario', async () => {
            // Simula el guardado
            (mockUserRepository.save as jest.Mock).mockResolvedValue(mockUser);
            (mockProfileRepository.save as jest.Mock).mockResolvedValue(
                mockProfile,
            );

            const result = await service.register(mockUser, mockProfile);

            // Tests
            expect(result).toEqual(mockUser);
            expect(userRepository.save).toHaveBeenCalledWith(mockUser);
            expect(profileRepository.save).toHaveBeenCalledWith(mockProfile);
        });

        it('Debe encontrar un usuario por email', async () => {
            // Busca por email
            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const result = await service.findByEmail('test@test.com');

            // Tests
            expect(result).toEqual(mockUser);
            expect(userRepository.findByEmail).toHaveBeenCalledWith(
                'test@test.com',
            );
        });

        it('Debe encontrar un usuario por id', async () => {
            // Busca por ID
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const result = await service.findById('uuid-123');

            // Tests
            expect(result).toEqual(mockUser);
            expect(userRepository.findById).toHaveBeenCalledWith('uuid-123');
        });

        it('Debe encontrar un perfil por userId', async () => {
            // Busca perfil por userId
            (mockProfileRepository.findByUserId as jest.Mock).mockResolvedValue(
                mockProfile,
            );

            const result = await service.findProfileByUserId('uuid-123');

            // Tests
            expect(result).toEqual(mockProfile);
            expect(profileRepository.findByUserId).toHaveBeenCalledWith(
                'uuid-123',
            );
        });
    });
});
