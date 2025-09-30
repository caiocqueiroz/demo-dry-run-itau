/**
 * Validador de CPF brasileiro
 * Implementa o algoritmo oficial de validação de CPF
 */

/**
 * Remove caracteres não numéricos do CPF
 * @param {string} cpf - CPF com ou sem formatação
 * @returns {string} - CPF apenas com números
 */
function limparCPF(cpf) {
    if (typeof cpf !== 'string') {
        return '';
    }
    return cpf.replace(/[^\d]/g, '');
}

/**
 * Formata CPF para o padrão XXX.XXX.XXX-XX
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado
 */
function formatarCPF(cpf) {
    const cpfLimpo = limparCPF(cpf);
    if (cpfLimpo.length !== 11) {
        return cpf; // Retorna original se inválido
    }
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Valida se o CPF é válido segundo o algoritmo brasileiro
 * @param {string} cpf - CPF a ser validado
 * @returns {boolean} - true se válido, false caso contrário
 */
function validarCPF(cpf) {
    const cpfLimpo = limparCPF(cpf);
    
    // Verificar se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
        return false;
    }
    
    // Verificar se não são todos números iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        return false;
    }
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let primeiroDigito = 11 - (soma % 11);
    if (primeiroDigito >= 10) {
        primeiroDigito = 0;
    }
    
    if (parseInt(cpfLimpo.charAt(9)) !== primeiroDigito) {
        return false;
    }
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    let segundoDigito = 11 - (soma % 11);
    if (segundoDigito >= 10) {
        segundoDigito = 0;
    }
    
    return parseInt(cpfLimpo.charAt(10)) === segundoDigito;
}

/**
 * Gera um CPF válido aleatório (para testes)
 * @returns {string} - CPF válido formatado
 */
function gerarCPFValido() {
    // Gerar os 9 primeiros dígitos
    const primeirosDigitos = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    
    // Calcular primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(primeirosDigitos.charAt(i)) * (10 - i);
    }
    let primeiroDigito = 11 - (soma % 11);
    if (primeiroDigito >= 10) {
        primeiroDigito = 0;
    }
    
    // Calcular segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(primeirosDigitos.charAt(i)) * (11 - i);
    }
    soma += primeiroDigito * 2;
    let segundoDigito = 11 - (soma % 11);
    if (segundoDigito >= 10) {
        segundoDigito = 0;
    }
    
    const cpfCompleto = primeirosDigitos + primeiroDigito + segundoDigito;
    return formatarCPF(cpfCompleto);
}

module.exports = {
    validarCPF,
    formatarCPF,
    limparCPF,
    gerarCPFValido
};