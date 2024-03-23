import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export const verifySession = (req, res, next) => {
    
    // Verificar si hay un usuario almacenado en la sesión
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Acceso denegado - Sesión no encontrada' });
    }

    // Continuar con la siguiente función en la ruta
    console.log("paso por verifySession");
    next();
};


// verifica si el tpken es valido
export const verifyToken = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        
        // Decodifica el token JWT para obtener la información del usuario
        const tokenDecodificado = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);

        // Almacena la información del usuario decodificada en req.user para que esté disponible en las rutas posteriores
        req.user = tokenDecodificado;

        console.log("Usuario autenticado:", req.user);
        // Continúa con el siguiente controlador
        return next();
      } catch (error) {
        console.log(error);
        return res.redirect('/');
      }
    } else {
        // Si no se encuentra un token JWT en las cookies, redirige al usuario a la página principal
      return res.redirect('/');
    }
  };
