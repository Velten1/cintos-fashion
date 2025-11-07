import {
  getCartByUserId,
  createCart,
  getCartItemById,
  getCartItemByProductId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
} from '../repository/cartRepository';
import { getProductById } from '../repository/productRepository';
import {
  calculateProductPrice,
  validateStock,
  type PriceCalculationInput,
} from '../utils/priceCalculation.util';

/**
 * Valida UUID
 */
const validateUUID = (id: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
};

/**
 * Busca o carrinho do usuário. Se não existir, cria automaticamente.
 */
export const getCartService = async (userId: string) => {
  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  let cart = await getCartByUserId(userId);

  // Se não existe carrinho, cria um novo
  if (!cart) {
    cart = await createCart(userId);
  }

  return {
    status: 200,
    data: cart,
  };
};

/**
 * Adiciona um item ao carrinho ou atualiza a quantidade se o produto já existir.
 */
export const addItemToCartService = async (
  userId: string,
  productId: string,
  quantity: number,
  fabricType?: string,
  characteristics?: Record<string, unknown>
) => {
  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  if (!validateUUID(productId)) {
    return { status: 400, message: 'ID do produto inválido.' };
  }

  if (!quantity || typeof quantity !== 'number' || quantity < 1 || !Number.isInteger(quantity)) {
    return { status: 400, message: 'Quantidade deve ser um número inteiro maior que zero.' };
  }

  // Buscar ou criar carrinho
  let cart = await getCartByUserId(userId);
  if (!cart) {
    cart = await createCart(userId);
  }

  // Verificar se produto existe e está ativo
  const product = await getProductById(productId);
  if (!product) {
    return { status: 404, message: 'Produto não encontrado.' };
  }

  if (!product.active) {
    return { status: 400, message: 'Produto não está disponível para venda.' };
  }

  // Validar estoque
  const hasStock = await validateStock(productId, quantity);
  if (!hasStock) {
    return { status: 400, message: 'Quantidade solicitada excede o estoque disponível.' };
  }

  // Verificar se produto já está no carrinho
  const existingItem = await getCartItemByProductId(cart.id, productId);

  if (existingItem) {
    // Produto já existe no carrinho - somar quantidade e recalcular preço
    const newQuantity = existingItem.quantity + quantity;

    // Validar estoque com nova quantidade total
    const hasStockForNewQuantity = await validateStock(productId, newQuantity);
    if (!hasStockForNewQuantity) {
      return {
        status: 400,
        message: `Quantidade total (${newQuantity}) excede o estoque disponível (${product.stock}).`,
      };
    }

    // Calcular novo preço baseado na quantidade total
    const priceInput: PriceCalculationInput = {
      productId,
      quantity: newQuantity,
      fabricType,
      characteristics,
    };

    const priceResult = await calculateProductPrice(priceInput);

    // Atualizar item existente
    const updatedItem = await updateCartItemQuantity(
      existingItem.id,
      newQuantity,
      priceResult.unitPrice,
      priceResult.subtotal
    );

    return {
      status: 200,
      message: 'Quantidade do item atualizada no carrinho.',
      data: updatedItem,
      debug: {
        priceCalculation: {
          appliedRule: priceResult.appliedRule,
          basePrice: priceResult.basePrice,
          unitPrice: priceResult.unitPrice,
          subtotal: priceResult.subtotal,
          quantity: newQuantity,
        },
      },
    };
  } else {
    // Produto não está no carrinho - adicionar novo item
    const priceInput: PriceCalculationInput = {
      productId,
      quantity,
      fabricType,
      characteristics,
    };

    const priceResult = await calculateProductPrice(priceInput);

    // Adicionar novo item
    const newItem = await addItemToCart(
      cart.id,
      productId,
      quantity,
      priceResult.unitPrice,
      priceResult.subtotal
    );

    return {
      status: 201,
      message: 'Item adicionado ao carrinho.',
      data: newItem,
      debug: {
        priceCalculation: {
          appliedRule: priceResult.appliedRule,
          basePrice: priceResult.basePrice,
          unitPrice: priceResult.unitPrice,
          subtotal: priceResult.subtotal,
          quantity: quantity,
        },
      },
    };
  }
};

