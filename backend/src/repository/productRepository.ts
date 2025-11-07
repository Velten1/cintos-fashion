import prisma from '../config/prisma';
import { Prisma } from '@prisma/client';

export const getAllProducts = async (where: Prisma.ProductWhereInput, orderBy: any[], skip: number, take: number) => {
  return await prisma.product.findMany({ where, orderBy, skip, take });
};

export const getProductsCount = async (where: Prisma.ProductWhereInput) => {
  return await prisma.product.count({ where });
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({ where: { id } });
};

export const getProductByName = async (name: string) => {
  const normalizedName = name.trim();
  // Busca todos os produtos e compara case-insensitive (MySQL nao suporta mode: 'insensitive')
  const products = await prisma.product.findMany({
    where: { name: { contains: normalizedName } },
  });
  const lowerName = normalizedName.toLowerCase();
  return products.find((p) => p.name.toLowerCase().trim() === lowerName) || null;
};

export const createProduct = async (productData: any) => {
  return await prisma.product.create({ data: productData });
};

export const editProduct = async (id: string, productData: any) => {
  // IMPORTANTE: Garantir que campos null sejam explicitamente setados
  // O Prisma não atualiza campos que são undefined, precisa ser null explícito
  const updateData: any = {};
  
  // Copiar todos os campos do productData
  for (const key in productData) {
    if (productData.hasOwnProperty(key)) {
      const value = productData[key];
      // Converter undefined para null em campos nullable
      if (value === undefined) {
        // Para campos nullable, converter undefined para null
        if (key === 'promotionalPrice' || 
            key === 'description' || 
            key === 'descriptionComplete' ||
            key === 'imageUrl' ||
            key === 'images' ||
            key === 'characteristics' ||
            key === 'typeBelt') {
          updateData[key] = null;
        }
        // Para outros campos, não incluir (Prisma ignora undefined)
      } else {
        updateData[key] = value;
      }
    }
  }
  
  // REGRA CRÍTICA: Se inPromotion é false, promotionalPrice DEVE ser null
  // E o campo DEVE estar presente no objeto para o Prisma atualizar
  if ('inPromotion' in updateData) {
    if (updateData.inPromotion === false) {
      // Se inPromotion é false, promotionalPrice DEVE ser null e estar presente
      updateData.promotionalPrice = null;
    }
  }
  
  // Se promotionalPrice estiver presente no productData original e for um valor "vazio", setar como null
  if ('promotionalPrice' in productData) {
    const promoPrice = productData.promotionalPrice;
    if (promoPrice === null || 
        promoPrice === undefined || 
        promoPrice === '' || 
        promoPrice === 0) {
      updateData.promotionalPrice = null;
      updateData.inPromotion = false;
    }
  }
  
  // Garantir que se inPromotion está presente mas promotionalPrice não, incluir promotionalPrice como null
  if ('inPromotion' in updateData && !('promotionalPrice' in updateData)) {
    if (updateData.inPromotion === false) {
      updateData.promotionalPrice = null;
    }
  }
  
  return await prisma.product.update({ where: { id }, data: updateData });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.update({ where: { id }, data: { active: false } });
};
