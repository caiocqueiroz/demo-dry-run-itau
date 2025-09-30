# language: pt
Funcionalidade: Dashboard e Métricas Bancárias
  Como um gestor do banco
  Eu quero visualizar métricas e indicadores do sistema
  Para que possa acompanhar o desempenho e tomar decisões estratégicas

  Contexto:
    Dado que estou autenticado no sistema bancário como gestor
    E que existem dados históricos no sistema

  Cenário: Visualizar métricas principais no dashboard
    Dado que existem os seguintes dados no sistema:
      | clientes_cadastrados  | 150 |
      | contas_ativas        | 285 |
      | saldo_total          | 1250000.50 |
    Quando eu acesso o dashboard principal
    Então devo ver as seguintes métricas:
      | total_clientes       | 150 |
      | total_contas         | 285 |
      | saldo_total          | R$ 1.250.000,50 |
    E as métricas devem ser atualizadas em tempo real

  Cenário: Visualizar gráfico de distribuição de tipos de conta
    Dado que existem as seguintes contas no sistema:
      | tipo_conta  | quantidade |
      | corrente    | 180        |
      | poupanca    | 105        |
    Quando eu visualizo o gráfico de tipos de conta
    Então devo ver um gráfico de pizza com:
      | conta_corrente   | 180 contas (63.2%) |
      | conta_poupanca   | 105 contas (36.8%) |
    E o gráfico deve ser interativo

  Cenário: Visualizar gráfico de crescimento de clientes
    Dado que existem registros de crescimento dos últimos 6 meses:
      | mes       | novos_clientes |
      | Janeiro   | 25            |
      | Fevereiro | 32            |
      | Março     | 28            |
      | Abril     | 35            |
      | Maio      | 42            |
      | Junho     | 38            |
    Quando eu visualizo o gráfico de crescimento
    Então devo ver um gráfico de linha mostrando a evolução mensal
    E devo ver a tendência de crescimento destacada
    E o gráfico deve mostrar os últimos 6 meses

  Cenário: Verificar status de conexão com a API
    Quando eu acesso o dashboard
    Então devo ver o indicador de status da API
    E o status deve mostrar "API Conectada" com indicador verde
    Quando a API estiver indisponível
    Então devo ver "API Desconectada" com indicador vermelho

  Cenário: Acessar diferentes seções do dashboard
    Dado que estou no dashboard principal
    Quando eu clico na seção "Clientes"
    Então devo ser direcionado para a página de gestão de clientes
    E o título da página deve ser "Gerenciar Clientes"
    Quando eu clico na seção "Contas"
    Então devo ser direcionado para a página de gestão de contas
    E o título da página deve ser "Gerenciar Contas"
    Quando eu clico na seção "Saldo"
    Então devo ser direcionado para a página de consulta de saldo
    E o título da página deve ser "Consultar Saldo"

  Cenário: Alternar entre tema claro e escuro
    Dado que estou visualizando o dashboard no tema claro
    Quando eu clico no botão de alternância de tema
    Então o dashboard deve mudar para o tema escuro
    E a preferência deve ser salva localmente
    Quando eu recarrego a página
    Então o tema escuro deve ser mantido

  Cenário: Visualizar dashboard em dispositivo móvel
    Dado que estou acessando o dashboard em um dispositivo móvel
    Quando a tela for menor que 768px
    Então o menu lateral deve ser ocultado automaticamente
    E as métricas devem ser reorganizadas em coluna única
    E os gráficos devem se adaptar ao tamanho da tela

  Cenário: Carregar dados com falha na API
    Dado que a API está temporariamente indisponível
    Quando eu acesso o dashboard
    Então devo ver a mensagem "Erro ao carregar dados do dashboard"
    E as métricas devem mostrar valores zerados
    E devo ver uma indicação visual de erro

  Cenário: Atualizar métricas após operações
    Dado que estou visualizando o dashboard com 100 clientes
    Quando um novo cliente é cadastrado no sistema
    E eu navego de volta para o dashboard
    Então o total de clientes deve mostrar 101
    E os gráficos devem ser atualizados automaticamente

  Cenário: Exportar dados do dashboard
    Dado que estou visualizando as métricas do dashboard
    Quando eu clico na opção "Exportar Dados"
    Então devo poder baixar um relatório em formato PDF
    E o relatório deve conter:
      | métricas_principais |
      | gráficos           |
      | data_hora_geração  |
      | período_analisado  |