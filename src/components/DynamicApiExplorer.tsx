import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useOpenApiSpec } from '@/hooks/useOpenApiSpec';
import { DynamicEndpointDetail } from './DynamicEndpointDetail';
import { RefreshCw, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

//const API_DOCS_URL = 'http://localhost:8080/v3/api-docs';
const API_DOCS_URL = 'https://localhost:5001/swagger/v1/swagger.json';
const BASE_URL = 'https://sonora-dev.comlink.com.br/integracao';

export const DynamicApiExplorer: React.FC = () => {
  const { spec, endpoints, loading, error, refresh, getGroupedEndpoints, resolveSchema } = useOpenApiSpec(API_DOCS_URL);
  const [selectedEndpoint, setSelectedEndpoint] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Carregando documentação da API...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao carregar API</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-4">{error}</p>
                <p className="text-xs mb-4">
                  Verifique se o backend está rodando em: <code className="bg-muted px-2 py-1 rounded">{API_DOCS_URL}</code>
                </p>
                <Button onClick={refresh} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedEndpoints = getGroupedEndpoints();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{spec?.info.title || 'API Explorer'}</h1>
                <p className="text-sm text-muted-foreground">
                  {spec?.info.description || 'Explorador Dinâmico de API'} - v{spec?.info.version}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <code className="bg-muted px-2 py-1 rounded text-xs">{BASE_URL}</code>
              </div>
              <Button onClick={refresh} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar API
              </Button>
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
                <CardDescription>{endpoints.length} endpoints disponíveis</CardDescription>
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

                <ScrollArea className="h-[calc(100vh-300px)]">
                  {Object.entries(groupedEndpoints).map(([tag, tagEndpoints]) => (
                    <div key={tag}>
                      <div className="font-medium text-sm text-muted-foreground mb-2 mt-4">
                        {tag}
                      </div>
                      {tagEndpoints.map((endpoint, idx) => (
                        <Button
                          key={`${endpoint.path}-${endpoint.method}-${idx}`}
                          variant={selectedEndpoint === endpoint ? 'secondary' : 'ghost'}
                          className="w-full justify-start text-xs h-auto py-2 mb-1"
                          onClick={() => {
                            setSelectedEndpoint(endpoint);
                            setActiveSection('endpoint');
                          }}
                        >
                          <Badge className={`mr-2 text-xs px-1.5 py-0.5 ${getMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </Badge>
                          <span className="truncate text-left">{endpoint.path}</span>
                        </Button>
                      ))}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === 'overview' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Explorador Dinâmico de API</CardTitle>
                <CardDescription>
                  Esta interface é gerada automaticamente a partir da documentação OpenAPI do backend.
                  Qualquer mudança na API será refletida aqui.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recursos Disponíveis</h3>
                  <div className="grid gap-3">
                    {Object.entries(groupedEndpoints).map(([tag, tagEndpoints]) => (
                      <div key={tag} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{tag}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {tagEndpoints.length} endpoint{tagEndpoints.length !== 1 ? 's' : ''} disponível{tagEndpoints.length !== 1 ? 'eis' : ''}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {tagEndpoints.map((endpoint, idx) => (
                            <Badge
                              key={`${endpoint.path}-${endpoint.method}-${idx}`}
                              className={`text-xs ${getMethodColor(endpoint.method)} cursor-pointer`}
                              onClick={() => {
                                setSelectedEndpoint(endpoint);
                                setActiveSection('endpoint');
                              }}
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
                      <code className="bg-muted px-2 py-1 rounded">{BASE_URL}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Versão:</span>
                      <span>{spec?.info.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Formato:</span>
                      <span>OpenAPI {spec?.openapi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de Endpoints:</span>
                      <span>{endpoints.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'endpoint' && selectedEndpoint && (
            <DynamicEndpointDetail
              endpoint={selectedEndpoint}
              baseUrl={BASE_URL}
              resolveSchema={resolveSchema}
            />
          )}
        </div>
      </div>
    </div>
  );
};
