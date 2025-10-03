# Explorador Dinâmico de API

## 🎯 Visão Geral

O **Explorador Dinâmico** é um sistema que se conecta automaticamente à documentação OpenAPI/Swagger do seu backend e gera uma interface interativa completa, incluindo formulários, validações e testes de endpoints - tudo sem precisar reescrever código!

## ✨ Características

- **100% Dinâmico**: Busca a documentação da API automaticamente
- **Formulários Automáticos**: Gera inputs baseados nos schemas OpenAPI
- **Validação Inteligente**: Campos obrigatórios, tipos de dados, enums
- **Teste em Tempo Real**: Execute requisições diretamente pela interface
- **Auto-Atualização**: Basta recarregar para ver novas mudanças na API
- **Zero Configuração**: Funciona imediatamente com qualquer API OpenAPI 3.0+

## 🚀 Como Usar

### 1. Certifique-se que seu backend está rodando

```bash
# Seu backend deve estar disponível em:
http://localhost:8080

# E a documentação OpenAPI em:
http://localhost:8080/v3/api-docs
```

### 2. Acesse o Explorador Dinâmico

Abra o frontend e clique em **"Abrir Explorador Dinâmico"** ou vá para:
```
http://localhost:3000/dynamic
```

### 3. A interface irá:

1. ✅ Buscar automaticamente todos os endpoints
2. ✅ Agrupar por tags/categorias
3. ✅ Gerar formulários para POST/PUT/PATCH
4. ✅ Permitir testar GET/DELETE com parâmetros
5. ✅ Mostrar respostas em tempo real

## 📋 Exemplos de Uso

### Endpoint GET com Query Parameters
```
GET /usuarios?nome=João&ativo=true
```
O sistema gera automaticamente inputs para cada query parameter.

### Endpoint POST com Body Complexo
```
POST /pedidos
{
  "clienteId": 123,
  "produtos": [...],
  "dataEntrega": "2025-09-01"
}
```
O sistema analisa o schema e gera:
- Input numérico para `clienteId`
- Textarea para `produtos` (array)
- Date picker para `dataEntrega`

### Path Parameters
```
PUT /pedidos/{id}/status
```
O sistema identifica `{id}` e cria um input específico antes do formulário.

## 🔄 Atualizando a API

Quando você adicionar novos endpoints ou modificar existentes:

1. **Faça as mudanças no backend**
2. **No frontend, clique em "Recarregar API"**
3. **Pronto!** A interface se adapta automaticamente

Não é necessário:
- ❌ Reescrever componentes
- ❌ Adicionar rotas manualmente
- ❌ Configurar formulários
- ❌ Reiniciar o servidor frontend

## 🏗️ Arquitetura

```
src/
├── hooks/
│   └── useOpenApiSpec.ts          # Hook que busca e parseia OpenAPI
├── components/
│   ├── DynamicApiExplorer.tsx     # Componente principal
│   ├── DynamicEndpointDetail.tsx  # Detalhes de cada endpoint
│   └── DynamicFormGenerator.tsx   # Gerador de formulários dinâmicos
```

### Como Funciona

1. **useOpenApiSpec** busca `/v3/api-docs`
2. Parseia o JSON do OpenAPI 3.0
3. Extrai `paths`, `methods`, `parameters`, `schemas`
4. **DynamicFormGenerator** usa os schemas para criar inputs apropriados
5. Requisições são executadas com `fetch` para o `baseUrl` definido no OpenAPI

## 🎨 Tipos de Campos Suportados

| Tipo OpenAPI | Campo Gerado |
|-------------|--------------|
| `string` | Input text |
| `string` (format: date-time) | DateTime picker |
| `integer` / `number` | Input number |
| `boolean` | Select (true/false) |
| `enum` | Select com opções |
| `array` | Textarea (JSON) |
| Objetos complexos | Campos individuais por propriedade |

## 🔒 CORS e Configuração

Se você encontrar erros de CORS, configure seu backend:

### Spring Boot
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("*");
            }
        };
    }
}
```

## 🐛 Troubleshooting

### "Erro ao carregar API"
- ✅ Verifique se o backend está rodando
- ✅ Confirme que `/v3/api-docs` retorna JSON válido
- ✅ Verifique configuração de CORS

### "Campos não aparecem no formulário"
- ✅ Verifique se o `requestBody` tem `content: application/json`
- ✅ Confirme que o schema tem `properties` definidas
- ✅ Use `$ref` para referenciar schemas complexos

### "Requisição falha"
- ✅ Verifique o console do navegador
- ✅ Confirme que `servers[0].url` no OpenAPI está correto
- ✅ Teste o endpoint diretamente (Postman/cURL)

## 📚 Documentação OpenAPI

Este sistema é compatível com **OpenAPI 3.0+**. Certifique-se que seu backend retorna um JSON no formato:

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Minha API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:8080"
    }
  ],
  "paths": {
    "/endpoint": {
      "post": {
        "tags": ["Tag"],
        "summary": "Descrição",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/MeuDto"
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "MeuDto": {
        "type": "object",
        "properties": {
          "campo": {
            "type": "string"
          }
        }
      }
    }
  }
}
```

## 🎯 Próximos Passos

- [ ] Adicionar suporte para autenticação (Bearer Token)
- [ ] Salvar configurações de teste no localStorage
- [ ] Exportar requisições como cURL/Postman
- [ ] Modo dark/light
- [ ] Histórico de requisições persistente
- [ ] Validação client-side baseada no schema

## 💡 Dicas

1. **Use tags no OpenAPI** para organizar endpoints melhor
2. **Defina exemplos** nos schemas para facilitar testes
3. **Documente bem** summaries e descriptions
4. **Use $ref** para evitar repetição de schemas
5. **Configure CORS** corretamente no backend

---

**Desenvolvido com React + TypeScript + Tailwind CSS**
