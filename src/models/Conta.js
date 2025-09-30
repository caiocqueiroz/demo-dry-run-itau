const database = require('../config/database');
const logger = require('../config/logger');
const { limparCPF, formatarCPF } = require('../utils/cpfValidator');

class Conta {
    /**
     * Gerar número único de conta
     * @returns {Promise<string>} - Número da conta gerado
     */
    static async gerarNumeroConta() {
        let numero;
        let existe = true;
        
        while (existe) {
            // Gerar número de 6 dígitos
            numero = Math.floor(100000 + Math.random() * 900000).toString();
            const conta = await this.buscarPorNumero(numero);
            existe = !!conta;
        }
        
        return numero;
    }
    
    /**
     * Criar uma nova conta
     * @param {Object} dadosConta - Dados da conta
     * @returns {Promise<Object>} - Conta criada
     */
    static async criar(dadosConta) {
        try {
            const cpfLimpo = limparCPF(dadosConta.cpf_cliente);
            const numeroConta = await this.gerarNumeroConta();
            
            const query = `
                INSERT INTO contas (
                    numero_conta, cpf_cliente, tipo_conta, saldo, limite_diario
                ) VALUES (?, ?, ?, ?, ?)
            `;
            
            const params = [
                numeroConta,
                cpfLimpo,
                dadosConta.tipo_conta,
                dadosConta.saldo_inicial || 0.00,
                dadosConta.limite_diario || 5000.00
            ];
            
            await database.run(query, params);
            
            logger.info(`Conta criada: ${numeroConta} para CPF ${formatarCPF(cpfLimpo)}`);
            
            // Retornar a conta criada
            return await this.buscarPorNumero(numeroConta);
            
        } catch (error) {
            logger.error('Erro ao criar conta:', error);
            
            if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
                throw new Error('Cliente não encontrado para criar a conta');
            }
            
            throw new Error('Erro interno do servidor ao criar conta');
        }
    }
    
    /**
     * Buscar conta por número
     * @param {string} numeroConta - Número da conta
     * @returns {Promise<Object|null>} - Conta encontrada ou null
     */
    static async buscarPorNumero(numeroConta) {
        try {
            const query = `
                SELECT c.*, cl.nome as nome_cliente 
                FROM contas c
                LEFT JOIN clientes cl ON c.cpf_cliente = cl.cpf
                WHERE c.numero_conta = ? AND c.ativa = 1
            `;
            
            const conta = await database.get(query, [numeroConta]);
            
            if (conta) {
                // Formatar CPF para exibição
                conta.cpf_cliente = formatarCPF(conta.cpf_cliente);
                // Converter saldo para número
                conta.saldo = parseFloat(conta.saldo);
                conta.limite_diario = parseFloat(conta.limite_diario);
                
                logger.info(`Conta encontrada: ${numeroConta}`);
            }
            
            return conta;
            
        } catch (error) {
            logger.error('Erro ao buscar conta por número:', error);
            throw new Error('Erro interno do servidor ao buscar conta');
        }
    }
    
    /**
     * Listar contas por cliente
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Array>} - Lista de contas do cliente
     */
    static async listarPorCliente(cpf) {
        try {
            const cpfLimpo = limparCPF(cpf);
            
            const query = `
                SELECT numero_conta, tipo_conta, saldo, limite_diario, 
                       agencia, ativa, created_at
                FROM contas 
                WHERE cpf_cliente = ? AND ativa = 1
                ORDER BY created_at DESC
            `;
            
            const contas = await database.all(query, [cpfLimpo]);
            
            // Converter valores para número
            contas.forEach(conta => {
                conta.saldo = parseFloat(conta.saldo);
                conta.limite_diario = parseFloat(conta.limite_diario);
            });
            
            logger.info(`${contas.length} contas encontradas para CPF ${formatarCPF(cpfLimpo)}`);
            return contas;
            
        } catch (error) {
            logger.error('Erro ao listar contas por cliente:', error);
            throw new Error('Erro interno do servidor ao listar contas');
        }
    }
    
    /**
     * Consultar saldo da conta
     * @param {string} numeroConta - Número da conta
     * @returns {Promise<Object>} - Informações do saldo
     */
    static async consultarSaldo(numeroConta) {
        try {
            const query = `
                SELECT c.numero_conta, c.saldo, c.tipo_conta, c.agencia,
                       cl.nome as nome_cliente
                FROM contas c
                LEFT JOIN clientes cl ON c.cpf_cliente = cl.cpf
                WHERE c.numero_conta = ? AND c.ativa = 1
            `;
            
            const conta = await database.get(query, [numeroConta]);
            
            if (!conta) {
                throw new Error('Conta não encontrada ou inativa');
            }
            
            const saldoInfo = {
                numero_conta: conta.numero_conta,
                saldo: parseFloat(conta.saldo),
                tipo_conta: conta.tipo_conta,
                agencia: conta.agencia,
                nome_cliente: conta.nome_cliente,
                data_consulta: new Date().toISOString()
            };
            
            logger.info(`Saldo consultado: Conta ${numeroConta} - R$ ${saldoInfo.saldo}`);
            return saldoInfo;
            
        } catch (error) {
            logger.error('Erro ao consultar saldo:', error);
            
            if (error.message === 'Conta não encontrada ou inativa') {
                throw error;
            }
            
            throw new Error('Erro interno do servidor ao consultar saldo');
        }
    }
    
    /**
     * Atualizar saldo da conta
     * @param {string} numeroConta - Número da conta
     * @param {number} novoSaldo - Novo saldo
     * @returns {Promise<Object>} - Conta atualizada
     */
    static async atualizarSaldo(numeroConta, novoSaldo) {
        try {
            if (novoSaldo < 0) {
                throw new Error('Saldo não pode ser negativo');
            }
            
            const query = `
                UPDATE contas 
                SET saldo = ?, updated_at = CURRENT_TIMESTAMP
                WHERE numero_conta = ? AND ativa = 1
            `;
            
            const result = await database.run(query, [novoSaldo, numeroConta]);
            
            if (result.changes === 0) {
                throw new Error('Conta não encontrada ou inativa');
            }
            
            logger.info(`Saldo atualizado: Conta ${numeroConta} - R$ ${novoSaldo}`);
            
            // Retornar conta atualizada
            return await this.buscarPorNumero(numeroConta);
            
        } catch (error) {
            logger.error('Erro ao atualizar saldo:', error);
            
            if (error.message === 'Saldo não pode ser negativo' || 
                error.message === 'Conta não encontrada ou inativa') {
                throw error;
            }
            
            throw new Error('Erro interno do servidor ao atualizar saldo');
        }
    }
    
    /**
     * Desativar conta (soft delete)
     * @param {string} numeroConta - Número da conta
     * @returns {Promise<boolean>} - Sucesso da operação
     */
    static async desativar(numeroConta) {
        try {
            const query = `
                UPDATE contas 
                SET ativa = 0, updated_at = CURRENT_TIMESTAMP
                WHERE numero_conta = ?
            `;
            
            const result = await database.run(query, [numeroConta]);
            
            if (result.changes === 0) {
                throw new Error('Conta não encontrada');
            }
            
            logger.info(`Conta desativada: ${numeroConta}`);
            return true;
            
        } catch (error) {
            logger.error('Erro ao desativar conta:', error);
            
            if (error.message === 'Conta não encontrada') {
                throw error;
            }
            
            throw new Error('Erro interno do servidor ao desativar conta');
        }
    }
    
    /**
     * Listar todas as contas ativas
     * @returns {Promise<Array>} - Lista de contas
     */
    static async listar() {
        try {
            const query = `
                SELECT c.numero_conta, c.tipo_conta, c.saldo, c.agencia,
                       c.created_at, cl.nome as nome_cliente
                FROM contas c
                LEFT JOIN clientes cl ON c.cpf_cliente = cl.cpf
                WHERE c.ativa = 1
                ORDER BY c.created_at DESC
            `;
            
            const contas = await database.all(query);
            
            // Converter valores para número
            contas.forEach(conta => {
                conta.saldo = parseFloat(conta.saldo);
            });
            
            logger.info(`${contas.length} contas listadas`);
            return contas;
            
        } catch (error) {
            logger.error('Erro ao listar contas:', error);
            throw new Error('Erro interno do servidor ao listar contas');
        }
    }
    
    /**
     * Contar total de contas ativas
     * @returns {Promise<number>} - Número de contas ativas
     */
    static async contarAtivas() {
        try {
            const query = 'SELECT COUNT(*) as total FROM contas WHERE ativa = 1';
            const result = await database.get(query);
            return result.total;
            
        } catch (error) {
            logger.error('Erro ao contar contas ativas:', error);
            throw new Error('Erro interno do servidor ao contar contas');
        }
    }
    
    /**
     * Calcular saldo total de todas as contas
     * @returns {Promise<number>} - Saldo total
     */
    static async calcularSaldoTotal() {
        try {
            const query = 'SELECT SUM(saldo) as total FROM contas WHERE ativa = 1';
            const result = await database.get(query);
            return parseFloat(result.total) || 0;
            
        } catch (error) {
            logger.error('Erro ao calcular saldo total:', error);
            throw new Error('Erro interno do servidor ao calcular saldo total');
        }
    }
}

module.exports = Conta;