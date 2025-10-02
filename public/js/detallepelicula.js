// -----------------------------
// Función para extraer el id del usuario desde el token
// -----------------------------
function getUserIdFromToken(token) {
  if (!token) return null; // si no hay token, no se puede sacar nada
  try {
    const realToken = token.replace(/^Bearer\s+/, ""); // si el token viene con "Bearer ", se quita
    const base64Payload = realToken.split('.')[1]; // un JWT tiene 3 partes, aquí tomamos la segunda (payload)
    const payload = JSON.parse(atob(base64Payload)); // decodificamos el payload a JSON
    return payload.id || payload._id || payload.userId; // buscamos el id en diferentes posibles campos
  } catch (e) {
    return null; // si algo sale mal, devolvemos null
  }
}

// -----------------------------
// Cuando la página ya está cargada
// -----------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search); // tomamos los parámetros de la URL
  const movieId = params.get("id"); // buscamos el id de la película
  const contenedor = document.getElementById("detalle-pelicula"); // contenedor donde mostramos info

  // si no hay id en la URL, mostramos error
  if (!movieId) {
    contenedor.innerHTML = "<p style='color:red'>No se pasó el ID de la película.</p>";
    return;
  }

  // revisamos si hay token en localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    contenedor.innerHTML = "<p style='color:red'>Debes iniciar sesión para ver la película.</p>";
    return;
  }

  // pedimos al backend la info de la película
  try {
    const res = await fetch(`http://localhost:3000/api/users/peliculas/${movieId}`, {
      headers: { "Authorization": token } // mandamos el token en los headers
    });
    if (!res.ok) throw new Error("No se pudo traer la película");
    const pelicula = await res.json(); // convertimos la respuesta a JSON

    // mostramos en pantalla los datos de la película
    contenedor.innerHTML = `
      <h1>${pelicula.titulo || "Sin título"}</h1>
      <img src="${pelicula.poster || 'https://via.placeholder.com/300x400?text=Sin+Imagen'}"
           alt="${pelicula.titulo}"
           style="width:300px;max-width:98vw;border-radius:10px;margin-bottom:20px;"/>
      <p><strong>Año:</strong> ${pelicula.Anio || "Desconocido"}</p>
      <p><strong>Vistas:</strong> ${pelicula.Vistas || 0}</p>
      <p><strong>Descripción:</strong> ${pelicula.Descripcion || "Sin descripción."}</p>
    `;
  } catch (err) {
    contenedor.innerHTML = `<p style="color:red">${err.message}</p>`; // si hay error mostramos el mensaje
    return;
  }

  // después de mostrar la película, activamos rating y reseñas
  await mostrarRatingPromedio(movieId); // mostramos el promedio de rating
  setupRatingHandler(movieId); // activamos los inputs de calificación
  await cargarReseñas(movieId); // cargamos reseñas
  setupReseñaHandlers(movieId); // activamos botones de reseñas
});

// -----------------------------
// Mostrar promedio del rating de una película
// -----------------------------
async function mostrarRatingPromedio(idPelicula) {
  const ratingDiv = document.getElementById("rating-promedio");
  const token = localStorage.getItem("token");
  if (!ratingDiv) return; // si no hay div, salimos

  ratingDiv.innerHTML = "<span style='color:#aaa'>Cargando rating...</span>";
  try {
    // pedimos al backend el rating promedio
    const res = await fetch(`http://localhost:3000/api/users/ratings/${idPelicula}`, {
      headers: { "Authorization": token }
    });
    if (!res.ok) throw new Error("No se pudo traer el rating");
    const data = await res.json();

    // buscamos el promedio y total de votos
    const avg = data.avgRating || (Array.isArray(data) && data[0]?.avgRating);
    const total = data.totalRatings || (Array.isArray(data) && data[0]?.totalRatings);

    // si no hay ratings todavía
    if (avg === undefined || avg === null) {
      ratingDiv.innerHTML = "<span style='color:#bbb'>Sin calificaciones aún.</span>";
      return;
    }

    // armamos estrellas visuales
    const estrellas = "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg));
    ratingDiv.innerHTML = `
      <div class="rating-visual">
        <span class="estrellas">${estrellas}</span>
        <span class="promedio-num">${avg.toFixed(2)}</span>
        <span class="total-votos">(${total || 0} voto${(total == 1) ? "" : "s"})</span>
      </div>
    `;
  } catch (e) {}
}

