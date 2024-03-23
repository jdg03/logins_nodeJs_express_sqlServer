import sql from 'mssql';
import dotenv from 'dotenv';

// Cargar las variables de entorno de .env
dotenv.config();

// Obtener las variables de entorno
const { DB_SERVER, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

// Crear el pool de conexiones
export const pool = new sql.ConnectionPool({
    server: DB_SERVER,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    options: {
        trustedConnection: false,
        encrypt: false
    }
});

// Conectar al servidor de base de datos
pool.connect()
    .then(() => console.log('Conexión exitosa a SQL Server'))
    .catch(err => console.error('Error al conectar a SQL Server', err));

export default pool;


//codigo de la base de datos

/**
 * 

create database nodejs_login
use nodejs_login

create table roles(
	id integer identity(1,1) primary key,
	descripcion varchar(255)
)

CREATE TABLE usuarios(
    id INTEGER IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo VARCHAR(255) NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol INTEGER DEFAULT 1 REFERENCES roles(id)
);

 */



