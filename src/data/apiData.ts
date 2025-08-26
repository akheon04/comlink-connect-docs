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
                "CadastroFornecedores": [
                  {
                    "NumeroComlink": 0,
                    "CodigoFornecedor": 0,
                    "DocumentoFornecedor": "string",
                    "NomeRazaoSocial": "string",
                    "NomeFantasia": "string",
                    "InscricaoEstadual": "string",
                    "InscricaoMunicipal": "string",
                    "TipoPessoa": "s",
                    "Endereco": "string",
                    "NumeroEndereco": "string",
                    "TipoLogradouro": "string",
                    "Complemento": "string",
                    "Bairro": "string",
                    "Cidade": "string",
                    "Cep": "string",
                    "Telefone1": "string",
                    "Telefone2": "string",
                    "Telefone3": "string",
                    "Fax": "string",
                    "CaixaPostal": "string",
                    "Email": "string",
                    "Contato": "string",
                    "Estado": "st",
                    "DDDTelefone": "st",
                    "DDDFax": "st",
                    "CodigoIBGE": 0
                  }
                ],
                "CotacaoCabecalho": {
                  "NumeroComlink": 0,
                  "NumeroCotacao": "string",
                  "Sequencia": 0,
                  "CodigoEmpresa": "string",
                  "CodigoFilial": "string",
                  "CNPJ": "string",
                  "Empresa": "string",
                  "DataCotacao": "2025-08-25T13:55:54.523Z",
                  "PrazoNecessidade": 0,
                  "DataEntrada": "2025-08-25T13:55:54.523Z",
                  "DataEncerramento": "2025-08-25T13:55:54.523Z",
                  "Validade": 0,
                  "MaximoFornecedores": 25,
                  "NomeComprador": "string",
                  "Urgencia": "string",
                  "DataRetornoWeb": "2025-08-25T13:55:54.523Z",
                  "DataLiberacao": "2025-08-25T13:55:54.523Z",
                  "Status": "string",
                  "NomeSolicitante": "string",
                  "StatusNegociacao": "string",
                  "DataRetornoCorporativo": "2025-08-25T13:55:54.523Z",
                  "UsuarioNegociacao": "string",
                  "EmailComprador": "string",
                  "Observacoes": "string",
                  "PublicaWeb": "string",
                  "TipoCotacao": 0,
                  "DataCancelamento": "2025-08-25T13:55:54.523Z",
                  "TipoCancelamento": 0
                },
                "CotacaoFornecedores": [
                  {
                    "NumeroComlink": 0,
                    "CodigoFornecedor": 0,
                    "Observacao": "string",
                    "NumeroControle": "string",
                    "PublicaCotacao": "string",
                    "DocumentoFornecedor": "string"
                  }
                ],
                "CotacaoItensNegadosFornecedores": [
                  {
                    "NumeroComlink": 0,
                    "NumeroItem": 0,
                    "CodigoFornecedor": 0,
                    "DocumentoFornecedor": "string"
                  }
                ],
                "CotacaoItens": [
                  {
                    "NumeroComlink": 0,
                    "NumeroItem": 0,
                    "CodigoItem": "string",
                    "DescricaoResumida": "string",
                    "DescricaoCompleta": "string",
                    "Aplicacao": "string",
                    "Embalagem": "string",
                    "Genuino": "string",
                    "Observacao": "string",
                    "Unidade": "str",
                    "Quantidade": 0,
                    "DataUltimaCompra": "2025-08-25T13:55:54.523Z",
                    "NotaFiscalUltimaCompra": "string",
                    "QuantidadeUltimaCompra": 0,
                    "UnidadeUltimaCompra": "str",
                    "PrecoUltimaCompra": 0,
                    "IpiUltimaCompra": 0,
                    "CompradorUltimaCompra": "string",
                    "FornecedorUltimaCompra": "string",
                    "FormaPagamentoUltimaCompra": "string",
                    "CodigoEmpresaUltimaCompra": "string",
                    "EmpresaUltimaCompra": "string",
                    "CodigoFilialUltimaCompra": "string",
                    "ObservacaoUltimaCompra": "string",
                    "Chave": "string",
                    "NumeroOrdem": "string",
                    "NomeSolicitante": "string",
                    "CodigoImposto": "string",
                    "IcmsValorPresente": 0,
                    "IpiValorPresente": 0,
                    "NumeroItemCliente": 0,
                    "NCM": "string"
                  }
                ],
                "CotacaoItensMarcasReferencias": [
                  {
                    "NumeroComlink": 0,
                    "NumeroItem": 0,
                    "Sequencia": 0,
                    "Marca": "string",
                    "Referencia": "string",
                    "Observacao": "string"
                  }
                ],
                "CotacaoItensEmpresaFilial": [
                  {
                    "NumeroComlink": 0,
                    "NumeroItem": 0,
                    "CodigoEmpresa": "string",
                    "CodigoFilial": "string",
                    "NumeroOrdem": "string",
                    "Observacao": "string",
                    "Quantidade": 0,
                    "NomeSolicitante": "string",
                    "PrazoNecessidade": 0,
                    "Centro": "string",
                    "NumeroItemCliente": "string",
                    "DataRemessa": "2025-08-25T13:55:54.523Z"
                  }
                ],
                "CotacaoAnexos": [
                  {
                    "NumeroComlink": 0,
                    "Nome": "string",
                    "Arquivo": "string",
                    "Extensao": "string"
                  }
                ]
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
      },
      {
        id: 'obter-cotacao-web',
        method: 'GET',
        path: '/cotacao/cotacaoweb/{cotacao}',
        summary: 'Obtém dados das cotações publicadas na web',
        tags: ['Cotacao'],
        parameters: [
          {
            name: 'cotacao',
            in: 'path',
            description: 'Número da cotação do cliente',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
                example: [
                  {
                    "NumeroWeb": 0,
                    "NumeroComlink": 0,
                    "Sequencia": 0,
                    "Empresa": "string",
                    "NomeComprador": "string"
                  }
                ]
              }
            }
          },
          '204': { description: 'No Content' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-cotacoes-finalizadas',
        method: 'GET',
        path: '/cotacao/retorno/cotacoes/{tipoCotacao}',
        summary: 'Retorna lista de cotações com negociação finalizada para criação de pedidos de compra',
        description: 'Tipos de cotação: 0 - material, 1 - ordem de serviço, 2 - contrato. Por padrão, se não informado o tipo de cotação, serão retornadas cotações de material e contrato.',
        tags: ['Cotacao'],
        parameters: [
          {
            name: 'tipoCotacao',
            in: 'path',
            description: 'Filtra por tipo de cotação (não obrigatório)',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
                example: [
                  {
                    "NumeroComlink": 0,
                    "NumeroCotacao": "string",
                    "CodigoCliente": 0,
                    "DataResposta": "2025-08-25T13:55:54.545Z",
                    "CNPJ": "string",
                    "Empresa": "string",
                    "UsuarioNegociacao": {
                      "CodigoCliente": 0,
                      "Usuario": "string",
                      "CodigoUsuario": "string",
                      "NomeUsuario": "string",
                      "EmailUsuario": "string"
                    },
                    "MapaNegociacao": "string"
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
        id: 'obter-dados-negociacao',
        method: 'GET',
        path: '/cotacao/retorno/{cotacao}',
        summary: 'Retorna dados sobre a negociação (respostas) da cotação',
        tags: ['Cotacao'],
        parameters: [
          {
            name: 'cotacao',
            in: 'path',
            description: 'Número da cotação Comlink',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          },
          {
            name: 'usuario',
            in: 'header',
            description: 'Usuário da negociação',
            required: false,
            schema: { type: 'string' }
          },
          {
            name: 'codigoCliente',
            in: 'header',
            description: 'Código do cliente do usuário',
            required: false,
            schema: { type: 'string' }
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
        id: 'confirma-processamento-cotacao',
        method: 'PUT',
        path: '/cotacao/retorno/confirmaprocessamento/{cotacao}',
        summary: 'Confirma o processamento sobre os dados de retorno da cotação',
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
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not Found' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'encerrar-cotacao',
        method: 'POST',
        path: '/cotacao/retorno/encerra/{cotacao}',
        summary: 'Encerra o processo de retorno da cotação',
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
        requestBody: {
          description: 'Usuário da negociação',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                "CodigoCliente": 0,
                "Usuario": "string",
                "CodigoUsuario": "string",
                "NomeUsuario": "string",
                "EmailUsuario": "string"
              }
            }
          }
        },
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'sinalizar-erro-cotacao',
        method: 'POST',
        path: '/cotacao/retorno/erro/{cotacao}/{pedido}',
        summary: 'Sinaliza erro nos dados retornados ou na geração do pedido no ERP',
        tags: ['Cotacao'],
        parameters: [
          {
            name: 'cotacao',
            in: 'path',
            description: 'Número da cotação Comlink',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          },
          {
            name: 'pedido',
            in: 'path',
            description: 'Número do pedido Comlink (CotacaoCabecalhoPedido.NumeroPedido)',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        requestBody: {
          description: 'Objeto relacionado ao erro',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                "UsuarioNegociacao": {
                  "CodigoCliente": 0,
                  "Usuario": "string",
                  "CodigoUsuario": "string",
                  "NomeUsuario": "string",
                  "EmailUsuario": "string"
                },
                "Mensagem": "string"
              }
            }
          }
        },
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'enviar-dados-pedidos',
        method: 'POST',
        path: '/cotacao/retorno/dadospedidos/{cotacao}',
        summary: 'Envia dados informativos sobre os pedidos gerados no ERP',
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
        requestBody: {
          description: 'Dados sobre os pedidos gerados no ERP',
          content: {
            'application/json': {
              schema: { type: 'array', items: { type: 'object' } },
              example: [
                {
                  "Cabecalho": {
                    "NumeroComlink": 0,
                    "NumeroPedido": "string",
                    "CodigoCentro": "string",
                    "DocumentoCentro": "string",
                    "NomeCentro": "string",
                    "NumeroPedidoComlink": 0
                  },
                  "Fornecedor": {
                    "NumeroComlink": 0,
                    "NumeroPedido": "string",
                    "CodigoFornecedor": "string",
                    "DocumentoFornecedor": "string",
                    "NomeFornecedor": "string"
                  }
                }
              ]
            }
          }
        },
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '422': { description: 'Unprocessable Content' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-cotacoes-canceladas',
        method: 'GET',
        path: '/cotacao/retorno/canceladas/{cotacao}',
        summary: 'Retorna lista de cotações canceladas',
        tags: ['Cotacao'],
        parameters: [
          {
            name: 'cotacao',
            in: 'path',
            description: 'Número da cotação do cliente (não obrigatório)',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'object' } },
                example: [
                  {
                    "NumeroComlink": 0,
                    "NumeroCotacao": "string",
                    "Sequencia": 0,
                    "CodigoEmpresa": "string",
                    "CodigoFilial": "string",
                    "DataCotacao": "2025-08-25T13:55:54.571Z",
                    "NomeComprador": "string",
                    "NomeSolicitante": "string",
                    "UsuarioNegociacao": "string",
                    "EmailUsuario": "string",
                    "DataCancelamento": "2025-08-25T13:55:54.571Z",
                    "TipoCancelamento": 0
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
        id: 'confirmar-cancelamento-cotacao',
        method: 'PUT',
        path: '/cotacao/retorno/confirmacancelamento/{cotacao}',
        summary: 'Confirma o cancelamento da cotação',
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
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not Found' },
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