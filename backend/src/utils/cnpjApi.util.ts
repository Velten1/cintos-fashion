// Consulta CNPJ em APIs externas para validar existência real

interface CNPJValidationData {
  razaoSocial?: string;
  nomeFantasia?: string;
  situacaoCadastral?: string;
  abertura?: string;
}

interface CNPJApiResponse {
  situacao_cadastral?: string;
  razao_social?: string;
  nome_fantasia?: string;
  status?: string;
  nome?: string;
  fantasia?: string;
  situacao?: string;
  abertura?: string;
}

/**
 * Consulta CNPJ na API OpenCNPJ (gratuita)
 * Retorna true se CNPJ existe e está ativo
 */
export const validateCNPJExists = async (cnpj: string): Promise<{ exists: boolean; isActive: boolean; data?: CNPJValidationData }> => {
  try {
    // Remove formatação
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    // API OpenCNPJ (gratuita)
    const response = await fetch(`https://opencnpj.org/api/v1/cnpj/${cleanCnpj}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      // Se não encontrou ou erro, CNPJ não existe
      return { exists: false, isActive: false };
    }

    // Verifica se a resposta é JSON válido
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('API retornou resposta não-JSON');
      return { exists: false, isActive: false };
    }

    const data = await response.json() as CNPJApiResponse;
    
    // Verifica se CNPJ está ativo (situação cadastral)
    const situation = data.situacao_cadastral?.toLowerCase();
    const isActive = situation === 'ativa' || situation === 'apta';
    
    return {
      exists: true,
      isActive: isActive,
      data: {
        razaoSocial: data.razao_social,
        nomeFantasia: data.nome_fantasia,
        situacaoCadastral: data.situacao_cadastral,
      }
    };
  } catch (error: any) {
    // Silencia erros de JSON parse (API retornou HTML ou erro)
    if (error instanceof SyntaxError) {
      console.error('API retornou resposta inválida (não é JSON)');
    } else {
      console.error('Erro ao consultar CNPJ na API:', error.message);
    }
    // Em caso de erro na API, retorna false (não bloqueia, mas não valida)
    return { exists: false, isActive: false };
  }
};

/**
 * Consulta CNPJ na API oficial da Receita Federal
 * Mais confiável, mas pode ter rate limiting
 */
export const validateCNPJReceitaFederal = async (cnpj: string): Promise<{ exists: boolean; isActive: boolean; data?: CNPJValidationData }> => {
  try {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    // API oficial da Receita Federal
    const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCnpj}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return { exists: false, isActive: false };
    }

    // Verifica se a resposta é JSON válido
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('API Receita Federal retornou resposta não-JSON');
      return { exists: false, isActive: false };
    }

    const data = await response.json() as CNPJApiResponse;
    
    // Se retornou erro da API
    if (data.status === 'ERROR') {
      return { exists: false, isActive: false };
    }
    
    // Verifica situação
    const situation = data.situacao?.toLowerCase();
    const isActive = situation === 'ativa' || situation === 'apta';
    
    return {
      exists: true,
      isActive: isActive,
      data: {
        razaoSocial: data.nome,
        nomeFantasia: data.fantasia,
        situacaoCadastral: data.situacao,
        abertura: data.abertura,
      }
    };
  } catch (error: any) {
    // Silencia erros de JSON parse (API retornou HTML ou erro)
    if (error instanceof SyntaxError) {
      console.error('API Receita Federal retornou resposta inválida (não é JSON)');
    } else {
      console.error('Erro ao consultar CNPJ na Receita Federal:', error.message);
    }
    return { exists: false, isActive: false };
  }
};

/**
 * Valida CNPJ com fallback: tenta OpenCNPJ primeiro, depois Receita Federal
 */
export const validateCNPJWithAPI = async (cnpj: string): Promise<{ exists: boolean; isActive: boolean; data?: CNPJValidationData }> => {
  // Tenta OpenCNPJ primeiro (mais rápido e gratuito)
  const openCNPJResult = await validateCNPJExists(cnpj);
  
  if (openCNPJResult.exists) {
    return openCNPJResult;
  }
  
  // Se OpenCNPJ falhou, tenta Receita Federal (pode ser mais lento)
  return await validateCNPJReceitaFederal(cnpj);
};

