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

describe('AuthModule (e2e)', () => {
    // Variables
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

    // Limipiamos la bdd
    afterEach(async () => {
        await dbHelper.cleanDatabase();
    });

    // Al final cerramos la coneccion de la bdd y la app
    afterAll(async () => {
        await dbHelper.closeConnection();
        await app.close();
    });

    // Input
    const validRegisterDto = {
        fullName: 'Juan Perez',
        shortDescription: 'Dev FullStack',
        email: 'juan.perez@test.com',
        password: 'Password123!',
        phoneNumber: '+5491122334455',
    };

    describe('Flujo de Registro (POST /auth/register)', () => {
        it('Debe registrar usuario y devolver solo el ID (Status 201)', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send(validRegisterDto)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(typeof res.body.id).toBe('string');
                });
        });

        it('Debe fallar (400) si la contraseña es débil', () => {
            const weakUser = { ...validRegisterDto, password: 'password' };

            return request(app.getHttpServer())
                .post('/auth/register')
                .send(weakUser)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe(
                        Errors.INVALID_FIELDS.message,
                    );
                });
        });

        it('Debe fallar (400) si el nombre tiene caracteres inválidos', () => {
            const badNameUser = { ...validRegisterDto, fullName: 'Juan123' };

            return request(app.getHttpServer())
                .post('/auth/register')
                .send(badNameUser)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toBe(
                        Errors.INVALID_FIELDS.message,
                    );
                });
        });
    });

    describe('Flujo de Login (POST /auth/login)', () => {
        it('Debe devolver el Token si las credenciales son correctas', async () => {
            await request(app.getHttpServer())
                .post('/auth/register')
                .send(validRegisterDto)
                .expect(201);

            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: validRegisterDto.email,
                    password: validRegisterDto.password,
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.token).toHaveProperty('accessToken');
                });
        });

        it('Debe fallar (400/401) si el usuario no existe', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'fantasma@test.com',
                    password: 'Password123!',
                })
                .expect((res) => {
                    expect(res.status).toBeGreaterThanOrEqual(400);
                    expect(res.body.message).toBe(
                        Errors.USER_NOT_FOUND.message,
                    );
                });
        });
    });
});
