/**
 * Componentes da interface do usuário
 */

// Sistema de Toast (notificações)
function showToast(message, type = 'info', duration = 5000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <i class="toast-icon ${icon}"></i>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto-remover após o tempo especificado
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Tabela de clientes
function renderClientsTable(clients) {
    const tbody = document.getElementById('clientsTableBody');
    if (!tbody) return;
    
    if (!clients || clients.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="6">Nenhum cliente cadastrado</td></tr>';
        return;
    }
    
    tbody.innerHTML = clients.map(client => `
        <tr>
            <td>${Utils.capitalize(client.nome)}</td>
            <td>${Utils.formatCPF(client.cpf)}</td>
            <td>${Utils.formatDate(client.data_nascimento)}</td>
            <td>${client.email || '-'}</td>
            <td>${Utils.formatPhone(client.telefone) || '-'}</td>
            <td class="actions">
                <button class="btn btn-sm btn-secondary" onclick="editClient('${client.cpf}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="viewClientAccounts('${client.cpf}')" title="Ver Contas">
                    <i class="fas fa-credit-card"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Tabela de contas
function renderAccountsTable(accounts) {
    const tbody = document.getElementById('accountsTableBody');
    if (!tbody) return;
    
    if (!accounts || accounts.length === 0) {
        tbody.innerHTML = '<tr class="no-data"><td colspan="7">Nenhuma conta cadastrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = accounts.map(account => `
        <tr>
            <td><strong>${account.numero_conta}</strong></td>
            <td>${Utils.capitalize(account.nome_cliente || '-')}</td>
            <td>${Utils.formatCPF(account.cpf_cliente)}</td>
            <td>
                <span class="account-type-${account.tipo_conta}">
                    ${account.tipo_conta === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}
                </span>
            </td>
            <td><strong>${Utils.formatCurrency(account.saldo)}</strong></td>
            <td>${Utils.formatDate(account.data_criacao)}</td>
            <td class="actions">
                <button class="btn btn-sm btn-success" onclick="checkBalance('${account.numero_conta}')" title="Ver Saldo">
                    <i class="fas fa-search"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="copyAccountNumber('${account.numero_conta}')" title="Copiar Número">
                    <i class="fas fa-copy"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Popular select de clientes
function populateClientSelect(clients, selectId) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione um cliente</option>';
    
    if (clients && clients.length > 0) {
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.cpf;
            option.textContent = `${Utils.formatCPF(client.cpf)} - ${Utils.capitalize(client.nome)}`;
            select.appendChild(option);
        });
    }
}

// Modal genérico
function createModal(title, content, actions = []) {
    // Remove modal existente
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    const actionButtons = actions.map(action => 
        `<button class="btn ${action.class}" onclick="${action.onclick}">${action.text}</button>`
    ).join('');
    
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${actionButtons}
                <button class="btn btn-secondary" onclick="closeModal()">Fechar</button>
            </div>
        </div>
    `;
    
    // Adicionar estilos do modal se não existirem
    if (!document.querySelector('#modalStyles')) {
        const styles = document.createElement('style');
        styles.id = 'modalStyles';
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .modal {
                background: var(--background-primary);
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-hover);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-lg);
                border-bottom: 1px solid var(--border-color);
            }
            .modal-header h3 {
                margin: 0;
                color: var(--text-primary);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: var(--font-size-lg);
                color: var(--text-muted);
                cursor: pointer;
                padding: var(--spacing-xs);
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            .modal-close:hover {
                background: var(--background-secondary);
                color: var(--text-primary);
            }
            .modal-body {
                padding: var(--spacing-lg);
            }
            .modal-footer {
                display: flex;
                gap: var(--spacing-md);
                justify-content: flex-end;
                padding: var(--spacing-lg);
                border-top: 1px solid var(--border-color);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(modal);
    
    // Fechar modal ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// Funções de ação para tabelas
function editClient(cpf) {
    showToast('Funcionalidade de edição será implementada em breve', 'info');
}

function viewClientAccounts(cpf) {
    showLoading(true);
    
    api.getAccountsByClient(cpf)
        .then(response => {
            const accounts = response.data.contas || [];
            const clientName = response.data.cliente_nome || 'Cliente';
            
            const accountsList = accounts.length > 0 
                ? accounts.map(account => `
                    <div style="display: flex; justify-content: space-between; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px; margin-bottom: 10px;">
                        <div>
                            <strong>Conta: ${account.numero_conta}</strong><br>
                            <span>Tipo: ${account.tipo_conta === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}</span><br>
                            <span>Saldo: ${Utils.formatCurrency(account.saldo)}</span>
                        </div>
                        <button class="btn btn-sm btn-primary" onclick="checkBalance('${account.numero_conta}'); closeModal();">
                            Ver Detalhes
                        </button>
                    </div>
                `).join('')
                : '<p>Este cliente ainda não possui contas.</p>';
            
            createModal(
                `Contas de ${Utils.capitalize(clientName)}`,
                accountsList
            );
        })
        .catch(error => {
            handleAPIError(error, 'buscar contas do cliente');
        })
        .finally(() => {
            showLoading(false);
        });
}

function copyAccountNumber(accountNumber) {
    Utils.copyToClipboard(accountNumber);
}

// Sistema de confirmação
function showConfirm(message, onConfirm, onCancel = null) {
    const modal = createModal(
        'Confirmação',
        `<p>${message}</p>`,
        [
            {
                text: 'Confirmar',
                class: 'btn-primary',
                onclick: `closeModal(); (${onConfirm.toString()})()`
            },
            {
                text: 'Cancelar',
                class: 'btn-secondary',
                onclick: onCancel ? `closeModal(); (${onCancel.toString()})()` : 'closeModal()'
            }
        ]
    );
}

// Formatar tipos de contas para exibição
function formatAccountType(type) {
    return type === 'corrente' ? 'Conta Corrente' : 'Conta Poupança';
}

// Obter badge de status
function getStatusBadge(status) {
    const badges = {
        active: '<span class="badge success">Ativa</span>',
        inactive: '<span class="badge error">Inativa</span>',
        pending: '<span class="badge warning">Pendente</span>'
    };
    return badges[status] || badges.active;
}

// Exportar funções para uso global
window.showToast = showToast;
window.renderClientsTable = renderClientsTable;
window.renderAccountsTable = renderAccountsTable;
window.populateClientSelect = populateClientSelect;
window.createModal = createModal;
window.closeModal = closeModal;
window.editClient = editClient;
window.viewClientAccounts = viewClientAccounts;
window.copyAccountNumber = copyAccountNumber;
window.showConfirm = showConfirm;
window.formatAccountType = formatAccountType;
window.getStatusBadge = getStatusBadge;