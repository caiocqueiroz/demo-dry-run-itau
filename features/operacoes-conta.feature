# language: pt
Funcionalidade: Operações de Conta Bancária
  Como um funcionário do banco
  Eu quero gerenciar contas bancárias dos clientes
  Para que possa oferecer serviços bancários completos

  Contexto:
    Dado que estou autenticado no sistema bancário
    E que existe um cliente cadastrado:
      | nome               | João Silva Santos       |
      | cpf                | 123.456.789-01         |
      | data_nascimento    | 1990-05-15             |
      | email              | joao.silva@email.com   |
      | telefone           | (11) 99999-9999        |

  Cenário: Criar conta corrente para cliente existente
    Dado que estou na página de criação de contas
    Quando eu preencho os dados da conta:
      | cpf_cliente        | 123.456.789-01         |
      | tipo_conta         | corrente               |
      | saldo_inicial      | 1000.00                |
    E clico no botão "Criar Conta"
    Então a conta deve ser criada com sucesso
    E devo ver a mensagem "Conta criada com sucesso"
    E a conta deve ter um número único de 6 dígitos
    E o saldo inicial deve ser R$ 1.000,00

  Cenário: Criar conta poupança para cliente existente
    Dado que estou na página de criação de contas
    Quando eu preencho os dados da conta:
      | cpf_cliente        | 123.456.789-01         |
      | tipo_conta         | poupanca               |
      | saldo_inicial      | 500.00                 |
    E clico no botão "Criar Conta"
    Então a conta deve ser criada com sucesso
    E devo ver a mensagem "Conta criada com sucesso"
    E o tipo da conta deve ser "Conta Poupança"
    E o saldo inicial deve ser R$ 500,00

  Cenário: Impedir criação de conta para cliente inexistente
    Dado que estou na página de criação de contas
    Quando eu preencho os dados da conta:
      | cpf_cliente        | 999.999.999-99         |
      | tipo_conta         | corrente               |
      | saldo_inicial      | 1000.00                |
    E clico no botão "Criar Conta"
    Então devo ver a mensagem de erro "Cliente não encontrado"
    E a conta não deve ser criada

  Cenário: Buscar conta por número
    Dado que existe uma conta:
      | numero_conta       | 123456                 |
      | cpf_cliente        | 123.456.789-01         |
      | tipo_conta         | corrente               |
      | saldo              | 2500.75                |
    Quando eu busco pela conta número "123456"
    Então devo ver os detalhes da conta:
      | numero_conta       | 123456                 |
      | cliente            | João Silva Santos      |
      | cpf_cliente        | 123.456.789-01         |
      | tipo_conta         | Conta Corrente         |
      | saldo              | R$ 2.500,75            |

  Cenário: Consultar saldo de conta existente
    Dado que existe uma conta:
      | numero_conta       | 654321                 |
      | cpf_cliente        | 123.456.789-01         |
      | tipo_conta         | poupanca               |
      | saldo              | 3200.50                |
    Quando eu consulto o saldo da conta "654321"
    Então devo ver o saldo atual de R$ 3.200,50
    E devo ver o nome do cliente "João Silva Santos"
    E devo ver o tipo de conta "Conta Poupança"

  Cenário: Listar contas de um cliente específico
    Dado que existem as seguintes contas para o cliente "123.456.789-01":
      | numero_conta  | tipo_conta  | saldo     |
      | 111111        | corrente    | 1500.00   |
      | 222222        | poupanca    | 2800.75   |
    Quando eu consulto as contas do cliente "123.456.789-01"
    Então devo ver 2 contas listadas
    E devo ver a conta corrente "111111" com saldo R$ 1.500,00
    E devo ver a conta poupança "222222" com saldo R$ 2.800,75

  Cenário: Validar número de conta com formato incorreto
    Quando eu busco pela conta número "12345"
    Então devo ver a mensagem de erro "Número da conta deve ter 6 dígitos"

  Cenário: Buscar conta inexistente
    Quando eu busco pela conta número "999999"
    Então devo ver a mensagem de erro "Conta não encontrada"

  Cenário: Listar todas as contas do sistema
    Dado que existem as seguintes contas cadastradas:
      | numero_conta  | cliente           | tipo_conta  | saldo     |
      | 100001        | João Silva        | corrente    | 1500.00   |
      | 100002        | Maria Santos      | poupanca    | 2800.75   |
      | 100003        | Carlos Lima       | corrente    | 950.25    |
    Quando eu acesso a lista de todas as contas
    Então devo ver todas as 3 contas listadas
    E cada conta deve mostrar:
      | numero_conta  |
      | cliente       |
      | tipo_conta    |
      | saldo         |
      | data_criacao  |
      | ações         |

  Cenário: Criar conta com saldo inicial zero
    Dado que estou na página de criação de contas
    Quando eu preencho os dados da conta:
      | cpf_cliente        | 123.456.789-01         |
      | tipo_conta         | corrente               |
      | saldo_inicial      | 0.00                   |
    E clico no botão "Criar Conta"
    Então a conta deve ser criada com sucesso
    E o saldo inicial deve ser R$ 0,00