/**
 * Hook customizado para interagir com o MessageController
 * 
 * Este é um exemplo de como criar hooks específicos para cada controller.
 * Quando você regenerar os clients, apenas atualize os imports e tipos.
 */

import { useState, useEffect, useCallback } from 'react';
import { MessageControllerApi } from '@/api/apis/MessageControllerApi';
import { Message } from '@/api/models/Message';
import { useApiClient } from './useApiClient';
import { handleApiError } from '@/lib/api-config';
import { toast } from '@/hooks/use-toast';

export const useMessages = (authToken?: string) => {
  const messageApi = useApiClient(MessageControllerApi, authToken);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca todas as mensagens
   */
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await messageApi.getAllMessages();
      setMessages(response);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: 'Erro ao buscar mensagens',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [messageApi]);

  /**
   * Cria uma nova mensagem
   */
  const createMessage = useCallback(async (messageData: Partial<Message>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await messageApi.createMessage({ message: messageData as Message });
      toast({
        title: 'Sucesso',
        description: 'Mensagem criada com sucesso',
      });
      await fetchMessages(); // Recarrega a lista
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: 'Erro ao criar mensagem',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [messageApi, fetchMessages]);

  /**
   * Deleta uma mensagem por ID
   */
  const deleteMessage = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await messageApi.deleteMessage({ id });
      toast({
        title: 'Sucesso',
        description: 'Mensagem deletada com sucesso',
      });
      await fetchMessages(); // Recarrega a lista
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: 'Erro ao deletar mensagem',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [messageApi, fetchMessages]);

  // Carrega mensagens ao montar o componente
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    loading,
    error,
    fetchMessages,
    createMessage,
    deleteMessage,
  };
};
