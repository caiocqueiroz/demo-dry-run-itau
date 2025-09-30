# Banking Frontend Dashboard - Itaú

![Banking Dashboard](https://img.shields.io/badge/Status-Completed-success)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)

## 🎯 Visão Geral

Interface frontend profissional para o sistema bancário, oferecendo uma experiência completa de gerenciamento bancário com design responsivo e funcionalidades modernas.

## ✨ Funcionalidades

### 📊 Dashboard Analítico
- **Métricas em Tempo Real**: Total de clientes, contas e saldo
- **Gráficos Interativos**: Distribuição de tipos de conta e crescimento de clientes
- **Visualização de Dados**: Charts responsivos com Chart.js

### 👥 Gestão de Clientes
- **Cadastro Completo**: Nome, CPF, data de nascimento, email e telefone
- **Validação Brasileira**: Algoritmo completo de validação de CPF
- **Formatação Automática**: Máscaras para CPF e telefone
- **Listagem Dinâmica**: Tabela responsiva com ações

### 💳 Gerenciamento de Contas
- **Criação de Contas**: Conta Corrente e Conta Poupança
- **Saldo Inicial**: Configuração de saldo na criação
- **Visualização Completa**: Informações detalhadas das contas
- **Integração com Clientes**: Vinculação automática

### 💰 Consulta de Saldo
- **Busca por Número**: Consulta rápida por número da conta
- **Informações Detalhadas**: Dados completos da conta e cliente
- **Interface Intuitiva**: Resultado visual claro

## 🛠️ Tecnologias Utilizadas

### Frontend Stack
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Grid, Flexbox e variáveis CSS customizadas
- **JavaScript ES6+**: Programação moderna e modular
- **Chart.js**: Biblioteca de gráficos interativos

### Funcionalidades Técnicas
- **Fetch API**: Comunicação HTTP com backend
- **LocalStorage**: Persistência de configurações
- **CSS Grid/Flexbox**: Layout responsivo
- **Temas**: Modo claro e escuro
- **PWA Ready**: Estrutura preparada para Progressive Web App

## 🎨 Design System

### Paleta de Cores
- **Primária**: `#ff6600` (Laranja Itaú)
- **Secundária**: `#0066cc` (Azul)
- **Sucesso**: `#28a745` (Verde)
- **Erro**: `#dc3545` (Vermelho)
- **Aviso**: `#ffc107` (Amarelo)

### Tipografia
- **Fonte**: Sistema nativo (SF Pro, Segoe UI, Roboto)
- **Escalas**: 0.875rem a 1.5rem
- **Pesos**: 400, 500, 600, 700

## 📁 Estrutura do Projeto

```
frontend/
├── index.html              # Página principal
├── css/
│   ├── main.css           # Estilos principais
│   ├── components.css     # Componentes reutilizáveis
│   ├── forms.css          # Formulários
│   └── themes.css         # Temas claro/escuro
├── js/
│   ├── app.js             # Aplicação principal
│   ├── api.js             # Cliente da API
│   ├── components.js      # Componentes UI
│   ├── validation.js      # Validações brasileiras
│   ├── charts.js          # Sistema de gráficos
│   └── utils.js           # Utilitários
├── assets/
│   ├── icons/             # Ícones
│   └── images/            # Imagens
└── pages/
    ├── clients.html       # Página de clientes
    ├── accounts.html      # Página de contas
    └── dashboard.html     # Página de analytics
```

## 🚀 Como Executar

### Pré-requisitos
- Servidor HTTP (Python, Node.js ou Apache)
- API Backend rodando em `localhost:3000`

### Instalação

1. **Clone o repositório**:
   ```bash
   git clone <repository-url>
   cd banking-api/frontend
   ```

2. **Inicie um servidor HTTP**:
   ```bash
   # Opção 1: Python
   python3 -m http.server 8080
   
   # Opção 2: Node.js (npx)
   npx serve -p 8080
   
   # Opção 3: PHP
   php -S localhost:8080
   ```

3. **Acesse o dashboard**:
   ```
   http://localhost:8080
   ```

## 🔌 Integração com API

### Endpoints Utilizados
```javascript
// Clientes
POST /api/clientes          // Criar cliente
GET  /api/clientes          // Listar clientes
GET  /api/clientes/:cpf     // Buscar por CPF

// Contas
POST /api/contas            // Criar conta
GET  /api/contas            // Listar contas
GET  /api/contas/numero/:numero  // Buscar por número
GET  /api/contas/saldo/:numero   // Consultar saldo
GET  /api/contas/cliente/:cpf    // Contas por cliente
```

### Configuração da API
```javascript
// Em js/api.js
const api = new BankingAPI();
api.baseURL = 'http://localhost:3000'; // URL da API
```

## 📱 Responsividade

### Breakpoints
- **Desktop**: > 768px
- **Tablet**: 768px - 480px
- **Mobile**: < 480px

### Adaptações
- Menu lateral colapsível
- Tabelas com scroll horizontal
- Formulários em coluna única
- Gráficos responsivos

## 🎯 Funcionalidades Avançadas

### Validação Brasileira
- **CPF**: Algoritmo completo com dígitos verificadores
- **Telefone**: Formatos DDD + número (10/11 dígitos)
- **Email**: Validação RFC compliant
- **Data**: Validação de idade (18-150 anos)

### Sistema de Notificações
- **Toast Messages**: Feedback visual para ações
- **Tipos**: Sucesso, erro, aviso, informação
- **Auto-dismiss**: Remoção automática após 5s

### Cache Inteligente
- **LocalStorage**: Persistência de configurações
- **Memory Cache**: Cache de dados da API (5min TTL)
- **Invalidação**: Limpeza automática após mudanças

## 🔐 Segurança

### Medidas Implementadas
- **Sanitização**: Escape de HTML em dados dinâmicos
- **Validação**: Client-side e server-side
- **HTTPS Ready**: Preparado para SSL
- **CSP**: Content Security Policy headers

## 🎨 Temas

### Modo Claro
- Fundo branco com texto escuro
- Sombras suaves
- Contraste otimizado

### Mode Escuro
- Fundo escuro com texto claro
- Cores ajustadas para baixa luminosidade
- Transições suaves

## 📊 Métricas e Analytics

### Dashboard Metrics
- Total de clientes cadastrados
- Total de contas ativas
- Saldo total do sistema
- Distribuição por tipo de conta

### Gráficos Disponíveis
1. **Pizza**: Tipos de conta (Corrente vs Poupança)
2. **Linha**: Crescimento de clientes (últimos 6 meses)
3. **Barras**: Distribuição de saldos por faixa

## 🔧 Customização

### Variáveis CSS
```css
:root {
    --primary-color: #ff6600;
    --sidebar-width: 280px;
    --header-height: 80px;
    --border-radius: 8px;
    /* ... mais variáveis */
}
```

### Configurações JavaScript
```javascript
// Timeout da API
api.timeout = 10000; // 10 segundos

// Cache TTL
apiCache.ttl = 5 * 60 * 1000; // 5 minutos
```

## 🐛 Solução de Problemas

### API Não Conecta
1. Verifique se a API está rodando em `localhost:3000`
2. Confirme se não há erros de CORS
3. Verifique o console do navegador

### Gráficos Não Aparecem
1. Confirme se Chart.js está carregado
2. Verifique se há dados suficientes
3. Confirme a estrutura dos dados da API

### Formulários Não Validam
1. Verifique se o JavaScript está carregado
2. Confirme se os IDs dos inputs estão corretos
3. Veja o console para erros

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Transações (Depósito/Saque/Transferência)
- [ ] Relatórios em PDF
- [ ] Notificações Push
- [ ] Modo Offline (PWA)
- [ ] Dashboard Customizável
- [ ] Exportação de Dados
- [ ] Chat de Suporte

### Melhorias Técnicas
- [ ] Unit Tests (Jest)
- [ ] E2E Tests (Playwright)
- [ ] Bundle Optimization
- [ ] Service Worker
- [ ] Performance Monitoring

## 🤝 Contribuição

### Como Contribuir
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Código
- Use ESLint para JavaScript
- Siga BEM para CSS
- Documente funções complexas
- Mantenha responsividade

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Desenvolvido por

**Equipe de Desenvolvimento Itaú**
- Frontend: HTML5, CSS3, JavaScript ES6+
- Design: Sistema de Design Bancário
- UX/UI: Interface Profissional e Responsiva

---

🏦 **Banking Dashboard** - Interface moderna para gestão bancária completa