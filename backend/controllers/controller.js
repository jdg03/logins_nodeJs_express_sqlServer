import { ruta } from "../service.js";
import Usuario from "../models/usuario.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



export const login = async (req, res) => {
  const message = null
  res.render(ruta + "/login", { message });
};

export const singUp = async (req, res) => {
  const message = null
  res.render(ruta + "/singUp", { message });
};

//registra un usuario
export const authSignUp = async (req, res) => {
  const { nombre, correo, contraseña, contraseñaConfirm } = req.body;

  try {
    const existingUser = await Usuario.findByEmail(correo);

    if (existingUser) {

     
      return res.redirect("/singUp/page");
      
    }else if (contraseña !== contraseñaConfirm) {

    
      return res.redirect("/singUp/page");
    }

    const hashPassword = await bcrypt.hash(contraseña, 8);
    const esCorreoEduHn = correo.endsWith(".edu.hn");
    const rol = esCorreoEduHn ? 2 : 1;

    await Usuario.createUser(nombre, correo, hashPassword, rol);

   
    return res.redirect("/login/page");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
};

export const authLoginSession = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findByEmail(correo);

    if (!usuario) {
     
      return res.redirect("/login/page");
    }

    const contraseñaValida = await Usuario.comparePassword(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      
      return res.redirect("/login/page");
    }

    req.session.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    req.session.isloggedin = true;
    req.session.username = usuario.id;

    if (correo.endsWith(".edu.hn")) {
      return res.redirect('/bienvenidoAdmi');
    } else {
      return res.redirect('/bienvenido');
    }

  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
};


export const logoutSession = (req, res) => {
  // Destruye la sesión del usuario
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar la sesión:", err);
      return res.status(500).send("Error en el servidor");
    }
    // Redirige al usuario a la página de inicio de sesión después de cerrar la sesión
    res.redirect("/");
  });
};

export const bienvenido = async (req, res) => {
  const user = req.user;
  res.render(ruta + "/bienvenido", { user });
};

export const bienvenidoAdmi = async (req, res) => {
  const user = req.user;
  res.render(ruta + "/bienvenidoAdmi",{ user });
};


//_________________________________JWT_______________________________________________
import dotenv from 'dotenv';

dotenv.config();

const {JWT_SECRETO, JWT_EXPIRES_IN} = process.env;



export const authLoginJwt = async (req, res) => {
 
  const { correo, contraseña } = req.body;

  try {
    const usuario = await Usuario.findByEmail(correo);

    if (!usuario) {
  
      return res.redirect("/login/page");
    }

    const contraseñaValida = await Usuario.comparePassword(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
     
      return res.redirect("/login/page");
    }

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRETO,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const cookiesOptions = {
      expires: new Date(Date.now() + (3 * 60 * 60 * 1000)),//tiempo que dura la cookie
      httpOnly: true
    };

    // Almacenar el token en una cookie
    res.cookie('jwt', token, cookiesOptions);

    // Verificar el rol del usuario y redirigir según sea necesario
    if (usuario.rol === 2) {
      // Si el usuario es administrador, redirigir a bienvenidoAdmi
      return res.redirect('/bienvenidoAdmi');
    } else {
      // Si el usuario no es administrador, redirigir a bienvenido
      return res.redirect('/bienvenido');
    }
  
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
};

export const logoutJwt = (req, res) => {
  res.clearCookie('jwt');
  return res.redirect('/');
};
