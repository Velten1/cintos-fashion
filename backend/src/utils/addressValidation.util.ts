// Validação e normalização de dados de endereço

/**
 * Estados brasileiros válidos (UF)
 */
const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

/**
 * Valida e normaliza CEP (formato brasileiro)
 */
export const validateAndNormalizeCEP = (cep: string): { isValid: boolean; normalized: string | null } => {
  // Remove caracteres não numéricos
  const cleaned = cep.replace(/\D/g, '');
  
  // CEP deve ter exatamente 8 dígitos
  if (cleaned.length !== 8) {
    return { isValid: false, normalized: null };
  }
  
  // Verifica se todos os dígitos são iguais (ex: 00000000, 11111111)
  if (/^(\d)\1{7}$/.test(cleaned)) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: cleaned };
};

/**
 * Valida e normaliza estado (UF)
 */
export const validateAndNormalizeState = (state: string): { isValid: boolean; normalized: string | null } => {
  // Remove espaços e converte para uppercase
  const trimmed = state.trim().toUpperCase();
  
  // Verifica se está na lista de estados válidos
  if (!BRAZILIAN_STATES.includes(trimmed)) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Valida e normaliza nome do endereço
 */
export const validateAndNormalizeAddressName = (name: string): { isValid: boolean; normalized: string | null } => {
  const trimmed = name.trim();
  
  // Nome deve ter entre 2 e 50 caracteres
  if (trimmed.length < 2 || trimmed.length > 50) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Valida e normaliza rua
 */
export const validateAndNormalizeStreet = (street: string): { isValid: boolean; normalized: string | null } => {
  const trimmed = street.trim();
  
  // Rua deve ter entre 3 e 200 caracteres
  if (trimmed.length < 3 || trimmed.length > 200) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Valida e normaliza número
 */
export const validateAndNormalizeNumber = (number: string): { isValid: boolean; normalized: string | null } => {
  const trimmed = number.trim();
  
  // Número deve ter entre 1 e 20 caracteres (permite "S/N", "123A", etc)
  if (trimmed.length < 1 || trimmed.length > 20) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Valida e normaliza complemento (opcional)
 */
export const validateAndNormalizeComplement = (complement: string | null | undefined): { isValid: boolean; normalized: string | null } => {
  // Complemento é opcional
  if (!complement) {
    return { isValid: true, normalized: null };
  }
  
  const trimmed = complement.trim();
  
  // Se fornecido, deve ter entre 1 e 100 caracteres
  if (trimmed.length < 1 || trimmed.length > 100) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Valida e normaliza bairro
 */
export const validateAndNormalizeNeighborhood = (neighborhood: string): { isValid: boolean; normalized: string | null } => {
  const trimmed = neighborhood.trim();
  
  // Bairro deve ter entre 2 e 100 caracteres
  if (trimmed.length < 2 || trimmed.length > 100) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Valida e normaliza cidade
 */
export const validateAndNormalizeCity = (city: string): { isValid: boolean; normalized: string | null } => {
  const trimmed = city.trim();
  
  // Cidade deve ter entre 2 e 100 caracteres
  if (trimmed.length < 2 || trimmed.length > 100) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Interface para dados de endereço normalizados
 */
export interface NormalizedAddressData {
  userId: string;
  name: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

/**
 * Valida e normaliza todos os dados de um endereço
 */
export const normalizeAddressData = (addressData: any): {
  isValid: boolean;
  normalized: NormalizedAddressData | null;
  errors: string[];
} => {
  const errors: string[] = [];
  
  // Validar campos obrigatórios
  if (!addressData.userId || typeof addressData.userId !== 'string' || addressData.userId.trim().length === 0) {
    errors.push('ID do usuário é obrigatório.');
  }
  
  if (!addressData.name) {
    errors.push('Nome do endereço é obrigatório.');
  }
  
  if (!addressData.street) {
    errors.push('Rua é obrigatória.');
  }
  
  if (!addressData.number) {
    errors.push('Número é obrigatório.');
  }
  
  if (!addressData.neighborhood) {
    errors.push('Bairro é obrigatório.');
  }
  
  if (!addressData.city) {
    errors.push('Cidade é obrigatória.');
  }
  
  if (!addressData.state) {
    errors.push('Estado (UF) é obrigatório.');
  }
  
  if (!addressData.zipCode) {
    errors.push('CEP é obrigatório.');
  }
  
  if (errors.length > 0) {
    return { isValid: false, normalized: null, errors };
  }
  
  // Validar e normalizar cada campo
  const nameValidation = validateAndNormalizeAddressName(addressData.name);
  if (!nameValidation.isValid) {
    errors.push('Nome do endereço deve ter entre 2 e 50 caracteres.');
  }
  
  const streetValidation = validateAndNormalizeStreet(addressData.street);
  if (!streetValidation.isValid) {
    errors.push('Rua deve ter entre 3 e 200 caracteres.');
  }
  
  const numberValidation = validateAndNormalizeNumber(addressData.number);
  if (!numberValidation.isValid) {
    errors.push('Número deve ter entre 1 e 20 caracteres.');
  }
  
  const complementValidation = validateAndNormalizeComplement(addressData.complement);
  if (!complementValidation.isValid) {
    errors.push('Complemento deve ter entre 1 e 100 caracteres.');
  }
  
  const neighborhoodValidation = validateAndNormalizeNeighborhood(addressData.neighborhood);
  if (!neighborhoodValidation.isValid) {
    errors.push('Bairro deve ter entre 2 e 100 caracteres.');
  }
  
  const cityValidation = validateAndNormalizeCity(addressData.city);
  if (!cityValidation.isValid) {
    errors.push('Cidade deve ter entre 2 e 100 caracteres.');
  }
  
  const stateValidation = validateAndNormalizeState(addressData.state);
  if (!stateValidation.isValid) {
    errors.push('Estado (UF) inválido. Use um dos estados brasileiros válidos (ex: SP, RJ, MG).');
  }
  
  const cepValidation = validateAndNormalizeCEP(addressData.zipCode);
  if (!cepValidation.isValid) {
    errors.push('CEP inválido. Deve conter 8 dígitos numéricos.');
  }
  
  if (errors.length > 0) {
    return { isValid: false, normalized: null, errors };
  }
  
  // Retornar dados normalizados
  const normalized: NormalizedAddressData = {
    userId: addressData.userId.trim(),
    name: nameValidation.normalized!,
    street: streetValidation.normalized!,
    number: numberValidation.normalized!,
    complement: complementValidation.normalized,
    neighborhood: neighborhoodValidation.normalized!,
    city: cityValidation.normalized!,
    state: stateValidation.normalized!,
    zipCode: cepValidation.normalized!,
    isDefault: addressData.isDefault === true || addressData.isDefault === 'true',
  };
  
  return { isValid: true, normalized, errors: [] };
};

