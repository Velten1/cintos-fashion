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
