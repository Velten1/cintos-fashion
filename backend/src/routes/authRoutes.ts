import  express  from "express";
import { registerUserController } from "../controllers/authController"

const router = express.Router()

router.post('/register', registerUserController)

export default router
