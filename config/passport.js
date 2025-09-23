import passport from "passport";
// Plugin para usar jwt, Importamos strategy que es un comando de passport con jwt
// lo renombramos y con extract luego se va a poder extraer la info de los tokens
import { Strategy as JwtStrategy, ExtractJwt  } from "passport-jwt";
import { UserModelRegister } from "../models/userModel.js";

const userModel = new UserModelRegister();

// serea la funcion para que se asegure de devolver una promesa
(async () => {
    await userModel.init();
  })();



// En las opciones extraemos el token de jwt y extraemos la clave secreta
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET

};

passport.use (
// Usamos la estrategia de Jwt, le damos los datos de opts , el payload con la informacion
// y el done es para cuando termine la verificacion, las respuestas
new JwtStrategy ( opts, async (jwt_payload, done) => {

try{


    // done = firma

    // Buscamos en el modelo en la informacion por su id , con el del payload
    // verificamos
    const user = await userModel.findUserById(jwt_payload.id)
    // en el () hay dos vaores, null o error, para el apartado de errores 
    // que es nulo, y devuelve el camper que encontro 
    if (user) return done (null, user)

    // Si no se encuentra, retorna false
    return done(null, false);
    // (error, user, info(opcional))
} catch(error) {
    return done(error, false)
}

})


);

export default passport;