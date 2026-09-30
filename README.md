# PlanCity

PlanCity está compuesto por dos aplicaciones:

- `plancity-api-main`: API REST modular en NestJS, TypeORM y PostgreSQL, con autenticación JWT y RBAC.
- `plancity-frontend`: SPA en React, TypeScript y Vite, con Context API, React Router y cliente Axios.

## Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│                      Docker network                      │
│                                                          │
│  ┌─────────────────────┐     ┌────────────────────────┐  │
│  │  plancity-frontend  │────▶│    plancity-api-main   │  │
│  │  React + Nginx      │     │    NestJS + TypeORM     │  │
│  │  puerto: 80         │     │    puerto: 3001         │  │
│  └─────────────────────┘     └──────────┬─────────────┘  │
│                                         │                │
└─────────────────────────────────────────│────────────────┘
                                          │
                               ┌──────────▼─────────────┐
                               │  PostgreSQL (Supabase)  │
                               │  via DATABASE_URL        │
                               └────────────────────────┘
```

El frontend se compila como archivos estáticos y se sirve con Nginx. El navegador consume la API REST del backend; la base de datos PostgreSQL se configura mediante `DATABASE_URL` y puede ser un proyecto Supabase.

---

## 🚀 Levantar con Docker

### 1. Requisitos previos

- [Docker](https://docs.docker.com/engine/install/) instalado
- Configurar una sola vez el socket de Docker (solo en Linux):

```bash
echo 'export DOCKER_HOST=unix:///var/run/docker.sock' >> ~/.bashrc
source ~/.bashrc
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp plancity-api-main/.env.example plancity-api-main/.env
```

Edita `plancity-api-main/.env`:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:password@host:5432/postgres
JWT_SECRET=un-secreto-seguro-aqui
JWT_EXPIRES_IN=1d
```

### 3. Construir y levantar

```bash
docker compose up --build
```

> La primera vez tarda ~2-3 minutos mientras construye las imágenes.
> Las siguientes veces sin `--build` es casi instantáneo.

---

## 🌐 URLs disponibles

| Servicio        | URL                              | Descripción                        |
|-----------------|----------------------------------|------------------------------------|
| **Frontend**    | http://localhost                 | Aplicación React                   |
| **API**         | http://localhost:3001            | API REST                           |
| **Swagger**     | http://localhost:3001/api/docs   | Documentación interactiva de la API |

---

## 🛠 Comandos útiles

```bash
# Levantar en background (sin bloquear la terminal)
docker compose up -d --build

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f api
docker compose logs -f frontend

# Detener los contenedores
docker compose down

# Reconstruir imágenes desde cero (si cambias dependencias)
docker compose up --build --force-recreate

# Ver estado de los contenedores
docker compose ps
```

---

## 📁 Estructura del proyecto

```
hackaton/
├── docker-compose.yml          # Orquestación de servicios
├── plancity-api-main/          # Backend NestJS
│   ├── Dockerfile
│   ├── .env                    # Variables de entorno (NO subir a git)
│   ├── .env.example            # Plantilla de variables
│   └── src/
│       └── modules/            # auth, users, categories, events, favorites
└── plancity-frontend/          # Frontend React + Vite
    ├── Dockerfile
    ├── nginx.conf              # Configuración de Nginx
    └── src/
```
