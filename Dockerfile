# ETAPA 1: Base
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# ETAPA 2: Dependencias
FROM base AS dependencies
RUN npm install

# ETAPA 3: Test Unitarios 
FROM dependencies AS test
COPY . .
ENV NODE_ENV=test
ENV MONGO_URI=mongodb://localhost:27017/test
ENV JWT_SECRET=test_secret
ENV JWT_EXPIRATION=3600
RUN npm run test

# ETAPA 4: Build
FROM test AS build
RUN npm run build

# ETAPA 5: Producción
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=prod
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
