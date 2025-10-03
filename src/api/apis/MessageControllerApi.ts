/**
 * ESTE ARQUIVO É GERADO AUTOMATICAMENTE PELO OPENAPI GENERATOR
 * 
 * Este é um exemplo de API controller. Quando você rodar o generator,
 * este arquivo será substituído pela versão real do seu backend.
 */

import { BaseAPI, Configuration } from '../runtime';
import { Message } from '../models';

export interface GetAllMessagesRequest {}

export interface GetMessageByIdRequest {
  id: number;
}

export interface CreateMessageRequest {
  message: Message;
}

export interface UpdateMessageRequest {
  id: number;
  message: Message;
}

export interface DeleteMessageRequest {
  id: number;
}

export class MessageControllerApi extends BaseAPI {
  constructor(configuration?: Configuration) {
    super(configuration);
  }

  /**
   * Busca todas as mensagens
   */
  async getAllMessages(requestParameters: GetAllMessagesRequest = {}): Promise<Message[]> {
    const response = await this.request('/api/messages', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Busca uma mensagem por ID
   */
  async getMessageById(requestParameters: GetMessageByIdRequest): Promise<Message> {
    const { id } = requestParameters;
    
    const response = await this.request(`/api/messages/${id}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Cria uma nova mensagem
   */
  async createMessage(requestParameters: CreateMessageRequest): Promise<Message> {
    const { message } = requestParameters;
    
    const response = await this.request('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Atualiza uma mensagem existente
   */
  async updateMessage(requestParameters: UpdateMessageRequest): Promise<Message> {
    const { id, message } = requestParameters;
    
    const response = await this.request(`/api/messages/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Deleta uma mensagem
   */
  async deleteMessage(requestParameters: DeleteMessageRequest): Promise<void> {
    const { id } = requestParameters;
    
    const response = await this.request(`/api/messages/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}
