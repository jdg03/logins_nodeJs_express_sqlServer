import express from 'express'
import path from 'path'; // Importa el módulo path
import { fileURLToPath } from 'url'; // También debes importar fileURLToPath si lo estás usando
import bodyParser from 'body-parser'
import session from 'express-session';
import cookieParser from 'cookie-parser';


const app = express();

// __dirname contiene la ruta del directorio 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//Utiliza el método join del módulo path para combinar dos rutas en una sola 
export  const ruta = path.join(__dirname, '../frontend/views');

// Configurar body-parser para analizar datos de formularios HTML
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar body-parser para analizar datos JSON
app.use(bodyParser.json());

// Middleware para parsear JSON
app.use(express.json());
app.use(cookieParser())

// Define el motor de plantillas yEstablece la ruta de las plantillas
app.set('view engine', 'ejs');
app.set('views', ruta);

//Define los archivos estaticos
app.use(express.static(ruta+'\\..'));

// Configura express-session
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false
}))

//Para eliminar la cache 
app.use(function(req, res, next) {
  if (!req.user)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

const PORT = 4000
app.listen(PORT, ()=> {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//ruta inicial
app.get('/', (req, res) => {
  
    res.render('service', { PORT });
  });


//________Rutas_______________
import router from './routes/routes.js';

app.use(router);