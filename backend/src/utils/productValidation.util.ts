// Validação e normalização de dados de produtos

import { Category, TypeBelt } from '@prisma/client';

/**
 * Valida e normaliza nome do produto
 */
export const validateAndNormalizeProductName = (name: string): { isValid: boolean; normalized: string | null; message?: string } => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, normalized: null, message: 'Nome do produto é obrigatório.' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 3) {
    return { isValid: false, normalized: null, message: 'Nome do produto deve ter no mínimo 3 caracteres.' };
  }

  if (trimmed.length > 100) {
    return { isValid: false, normalized: null, message: 'Nome do produto deve ter no máximo 100 caracteres.' };
  }

  return { isValid: true, normalized: trimmed };
};

/**
 * Valida descrição do produto
 */
export const validateProductDescription = (description: string | null | undefined): { isValid: boolean; normalized: string | null; message?: string } => {
  if (!description) {
    return { isValid: true, normalized: null }; // Opcional
  }

  if (typeof description !== 'string') {
    return { isValid: false, normalized: null, message: 'Descrição deve ser um texto.' };
  }

  const trimmed = description.trim();

  if (trimmed.length > 1000) {
    return { isValid: false, normalized: null, message: 'Descrição deve ter no máximo 1000 caracteres.' };
  }

  return { isValid: true, normalized: trimmed };
};

/**
 * Valida descrição completa do produto
 */
export const validateProductDescriptionComplete = (descriptionComplete: string | null | undefined): { isValid: boolean; normalized: string | null; message?: string } => {
  if (!descriptionComplete) {
    return { isValid: true, normalized: null }; // Opcional
  }

  if (typeof descriptionComplete !== 'string') {
    return { isValid: false, normalized: null, message: 'Descrição completa deve ser um texto.' };
  }

  const trimmed = descriptionComplete.trim();

  if (trimmed.length > 5000) {
    return { isValid: false, normalized: null, message: 'Descrição completa deve ter no máximo 5000 caracteres.' };
  }

  return { isValid: true, normalized: trimmed };
};

/**
 * Valida preço base do produto
 */
export const validateBasePrice = (price: number | string | null | undefined): { isValid: boolean; normalized: number | null; message?: string } => {
  if (price === null || price === undefined) {
    return { isValid: false, normalized: null, message: 'Preço base é obrigatório.' };
  }

  const numPrice = typeof price === 'string' ? parseFloat(price) : Number(price);

  if (isNaN(numPrice)) {
    return { isValid: false, normalized: null, message: 'Preço base deve ser um número válido.' };
  }

  if (numPrice <= 0) {
    return { isValid: false, normalized: null, message: 'Preço base deve ser maior que zero.' };
  }

  if (numPrice > 999999.99) {
    return { isValid: false, normalized: null, message: 'Preço base não pode ser maior que R$ 999.999,99.' };
  }

  // Arredondar para 2 casas decimais
  const normalized = Math.round(numPrice * 100) / 100;

  return { isValid: true, normalized };
};

/**
 * Valida preço promocional do produto
 */
export const validatePromotionalPrice = (
  promotionalPrice: number | string | null | undefined,
  basePrice: number
): { isValid: boolean; normalized: number | null; message?: string } => {
  // Se for null, undefined, string vazia ou 0, retorna null (remove promoção)
  if (promotionalPrice === null || promotionalPrice === undefined || promotionalPrice === '' || promotionalPrice === 0) {
    return { isValid: true, normalized: null };
  }

  const numPrice = typeof promotionalPrice === 'string' ? parseFloat(promotionalPrice) : Number(promotionalPrice);

  if (isNaN(numPrice)) {
    return { isValid: false, normalized: null, message: 'Preço promocional deve ser um número válido.' };
  }

  if (numPrice <= 0) {
    return { isValid: false, normalized: null, message: 'Preço promocional deve ser maior que zero.' };
  }

  if (numPrice >= basePrice) {
    return { isValid: false, normalized: null, message: 'Preço promocional deve ser menor que o preço base.' };
  }

  if (numPrice > 999999.99) {
    return { isValid: false, normalized: null, message: 'Preço promocional não pode ser maior que R$ 999.999,99.' };
  }

  // Arredondar para 2 casas decimais
  const normalized = Math.round(numPrice * 100) / 100;

  return { isValid: true, normalized };
};

/**
 * Valida categoria do produto
 */
export const validateCategory = (category: string | null | undefined): { isValid: boolean; normalized: Category | null; message?: string } => {
  if (!category) {
    return { isValid: false, normalized: null, message: 'Categoria é obrigatória.' };
  }

  const upperCategory = category.toUpperCase().trim();

  const validCategories: Category[] = ['BELTS', 'BUCKLE', 'ACCESSORIES'];

  if (!validCategories.includes(upperCategory as Category)) {
    return {
      isValid: false,
      normalized: null,
      message: `Categoria inválida. Categorias válidas: ${validCategories.join(', ')}.`,
    };
  }

  return { isValid: true, normalized: upperCategory as Category };
};

