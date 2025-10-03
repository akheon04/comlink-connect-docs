import { useState, useEffect, useCallback } from 'react';

interface OpenApiParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  schema: any;
}

interface OpenApiRequestBody {
  content?: {
    [mediaType: string]: {
      schema: any;
      example?: any;
    };
  };
  required?: boolean;
}

interface OpenApiResponse {
  description: string;
  content?: {
    [mediaType: string]: {
      schema: any;
      example?: any;
    };
  };
}

interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: OpenApiParameter[];
  requestBody?: OpenApiRequestBody;
  responses: {
    [statusCode: string]: OpenApiResponse;
  };
}

interface OpenApiPath {
  [method: string]: OpenApiOperation;
}

interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: {
    [path: string]: OpenApiPath;
  };
  components?: {
    schemas?: {
      [name: string]: any;
    };
  };
}

interface ParsedEndpoint {
  path: string;
  method: string;
  operation: OpenApiOperation;
  tag: string;
}

export const useOpenApiSpec = (apiDocsUrl: string) => {
  const [spec, setSpec] = useState<OpenApiSpec | null>(null);
  const [endpoints, setEndpoints] = useState<ParsedEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSpec = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(apiDocsUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch API docs: ${response.statusText}`);
      }
      
      const data: OpenApiSpec = await response.json();
      setSpec(data);
      
      // Parse endpoints
      const parsed: ParsedEndpoint[] = [];
      Object.entries(data.paths).forEach(([path, pathItem]) => {
        Object.entries(pathItem).forEach(([method, operation]) => {
          if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
            const op = operation as OpenApiOperation;
            parsed.push({
              path,
              method: method.toUpperCase(),
              operation: op,
              tag: op.tags?.[0] || 'Other'
            });
          }
        });
      });
      
      setEndpoints(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API documentation');
      console.error('Error fetching OpenAPI spec:', err);
    } finally {
      setLoading(false);
    }
  }, [apiDocsUrl]);

  useEffect(() => {
    fetchSpec();
  }, [fetchSpec]);

  const refresh = useCallback(() => {
    fetchSpec();
  }, [fetchSpec]);

  const resolveSchema = useCallback((schemaRef: any): any => {
    if (!spec) return null;
    
    if (schemaRef.$ref) {
      const refPath = schemaRef.$ref.replace('#/components/schemas/', '');
      return spec.components?.schemas?.[refPath];
    }
    
    return schemaRef;
  }, [spec]);

  const getGroupedEndpoints = useCallback(() => {
    const grouped: { [tag: string]: ParsedEndpoint[] } = {};
    
    endpoints.forEach(endpoint => {
      if (!grouped[endpoint.tag]) {
        grouped[endpoint.tag] = [];
      }
      grouped[endpoint.tag].push(endpoint);
    });
    
    return grouped;
  }, [endpoints]);

  return {
    spec,
    endpoints,
    loading,
    error,
    refresh,
    resolveSchema,
    getGroupedEndpoints,
    baseUrl: spec?.servers?.[0]?.url || ''
  };
};
