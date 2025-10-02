// funcion pa inyectar css de las pelis directo al head
function inyectarCSSPeliculas() {
  const style = document.createElement('style');
  style.innerHTML = `
    /* titulo de las pelis */
    .peliculas-titulo2 { color: #fff; text-align: center; margin-top: 0; font-size: 2.2rem; font-family: 'InterExtraBold', Arial, sans-serif; letter-spacing: 2px; }

    /* contenedor grid */
    .peliculas-grid { display: flex; flex-wrap: wrap; gap: 2rem; justify-content: center; margin-top: 5vh; margin-bottom: 40px; }

    /* card de cada peli */
    .pelicula-card { background: linear-gradient(150deg, #232526 70%, #414345 100%); border-radius: 18px; box-shadow: 0 8px 32px rgba(60, 60, 60, 0.28), 0 1.5px 0px #444; width: 260px; color: #fff; padding: 22px 18px 18px 18px; transition: transform 0.23s, box-shadow 0.23s; position: relative; overflow: hidden; min-height: 120px; display: flex; flex-direction: column; align-items: center; margin-bottom:20px;}

    /* efecto hover card */
    .pelicula-card:hover { transform: translateY(-8px) scale(1.04); box-shadow: 0 16px 38px rgba(90, 50, 150, 0.24), 0 2px 6px #444; border: 1.5px solid #7b39ff; }

    /* titulo peli */
    .pelicula-card h3 { font-size: 1.2rem; margin-bottom: 8px; color: #ffb347; font-family: 'InterExtraBold', Arial, sans-serif; text-align: center; }

    /* texto card */
    .pelicula-card p { font-size: 1rem; color: #ddd; margin-bottom: 5px; min-height: 36px; text-align: center; }

    /* estilos pa moviles */
    @media (max-width: 600px) { 
      .peliculas-grid { flex-direction: column; align-items: center; gap: 1.2rem; } 
      .pelicula-card { width: 92vw; padding: 11px 5vw 9px 5vw; } 
    }
  `;
  document.head.appendChild(style);
}

// cuando la pagina ya cargo
document.addEventListener("DOMContentLoaded", () => {
  // metemos el css
  inyectarCSSPeliculas();

  // select pa elegir genero
  const generoSelect = document.getElementById("select-genero-peliculas");

  // cuando cambia el select, pedimos pelis del genero
  generoSelect.addEventListener("change", () => {
    fetchPeliculasPorGenero(generoSelect.value);
  });

  // carga inicial con el genero que tenga por defecto
  fetchPeliculasPorGenero(generoSelect.value);
});

// pedir pelis al backend segun genero
function fetchPeliculasPorGenero(id_genero) {
  const token = localStorage.getItem("token"); // token guardado
  const url = `http://localhost:3000/api/users/peliculas/categoria/${id_genero}`;

  // si no hay token mostramos mensaje
  if (!token) {
    document.getElementById("peliculas-por-genero").innerHTML = 
      `<p style="color:red">Debes loguearte para ver las películas.</p>`;
    return;
  }

  // hacemos la peticion al backend
  fetch(url, {
    method: "GET",
    headers: { "Authorization": token }
  })
  .then(response => {
    if (!response.ok) throw new Error("No autorizado o error en el servidor");
    return response.json();
  })
  .then(data => {
    // si todo bien mostramos las pelis
    mostrarPeliculas(data, id_genero);
  })
  .catch(err => {
    // si hay error lo mostramos
    document.getElementById("peliculas-por-genero").innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  });
}

// funcion pa mostrar pelis en el html
function mostrarPeliculas(lista, id_genero) {
  const contenedor = document.getElementById("peliculas-por-genero");

  // si no hay pelis mostramos mensaje
  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<p style='color:black;'>No hay películas disponibles para este género.</p>";
    return;
  }

  // solo las ultimas 10
  const ultimas10 = lista.slice(-10).reverse();

  // diccionario nombres de generos
  const nombresGeneros = {
    1: "Acción", 2: "Comedia", 3: "Drama", 4: "Terror"
  };

  // html con titulo y grid
  let html = `<h2 class='peliculas-titulo2'>Películas de ${nombresGeneros[id_genero] || "Género "+id_genero}</h2><div class='peliculas-grid'>`;

  // recorremos y armamos las cards
  ultimas10.forEach(pelicula => {
    html += `
      <div class="pelicula-card" onclick="verDetallePelicula('${pelicula._id}')">
        <img src="${pelicula.poster || 'https://via.placeholder.com/260x300?text=Sin+Imagen'}" alt="${pelicula.titulo}" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px 10px 0 0;margin-bottom:14px;">
        <h3>${pelicula.titulo || "Sin título"}</h3>
      </div>
    `;
  });

  html += "</div>";
  contenedor.innerHTML = html;
}

// funcion pa redirigir al detalle de la peli
function verDetallePelicula(id) {
  window.location.href = `index6.html?id=${id}`;
}

// exportamos pa que se pueda usar desde el html
window.verDetallePelicula = verDetallePelicula;
