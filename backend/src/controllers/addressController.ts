import { Request, Response } from 'express';
import {
  getAllAddressesService,
  getAddressByIdService,
  createAddressService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
} from '../services/addressService';

const ALLOWED_FIELDS = ['name', 'street', 'number', 'complement', 'neighborhood', 'city', 'state', 'zipCode', 'isDefault'];

/**
 * Valida campos obrigatórios para criação de endereço
 */
const validateCreateAddressInput = (body: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('Nome do endereço é obrigatório e deve ser uma string válida.');
  }

  if (!body.street || typeof body.street !== 'string' || body.street.trim().length === 0) {
    errors.push('Rua é obrigatória e deve ser uma string válida.');
  }

  if (!body.number || typeof body.number !== 'string' || body.number.trim().length === 0) {
    errors.push('Número é obrigatório e deve ser uma string válida.');
  }

  if (!body.neighborhood || typeof body.neighborhood !== 'string' || body.neighborhood.trim().length === 0) {
    errors.push('Bairro é obrigatório e deve ser uma string válida.');
  }

  if (!body.city || typeof body.city !== 'string' || body.city.trim().length === 0) {
    errors.push('Cidade é obrigatória e deve ser uma string válida.');
  }

  if (!body.state || typeof body.state !== 'string' || body.state.trim().length === 0) {
    errors.push('Estado (UF) é obrigatório e deve ser uma string válida.');
  }

  if (!body.zipCode || typeof body.zipCode !== 'string' || body.zipCode.trim().length === 0) {
    errors.push('CEP é obrigatório e deve ser uma string válida.');
  }

  // Valida campos opcionais se fornecidos
  if (body.complement !== undefined && body.complement !== null) {
    if (typeof body.complement !== 'string') {
      errors.push('Complemento deve ser uma string válida.');
    }
  }

  if (body.isDefault !== undefined && body.isDefault !== null) {
    if (typeof body.isDefault !== 'boolean' && body.isDefault !== 'true' && body.isDefault !== 'false') {
      errors.push('isDefault deve ser um booleano (true ou false).');
    }
  }

  // Valida campos desconhecidos
  const bodyKeys = Object.keys(body);
  const invalidKeys = bodyKeys.filter((key) => !ALLOWED_FIELDS.includes(key));
  if (invalidKeys.length > 0) {
    errors.push(`Campos desconhecidos: ${invalidKeys.join(', ')}.`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Valida campos para atualização de endereço
 */
const validateUpdateAddressInput = (body: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Verifica se pelo menos um campo válido foi fornecido
  const hasValidField = ALLOWED_FIELDS.some((field) => body[field] !== undefined);
  if (!hasValidField) {
    errors.push('Nenhum campo válido foi fornecido para atualização.');
  }

  // Valida cada campo se fornecido
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.push('Nome do endereço deve ser uma string válida.');
    }
  }

  if (body.street !== undefined) {
    if (typeof body.street !== 'string' || body.street.trim().length === 0) {
      errors.push('Rua deve ser uma string válida.');
    }
  }

  if (body.number !== undefined) {
    if (typeof body.number !== 'string' || body.number.trim().length === 0) {
      errors.push('Número deve ser uma string válida.');
    }
  }

  if (body.complement !== undefined && body.complement !== null) {
    if (typeof body.complement !== 'string') {
      errors.push('Complemento deve ser uma string válida.');
    }
  }

  if (body.neighborhood !== undefined) {
    if (typeof body.neighborhood !== 'string' || body.neighborhood.trim().length === 0) {
      errors.push('Bairro deve ser uma string válida.');
    }
  }

  if (body.city !== undefined) {
    if (typeof body.city !== 'string' || body.city.trim().length === 0) {
      errors.push('Cidade deve ser uma string válida.');
    }
  }

  if (body.state !== undefined) {
    if (typeof body.state !== 'string' || body.state.trim().length === 0) {
      errors.push('Estado (UF) deve ser uma string válida.');
    }
  }

  if (body.zipCode !== undefined) {
    if (typeof body.zipCode !== 'string' || body.zipCode.trim().length === 0) {
      errors.push('CEP deve ser uma string válida.');
    }
  }

  if (body.isDefault !== undefined && body.isDefault !== null) {
    if (typeof body.isDefault !== 'boolean' && body.isDefault !== 'true' && body.isDefault !== 'false') {
      errors.push('isDefault deve ser um booleano (true ou false).');
    }
  }

  // Valida campos desconhecidos
  const bodyKeys = Object.keys(body);
  const invalidKeys = bodyKeys.filter((key) => !ALLOWED_FIELDS.includes(key));
  if (invalidKeys.length > 0) {
    errors.push(`Campos desconhecidos: ${invalidKeys.join(', ')}.`);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * GET /api/addresses - Lista todos os endereços do usuário autenticado
 */
export const getAllAddressesController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Token não fornecido ou inválido.' });
    }

    const response = await getAllAddressesService(userId);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao buscar endereços:', error);
    return res.status(500).json({ message: 'Erro ao buscar endereços.', error: error.message });
  }
};

