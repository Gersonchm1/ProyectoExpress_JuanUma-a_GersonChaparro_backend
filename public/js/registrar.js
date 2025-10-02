// cuando el html ya cargó
document.addEventListener('DOMContentLoaded', () => {

    // agarramos el form y el div donde salen mensajes
    const form = document.getElementById('registro-form');
    const mensajeDiv = document.getElementById('mensaje');

    // cuando se envia el form
    form.addEventListener('submit', async (event) => {
        // evitamos que la pagina se recargue
        event.preventDefault();

        // sacamos los datos del form
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // mostramos en consola lo que se va a mandar
        console.log('datos a enviar:', data);

        try {
            // mandamos datos al backend
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // decimos que mandamos json
                },
                body: JSON.stringify(data) // convertimos los datos a json string
            });

            // convertimos respuesta del server
            const result = await response.json();

            // si todo salió bien
            if (response.ok) {
                mensajeDiv.textContent = result.msg; // mensaje del server
                mensajeDiv.style.color = 'green';
                form.reset(); // limpiar form
            } else {
                // si hubo error del server
                mensajeDiv.textContent = result.msg || 'Error al registrar';
                mensajeDiv.style.color = 'red';
            }

        } catch (error) {
            // si no hay conexion o falla la peticion
            console.error('error en la solicitud:', error);
            mensajeDiv.textContent = 'Error de conexión con el server';
            mensajeDiv.style.color = 'red';
        }
    });
});
