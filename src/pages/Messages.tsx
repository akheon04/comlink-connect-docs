/**
 * Página de exemplo usando o MessageController gerado pelo OpenAPI
 * 
 * Esta página demonstra como consumir os clients gerados de forma limpa e eficiente.
 */

import { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Messages = () => {
  const { messages, loading, error, fetchMessages, createMessage, deleteMessage } = useMessages();
  
  const [showForm, setShowForm] = useState(false);
  const [newMessage, setNewMessage] = useState({
    title: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.title || !newMessage.content) {
      return;
    }

    try {
      await createMessage(newMessage);
      setNewMessage({ title: '', content: '' });
      setShowForm(false);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta mensagem?')) {
      try {
        await deleteMessage(id);
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para documentação
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Mensagens</h1>
            <p className="text-muted-foreground mt-2">
              Exemplo de integração com MessageController usando OpenAPI Generator
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => fetchMessages()}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              onClick={() => setShowForm(!showForm)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Mensagem
            </Button>
          </div>
        </div>

        {/* Formulário de nova mensagem */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Nova Mensagem</CardTitle>
              <CardDescription>Crie uma nova mensagem no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Título</label>
                  <Input
                    value={newMessage.title}
                    onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                    placeholder="Digite o título da mensagem"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Conteúdo</label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    placeholder="Digite o conteúdo da mensagem"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Mensagem'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Estado de erro */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Lista de mensagens */}
        <div className="grid gap-4">
          {loading && messages.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : messages.length === 0 ? (
            // Estado vazio
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhuma mensagem encontrada</p>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira mensagem
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Lista de mensagens
            messages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{message.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {message.createdAt && new Date(message.createdAt).toLocaleString('pt-BR')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.status && (
                        <Badge variant={message.status === 'active' ? 'default' : 'secondary'}>
                          {message.status}
                        </Badge>
                      )}
                      <Button
                        onClick={() => handleDelete(message.id!)}
                        variant="ghost"
                        size="sm"
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{message.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info box */}
        <Card className="mt-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">💡 Sobre esta integração</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Esta página usa clients gerados automaticamente pelo OpenAPI Generator</li>
              <li>Hooks customizados encapsulam a lógica de chamadas da API</li>
              <li>Quando você regenerar os clients, apenas atualize os imports nos hooks</li>
              <li>A configuração da API está centralizada em <code className="bg-muted px-1 py-0.5 rounded">src/lib/api-config.ts</code></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Messages;
