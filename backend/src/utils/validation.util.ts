// Validação e normalização de dados

/**
 * Valida e normaliza email
 */
export const validateAndNormalizeEmail = (email: string): { isValid: boolean; normalized: string | null } => {
  // Remove espaços e converte para lowercase
  const trimmed = email.trim().toLowerCase();
  
  // Valida tamanho mínimo e máximo
  if (trimmed.length < 5 || trimmed.length > 254) {
    return { isValid: false, normalized: null };
  }
  
  // Deve ter: parte local + @ + domínio + . + TLD (mínimo 2 caracteres)
  const emailRegex = /^[a-z0-9]([a-z0-9._-]*[a-z0-9])?@([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, normalized: null };
  }
  
  // Validação adicional: verifica se não tem caracteres inválidos consecutivos
  if (trimmed.includes('..') || trimmed.startsWith('.') || trimmed.endsWith('.')) {
    return { isValid: false, normalized: null };
  }
  
  // Verifica se não começa ou termina com hífen na parte local ou domínio
  const [localPart, domain] = trimmed.split('@');
  if (!localPart || !domain) {
    return { isValid: false, normalized: null };
  }
  
  if (localPart.startsWith('-') || localPart.endsWith('-') ||
      localPart.startsWith('_') || localPart.endsWith('_')) {
    return { isValid: false, normalized: null };
  }
  
  // Valida estrutura do domínio
  if (domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) {
    return { isValid: false, normalized: null };
  }
  
  // Verifica se tem pelo menos um ponto no domínio (separando domínio de TLD)
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, normalized: null };
  }
  
  // TLD deve ter no mínimo 2 caracteres e máximo 4 caracteres (cobre 99% dos casos reais)
  // TLDs comuns: com, org, net, br, uk, gov, edu, etc. (2-4 caracteres)
  // TLDs mais longos são raros e geralmente suspeitos
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || tld.length > 4) {
    return { isValid: false, normalized: null };
  }
  
  // TLD deve conter apenas letras
  if (!/^[a-z]+$/i.test(tld)) {
    return { isValid: false, normalized: null };
  }
  
  // Lista de TLDs comuns válidos (mais comuns do mundo)
  const commonTlds = [
    'com', 'org', 'net', 'edu', 'gov', 'mil', 'int',
    'br', 'uk', 'us', 'ca', 'au', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'be', 'ch', 'at', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'ie', 'gr', 'ru', 'jp', 'cn', 'in', 'mx', 'ar', 'co', 'cl', 'pe', 'za', 'ae', 'sa', 'il', 'tr', 'kr', 'tw', 'sg', 'hk', 'nz',
    'info', 'biz', 'name', 'pro', 'jobs', 'mobi', 'travel', 'asia', 'tel', 'coop', 'aero', 'museum'
  ];
  
  // Valida se o TLD está na lista de TLDs comuns
  if (!commonTlds.includes(tld.toLowerCase())) {
    return { isValid: false, normalized: null };
  }
  
  // Valida que cada parte do domínio não está vazia
  for (const part of domainParts) {
    if (part.length === 0 || part.startsWith('-') || part.endsWith('-')) {
      return { isValid: false, normalized: null };
    }
  }
  
  return { isValid: true, normalized: trimmed };
};

/**
 * Valida e normaliza CPF
 */
export const validateAndNormalizeCPF = (cpf: string): { isValid: boolean; normalized: string | null } => {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/\D/g, '');
  
  // CPF deve ter 11 dígitos
  if (cleaned.length !== 11) {
    return { isValid: false, normalized: null };
  }
  
  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return { isValid: false, normalized: null };
  }
  
  // Validação dos dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) {
    return { isValid: false, normalized: null };
  }
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: cleaned };
};

/**
 * Valida e normaliza CNPJ
 */
