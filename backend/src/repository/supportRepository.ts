import prisma from '../config/prisma';

export const createSupportMessage = async (userId: string, subject: string, message: string) => {
  return await prisma.supportMessage.create({
    data: { userId, subject, message },
    include: { user: { select: { name: true, email: true } } },
  });
};

export const getAllSupportMessages = async () => {
  return await prisma.supportMessage.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSupportMessagesByUserId = async (userId: string) => {
  return await prisma.supportMessage.findMany({
    where: { userId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getSupportMessageById = async (id: string) => {
  return await prisma.supportMessage.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });
};

export const updateSupportMessageStatus = async (id: string, status: string) => {
  return await prisma.supportMessage.update({
    where: { id },
    data: { status },
  });
};

export const deleteSupportMessage = async (id: string) => {
  return await prisma.supportMessage.delete({ where: { id } });
};
