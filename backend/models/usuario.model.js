import pool from "../conection/db.js";
import bcrypt from "bcryptjs";

class Usuario {

    async findById(id) {
        try {
          const result = await pool
            .request()
            .input("id", id)
            .query("SELECT * FROM usuarios WHERE id = @id");
          return result.recordset[0];
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    
  async findByEmail(email) {
    try {
      const result = await pool
        .request()
        .input("correo", email)
        .query("SELECT * FROM usuarios WHERE correo = @correo");
      return result.recordset[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createUser(nombre, correo, contraseña, rol) {
    try {
      const result = await pool
        .request()
        .input("nombre", nombre)
        .input("correo", correo)
        .input("contraseña", contraseña)
        .input("rol", rol)
        .query(
          "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (@nombre, @correo, @contraseña, @rol)"
        );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async comparePassword(password, hashedPassword) {
    try {
      const match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default new Usuario();
