# KarenFlix - Frontend

## Descripción del proyecto

KarenFlix es una aplicación web para **explorar y calificar películas, series y animes geek**.  
Este repositorio contiene únicamente el **frontend**, desarrollado con **HTML, CSS y JavaScript puro**, que se conecta a un backend en Node.js + Express para mostrar datos de películas por categoría, ver detalles, y permitir la interacción de los usuarios.

El frontend es **responsive**, mostrando tarjetas de películas, filtrado por género y redirección a detalles de cada película.

---

## Tecnologías usadas

- HTML5
- CSS3 (flexbox y grid)
- JavaScript puro
- Fetch API para consumir el backend
- LocalStorage (para almacenar token de usuario)

---

## Instalación y uso

1. Clonar el repositorio:  
```bash
git clone https://github.com/Gersonchm1/ProyectoExpress_JuanUma-a_GersonChaparro_Frontend
```
## estructura del proyecto
```bash

/frontend
│
├─ index.html  
├─ index2.html  
├─ index3.html  
├─ index4.html  
├─ index5.html           # Página principal, listado de películas
├─ index6.html          # Detalle de película
├─ css/
│   └─ styles.css    
  │ └─ styles2.css
│   └─ styles3.css    
│   └─ styles4.css    
│   └─ styles5.css    
│   └─ styles6.css         # Estilos globales
├─ js/
│   ├─ detallepelicula.js          # Lógica principal y fetch de películas
│   └─ peliculas-genero1.js 
│   └─ pelicas.js 
│   └─ script.js
│   └─ topPelis.js          # Funciones auxiliares (opcional)
└─ img/
    └─ images/          # Imágenes de películas y recursos
--README.md

```

## Endpoints consumidos


# Ejemplos de endpoints que consume el frontend:
```js

GET /api/users/peliculas/categoria/:id_genero → Obtiene películas por género.

GET /api/users/peliculas/:id → Obtiene detalle de una película específica.
```