import { ApiDocumentation } from "@/components/ApiDocumentation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">API Comlink - Documentação</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Escolha o tipo de documentação que deseja explorar
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Card className="relative overflow-hidden border-2">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
                NOVO
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <CardTitle>Explorador Dinâmico</CardTitle>
                </div>
                <CardDescription>
                  Interface que se adapta automaticamente à sua API. 
                  Conecta-se ao OpenAPI/Swagger e gera formulários em tempo real.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/dynamic">
                  <Button className="w-full" size="lg">
                    Abrir Explorador Dinâmico
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Carrega endpoints automaticamente
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Gera formulários dinâmicos
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Testa requisições em tempo real
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentação Estática</CardTitle>
                <CardDescription>
                  Visualização tradicional dos endpoints configurados manualmente.
                  Útil para referência rápida.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById('static-docs');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Ver Documentação Estática
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="static-docs">
          <ApiDocumentation />
        </div>
      </div>
    </div>
  );
};

export default Index;
