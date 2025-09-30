# language: pt
Funcionalidade: Validações e Segurança
  Como administrador do sistema bancário
  Eu quero garantir que todas as validações e medidas de segurança estejam funcionando
  Para que o sistema mantenha a integridade e segurança dos dados

  Contexto:
    Dado que estou acessando o sistema bancário

  Cenário: Validar CPF com algoritmo brasileiro completo
    Dado que estou cadastrando um cliente
    Quando eu digito o CPF "12345678901"
    Então o sistema deve calcular os dígitos verificadores
    E deve validar que o CPF é válido
    E deve exibir "CPF válido" em verde
    
  Cenário: Rejeitar CPF inválido
    Dado que estou cadastrando um cliente
    Quando eu digito o CPF "11111111111"
    Então o sistema deve identificar que todos os dígitos são iguais
    E deve exibir "CPF inválido" em vermelho
    E não deve permitir o cadastro

  Cenário: Validar formato de CPF durante digitação
    Dado que estou no campo de CPF
    Quando eu digito "12345678901"
    Então o campo deve aplicar a máscara automaticamente
    E deve exibir "123.456.789-01"
    E a validação deve ocorrer em tempo real

  Cenário: Validar telefone brasileiro
    Dado que estou preenchendo dados de contato
    Quando eu digito o telefone "11999999999"
    Então o sistema deve validar o DDD "11"
    E deve validar que é um celular (9 dígitos após DDD)
    E deve aplicar a máscara "(11) 99999-9999"
    E deve exibir "Telefone válido"

  Cenário: Rejeitar telefone com DDD inválido
    Dado que estou preenchendo dados de contato
    Quando eu digito o telefone "00999999999"
    Então o sistema deve identificar DDD inválido
    E deve exibir "DDD inválido"
    E não deve permitir o cadastro

  Cenário: Validar email com formato correto
    Dado que estou preenchendo o email do cliente
    Quando eu digito "usuario@dominio.com.br"
    Então o sistema deve validar o formato do email
    E deve exibir "Email válido"
    
  Cenário: Rejeitar email com formato inválido
    Dado que estou preenchendo o email do cliente
    Quando eu digito "email_invalido"
    Então o sistema deve identificar formato inválido
    E deve exibir "Email inválido"
    E não deve permitir o cadastro

  Cenário: Validar idade mínima de 18 anos
    Dado que estou cadastrando um cliente
    Quando eu informo a data de nascimento "2010-01-01"
    Então o sistema deve calcular que o cliente tem menos de 18 anos
    E deve exibir "Idade mínima é 18 anos"
    E não deve permitir o cadastro

  Cenário: Validar idade máxima de 150 anos
    Dado que estou cadastrando um cliente
    Quando eu informo a data de nascimento "1850-01-01"
    Então o sistema deve calcular que o cliente tem mais de 150 anos
    E deve exibir "Idade máxima é 150 anos"
    E não deve permitir o cadastro

  Cenário: Validar número de conta com 6 dígitos
    Dado que estou consultando uma conta
    Quando eu digito o número "12345"
    Então o sistema deve identificar formato inválido
    E deve exibir "Número da conta deve ter 6 dígitos"
    Quando eu digito o número "123456"
    Então o sistema deve aceitar o formato
    E deve permitir a consulta

  Cenário: Validar valor monetário positivo
    Dado que estou criando uma conta com saldo inicial
    Quando eu informo o valor "-100.00"
    Então o sistema deve rejeitar valor negativo
    E deve exibir "Valor deve ser positivo"
    Quando eu informo o valor "1000.00"
    Então o sistema deve aceitar o valor
    E deve formatar como "R$ 1.000,00"

  Cenário: Sanitizar entrada de dados
    Dado que estou preenchendo o nome do cliente
    Quando eu digito "<script>alert('teste')</script>João"
    Então o sistema deve remover caracteres especiais perigosos
    E deve aceitar apenas "João"
    E deve prevenir ataques de injeção

  Cenário: Limitar tentativas de acesso
    Dado que estou fazendo múltiplas requisições rapidamente
    Quando eu excedo o limite de 100 requisições por minuto
    Então o sistema deve implementar rate limiting
    E deve retornar erro "Muitas tentativas, tente novamente em 1 minuto"
    E deve bloquear temporariamente meu acesso

  Cenário: Validar conexão segura HTTPS
    Quando eu acesso o sistema em produção
    Então todas as comunicações devem usar HTTPS
    E certificados SSL devem estar válidos
    E dados sensíveis devem ser criptografados em trânsito

  Cenário: Implementar headers de segurança
    Quando uma requisição é feita para a API
    Então o sistema deve incluir headers de segurança:
      | X-Content-Type-Options | nosniff           |
      | X-Frame-Options        | DENY              |
      | X-XSS-Protection       | 1; mode=block     |
      | Strict-Transport-Security | max-age=31536000 |

  Cenário: Validar integridade de dados após operação
    Dado que realizei uma operação de cadastro
    Quando os dados são salvos no banco
    Então o sistema deve verificar integridade dos dados
    E deve criar log de auditoria
    E deve confirmar que a operação foi bem-sucedida
    E deve notificar sobre qualquer inconsistência

  Cenário: Tratar erro de conexão com API
    Dado que estou usando o sistema
    Quando a API ficar indisponível
    Então devo ver uma mensagem clara "Erro de conexão com o servidor"
    E o sistema deve tentar reconectar automaticamente
    E deve mostrar o status da conexão no dashboard
    E deve permitir operações offline quando possível