import { Request, Response } from "express";
import { registerUserService } from "../services/authService";

export const registerUserController = async (req: Request, res: Response) => {
    try {
        const { name, cpfCnpj, email, phone, password, confirmPassword } = req.body
        if (!name || !cpfCnpj || !email || !phone || !password || !confirmPassword) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios"})
        }

        const response = await registerUserService(name, cpfCnpj, email, phone, password, confirmPassword)
        return res.status(response.status).json(response)
    } catch (error: any) {
        console.error("Erro ao registrar usuário", error)

        if (error.code === "P2002") {
            const field = error.meta?.target?.[0] || 'campo'
            return res.status(400).json({ message: `O ${field} já cadastrado` })
        }

        return res.status(500).json({ message: "Erro ao registrar usuário", error: error.message })
    }
}
