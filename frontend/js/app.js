/**
 * Aplicação principal do Banking Dashboard
 */

class BankingApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    // Inicializar aplicação
    async init() {
        this.setupTheme();
        this.setupEventListeners();
        this.setupFormValidation();
        
        // Verificar conexão com API
        await checkAPIConnection();
        
        // Carregar dados iniciais
        await this.loadInitialData();
        
        // Aplicar máscaras nos inputs
        Validation.applyInputMasks();
        
        console.log('Banking App initialized successfully');
    }

    // Configurar tema
    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Navegação do sidebar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.navigateToSection(section);
            });
        });

        // Toggle do tema
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Formulário de cliente
        const clientForm = document.getElementById('clientForm');
        if (clientForm) {
            clientForm.addEventListener('submit', (e) => this.handleClientSubmit(e));
        }

        // Formulário de conta
        const accountForm = document.getElementById('accountForm');
        if (accountForm) {
            accountForm.addEventListener('submit', (e) => this.handleAccountSubmit(e));
        }

        // Botões de ação
        this.setupActionButtons();

        // Consulta de saldo
        const checkBalanceBtn = document.getElementById('checkBalanceBtn');
        if (checkBalanceBtn) {
            checkBalanceBtn.addEventListener('click', () => this.handleBalanceCheck());
        }

        // Input de número da conta para consulta
        const balanceInput = document.getElementById('balanceAccountNumber');
        if (balanceInput) {
            balanceInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleBalanceCheck();
                }
            });
        }
    }

    // Configurar botões de ação
    setupActionButtons() {
        // Botão de adicionar cliente
        const addClientBtn = document.getElementById('addClientBtn');
        if (addClientBtn) {
            addClientBtn.addEventListener('click', () => this.toggleClientForm(true));
        }

        // Botão de cancelar cliente
        const cancelClientBtn = document.getElementById('cancelClientBtn');
        if (cancelClientBtn) {
            cancelClientBtn.addEventListener('click', () => this.toggleClientForm(false));
        }

        // Botão de adicionar conta
        const addAccountBtn = document.getElementById('addAccountBtn');
        if (addAccountBtn) {
            addAccountBtn.addEventListener('click', () => this.toggleAccountForm(true));
        }

        // Botão de cancelar conta
        const cancelAccountBtn = document.getElementById('cancelAccountBtn');
        if (cancelAccountBtn) {
            cancelAccountBtn.addEventListener('click', () => this.toggleAccountForm(false));
        }
    }

    // Configurar validação de formulários
    setupFormValidation() {
        // Validação em tempo real para CPF
        document.querySelectorAll('input[id*="cpf"], input[id*="Cpf"]').forEach(input => {
            input.addEventListener('blur', () => {
                Validation.applyValidation(input, Validation.validateCPF);
            });
        });

        // Validação em tempo real para email
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value) {
                    Validation.applyValidation(input, Validation.validateEmail);
                }
            });
        });

        // Validação em tempo real para telefone
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value) {
                    Validation.applyValidation(input, Validation.validatePhone);
                }
            });
        });

        // Validação em tempo real para nome
        document.querySelectorAll('input[id*="name"], input[id*="Name"], input[id*="nome"]').forEach(input => {
            input.addEventListener('blur', () => {
                Validation.applyValidation(input, Validation.validateName);
            });
        });

        // Validação em tempo real para data de nascimento
        document.querySelectorAll('input[type="date"]').forEach(input => {
            input.addEventListener('change', () => {
                Validation.applyValidation(input, Validation.validateBirthDate);
            });
        });
    }

    // Navegar para seção
    navigateToSection(section) {
        // Remover classe active de todas as seções
        document.querySelectorAll('.content-section').forEach(s => {
            s.classList.remove('active');
        });

        // Remover classe active de todos os links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Ativar seção atual
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Ativar link correspondente
            const activeLink = document.querySelector(`[href="#${section}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Atualizar título da página
            this.updatePageTitle(section);

            // Carregar dados específicos da seção
            this.loadSectionData(section);

            this.currentSection = section;
        }
    }

    // Atualizar título da página
    updatePageTitle(section) {
        const titles = {
            dashboard: 'Dashboard Bancário',
            clients: 'Gerenciar Clientes',
            accounts: 'Gerenciar Contas',
            balance: 'Consultar Saldo'
        };

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = titles[section] || 'Banking Dashboard';
        }
    }

    // Carregar dados específicos da seção
    async loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'clients':
                await this.loadClientsData();
                break;
            case 'accounts':
                await this.loadAccountsData();
                break;
            case 'balance':
                // Não precisa carregar dados específicos
                break;
        }
    }

    // Carregar dados iniciais
    async loadInitialData() {
        await this.loadDashboardData();
    }

    // Carregar dados do dashboard
    async loadDashboardData() {
        try {
            showLoading(true);
            
            const [clientsResponse, accountsResponse, statsResponse] = await Promise.all([
                getCachedClients().catch(() => ({ data: [] })),
                getCachedAccounts().catch(() => ({ data: [] })),
                api.getAccountStats().catch(() => ({ data: {} }))
            ]);

            const clients = clientsResponse.data || [];
            const accounts = accountsResponse.data || [];
            const stats = statsResponse.data || {};

            // Atualizar métricas
            this.updateMetrics(clients, accounts, stats);

            // Criar gráficos
            await createDashboardCharts();

        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            showToast('Erro ao carregar dados do dashboard', 'error');
        } finally {
            showLoading(false);
        }
    }

    // Atualizar métricas do dashboard
    updateMetrics(clients, accounts, stats) {
        // Total de clientes
        const totalClientsEl = document.getElementById('totalClients');
        if (totalClientsEl) {
            totalClientsEl.textContent = clients.length;
        }

        // Total de contas
        const totalAccountsEl = document.getElementById('totalAccounts');
        if (totalAccountsEl) {
            totalAccountsEl.textContent = accounts.length;
        }

        // Saldo total
        const totalBalanceEl = document.getElementById('totalBalance');
        if (totalBalanceEl) {
            const totalBalance = accounts.reduce((sum, account) => sum + (parseFloat(account.saldo) || 0), 0);
            totalBalanceEl.textContent = Utils.formatCurrency(totalBalance);
        }
    }

    // Carregar dados dos clientes
    async loadClientsData() {
        try {
            showLoading(true);
            const response = await getCachedClients();
            const clients = response.data || [];
            renderClientsTable(clients);
        } catch (error) {
            handleAPIError(error, 'carregar clientes');
        } finally {
            showLoading(false);
        }
    }

    // Carregar dados das contas
    async loadAccountsData() {
        try {
            showLoading(true);
            
            const [accountsResponse, clientsResponse] = await Promise.all([
                getCachedAccounts(),
                getCachedClients()
            ]);
            
            const accounts = accountsResponse.data || [];
            const clients = clientsResponse.data || [];
            
            renderAccountsTable(accounts);
            populateClientSelect(clients, 'accountClientCpf');
            
        } catch (error) {
            handleAPIError(error, 'carregar contas');
        } finally {
            showLoading(false);
        }
    }

    // Toggle do tema
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.theme);
        this.setupTheme();
        
        // Atualizar gráficos com novo tema
        setTimeout(() => {
            bankingCharts.updateTheme();
        }, 300);
    }

    // Toggle do formulário de cliente
    toggleClientForm(show) {
        const form = document.getElementById('clientForm');
        if (!form) return;

        if (show) {
            form.style.display = 'block';
            form.reset();
            // Limpar validações
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('has-error', 'has-success');
            });
            form.querySelectorAll('.validation-message').forEach(msg => {
                msg.textContent = '';
                msg.className = 'validation-message';
            });
        } else {
            form.style.display = 'none';
        }
    }

    // Toggle do formulário de conta
    toggleAccountForm(show) {
        const form = document.getElementById('accountForm');
        if (!form) return;

        if (show) {
            form.style.display = 'block';
            form.reset();
            // Limpar validações
            form.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('has-error', 'has-success');
            });
            // Carregar clientes no select
            this.loadClientsForAccountForm();
        } else {
            form.style.display = 'none';
        }
    }

    // Carregar clientes no formulário de conta
    async loadClientsForAccountForm() {
        try {
            const response = await getCachedClients();
            const clients = response.data || [];
            populateClientSelect(clients, 'accountClientCpf');
        } catch (error) {
            console.error('Erro ao carregar clientes para o formulário:', error);
        }
    }

    // Manipular submissão do formulário de cliente
    async handleClientSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        
        // Validar formulário
        if (!Validation.validateForm(form)) {
            showToast('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        const formData = new FormData(form);
        const clientData = {
            nome: formData.get('nome') || document.getElementById('clientName').value,
            cpf: Utils.cleanCPF(document.getElementById('clientCpf').value),
            data_nascimento: document.getElementById('clientBirthDate').value,
            email: document.getElementById('clientEmail').value || undefined,
            telefone: Utils.cleanPhone(document.getElementById('clientPhone').value) || undefined
        };

        try {
            showLoading(true);
            
            const response = await api.createClient(clientData);
            
            showToast('Cliente cadastrado com sucesso!', 'success');
            this.toggleClientForm(false);
            
            // Invalidar cache e recarregar dados
            invalidateCache(['clients']);
            await this.loadClientsData();
            
            // Atualizar dashboard se estiver na seção atual
            if (this.currentSection === 'dashboard') {
                await this.loadDashboardData();
            }
            
        } catch (error) {
            handleAPIError(error, 'cadastrar cliente');
        } finally {
            showLoading(false);
        }
    }

    // Manipular submissão do formulário de conta
    async handleAccountSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        
        // Validar formulário
        if (!Validation.validateForm(form)) {
            showToast('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        const accountData = {
            cpf_cliente: document.getElementById('accountClientCpf').value,
            tipo_conta: document.getElementById('accountType').value,
            saldo_inicial: parseFloat(document.getElementById('initialBalance').value) || 0
        };

        try {
            showLoading(true);
            
            const response = await api.createAccount(accountData);
            
            showToast('Conta criada com sucesso!', 'success');
            this.toggleAccountForm(false);
            
            // Invalidar cache e recarregar dados
            invalidateCache(['accounts']);
            await this.loadAccountsData();
            
            // Atualizar dashboard se estiver na seção atual
            if (this.currentSection === 'dashboard') {
                await this.loadDashboardData();
            }
            
        } catch (error) {
            handleAPIError(error, 'criar conta');
        } finally {
            showLoading(false);
        }
    }

    // Manipular consulta de saldo
    async handleBalanceCheck() {
        const input = document.getElementById('balanceAccountNumber');
        const resultDiv = document.getElementById('balanceResult');
        
        if (!input || !resultDiv) return;
        
        const accountNumber = input.value.trim();
        
        if (!accountNumber) {
            showToast('Digite o número da conta', 'warning');
            input.focus();
            return;
        }
        
        // Validar número da conta
        const validation = Validation.validateAccountNumber(accountNumber);
        if (!validation.valid) {
            showToast(validation.message, 'error');
            input.focus();
            return;
        }

        try {
            showLoading(true);
            
            const response = await api.getAccountByNumber(accountNumber);
            const account = response.data;
            
            // Exibir resultado
            document.getElementById('resultAccountNumber').textContent = account.numero_conta;
            document.getElementById('resultClientName').textContent = Utils.capitalize(account.nome_cliente || 'N/A');
            document.getElementById('resultAccountType').textContent = formatAccountType(account.tipo_conta);
            document.getElementById('resultBalance').textContent = Utils.formatCurrency(account.saldo);
            
            resultDiv.style.display = 'block';
            
            showToast('Saldo consultado com sucesso!', 'success');
            
        } catch (error) {
            resultDiv.style.display = 'none';
            handleAPIError(error, 'consultar saldo');
        } finally {
            showLoading(false);
        }
    }
}

// Função global para verificar saldo (usada pelos botões da tabela)
async function checkBalance(accountNumber) {
    const balanceInput = document.getElementById('balanceAccountNumber');
    if (balanceInput) {
        balanceInput.value = accountNumber;
    }
    
    // Navegar para a seção de saldo se não estiver lá
    if (app.currentSection !== 'balance') {
        app.navigateToSection('balance');
        // Aguardar um momento para a seção carregar
        setTimeout(() => {
            app.handleBalanceCheck();
        }, 100);
    } else {
        app.handleBalanceCheck();
    }
}

// Inicializar aplicação quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BankingApp();
});

// Exportar para uso global
window.checkBalance = checkBalance;