// -----------------------------
// Guardar un rating que pone el usuario
// -----------------------------
function setupRatingHandler(movieId) {
  const ratingInputs = document.querySelectorAll('.rating input[type="radio"]'); // todos los radios
  ratingInputs.forEach(input => {
    input.addEventListener('change', async function() {
      const ratingValue = this.value; // valor del radio elegido
      const token = localStorage.getItem("token");
      const userId = getUserIdFromToken(token); // sacamos id del usuario

      if (!userId) {
        alert("Debes iniciar sesión para calificar.");
        return;
      }

      // mandamos la calificación al backend
      try {
        const res = await fetch(`http://localhost:3000/api/users/ratings/${movieId}/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({ rating: Number(ratingValue) }) // mandamos el rating
        });
        if (!res.ok) throw new Error("No se pudo guardar el rating");
        await mostrarRatingPromedio(movieId); // actualizamos el promedio
        alert("Gracias por calificar!");
      } catch (err) {}
    });
  });
}

// -----------------------------
// Mostrar todas las reseñas de la película
// -----------------------------
async function cargarReseñas(idPelicula) {
  const reseñasDiv = document.getElementById("lista-reseñas");
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token); // id del usuario logueado
  reseñasDiv.innerHTML = "";

  try {
    // pedimos reseñas al backend
    const res = await fetch(`http://localhost:3000/api/users/resenas/${idPelicula}`, {
      headers: { "Authorization": token }
    });
    if (!res.ok) throw new Error("No se pudieron cargar las reseñas.");
    const reseñas = await res.json();

    // si no hay reseñas
    if (!reseñas || reseñas.length === 0) {
      reseñasDiv.innerHTML = "<p style='color:#bbb'>No hay reseñas todavía.</p>";
      return;
    }

    // armamos la lista de reseñas
    let html = `<div class='reseñas-lista'>`;
    reseñas.forEach(r => {
      const puedeEditar = (String(r.id_usuario) === String(userId)); // si es dueño, puede editar
      html += `
        <div class="reseña-card" data-id-comentario="${r.id_comentario}">
          <h3>${r.titulo || "Sin título"}</h3>
          <p>${r.comentario || ""}</p>
          <div class="reseña-extras">
            <span class="reseña-likes">👍 ${r.likes || 0}</span>
            <span class="reseña-dislikes">👎 ${r.dislikes || 0}</span>
            <span class="reseña-fecha">${r.fecha ? (new Date(r.fecha)).toLocaleDateString() : ""}</span>
            ${puedeEditar ? `<button class="btn-editar-reseña">Editar</button>` : ""}
          </div>
        </div>
      `;
    });
    html += "</div>";
    reseñasDiv.innerHTML = html;
  } catch (e) {
    reseñasDiv.innerHTML = `<p style="color:red">${e.message}</p>`;
  }
}

// -----------------------------
// Activar botones para reseñas: añadir, editar, eliminar
// -----------------------------
function setupReseñaHandlers(movieId) {
  const token = localStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  // ---------------- Añadir reseña ----------------
  const btnAdd = document.getElementById("btn-agregar-reseña");
  if (btnAdd) {
    btnAdd.addEventListener("click", async () => {
      const titulo = document.getElementById("titulo-reseña").value.trim();
      const comentario = document.getElementById("comentario-reseña").value.trim();

      if (!titulo || !comentario) {
        alert("Falta título o comentario.");
        return;
      }

      // mandamos nueva reseña al backend
      try {
        const res = await fetch(`http://localhost:3000/api/users/resenas/${movieId}/${userId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({ titulo, comentario })
        });
        if (!res.ok) throw new Error("No se pudo añadir la reseña.");
        // limpiamos inputs
        document.getElementById("titulo-reseña").value = "";
        document.getElementById("comentario-reseña").value = "";
        // recargamos reseñas
        await cargarReseñas(movieId);
        alert("Reseña añadida!");
      } catch (err) {
        alert("Error: " + err.message);
      }
    });
  }

  // ---------------- Editar y eliminar reseñas ----------------
  const reseñasDiv = document.getElementById("lista-reseñas");
  if (reseñasDiv) {
    reseñasDiv.addEventListener("click", async (e) => {
      const card = e.target.closest(".reseña-card"); // buscamos la reseña donde se hizo clic
      if (!card) return;
      const id_comentario = card.getAttribute("data-id-comentario");

      // Eliminar reseña
      if (e.target.classList.contains("btn-eliminar-reseña")) {
        if (!confirm("¿Eliminar esta reseña?")) return;
        try {
          const res = await fetch(`http://localhost:3000/api/users/resenas/${movieId}`, {
            method: "DELETE",
            headers: { "Authorization": token }
          });
          if (!res.ok) throw new Error("No se pudo eliminar.");
          await cargarReseñas(movieId); // recargar después de eliminar
          alert("Reseña eliminada.");
        } catch (err) {
          alert("Error al eliminar: " + err.message);
        }
      } 
      // Editar reseña
      else if (e.target.classList.contains("btn-editar-reseña")) {
        const nuevoTitulo = prompt("Nuevo título:", card.querySelector("h3").textContent);
        const nuevoComentario = prompt("Nuevo comentario:", card.querySelector("p").textContent);
        if (!nuevoTitulo || !nuevoComentario) return;

        try {
          const res = await fetch(`http://localhost:3000/api/users/resenas/${movieId}/${userId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": token
            },
            body: JSON.stringify({
              titulo: nuevoTitulo,
              comentario: nuevoComentario,
              id_comentario
            })
          });
          if (!res.ok) throw new Error("No se pudo editar.");
          await cargarReseñas(movieId); // recargar después de editar
          alert("Reseña actualizada.");
        } catch (err) {
          alert("Error al editar: " + err.message);
        }
      }
    });
  }
}
