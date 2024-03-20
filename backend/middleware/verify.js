import jwt from 'jsonwebtoken';
import { ruta } from '../service.js';

const secretKey = 'SECRET';

export const verifyToken = (req, res, next) => {
    const token = req.query.token;

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado - Token no proporcionado' });
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        console.log("Token verificado");
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token no válido' });
    }
};

export const verifySession = (req, res, next) => {
    
    // Verificar si hay un usuario almacenado en la sesión
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Acceso denegado - Sesión no encontrada' });
    }

    // Continuar con la siguiente función en la ruta
    console.log("paso por verifySession");
    next();
};


export const verifyRole = (req, res, next) => {
    
    if (req.session && req.session.user && req.session.user.rol === 'admi') {
        console.log("paso por el verifyRole")
        next();
    } else {
        return res.status(401).json({ error: 'No es administrador, acceso denegado' });
    }
};




export const verifyPassport = (req, res,next) => {

    console.log("Passport funcionando");
    next();
}