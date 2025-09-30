const Conta = require('../models/Conta');
const Cliente = require('../models/Cliente');
const logger = require('../config/logger');

class ContaService {
    /**
     * Criar nova conta com validações de negócio
     * @param {Object} dadosConta - Dados da conta
     * @returns {Promise<Object>} - Conta criada
     */
    static async criarConta(dadosConta) {
        try {
            // Verificar se cliente existe e está ativo
            const cliente = await Cliente.buscarPorCpf(dadosConta.cpf_cliente);
            
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            if (cliente.status !== 'ATIVO') {
                throw new Error('Cliente não está ativo para criar contas');
            }
            
            // Verificar limite de contas por cliente (máximo 3)
            const contasExistentes = await Conta.listarPorCliente(dadosConta.cpf_cliente);
            
            if (contasExistentes.length >= 3) {
                throw new Error('Cliente já possui o máximo de 3 contas permitidas');
            }
            
            // Verificar se já existe conta do mesmo tipo
            const contaMesmoTipo = contasExistentes.find(
                conta => conta.tipo_conta === dadosConta.tipo_conta
            );
            
            if (contaMesmoTipo) {
                throw new Error(`Cliente já possui uma conta ${dadosConta.tipo_conta}`);
            }
            
            // Validar saldo inicial para conta poupança (mínimo R$ 50)
            if (dadosConta.tipo_conta === 'poupanca' && 
                (dadosConta.saldo_inicial || 0) < 50) {
                throw new Error('Conta poupança requer saldo inicial mínimo de R$ 50,00');
            }
            
            logger.info(`Criando conta ${dadosConta.tipo_conta} para cliente ${cliente.nome}`);
            return await Conta.criar(dadosConta);
            
        } catch (error) {
            logger.error('Erro no serviço de criação de conta:', error);
            throw error;
        }
    }
    
    /**
     * Buscar conta por número
     * @param {string} numeroConta - Número da conta
     * @returns {Promise<Object>} - Conta encontrada
     */
    static async buscarContaPorNumero(numeroConta) {
        try {
            const conta = await Conta.buscarPorNumero(numeroConta);
            
            if (!conta) {
                throw new Error('Conta não encontrada ou inativa');
            }
            
            return conta;
            
        } catch (error) {
            logger.error('Erro no serviço de busca de conta:', error);
            throw error;
        }
    }
    
    /**
     * Consultar saldo com validações
     * @param {string} numeroConta - Número da conta
     * @returns {Promise<Object>} - Informações do saldo
     */
    static async consultarSaldo(numeroConta) {
        try {
            const saldoInfo = await Conta.consultarSaldo(numeroConta);
            
            // Adicionar informações extras
            return {
                ...saldoInfo,
                saldo_formatado: this.formatarMoeda(saldoInfo.saldo),
                status_conta: saldoInfo.saldo >= 0 ? 'regular' : 'negativa'
            };
            
        } catch (error) {
            logger.error('Erro no serviço de consulta de saldo:', error);
            throw error;
        }
    }
    
    /**
     * Listar contas por cliente
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Array>} - Lista de contas
     */
    static async listarContasPorCliente(cpf) {
        try {
            // Verificar se cliente existe
            const cliente = await Cliente.buscarPorCpf(cpf);
            
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            const contas = await Conta.listarPorCliente(cpf);
            
            // Enriquecer dados das contas
            const contasEnriquecidas = contas.map(conta => ({
                ...conta,
                saldo_formatado: this.formatarMoeda(conta.saldo),
                status_conta: conta.saldo >= 0 ? 'regular' : 'negativa',
                limite_formatado: this.formatarMoeda(conta.limite_diario)
            }));
            
            return {
                cliente: {
                    nome: cliente.nome,
                    cpf: cliente.cpf
                },
                contas: contasEnriquecidas,
                total_contas: contasEnriquecidas.length
            };
            
        } catch (error) {
            logger.error('Erro no serviço de listagem de contas por cliente:', error);
            throw error;
        }
    }
    
    /**
     * Realizar depósito na conta
     * @param {string} numeroConta - Número da conta
     * @param {number} valor - Valor do depósito
     * @returns {Promise<Object>} - Resultado da operação
     */
    static async depositar(numeroConta, valor) {
        try {
            // Validações
            if (valor <= 0) {
                throw new Error('Valor do depósito deve ser positivo');
            }
            
            if (valor > 50000) {
                throw new Error('Valor máximo para depósito é R$ 50.000,00');
            }
            
            // Buscar conta atual
            const conta = await Conta.buscarPorNumero(numeroConta);
            
            if (!conta) {
                throw new Error('Conta não encontrada ou inativa');
            }
            
            const novoSaldo = conta.saldo + valor;
            
            // Atualizar saldo
            const contaAtualizada = await Conta.atualizarSaldo(numeroConta, novoSaldo);
            
            logger.info(`Depósito realizado: Conta ${numeroConta} - R$ ${valor}`);
            
            return {
                operacao: 'depósito',
                valor: valor,
                valor_formatado: this.formatarMoeda(valor),
                saldo_anterior: conta.saldo,
                saldo_atual: novoSaldo,
                saldo_formatado: this.formatarMoeda(novoSaldo),
                data_operacao: new Date().toISOString(),
                conta: contaAtualizada
            };
            
        } catch (error) {
            logger.error('Erro no serviço de depósito:', error);
            throw error;
        }
    }
    
