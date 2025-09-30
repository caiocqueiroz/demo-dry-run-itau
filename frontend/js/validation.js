/**
 * Validações para formulários do sistema bancário
 */

// Validação de CPF com algoritmo brasileiro completo
function validateCPF(cpf) {
    // Remove caracteres não numéricos
    const cleanCpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleanCpf.length !== 11) {
        return { valid: false, message: 'CPF deve ter 11 dígitos' };
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
        return { valid: false, message: 'CPF inválido' };
    }
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    
    // Verifica o primeiro dígito
    if (firstDigit !== parseInt(cleanCpf.charAt(9))) {
        return { valid: false, message: 'CPF inválido' };
    }
    
    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    
    // Verifica o segundo dígito
    if (secondDigit !== parseInt(cleanCpf.charAt(10))) {
        return { valid: false, message: 'CPF inválido' };
    }
    
    return { valid: true, message: 'CPF válido' };
}

// Validação de email
function validateEmail(email) {
    if (!email) {
        return { valid: true, message: '' }; // Email é opcional
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Email inválido' };
    }
    
    return { valid: true, message: 'Email válido' };
}

// Validação de telefone brasileiro
function validatePhone(phone) {
    if (!phone) {
        return { valid: true, message: '' }; // Telefone é opcional
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Aceita telefones com 10 ou 11 dígitos (com DDD)
    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
        return { valid: false, message: 'Telefone deve ter 10 ou 11 dígitos' };
    }
    
    // Verifica se o DDD é válido (11-99)
    const ddd = parseInt(cleanPhone.substring(0, 2));
    if (ddd < 11 || ddd > 99) {
        return { valid: false, message: 'DDD inválido' };
    }
    
    // Para celulares (11 dígitos), o terceiro dígito deve ser 9
    if (cleanPhone.length === 11 && cleanPhone.charAt(2) !== '9') {
        return { valid: false, message: 'Celular deve começar com 9 após o DDD' };
    }
    
    return { valid: true, message: 'Telefone válido' };
}

// Validação de nome
function validateName(name) {
    if (!name || name.trim().length < 2) {
        return { valid: false, message: 'Nome deve ter pelo menos 2 caracteres' };
    }
    
    if (name.trim().length > 100) {
        return { valid: false, message: 'Nome deve ter no máximo 100 caracteres' };
    }
    
    // Verifica se contém apenas letras, espaços e acentos
    const nameRegex = /^[a-zA-ZÀ-ſ\s]+$/;
    if (!nameRegex.test(name)) {
        return { valid: false, message: 'Nome deve conter apenas letras' };
    }
    
    return { valid: true, message: 'Nome válido' };
}

// Validação de data de nascimento
function validateBirthDate(dateString) {
    if (!dateString) {
        return { valid: false, message: 'Data de nascimento é obrigatória' };
    }
    
    const birthDate = new Date(dateString);
    const today = new Date();
    
    // Verifica se a data é válida
    if (isNaN(birthDate.getTime())) {
        return { valid: false, message: 'Data inválida' };
    }
    
    // Verifica se a data não é no futuro
    if (birthDate > today) {
        return { valid: false, message: 'Data de nascimento não pode ser no futuro' };
    }
    
    // Calcula a idade
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    
    // Verifica idade mínima (18 anos)
    if (actualAge < 18) {
        return { valid: false, message: 'Idade mínima é 18 anos' };
    }
    
    // Verifica idade máxima (150 anos)
    if (actualAge > 150) {
        return { valid: false, message: 'Idade máxima é 150 anos' };
    }
    
    return { valid: true, message: 'Data de nascimento válida' };
}

// Validação de número de conta
function validateAccountNumber(number) {
    if (!number) {
        return { valid: false, message: 'Número da conta é obrigatório' };
    }
    
    const cleanNumber = number.replace(/\D/g, '');
    
    if (cleanNumber.length !== 6) {
        return { valid: false, message: 'Número da conta deve ter 6 dígitos' };
    }
    
    return { valid: true, message: 'Número de conta válido' };
}

// Validação de valor monetário
function validateAmount(amount, min = 0, max = 999999.99) {
    if (amount === '' || amount === null || amount === undefined) {
        return { valid: false, message: 'Valor é obrigatório' };
    }
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount)) {
        return { valid: false, message: 'Valor deve ser um número' };
    }
    
    if (numAmount < min) {
        return { valid: false, message: `Valor mínimo é ${Utils.formatCurrency(min)}` };
    }
    
    if (numAmount > max) {
        return { valid: false, message: `Valor máximo é ${Utils.formatCurrency(max)}` };
    }
    
    return { valid: true, message: 'Valor válido' };
}

// Função para aplicar validação visual em tempo real
function applyValidation(input, validationFn, ...args) {
    const formGroup = input.closest('.form-group');
    const validationMessage = formGroup.querySelector('.validation-message');
    
    const result = validationFn(input.value, ...args);
    
    // Remove classes anteriores
    formGroup.classList.remove('has-error', 'has-success', 'has-warning');
    
    if (result.valid) {
        formGroup.classList.add('has-success');
        if (validationMessage) {
            validationMessage.className = 'validation-message success';
            validationMessage.textContent = result.message;
        }
    } else {
        formGroup.classList.add('has-error');
        if (validationMessage) {
            validationMessage.className = 'validation-message error';
            validationMessage.textContent = result.message;
        }
    }
    
    return result.valid;
}

// Função para validar formulário completo
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        let valid = true;
        
        switch (input.type) {
            case 'text':
                if (input.id.includes('cpf') || input.id.includes('Cpf')) {
                    valid = applyValidation(input, validateCPF);
                } else if (input.id.includes('name') || input.id.includes('Name') || input.id.includes('nome')) {
                    valid = applyValidation(input, validateName);
                } else {
                    valid = input.value.trim().length > 0;
                }
                break;
            case 'email':
                valid = applyValidation(input, validateEmail);
                break;
            case 'tel':
                valid = applyValidation(input, validatePhone);
                break;
            case 'date':
                valid = applyValidation(input, validateBirthDate);
                break;
            case 'number':
                valid = applyValidation(input, validateAmount);
                break;
            default:
                valid = input.value.trim().length > 0;
        }
        
        if (!valid) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Aplicar máscaras em inputs
function applyInputMasks() {
    // Máscara para CPF
    document.querySelectorAll('input[id*="cpf"], input[id*="Cpf"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    });
    
    // Máscara para telefone
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    });
    
    // Máscara para número de conta
    document.querySelectorAll('input[id*="account"], input[id*="conta"]').forEach(input => {
        if (input.type === 'text') {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 6) {
                    value = value.substring(0, 6);
                }
                e.target.value = value;
            });
        }
    });
}

// Exportar funções para uso global
window.Validation = {
    validateCPF,
    validateEmail,
    validatePhone,
    validateName,
    validateBirthDate,
    validateAccountNumber,
    validateAmount,
    applyValidation,
    validateForm,
    applyInputMasks
};