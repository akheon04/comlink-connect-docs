# Hooks Customizados para API

Esta pasta contém hooks React customizados que encapsulam a lógica de chamadas à API gerada pelo OpenAPI Generator.

## 📋 Estrutura

- `useApiClient.ts` - Hook genérico para criar clients da API
- `useMessages.ts` - Exemplo de hook específico para MessageController

## 🎯 Como criar um novo hook para outro controller

Quando você adicionar um novo controller no backend e regenerar os clients, siga este template:

### Template de Hook

```typescript
// src/hooks/useYourController.ts

import { useState, useEffect, useCallback } from 'react';
import { YourControllerApi } from '@/api/apis/YourControllerApi';
import { YourModel } from '@/api/models/YourModel';
import { useApiClient } from './useApiClient';
import { handleApiError } from '@/lib/api-config';
import { toast } from '@/hooks/use-toast';

export const useYourController = (authToken?: string) => {
  const api = useApiClient(YourControllerApi, authToken);
  
  const [items, setItems] = useState<YourModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca todos os items
   */
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getAllItems();
      setItems(response);
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: 'Erro ao buscar items',
        description: errorMessage,
        variant: 'destructive',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  /**
   * Cria um novo item
   */
  const createItem = useCallback(async (data: Partial<YourModel>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.createItem({ item: data as YourModel });
      toast({
        title: 'Sucesso',
        description: 'Item criado com sucesso',
      });
      await fetchItems();
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: 'Erro ao criar item',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, fetchItems]);

  /**
   * Atualiza um item existente
   */
  const updateItem = useCallback(async (id: number, data: Partial<YourModel>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.updateItem({ id, item: data as YourModel });
      toast({
        title: 'Sucesso',
        description: 'Item atualizado com sucesso',
      });
      await fetchItems();
      return response;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: 'Erro ao atualizar item',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, fetchItems]);

  /**
   * Deleta um item
   */
  const deleteItem = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.deleteItem({ id });
      toast({
        title: 'Sucesso',
        description: 'Item deletado com sucesso',
      });
      await fetchItems();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: 'Erro ao deletar item',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, fetchItems]);

  // Carrega items ao montar
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
};
```

## 💡 Uso no componente

```tsx
import { useYourController } from '@/hooks/useYourController';

function MyComponent() {
  const { items, loading, createItem, updateItem, deleteItem } = useYourController();
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <button onClick={() => updateItem(item.id, { ...item, name: 'Novo nome' })}>
            Editar
          </button>
          <button onClick={() => deleteItem(item.id)}>
            Deletar
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🔄 Quando regenerar os clients

1. Execute: `openapi-generator-cli generate -i http://localhost:8080/v3/api-docs -g typescript-fetch -o src/api`
2. Verifique os imports no seu hook
3. Atualize os nomes de classes/métodos se mudaram
4. Pronto! O restante do código continua funcionando

## ✅ Boas práticas

- ✅ Sempre use `useCallback` para as funções
- ✅ Sempre trate erros com `handleApiError`
- ✅ Sempre mostre feedback com `toast`
- ✅ Sempre recarregue os dados após create/update/delete
- ✅ Use TypeScript para tipagem forte
- ✅ Documente suas funções com JSDoc

## 🚫 Evite

- ❌ Fazer chamadas diretas com `fetch` em componentes
- ❌ Duplicar lógica de tratamento de erros
- ❌ Esquecer de mostrar feedback ao usuário
- ❌ Criar hooks com muita responsabilidade (mantenha focado)
