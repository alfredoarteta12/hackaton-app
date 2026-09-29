# PlanCity

PlanCity está compuesto por dos aplicaciones:

- `plancity-api`: API REST modular en NestJS, TypeORM y PostgreSQL, con autenticación JWT y RBAC.
- `plancity-frontend`: SPA en React, TypeScript y Vite, con Context API, React Router y cliente Axios.

## Arquitectura

El frontend se compila como archivos estáticos y se sirve con Nginx. El navegador consume la API REST del backend; la base de datos PostgreSQL se configura mediante `DATABASE_URL` y puede ser un proyecto Supabase.

## Ejecutar con Docker

Configura primero `plancity-api/.env` usando `plancity-api/.env.example`, y después ejecuta desde esta carpeta:

```bash
docker compose up --build
```

La aplicación queda disponible en `http://localhost:5173` y la API en `http://localhost:3001`. Para apuntar el frontend a otra API:

```bash
VITE_API_BASE_URL=https://api.example.com docker compose up --build
```
