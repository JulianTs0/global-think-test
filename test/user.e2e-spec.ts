import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import {
    Errors,
    GlobalConstraintHandler,
    GlobalExceptionHandler,
} from 'src/commons';
import { TestDatabaseHelper } from './utils/test-database.helper';

jest.setTimeout(30000);

describe('UserModule (e2e)', () => {
    let app: INestApplication;
    let dbHelper: TestDatabaseHelper;

    // Configuracion inicial

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [TestDatabaseHelper],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new GlobalConstraintHandler());
        app.useGlobalFilters(new GlobalExceptionHandler());

        await app.init();

        dbHelper = moduleFixture.get<TestDatabaseHelper>(TestDatabaseHelper);
    });

    // Limpiar la bdd

    afterEach(async () => {
        await dbHelper.cleanDatabase();
    });

    // Cerrar las conecciones

    afterAll(async () => {
        await dbHelper.closeConnection();
        await app.close();
    });

    // Mocks de usuarios

    const user1 = {
        fullName: 'User One',
        shortDescription: 'First User',
        email: 'user1@test.com',
        password: 'Password123!',
        phoneNumber: '+5491100000001',
    };

    const user2 = {
        fullName: 'User Two',
        shortDescription: 'Second User',
        email: 'user2@test.com',
        password: 'Password123!',
        phoneNumber: '+5491100000002',
    };

    // Funcion helper

    async function registerAndLogin(userData: any) {
        const registerRes = await request(app.getHttpServer())
            .post('/auth/register')
            .send(userData)
            .expect(201);

        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: userData.email, password: userData.password })
            .expect(200);

        return {
            id: registerRes.body.id,
            token: loginRes.body.token.accessToken,
        };
    }

    describe('Flujo de Obtención de Perfil (GET /users/:id)', () => {
        it('Debe obtener el perfil del propio usuario (Status 200)', async () => {
            const { id, token } = await registerAndLogin(user1);

            return request(app.getHttpServer())
                .get(`/users/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(id);
                    expect(res.body.shortDescription).toBe(
                        user1.shortDescription,
                    );
                    expect(res.body.phoneNumber).toBe(user1.phoneNumber);
                    expect(res.body.fullName).toBe(user1.fullName);
                    expect(res.body.email).toBe(user1.email);
                });
        });

        it('Debe obtener el perfil de otro usuario (Status 200)', async () => {
            const { id: id1, token: token1 } = await registerAndLogin(user1);
            const { id: id2 } = await registerAndLogin(user2);

            return request(app.getHttpServer())
                .get(`/users/${id2}`)
                .set('Authorization', `Bearer ${token1}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(id2);
                    expect(res.body.fullName).toBe(user2.fullName);
                });
        });

        it('Debe fallar (401) si no se envía token', async () => {
            const { id } = await registerAndLogin(user1);

            return request(app.getHttpServer())
                .get(`/users/${id}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe(Errors.UNAUTHORIZED.message);
                });
        });

        it('Debe fallar (404) si el ID no existe', async () => {
            const { token } = await registerAndLogin(user1);
            const nonExistentId = '60d5f1f1f1f1f1f1f1f1f1f1';

            return request(app.getHttpServer())
                .get(`/users/${nonExistentId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404)
                .expect((res) => {
                    expect(res.body.message).toBe(
                        Errors.USER_NOT_FOUND.message,
                    );
                });
        });
    });

    describe('Flujo de Edición de Perfil (PUT /users/:id)', () => {
        it('Debe permitir editar el propio perfil (Status 200)', async () => {
            const { id, token } = await registerAndLogin(user1);
            const updateData = {
                fullName: 'User One Updated',
                shortDescription: 'Updated Bio',
                email: 'user1.updated@test.com',
                phoneNumber: '+5491199999999',
            };

            return request(app.getHttpServer())
                .put(`/users/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(updateData)
                .expect(200)
                .expect((res) => {
                    expect(res.body.fullName).toBe(updateData.fullName);
                    expect(res.body.shortDescription).toBe(
                        updateData.shortDescription,
                    );
                    expect(res.body.email).toBe(updateData.email);
                });
        });

        it('Debe fallar (401) al intentar editar el perfil de otro usuario', async () => {
            const { token: token1 } = await registerAndLogin(user1);
            const { id: id2 } = await registerAndLogin(user2);

            const updateData = {
                fullName: 'Hacker Name',
                shortDescription: 'I am a hacker',
                email: 'hacker@test.com',
                phoneNumber: '+5491111111111',
            };

            return request(app.getHttpServer())
                .put(`/users/${id2}`)
                .set('Authorization', `Bearer ${token1}`)
                .send(updateData)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe(Errors.UNAUTHORIZED.message);
                });
        });

        it('Debe fallar (400) con datos de entrada inválidos', async () => {
            const { id, token } = await registerAndLogin(user1);
            const invalidData = {
                fullName: 'Inv4líd N4me',
                shortDescription: 'Bio',
                email: 'not-an-email',
                phoneNumber: '+5491100000000',
            };

            return request(app.getHttpServer())
                .put(`/users/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(invalidData)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe(
                        Errors.INVALID_FIELDS.message,
                    );
                });
        });
    });

    describe('Flujo de Búsqueda de Usuarios (GET /users)', () => {
        it('Debe listar usuarios con paginación', async () => {
            const { token } = await registerAndLogin(user1);
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(user2)
                .expect(201);

            return request(app.getHttpServer())
                .get('/users?page=1&size=10')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.users)).toBe(true);
                    expect(res.body.users.length).toBeGreaterThanOrEqual(2);
                });
        });

        it('Debe filtrar usuarios por nombre', async () => {
            const { token } = await registerAndLogin(user1);
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(user2)
                .expect(201);

            return request(app.getHttpServer())
                .get('/users?fullName=One&page=1&size=10')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.users.length).toBe(1);
                    expect(res.body.users[0].fullName).toContain('One');
                });
        });
    });

    describe('Flujo de Eliminación de Usuario (DELETE /users/:id)', () => {
        it('Debe permitir eliminar la propia cuenta (Status 204)', async () => {
            const { id, token } = await registerAndLogin(user1);

            await request(app.getHttpServer())
                .delete(`/users/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204);

            // Verificar que ya no existe
            return request(app.getHttpServer())
                .get(`/users/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });

        it('Debe fallar (401) al intentar eliminar otra cuenta', async () => {
            const { token: token1 } = await registerAndLogin(user1);
            const { id: id2 } = await registerAndLogin(user2);

            return request(app.getHttpServer())
                .delete(`/users/${id2}`)
                .set('Authorization', `Bearer ${token1}`)
                .expect(401)
                .expect((res) => {
                    expect(res.body.message).toBe(Errors.UNAUTHORIZED.message);
                });
        });
    });
});
