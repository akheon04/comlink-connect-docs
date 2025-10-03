# Integração com OpenAPI Generator

Este projeto usa o **OpenAPI Generator** para gerar automaticamente clients TypeScript a partir do Swagger/OpenAPI do backend.

## 📋 Pré-requisitos

```bash
# Instalar o OpenAPI Generator CLI globalmente
npm install -g @openapitools/openapi-generator-cli
```

## 🚀 Como usar

### 1. Gerar os clients da API

Sempre que o backend mudar, execute:

```bash
openapi-generator-cli generate -i http://localhost:8080/v3/api-docs -g typescript-fetch -o src/api
```

**Importante:** Certifique-se de que seu backend está rodando em `http://localhost:8080` antes de executar o comando.

### 2. Estrutura gerada

O comando acima gera a seguinte estrutura:

```
src/api/
├── apis/              # Controllers da API (ex: MessageControllerApi.ts)
├── models/            # DTOs e modelos de dados
├── runtime.ts         # Configuração base do fetch
└── index.ts          # Arquivo de entrada que exporta tudo
```

### 3. Como usar no código

#### Opção A: Usando hooks customizados (Recomendado)

```tsx
import { useMessages } from '@/hooks/useMessages';

function MyComponent() {
  const { messages, loading, createMessage, deleteMessage } = useMessages();
  
  // A lógica de API já está encapsulada no hook!
  return (
    <div>
      {messages.map(msg => <div key={msg.id}>{msg.title}</div>)}
    </div>
  );
}
```

#### Opção B: Usando clients diretamente

```tsx
import { useApiClient } from '@/hooks/useApiClient';
import { MessageControllerApi } from '@/api/apis/MessageControllerApi';

function MyComponent() {
  const messageApi = useApiClient(MessageControllerApi);
  
  const handleFetch = async () => {
    const messages = await messageApi.getAllMessages();
    console.log(messages);
  };
  
  return <button onClick={handleFetch}>Buscar</button>;
}
```

## 🔧 Configuração

### Base URL

A base URL da API é configurada em `src/lib/api-config.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

Você pode sobrescrever criando um arquivo `.env`:

```env
VITE_API_BASE_URL=https://api.production.com
```

### Autenticação

Para adicionar autenticação:

```tsx
const messageApi = useApiClient(MessageControllerApi, 'seu-token-aqui');
```

Ou configure globalmente em `src/lib/api-config.ts`.

## 📁 Arquivos importantes

| Arquivo | Descrição | Regenerado? |
|---------|-----------|-------------|
| `src/api/**/*` | Clients gerados pelo OpenAPI | ✅ Sim |
| `src/lib/api-config.ts` | Configuração centralizada | ❌ Não |
| `src/hooks/useApiClient.ts` | Hook genérico para clients | ❌ Não |
| `src/hooks/useMessages.ts` | Hook específico para Messages | ⚠️ Parcial* |

\* Quando você regenerar, apenas atualize os imports se mudarem.

## 🔄 Workflow recomendado

1. Altere seu backend (adicione/modifique endpoints)
2. Reinicie o backend para atualizar o Swagger
3. Execute: `openapi-generator-cli generate -i http://localhost:8080/v3/api-docs -g typescript-fetch -o src/api`
4. Os clients serão atualizados automaticamente
5. Se necessário, atualize apenas os imports nos hooks customizados

## 🎯 Exemplo completo

Veja a página de exemplo em `src/pages/Messages.tsx` que demonstra:

- ✅ Listagem de dados
- ✅ Criação de novos registros
- ✅ Deleção de registros
- ✅ Tratamento de erros
- ✅ Loading states
- ✅ Toast notifications

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/api'"

Execute o comando de geração dos clients primeiro.

### Erro: "Network error" ou CORS

Certifique-se de que:
1. O backend está rodando
2. O CORS está configurado corretamente no backend
3. A URL base está correta em `api-config.ts`

### Tipos TypeScript não batem

Execute o comando de geração novamente para sincronizar os tipos com o backend.

## 📚 Recursos

- [OpenAPI Generator Docs](https://openapi-generator.tech/)
- [TypeScript Fetch Client](https://openapi-generator.tech/docs/generators/typescript-fetch/)
- [OpenAPI Specification](https://swagger.io/specification/)