    /**
     * Realizar saque da conta
     * @param {string} numeroConta - Número da conta
     * @param {number} valor - Valor do saque
     * @returns {Promise<Object>} - Resultado da operação
     */
    static async sacar(numeroConta, valor) {
        try {
            // Validações
            if (valor <= 0) {
                throw new Error('Valor do saque deve ser positivo');
            }
            
            // Buscar conta atual
            const conta = await Conta.buscarPorNumero(numeroConta);
            
            if (!conta) {
                throw new Error('Conta não encontrada ou inativa');
            }
            
            // Verificar se há saldo suficiente
            if (conta.saldo < valor) {
                throw new Error('Saldo insuficiente para realizar o saque');
            }
            
            // Verificar limite diário
            if (valor > conta.limite_diario) {
                throw new Error(`Valor excede o limite diário de R$ ${this.formatarMoeda(conta.limite_diario)}`);
            }
            
            const novoSaldo = conta.saldo - valor;
            
            // Atualizar saldo
            const contaAtualizada = await Conta.atualizarSaldo(numeroConta, novoSaldo);
            
            logger.info(`Saque realizado: Conta ${numeroConta} - R$ ${valor}`);
            
            return {
                operacao: 'saque',
                valor: valor,
                valor_formatado: this.formatarMoeda(valor),
                saldo_anterior: conta.saldo,
                saldo_atual: novoSaldo,
                saldo_formatado: this.formatarMoeda(novoSaldo),
                data_operacao: new Date().toISOString(),
                conta: contaAtualizada
            };
            
        } catch (error) {
            logger.error('Erro no serviço de saque:', error);
            throw error;
        }
    }
    
    /**
     * Realizar transferência entre contas
     * @param {string} contaOrigem - Número da conta origem
     * @param {string} contaDestino - Número da conta destino
     * @param {number} valor - Valor da transferência
     * @returns {Promise<Object>} - Resultado da operação
     */
    static async transferir(contaOrigem, contaDestino, valor) {
        try {
            // Validações
            if (valor <= 0) {
                throw new Error('Valor da transferência deve ser positivo');
            }
            
            if (contaOrigem === contaDestino) {
                throw new Error('Conta de origem e destino não podem ser iguais');
            }
            
            // Buscar contas
            const origem = await Conta.buscarPorNumero(contaOrigem);
            const destino = await Conta.buscarPorNumero(contaDestino);
            
            if (!origem) {
                throw new Error('Conta de origem não encontrada ou inativa');
            }
            
            if (!destino) {
                throw new Error('Conta de destino não encontrada ou inativa');
            }
            
            // Verificar saldo suficiente
            if (origem.saldo < valor) {
                throw new Error('Saldo insuficiente na conta de origem');
            }
            
            // Verificar limite diário
            if (valor > origem.limite_diario) {
                throw new Error(`Valor excede o limite diário de R$ ${this.formatarMoeda(origem.limite_diario)}`);
            }
            
            // Realizar transferência
            const novoSaldoOrigem = origem.saldo - valor;
            const novoSaldoDestino = destino.saldo + valor;
            
            // Atualizar ambas as contas
            await Conta.atualizarSaldo(contaOrigem, novoSaldoOrigem);
            await Conta.atualizarSaldo(contaDestino, novoSaldoDestino);
            
            logger.info(`Transferência realizada: ${contaOrigem} → ${contaDestino} - R$ ${valor}`);
            
            return {
                operacao: 'transferência',
                valor: valor,
                valor_formatado: this.formatarMoeda(valor),
                conta_origem: {
                    numero: contaOrigem,
                    saldo_anterior: origem.saldo,
                    saldo_atual: novoSaldoOrigem,
                    nome_cliente: origem.nome_cliente
                },
                conta_destino: {
                    numero: contaDestino,
                    saldo_anterior: destino.saldo,
                    saldo_atual: novoSaldoDestino,
                    nome_cliente: destino.nome_cliente
                },
                data_operacao: new Date().toISOString()
            };
            
        } catch (error) {
            logger.error('Erro no serviço de transferência:', error);
            throw error;
        }
    }
    
    /**
     * Obter estatísticas das contas
     * @returns {Promise<Object>} - Estatísticas
     */
    static async obterEstatisticas() {
        try {
            const totalContas = await Conta.contarAtivas();
            const saldoTotal = await Conta.calcularSaldoTotal();
            
            return {
                total_contas: totalContas,
                saldo_total: saldoTotal,
                saldo_total_formatado: this.formatarMoeda(saldoTotal),
                data_consulta: new Date().toISOString()
            };
            
        } catch (error) {
            logger.error('Erro ao obter estatísticas de contas:', error);
            throw error;
        }
    }
    
    /**
     * Formatar valor monetário
     * @param {number} valor - Valor a ser formatado
     * @returns {string} - Valor formatado
     */
    static formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
    
    /**
     * Listar todas as contas (para admin)
     * @returns {Promise<Array>} - Lista de todas as contas
     */
    static async listarTodasContas() {
        try {
            const contas = await Conta.listar();
            
            // Enriquecer dados
            const contasEnriquecidas = contas.map(conta => ({
                ...conta,
                saldo_formatado: this.formatarMoeda(conta.saldo)
            }));
            
            return contasEnriquecidas;
            
        } catch (error) {
            logger.error('Erro no serviço de listagem de todas as contas:', error);
            throw error;
        }
    }
}

module.exports = ContaService;