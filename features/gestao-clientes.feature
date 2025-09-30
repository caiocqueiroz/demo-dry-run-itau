# language: pt
Funcionalidade: Gestão de Clientes
  Como um funcionário do banco
  Eu quero gerenciar informações de clientes
  Para que possa manter dados atualizados e realizar operações bancárias

  Contexto:
    Dado que estou autenticado no sistema bancário
    E que tenho permissões para gerenciar clientes

  Cenário: Cadastrar novo cliente com dados válidos
    Dado que estou na página de cadastro de clientes
    Quando eu preencho os dados do cliente:
      | nome               | João Silva Santos        |
      | cpf                | 123.456.789-01          |
      | data_nascimento    | 1990-05-15              |
      | email              | joao.silva@email.com    |
      | telefone           | (11) 99999-9999         |
    E clico no botão "Cadastrar Cliente"
    Então o cliente deve ser criado com sucesso
    E devo ver a mensagem "Cliente cadastrado com sucesso"
    E o cliente deve aparecer na lista de clientes

  Cenário: Validar CPF brasileiro durante cadastro
    Dado que estou na página de cadastro de clientes
    Quando eu preencho os dados do cliente:
      | nome               | Maria Santos             |
      | cpf                | 111.111.111-11          |
      | data_nascimento    | 1985-08-20              |
      | email              | maria@email.com         |
      | telefone           | (11) 88888-8888         |
    E clico no botão "Cadastrar Cliente"
    Então devo ver a mensagem de erro "CPF inválido"
    E o cliente não deve ser criado

  Cenário: Impedir cadastro de cliente com CPF duplicado
    Dado que existe um cliente cadastrado com CPF "123.456.789-01"
    E que estou na página de cadastro de clientes
    Quando eu preencho os dados do cliente:
      | nome               | Ana Costa               |
      | cpf                | 123.456.789-01         |
      | data_nascimento    | 1992-12-10             |
      | email              | ana@email.com          |
      | telefone           | (11) 77777-7777        |
    E clico no botão "Cadastrar Cliente"
    Então devo ver a mensagem de erro "Cliente com este CPF já existe"
    E o cliente não deve ser criado

  Cenário: Buscar cliente por CPF
    Dado que existe um cliente cadastrado:
      | nome               | Carlos Lima             |
      | cpf                | 987.654.321-00         |
      | data_nascimento    | 1988-03-18             |
      | email              | carlos@email.com       |
      | telefone           | (11) 66666-6666       |
    Quando eu busco pelo CPF "987.654.321-00"
    Então devo ver os dados do cliente:
      | nome               | Carlos Lima             |
      | cpf                | 987.654.321-00         |
      | data_nascimento    | 18/03/1988             |
      | email              | carlos@email.com       |
      | telefone           | (11) 66666-6666       |

  Cenário: Atualizar informações de cliente existente
    Dado que existe um cliente cadastrado:
      | nome               | Fernanda Rodrigues      |
      | cpf                | 456.789.123-45         |
      | data_nascimento    | 1995-07-25             |
      | email              | fernanda@email.com     |
      | telefone           | (11) 55555-5555       |
    Quando eu atualizo as informações do cliente:
      | email              | fernanda.nova@email.com |
      | telefone           | (11) 99999-0000        |
    Então as informações devem ser atualizadas com sucesso
    E devo ver a mensagem "Cliente atualizado com sucesso"

  Cenário: Validar idade mínima para abertura de conta
    Dado que estou na página de cadastro de clientes
    Quando eu preencho os dados do cliente:
      | nome               | João Menor              |
      | cpf                | 321.654.987-12         |
      | data_nascimento    | 2010-01-01             |
      | email              | joao.menor@email.com   |
      | telefone           | (11) 44444-4444        |
    E clico no botão "Cadastrar Cliente"
    Então devo ver a mensagem de erro "Idade mínima é 18 anos"
    E o cliente não deve ser criado

  Cenário: Listar todos os clientes cadastrados
    Dado que existem os seguintes clientes cadastrados:
      | nome               | cpf                | email                   |
      | João Silva         | 123.456.789-01    | joao@email.com         |
      | Maria Santos       | 987.654.321-00    | maria@email.com        |
      | Carlos Lima        | 456.789.123-45    | carlos@email.com       |
    Quando eu acesso a lista de clientes
    Então devo ver todos os 3 clientes listados
    E os clientes devem estar ordenados por nome
    E cada cliente deve mostrar:
      | nome     |
      | cpf      |
      | email    |
      | telefone |
      | ações    |