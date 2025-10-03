/**
 * Configuração centralizada dos clients da API gerados pelo OpenAPI Generator
 * 
 * Este arquivo configura a base URL e headers padrão para todos os clients.
 * Quando você regenerar os clients com openapi-generator-cli, este arquivo
 * continuará funcionando sem alterações.
 */

import { Configuration } from '@/api';

/**
 * Base URL da API - configurável via variável de ambiente
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Configuração padrão para todos os clients da API
 */
export const apiConfig = new Configuration({
  basePath: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Função para criar uma nova configuração com token de autenticação
 * Use esta função quando precisar fazer chamadas autenticadas
 */
export const createAuthConfig = (token: string): Configuration => {
  return new Configuration({
    basePath: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
};

/**
 * Helper para tratamento de erros da API
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof Response) {
    return `Erro ${error.status}: ${error.statusText}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Erro desconhecido ao comunicar com a API';
};
