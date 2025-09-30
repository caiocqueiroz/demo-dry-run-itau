# Script para Demo GitHub Copilot - Contexto Bancário (4h)

## 🎯 Objetivos da Demonstração
- Mostrar o GitHub Copilot como ferramenta completa (não apenas autocomplete)
- Demonstrar aplicação prática no contexto bancário
- Abordar aspectos de segurança, produtividade e padronização
- Hands-on com todas as funcionalidades principais

---

## 1. Abertura e Contexto (20min)

### 🎤 Apresentação Inicial
**"Bem-vindos ao treinamento prático do GitHub Copilot para desenvolvimento bancário!"**

### 📋 Agenda Rápida
- O que veremos: teoria mínima + máxima prática
- Exemplos sempre no contexto bancário (clientes, contas, crédito)
- Progressão: autocomplete → chat → agent → review → integração

### 🧠 Teoria Essencial (10min)

#### O que é GitHub Copilot hoje?
```
Copilot ≠ apenas autocomplete
├── Chat Mode: conversa interativa
├── Agent Mode: execução autônoma
├── Coding Agent : execução autônoma em background
├── Code Review: análise de PRs
├── PR Summary: resumos automáticos
└── Spaces: contexto organizado
```

#### Diferenças Chave
- **Autocomplete**: sugestões inline enquanto digita
- **Chat Mode**: conversa para tirar dúvidas e pedir código
- **Agent Mode**: executa tarefas completas autonomamente
- **Coding Agent**: executa tarefas completas autonomamente em background
#### Por que isso importa para bancos?
- **Segurança**: padronização de código seguro
- **Produtividade**: aceleração do desenvolvimento
- **Governança**: consistência entre times

### 🚀 Aquecimento Prático (10min)

**Prompt de aquecimento:**
```
Crie um "Hello World" bancário em Python que:
- Simule o login de um cliente
- Mostre o saldo da conta
- Use logging apropriado
- Tenha tratamento de erro básico
```

**Demonstrar:**
1. Abrir VS Code
2. Usar Ctrl+I (Copilot Chat)
3. Executar o prompt
4. Mostrar o código gerado
5. Executar o programa

---

## 2. Construindo a Aplicação Base (40min)

### 🎯 Objetivo
Criar uma API bancária simples do zero usando Chat Mode

### 🏗️ Arquitetura Inicial (15min)

**Prompt para Chat Mode:**
```
Preciso criar uma API bancária completa para demonstração. 

Contexto:
- Backend: Python com FastAPI
- Frontend: HTML/JavaScript simples para demonstração
- Funcionalidades: cadastro de clientes, criação de contas, consulta de saldo, transações
- Requisitos: logging, validação básica, documentação Swagger, estrutura profissional

Crie a estrutura inicial do projeto com:
1. Arquivo principal da API com documentação OpenAPI customizada
2. Modelos de dados (Cliente, Conta, Transação)
3. Endpoints básicos com exemplos no Swagger
4. Configuração de logging estruturado
5. Frontend HTML básico para testar a API
6. JavaScript para consumir os endpoints
7. Dashboard simples com métricas básicas
```

**Demonstrar:**
1. Criar pasta do projeto
2. Usar Copilot Chat para gerar estrutura completa
3. Mostrar arquivos criados (backend + frontend)
4. Explicar a arquitetura sugerida

### 🔧 Implementação Prática (20min)

**Backend com Swagger Melhorado:**
```
@workspace Refatore a API para incluir:
- Documentação OpenAPI customizada com exemplos
- Configuração de CORS para frontend
- Validação de CPF brasileiro nos modelos
- Middleware de logging estruturado
- Health check endpoints
```

**Frontend Interativo:**
```
Crie um dashboard HTML que inclua:
- Formulário de cadastro de cliente
- Interface para criar contas
- Simulador de transações
- Dashboard com métricas básicas (total clientes, contas, saldo total)
- Gráfico simples usando Chart.js
- Consumo da API via JavaScript fetch
```

