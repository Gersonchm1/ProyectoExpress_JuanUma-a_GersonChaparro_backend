function mostrarPeliculas(lista, id_genero) {
  // contenedor donde van las pelis
  const contenedor = document.getElementById("peliculas-por-genero");

  // si no hay pelis mostramos mensaje
  if (!lista || lista.length === 0) {
    contenedor.innerHTML = "<p style='color:black;'>No hay películas disponibles para este género.</p>";
    return;
  }

  // agarramos solo las ultimas 10 pelis y las invertimos
  const ultimas10 = lista.slice(-10).reverse();

  // nombres de generos por id
  const nombresGeneros = { 1: "Acción", 2: "Comedia", 3: "Drama", 4: "Terror" };

  // titulo + contenedor grid
  let html = `<h2 class='peliculas-titulo2'>Películas de ${nombresGeneros[id_genero] || "Género "+id_genero}</h2><div class='peliculas-grid'>`;

  // recorremos cada peli y armamos la card
  ultimas10.forEach(pelicula => {
    html += `
      <div class="pelicula-card">
        <!-- botones editar y eliminar -->
        <div class="card-header" style="position:absolute; top:8px; right:8px; cursor:pointer;">
          <span onclick="editarPelicula('${pelicula._id}'); event.stopPropagation();">✏️</span>
          <span onclick="eliminarPelicula('${pelicula._id}'); event.stopPropagation();">🗑️</span>
        </div>
        <!-- imagen que lleva al detalle -->
        <img src="${pelicula.poster || 'https://via.placeholder.com/260x300?text=Sin+Imagen'}" 
             alt="${pelicula.titulo}" 
             style="width:100%;max-height:300px;object-fit:cover;border-radius:10px 10px 0 0;margin-bottom:14px;"
             onclick="verDetallePelicula('${pelicula._id}')">
        <!-- titulo de la peli -->
        <h3>${pelicula.titulo || "Sin título"}</h3>
      </div>
    `;
  });

  // cerramos grid y metemos en el contenedor
  html += "</div>";
  contenedor.innerHTML = html;
}
