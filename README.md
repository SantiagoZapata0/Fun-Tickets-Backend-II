# Fun Tickets

Fun Tickets es una API backend para una pagina de venta de tickets para recitales musicales. El proyecto permite consultar usuarios, eventos, tickets vendidos y un endpoint de health check.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- pnpm

## Instalacion

1. Clonar el repositorio o descargar el proyecto.
2. Entrar a la carpeta del proyecto:

```bash
cd "Backend II Clase 1"
```

3. Instalar las dependencias:

```bash
pnpm install
```

## Configuracion de variables de entorno

Crear un archivo `.env` en la raiz del proyecto con las siguientes variables:

```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017/fun-tickets
NODE_ENV=development
JWT_SECRET=mi_secreto
```

Variables disponibles:

| Variable        | Descripcion                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `PORT`          | Puerto donde se ejecuta el servidor.                                        |
| `MONGO_URL`     | URL de conexion a la base de datos MongoDB.                                 |
| `NODE_ENV`      | Entorno de ejecución (development / production)                             |
| `JWT_SECRET`    | Clave secreta para tokens JWT                                               | 
| `JWT_EXPIRES_IN`| Tiempo de expiracion del JWT (ej: "1h")                                     |

## Como ejecutar

Modo desarrollo:

```bash
pnpm run dev
```

Modo produccion:

```bash
pnpm start
```

La API queda disponible en:

```text
http://localhost:8080
```

> Nota: si cambias el valor de `PORT` en el archivo `.env`, tambien cambia el puerto de la URL.

## Estructura de carpetas

```text
.
|-- package.json
|-- pnpm-lock.yaml
|-- README.md
`-- src
    |-- app.js
    |-- server.js
    |-- public/
    |-- views/
    |-- services/
        |-- user.services.js
    |-- repositories/
    |   |-- user.repository.js
    |-- middlewares/
    |   |-- passport.middleware.js
    |-- utils/
    |   |-- utils.js
    |   |-- jwt.js
    |   |-- hash.js
    |-- dao/
    |   |-- common.dao.js
    |   |-- user.dao.js
    |   |-- event.dao.js
    |   |-- ticket.dao.js
    |-- config/
    |   |-- database.js
    |   `-- env.js
    |-- controllers/
    |   |-- event.controller.js
    |   |-- ticket.controller.js
    |   |-- session.controller.js
    |   `-- user.controller.js
    |-- models/
    |   |-- event.model.js
    |   |-- ticket.model.js
    |   `-- user.model.js
    `-- routes/
        |-- event.routes.js
        |-- ticket.routes.js
        |-- session.routes.js
        `-- user.routes.js
```

## Notas sobre la arquitectura

El proyecto sigue una arquitectura en capas: Ruta → Controller → Service → 
Repository → DAO → Modelo. El flujo de registro de usuarios (`/api/sessions/register`) 
implementa el patrón completo.

## Autenticación con Passport.js

El sistema de autenticación fue refactorizado para centralizar la lógica en estrategias de Passport, ubicadas en `config/passport.config.js`. Passport se inicializa una sola vez en `app.js` (`passport.initialize()`); ninguna estrategia vive ahí.

### Estrategias implementadas

**`register`** (Local Strategy)
Valida los campos, normaliza el email, verifica que no exista un usuario duplicado, hashea la contraseña y crea el usuario. Toda la lógica vive en `services/user.service.js` (`registerUser`); la estrategia solo la invoca.

**`login`** (Local Strategy)
Verifica que el email exista y que la contraseña coincida (usando bcrypt). Si las credenciales son inválidas, responde siempre con el mismo mensaje genérico, sin distinguir la causa. La estrategia **no genera el JWT**: solo autentica y deja el usuario en `req.user`. Es el controller quien, tras la autenticación exitosa, genera el token y setea la cookie.

**`current`** (JWT Strategy)
Extrae el token desde la cookie `currentUser` (no desde headers), lo verifica contra `JWT_SECRET`, y deja el payload (`{ id, email, role }`) en `req.user`. Si no hay cookie o el token es inválido/expiró, responde `401`.

### Manejo de errores de Passport

Las estrategias `register` y `login` usan un middleware wrapper (`passportError`) en lugar de `passport.authenticate(...)` directo, para que los mensajes de error específicos definidos en los Services (por ejemplo, `409` en email duplicado o `401` en credenciales inválidas) lleguen intactos al cliente, en vez de la respuesta genérica que da Passport por defecto.

### Preparado para providers externos

`passport.config.js` está estructurado para agregar nuevas estrategias (Google, GitHub, etc.) simplemente sumando un nuevo bloque `passport.use(...)` dentro de `initializePassport()`, sin necesidad de tocar `app.js` ni las rutas existentes.

### Rutas de sesión (actualizado)

| Método | Ruta | Estrategia usada |
| --- | --- | --- |
| `POST` | `/api/sessions/register` | `register` |
| `POST` | `/api/sessions/login` | `login` |
| `GET` | `/api/sessions/current` | `current` (JWT) |
| `POST` | `/api/sessions/logout` | Ninguna (no requiere Passport) |

