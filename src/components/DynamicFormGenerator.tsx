import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, CheckCircle2, XCircle, Key, Copy, FileJson } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  const [bearerToken, setBearerToken] = useState('');
  const [jsonBody, setJsonBody] = useState('');
  const [pathParams, setPathParams] = useState<any>({});
  const [queryParams, setQueryParams] = useState<any>({});
  const [response, setResponse] = useState<any>(null);

  const generateExampleFromSchema = (schema: any, depth: number = 0): any => {
    if (depth > 10) return null;
    
    const resolved = resolveSchema(schema);
    if (!resolved) return null;
    
    if (resolved.example !== undefined) {
      return resolved.example;
    }
    
    if (resolved.type === 'object' && resolved.properties) {
      const obj: any = {};
      Object.entries(resolved.properties).forEach(([key, propSchema]: [string, any]) => {
        obj[key] = generateExampleFromSchema(propSchema, depth + 1);
      });
      return obj;
    }
    
    if (resolved.type === 'array') {
      if (resolved.items) {
        return [generateExampleFromSchema(resolved.items, depth + 1)];
      }
      return [];
    }
    
    if (resolved.type === 'string') {
      // Check for enum first
      if (resolved.enum && resolved.enum.length > 0) {
        return resolved.enum[0];
      }
      // Check format
      if (resolved.format === 'date-time') {
        return new Date().toISOString();
      }
      if (resolved.format === 'email') {
        return 'exemplo@email.com';
      }
      if (resolved.format === 'uuid') {
        return '00000000-0000-0000-0000-000000000000';
      }
      // Generate string with maxLength consideration
      if (resolved.maxLength) {
        return 'string'.substring(0, Math.min(resolved.maxLength, 6));
      }
      return 'string';
    }
    
    if (resolved.type === 'number' || resolved.type === 'integer') {
      if (resolved.minimum !== undefined) return resolved.minimum;
      if (resolved.maximum !== undefined) return Math.min(0, resolved.maximum);
      return 0;
    }
    
    if (resolved.type === 'boolean') {
      return false;
    }
    
    if (resolved.allOf && resolved.allOf.length > 0) {
      let merged: any = {};
      resolved.allOf.forEach((subSchema: any) => {
        const subExample = generateExampleFromSchema(subSchema, depth + 1);
        if (typeof subExample === 'object' && subExample !== null) {
          merged = { ...merged, ...subExample };
        }
      });
      return merged;
    }
    
    if (resolved.oneOf && resolved.oneOf.length > 0) {
      return generateExampleFromSchema(resolved.oneOf[0], depth + 1);
    }
    
    if (resolved.anyOf && resolved.anyOf.length > 0) {
      return generateExampleFromSchema(resolved.anyOf[0], depth + 1);
    }
    
    return null;
  };

  const getFieldsInfo = (schema: any, prefix: string = ''): any[] => {
    const resolved = resolveSchema(schema);
    if (!resolved) return [];

    const fields: any[] = [];

    if (resolved.type === 'object' && resolved.properties) {
      Object.entries(resolved.properties).forEach(([key, value]: [string, any]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const propResolved = resolveSchema(value);
        
        fields.push({
          name: fullKey,
          type: propResolved.type || 'string',
          description: propResolved.description || '',
          required: resolved.required?.includes(key) || false,
          example: propResolved.example,
          isNested: !!prefix,
          maxLength: propResolved.maxLength,
          minLength: propResolved.minLength,
          maximum: propResolved.maximum,
          minimum: propResolved.minimum,
          pattern: propResolved.pattern,
          enum: propResolved.enum,
          format: propResolved.format
        });

        if (propResolved.type === 'object' && propResolved.properties) {
          fields.push(...getFieldsInfo(propResolved, fullKey));
        } else if (propResolved.type === 'array' && propResolved.items) {
          const itemsResolved = resolveSchema(propResolved.items);
          if (itemsResolved.type === 'object') {
            fields.push(...getFieldsInfo(itemsResolved, `${fullKey}[0]`));
          }
        }
      });
    }

    return fields;
  };

  // Initialize JSON body with example
  useEffect(() => {
    const requestBodySchema = endpoint.operation.requestBody?.content?.['application/json']?.schema;
    if (requestBodySchema && !jsonBody) {
      const exampleData = generateExampleFromSchema(requestBodySchema);
      setJsonBody(JSON.stringify(exampleData, null, 2));
    }
  }, [endpoint]);

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

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
      }

      const options: RequestInit = {
        method: endpoint.method,
        headers
      };

      if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && jsonBody.trim()) {
        try {
          const parsedBody = JSON.parse(jsonBody);
          options.body = JSON.stringify(parsedBody);
        } catch (error) {
          toast({
            title: 'Erro no JSON',
            description: 'O JSON do corpo da requisição está inválido',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }
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
  const hasRequestBody = !!requestBodySchema;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Testar Endpoint
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bearer Token */}
        <div>
          <Label htmlFor="bearer-token" className="flex items-center gap-2 mb-2">
            <Key className="h-4 w-4" />
            Bearer Token (Authorization)
          </Label>
          <Input
            id="bearer-token"
            type="password"
            value={bearerToken}
            onChange={(e) => setBearerToken(e.target.value)}
            placeholder="Cole seu token de autorização aqui"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Será enviado como: Authorization: Bearer &lt;token&gt;
          </p>
        </div>

        <Separator />
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

        {/* Request Body JSON Editor */}
        {hasRequestBody && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Corpo da Requisição (JSON)</h4>
              <Badge variant="secondary">application/json</Badge>
            </div>
            
            <Accordion type="multiple" defaultValue={["json-example", "field-details"]} className="mb-4">
              {/* Complete JSON Example */}
              <AccordionItem value="json-example">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    📋 JSON Completo de Exemplo
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(jsonBody);
                          toast({
                            title: 'JSON Copiado!',
                            description: 'O JSON foi copiado para a área de transferência'
                          });
                        }}
                      >
                        <Copy className="h-3 w-3 mr-2" />
                        Copiar JSON
                      </Button>
                    </div>
                    <CodeBlock
                      code={jsonBody}
                      language="json"
                    />
                    <p className="text-xs text-muted-foreground">
                      Este é o JSON completo com TODOS os campos necessários preenchidos com valores de exemplo.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Field Details */}
              <AccordionItem value="field-details">
                <AccordionTrigger className="text-sm font-medium">
                  📖 Descrição Detalhada dos Campos ({getFieldsInfo(requestBodySchema).length} campos)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {getFieldsInfo(requestBodySchema).map((field, idx) => (
                      <div 
                        key={`${field.name}-${idx}`} 
                        className="p-3 bg-muted/30 rounded-lg border border-border/50"
                        style={{ marginLeft: field.isNested ? '1rem' : '0' }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono font-semibold text-sm break-all">{field.name}</span>
                          <div className="flex gap-1 flex-shrink-0">
                            <Badge variant="outline" className="text-xs">{field.type}</Badge>
                            {field.required && (
                              <Badge variant="destructive" className="text-xs">obrigatório</Badge>
                            )}
                          </div>
                        </div>
                        
                        {field.description && (
                          <p className="text-muted-foreground text-xs mb-2">
                            {field.description}
                          </p>
                        )}
                        
                        <div className="space-y-1 text-xs">
                          {field.format && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Formato:</span>
                              <code className="bg-muted px-1 rounded">{field.format}</code>
                            </div>
                          )}
                          {field.maxLength && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Tamanho máximo:</span>
                              <code className="bg-muted px-1 rounded">{field.maxLength} caracteres</code>
                            </div>
                          )}
                          {field.minLength && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Tamanho mínimo:</span>
                              <code className="bg-muted px-1 rounded">{field.minLength} caracteres</code>
                            </div>
                          )}
                          {field.maximum !== undefined && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Valor máximo:</span>
                              <code className="bg-muted px-1 rounded">{field.maximum}</code>
                            </div>
                          )}
                          {field.minimum !== undefined && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Valor mínimo:</span>
                              <code className="bg-muted px-1 rounded">{field.minimum}</code>
                            </div>
                          )}
                          {field.pattern && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Padrão (regex):</span>
                              <code className="bg-muted px-1 rounded text-xs break-all">{field.pattern}</code>
                            </div>
                          )}
                          {field.enum && field.enum.length > 0 && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Valores permitidos:</span>
                              <code className="bg-muted px-1 rounded">{field.enum.join(', ')}</code>
                            </div>
                          )}
                          {field.example !== undefined && field.example !== null && (
                            <div className="flex gap-2">
                              <span className="text-muted-foreground">Exemplo:</span>
                              <code className="bg-muted px-1 rounded">
                                {typeof field.example === 'string' ? `"${field.example}"` : JSON.stringify(field.example)}
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div>
              <Label htmlFor="json-editor" className="mb-2 block">
                ✏️ Editor JSON (Edite conforme necessário)
              </Label>
              <Textarea
                id="json-editor"
                value={jsonBody}
                onChange={(e) => setJsonBody(e.target.value)}
                placeholder='{\n  "campo": "valor"\n}'
                className="font-mono text-sm min-h-[300px]"
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 O JSON acima já está preenchido com todos os campos. Edite os valores conforme necessário.
              </p>
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
