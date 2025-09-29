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

- revisando la documentacion en swagger

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


## 🧪 Probar con Postman, Swagger o Imsomnia

1. **Postman:** importar endpoints y probar con JSON en body y JWT en headers.
2. **Swagger UI:**


2. **Imsomnia:** importar endpoints y probar con JSON en body y JWT en headers.

* Usa  YAML OpenAPI 

---

## ⚡ Notas importantes

* **JWT Secret:** Debe ser seguro y secreto.
* **Roles:** Solo usuarios con rol `admin` pueden acceder a rutas de admin.
* **MongoDB:** Si usas Atlas, permite tu IP en la whitelist.
* **Versionado de API:** Todas las rutas usan semver para mostrar la version.

---

## 📝 Comandos útiles

```bash

# Levantar servidor para empezar a usarlo
npm start

# Instalar las dependencias disponibles
npm i

# Instalar nuevas dependencias
npm install <nombre_paquete>

# Actualizar dependencias
npm update
```


# Estructura del proyecto

## Config

- db.js # Contiene la informacion de la db

- passsport # Contiene la logica de passport



## Controllers

- adminController.js # controlador de funciones admin


- userController.js # controlador de funciones usuario 

## middleware

- checkrole.js # middleware, para revisar el role

- version.js $ middleware  para poner version

## models

- adminModel.js # modelo de funciones para admin

- userModel.js # modelo de funciones para usuario

## routes

- adminRoute.js # modelo de rutas para acceder como admin

- userRoute.js # mdelo de rutas para acceder como usuario y admin

## swagger

- swagger.yaml # documentacion con openapi

# Principios 

##  Principios Aplicados (SOLID) en este Proyecto

En este proyecto, la estructura se basa en **controladores separados por rol** (`UserController` y `AdminController`) y cada uno maneja las entidades (`Movie`, `Comment`, `Rating`, `Genre`) según lo que el rol puede hacer. Esto permite aplicar SOLID de manera organizada y clara.

---

###  Single Responsibility Principle (SRP)
- Cada **controlador** tiene una única responsabilidad:
  - `UserController` → Funciones disponibles para usuarios regulares: consultar películas, añadir comentarios y calificaciones.
  - `AdminController` → Funciones exclusivas de administrador: crear, actualizar y eliminar películas, comentarios y géneros.
- Cada **modelo** interactúa solo con su colección correspondiente (`pelicula`, `comentario`, `calificacion`, `genero`, `usuario`).

---

###  Open/Closed Principle (OCP)
- Los controladores están **cerrados a modificaciones** pero abiertos a extensiones:
  - Se pueden agregar nuevas funcionalidades en admin o usuario sin alterar la lógica existente.
  - Ejemplo: se puede agregar `updateGenre` en admin sin modificar las funciones de usuario.

---

###  Liskov Substitution Principle (LSP)
- Las funciones comunes como consultar películas (`viewMovies`), comentarios o ratings pueden ser usadas por ambos roles sin romper la funcionalidad.
- Los métodos exclusivos de admin solo se ejecutan si el rol es `admin`.

---

###  Interface Segregation Principle (ISP)
- Los métodos y endpoints están **segmentados por rol**:
  - **Usuario:** consultar películas, añadir comentarios y ratings.
  - **Administrador:** crear, actualizar y eliminar películas, comentarios y géneros.
- Cada rol solo accede a lo que le corresponde, evitando “interfaces grandes” que incluyan funcionalidades innecesarias.

---

###  Dependency Inversion Principle (DIP)
- Los controladores dependen de **modelos abstractos** (`UserModelMovie`, `UserModelComments`, etc.) en lugar de manipular directamente la base de datos.
- Esto permite cambiar la implementación de la DB sin afectar la lógica de negocio.
- La verificación de roles y permisos se maneja a través de **middleware**, manteniendo separación de responsabilidades.

---

###  Beneficios de esta estructura
- Código modular y fácil de mantener.
- Roles claros y bien definidos: Usuario vs Administrador.
- Entidades centralizadas (`Movie`, `Comment`, `Rating`, `Genre`) controladas desde los controladores según permisos.
- Escalable y seguro: nuevas funcionalidades pueden añadirse sin afectar la estructura existente.

## ⚙️ Consideraciones Técnicas

- El proyecto está construido con **Node.js** y **Express**.
- Se utiliza **MongoDB** como base de datos NoSQL.
- La arquitectura sigue el patrón **MVC** (Model-View-Controller).
- La lógica de negocio se separa por roles: **usuario** y **administrador**.
- Se implementa autenticación con **JWT** y control de permisos por roles.
- Los controladores manejan entidades como **películas, comentarios, calificaciones y géneros**.
- Todas las rutas están versionadas con  `semver`.
- Se utiliza **sessions** y **transactions** de MongoDB para operaciones críticas.

## Créditos

Juan Fernando Umaña 

Gerson Chaparro


## Link al front-end

https://github.com/Gersonchm1/ProyectoExpress_JuanUma-a_GersonChaparro_Frontend

## Link , video explicativo

https://drive.google.com/drive/folders/1ddaatT3A_x-QhCzKXJYxasYdX5lWDTkE?usp=sharing