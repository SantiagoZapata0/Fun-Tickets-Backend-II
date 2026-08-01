# Fun Tickets

Fun Tickets es una API backend para una pagina de venta de tickets para recitales musicales. El proyecto permite consultar usuarios, eventos, tickets vendidos y un endpoint de health check.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- pnpm
- bcrypt
- JWT (JSON Web Token)
- Cookie-parser
- Passport (JWT & Local)
- Nodemailer

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
JWT_EXPIRES_IN=1h
MAIL_HOST=smtp.server 
MAIL_PORT=587 
MAIL_USER=smtp@ethereal.email
MAIL_PASS=password123
MAIL_FROM=smtp@ethereal.email 
```

Variables disponibles:

| Variable        | Descripcion                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| `PORT`          | Puerto donde se ejecuta el servidor.                                        |
| `MONGO_URL`     | URL de conexion a la base de datos MongoDB.                                 |
| `NODE_ENV`      | Entorno de ejecución (development / production)                             |
| `JWT_SECRET`    | Clave secreta para tokens JWT                                               | 
| `JWT_EXPIRES_IN`| Tiempo de expiracion del JWT (ej: "1h")                                     |
| `MAIL_HOST`     | Host del servidor SMTP                                                      |
| `MAIL_PORT`     | Puerto del servidor SMTP                                                    |
| `MAIL_USER`     | Usuario/cuenta de email                                                     |
| `MAIL_PASS`     | Contraseña de la cuenta (o contraseña de aplicación)                        |
| `MAIL_FROM`     | Dirección que figura como remitente                                         |

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
|-- src
    |-- app.js
    |-- server.js
    |-- public/
    |-- views/
    |-- services/
    |   |-- category.service.js
    |   |-- user.service.js
    |   |-- ticket.service.js
    |   |-- event.service.js
    |-- repositories/
    |   |-- category.repository.js
    |   |-- user.repository.js
    |   |-- ticket.repository.js
    |   |-- event.repository.js
    |-- middlewares/
    |   |-- passport.middleware.js
    |   |-- auth.middleware.js
    |-- utils/
    |   |-- utils.js
    |   |-- jwt.js
    |   |-- hash.js
    |-- dao/
    |   |-- common.dao.js
    |   |-- user.dao.js
    |   |-- event.dao.js
    |   |-- ticket.dao.js
    |   |-- category.dao.js
    |-- config/
    |   |-- database.js
    |   |-- env.js
    |   |-- passport.js
    |   |-- nodemailer.js
    |-- controllers/
    |   |-- event.controller.js
    |   |-- ticket.controller.js
    |   |-- session.controller.js
    |   |-- user.controller.js
    |   |-- category.controller.js
    |-- models/
    |   |-- event.model.js
    |   |-- ticket.model.js
    |   |-- user.model.js
    |   |-- category.model.js
    |-- routes/
    |   |-- event.routes.js
    |   |-- ticket.routes.js
    |   |-- session.routes.js
    |   |-- user.routes.js
    |   |-- category.routes.js
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

## Roles y autorización

El sistema implementa autorización basada en roles sobre la autenticación ya existente (JWT + cookies). Hay tres roles: `user` (default), `organizer` y `admin`. El registro público (`POST /api/sessions/register`) siempre crea usuarios con `role: "user"`; los roles `organizer` y `admin` no pueden asignarse desde el body de la petición.

### Matriz de permisos

| Acción | user | organizer | admin |
| --- | --- | --- | --- |
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar/cancelar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

### Middlewares de autenticación y autorización

**`passportError("jwt")`** (autenticación)
Lee el JWT desde la cookie `currentUser`, lo verifica, y puebla `req.user` con `{ id, email, role }`. Si no hay cookie o el token es inválido/expiró, responde `401`.

**`authRoles(roles)`** (autorización por rol)
Middleware reutilizable que recibe un array de roles permitidos. Compara `req.user.role` contra esa lista; si no coincide, responde `403`. Ejemplo de uso:
```js
router.post("/", passportError("jwt"), authRoles(["organizer", "admin"]), createNewEvent);
```

**`validateAdminOrOwner`** (autorización por propiedad del recurso)
Middleware específico para rutas que modifican un evento puntual. Permite el acceso si el usuario es `admin`, o si es `organizer` **y** es el dueño del evento (`event.organizer === req.user.id`). En cualquier otro caso, responde `403`.

### Diferencia entre 401 y 403

- **`401 Unauthorized`** → no hay sesión válida (falta la cookie, el token expiró o fue manipulado). El servidor no sabe quién sos.
- **`403 Forbidden`** → hay una sesión válida (el servidor sabe quién sos), pero tu rol o tu relación con el recurso no te habilita para esa acción.

### Rutas protegidas

| Método | Ruta | Middleware | Roles permitidos |
| --- | --- | --- | --- |
| `GET` | `/api/sessions/current` | `passportError("jwt")` | Cualquier usuario autenticado |
| `POST` | `/api/events` | `passportError("jwt")` + `authRoles` | `organizer`, `admin` |
| `PUT` | `/api/events/:eid` | `passportError("jwt")` + `validateAdminOrOwner` | `admin`, o `organizer` dueño del evento |
| `GET` | `/api/users` | `passportError("jwt")` + `authRoles` | `admin` |

### Ejemplos de respuesta

**Sin permisos (403):**
```json
{ "status": "Failed", "message": "No tenés permisos para realizar esta acción" }
```

**Sin sesión (401):**
```json
{ "status": "Failed", "message": "No autenticado" }
```

## Categorías

`Category` es una entidad de referencia usada por `Event` (`category: ObjectId`). Permite mantener un listado consistente de categorías válidas en vez de strings libres sueltos en cada evento.

### Modelo Category

| Campo | Tipo | Detalle |
| --- | --- | --- |
| `name` | String | Obligatorio, único |

### Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| `GET` | `/api/categories` | Público |
| `POST` | `/api/categories` | `admin` |

Al crear o modificar un evento, el campo `category` debe corresponder al `id` de una categoría existente; si no, la petición responde `404`.

## Entidad Events

### Modelo Event

| Campo | Tipo | Detalle |
| --- | --- | --- |
| `title` | String | Obligatorio |
| `description` | String | Obligatorio |
| `category` | String | Obligatorio |
| `date` | Date | Obligatorio; no puede ser una fecha pasada al crear |
| `location` | String | Obligatorio |
| `capacity` | Number | Obligatorio, debe ser mayor a 0 |
| `price` | Number | Debe ser mayor o igual a 0 (default: 0) |
| `status` | String | `draft` \| `published` \| `cancelled` \| `finished` (default: `draft`) |
| `organizer` | ObjectId | Referencia al `User` que creó el evento. Se asigna automáticamente desde la sesión, nunca desde el body |

### Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/api/events` | `organizer`, `admin` |
| `GET` | `/api/events` | Público |
| `GET` | `/api/events/:id` | Público |
| `PUT` | `/api/events/:id` | Dueño del evento o `admin` |
| `PATCH` | `/api/events/:id/status` | Dueño del evento o `admin` |


