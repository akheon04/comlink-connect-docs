/**
 * Hook customizado para gerenciar clients da API
 * 
 * Este hook fornece uma maneira consistente de usar os clients gerados
 * pelo OpenAPI Generator em todo o aplicativo.
 */

import { useMemo } from 'react';
import { apiConfig, createAuthConfig } from '@/lib/api-config';

/**
 * Hook para obter a configuração da API
 * 
 * @param authToken - Token de autenticação opcional
 * @returns Configuração da API (com ou sem autenticação)
 */
export const useApiConfig = (authToken?: string) => {
  return useMemo(() => {
    if (authToken) {
      return createAuthConfig(authToken);
    }
    return apiConfig;
  }, [authToken]);
};

/**
 * Hook genérico para criar uma instância de qualquer API controller
 * 
 * @example
 * ```tsx
 * const messageApi = useApiClient(MessageControllerApi);
 * const result = await messageApi.getAllMessages();
 * ```
 */
export const useApiClient = <T>(
  ApiClass: new (config: any) => T,
  authToken?: string
): T => {
  const config = useApiConfig(authToken);
  
  return useMemo(() => {
    return new ApiClass(config);
  }, [ApiClass, config]);
};
