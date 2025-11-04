import {
  getAllProducts,
  getProductById,
  getProductByName,
  createProduct,
  editProduct,
  deleteProduct,
  getProductsCount,
} from '../repository/productRepository';
import { normalizeProductData } from '../utils/productValidation.util';
import { Prisma } from '@prisma/client';

const ALLOWED_FIELDS = ['name', 'description', 'descriptionComplete', 'basePrice', 'promotionalPrice', 'category', 'typeBelt', 'characteristics', 'imageUrl', 'images', 'inPromotion', 'bestSelling', 'new', 'stock', 'active'];

const buildWhereClause = (filters: any, isAdmin: boolean = false): Prisma.ProductWhereInput => {
  const where: Prisma.ProductWhereInput = {};

  if (!isAdmin) {
    where.active = true;
  } else if (filters.active !== undefined) {
    where.active = filters.active === 'true' || filters.active === true;
  }

  if (filters.categoria) {
    const categories = Array.isArray(filters.categoria) ? filters.categoria : [filters.categoria];
    where.category = { in: categories.map((c: string) => c.toUpperCase().trim()) as any };
  }

  if (filters.typeBelt) {
    const types = Array.isArray(filters.typeBelt) ? filters.typeBelt : [filters.typeBelt];
    where.typeBelt = { in: types.map((t: string) => t.toUpperCase().trim()) as any };
  }

  if (filters.inPromotion !== undefined) {
    where.inPromotion = filters.inPromotion === 'true' || filters.inPromotion === true;
  }

  if (filters.bestSelling !== undefined) {
    where.bestSelling = filters.bestSelling === 'true' || filters.bestSelling === true;
  }

  if (filters.new !== undefined) {
    where.new = filters.new === 'true' || filters.new === true;
  }

  const priceFilters: any = {};
  if (filters.precoMin !== undefined) {
    const minPrice = typeof filters.precoMin === 'string' ? parseFloat(filters.precoMin) : filters.precoMin;
    if (!isNaN(minPrice)) priceFilters.gte = minPrice;
  }
  if (filters.precoMax !== undefined) {
    const maxPrice = typeof filters.precoMax === 'string' ? parseFloat(filters.precoMax) : filters.precoMax;
    if (!isNaN(maxPrice)) priceFilters.lte = maxPrice;
  }

  if (Object.keys(priceFilters).length > 0) {
    where.OR = [
      { AND: [{ promotionalPrice: { not: null } }, { promotionalPrice: priceFilters }] },
      { AND: [{ promotionalPrice: null }, { basePrice: priceFilters }] },
    ];
  }

  if (filters.busca && filters.busca.trim()) {
    const searchTerm = filters.busca.trim();
    const searchConditions = [
      { name: { contains: searchTerm } },
      { description: { contains: searchTerm } },
      { descriptionComplete: { contains: searchTerm } },
    ];

    if (where.OR && Array.isArray(where.OR)) {
      where.AND = [{ OR: where.OR }, { OR: searchConditions }];
      delete (where as any).OR;
    } else {
      where.OR = searchConditions;
    }
  }

  return where;
};

const buildOrderBy = (sort?: string): any[] => {
  if (!sort) return [{ createdAt: 'desc' }];
  const sortMap: Record<string, any[]> = {
    preco_asc: [{ basePrice: 'asc' }],
    preco_desc: [{ basePrice: 'desc' }],
    nome_asc: [{ name: 'asc' }],
    nome_desc: [{ name: 'desc' }],
    recente: [{ createdAt: 'desc' }],
    mais_vendido: [{ bestSelling: 'desc' }, { createdAt: 'desc' }],
  };
  return sortMap[sort.toLowerCase().trim()] || [{ createdAt: 'desc' }];
};

const validateUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

const validateUnknownFields = (productData: any): string[] => {
  return Object.keys(productData).filter((key) => !ALLOWED_FIELDS.includes(key));
};

export const getProductsService = async (filters: any = {}, pagination: any = {}, sort: any = {}, isAdmin: boolean = false) => {
  try {
    const page = Math.max(1, parseInt(pagination.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(pagination.limit || '12', 10)));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      getAllProducts(buildWhereClause(filters, isAdmin), buildOrderBy(sort.sort), skip, limit),
      getProductsCount(buildWhereClause(filters, isAdmin)),
    ]);

    return {
      status: 200,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      },
    };
  } catch (error: any) {
    console.error('Erro ao buscar produtos:', error);
    return { status: 500, message: 'Erro ao buscar produtos. Tente novamente mais tarde.' };
  }
};

