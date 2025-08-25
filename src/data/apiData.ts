import { ApiGroup } from '../types/api';

export const API_BASE_URL = 'https://sonora-dev.comlink.com.br/integracao';

export const apiGroups: ApiGroup[] = [
  {
    name: 'CartaConvite',
    endpoints: [
      {
        id: 'get-cartas-convite',
        method: 'GET',
        path: '/cartaconvite/retorno/cartasconvite',
        summary: 'Retorna lista de cartas convite finalizadas',
        tags: ['CartaConvite'],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
                example: [
                  {
                    "Identificador": 0,
                    "Numero": "string",
                    "NumeroCotacao": 0,
                    "DataInicio": "2025-08-25T13:09:01.448Z",
                    "DataTermino": "2025-08-25T13:09:01.448Z",
                    "ValorOrcamento": 0,
                    "NomeSolicitante": "string",
                    "ValorNegociado": 0,
                    "DocumentoFornecedor": "string",
                    "RazaoSocialFornecedor": "string",
                    "CentroCusto": "string"
                  }
                ]
              }
            }
          },
          '204': { description: 'No Content' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'get-carta-convite',
        method: 'GET',
        path: '/cartaconvite/retorno/{cartaConvite}',
        summary: 'Retorna dados sobre a carta convite',
        tags: ['CartaConvite'],
        parameters: [
          {
            name: 'cartaConvite',
            in: 'path',
            description: 'Identificador da carta convite',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': { description: 'OK' },
          '204': { description: 'No Content' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'confirma-carta-convite',
        method: 'PUT',
        path: '/cartaconvite/retorno/confirma/{cartaConvite}',
        summary: 'Confirma o retorno da carta convite',
        tags: ['CartaConvite'],
        parameters: [
          {
            name: 'cartaConvite',
            in: 'path',
            description: 'Identificador da carta convite',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not Found' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'CondicaoPagamento',
    endpoints: [
      {
        id: 'carga-condicao-pagamento',
        method: 'POST',
        path: '/condicaopagamento/carga',
        summary: 'Realiza o cadastro das condições de pagamento',
        tags: ['CondicaoPagamento'],
        requestBody: {
          description: 'Dados cadastrais das condições de pagamento',
          content: {
            'application/json': {
              schema: { type: 'array', items: { type: 'object' } },
              example: [
                {
                  "CodigoCliente": 0,
                  "CodigoCondicao": 0,
                  "Descricao": "string",
                  "DescricaoResumida": "string",
                  "CodigoCondicaoErp": "string",
                  "Ativo": 0,
                  "CodigoEmpresa": 0,
                  "Parcelas": [
                    {
                      "CodigoParcela": 0,
                      "DiaParcela": 0,
                      "PercentualParcela": 100
                    }
                  ]
                }
              ]
            }
          }
        },
        responses: {
          '200': { description: 'OK' },
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '422': { description: 'Unprocessable Content' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-condicao-pagamento',
        method: 'GET',
        path: '/condicaopagamento/obter/{codigo}',
        summary: 'Retorna as condições de pagamento cadastradas',
        description: 'Se o código da condição de pagamento não for informado, serão retornadas todas as condições de pagamento cadastradas.',
        tags: ['CondicaoPagamento'],
        parameters: [
          {
            name: 'codigo',
            in: 'path',
            description: 'Código da condição de pagamento no cliente (não obrigatório)',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'OK' },
          '204': { description: 'No Content' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'Cotacao',
    endpoints: [
      {
        id: 'enviar-cotacao',
        method: 'POST',
        path: '/cotacao/enviar',
        summary: 'Publica cotação',
        tags: ['Cotacao'],
        requestBody: {
          description: 'Cotação a ser publicada',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                "CadastroFornecedores": [],
                "CotacaoCabecalho": {
                  "NumeroComlink": 0,
                  "NumeroCotacao": "string",
                  "DataCotacao": "2025-08-25T13:09:01.474Z",
                  "NomeComprador": "string"
                },
                "CotacaoItens": []
              }
            }
          }
        },
        responses: {
          '200': { description: 'OK' },
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '422': { description: 'Unprocessable Content' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-cotacao',
        method: 'GET',
        path: '/cotacao/obter/{cotacao}',
        summary: 'Obtém detalhes da cotação publicada',
        tags: ['Cotacao'],
        parameters: [
          {
            name: 'cotacao',
            in: 'path',
            description: 'Número da cotação Comlink',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': { description: 'OK' },
          '204': { description: 'No Content' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'Pedido',
    endpoints: [
      {
        id: 'enviar-pedido',
        method: 'POST',
        path: '/pedido/enviar',
        summary: 'Publica o pedido',
        tags: ['Pedido'],
        responses: {
          '200': { description: 'OK' },
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-pedido-web',
        method: 'GET',
        path: '/pedido/pedidoweb/{numeroPedido}',
        summary: 'Obtém dados do(s) pedido(s) publicado(s) na web',
        tags: ['Pedido'],
        parameters: [
          {
            name: 'numeroPedido',
            in: 'path',
            description: 'Número do pedido',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'OK' },
          '204': { description: 'No Content' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'Secure',
    endpoints: [
      {
        id: 'obter-token',
        method: 'POST',
        path: '/secure/token',
        summary: 'Obtém token de autenticação',
        tags: ['Secure'],
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'autorizar-login',
        method: 'POST',
        path: '/secure/login/autorizar',
        summary: 'Autoriza o login',
        tags: ['Secure'],
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'Versao',
    endpoints: [
      {
        id: 'obter-versao',
        method: 'GET',
        path: '/versao',
        summary: 'Retorna informação sobre a versão da API',
        tags: ['Versao'],
        responses: {
          '200': { description: 'OK' }
        }
      }
    ]
  }
];