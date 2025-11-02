import  express  from "express";
import { loginUserController, registerUserController } from "../controllers/authController"

const router = express.Router()

router.post('/register', registerUserController)
router.post('/login', loginUserController)

export default router
