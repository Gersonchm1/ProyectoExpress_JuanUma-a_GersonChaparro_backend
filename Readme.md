# Descripcion del proyecto

- KarenFlix es una aplicación full-stack desarrollada con Node.js y Express en el backend y HTML, CSS y JavaScript puro en el frontend. Su objetivo principal es ofrecer una plataforma para gestionar y visualizar películas, permitiendo a los usuarios registrar, calificar y rankear contenido, así como interactuar mediante reseñas y valoraciones.

- El proyecto busca implementar roles diferenciados: los usuarios pueden explorar contenido, crear reseñas y dar likes/dislikes, mientras que los administradores pueden gestionar categorías, aprobar nuevas películas y mantener la plataforma organizada. Además, se garantiza autenticación segura con JWT, validaciones robustas y transacciones confiables en la base de datos MongoDB.

- La aplicación pretende ser un sistema completo de gestión de contenido audiovisual, con funcionalidades como:

- CRUD de usuarios, películas, categorías y reseñas, respetando permisos según rol.

- Rankings ponderados de películas basados en calificaciones, likes/dislikes y fecha de reseñas.

- Filtrado y ordenamiento de películas por popularidad, ranking y categoría.

- Frontend interactivo y responsivo, que consume la API desarrollada en el backend y refleja los datos en tiempo real.

- El backend se estructura de forma modular y escalable, siguiendo buenas prácticas de desarrollo, incluyendo:

- Uso de dotenv para variables de entorno.

- Express-validator para validaciones en endpoints.

- express-rate-limit para limitar abusos.

- Documentación de API con Swagger.

- Manejo centralizado de errores y transacciones en MongoDB.

# Instrucciones de instalacion y uso 

# Proyecto API de Películas, Ratings y Reseñas

## 📄 Descripción

API construida con Node.js, Express y MongoDB para gestionar usuarios, películas, ratings y reseñas.
Incluye autenticación con JWT, roles de usuario y administrador, y rutas protegidas.

---

## 🛠 Requisitos previos

Antes de instalar, necesitas tener:

* Node.js >= 18
* npm >= 9
* MongoDB (local o en la nube, como MongoDB Atlas)
* Git (opcional, si clonas desde un repositorio)

---

## 📁 Instalación

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd nombre-del-proyecto
```

2. **Instalar dependencias**

```bash
npm install
```

> **Explicación de npm:**
>
> * `npm` (Node Package Manager) es el gestor de paquetes de Node.js.
> * `npm install` lee tu `package.json` e instala todas las dependencias del proyecto.
> * Dependencias principales de este proyecto:
>
>   * `dotenv` → carga variables de entorno desde `.env`
>   * `bcrypt` → encriptar contraseñas
>   * `nodemon` → reinicio automático del servidor en desarrollo
>   * `mongodb` → cliente para conectar con MongoDB
>   * `express` → framework para crear la API
>   * `passport` → middleware de autenticación
>   * `passport-jwt` → estrategia JWT para Passport
>   * `jsonwebtoken` → crear y verificar tokens JWT
>   * `cors` → habilitar CORS
>   * `express-rate-limit` → limitar solicitudes para seguridad
>   * `express-validator` → validar inputs de usuarios
>   * `semver` → manejo de versiones semánticas

3. **Configurar archivo `.env`**
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
URI=<tu_uri_mongodb>          # Ej: mongodb://localhost:3000
DB_NAME=<nombre_de_base>      # Ej: peliculasDB
JWT_SECRET=<clave_secreta>    # Ej: una cadena larga y segura
JWT_EXPIRES=<duracion_token>  # Ej: 1d, 2h
ADMIN_KEY=<clave_admin>       # Para crear usuarios administradores
```

---

## 🚀 Uso del proyecto

1. **Levantar el servidor**

```bash
npm start
```

* El servidor correrá en el puerto definido en `.env` (`3000` por defecto).
* Mensaje esperado: `Servidor corriendo en puerto 3000`

2. **Probar rutas**

* **Usuarios:**

  * `POST /api/v1/users/register` → Registro de usuario
  * `POST /api/v1/users/login` → Login de usuario
  * `GET /api/v1/users/profile` → Perfil del usuario (requiere JWT)

* **Admin:**

  * `GET /api/v1/admin/dashboard` → Solo admins (requiere JWT y rol admin)

* **Películas:**

  * `GET /api/v1/peliculas` → Listar todas
  * `GET /api/v1/peliculas/top-rated` → Mejor rating
  * `GET /api/v1/peliculas/top-viewed` → Más vistas

* **Ratings:**

  * `POST /api/v1/ratings/{id_pelicula}` → Añadir rating (JWT requerido)

* **Reseñas:**

  * `GET /api/v1/resenas/{id_pelicula}` → Listar reseñas
  * `POST /api/v1/resenas/{id_pelicula}` → Crear reseña (JWT requerido)
  * `PUT /api/v1/resenas/{id_resena}` → Actualizar reseña (JWT requerido)
  * `DELETE /api/v1/resenas/{id_resena}` → Eliminar reseña (JWT requerido)

> 💡 Todas las rutas protegidas requieren enviar en el header:

```http
Authorization: Bearer <tu_token_jwt>
```

---

## 🧪 Ejemplos de payload JSON

* **Registro de usuario:**

```json
{
  "name": "Juan",
  "email": "juan@mail.com",
  "password": "123456"
}
```

* **Login:**

```json
{
  "email": "juan@mail.com",
  "password": "123456"
}
```

* **Crear reseña:**

```json
{
  "comentario": "Excelente película",
  "calificacion": 5
}
```

* **Añadir rating:**

```json
{
  "rating": 4
}
```

---

## 🧪 Probar con Postman o Swagger

1. **Postman:** importar endpoints y probar con JSON en body y JWT en headers.
2. **Swagger UI:**

* Usa  YAML OpenAPI 

---

## ⚡ Notas importantes

* **JWT Secret:** Debe ser seguro y secreto.
* **Roles:** Solo usuarios con rol `admin` pueden acceder a rutas de admin.
* **MongoDB:** Si usas Atlas, permite tu IP en la whitelist.
* **Versionado de API:** Todas las rutas usan `/api/v1/...` para permitir futuras versiones sin romper clientes.

---

## 📝 Comandos útiles

```bash
# Levantar servidor en desarrollo (reinicio automático)
npm run dev

# Levantar servidor en producción
npm start

# Instalar nuevas dependencias
npm install <nombre_paquete>

# Actualizar dependencias
npm update
```


# Estructura del proyecto

# Principios 