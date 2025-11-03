import { Request, Response } from "express";
import { loginUserService, registerUserService } from "../services/authService";
import { findUserById } from "../repository/authRepository";

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

export const loginUserController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios"})
        }

        const response = await loginUserService(email, password)
        
        // Se login bem-sucedido, salvar token em cookie httpOnly
        if (response.status === 200 && response.data?.token) {
            res.cookie('token', response.data.token, {
                httpOnly: true,     
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict',  
                maxAge: 3600000     
            });
            
            // Remover token do body da resposta por segurança
            const { token, ...responseWithoutToken } = response.data;
            return res.status(response.status).json({ 
                status: response.status, 
                data: responseWithoutToken 
            });
        }
        
        return res.status(response.status).json(response)
    } catch (error: any) {
        console.error("Erro ao fazer login", error)
        return res.status(500).json({ message: "Erro ao fazer login", error: error.message })
    }
}

export const getUserController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId
        if (!userId) {
            return res.status(401).json({ message: "Token não fornecido" })
        }
        
        const user = await findUserById(userId)
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        // Remover senha antes de retornar
        const { password: _, ...userWithoutPassword } = user
        return res.status(200).json({ status: 200, data: userWithoutPassword })
    } catch (error: any) {
        console.error("Erro ao buscar usuário", error)
        return res.status(500).json({ message: "Erro ao buscar usuário", error: error.message })
    }
}

export const logoutController = async (req: Request, res: Response) => {
    try {
        // Limpar cookie do token
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.status(200).json({ status: 200, message: 'Logout realizado com sucesso' });
    } catch (error: any) {
        console.error("Erro ao fazer logout", error)
        return res.status(500).json({ message: "Erro ao fazer logout", error: error.message })
    }
}