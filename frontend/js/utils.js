/**
 * Utilitários gerais para o sistema bancário
 */

// Formatarção de moeda brasileira
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value || 0);
}

// Formatarção de data brasileira
function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
}

// Formatarção de data e hora
function formatDateTime(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
}

// Formatar CPF
function formatCPF(cpf) {
    if (!cpf) return '';
    return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formatar telefone
function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

// Remover formatação de CPF
function cleanCPF(cpf) {
    return cpf ? cpf.replace(/\D/g, '') : '';
}

// Remover formatação de telefone
function cleanPhone(phone) {
    return phone ? phone.replace(/\D/g, '') : '';
}

// Capitalizar texto
function capitalize(text) {
    if (!text) return '';
    return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// Gerar cor aleatória para gráficos
function generateRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
        '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Debounce para inputs
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle para eventos
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Copiar texto para clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado para a área de transferência!', 'success');
    } catch (err) {
        // Fallback para browsers mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast('Copiado para a área de transferência!', 'success');
        } catch (fallbackErr) {
            showToast('Erro ao copiar texto', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Gerar ID único
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Scroll suave
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Verificar se elemento está visível
function isElementVisible(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Armazenamento local com expiração
const Storage = {
    set(key, value, expirationMinutes = 60) {
        const expirationTime = new Date().getTime() + (expirationMinutes * 60 * 1000);
        const item = {
            value: value,
            expiration: expirationTime
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    get(key) {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            const currentTime = new Date().getTime();

            if (currentTime > item.expiration) {
                localStorage.removeItem(key);
                return null;
            }

            return item.value;
        } catch (e) {
            localStorage.removeItem(key);
            return null;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    clear() {
        localStorage.clear();
    }
};

// Exportar funções para uso global
window.Utils = {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatCPF,
    formatPhone,
    cleanCPF,
    cleanPhone,
    capitalize,
    generateRandomColor,
    debounce,
    throttle,
    copyToClipboard,
    isValidEmail,
    generateId,
    smoothScrollTo,
    isElementVisible,
    Storage
};