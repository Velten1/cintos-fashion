import { findUserByEmail, findUserByCpfCnpj, createUser, generateToken, editUser, findUserById } from "../repository/authRepository"
import bcrypt from "bcrypt"
import { 
    validateAndNormalizeEmail, 
    validateAndNormalizeCPFCNPJ, 
    validateAndNormalizePhone 
} from "../utils/validation.util"
import { validateCNPJWithAPI } from "../utils/cnpjApi.util"

export const registerUserService = async (
    name: string,
    cpfCnpj: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
) => {
    const emailValidation = validateAndNormalizeEmail(email)
    if (!emailValidation.isValid || !emailValidation.normalized) {
        return { status: 400, message: "Email inválido. Por favor, informe um email válido." }
    }
    const normalizedEmail = emailValidation.normalized

    const cpfCnpjValidation = validateAndNormalizeCPFCNPJ(cpfCnpj)
    if (!cpfCnpjValidation.isValid || !cpfCnpjValidation.normalized) {
        return { status: 400, message: "CPF/CNPJ inválido. Por favor, informe um CPF ou CNPJ válido." }
    }
    const normalizedCpfCnpj = cpfCnpjValidation.normalized

    if (cpfCnpjValidation.type === 'CNPJ') {
        const cnpjApiValidation = await validateCNPJWithAPI(normalizedCpfCnpj)
        if (!cnpjApiValidation.exists) {
            return { status: 400, message: "CNPJ não encontrado. Por favor, verifique se o CNPJ está correto." }
        }
        if (!cnpjApiValidation.isActive) {
            return { status: 400, message: "CNPJ não está ativo. Apenas empresas ativas podem se cadastrar." }
        }
    }

    const phoneValidation = validateAndNormalizePhone(phone)
    if (!phoneValidation.isValid || !phoneValidation.normalized) {
        return { status: 400, message: "Telefone inválido. Por favor, informe um telefone válido (formato brasileiro)." }
    }
    const normalizedPhone = phoneValidation.normalized

    // Validação de senha
    if (password.length < 6) {
        return { status: 400, message: "Sua senha precisa ter no minimo 6 caracteres." }
    }

    if (password !== confirmPassword) {
        return { status: 400, message: "Suas senhas não coincidem." }
    }

    const existingUser = await findUserByEmail(normalizedEmail)
    if (existingUser) {
        return { status: 400, message: "Email já está em uso." }
    }

    const existingUserByCpfCnpj = await findUserByCpfCnpj(normalizedCpfCnpj)
    if (existingUserByCpfCnpj) {
        return { status: 400, message: "CPF/CNPJ já está em uso." }
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await createUser({
        name: name.trim(),
        cpfCnpj: normalizedCpfCnpj,
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword
    })

    const { password: _, ...userWithoutPassword } = newUser
    return { status: 201, data: userWithoutPassword}
}

export const loginUserService = async(
    email: string,
    password: string
) => {
    // Normalizar e validar email
    const emailValidation = validateAndNormalizeEmail(email)
    if (!emailValidation.isValid || !emailValidation.normalized) {
        return { status: 400, message: "Email inválido. Por favor, informe um email válido." }
    }
    const normalizedEmail = emailValidation.normalized

    // Validação de senha
    if (!password || password.length === 0) {
        return { status: 400, message: "Senha é obrigatória." }
    }

    // Buscar usuário pelo email normalizado
    const user = await findUserByEmail(normalizedEmail)
    if (!user) {
        return { status: 401, message: "Email ou senha inválidos." }
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return { status: 401, message: "Email ou senha inválidos." }
    }
    
    // Gerar token JWT
    const token = await generateToken(user.id)
    const {password: _, ...userWithoutPassword} = user
    return { status: 200, data: {user: userWithoutPassword, token}}
}

export const editUserService = async (id: string, userData: any) => {
    const userDataToUpdate: any = {}

    // Validação e atualização de nome (se fornecido)
    if (userData.name !== undefined) {
        if (!userData.name || !userData.name.trim()) {
            return { status: 400, message: "Nome é obrigatório." }
        }
        userDataToUpdate.name = userData.name.trim()
    }

    // Validação e atualização de CPF/CNPJ (se fornecido)
    if (userData.cpfCnpj !== undefined) {
        const cpfCnpjValidation = validateAndNormalizeCPFCNPJ(userData.cpfCnpj)
        if (!cpfCnpjValidation.isValid || !cpfCnpjValidation.normalized) {
            return { status: 400, message: "CPF/CNPJ inválido. Por favor, informe um CPF ou CNPJ válido." }
        }
        const normalizedCpfCnpj = cpfCnpjValidation.normalized

        // Validar CNPJ com API se for CNPJ
        if (cpfCnpjValidation.type === 'CNPJ') {
            const cnpjApiValidation = await validateCNPJWithAPI(normalizedCpfCnpj)
            if (!cnpjApiValidation.exists) {
                return { status: 400, message: "CNPJ não encontrado. Por favor, verifique se o CNPJ está correto." }
            }
            if (!cnpjApiValidation.isActive) {
                return { status: 400, message: "CNPJ não está ativo. Apenas empresas ativas podem atualizar o cadastro." }
            }
        }

        // Verificar se CPF/CNPJ já está em uso por outro usuário
        const existingUserByCpfCnpj = await findUserByCpfCnpj(normalizedCpfCnpj)
        if (existingUserByCpfCnpj && existingUserByCpfCnpj.id !== id) {
            return { status: 400, message: "CPF/CNPJ já cadastrado." }
        }

        userDataToUpdate.cpfCnpj = normalizedCpfCnpj
    }

    // Validação e atualização de email (se fornecido)
    if (userData.email !== undefined) {
        const emailValidation = validateAndNormalizeEmail(userData.email)
        if (!emailValidation.isValid || !emailValidation.normalized) {
            return { status: 400, message: "Email inválido. Por favor, informe um email válido." }
        }
        const normalizedEmail = emailValidation.normalized

        // Verificar se email já está em uso por outro usuário
        const existingUserByEmail = await findUserByEmail(normalizedEmail)
        if (existingUserByEmail && existingUserByEmail.id !== id) {
            return { status: 400, message: "Email já está em uso." }
        }

        userDataToUpdate.email = normalizedEmail
    }

    // Validação e atualização de telefone (se fornecido)
    if (userData.phone !== undefined) {
        const phoneValidation = validateAndNormalizePhone(userData.phone)
        if (!phoneValidation.isValid || !phoneValidation.normalized) {
            return { status: 400, message: "Telefone inválido. Por favor, informe um telefone válido (formato brasileiro)." }
        }
        userDataToUpdate.phone = phoneValidation.normalized
    }

    // Se nenhum campo foi fornecido
    if (Object.keys(userDataToUpdate).length === 0) {
        return { status: 400, message: "Nenhum campo foi fornecido para atualização." }
    }

    // Atualizar usuário apenas com os campos fornecidos
    const updatedUser = await editUser(id, userDataToUpdate)

    // Remover senha antes de retornar
    const { password: _, ...userWithoutPassword } = updatedUser
    return { status: 200, data: userWithoutPassword }
}

