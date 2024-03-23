import Router from "express";
import {login, singUp, authSignUp, authLoginJwt,authLoginSession, bienvenido, bienvenidoAdmi,logoutSession, logoutJwt}  from "../controllers/controller.js"
import {verifyToken, verifySession,} from "../middleware/verify.js";
const router = Router();


router.get('/login/page',login)

router.get('/singUp/page',singUp)

//--------registra un usuario-------------
router.post('/auth/singUp', authSignUp);

/*

//----------Con express session--------------
//crea la sesion
router.post('/auth/login', authLoginSession);

router.get('/bienvenido', verifySession, bienvenido);
router.get('/bienvenidoAdmi',verifyRole, bienvenidoAdmi);
router.get('/logout', logoutSession);

**/

//--------------Con JWT-------------------------
//----crea el token
router.post('/auth/login',authLoginJwt);

router.get('/bienvenido', verifyToken, bienvenido)

router.get('/bienvenidoAdmi', verifyToken, bienvenidoAdmi);

router.get('/logout', logoutJwt);







export default router;