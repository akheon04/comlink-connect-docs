// Tipos para a API Comlink
export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  summary: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: { [statusCode: string]: Response };
  tags: string[];
}

export interface Parameter {
  name: string;
  in: 'query' | 'path' | 'header';
  description?: string;
  required: boolean;
  schema: Schema;
}

export interface RequestBody {
  description?: string;
  content: {
    'application/json': {
      schema: Schema;
      example?: any;
    };
  };
}

export interface Response {
  description: string;
  content?: {
    'application/json': {
      schema: Schema;
      example?: any;
    };
  };
}

export interface Schema {
  type: string;
  properties?: { [key: string]: Schema };
  items?: Schema;
  example?: any;
  format?: string;
}

export interface ApiGroup {
  name: string;
  endpoints: ApiEndpoint[];
}

export interface RequestHistory {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  status?: number;
  responseTime?: number;
}