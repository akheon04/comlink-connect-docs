/**
 * ESTE ARQUIVO É GERADO AUTOMATICAMENTE PELO OPENAPI GENERATOR
 * 
 * Este é um arquivo de exemplo que simula a estrutura gerada.
 */

export interface ConfigurationParameters {
  basePath?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export class Configuration {
  basePath: string;
  headers: Record<string, string>;
  credentials?: RequestCredentials;

  constructor(params: ConfigurationParameters = {}) {
    this.basePath = params.basePath || 'http://localhost:8080';
    this.headers = params.headers || {};
    this.credentials = params.credentials;
  }
}

export const BASE_PATH = 'http://localhost:8080'.replace(/\/+$/, '');

export interface FetchAPI {
  (url: string, init?: any): Promise<Response>;
}

export interface FetchArgs {
  url: string;
  options: any;
}

export class BaseAPI {
  protected configuration: Configuration;

  constructor(configuration: Configuration = new Configuration()) {
    this.configuration = configuration;
  }

  protected async request(url: string, init?: RequestInit): Promise<Response> {
    const headers = {
      ...this.configuration.headers,
      ...init?.headers,
    };

    const fullUrl = `${this.configuration.basePath}${url}`;

    return fetch(fullUrl, {
      ...init,
      headers,
      credentials: this.configuration.credentials,
    });
  }
}