### Reglas de negocio

- Al crear un evento, `organizer` se asigna automáticamente desde `req.user`. No se puede manipular desde el body.
- Un `organizer` solo puede modificar (`PUT` o `PATCH /status`) sus propios eventos. Un `admin` puede modificar cualquiera.
- No se puede crear un evento con `date` pasada.
- No se puede publicar (`status: "published"`) un evento que ya esté `finished` o `cancelled`.
- No se puede modificar (ni con `PUT` ni con `PATCH /status`) un evento que esté `cancelled`.
- `capacity` debe ser mayor a 0; `price` no puede ser negativo.
- Los eventos nunca se eliminan físicamente. "Cancelar" un evento significa cambiar su `status` a `cancelled`.
- Todas las validaciones de negocio viven en la capa de `services`, no en rutas ni controllers.

### Listado con filtros (`GET /api/events`)

Query params disponibles:

| Parámetro | Descripción |
| --- | --- |
| `status` | Filtra por estado exacto (`draft`, `published`, `cancelled`, `finished`) |
| `category` | Filtra por categoría exacta |
| `location` | Filtra por ubicación exacta |
| `dateFrom` | Eventos desde esta fecha (inclusive) |
| `dateTo` | Eventos hasta esta fecha (inclusive) |
| `page` | Número de página (default: 1) |
| `limit` | Resultados por página (default: 10) |
| `sort` | Campo de ordenamiento (ej: `date`, `-date` para descendente) |

**Ejemplo:**

GET /api/events?status=published&category=workshop&page=1&limit=5