/**
 * Valida tipo de cinto
 */
export const validateTypeBelt = (typeBelt: string | null | undefined): { isValid: boolean; normalized: TypeBelt | null; message?: string } => {
  if (!typeBelt) {
    return { isValid: true, normalized: null }; // Opcional
  }

  const upperTypeBelt = typeBelt.toUpperCase().trim();

  const validTypes: TypeBelt[] = ['CLASSIC', 'CASUAL', 'EXECUTIVE', 'SPORTY', 'SOCIAL'];

  if (!validTypes.includes(upperTypeBelt as TypeBelt)) {
    return {
      isValid: false,
      normalized: null,
      message: `Tipo de cinto inválido. Tipos válidos: ${validTypes.join(', ')}.`,
    };
  }

  return { isValid: true, normalized: upperTypeBelt as TypeBelt };
};

/**
 * Valida estrutura de características do produto
 */
export const validateCharacteristics = (characteristics: any): { isValid: boolean; normalized: any | null; message?: string } => {
  if (!characteristics) {
    return { isValid: true, normalized: null }; // Opcional
  }

  if (typeof characteristics !== 'object' || Array.isArray(characteristics)) {
    return { isValid: false, normalized: null, message: 'Características devem ser um objeto JSON.' };
  }

  // Validações básicas de estrutura esperada
  const requiredFields = ['largura', 'comprimento', 'material', 'acabamento', 'fivela', 'cor'];

  for (const field of requiredFields) {
    if (!(field in characteristics)) {
      return { isValid: false, normalized: null, message: `Campo obrigatório ausente em características: ${field}.` };
    }
  }

  // Validar fivela (deve ser objeto com tipo, formato, dimensoes)
  if (typeof characteristics.fivela !== 'object' || Array.isArray(characteristics.fivela)) {
    return { isValid: false, normalized: null, message: 'Fivela deve ser um objeto com tipo, formato e dimensões.' };
  }

  const fivelaRequiredFields = ['tipo', 'formato', 'dimensoes'];
  for (const field of fivelaRequiredFields) {
    if (!(field in characteristics.fivela)) {
      return { isValid: false, normalized: null, message: `Campo obrigatório ausente em fivela: ${field}.` };
    }
  }

  // Validar tipos de valores esperados
  if (typeof characteristics.largura !== 'string') {
    return { isValid: false, normalized: null, message: 'Largura deve ser uma string.' };
  }

  if (typeof characteristics.comprimento !== 'string') {
    return { isValid: false, normalized: null, message: 'Comprimento deve ser uma string.' };
  }

  if (typeof characteristics.material !== 'string') {
    return { isValid: false, normalized: null, message: 'Material deve ser uma string.' };
  }

  if (typeof characteristics.acabamento !== 'string') {
    return { isValid: false, normalized: null, message: 'Acabamento deve ser uma string.' };
  }

  if (typeof characteristics.cor !== 'string') {
    return { isValid: false, normalized: null, message: 'Cor deve ser uma string.' };
  }

  if (typeof characteristics.fivela.tipo !== 'string') {
    return { isValid: false, normalized: null, message: 'Tipo de fivela deve ser uma string.' };
  }

  if (typeof characteristics.fivela.formato !== 'string') {
    return { isValid: false, normalized: null, message: 'Formato de fivela deve ser uma string.' };
  }

  if (typeof characteristics.fivela.dimensoes !== 'string') {
    return { isValid: false, normalized: null, message: 'Dimensões de fivela devem ser uma string.' };
  }

  return { isValid: true, normalized: characteristics };
};

/**
 * Valida URL de imagem
 */
export const validateImageUrl = (imageUrl: string | null | undefined): { isValid: boolean; normalized: string | null; message?: string } => {
  if (!imageUrl) {
    return { isValid: true, normalized: null }; // Opcional
  }

  if (typeof imageUrl !== 'string') {
    return { isValid: false, normalized: null, message: 'URL da imagem deve ser uma string.' };
  }

  const trimmed = imageUrl.trim();

  if (trimmed.length === 0) {
    return { isValid: true, normalized: null }; // String vazia = opcional
  }

  // Validação básica de URL (http, https, data URLs para imagens)
  const urlRegex = /^(https?:\/\/|data:image\/)/i;
  if (!urlRegex.test(trimmed)) {
    return { isValid: false, normalized: null, message: 'URL da imagem deve começar com http://, https:// ou data:image/.' };
  }

  if (trimmed.length > 2048) {
    return { isValid: false, normalized: null, message: 'URL da imagem é muito longa (máximo 2048 caracteres).' };
  }

  return { isValid: true, normalized: trimmed };
};

