const Cliente = require('../models/Cliente');
const logger = require('../config/logger');
const { limparCPF } = require('../utils/cpfValidator');

class ClienteService {
    /**
     * Criar novo cliente com validações de negócio
     * @param {Object} dadosCliente - Dados do cliente
     * @returns {Promise<Object>} - Cliente criado
     */
    static async criarCliente(dadosCliente) {
        try {
            // Verificar se cliente já existe
            const cpfLimpo = limparCPF(dadosCliente.cpf);
            const clienteExistente = await Cliente.buscarPorCpf(cpfLimpo);
            
            if (clienteExistente) {
                throw new Error('Cliente já cadastrado com este CPF');
            }
            
            // Validar idade mínima (18 anos)
            const dataAtual = new Date();
            const dataNascimento = new Date(dadosCliente.data_nascimento);
            const idade = dataAtual.getFullYear() - dataNascimento.getFullYear();
            const mesAtual = dataAtual.getMonth();
            const mesNascimento = dataNascimento.getMonth();
            
            let idadeReal = idade;
            if (mesAtual < mesNascimento || 
                (mesAtual === mesNascimento && dataAtual.getDate() < dataNascimento.getDate())) {
                idadeReal--;
            }
            
            if (idadeReal < 18) {
                throw new Error('Cliente deve ter pelo menos 18 anos');
            }
            
            // Normalizar dados
            const dadosNormalizados = {
                ...dadosCliente,
                nome: dadosCliente.nome.trim().toUpperCase(),
                email: dadosCliente.email ? dadosCliente.email.toLowerCase().trim() : null,
                telefone: dadosCliente.telefone ? dadosCliente.telefone.replace(/[^\d]/g, '') : null,
                cidade: dadosCliente.cidade ? dadosCliente.cidade.trim().toUpperCase() : null,
                estado: dadosCliente.estado ? dadosCliente.estado.toUpperCase() : null
            };
            
            logger.info(`Iniciando criação de cliente: ${dadosNormalizados.nome}`);
            return await Cliente.criar(dadosNormalizados);
            
        } catch (error) {
            logger.error('Erro no serviço de criação de cliente:', error);
            throw error;
        }
    }
    
    /**
     * Buscar cliente por CPF
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Object>} - Cliente encontrado
     */
    static async buscarClientePorCpf(cpf) {
        try {
            const cliente = await Cliente.buscarPorCpf(cpf);
            
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            return cliente;
            
        } catch (error) {
            logger.error('Erro no serviço de busca de cliente:', error);
            throw error;
        }
    }
    
    /**
     * Listar todos os clientes com informações resumidas
     * @returns {Promise<Array>} - Lista de clientes
     */
    static async listarClientes() {
        try {
            const clientes = await Cliente.listar();
            
            // Adicionar informações calculadas
            const clientesEnriquecidos = clientes.map(cliente => ({
                ...cliente,
                idade: this.calcularIdade(cliente.data_nascimento)
            }));
            
            return clientesEnriquecidos;
            
        } catch (error) {
            logger.error('Erro no serviço de listagem de clientes:', error);
            throw error;
        }
    }
    
    /**
     * Atualizar dados do cliente
     * @param {string} cpf - CPF do cliente
     * @param {Object} dadosAtualizacao - Dados para atualização
     * @returns {Promise<Object>} - Cliente atualizado
     */
    static async atualizarCliente(cpf, dadosAtualizacao) {
        try {
            // Normalizar dados de atualização
            const dadosNormalizados = {};
            
            if (dadosAtualizacao.nome) {
                dadosNormalizados.nome = dadosAtualizacao.nome.trim().toUpperCase();
            }
            
            if (dadosAtualizacao.email) {
                dadosNormalizados.email = dadosAtualizacao.email.toLowerCase().trim();
            }
            
            if (dadosAtualizacao.telefone) {
                dadosNormalizados.telefone = dadosAtualizacao.telefone.replace(/[^\d]/g, '');
            }
            
            if (dadosAtualizacao.cidade) {
                dadosNormalizados.cidade = dadosAtualizacao.cidade.trim().toUpperCase();
            }
            
            if (dadosAtualizacao.estado) {
                dadosNormalizados.estado = dadosAtualizacao.estado.toUpperCase();
            }
            
            if (dadosAtualizacao.endereco) {
                dadosNormalizados.endereco = dadosAtualizacao.endereco.trim();
            }
            
            if (dadosAtualizacao.cep) {
                dadosNormalizados.cep = dadosAtualizacao.cep.replace(/[^\d]/g, '');
            }
            
            logger.info(`Atualizando cliente: CPF ${cpf}`);
            return await Cliente.atualizar(cpf, dadosNormalizados);
            
        } catch (error) {
            logger.error('Erro no serviço de atualização de cliente:', error);
            throw error;
        }
    }
    
    /**
     * Desativar cliente
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Object>} - Resultado da operação
     */
    static async desativarCliente(cpf) {
        try {
            // Verificar se cliente tem contas ativas
            const Conta = require('../models/Conta');
            const contasAtivas = await Conta.listarPorCliente(cpf);
            
            if (contasAtivas.length > 0) {
                throw new Error('Não é possível desativar cliente com contas ativas');
            }
            
            await Cliente.desativar(cpf);
            
            logger.info(`Cliente desativado: CPF ${cpf}`);
            return { 
                success: true, 
                message: 'Cliente desativado com sucesso' 
            };
            
        } catch (error) {
            logger.error('Erro no serviço de desativação de cliente:', error);
            throw error;
        }
    }
    
    /**
     * Obter estatísticas dos clientes
     * @returns {Promise<Object>} - Estatísticas
     */
    static async obterEstatisticas() {
        try {
            const totalClientes = await Cliente.contarAtivos();
            
            return {
                total_clientes: totalClientes,
                data_consulta: new Date().toISOString()
            };
            
        } catch (error) {
            logger.error('Erro ao obter estatísticas de clientes:', error);
            throw error;
        }
    }
    
    /**
     * Calcular idade baseada na data de nascimento
     * @param {string} dataNascimento - Data de nascimento
     * @returns {number} - Idade em anos
     */
    static calcularIdade(dataNascimento) {
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();
        
        if (mesAtual < mesNascimento || 
            (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }
        
        return idade;
    }
    
    /**
     * Validar se cliente pode realizar operações
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<boolean>} - True se pode operar
     */
    static async validarOperacoes(cpf) {
        try {
            const cliente = await Cliente.buscarPorCpf(cpf);
            
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            if (cliente.status !== 'ATIVO') {
                throw new Error('Cliente não está ativo para operações');
            }
            
            return true;
            
        } catch (error) {
            logger.error('Erro na validação de operações do cliente:', error);
            throw error;
        }
    }
}

module.exports = ClienteService;