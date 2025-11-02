import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

export const createUser = async (userData: any) => {
    return await prisma.user.create({
        data: userData
    })
}

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email }
    })
}

export const findUserByCpfCnpj = async (cpfCnpj: string) => {
    return await prisma.user.findUnique({
        where: { cpfCnpj } as Prisma.UserWhereUniqueInput
    })
}

export const generateToken = async (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {expiresIn: '1h'})
}

export const findUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id: id }
    })
}