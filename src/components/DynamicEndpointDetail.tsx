import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DynamicFormGenerator } from './DynamicFormGenerator';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface DynamicEndpointDetailProps {
  endpoint: any;
  baseUrl: string;
  resolveSchema: (schema: any) => any;
}

export const DynamicEndpointDetail: React.FC<DynamicEndpointDetailProps> = ({
  endpoint,
  baseUrl,
  resolveSchema
}) => {
  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-method-get text-white',
      POST: 'bg-method-post text-white',
      PUT: 'bg-method-put text-white',
      DELETE: 'bg-method-delete text-white',
      PATCH: 'bg-method-patch text-white'
    };
    return colors[method as keyof typeof colors] || 'bg-muted';
  };

  const getStatusIcon = (status: string) => {
    if (status.startsWith('2')) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status.startsWith('4') || status.startsWith('5')) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Info className="h-4 w-4 text-blue-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status.startsWith('2')) return 'text-green-600';
    if (status.startsWith('4') || status.startsWith('5')) return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <Badge className={`text-sm px-3 py-1 ${getMethodColor(endpoint.method)}`}>
                  {endpoint.method}
                </Badge>
                <code className="text-lg font-mono">{endpoint.path}</code>
              </div>
              <CardTitle className="text-xl">{endpoint.operation.summary || 'Endpoint'}</CardTitle>
              {endpoint.operation.description && (
                <CardDescription>{endpoint.operation.description}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Parameters */}
          {endpoint.operation.parameters && endpoint.operation.parameters.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Parâmetros</h3>
                <div className="space-y-3">
                  {endpoint.operation.parameters.map((param: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
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
                        <span className="text-xs text-muted-foreground">
                          {param.schema?.type || 'string'}
                        </span>
                      </div>
                      {param.description && (
                        <p className="text-sm text-muted-foreground">{param.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Responses */}
          {endpoint.operation.responses && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Respostas</h3>
                <div className="space-y-3">
                  {Object.entries(endpoint.operation.responses).map(([status, response]: [string, any]) => (
                    <div key={status} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(status)}
                        <code className={`text-sm font-mono font-semibold ${getStatusColor(status)}`}>
                          {status}
                        </code>
                        <span className="text-sm text-muted-foreground">{response.description}</span>
                      </div>
                      {response.content?.['application/json']?.example && (
                        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto mt-2">
                          {JSON.stringify(response.content['application/json'].example, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dynamic Form for POST/PUT/PATCH */}
      {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.operation.requestBody && (
        <DynamicFormGenerator
          endpoint={endpoint}
          baseUrl={baseUrl}
          resolveSchema={resolveSchema}
        />
      )}

      {/* Simple tester for GET/DELETE */}
      {['GET', 'DELETE'].includes(endpoint.method) && (
        <DynamicFormGenerator
          endpoint={endpoint}
          baseUrl={baseUrl}
          resolveSchema={resolveSchema}
        />
      )}
    </div>
  );
};
