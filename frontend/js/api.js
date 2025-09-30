/**
 * Cliente da API para comunicação com o backend
 */

class BankingAPI {
    constructor() {
        this.baseURL = 'http://localhost:3000';
        this.timeout = 10000; // 10 segundos
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            console.log(`API Request: ${config.method || 'GET'} ${url}`);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            console.log(`API Response: ${response.status}`, data);
            return data;
            
        } catch (error) {
            console.error(`API Error: ${config.method || 'GET'} ${url}`, error);
            
            if (error.name === 'AbortError') {
                throw new Error('Tempo limite de requisição excedido');
            }
            
            if (error.message?.includes('fetch')) {
                throw new Error('Erro de conexão com o servidor');
            }
            
            throw error;
        }
    }

    // Health Check
    async healthCheck() {
        return await this.request('/health');
    }

    // === CLIENTES ===
    
    // Criar cliente
    async createClient(clientData) {
        return await this.request('/api/clientes', {
            method: 'POST',
            body: JSON.stringify(clientData)
        });
    }

    // Listar todos os clientes
    async getClients() {
        return await this.request('/api/clientes');
    }

    // Buscar cliente por CPF
    async getClientByCPF(cpf) {
        const cleanCpf = cpf.replace(/\D/g, '');
        return await this.request(`/api/clientes/${cleanCpf}`);
    }

    // Atualizar cliente
    async updateClient(cpf, clientData) {
        const cleanCpf = cpf.replace(/\D/g, '');
        return await this.request(`/api/clientes/${cleanCpf}`, {
            method: 'PUT',
            body: JSON.stringify(clientData)
        });
    }

    // === CONTAS ===
    
    // Criar conta
    async createAccount(accountData) {
        return await this.request('/api/contas', {
            method: 'POST',
            body: JSON.stringify(accountData)
        });
    }

    // Listar todas as contas
    async getAccounts() {
        return await this.request('/api/contas');
    }

    // Buscar conta por número
    async getAccountByNumber(accountNumber) {
        return await this.request(`/api/contas/numero/${accountNumber}`);
    }

    // Consultar saldo
    async getAccountBalance(accountNumber) {
        return await this.request(`/api/contas/saldo/${accountNumber}`);
    }

    // Listar contas por cliente
    async getAccountsByClient(cpf) {
        const cleanCpf = cpf.replace(/\D/g, '');
        return await this.request(`/api/contas/cliente/${cleanCpf}`);
    }

    // Obter estatísticas das contas
    async getAccountStats() {
        return await this.request('/api/contas/stats');
    }

    // Realizar depósito
    async deposit(accountNumber, amount) {
        return await this.request(`/api/contas/${accountNumber}/deposito`, {
            method: 'POST',
            body: JSON.stringify({ valor: amount })
        });
    }

    // Realizar saque
    async withdraw(accountNumber, amount) {
        return await this.request(`/api/contas/${accountNumber}/saque`, {
            method: 'POST',
            body: JSON.stringify({ valor: amount })
        });
    }

    // Realizar transferência
    async transfer(fromAccount, toAccount, amount) {
        return await this.request('/api/contas/transferencia', {
            method: 'POST',
            body: JSON.stringify({
                conta_origem: fromAccount,
                conta_destino: toAccount,
                valor: amount
            })
        });
    }
}

// Instanciar o cliente da API
const api = new BankingAPI();

// Verificar conexão com a API
async function checkAPIConnection() {
    const statusIndicator = document.getElementById('apiStatus');
    const statusElement = statusIndicator?.querySelector('.status-indicator');
    const statusText = statusIndicator?.querySelector('.status-text');
    
    if (!statusIndicator) return;
    
    try {
        const response = await api.healthCheck();
        
        if (response.success) {
            statusElement.className = 'status-indicator healthy';
            statusText.textContent = 'API Conectada';
        } else {
            throw new Error('Health check failed');
        }
    } catch (error) {
        statusElement.className = 'status-indicator error';
        statusText.textContent = 'API Desconectada';
        console.error('API connection failed:', error);
    }
}

// Função para lidar com erros da API
function handleAPIError(error, context = '') {
    const errorPrefix = context ? `API Error (${context})` : 'API Error';
    console.error(`${errorPrefix}:`, error);
    
    let message = 'Erro inesperado';
    
    if (error.message?.includes('Tempo limite')) {
        message = 'Tempo limite de conexão excedido';
    } else if (error.message?.includes('conexão')) {
        message = 'Erro de conexão com o servidor';
    } else if (error.message?.includes('HTTP 404')) {
        message = 'Recurso não encontrado';
    } else if (error.message?.includes('HTTP 400')) {
        message = 'Dados inválidos';
    } else if (error.message?.includes('HTTP 500')) {
        message = 'Erro interno do servidor';
    } else if (error.message) {
        message = error.message;
    }
    
    showToast(message, 'error');
    return message;
}

// Função para mostrar loading
function showLoading(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) {
            overlay.classList.add('show');
        } else {
            overlay.classList.remove('show');
        }
    }
}

// Cache simples para dados da API
class APICache {
    constructor() {
        this.cache = new Map();
        this.ttl = 5 * 60 * 1000; // 5 minutos
    }
    
    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    clear() {
        this.cache.clear();
    }
    
    delete(key) {
        this.cache.delete(key);
    }
}

const apiCache = new APICache();

// Funções auxiliares para cache
async function getCachedClients() {
    const cached = apiCache.get('clients');
    if (cached) return cached;
    
    const response = await api.getClients();
    apiCache.set('clients', response);
    return response;
}

async function getCachedAccounts() {
    const cached = apiCache.get('accounts');
    if (cached) return cached;
    
    const response = await api.getAccounts();
    apiCache.set('accounts', response);
    return response;
}

// Invalidar cache quando dados são alterados
function invalidateCache(keys = []) {
    if (keys.length === 0) {
        apiCache.clear();
    } else {
        keys.forEach(key => apiCache.delete(key));
    }
}

// Exportar para uso global
window.api = api;
window.checkAPIConnection = checkAPIConnection;
window.handleAPIError = handleAPIError;
window.showLoading = showLoading;
window.getCachedClients = getCachedClients;
window.getCachedAccounts = getCachedAccounts;
window.invalidateCache = invalidateCache;