/**
 * Valida array de imagens
 */
export const validateImages = (images: any): { isValid: boolean; normalized: string[] | null; message?: string } => {
  if (!images) {
    return { isValid: true, normalized: null }; // Opcional
  }

  if (!Array.isArray(images)) {
    return { isValid: false, normalized: null, message: 'Imagens devem ser um array de URLs.' };
  }

  if (images.length === 0) {
    return { isValid: true, normalized: [] };
  }

  const validatedUrls: string[] = [];

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    if (typeof image !== 'string') {
      return { isValid: false, normalized: null, message: `Imagem no índice ${i} deve ser uma string (URL).` };
    }

    const trimmed = image.trim();

    if (trimmed.length === 0) {
      continue; // Pular URLs vazias
    }

    // Validação básica de URL
    const urlRegex = /^(https?:\/\/|data:image\/)/i;
    if (!urlRegex.test(trimmed)) {
      return {
        isValid: false,
        normalized: null,
        message: `URL da imagem no índice ${i} deve começar com http://, https:// ou data:image/.`,
      };
    }

    if (trimmed.length > 2048) {
      return { isValid: false, normalized: null, message: `URL da imagem no índice ${i} é muito longa (máximo 2048 caracteres).` };
    }

    validatedUrls.push(trimmed);
  }

  return { isValid: true, normalized: validatedUrls };
};

/**
 * Valida estoque
 */
export const validateStock = (stock: number | string | null | undefined): { isValid: boolean; normalized: number | null; message?: string } => {
  if (stock === null || stock === undefined) {
    return { isValid: true, normalized: 0 }; // Default para 0
  }

  const numStock = typeof stock === 'string' ? parseInt(stock, 10) : Number(stock);

  if (isNaN(numStock)) {
    return { isValid: false, normalized: null, message: 'Estoque deve ser um número válido.' };
  }

  if (numStock < 0) {
    return { isValid: false, normalized: null, message: 'Estoque não pode ser negativo.' };
  }

  if (numStock > 999999) {
    return { isValid: false, normalized: null, message: 'Estoque não pode ser maior que 999.999.' };
  }

  return { isValid: true, normalized: Math.floor(numStock) };
};

/**
 * Valida flags booleanas
 */
export const validateBooleanFlag = (value: any, fieldName: string): { isValid: boolean; normalized: boolean | null; message?: string } => {
  if (value === null || value === undefined) {
    return { isValid: true, normalized: false }; // Default para false
  }

  if (typeof value === 'boolean') {
    return { isValid: true, normalized: value };
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'true' || lower === '1' || lower === 'yes') {
      return { isValid: true, normalized: true };
    }
    if (lower === 'false' || lower === '0' || lower === 'no' || lower === '') {
      return { isValid: true, normalized: false };
    }
  }

  if (typeof value === 'number') {
    return { isValid: true, normalized: value !== 0 };
  }

  return { isValid: false, normalized: null, message: `${fieldName} deve ser um valor booleano (true/false).` };
};

/**
 * Normaliza dados completos do produto para criação/atualização
 */
