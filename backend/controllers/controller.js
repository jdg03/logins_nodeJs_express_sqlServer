import { ruta } from "../service.js";
import Usuario from "../models/usuario.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const secretKey = "SECRET";

export const login = async (req, res) => {
  res.render(ruta + "/login", { message: null });
};

export const singUp = async (req, res) => {
  res.render(ruta + "/singUp", { message: null });
};

export const authSignUp = async (req, res) => {
  const { nombre, correo, contraseña, contraseñaConfirm } = req.body;

  try {
    const existingUser = await Usuario.findByEmail(correo);

    if (existingUser) {
      return res.render(ruta + "/singUp", {
        message: "El correo electrónico ya está registrado",
      });
    } else if (contraseña !== contraseñaConfirm) {
      return res.render(ruta + "/singUp", {
        message: "Las contraseñas no coinciden",
      });
    }

    const hashPassword = await bcrypt.hash(contraseña, 8);
    const esCorreoEduHn = correo.endsWith(".edu.hn");
    const rol = esCorreoEduHn ? "admi" : "usuario_corriente";

    await Usuario.createUser(nombre, correo, hashPassword, rol);

    return res.render(ruta + "/login", {
      message: "Su usuario fue creado con éxito!",
    });
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
      return res.render(ruta + "/login", {
        message: "El correo electrónico no está registrado",
      });
    }

    const contraseñaValida = await Usuario.comparePassword(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.render(ruta + "/login", {
        message: "Contraseña incorrecta",
      });
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


//ignorar
export const authLoginJwt = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const result = await pool
      .request()
      .input("correo", correo)
      .query("SELECT * FROM usuarios WHERE correo = @correo");

    if (result.recordset.length === 0) {
      return res.render(ruta + "/login", {
        message: "El correo electrónico no está registrado",
      });
    }

    const usuario = result.recordset[0];

    // Compara la contraseña proporcionada por el usuario con la contraseña hasheada almacenada en la base de datos
    const contraseñaValida = await bcrypt.compare(
      contraseña,
      usuario.contraseña
    );

    if (!contraseñaValida) {
      return res.render(ruta + "/login", {
        message: "Contraseña incorrecta",
      });
    }

    // Si las credenciales son válidas, genera un token JWT
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo },
      "SECRET", //clave secreta
      { expiresIn: "1h" } // Opcional: especifica el tiempo de expiración del token
    );

    // Redirigir al usuario a la página de bienvenida con el token
    res.redirect(`/bienvenido%20Jwt?token=${token}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error en el servidor");
  }
};

export const logout = (req, res) => {
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
  const user = req.session.user;
  res.render(ruta + "/bienvenido", { user });
};

export const bienvenidoAdmi = async (req, res) => {
  const user = req.session.user;
  res.render(ruta + "/bienvenidoAdmi",{ user });
};
