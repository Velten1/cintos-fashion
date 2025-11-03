import api from "../api/api"

export const register = async (userData: {
    name: string;
    cpfCnpj: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}) => {
    return await api.post("/auth/register", userData);
}

export const login = async (email: string, password: string) => {
    return await api.post("/auth/login", { email, password });
}

export const getCurrentUser = async () => {
    return await api.get("/auth/me");
}

export const logout = async () => {
    return await api.post("/auth/logout");
}

export const editUser = async (userData: {
    name?: string;
    cpfCnpj?: string;
    email?: string;
    phone?: string;
}) => {
    return await api.put("/auth/me", userData);
}