**Postman Collection:**
```
@agent Crie uma collection do Postman completa para nossa API bancária incluindo:
- Todas as rotas organizadas por módulos
- Variáveis de ambiente
- Exemplos de requests e responses
- Testes básicos de validação
- Scripts de pré-requisição quando necessário
```

### 🎛️ Custom Instructions (5min)

**Configurar Custom Instructions:**
```
Contexto: Sou desenvolvedor em um banco brasileiro criando APIs e interfaces.

Sempre que criar código:
- Backend: Use FastAPI com logging estruturado, validações brasileiras (CPF/CNPJ), OpenAPI bem documentado
- Frontend: HTML semântico, JavaScript vanilla (ES6+), responsive design, acessibilidade básica
- Testes: Inclua exemplos para Swagger e scripts para Postman
- Documentação: Sempre inclua exemplos práticos
- Siga padrões PEP 8 (Python) e boas práticas web
```

**Demonstrar:** Como isso melhora as sugestões para full-stack

---

## 3. Avançando com Agentes (50min)

### 🤖 Introdução ao Agent Mode (10min)

**Explicar diferença:**
- Chat Mode: você pergunta, ele responde
- Agent Mode: ele executa tarefas completas autonomamente

### 🎯 Feature: Simulação de Crédito (30min)

**Prompt para Agent Mode:**
```
@agent Crie uma feature completa de simulação de crédito para nossa API bancária.

Requisitos:
- Endpoint POST /simular-credito
- Recebe: CPF, renda, valor solicitado
- Regra simples: aprovado se valor <= 5x a renda
- Score de crédito simulado baseado na renda
- Resposta com: aprovado/negado, valor máximo, taxa sugerida
- Incluir: validações, logging, testes, documentação

Estrutura esperada:
1. Modelo de dados para simulação
2. Lógica de negócio
3. Endpoint na API
4. Testes automatizados
5. Documentação da feature
```

**Demonstrar:**
1. Ativar Agent Mode
2. Executar o prompt
3. Mostrar como o agente planeja
4. Acompanhar execução
5. Revisar arquivos criados

### 🧪 Testes Automatizados (10min)

**Prompt reutilizável:**
```
Para toda nova rota que criar, gere também:
- Testes unitários com pytest
- Testes de integração com requests
- Cenários de sucesso e erro
- Mock de dependências externas
```

**Demonstrar:**
- Como configurar prompt reutilizável
- Executar testes gerados
- Mostrar cobertura de código

---

## 4. Colaboração e Revisão (40min)

### � Demonstração Visual Completa (20min)

**1. Interface Swagger:**
- Abrir http://localhost:8000/docs
- Demonstrar endpoints interativos
- Testar cadastro de cliente via interface
- Mostrar documentação automática

**2. Dashboard Web:**
- Abrir interface HTML
- Cadastrar cliente via formulário
- Criar conta e simular transações
- Mostrar dashboard com métricas atualizadas

**3. Postman Testing:**
- Importar collection gerada
- Executar testes automatizados
- Mostrar relatórios de teste
- Demonstrar variáveis de ambiente

### �🌿 Workflow com Branches (15min)

**Comandos a demonstrar:**
```bash
git checkout -b feature/frontend-dashboard
git add .
git commit -m "feat: adiciona dashboard web e collection Postman"
git push origin feature/frontend-dashboard
```

### 📝 Pull Request com Copilot (5min)

**Code Review focado em full-stack:**
```
@copilot review this PR focando em:
- Segurança de CORS e validações
- Usabilidade da interface
- Qualidade da documentação Swagger
- Completude da collection Postman
```

**2. Code Review com Copilot:**
- Usar "@copilot review this PR"
- Mostrar sugestões de melhorias
- Aplicar sugestões inline

**Exemplo de review esperado:**
```
🔍 Copilot Review:
- Considere adicionar rate limiting no endpoint
- Validação de CPF pode usar biblioteca específica
- Logging deve incluir ID da transação
- Testes cobrem 85% - adicionar caso de erro 500
```

### 🏢 Spaces para Organização (5min)

**Demonstrar:**
1. Criar Space "API Bancária Demo"
2. Adicionar contexto relevante
3. Mostrar como mantém contexto entre sessões

---

