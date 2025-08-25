import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApiEndpoint } from '@/types/api';
import { CodeBlock } from './CodeBlock';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface EndpointDetailProps {
  endpoint: ApiEndpoint;
}

export const EndpointDetail: React.FC<EndpointDetailProps> = ({ endpoint }) => {
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

  const getStatusIcon = (status: string) => {
    const code = parseInt(status);
    if (code >= 200 && code < 300) return <CheckCircle className="h-4 w-4 text-status-success" />;
    if (code >= 300 && code < 400) return <Info className="h-4 w-4 text-status-info" />;
    if (code >= 400 && code < 500) return <AlertCircle className="h-4 w-4 text-status-warning" />;
    return <XCircle className="h-4 w-4 text-status-error" />;
  };

  const getStatusColor = (status: string) => {
    const code = parseInt(status);
    if (code >= 200 && code < 300) return 'text-status-success';
    if (code >= 300 && code < 400) return 'text-status-info';
    if (code >= 400 && code < 500) return 'text-status-warning';
    return 'text-status-error';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Badge className={`${getMethodColor(endpoint.method)} font-mono font-bold`}>
            {endpoint.method}
          </Badge>
          <code className="text-lg font-mono bg-muted px-3 py-1 rounded">
            {endpoint.path}
          </code>
        </div>
        <CardTitle className="text-xl">{endpoint.summary}</CardTitle>
        {endpoint.description && (
          <CardDescription className="text-base">
            {endpoint.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Parâmetros */}
        {endpoint.parameters && endpoint.parameters.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Parâmetros</h3>
            <div className="space-y-3">
              {endpoint.parameters.map((param, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                        {param.name}
                      </code>
                      <Badge variant="outline" className="text-xs">
                        {param.in}
                      </Badge>
                      {param.required && (
                        <Badge variant="destructive" className="text-xs">
                          obrigatório
                        </Badge>
                      )}
                    </div>
                    <code className="text-xs text-muted-foreground">
                      {param.schema.type}
                      {param.schema.format && ` (${param.schema.format})`}
                    </code>
                  </div>
                  {param.description && (
                    <p className="text-sm text-muted-foreground">
                      {param.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Body */}
        {endpoint.requestBody && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Request Body</h3>
            <div className="space-y-3">
              {endpoint.requestBody.description && (
                <p className="text-sm text-muted-foreground">
                  {endpoint.requestBody.description}
                </p>
              )}
              <div className="border rounded-lg">
                <div className="bg-muted px-4 py-2 rounded-t-lg">
                  <span className="text-sm font-mono">application/json</span>
                </div>
                <div className="p-4">
                  <CodeBlock
                    code={JSON.stringify(endpoint.requestBody.content['application/json'].example, null, 2)}
                    language="json"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Respostas */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Respostas</h3>
          <div className="space-y-3">
            {Object.entries(endpoint.responses).map(([statusCode, response]) => (
              <div key={statusCode} className="border rounded-lg">
                <div className="bg-muted px-4 py-3 rounded-t-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(statusCode)}
                    <span className={`font-mono font-bold ${getStatusColor(statusCode)}`}>
                      {statusCode}
                    </span>
                    <span className="text-sm">{response.description}</span>
                  </div>
                  {response.content && (
                    <span className="text-xs font-mono text-muted-foreground">
                      application/json
                    </span>
                  )}
                </div>
                {response.content?.['application/json']?.example && (
                  <div className="p-4">
                    <CodeBlock
                      code={JSON.stringify(response.content['application/json'].example, null, 2)}
                      language="json"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};