export const getProductByIdService = async (id: string, isAdmin: boolean = false) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID do produto inválido.' };
  }

  try {
    const product = await getProductById(id);
    if (!product) {
      return { status: 404, message: 'Produto não encontrado.' };
    }

    if (!isAdmin && !product.active) {
      return { status: 404, message: 'Produto não encontrado.' };
    }

    return { status: 200, data: product };
  } catch (error: any) {
    console.error('Erro ao buscar produto:', error);
    return { status: 500, message: 'Erro ao buscar produto. Tente novamente mais tarde.' };
  }
};

export const createProductService = async (productData: any) => {
  const unknownFields = validateUnknownFields(productData);
  if (unknownFields.length > 0) {
    return {
      status: 400,
      message: 'Campos desconhecidos encontrados.',
      errors: [`Campos inválidos: ${unknownFields.join(', ')}.`],
    };
  }

  const validation = normalizeProductData(productData);
  if (!validation.isValid || !validation.normalized) {
    return {
      status: 400,
      message: 'Dados do produto inválidos.',
      errors: validation.errors,
    };
  }

  try {
    const normalizedData = validation.normalized;
    
    // Verifica se ja existe produto com o mesmo nome
    const existingProduct = await getProductByName(normalizedData.name);
    if (existingProduct) {
      return { status: 400, message: 'Já existe um produto com esse nome.' };
    }

    normalizedData.active = true;
    const product = await createProduct(normalizedData);
    return { status: 201, data: product };
  } catch (error: any) {
    console.error('Erro ao criar produto:', error);
    if (error.code === 'P2002') {
      return { status: 400, message: 'Já existe um produto com esses dados.' };
    }
    return { status: 500, message: 'Erro ao criar produto. Tente novamente mais tarde.' };
  }
};

export const updateProductService = async (id: string, productData: any) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID do produto inválido.' };
  }

  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    return { status: 404, message: 'Produto não encontrado.' };
  }

  const unknownFields = validateUnknownFields(productData);
  if (unknownFields.length > 0) {
    return {
      status: 400,
      message: 'Campos desconhecidos encontrados.',
      errors: [`Campos inválidos: ${unknownFields.join(', ')}.`],
    };
  }

  const validation = normalizeProductData(productData);
  if (!validation.isValid || !validation.normalized) {
    return {
      status: 400,
      message: 'Dados do produto inválidos.',
      errors: validation.errors,
    };
  }

  try {
    const normalizedData = validation.normalized;
    
    // Se esta atualizando o nome, verifica se nao existe outro produto com esse nome
    if (normalizedData.name && normalizedData.name !== existingProduct.name) {
      const productWithSameName = await getProductByName(normalizedData.name);
      if (productWithSameName && productWithSameName.id !== id) {
        return { status: 400, message: 'Já existe outro produto com esse nome.' };
      }
    }

    if (productData.promotionalPrice === null || productData.promotionalPrice === undefined) {
      if ('promotionalPrice' in productData) {
        normalizedData.promotionalPrice = null;
        normalizedData.inPromotion = false;
      }
    }

    const updatedProduct = await editProduct(id, normalizedData);
    return { status: 200, data: updatedProduct };
  } catch (error: any) {
    console.error('Erro ao atualizar produto:', error);
    if (error.code === 'P2025') return { status: 404, message: 'Produto não encontrado.' };
    if (error.code === 'P2002') return { status: 400, message: 'Já existe um produto com esses dados.' };
    return { status: 500, message: 'Erro ao atualizar produto. Tente novamente mais tarde.' };
  }
};

export const deleteProductService = async (id: string) => {
  if (!validateUUID(id)) {
    return { status: 400, message: 'ID do produto inválido.' };
  }

  const existingProduct = await getProductById(id);
  if (!existingProduct) {
    return { status: 404, message: 'Produto não encontrado.' };
  }

  try {
    await deleteProduct(id);
    return { status: 200, message: 'Produto deletado com sucesso.' };
  } catch (error: any) {
    console.error('Erro ao deletar produto:', error);
    if (error.code === 'P2025') return { status: 404, message: 'Produto não encontrado.' };
    return { status: 500, message: 'Erro ao deletar produto. Tente novamente mais tarde.' };
  }
};