## 5. Integração com o Ecossistema GitHub (50min)

### 🔌 MCP Server - Docs Bancárias (25min)

**Cenário:** Simular conexão com documentação de compliance

**Setup do MCP (demonstração conceitual):**
```json
{
  "name": "docs-bancarias",
  "type": "filesystem",
  "path": "./docs-compliance"
}
```

**Criar docs simuladas:**
- Regras de KYC (Know Your Customer)
- Políticas de PLD (Prevenção à Lavagem de Dinheiro)
- Limites transacionais

**Prompt com MCP:**
```
@mcp Consulte as regras de compliance para criar validação de KYC na nossa API de cadastro de clientes
```

### 🤖 Copilot Agents no Repositório (25min)

**Agent para Frontend:**
```
@agent Analise nosso dashboard e crie melhorias de UX:
- Adicione loading states nos formulários
- Implemente feedback visual para ações
- Crie componentes reutilizáveis
- Adicione validação client-side
- Melhore a responsividade mobile
```

**Agent para Testes E2E:**
```
@agent Crie testes end-to-end que cubram:
- Fluxo completo: cadastro → conta → transação
- Testes do dashboard web
- Validação de formulários
- Testes de responsividade
- Cenários de erro na interface
```

**Demonstrar:**
1. Execução dos agents
2. Revisão das sugestões
3. Aplicação das melhorias

---

## 6. Encerramento e Q&A (30min)

### 📊 Resumo do que Vimos

#### Funcionalidades Demonstradas:
- ✅ Autocomplete inteligente
- ✅ Chat Mode para dúvidas e geração
- ✅ Edit & Ask Mode para refatoração
- ✅ Agent Mode para tarefas completas
- ✅ Code Review automático
- ✅ PR Summary
- ✅ Spaces para contexto
- ✅ MCP para fontes externas

#### Aplicação Criada:
- ✅ **API bancária completa** com FastAPI
- ✅ **Documentação Swagger** interativa e bem detalhada
- ✅ **Dashboard web** responsivo com formulários
- ✅ **Collection Postman** para testes automatizados
- ✅ **Interface visual** para demonstrações
- ✅ **Testes end-to-end** cobrindo fluxos completos

#### Demonstrações Visuais Disponíveis:
1. **Swagger UI**: http://localhost:8000/docs
2. **Dashboard Web**: ./frontend/index.html
3. **Postman Tests**: Collection importável
4. **ReDoc**: http://localhost:8000/redoc (documentação alternativa)

### 🏦 Boas Práticas para Bancos

#### Segurança:
- Sempre validar entradas
- Usar logging estruturado
- Implementar rate limiting
- Sanitizar dados sensíveis

#### Governança:
- Custom Instructions padronizadas
- Prompts reutilizáveis para o time
- Reviews automáticos obrigatórios
- Templates de PR consistentes

#### Produtividade:
- Agents para tarefas repetitivas
- Spaces organizados por projeto
- MCP para docs internas
- Testes gerados automaticamente

### 🎤 Q&A Interativo com Demonstrações (20min)

**Formato:** Devs pedem ao vivo e testamos visualmente

**Exemplos práticos:**
- "Adicione validação de CNPJ no formulário"
- "Crie gráfico de transações por dia"
- "Adicione dark mode no dashboard"
- "Gere relatório PDF das transações"

**Ferramentas disponíveis para teste:**
- ✅ Interface Swagger para testes de API
- ✅ Dashboard web para fluxos visuais
- ✅ Postman para testes automatizados
- ✅ Logs em tempo real no terminal

---

## 📝 Prompts Reutilizáveis Prontos

### Para Desenvolvimento:
```
Como desenvolvedor bancário, sempre:
- Implemente logging estruturado
- Use validações de CPF/CNPJ
- Adicione tratamento de erro completo
- Crie testes unitários junto
- Documente endpoints na spec OpenAPI
```

### Para Code Review:
```
@copilot Revise este código focando em:
- Segurança bancária (validações, sanitização)
- Performance (queries N+1, cache)
- Maintibilidade (naming, estrutura)
- Testes (cobertura, cenários)
```

