import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle2, XCircle } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface DynamicFormGeneratorProps {
  endpoint: any;
  baseUrl: string;
  resolveSchema: (schema: any) => any;
}

export const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({
  endpoint,
  baseUrl,
  resolveSchema
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [pathParams, setPathParams] = useState<any>({});
  const [queryParams, setQueryParams] = useState<any>({});
  const [response, setResponse] = useState<any>(null);

  const generateFieldsFromSchema = (schema: any): any[] => {
    const resolved = resolveSchema(schema);
    if (!resolved?.properties) return [];

    return Object.entries(resolved.properties).map(([key, value]: [string, any]) => ({
      name: key,
      type: value.type || 'string',
      format: value.format,
      description: value.description,
      required: resolved.required?.includes(key) || false,
      example: value.example,
      enum: value.enum
    }));
  };

  const renderField = (field: any, value: any, onChange: (val: any) => void) => {
    const inputId = `field-${field.name}`;

    switch (field.type) {
      case 'integer':
      case 'number':
        return (
          <Input
            id={inputId}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={field.example?.toString() || '0'}
          />
        );

      case 'boolean':
        return (
          <select
            id={inputId}
            value={value?.toString() || 'false'}
            onChange={(e) => onChange(e.target.value === 'true')}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );

      case 'array':
        return (
          <Textarea
            id={inputId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="[]"
            rows={3}
          />
        );

      default:
        if (field.enum) {
          return (
            <select
              id={inputId}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {field.enum.map((opt: string) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          );
        }

        if (field.format === 'date-time') {
          return (
            <Input
              id={inputId}
              type="datetime-local"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
          );
        }

        return field.description?.length > 50 ? (
          <Textarea
            id={inputId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.example || ''}
            rows={3}
          />
        ) : (
          <Input
            id={inputId}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.example || ''}
          />
        );
    }
  };

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);

    try {
      // Build URL with path parameters
      let url = `${baseUrl}${endpoint.path}`;
      
      // Replace path parameters
      Object.entries(pathParams).forEach(([key, value]) => {
        url = url.replace(`{${key}}`, encodeURIComponent(value as string));
      });

      // Add query parameters
      const queryString = new URLSearchParams(
        Object.entries(queryParams)
          .filter(([_, value]) => value !== '' && value !== null && value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ).toString();

      if (queryString) {
        url += `?${queryString}`;
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
        options.body = JSON.stringify(formData);
      }

      const startTime = Date.now();
      const res = await fetch(url, options);
      const responseTime = Date.now() - startTime;

      let responseData;
      const contentType = res.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        responseData = await res.json();
      } else {
        responseData = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: responseData,
        time: responseTime,
        headers: Object.fromEntries(res.headers.entries())
      });

      if (res.ok) {
        toast({
          title: 'Requisição bem-sucedida',
          description: `Status: ${res.status} - ${responseTime}ms`
        });
      } else {
        toast({
          title: 'Erro na requisição',
          description: `Status: ${res.status} - ${res.statusText}`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro de conexão',
        description: error instanceof Error ? error.message : 'Falha ao executar requisição',
        variant: 'destructive'
      });
      
      setResponse({
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Get path parameters
  const pathParameters = endpoint.operation.parameters?.filter((p: any) => p.in === 'path') || [];
  const queryParameters = endpoint.operation.parameters?.filter((p: any) => p.in === 'query') || [];

  // Get request body schema
  const requestBodySchema = endpoint.operation.requestBody?.content?.['application/json']?.schema;
  const requestFields = requestBodySchema ? generateFieldsFromSchema(requestBodySchema) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Testar Endpoint
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Path Parameters */}
        {pathParameters.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Parâmetros de Caminho</h4>
            <div className="space-y-3">
              {pathParameters.map((param: any) => (
                <div key={param.name}>
                  <Label htmlFor={`path-${param.name}`} className="flex items-center gap-2">
                    {param.name}
                    {param.required && <Badge variant="destructive" className="text-xs">obrigatório</Badge>}
                  </Label>
                  <Input
                    id={`path-${param.name}`}
                    value={pathParams[param.name] || ''}
                    onChange={(e) => setPathParams({ ...pathParams, [param.name]: e.target.value })}
                    placeholder={param.example || param.schema?.example}
                  />
                  {param.description && (
                    <p className="text-xs text-muted-foreground mt-1">{param.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Query Parameters */}
        {queryParameters.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Parâmetros de Query</h4>
            <div className="space-y-3">
              {queryParameters.map((param: any) => (
                <div key={param.name}>
                  <Label htmlFor={`query-${param.name}`} className="flex items-center gap-2">
                    {param.name}
                    {param.required && <Badge variant="destructive" className="text-xs">obrigatório</Badge>}
                  </Label>
                  <Input
                    id={`query-${param.name}`}
                    value={queryParams[param.name] || ''}
                    onChange={(e) => setQueryParams({ ...queryParams, [param.name]: e.target.value })}
                    placeholder={param.example || param.schema?.example}
                  />
                  {param.description && (
                    <p className="text-xs text-muted-foreground mt-1">{param.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Body Fields */}
        {requestFields.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Corpo da Requisição</h4>
            <div className="space-y-4">
              {requestFields.map((field) => (
                <div key={field.name}>
                  <Label htmlFor={`field-${field.name}`} className="flex items-center gap-2">
                    {field.name}
                    {field.required && <Badge variant="destructive" className="text-xs">obrigatório</Badge>}
                    <span className="text-xs text-muted-foreground">({field.type})</span>
                  </Label>
                  {renderField(field, formData[field.name], (value) => {
                    setFormData({ ...formData, [field.name]: value });
                  })}
                  {field.description && (
                    <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={executeRequest} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar Requisição
            </>
          )}
        </Button>

        {/* Response */}
        {response && (
          <>
            <Separator />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium flex items-center gap-2">
                  Resposta
                  {response.error ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </h4>
                {response.status && (
                  <div className="flex items-center gap-3">
                    <Badge variant={response.status < 400 ? 'default' : 'destructive'}>
                      {response.status} {response.statusText}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{response.time}ms</span>
                  </div>
                )}
              </div>

              {response.data && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Body:</p>
                  <CodeBlock
                    code={typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}
                    language="json"
                  />
                </div>
              )}

              {response.error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-destructive">{response.error}</p>
                </div>
              )}

              {response.headers && (
                <div>
                  <p className="text-sm font-medium mb-2">Headers:</p>
                  <CodeBlock
                    code={JSON.stringify(response.headers, null, 2)}
                    language="json"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
