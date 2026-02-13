import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepositoryI } from '../repository/user-repository.interface';
import { Errors, PageContent, ServiceException, User } from 'src/commons';
import { GetByIdReq } from '../dto/users/request/get-by-id.request.dto';
import { DeleteReq } from '../dto/users/request/delete.request.dto';
import { EditReq } from '../dto/users/request/edit.request.dto';
import { EditBody } from '../dto/users/request/edit.body.dto';
import { SearchUsersReq } from '../dto/users/request/search-users.request.dto';

describe('UserService', () => {
    // Variables

    let service: UserService;
    let repository: UserRepositoryI;

    // Mock del UserRepository

    const mockUserRepository = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findAll: jest.fn(),
    };

    const mockUser = new User({
        id: 'uuid-123',
        fullName: 'Julian Test',
        shortDescription: 'Junior Developer',
        email: 'julian@test.com',
        passwordHash: 'hashed_password',
        phoneNumber: '+541122334455',
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
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<UserRepositoryI>(UserRepositoryI);

        jest.clearAllMocks();
    });

    // Test del metodo getById

    describe('getById', () => {
        it('Debe retornar un usuario si existe', async () => {
            // Busca al usuario por ID
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const request = new GetByIdReq({
                id: 'uuid-123',
                authUser: mockUser,
            });

            const result = await service.getById(request);

            // Tests
            expect(result).toBeDefined();
            expect(result.fullName).toEqual(mockUser.fullName);
            expect(repository.findById).toHaveBeenCalledWith('uuid-123');
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
            // Simula eliminacion exitosa
            (mockUserRepository.delete as jest.Mock).mockResolvedValue(null);

            const request = new DeleteReq({
                id: 'uuid-123',
                authUser: mockUser,
            });

            await service.delete(request);

            // Tests
            expect(repository.findById).toHaveBeenCalledWith('uuid-123');
            expect(repository.delete).toHaveBeenCalledWith(mockUser);
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
            });
            const updatedUser = new User({ ...mockUser, ...editBody });

            // Encuentra al usuario original
            (mockUserRepository.findById as jest.Mock).mockResolvedValue(
                mockUser,
            );
            // Simula actualizacion
            (mockUserRepository.update as jest.Mock).mockResolvedValue(
                updatedUser,
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
            expect(repository.update).toHaveBeenCalled();
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
            const pageContent = new PageContent<User>({
                content: [mockUser],
                page: 1,
                nextPage: null,
            });

            // Retorna la pagina de usuarios
            (mockUserRepository.findAll as jest.Mock).mockResolvedValue(
                pageContent,
            );

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
            expect(result.users[0].fullName).toBe(mockUser.fullName);
        });
    });

    // Test de metodos de busqueda y registro

    describe('Persistencia y Busqueda', () => {
        it('Debe registrar un usuario', async () => {
            // Simula el guardado
            (mockUserRepository.save as jest.Mock).mockResolvedValue(mockUser);

            const result = await service.register(mockUser);

            // Tests
            expect(result).toEqual(mockUser);
            expect(repository.save).toHaveBeenCalledWith(mockUser);
        });

        it('Debe encontrar un usuario por email', async () => {
            // Busca por email
            (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(
                mockUser,
            );

            const result = await service.findByEmail('test@test.com');

            // Tests
            expect(result).toEqual(mockUser);
            expect(repository.findByEmail).toHaveBeenCalledWith(
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
            expect(repository.findById).toHaveBeenCalledWith('uuid-123');
        });
    });
});
