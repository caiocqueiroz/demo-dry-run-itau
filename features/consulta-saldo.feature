# language: pt
Funcionalidade: Consulta de Saldo
  Como um usuário do sistema bancário
  Eu quero consultar o saldo das contas
  Para que possa verificar informações financeiras dos clientes

  Contexto:
    Dado que estou autenticado no sistema bancário
    E que existe um cliente cadastrado:
      | nome               | Ana Paula Costa         |
      | cpf                | 456.789.123-45         |
      | data_nascimento    | 1992-12-10             |
      | email              | ana.costa@email.com    |
      | telefone           | (11) 77777-7777        |
    E que existe uma conta para este cliente:
      | numero_conta       | 789456                 |
      | tipo_conta         | corrente               |
      | saldo              | 1250.80                |

  Cenário: Consultar saldo por número da conta
    Dado que estou na seção de consulta de saldo
    Quando eu digito o número da conta "789456"
    E clico no botão "Consultar Saldo"
    Então devo ver as informações da conta:
      | número             | 789456                 |
      | cliente            | Ana Paula Costa        |
      | tipo               | Conta Corrente         |
      | saldo_atual        | R$ 1.250,80            |
    E devo ver a mensagem "Saldo consultado com sucesso"

  Cenário: Consultar saldo com número de conta inválido
    Dado que estou na seção de consulta de saldo
    Quando eu digito o número da conta "12345"
    E clico no botão "Consultar Saldo"
    Então devo ver a mensagem de erro "Número da conta deve ter 6 dígitos"
    E nenhuma informação de conta deve ser exibida

  Cenário: Consultar saldo de conta inexistente
    Dado que estou na seção de consulta de saldo
    Quando eu digito o número da conta "999999"
    E clico no botão "Consultar Saldo"
    Então devo ver a mensagem de erro "Conta não encontrada"
    E nenhuma informação de conta deve ser exibida

  Cenário: Consultar saldo sem digitar número da conta
    Dado que estou na seção de consulta de saldo
    Quando eu clico no botão "Consultar Saldo" sem digitar o número
    Então devo ver a mensagem de aviso "Digite o número da conta"
    E o campo de número da conta deve receber foco

  Cenário: Consultar saldo usando Enter no teclado
    Dado que estou na seção de consulta de saldo
    Quando eu digito o número da conta "789456"
    E pressiono a tecla Enter
    Então devo ver as informações da conta:
      | número             | 789456                 |
      | cliente            | Ana Paula Costa        |
      | tipo               | Conta Corrente         |
      | saldo_atual        | R$ 1.250,80            |

  Cenário: Consultar saldo de conta poupança
    Dado que existe uma conta poupança:
      | numero_conta       | 654987                 |
      | cpf_cliente        | 456.789.123-45         |
      | tipo_conta         | poupanca               |
      | saldo              | 5500.25                |
    E que estou na seção de consulta de saldo
    Quando eu digito o número da conta "654987"
    E clico no botão "Consultar Saldo"
    Então devo ver as informações da conta:
      | número             | 654987                 |
      | cliente            | Ana Paula Costa        |
      | tipo               | Conta Poupança         |
      | saldo_atual        | R$ 5.500,25            |

  Cenário: Consultar saldo de conta com valor zero
    Dado que existe uma conta com saldo zero:
      | numero_conta       | 123000                 |
      | cpf_cliente        | 456.789.123-45         |
      | tipo_conta         | corrente               |
      | saldo              | 0.00                   |
    E que estou na seção de consulta de saldo
    Quando eu digito o número da conta "123000"
    E clico no botão "Consultar Saldo"
    Então devo ver as informações da conta:
      | número             | 123000                 |
      | cliente            | Ana Paula Costa        |
      | tipo               | Conta Corrente         |
      | saldo_atual        | R$ 0,00                |

  Cenário: Consultar saldo múltiplas vezes consecutivas
    Dado que estou na seção de consulta de saldo
    Quando eu consulto o saldo da conta "789456"
    E consulto novamente o saldo da mesma conta "789456"
    Então devo ver as informações atualizadas da conta:
      | número             | 789456                 |
      | cliente            | Ana Paula Costa        |
      | tipo               | Conta Corrente         |
      | saldo_atual        | R$ 1.250,80            |
    E a consulta deve ser realizada em tempo real