**Respuesta:**
```json
{
    "status": "Success",
    "payload": {
        "data": [ /* array de eventos */ ],
        "page": 1,
        "limit": 5,
        "total": 12,
        "totalPages": 3
    }
}
```

### Cambiar estado de un evento

`PATCH /api/events/:id/status`

**Body:**
```json
{ "status": "published" }
```

Valores posibles: `draft`, `published`, `cancelled`, `finished`. Sujeto a las reglas de negocio (no se puede publicar un evento cancelado/finalizado, no se puede modificar un evento ya cancelado).

## Tickets, inscripciones y control de cupos

### Modelo Ticket

| Campo | Tipo | Detalle |
| --- | --- | --- |
| `user` | ObjectId | Referencia al usuario que se inscribió (obligatorio) |
| `event` | ObjectId | Referencia al evento (obligatorio) |
| `status` | String | `confirmed` \| `pending` \| `cancelled` (default: `confirmed`) |
| `quantity` | Number | Cantidad de lugares reservados en este ticket (mínimo 1) |
| `reservationCode` | String | Código único generado automáticamente por el sistema, nunca por el cliente |
| `createdAt` | Date | Generado automáticamente (timestamps) |
| `cancelledAt` | Date | Se completa solo al cancelar; `null` mientras el ticket esté activo |

### Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| `POST` | `/api/events/:eid/tickets` | Cualquier usuario autenticado |
| `GET` | `/api/tickets/my-tickets` | Autenticado (solo sus propios tickets) |
| `GET` | `/api/events/:eid/tickets` | Dueño del evento (`organizer`) o `admin` |
| `PATCH` | `/api/tickets/:tid/cancel` | Dueño del ticket o `admin` |

### Flujo de inscripción (`POST /api/events/:eid/tickets`)

1. El evento debe existir (si no, `404`).
2. El evento debe estar en estado `published` (si está en `draft`, `cancelled` o `finished`, error `400`).
3. La `quantity` solicitada debe ser un número mayor a 0.
4. El usuario no puede tener ya un ticket activo para ese mismo evento (si lo tiene, error `400`/`409`).
5. Debe haber cupo disponible: `capacity` del evento menos la suma de `quantity` de todos los tickets **no cancelados** de ese evento.
6. Si todas las validaciones pasan, se genera un `reservationCode` único, se crea el ticket con `status: "confirmed"`, y se envía un email de confirmación al usuario.

### Regla de cupos

Los cupos ocupados se calculan sumando el campo `quantity` de todos los tickets de un evento **cuyo `status` no sea `cancelled`**. Un ticket cancelado libera automáticamente ese espacio: no se resta manualmente, simplemente deja de contarse en la suma.

### Cancelación (`PATCH /api/tickets/:tid/cancel`)

- El ticket debe existir (`404` si no).
- Solo puede cancelarlo el dueño del ticket o un `admin` (`403` en cualquier otro caso).
- No se puede cancelar un ticket que ya esté cancelado (`400`).
- Cancelar **no borra** el documento: cambia `status` a `cancelled` y completa `cancelledAt` con la fecha actual.

### Notificaciones por email (Nodemailer)

Al confirmarse una inscripción, se envía automáticamente un email con los datos del evento, la cantidad reservada y el código de reserva. Si el envío del email falla, el error se registra en consola pero **no afecta** la creación del ticket (el usuario ya tiene su lugar reservado independientemente del email).

**Variables de entorno necesarias:**

| Variable | Descripción |
| --- | --- |
| `MAIL_HOST` | Host del servidor SMTP |
| `MAIL_PORT` | Puerto del servidor SMTP |
| `MAIL_USER` | Usuario/cuenta de email |
| `MAIL_PASS` | Contraseña de la cuenta (o contraseña de aplicación) |
| `MAIL_FROM` | Dirección que figura como remitente |

> En desarrollo se usa [Ethereal Email](https://ethereal.email/), un servicio de testing que no envía correos reales: los emails quedan disponibles para previsualizar mediante un link generado por Nodemailer, sin llegar a ninguna bandeja de entrada real.

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

## Estado actual

El proyecto cuenta con autenticación completa (JWT + cookies + Passport), 
autorización por roles, CRUD completo de eventos con filtros y paginación, 
categorías como entidad propia, y el flujo completo de inscripciones: 
creación de tickets con control de cupos, cancelaciones, y notificaciones 
por email con Nodemailer.