export const normalizeProductData = (productData: any): {
  isValid: boolean;
  normalized: any | null;
  errors: string[];
} => {
  const errors: string[] = [];
  const normalized: any = {};

  // Nome (obrigatório)
  const nameValidation = validateAndNormalizeProductName(productData.name);
  if (!nameValidation.isValid) {
    errors.push(nameValidation.message || 'Nome inválido');
  } else {
    normalized.name = nameValidation.normalized;
  }

  // Descrição (opcional)
  const descValidation = validateProductDescription(productData.description);
  if (!descValidation.isValid) {
    errors.push(descValidation.message || 'Descrição inválida');
  } else if (descValidation.normalized !== null) {
    normalized.description = descValidation.normalized;
  }

  // Descrição completa (opcional)
  const descCompleteValidation = validateProductDescriptionComplete(productData.descriptionComplete);
  if (!descCompleteValidation.isValid) {
    errors.push(descCompleteValidation.message || 'Descrição completa inválida');
  } else if (descCompleteValidation.normalized !== null) {
    normalized.descriptionComplete = descCompleteValidation.normalized;
  }

  // Preço base (obrigatório)
  const basePriceValidation = validateBasePrice(productData.basePrice);
  if (!basePriceValidation.isValid) {
    errors.push(basePriceValidation.message || 'Preço base inválido');
  } else {
    normalized.basePrice = basePriceValidation.normalized;
  }

  // Preço promocional (opcional, mas depende do preço base)
  // Permite remover preço promocional enviando null, undefined, string vazia ou 0
  if ('promotionalPrice' in productData) {
    const promoPriceValue = productData.promotionalPrice;
    
    // Valida e normaliza o preço promocional (a função já trata null/undefined/""/0)
    const promoPriceValidation = validatePromotionalPrice(
      promoPriceValue,
      normalized.basePrice || productData.basePrice
    );
    
    if (!promoPriceValidation.isValid) {
      errors.push(promoPriceValidation.message || 'Preço promocional inválido');
    } else {
      // IMPORTANTE: Sempre incluir o campo, mesmo que seja null
      // O Prisma precisa de null explícito para atualizar o campo no banco
      // Se normalized for null, significa que queremos remover o preço promocional
      if (promoPriceValidation.normalized === null) {
        normalized.promotionalPrice = null; // Explicitamente null
        normalized.inPromotion = false;
      } else {
        normalized.promotionalPrice = promoPriceValidation.normalized;
        normalized.inPromotion = true;
      }
    }
  }

  // Categoria (obrigatória)
  const categoryValidation = validateCategory(productData.category);
  if (!categoryValidation.isValid) {
    errors.push(categoryValidation.message || 'Categoria inválida');
  } else {
    normalized.category = categoryValidation.normalized;
  }

  // Tipo de cinto (opcional)
  if (productData.typeBelt !== undefined && productData.typeBelt !== null) {
    const typeBeltValidation = validateTypeBelt(productData.typeBelt);
    if (!typeBeltValidation.isValid) {
      errors.push(typeBeltValidation.message || 'Tipo de cinto inválido');
    } else if (typeBeltValidation.normalized !== null) {
      normalized.typeBelt = typeBeltValidation.normalized;
    }
  }

  // Características (opcional)
  if (productData.characteristics !== undefined) {
    const charValidation = validateCharacteristics(productData.characteristics);
    if (!charValidation.isValid) {
      errors.push(charValidation.message || 'Características inválidas');
    } else if (charValidation.normalized !== null) {
      normalized.characteristics = charValidation.normalized;
    }
  }

  // URL de imagem (opcional)
  if (productData.imageUrl !== undefined) {
    const imageUrlValidation = validateImageUrl(productData.imageUrl);
    if (!imageUrlValidation.isValid) {
      errors.push(imageUrlValidation.message || 'URL da imagem inválida');
    } else if (imageUrlValidation.normalized !== null) {
      normalized.imageUrl = imageUrlValidation.normalized;
    }
  }

  // Array de imagens (opcional)
  if (productData.images !== undefined) {
    const imagesValidation = validateImages(productData.images);
    if (!imagesValidation.isValid) {
      errors.push(imagesValidation.message || 'Array de imagens inválido');
    } else if (imagesValidation.normalized !== null) {
      normalized.images = imagesValidation.normalized;
    }
  }

  // Flags (opcionais, default false)
  // inPromotion só é atualizado se não foi definido pelo preço promocional
  if (!('promotionalPrice' in productData)) {
    const inPromotionValidation = validateBooleanFlag(productData.inPromotion, 'inPromotion');
    if (!inPromotionValidation.isValid) {
      errors.push(inPromotionValidation.message || 'Flag inPromotion inválida');
    } else {
      normalized.inPromotion = inPromotionValidation.normalized;
      // IMPORTANTE: Se inPromotion for false, promotionalPrice DEVE ser null
      if (normalized.inPromotion === false) {
        normalized.promotionalPrice = null;
      }
    }
  }
  // Se promotionalPrice foi fornecido, inPromotion já foi definido acima
  // Garantir consistência: se inPromotion é false, promotionalPrice deve ser null
  if (normalized.inPromotion === false && normalized.promotionalPrice !== null) {
    normalized.promotionalPrice = null;
  }

  const bestSellingValidation = validateBooleanFlag(productData.bestSelling, 'bestSelling');
  if (!bestSellingValidation.isValid) {
    errors.push(bestSellingValidation.message || 'Flag bestSelling inválida');
  } else {
    normalized.bestSelling = bestSellingValidation.normalized;
  }

  const newValidation = validateBooleanFlag(productData.new, 'new');
  if (!newValidation.isValid) {
    errors.push(newValidation.message || 'Flag new inválida');
  } else {
    normalized.new = newValidation.normalized;
  }

  // Estoque (opcional, default 0)
  const stockValidation = validateStock(productData.stock);
  if (!stockValidation.isValid) {
    errors.push(stockValidation.message || 'Estoque inválido');
  } else {
    normalized.stock = stockValidation.normalized;
  }

  return {
    isValid: errors.length === 0,
    normalized: errors.length === 0 ? normalized : null,
    errors,
  };
};

