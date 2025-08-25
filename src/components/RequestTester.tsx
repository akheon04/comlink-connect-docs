import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApiEndpoint } from '@/types/api';
import { CodeBlock } from './CodeBlock';
import { Play, Settings, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RequestTesterProps {
  endpoint: ApiEndpoint;
  baseUrl: string;
  onRequest: (endpoint: ApiEndpoint, url: string, method: string) => void;
}

export const RequestTester: React.FC<RequestTesterProps> = ({ endpoint, baseUrl, onRequest }) => {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json',
    'Authorization': ''
  });
  const [requestBody, setRequestBody] = useState<string>(
    endpoint.requestBody?.content?.['application/json']?.example 
      ? JSON.stringify(endpoint.requestBody.content['application/json'].example, null, 2)
      : ''
  );
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const { toast } = useToast();

  const buildUrl = () => {
    let url = baseUrl + endpoint.path;
    
    // Substituir parâmetros de path
    if (endpoint.parameters) {
      endpoint.parameters.forEach(param => {
        if (param.in === 'path') {
          const value = parameters[param.name] || `{${param.name}}`;
          url = url.replace(`{${param.name}}`, value);
        }
      });
    }

    // Adicionar query parameters
    const queryParams = endpoint.parameters
      ?.filter(param => param.in === 'query' && parameters[param.name])
      .map(param => `${param.name}=${encodeURIComponent(parameters[param.name])}`)
      .join('&');

    if (queryParams) {
      url += `?${queryParams}`;
    }

    return url;
  };

  const executeRequest = async () => {
    setLoading(true);
    const startTime = performance.now();
    
    try {
      const url = buildUrl();
      const requestOptions: RequestInit = {
        method: endpoint.method,
        headers: Object.fromEntries(
          Object.entries(headers).filter(([_, value]) => value.trim() !== '')
        )
      };

      if (endpoint.method !== 'GET' && requestBody.trim()) {
        requestOptions.body = requestBody;
      }

      const response = await fetch(url, requestOptions);
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData
      });

      onRequest(endpoint, url, endpoint.method);

      toast({
        title: "Request enviado",
        description: `Status: ${response.status} ${response.statusText}`,
        variant: response.ok ? "default" : "destructive"
      });

    } catch (error) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      
      setResponse({
        status: 0,
        statusText: 'Network Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Erro desconhecido' }
      });

      toast({
        title: "Erro no request",
        description: error instanceof Error ? error.message : 'Erro desconhecido',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-method-get text-white',
      POST: 'bg-method-post text-white',
      PUT: 'bg-method-put text-white', 
      DELETE: 'bg-method-delete text-white',
      PATCH: 'bg-method-patch text-white'
    };
    return colors[method as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-status-success';
    if (status >= 300 && status < 400) return 'text-status-info';
    if (status >= 400 && status < 500) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Testar Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* URL Preview */}
          <div>
            <Label className="text-sm font-medium">URL do Request</Label>
            <div className="mt-2 flex items-center gap-2">
              <Badge className={`${getMethodColor(endpoint.method)} font-mono`}>
                {endpoint.method}
              </Badge>
              <code className="flex-1 bg-muted px-3 py-2 rounded font-mono text-sm">
                {buildUrl()}
              </code>
            </div>
          </div>

          {/* Parâmetros */}
          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Parâmetros</Label>
              <div className="mt-2 space-y-3">
                {endpoint.parameters.map((param, index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <Label className="text-xs text-muted-foreground">Nome</Label>
                      <div className="flex items-center gap-2">
                        <code className="text-sm">{param.name}</code>
                        {param.required && (
                          <Badge variant="destructive" className="text-xs px-1">
                            obrigatório
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Local</Label>
                      <Badge variant="outline" className="text-xs">
                        {param.in}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Tipo</Label>
                      <code className="text-xs text-muted-foreground">
                        {param.schema.type}
                      </code>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Valor</Label>
                      <Input
                        placeholder={param.description}
                        value={parameters[param.name] || ''}
                        onChange={(e) => setParameters(prev => ({
                          ...prev,
                          [param.name]: e.target.value
                        }))}
                        className="h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Headers */}
          <div>
            <Label className="text-sm font-medium">Headers</Label>
            <div className="mt-2 space-y-2">
              {Object.entries(headers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Header name"
                    value={key}
                    onChange={(e) => {
                      const newHeaders = { ...headers };
                      delete newHeaders[key];
                      newHeaders[e.target.value] = value;
                      setHeaders(newHeaders);
                    }}
                    className="h-8"
                  />
                  <Input
                    placeholder="Header value"
                    value={value}
                    onChange={(e) => setHeaders(prev => ({
                      ...prev,
                      [key]: e.target.value
                    }))}
                    className="h-8"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHeaders(prev => ({ ...prev, ['New-Header']: '' }))}
                className="h-8"
              >
                Adicionar Header
              </Button>
            </div>
          </div>

          {/* Request Body */}
          {endpoint.method !== 'GET' && (
            <div>
              <Label className="text-sm font-medium">Request Body (JSON)</Label>
              <Textarea
                placeholder="Request body em formato JSON"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="mt-2 font-mono text-sm"
                rows={10}
              />
            </div>
          )}

          {/* Send Button */}
          <Button
            onClick={executeRequest}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Enviando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Enviar Request
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Response */}
      {response && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Resposta
                <Badge className={`${getStatusColor(response.status)} border`} variant="outline">
                  {response.status} {response.statusText}
                </Badge>
              </CardTitle>
              {responseTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {responseTime}ms
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {response.status === 0 && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">
                  Erro de rede - verifique CORS, URL ou conectividade
                </span>
              </div>
            )}
            
            <div>
              <Label className="text-sm font-medium">Response Body</Label>
              <div className="mt-2">
                <CodeBlock
                  code={typeof response.data === 'string' 
                    ? response.data 
                    : JSON.stringify(response.data, null, 2)
                  }
                  language="json"
                />
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium">Response Headers</Label>
              <div className="mt-2">
                <CodeBlock
                  code={JSON.stringify(response.headers, null, 2)}
                  language="json"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};