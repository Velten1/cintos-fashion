import { useEffect, useRef } from 'react';
import api from '../api/api';

/**
 * Hook que renova automaticamente o token JWT a cada 50 minutos
 * Para manter o usuário logado e o token válido
 */
export const useTokenRenewal = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const renewToken = async () => {
    try {
      await api.post('/auth/renew-token');
      console.log('[Token] Token renovado com sucesso');
    } catch (error) {
      console.error('[Token] Erro ao renovar token:', error);
      // Se falhar ao renovar, pode ser que o token já expirou
      // Você pode redirecionar para login aqui se necessário
    }
  };

  useEffect(() => {
    // Renovar token imediatamente ao montar (se já estiver logado)
    renewToken();

    // Configurar intervalo para renovar a cada 50 minutos (3000000ms)
    // Renovamos antes de 1 hora para garantir que o token não expire
    intervalRef.current = setInterval(() => {
      renewToken();
    }, 50 * 60 * 1000); // 50 minutos

    // Cleanup: limpar intervalo ao desmontar
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { renewToken };
};