## Rutas disponibles

### Health

#### `GET /api/health`
Verifica que el servidor esté activo.

**Respuesta (200):**
```json
{ "status": "ok", "message": "Servidor activo" }
```

---

### Sesiones (autenticación)

#### `POST /api/sessions/register`
Registra un nuevo usuario. La contraseña se guarda hasheada y nunca se devuelve.

**Body:**
```json
{
    "first_name": "Santiago",
    "last_name": "Zapata",
    "email": "santiago@gmail.com",
    "password": "123456"
}
```

**Respuesta exitosa (201):**
```json
{
    "status": "Success",
    "message": "Usuario registrado correctamente.",
    "payload": {
        "id": "6a446c5b146207cacaa4ed90",
        "first_name": "Santiago",
        "last_name": "Zapata",
        "email": "santiago@gmail.com",
        "role": "user"
    }
}
```

**Errores posibles:** `400` (campos faltantes, email inválido, password corto), `409` (email ya registrado)

---

#### `POST /api/sessions/login`
Inicia sesión y devuelve un JWT en una cookie `httpOnly` llamada `currentUser`.

**Body:**
```json
{
    "email": "santiago@gmail.com",
    "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
    "status": "Success",
    "payload": {
        "first_name": "Santiago",
        "last_name": "Zapata",
        "email": "santiago@gmail.com",
        "role": "user"
    }
}
```

> El JWT se guarda automáticamente en la cookie `currentUser` (httpOnly, sameSite: lax, expira en 1 hora). No se envía en el body.

**Error (401):** siempre devuelve el mismo mensaje, sin distinguir la causa:
```json
{ "status": "Failed", "payload": "Credenciales inválidas." }
```

---

#### `GET /api/sessions/current`
Devuelve los datos del usuario autenticado. Requiere la cookie `currentUser` válida.

**Respuesta exitosa (200):**
```json
{
    "status": "Success",
    "payload": {
        "id": "6a446c5b146207cacaa4ed90",
        "email": "santiago@gmail.com",
        "role": "user"
    }
}
```

**Error (401):** si falta la cookie o el token es inválido/expiró.
```json
{ "status": "Failed", "payload": "jwt malformed" }
```

---

#### `POST /api/sessions/logout`
Elimina la cookie de sesión.

**Respuesta (200):**
```json
{ "status": "Success", "payload": "Sesión cerrada correctamente." }
```

---

### Usuarios

#### `GET /api/users`
Devuelve todos los usuarios registrados (sin contraseñas).

**Respuesta (200):**
```json
{
    "status": "Success",
    "payload": [
        {
            "id": "6a446c5b146207cacaa4ed90",
            "first_name": "Santiago",
            "last_name": "Zapata",
            "email": "santiago@gmail.com",
            "role": "user"
        }
    ]
}
```

---

### Eventos

#### `GET /api/events`
Devuelve todos los eventos disponibles.

#### `GET /api/events/:id`
Devuelve un evento por su ID.

#### `POST /api/events`
Crea un nuevo evento.

**Body:**
```json
{
    "title": "Bandalos Chinos en Movistar Arena",
    "description": "Presentación de su último álbum en formato acústico",
    "date": "2026-09-20",
    "place": "Movistar Arena",
    "capacity": 8500,
    "price": 12000,
    "status": "active"
}
```

**Respuesta exitosa (201):**
```json
{
    "status": "Success",
    "payload": {
        "id": "6a45a66ffc79d36d6b979e94",
        "title": "Bandalos Chinos en Movistar Arena",
        "description": "Presentación de su último álbum en formato acústico",
        "date": "2026-09-20T00:00:00.000Z",
        "place": "Movistar Arena",
        "capacity": 8500,
        "price": 12000,
        "status": "active"
    }
}
```

**Error:** `409` si ya existe un evento con ese título.

---

### Tickets

#### `GET /api/tickets`
Devuelve todos los tickets generados.

#### `POST /api/tickets`
Crea un ticket, validando que el usuario y el evento existan.

**Body:**
```json
{
    "user": "6a4155dccdb90b7c56ac07ec",
    "event": "6a45a55e752b6c937b4e3567"
}
```

**Respuesta exitosa (201):**
```json
{
    "status": "Success",
    "payload": {
        "id": "6a45a66ffc79d36d6b979e94",
        "user": "6a4155dccdb90b7c56ac07ec",
        "event": "6a45a55e752b6c937b4e3567"
    }
}
```

**Errores posibles:** `400` (faltan campos), `404` (usuario o evento no existe)

## Estado actual

El proyecto cuenta con autenticación completa mediante JWT y cookies HTTP Only 
(registro, login, sesión actual y logout), además de rutas de consulta y 
creación para eventos y tickets. Quedan pendientes: rutas PUT/DELETE, 
autorización por roles, y manejo de stock/capacidad de eventos.