/**
 * GET /api/addresses/:id - Busca um endereço específico
 */
export const getAddressByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID do endereço é obrigatório.' });
    }

    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Token não fornecido ou inválido.' });
    }

    const response = await getAddressByIdService(id, userId);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao buscar endereço:', error);
    return res.status(500).json({ message: 'Erro ao buscar endereço.', error: error.message });
  }
};

/**
 * POST /api/addresses - Cria um novo endereço
 */
export const createAddressController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Token não fornecido ou inválido.' });
    }

    // Remove userId do body se vier (userId vem do token, não do body)
    const { userId: _, ...bodyWithoutUserId } = req.body;

    // Validação de input
    const validation = validateCreateAddressInput(bodyWithoutUserId);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Dados de entrada inválidos. Por favor, preencha os campos corretamente.',
        errors: validation.errors,
      });
    }

    // Adiciona userId aos dados do endereço (vem do token)
    const addressData = {
      ...bodyWithoutUserId,
      userId,
    };

    const response = await createAddressService(addressData, userId);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao criar endereço:', error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'campo';
      return res.status(400).json({ message: `Já existe um endereço com esse ${field}.` });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ message: 'Usuário não encontrado.' });
    }
    return res.status(500).json({ message: 'Erro ao criar endereço.', error: error.message });
  }
};

/**
 * PUT /api/addresses/:id - Atualiza um endereço existente
 */
export const updateAddressController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID do endereço é obrigatório.' });
    }

    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Token não fornecido ou inválido.' });
    }

    // Validação de input
    const validation = validateUpdateAddressInput(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Dados de entrada inválidos. Por favor, preencha os campos corretamente.',
        errors: validation.errors,
      });
    }

    const response = await updateAddressService(id, userId, req.body);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao atualizar endereço:', error);
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'campo';
      return res.status(400).json({ message: `Já existe um endereço com esse ${field}.` });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Endereço não encontrado.' });
    }
    return res.status(500).json({ message: 'Erro ao atualizar endereço.', error: error.message });
  }
};

/**
 * DELETE /api/addresses/:id - Deleta um endereço
 */
export const deleteAddressController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID do endereço é obrigatório.' });
    }

    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Token não fornecido ou inválido.' });
    }

    const response = await deleteAddressService(id, userId);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao deletar endereço:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Endereço não encontrado.' });
    }
    return res.status(500).json({ message: 'Erro ao deletar endereço.', error: error.message });
  }
};

/**
 * PATCH /api/addresses/:id/default - Define um endereço como padrão
 */
export const setDefaultAddressController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'ID do endereço é obrigatório.' });
    }

    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Token não fornecido ou inválido.' });
    }

    const response = await setDefaultAddressService(id, userId);
    return res.status(response.status).json(response);
  } catch (error: any) {
    console.error('Erro ao definir endereço padrão:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Endereço não encontrado.' });
    }
    return res.status(500).json({ message: 'Erro ao definir endereço padrão.', error: error.message });
  }
};

