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

### Dependencias 

- Dotenv 
- bcrypt
- nodemon
- mongodb
- exprress
- passport
- passport-jwt
- jsonwebtoken
- cors
- express-rate-limit
- express-validator
- semver

# Estructura del proyecto

# Principios 