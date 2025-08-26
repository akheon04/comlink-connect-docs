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
        description: 'Publica um novo pedido no sistema.',
        tags: ['Pedido'],
        requestBody: {
          description: 'pedido a ser publicado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  Cabecalho: {
                    type: 'object',
                    properties: {
                      ID: { type: 'number' },
                      NumeroCliente: { type: 'string' },
                      CodigoEmpresa: { type: 'number' },
                      CodigoCliente: { type: 'number' },
                      Sequencia: { type: 'number' },
                      NomeEmpresa: { type: 'string' },
                      CNPJ: { type: 'string' },
                      InscricaoEstadual: { type: 'string' },
                      TelefoneEmpresa: { type: 'string' },
                      EnderecoEmpresa: { type: 'string' },
                      CepEmpresa: { type: 'string' },
                      CidadeEmpresa: { type: 'string' },
                      EstadoEmpresa: { type: 'string' },
                      BairroEmpresa: { type: 'string' },
                      FaxEmpresa: { type: 'string' },
                      EmailEmpresa: { type: 'string' },
                      AlmoxarifaEmpresa: { type: 'string' },
                      TipoPessoa: { type: 'string' },
                      NomeComprador: { type: 'string' },
                      EmailComprador: { type: 'string' },
                      DataLiberacao: { type: 'string', format: 'date-time' },
                      DataEmissao: { type: 'string', format: 'date-time' },
                      DataEnvioWeb: { type: 'string', format: 'date-time' },
                      DataEntrega: { type: 'string', format: 'date-time' },
                      FormaRemessa: { type: 'string' },
                      HorarioEntrega: { type: 'string' },
                      Informativo: { type: 'string' },
                      Aplicacao: { type: 'string' },
                      Observacao: { type: 'string' },
                      ObservacaoCobranca: { type: 'string' },
                      Aprovador: { type: 'string' },
                      CondicaoPagamento: { type: 'string' },
                      LocalEntrega: { type: 'string' },
                      Adiantamento: { type: 'string' },
                      Status: { type: 'number' },
                      DataAprovacao: { type: 'string', format: 'date-time' },
                      ValorTotal: { type: 'number' },
                      NomeVendedor: { type: 'string' },
                      StatusWeb: { type: 'string' },
                      Transportadora: { type: 'string' },
                      CNPJTransportadora: { type: 'string' },
                      NumeroCotacao: { type: 'string' },
                      NumeroOrdem: { type: 'string' },
                      NomeSolicitante: { type: 'string' },
                      EmailSolicitante: { type: 'string' },
                      ValorAcrescimo: { type: 'number' },
                      ValorDesconto: { type: 'number' },
                      ValorDespesa: { type: 'number' },
                      ValorFrete: { type: 'number' },
                      ValorIcms: { type: 'number' },
                      ValorIpi: { type: 'number' },
                      NumeroCotacaoComlink: { type: 'number' },
                      NumeroPedidoComlink: { type: 'number' },
                      TelefoneComprador: { type: 'string' },
                      CodigoLoja: { type: 'string' },
                      SimboloMoeda: { type: 'string' },
                      ValorSaving: { type: 'number' },
                      PercentualSaving: { type: 'number' }
                    }
                  },
                  Itens: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ID: { type: 'number' },
                        NumeroItem: { type: 'number' },
                        Sequencia: { type: 'number' },
                        Quantidade: { type: 'number' },
                        Unidade: { type: 'string' },
                        CodigoItem: { type: 'string' },
                        NumeroOrdem: { type: 'string' },
                        DescricaoCompleta: { type: 'string' },
                        ValorUnitario: { type: 'number' },
                        ValorTotal: { type: 'number' },
                        PercentualICMS: { type: 'number' },
                        PercentualIPI: { type: 'number' },
                        PercentualDesconto: { type: 'number' },
                        PercentualST: { type: 'number' },
                        DataEmissao: { type: 'string', format: 'date-time' },
                        DataEntrega: { type: 'string', format: 'date-time' },
                        PrazoEntrega: { type: 'string' },
                        FormaRemessa: { type: 'string' },
                        Transportadora: { type: 'string' },
                        HorarioEntrega: { type: 'string' },
                        Informativo: { type: 'string' },
                        Aplicacao: { type: 'string' },
                        Observacao: { type: 'string' },
                        ObservacaoCobranca: { type: 'string' },
                        Aprovador: { type: 'string' },
                        CondicaoPagamento: { type: 'string' },
                        Status: { type: 'number' },
                        ValorDesconto: { type: 'number' },
                        ValorST: { type: 'number' },
                        Marca: { type: 'string' }
                      }
                    }
                  },
                  Fornecedor: {
                    type: 'object',
                    properties: {
                      ID: { type: 'number' },
                      CodigoComlink: { type: 'number' },
                      DocumentoFornecedor: { type: 'string' },
                      Inscricao: { type: 'string' },
                      TipoPessoa: { type: 'string' },
                      NomeRazaoSocial: { type: 'string' },
                      NomeFantasia: { type: 'string' },
                      Endereco: { type: 'string' },
                      NumeroEndereco: { type: 'string' },
                      ComplementoEndereco: { type: 'string' },
                      Bairro: { type: 'string' },
                      Cidade: { type: 'string' },
                      Cep: { type: 'string' },
                      Estado: { type: 'string' },
                      Telefone1: { type: 'string' },
                      Telefone2: { type: 'string' },
                      Telefone3: { type: 'string' },
                      Fax: { type: 'string' },
                      CaixaPostal: { type: 'string' },
                      Email: { type: 'string' },
                      Contato: { type: 'string' },
                      Observacao: { type: 'string' },
                      CodigoCliente: { type: 'string' }
                    }
                  },
                  CondicoesPagamento: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ID: { type: 'number' },
                        ParcelaPagamento: { type: 'number' },
                        PercentualParcela: { type: 'number' },
                        TipoParcela: { type: 'string' },
                        ValorParcela: { type: 'number' },
                        Observacao: { type: 'string' },
                        DiaParcela: { type: 'number' }
                      }
                    }
                  },
                  Anexos: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        Arquivo: { type: 'string' },
                        Nome: { type: 'string' },
                        Extensao: { type: 'string' },
                        Descricao: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '422': { description: 'Unprocessable Content' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-pedido-web',
        method: 'GET',
        path: '/pedido/pedidoweb/{numeroPedido}',
        summary: 'Obtém dados do(s) pedido(s) publicado(s) na web',
        description: 'Retorna informações dos pedidos publicados na web.',
        tags: ['Pedido'],
        parameters: [
          {
            name: 'numeroPedido',
            in: 'path',
            description: 'numero pedido Cliente',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      NumeroWeb: { type: 'number' },
                      NumeroCliente: { type: 'string' },
                      Sequencia: { type: 'number' },
                      Empresa: { type: 'string' },
                      NomeFornecedor: { type: 'string' },
                      NomeComprador: { type: 'string' }
                    }
                  }
                }
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
        id: 'pedidos-cancelados',
        method: 'GET',
        path: '/pedido/cancelados',
        summary: 'Retorna lista de pedidos cancelados no portal Comlink',
        description: 'Retorna uma lista de todos os pedidos que foram cancelados no portal Comlink.',
        tags: ['Pedido'],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      DataCancelamento: { type: 'string', format: 'date-time' },
                      NumeroPedidoComlink: { type: 'number' },
                      NumeroCliente: { type: 'string' },
                      Empresa: { type: 'string' },
                      DocumentoEmpresa: { type: 'string' },
                      NomeFornecedor: { type: 'string' },
                      DocumentoFornecedor: { type: 'string' },
                      NomeComprador: { type: 'string' },
                      EmailComprador: { type: 'string' },
                      DataEntrega: { type: 'string', format: 'date-time' },
                      ValorTotal: { type: 'number' },
                      Observacao: { type: 'string' },
                      NumeroCotacaoComlink: { type: 'number' },
                      CanceladoPor: { type: 'string' }
                    }
                  }
                }
              }
            }
          },
          '204': { description: 'No Content' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'confirmar-cancelamento-pedido',
        method: 'PUT',
        path: '/pedido/confirmacancelamento/{numeroPedido}',
        summary: 'Confirma o recebimento sobre o cancelamento do pedido para a Comlink',
        description: 'Confirma que o cancelamento do pedido foi processado.',
        tags: ['Pedido'],
        parameters: [
          {
            name: 'numeroPedido',
            in: 'path',
            description: 'numero pedido Comlink (PedidoCancelado.NumeroPedidoComlink)',
            required: true,
            schema: { type: 'number' }
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
    name: 'OrdemServico',
    endpoints: [
      {
        id: 'enviar-ordem-servico',
        method: 'POST',
        path: '/ordemservico/enviar',
        summary: 'Publica ordem de serviço',
        tags: ['OrdemServico'],
        requestBody: {
          description: 'Ordem de serviço a ser publicada',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                "Cabecalho": {
                  "NumeroComlink": 0,
                  "NumeroOrdemServico": "string",
                  "Sequencia": 0,
                  "CNPJ": "string",
                  "Empresa": "string",
                  "DataGeracao": "2025-08-26T11:36:00.168Z",
                  "Validade": 0,
                  "Urgencia": "string",
                  "NomeComprador": "string",
                  "EmailComprador": "string",
                  "NomeSolicitante": "string",
                  "LocalRetirada": "string",
                  "DataEntrada": "2025-08-26T11:36:00.168Z",
                  "Observacao": "string",
                  "Origem": "string"
                },
                "Prestador": {
                  "NumeroComlink": 0,
                  "CodigoPrestador": 0,
                  "Observacao": "string",
                  "NumeroControle": "string",
                  "DocumentoPrestador": "string"
                },
                "CadastroPrestador": {
                  "NumeroComlink": 0,
                  "CodigoFornecedor": 0,
                  "DocumentoFornecedor": "string",
                  "NomeRazaoSocial": "string",
                  "NomeFantasia": "string"
                },
                "Operacoes": [
                  {
                    "NumeroComlink": 0,
                    "NumeroItem": 0,
                    "Descricao": "string",
                    "Quantidade": 0,
                    "ValorNotaFiscal": 0,
                    "CodigoEquipamento": "string"
                  }
                ],
                "Atividades": [
                  {
                    "NumeroComlink": 0,
                    "NumeroItemOperacao": 0,
                    "NumeroItem": 0,
                    "Descricao": "string",
                    "NumeroRequisicaoServico": 0
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
        id: 'obter-ordens-finalizadas',
        method: 'GET',
        path: '/ordemservico/retorno/ordens/{origem}',
        summary: 'Retorna lista de ordens de serviço finalizadas para criação de pedidos',
        tags: ['OrdemServico'],
        parameters: [
          {
            name: 'origem',
            in: 'path',
            description: 'Origem',
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
                    "NumeroOrdemServico": "string",
                    "SequenciaOrdemServico": 0,
                    "Origem": "string"
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
        id: 'obter-dados-negociacao-ordem',
        method: 'GET',
        path: '/ordemservico/retorno/{ordemServico}',
        summary: 'Retorna dados sobre a negociação (respostas) da ordem de serviço',
        tags: ['OrdemServico'],
        parameters: [
          {
            name: 'ordemServico',
            in: 'path',
            description: 'Número da ordem de serviço Comlink',
            required: true,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'confirma-processamento-ordem',
        method: 'PUT',
        path: '/ordemservico/retorno/confirmaprocessamento/{ordemServico}',
        summary: 'Confirma o processamento sobre os dados de retorno da ordem de serviço',
        tags: ['OrdemServico'],
        parameters: [
          {
            name: 'ordemServico',
            in: 'path',
            description: 'Número da ordem de serviço Comlink',
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
        id: 'gravar-mensagem-ordem',
        method: 'POST',
        path: '/ordemservico/retorno/mensagem',
        summary: 'Grava mensagens no portal B2B Comlink',
        tags: ['OrdemServico'],
        requestBody: {
          description: 'Mensagem',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                "NumeroComlink": 0,
                "NumeroOrdemServico": "string",
                "Mensagem": "string",
                "Erro": true
              }
            }
          }
        },
        responses: {
          '200': { description: 'OK' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Not Found' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-ordens-canceladas',
        method: 'GET',
        path: '/ordemservico/retorno/canceladas/{origem}',
        summary: 'Retorna lista de ordens de serviço canceladas no portal Comlink',
        tags: ['OrdemServico'],
        parameters: [
          {
            name: 'origem',
            in: 'path',
            description: 'Origem',
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
                    "NumeroOrdemServico": "string",
                    "SequenciaOrdemServico": 0,
                    "Observacao": "string",
                    "Origem": "string"
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
        id: 'confirma-cancelamento-ordem',
        method: 'PUT',
        path: '/ordemservico/retorno/confirmacancelamento/{ordemServico}',
        summary: 'Confirma o cancelamento da ordem de serviço',
        tags: ['OrdemServico'],
        parameters: [
          {
            name: 'ordemServico',
            in: 'path',
            description: 'Número da ordem Comlink',
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
    name: 'ImpostoAgregado',
    endpoints: [
      {
        id: 'cadastrar-impostos',
        method: 'POST',
        path: '/imposto/carga',
        summary: 'Realiza o cadastro dos códigos de imposto agregados',
        tags: ['ImpostoAgregado'],
        requestBody: {
          description: 'Dados dos impostos agregados',
          content: {
            'application/json': {
              schema: { type: 'array', items: { type: 'object' } },
              example: [
                {
                  "CodigoCliente": "string",
                  "Descricao": "string",
                  "UsoMaterial": "string",
                  "Padrao": true,
                  "Ativo": true
                }
              ]
            }
          }
        },
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '422': { description: 'Unprocessable Content' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-impostos',
        method: 'GET',
        path: '/imposto/obter/{codigoImpostoAgregado}',
        summary: 'Retorna lista de códigos de imposto agregados cadastrados',
        description: 'Se o código de imposto agregado não for informado, serão retornados todos os códigos de imposto agregados cadastrados.',
        tags: ['ImpostoAgregado'],
        parameters: [
          {
            name: 'codigoImpostoAgregado',
            in: 'path',
            description: 'Código de imposto agregado no cliente (não obrigatório)',
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
                    "CodigoCliente": "string",
                    "CodigoEmpresa": "string",
                    "NomeRazaoSocial": "string",
                    "NomeFantasia": "string",
                    "CNPJ": "string",
                    "Cidade": "string",
                    "Estado": "st",
                    "DDD": "st",
                    "Telefone": "string",
                    "Padrao": 0
                  }
                ]
              }
            }
          },
          '204': { description: 'No Content' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'Log',
    endpoints: [
      {
        id: 'adicionar-log',
        method: 'POST',
        path: '/logs/adicionar',
        summary: 'Adiciona o log de integração',
        tags: ['Log'],
        requestBody: {
          description: 'Dados do log',
          content: {
            'application/json': {
              schema: { type: 'array', items: { type: 'object' } },
              example: [
                {
                  "NumeroDocumento": "string",
                  "Descricao": "string",
                  "Tipo": 0
                }
              ]
            }
          }
        },
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-logs',
        method: 'GET',
        path: '/logs/obter',
        summary: 'Obtém os logs de integração',
        tags: ['Log'],
        parameters: [
          {
            name: 'd',
            in: 'query',
            description: '(opcional) número de dias anteriores à data atual (inclusive)',
            required: false,
            schema: { type: 'integer', format: 'int32' }
          },
          {
            name: 'tc',
            in: 'query',
            description: '(opcional) tipo do contexto do log (LogIntegracao.Tipo)',
            required: false,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          '204': { description: 'No Content' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-logs-paginado',
        method: 'GET',
        path: '/logs/obter/v2',
        summary: 'Obtém os logs de integração de forma paginada',
        tags: ['Log'],
        parameters: [
          {
            name: 'tc',
            in: 'query',
            description: '(opcional) tipo do contexto do log (LogIntegracao.Tipo)',
            required: false,
            schema: { type: 'integer', format: 'int32' }
          },
          {
            name: 'rp',
            in: 'query',
            description: '(opcional) número de registros por página',
            required: false,
            schema: { type: 'integer', format: 'int32' }
          },
          {
            name: 'pg',
            in: 'query',
            description: '(opcional) número da página dos registros',
            required: false,
            schema: { type: 'integer', format: 'int32' }
          }
        ],
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: { type: 'array', items: { type: 'string' } }
              }
            }
          },
          '204': { description: 'No Content' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'Requisicao',
    endpoints: [
      {
        id: 'enviar-requisicao',
        method: 'POST',
        path: '/requisicao/enviar',
        summary: 'Publica requisição',
        tags: ['Requisicao'],
        requestBody: {
          description: 'Requisição a ser publicada',
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: {
                "EmpNom": "string",
                "ColigNom": "string",
                "DivNom": "string",
                "EmpDoc": "string",
                "ColigDoc": "string",
                "LocalEntrega": "string",
                "Estoque": true,
                "ObsCmp": "string",
                "ObsForn": "string",
                "NumeroCli": "string",
                "ErpOrigem": "string",
                "ObsReq": "string",
                "Solicitante": "string",
                "DataEmissao": "2025-08-26T11:38:20.067Z",
                "DataLiberacao": "2025-08-26T11:38:20.067Z",
                "TipoRequisicao": "string",
                "Itens": [
                  {
                    "CodMatClk": 0,
                    "CodMatCli": "string",
                    "Quantidade": 0,
                    "ObsCmp": "string",
                    "ObsForn": "string",
                    "Descricao": "string",
                    "Embalagem": "string",
                    "Unidade": "string",
                    "Ncm": "string",
                    "LocalEntrega": "string",
                    "DataEntrega": "2025-08-26T11:38:20.067Z",
                    "DataRemessa": "2025-08-26T11:38:20.067Z",
                    "DataEmissao": "2025-08-26T11:38:20.067Z",
                    "DataLiberacao": "2025-08-26T11:38:20.067Z"
                  }
                ],
                "Anexos": [
                  {
                    "AnexoId": "string",
                    "Arquivo": "string",
                    "ArquivoBase64": "string",
                    "Nome": "string",
                    "Extensao": "string"
                  }
                ],
                "TotalAnexo": 0,
                "BloqErp": true
              }
            }
          }
        },
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'inserir-anexos-requisicao',
        method: 'POST',
        path: '/requisicao/anexos/{numeroCliente}',
        summary: 'Inserir anexos da requisição de forma assíncrona',
        tags: ['Requisicao'],
        parameters: [
          {
            name: 'numeroCliente',
            in: 'path',
            description: 'Número da requisição do cliente',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal Server Error' }
        }
      }
    ]
  },
  {
    name: 'Transportadora',
    endpoints: [
      {
        id: 'cadastrar-transportadoras',
        method: 'POST',
        path: '/transportadora/carga',
        summary: 'Realiza o cadastro das transportadoras',
        tags: ['Transportadora'],
        requestBody: {
          description: 'Dados cadastrais das transportadoras',
          content: {
            'application/json': {
              schema: { type: 'array', items: { type: 'object' } },
              example: [
                {
                  "CodigoCliente": "string",
                  "CodigoEmpresa": "string",
                  "NomeRazaoSocial": "string",
                  "NomeFantasia": "string",
                  "CNPJ": "string",
                  "Cidade": "string",
                  "Estado": "st",
                  "DDD": "st",
                  "Telefone": "string",
                  "Padrao": 0
                }
              ]
            }
          }
        },
        responses: {
          '201': { description: 'Created' },
          '400': { description: 'Bad Request' },
          '401': { description: 'Unauthorized' },
          '422': { description: 'Unprocessable Content' },
          '500': { description: 'Internal Server Error' }
        }
      },
      {
        id: 'obter-transportadoras',
        method: 'GET',
        path: '/transportadora/obter/{codigo}/{codigoEmpresa}',
        summary: 'Retorna lista de transportadoras cadastradas',
        description: 'Se o código da transportadora não for informado, serão retornadas todas as transportadoras cadastradas.',
        tags: ['Transportadora'],
        parameters: [
          {
            name: 'codigo',
            in: 'path',
            description: 'Código da transportadora no cliente (não obrigatório)',
            required: true,
            schema: { type: 'string' }
          },
          {
            name: 'codigoEmpresa',
            in: 'path',
            description: 'Código da empresa da transportadora no cliente (não obrigatório)',
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
                    "CodigoCliente": "string",
                    "CodigoEmpresa": "string",
                    "NomeRazaoSocial": "string",
                    "NomeFantasia": "string",
                    "CNPJ": "string",
                    "Cidade": "string",
                    "Estado": "st",
                    "DDD": "st",
                    "Telefone": "string",
                    "Padrao": 0
                  }
                ]
              }
            }
          },
          '204': { description: 'No Content' },
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