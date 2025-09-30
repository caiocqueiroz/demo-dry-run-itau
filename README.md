# 🏦 Sistema Bancário Completo - Itaú

![Sistema Completo](https://img.shields.io/badge/Status-Completed-success)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)
![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?logo=javascript&logoColor=black)

Sistema bancário completo com API REST robusta e interface frontend profissional.

## 🚀 Funcionalidades Completas

### 🖥️ **Backend API (Node.js)**
- **Cadastro de Clientes**: Nome, CPF, data de nascimento, email e telefone
- **Criação de Contas**: Contas corrente e poupança com validação brasileira
- **Consulta de Saldo**: Verificação em tempo real por número da conta
- **Operações Bancárias**: Depósitos, saques e transferências
- **Validação de CPF**: Algoritmo brasileiro completo
- **Logging**: Sistema estruturado com Winston
- **Segurança**: Rate limiting, CORS e validação de dados

### 🎨 **Frontend Dashboard (HTML5/JavaScript)**
- **Dashboard Analítico**: Métricas e gráficos em tempo real
- **Interface Profissional**: Design moderno e responsivo
- **Gestão de Clientes**: Cadastro com validação brasileira completa
- **Gerenciamento de Contas**: Criação e consulta de contas
- **Consulta de Saldo**: Interface intuitiva para verificação
- **Temas**: Modo claro e escuro
- **Gráficos Interativos**: Charts com Chart.js

## Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **Winston** - Sistema de logs
- **Joi** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Express Rate Limit** - Controle de taxa de requisições

## Instalação

1. Clone o repositório:
```bash
cd banking-api-nodejs
```

2. Instale as dependências:
```bash
npm install
```

3. Execute a aplicação:
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

A API estará disponível em `http://localhost:3000`

## 🎨 Frontend Dashboard

### Instalação do Frontend

1. Em um novo terminal, navegue para a pasta frontend:
```bash
cd frontend
```

2. Inicie um servidor HTTP:
```bash
# Opção 1: Python
python3 -m http.server 8080

# Opção 2: Node.js
npx serve -p 8080

# Opção 3: PHP
php -S localhost:8080
```

3. Acesse o dashboard:
```
http://localhost:8080
```

### Funcionalidades do Dashboard
- **📊 Dashboard**: Métricas e gráficos interativos
- **👥 Clientes**: Cadastro e listagem com validação de CPF
- **💳 Contas**: Criação de contas corrente e poupança
- **💰 Saldo**: Consulta em tempo real por número da conta
- **🎨 Temas**: Alternância entre modo claro e escuro
- **📱 Responsivo**: Adaptado para desktop, tablet e mobile

## Endpoints da API

### Clientes

#### Cadastrar Cliente
```http
POST /api/clientes
Content-Type: application/json

{
  "nome": "João Silva",
  "cpf": "123.456.789-01",
  "data_nascimento": "1990-05-15",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999"
}
```

#### Listar Clientes
```http
GET /api/clientes
```

#### Buscar Cliente por CPF
```http
GET /api/clientes/12345678901
```

#### Atualizar Cliente
```http
PUT /api/clientes/12345678901
Content-Type: application/json

{
  "nome": "João Santos Silva",
  "email": "joao.santos@email.com"
}
```

### Contas

#### Criar Conta
```http
POST /api/contas
Content-Type: application/json

{
  "cpf_cliente": "123.456.789-01",
  "tipo_conta": "corrente",
  "saldo_inicial": 1000.00
}
```

#### Buscar Conta por Número
```http
GET /api/contas/numero/1001
```

#### Consultar Saldo
```http
GET /api/contas/saldo/1001
```

#### Listar Contas por Cliente
```http
GET /api/contas/cliente/12345678901
```

## Estrutura do Projeto

```
src/
├── config/
│   ├── database.js          # Configuração do banco SQLite
│   └── logger.js             # Configuração do Winston
├── controllers/
│   ├── ClienteController.js  # Controlador de clientes
│   └── ContaController.js    # Controlador de contas
├── middleware/
│   ├── errorHandler.js       # Tratamento de erros
│   └── requestLogger.js      # Log de requisições
├── models/
│   ├── Cliente.js            # Model de cliente
│   └── Conta.js              # Model de conta
├── routes/
│   ├── clienteRoutes.js      # Rotas de clientes
│   └── contaRoutes.js        # Rotas de contas
├── services/
│   ├── ClienteService.js     # Lógica de negócio - clientes
│   └── ContaService.js       # Lógica de negócio - contas
├── utils/
│   ├── cpfValidator.js       # Validador de CPF
│   └── validators.js         # Schemas de validação Joi
└── server.js                 # Arquivo principal da aplicação
```

## Validações

### CPF
- Validação completa do algoritmo de CPF brasileiro
- Formatação automática (XXX.XXX.XXX-XX)
- Verificação de dígitos verificadores

### Dados de Entrada
- **Nome**: 2-100 caracteres
- **Email**: Formato válido (opcional)
- **Telefone**: Apenas números e caracteres válidos (opcional)
- **Data de Nascimento**: Formato ISO, não pode ser futura
- **Tipo de Conta**: "corrente" ou "poupanca"
- **Saldo Inicial**: Valor >= 0

## Logs

A aplicação gera logs estruturados em diferentes níveis:

- **Info**: Requisições HTTP, operações bem-sucedidas
- **Warn**: Tentativas de acesso inválido, dados não encontrados
- **Error**: Erros de sistema, falhas na base de dados

## Tratamento de Erros

- Validação de dados com mensagens em português
- Tratamento específico para erros de banco de dados
- Logs detalhados para debugging
- Respostas padronizadas em JSON

## Rate Limiting

- Máximo de 100 requisições por 15 minutos por IP
- Headers informativos sobre limites
- Proteção contra ataques de força bruta

## Segurança

- **Helmet**: Headers de segurança HTTP
- **CORS**: Configurado para desenvolvimento
- **Validação rigorosa**: Todos os inputs são validados
- **Sanitização**: Dados limpos antes do processamento

## Scripts Disponíveis

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "test": "jest"
}
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
PORT=3000
DB_PATH=./data/banco.sqlite
LOG_LEVEL=info
```

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.