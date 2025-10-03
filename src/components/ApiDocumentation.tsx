import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ApiEndpoint, ApiGroup, RequestHistory } from '@/types/api';
import { apiGroups, API_BASE_URL } from '@/data/apiData';
import { EndpointDetail } from './EndpointDetail';
import { RequestTester } from './RequestTester';
import { Clock, Code, Globe } from 'lucide-react';

interface ApiDocumentationProps {}

export const ApiDocumentation: React.FC<ApiDocumentationProps> = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [activeSection, setActiveSection] = useState<string>('overview');

  const handleRequest = (endpoint: ApiEndpoint, url: string, method: string) => {
    const newRequest: RequestHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      method,
      url,
      status: undefined,
      responseTime: undefined
    };
    
    setRequestHistory(prev => [newRequest, ...prev.slice(0, 9)]);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">API Comlink</h1>
                <p className="text-sm text-muted-foreground">Integração - v1.0</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <code className="bg-muted px-2 py-1 rounded text-xs">{API_BASE_URL}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-4 sticky top-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Navegação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={activeSection === 'overview' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setActiveSection('overview');
                    setSelectedEndpoint(null);
                  }}
                >
                  Visão Geral
                </Button>
                
                {apiGroups.map((group) => (
                  <div key={group.name}>
                    <div className="font-medium text-sm text-muted-foreground mb-2 mt-4">
                      {group.name}
                    </div>
                    {group.endpoints.map((endpoint) => (
                      <Button
                        key={endpoint.id}
                        variant={selectedEndpoint?.id === endpoint.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-xs h-8 mb-1"
                        onClick={() => {
                          setSelectedEndpoint(endpoint);
                          setActiveSection('endpoint');
                        }}
                      >
                        <Badge className={`mr-2 text-xs px-1.5 py-0.5 ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </Badge>
                        <span className="truncate">{endpoint.path}</span>
                      </Button>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Request History */}
            {requestHistory.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Histórico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {requestHistory.map((request) => (
                        <div key={request.id} className="text-xs">
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs px-1 py-0 ${getMethodColor(request.method)}`}>
                              {request.method}
                            </Badge>
                            <span className="text-muted-foreground">
                              {request.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === 'overview' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">API Integração Comlink</CardTitle>
                <CardDescription>
                  Documentação completa da API de integração do sistema Comlink para gestão de cotações, pedidos e fornecedores.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Funcionalidades Principais</h3>
                  <div className="grid gap-3">
                    {apiGroups.map((group) => (
                      <div key={group.name} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{group.name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {group.endpoints.length} endpoint{group.endpoints.length !== 1 ? 's' : ''} disponível{group.endpoints.length !== 1 ? 'eis' : ''}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {group.endpoints.map((endpoint) => (
                            <Badge
                              key={endpoint.id}
                              className={`text-xs ${getMethodColor(endpoint.method)}`}
                            >
                              {endpoint.method} {endpoint.path}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Informações da API</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">URL Base:</span>
                      <code className="bg-muted px-2 py-1 rounded">{API_BASE_URL}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Versão:</span>
                      <span>v1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Formato:</span>
                      <span>JSON</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Autenticação:</span>
                      <span>Bearer Token</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'endpoint' && selectedEndpoint && (
            <div className="space-y-6">
              <EndpointDetail endpoint={selectedEndpoint} />
              <RequestTester
                endpoint={selectedEndpoint}
                baseUrl={API_BASE_URL}
                onRequest={handleRequest}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};