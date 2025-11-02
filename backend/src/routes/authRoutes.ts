import  express  from "express";
import { loginUserController, registerUserController, getUserController } from "../controllers/authController"
import authMiddleware from "../middleware/authMiddleware"

const router = express.Router()

router.post('/register', registerUserController)
router.post('/login', loginUserController)
router.get('/me', authMiddleware, getUserController)

export default router