export const validateAndNormalizeCNPJ = (cnpj: string): { isValid: boolean; normalized: string | null } => {
  // Remove caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, '');
  
  // CNPJ deve ter 14 dígitos
  if (cleaned.length !== 14) {
    return { isValid: false, normalized: null };
  }
  
  // Verifica se todos os dígitos são iguais (ex: 11.111.111/1111-11)
  if (/^(\d)\1{13}$/.test(cleaned)) {
    return { isValid: false, normalized: null };
  }
  
  // Validação dos dígitos verificadores
  let length = cleaned.length - 2;
  let numbers = cleaned.substring(0, length);
  const digits = cleaned.substring(length);
  let sum = 0;
  let pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return { isValid: false, normalized: null };
  }
  
  length = length + 1;
  numbers = cleaned.substring(0, length);
  sum = 0;
  pos = length - 7;
  
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return { isValid: false, normalized: null };
  }
  
  return { isValid: true, normalized: cleaned };
};

/**
 * Detecta se é CPF ou CNPJ e valida
 */
export const validateAndNormalizeCPFCNPJ = (cpfCnpj: string): { isValid: boolean; normalized: string | null; type: 'CPF' | 'CNPJ' | null } => {
  // Remove caracteres não numéricos
  const cleaned = cpfCnpj.replace(/\D/g, '');
  
  // Se tem 11 dígitos, é CPF
  if (cleaned.length === 11) {
    const result = validateAndNormalizeCPF(cpfCnpj);
    return { ...result, type: result.isValid ? 'CPF' : null };
  }
  
  // Se tem 14 dígitos, é CNPJ
  if (cleaned.length === 14) {
    const result = validateAndNormalizeCNPJ(cpfCnpj);
    return { ...result, type: result.isValid ? 'CNPJ' : null };
  }
  
  return { isValid: false, normalized: null, type: null };
};

/**
 * Valida e normaliza telefone (formato brasileiro)
 */
export const validateAndNormalizePhone = (phone: string): { isValid: boolean; normalized: string | null } => {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Telefone brasileiro deve ter:
  // - 10 dígitos (fixo): DDD (2) + número (8) = (XX) XXXX-XXXX
  // - 11 dígitos (celular): DDD (2) + 9 + número (8) = (XX) 9XXXX-XXXX
  
  // Remove o 0 inicial se tiver (ex: 011 -> 11)
  const withoutLeadingZero = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
  
  // Remove código do país se tiver (55 para Brasil)
  let phoneNumber = withoutLeadingZero;
  if (withoutLeadingZero.length === 13 && withoutLeadingZero.startsWith('55')) {
    phoneNumber = withoutLeadingZero.substring(2);
  }
  
  // Validação rigorosa: deve ter exatamente 10 ou 11 dígitos
  if (phoneNumber.length !== 10 && phoneNumber.length !== 11) {
    return { isValid: false, normalized: null };
  }
  
  // Valida DDD (primeiros 2 dígitos devem ser entre 11 e 99)
  const ddd = parseInt(phoneNumber.substring(0, 2));
  if (ddd < 11 || ddd > 99) {
    return { isValid: false, normalized: null };
  }
  
  // Valida número do telefone (após DDD)
  const numberPart = phoneNumber.substring(2);
  
  if (phoneNumber.length === 10) {
    // Telefone fixo: deve ter 8 dígitos após DDD
    if (numberPart.length !== 8) {
      return { isValid: false, normalized: null };
    }
    // Primeiro dígito do número fixo não pode ser 0 ou 1
    if (numberPart.charAt(0) === '0' || numberPart.charAt(0) === '1') {
      return { isValid: false, normalized: null };
    }
    return { isValid: true, normalized: phoneNumber };
  }
  
  if (phoneNumber.length === 11) {
    // Celular: deve ter 9 dígitos após DDD, sendo o primeiro 9
    if (numberPart.length !== 9) {
      return { isValid: false, normalized: null };
    }
    // Primeiro dígito do número celular deve ser 9
    if (numberPart.charAt(0) !== '9') {
      return { isValid: false, normalized: null };
    }
    // Segundo dígito do celular não pode ser 0
    if (numberPart.charAt(1) === '0') {
      return { isValid: false, normalized: null };
    }
    return { isValid: true, normalized: phoneNumber };
  }
  
  return { isValid: false, normalized: null };
};

