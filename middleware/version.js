const API_VERSION = "1.0.0";

// Middleware para añadir la versión en cada respuesta JSON

// llama la req , response, y si pasa la informacion, el next
export function addVersion(req, res, next) {

    // guardamos el json
  const oldJson = res.json;

  // modificamos la informacion del json y añadimos la version
  res.json = function (data) {
    // revisamos que la informacion que se envia sea json y que si haya algo y el objeto no sea null
    if (typeof data === "object" && data !== null) {

        // añadimos la version
      data.version = API_VERSION; 
    }


    // devolvemos el json y llamamos la respuesta con el this y la data nueva a insertar
    return oldJson.call(this, data);
  };

  // dejamos pasar la informacion
  next();
}