/**
 * Atualiza a quantidade de um item no carrinho e recalcula o preço.
 */
export const updateItemQuantityService = async (
  userId: string,
  cartItemId: string,
  newQuantity: number
) => {
  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  if (!validateUUID(cartItemId)) {
    return { status: 400, message: 'ID do item do carrinho inválido.' };
  }

  if (!newQuantity || typeof newQuantity !== 'number' || newQuantity < 1 || !Number.isInteger(newQuantity)) {
    return { status: 400, message: 'Quantidade deve ser um número inteiro maior que zero.' };
  }

  // Buscar item do carrinho
  const cartItem = await getCartItemById(cartItemId);
  if (!cartItem) {
    return { status: 404, message: 'Item do carrinho não encontrado.' };
  }

  // Verificar se o carrinho pertence ao usuário
  if (cartItem.cart.userId !== userId) {
    return { status: 403, message: 'Você não tem permissão para modificar este item.' };
  }

  // Validar estoque
  const hasStock = await validateStock(cartItem.productId, newQuantity);
  if (!hasStock) {
    return { status: 400, message: 'Quantidade solicitada excede o estoque disponível.' };
  }

  // Verificar se produto ainda está ativo
  if (!cartItem.product.active) {
    return { status: 400, message: 'Produto não está mais disponível para venda.' };
  }

  // Calcular novo preço baseado na nova quantidade
  const priceInput: PriceCalculationInput = {
    productId: cartItem.productId,
    quantity: newQuantity,
    fabricType: undefined, // Não temos fabricType no CartItem, pode ser adicionado depois se necessário
    characteristics: cartItem.product.characteristics as Record<string, unknown> | undefined,
  };

  const priceResult = await calculateProductPrice(priceInput);

  // Atualizar item
  const updatedItem = await updateCartItemQuantity(
    cartItemId,
    newQuantity,
    priceResult.unitPrice,
    priceResult.subtotal
  );

  return {
    status: 200,
    message: 'Quantidade do item atualizada.',
    data: updatedItem,
    debug: {
      priceCalculation: {
        appliedRule: priceResult.appliedRule,
        basePrice: priceResult.basePrice,
        unitPrice: priceResult.unitPrice,
        subtotal: priceResult.subtotal,
        quantity: newQuantity,
      },
    },
  };
};

/**
 * Remove um item do carrinho.
 */
export const removeItemService = async (userId: string, cartItemId: string) => {
  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  if (!validateUUID(cartItemId)) {
    return { status: 400, message: 'ID do item do carrinho inválido.' };
  }

  // Buscar item do carrinho
  const cartItem = await getCartItemById(cartItemId);
  if (!cartItem) {
    return { status: 404, message: 'Item do carrinho não encontrado.' };
  }

  // Verificar se o carrinho pertence ao usuário
  if (cartItem.cart.userId !== userId) {
    return { status: 403, message: 'Você não tem permissão para remover este item.' };
  }

  // Remover item
  await removeItemFromCart(cartItemId);

  return {
    status: 200,
    message: 'Item removido do carrinho.',
  };
};

/**
 * Limpa todos os items do carrinho.
 */
export const clearCartService = async (userId: string) => {
  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  // Buscar carrinho
  const cart = await getCartByUserId(userId);
  if (!cart) {
    return { status: 404, message: 'Carrinho não encontrado.' };
  }

  // Limpar carrinho
  await clearCart(cart.id);

  return {
    status: 200,
    message: 'Carrinho limpo com sucesso.',
  };
};

/**
 * Calcula o total do carrinho.
 */
export const getCartTotalService = async (userId: string) => {
  if (!validateUUID(userId)) {
    return { status: 400, message: 'ID do usuário inválido.' };
  }

  // Buscar carrinho
  const cart = await getCartByUserId(userId);
  if (!cart) {
    return {
      status: 200,
      data: { total: 0 },
    };
  }

  // Calcular total somando todos os subtotais
  const total = cart.items.reduce((sum, item) => {
    return sum + Number(item.subtotal);
  }, 0);

  return {
    status: 200,
    data: {
      total: Math.round(total * 100) / 100,
    },
  };
};