### Para Documentação:
```
@agent Gere documentação técnica para este módulo incluindo:
- Propósito e responsabilidades
- Interfaces públicas
- Exemplos de uso
- Considerações de segurança
- Como testar
```

### Para Testes:
```
Para esta função/endpoint, crie:
- Testes de unidade (casos felizes e tristes)
- Mocks de dependências externas
- Validação de inputs inválidos
- Testes de performance básicos
```

---

## 🎬 Dicas de Apresentação

### Show, Don't Tell
- **80% prática, 20% teoria**
- Executar código ao vivo sempre que possível
- Deixar o Copilot "falhar" às vezes para mostrar limitações
- Envolver a audiência com perguntas

### Ritmo
- Começar devagar, acelerar gradualmente
- Pausas para perguntas a cada módulo
- Dar tempo para absorver cada conceito

### Engajamento
- Usar exemplos que ressoem com devs bancários
- Conectar cada feature com problemas reais
- Mostrar impacto na produtividade

### Backup Plans
- Ter código pré-pronto caso algo falhe
- Screenshots das telas principais
- Lista de prompts alternativos

---

## ✅ Checklist Final

### Antes da Demo:
- [ ] VS Code com Copilot configurado
- [ ] Repositório limpo para começar
- [ ] Custom Instructions configuradas
- [ ] Docs de compliance simuladas
- [ ] Conexão estável com internet

### Durante a Demo:
- [ ] Compartilhar tela em resolução adequada
- [ ] Falar alto e claro
- [ ] Explicar cada ação antes de executar
- [ ] Pausar para perguntas regularmente

### Após a Demo:
- [ ] Disponibilizar código criado
- [ ] Compartilhar prompts reutilizáveis
- [ ] Enviar links para documentação
- [ ] Agendar follow-up se necessário

---

## 📱 Interfaces de Demonstração

### 1. Swagger UI (Principal)
```
🏦 API de Demonstração Bancária v1.0.0
├── 👥 Gestão de Clientes
│   ├── POST /clientes (Criar cliente)
│   ├── GET /clientes (Listar clientes)
│   └── GET /clientes/{cpf} (Buscar cliente)
├── 💰 Operações de Conta  
│   ├── POST /contas (Criar conta)
│   ├── GET /contas/{numero}/saldo (Consultar saldo)
│   └── GET /contas/cliente/{cpf} (Contas por cliente)
├── 💸 Transações
│   ├── POST /transacoes (Nova transação)
│   ├── POST /transferencias (Transferência)
│   └── GET /transacoes/conta/{numero} (Histórico)
└── 📊 Serviços de Crédito
    ├── POST /simular-credito (Simular crédito)
    └── GET /simulacoes/{cpf} (Histórico simulações)
```

### 2. Dashboard Web
```html
┌─────────────────────────────────────────┐
│ 🏦 Banking Demo Dashboard               │
├─────────────────┬───────────────────────┤
│ 📊 Métricas     │ 👤 Novo Cliente       │
│ Clientes: 150   │ Nome: [____________]  │
│ Contas: 320     │ CPF:  [___________]   │
│ Saldo Total:    │ Email:[____________]  │
│ R$ 2.5M        │ Renda:[____________]  │
│                 │ [Cadastrar]           │
├─────────────────┼───────────────────────┤
│ 📈 Gráfico      │ 💸 Nova Transação     │
│ Transações/Dia  │ De:   [Conta______]   │
│     ██████      │ Para: [Conta______]   │
│   ████████      │ Valor:[___________]   │
│ ██████████      │ [Transferir]          │
└─────────────────┴───────────────────────┘
```

### 3. Collection Postman
```
API_Demonstracao_Bancaria.postman_collection.json
├── 🔐 Autenticação
├── 👥 Gestão de Clientes (5 requests)
├── 💰 Operações de Conta (4 requests)
├── 💸 Transações (6 requests)
├── 📊 Serviços de Crédito (3 requests)
└── 🧪 Cenários de Teste (10 testes automatizados)
```

---

*Este script foi criado com GitHub Copilot para maximizar a eficiência da demonstração! 🚀*