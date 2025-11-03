import  express  from "express";
import { loginUserController, registerUserController, getUserController, logoutController } from "../controllers/authController"
import authMiddleware from "../middleware/authMiddleware"

const router = express.Router()

router.post('/register', registerUserController)
router.post('/login', loginUserController)
router.post('/logout', logoutController)
router.get('/me', authMiddleware, getUserController)

export default router
