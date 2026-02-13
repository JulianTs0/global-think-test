# Global Think Test - Backend

Este proyecto es una API REST construida con **NestJS**, siguiendo los conocimientos mis arquitectura separando el dominio de la infraestructura y la persistencia.

## 🏗 Estructura del Proyecto

El proyecto sigue una estructura modular simplificada

```
src/
├── auth/               # Módulo de Autenticación (Login, Registro, Guards)
├── commons/            # Capa de Dominio Compartido (Entidades, Errores, Utils)
│   ├── entity/         # Entidades de Negocio (User, Profile) - Agnósticas a la BDD
│   └── errors/         # Manejo estandarizado de errores
├── config/             # Configuración de la aplicación (Variables de entorno)
├── database/           # Configuración de conexión a MongoDB
├── users/              # Módulo de Usuarios
│   ├── domain/         # Capa de Negocio
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── repository/ # Interfaces del Repositorio (Inversión de Dependencias)
│   │   └── services/   # Lógica de Negocio
│   ├── persistance/    # Capa de Infraestructura (Implementación de Repositorios)
│   │   ├── datasource/ # Modelos de Mongoose (User, Profile) y DAOs
│   │   └── repository/ # Implementación de la interfaz del dominio usando DAOs
│   └── presentation/   # Capa de Presentación (Controllers)
```

### Conceptos Clave

- **Dualidad Entidad/Modelo**: Existen Entidades de Dominio (`User`, `Profile` en `src/commons`) que son objetos puros de TypeScript, y Modelos de Persistencia (`UserModel`, `ProfileModel` en `src/users/persistance`) que son esquemas de Mongoose. Los `Mappers` se encargan de transformar entre unos y otros.
- **Separación Usuario/Perfil**: El `User` contiene solo datos de autenticación (email, passwordHash), mientras que el `Profile` contiene datos personales (nombre, teléfono, dirección).

---

## ⚙️ Configuración de Variables de Entorno

El proyecto requiere la configuración de archivos `.env` para su correcto funcionamiento en diferentes entornos.

### 1. Archivo `.env` (Desarrollo)

Este archivo se utiliza para el entorno de desarrollo local (`start:dev`).
Debe crearse en la raíz del proyecto con el siguiente contenido:

```ini
NODE_ENV=dev
MONGO_URI=mongodb://develop:develop@localhost:27017/global-think-db_dev?authSource=admin
PORT=3000
JWT_SECRET="Inserte su frase favorita de la ficcion"
JWT_EXPIRATION=3600
```

### 2. Archivo `.env.test` (Testing)

Este archivo es **crítico** para la ejecución de los tests E2E.
Debe contener la configuración apuntando a la base de datos de test (puerto 27018):

```ini
NODE_ENV=test
MONGO_URI=mongodb://tester:tester@127.0.0.1:27018/fortune_test?authSource=admin
PORT=3001
JWT_SECRET="Inserte su frase favorita de la ficcion"
JWT_EXPIRATION=3600
```

### 3. Archivo `.env_template`

Plantilla de referencia para nuevos desarrolladores. Copiar este archivo a `.env` y ajustar valores si es necesario.

```ini
NODE_ENV=dev
MONGO_URI=mongodb://develop:develop@localhost:27017/global-think-db_dev?authSource=admin
PORT=3000
JWT_SECRET="Inserte su frase favorita de la ficcion"
JWT_EXPIRATION=3600
```

---

## 💻 Desarrollo Local

### Prerrequisitos

- Node.js (v18 o superior)
- Docker y Docker Compose

### Pasos para iniciar

1.  **Instalar dependencias:**

    ```bash
    npm install
    ```

2.  **Levantar la Base de Datos de Desarrollo:**
    Utilizamos un archivo docker-compose específico para la base de datos local.

    ```bash
    docker compose -f docker-compose.db.yml up -d
    ```

    Esto levantará MongoDB en el puerto `27017` y Mongo Express en el puerto `8081`.

3.  **Iniciar la Aplicación:**
    ```bash
    npm run start
    ```
    La API estará disponible en `http://localhost:3000`.
    La documentación Swagger estará en `http://localhost:3000/api/docs`.

---

## 🧪 Ejecución de Tests

### Tests Unitarios

Ejecutan pruebas aisladas de los servicios y lógica de negocio.

```bash
npm run test
```

### Tests E2E (End-to-End)

Estos tests levantan una instancia de la aplicación y prueban los endpoints reales contra una base de datos de prueba.

1.  **Levantar Base de Datos de Test:**
    Es importante tener una instancia limpia de Mongo para los tests.

    ```bash
    docker compose -f docker-compose.test.yml up -d
    ```

2.  **Ejecutar los tests:**
    ```bash
    npm run test:e2e
    ```

---

## 🚀 Despliegue en Producción

Para desplegar la aplicación completa (API + Base de Datos) contenerizada para un entorno de producción:

```bash
docker compose up --build -d
```

Esto construirá la imagen de la aplicación basada en el `Dockerfile` optimizado y levantará todos los servicios definidos en `docker-compose.yml`.

### Endpoints Principales

- `POST /auth/register`: Registro de nuevos usuarios (Crea Usuario y Perfil).
- `POST /auth/login`: Inicio de sesión (Devuelve JWT).
- `GET /users`: Búsqueda paginada de usuarios (Requiere Auth).
- `GET /users/:id`: Obtener detalle de usuario y perfil (Requiere Auth).
- `PUT /users/:id`: Editar datos del perfil (Requiere Auth).
