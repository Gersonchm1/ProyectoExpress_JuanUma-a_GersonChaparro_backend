// URL donde está la API que devuelve la lista de películas
const URL_PELICULAS = "http://localhost:3000/api/users/peliculas";

// Cuando la página termina de cargar, se inyecta el CSS
// y se hace la petición al servidor para obtener las películas
document.addEventListener("DOMContentLoaded", () => {
  inyectarCSSPeliculas();
  fetchPeliculas();
});

// Esta función inyecta el CSS en la página
function inyectarCSSPeliculas() {
  const style = document.createElement('style');
  style.innerHTML = `
.peliculas-titulo {
    color: #fff;
    text-align: center;
    margin-top: 48vh;
    font-size: 2.2rem;
    font-family: 'InterExtraBold', Arial, sans-serif;
    letter-spacing: 2px;
}
.peliculas-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    margin-top: 8vh;
    margin-bottom: 40px;
}
.pelicula-card {
    background: linear-gradient(150deg, #232526 70%, #414345 100%);
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(60, 60, 60, 0.28), 0 1.5px 0px #444;
    width: 260px;
    color: #fff;
    padding: 22px 18px 18px 18px;
    transition: transform 0.23s, box-shadow 0.23s;
    position: relative;
    overflow: hidden;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.pelicula-card:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 16px 38px rgba(90, 50, 150, 0.24), 0 2px 6px #444;
    border: 1.5px solid #7b39ff;
}
.pelicula-card h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
    color: #ffb347;
    font-family: 'InterExtraBold', Arial, sans-serif;
    text-align: center;
}
.pelicula-card p {
    font-size: 1rem;
    color: #ddd;
    margin-bottom: 5px;
    min-height: 36px;
    text-align: center;
}
.pelicula-card {
    position: relative;
}
  `;
  document.head.appendChild(style);
}

// Esta función obtiene las películas desde la API
function fetchPeliculas() {
  const token = localStorage.getItem("token"); // Busca el token guardado en el navegador

  // Si no hay token, muestra un aviso y no hace la petición
  if (!token) {
    document.getElementById("peliculas-lista").innerHTML = 
      `<p style="color:red">Debes loguearte para ver las películas.</p>`;
    return;
  }

  // Hace la petición GET incluyendo el token en la cabecera
  fetch(URL_PELICULAS, {
    method: "GET",
    headers: {
      "Authorization": token
    }
  })
    .then(response => {
      // Si ocurre un error en la respuesta, se captura
      if (!response.ok) throw new Error("No autorizado o error en el servidor");
      return response.json(); // Convierte la respuesta en JSON
    })
    .then(data => {
      mostrarPeliculas(data); // Renderiza las películas recibidas
    })
    .catch(err => {
      // Si hay error, se muestra en pantalla
      document.getElementById("peliculas-lista").innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
    });
}

// Esta función recibe la lista de películas y genera el HTML
function mostrarPeliculas(lista) {
    const contenedor = document.getElementById("peliculas-lista");

    // si no hay películas, muestra un mensaje
    if (!lista || lista.length === 0) {
        contenedor.innerHTML = "<p style='color:black;'>No hay películas disponibles.</p>";
        return;
    }

    // se toman solo las últimas 10 peliulas
    const ultimas10 = lista.slice(-10).reverse();

    // estructura principal: título y contenedor
    let html = "<h2 class='peliculas-titulo'>Películas</h2><div class='peliculas-grid'>";

    // Se genera una tarjeta por cada película
    ultimas10.forEach(pelicula => {
        const peliculaId = pelicula._id || pelicula.id; // El id puede variar según la base de datos

        html += `
            <div class="pelicula-card" data-id="${peliculaId}">
                <img src="${pelicula.poster}" alt="${pelicula.titulo}" class="poster-pelicula">
                <h3 class="titulo-pelicula">${pelicula.titulo || "Sin título"}</h3>
            </div>
        `;
    });

    html += "</div>";
    contenedor.innerHTML = html; // Inserta el HTML en la página
}

// Detecta clicks en las tarjetas y redirige a la vista de detalle
document.addEventListener("click", function(e) {
  const card = e.target.closest(".pelicula-card");
  if (card && card.dataset.id) {
    window.location.href = `index6.html?id=${card.dataset.id}`;
  }
});
