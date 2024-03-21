import Router from "express";
import {login, singUp, authSignUp, authLoginJwt,authLoginSession, bienvenida, logout, bienvenidoAdmi}  from "../controllers/controller.js"
import {verifyToken, verifySession, verifyPassport, verifyRole} from "../middleware/verify.js";

const router = Router();


router.get('/login/page',login)

router.get('/singUp/page',singUp)

router.post('/auth/singUp', authSignUp);

//----------Con express session--------------
router.post('/auth/login', authLoginSession);

router.get('/bienvenido', verifySession, bienvenida);
router.get('/bienvenidoAdmi',verifyRole, bienvenidoAdmi);

router.get('/logout', logout);





export default router;