const database = require('../config/database');
const logger = require('../config/logger');
const { limparCPF, formatarCPF } = require('../utils/cpfValidator');

class Cliente {
    /**
     * Criar um novo cliente
     * @param {Object} dadosCliente - Dados do cliente
     * @returns {Promise<Object>} - Cliente criado ou erro
     */
    static async criar(dadosCliente) {
        try {
            const cpfLimpo = limparCPF(dadosCliente.cpf);
            
            const query = `
                INSERT INTO clientes (
                    cpf, nome, email, telefone, data_nascimento, 
                    endereco, cep, cidade, estado
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                cpfLimpo,
                dadosCliente.nome,
                dadosCliente.email || null,
                dadosCliente.telefone || null,
                dadosCliente.data_nascimento,
                dadosCliente.endereco || null,
                dadosCliente.cep || null,
                dadosCliente.cidade || null,
                dadosCliente.estado || null
            ];
            
            await database.run(query, params);
            
            logger.info(`Cliente criado com sucesso: CPF ${formatarCPF(cpfLimpo)}`);
            
            // Retornar o cliente criado
            return await this.buscarPorCpf(cpfLimpo);
            
        } catch (error) {
            logger.error('Erro ao criar cliente:', error);
            
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new Error('CPF já cadastrado no sistema');
            }
            
            throw new Error('Erro interno do servidor ao criar cliente');
        }
    }
    
    /**
     * Buscar cliente por CPF
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Object|null>} - Cliente encontrado ou null
     */
    static async buscarPorCpf(cpf) {
        try {
            const cpfLimpo = limparCPF(cpf);
            const query = 'SELECT * FROM clientes WHERE cpf = ?';
            const cliente = await database.get(query, [cpfLimpo]);
            
            if (cliente) {
                // Formatar CPF para exibição
                cliente.cpf = formatarCPF(cliente.cpf);
                logger.info(`Cliente encontrado: ${cliente.nome}`);
            }
            
            return cliente;
            
        } catch (error) {
            logger.error('Erro ao buscar cliente por CPF:', error);
            throw new Error('Erro interno do servidor ao buscar cliente');
        }
    }
    
    /**
     * Listar todos os clientes ativos
     * @returns {Promise<Array>} - Lista de clientes
     */
    static async listar() {
        try {
            const query = `
                SELECT cpf, nome, email, telefone, data_nascimento, 
                       cidade, estado, status, created_at 
                FROM clientes 
                WHERE status = 'ATIVO' 
                ORDER BY nome
            `;
            
            const clientes = await database.all(query);
            
            // Formatar CPFs para exibição
            clientes.forEach(cliente => {
                cliente.cpf = formatarCPF(cliente.cpf);
            });
            
            logger.info(`${clientes.length} clientes listados`);
            return clientes;
            
        } catch (error) {
            logger.error('Erro ao listar clientes:', error);
            throw new Error('Erro interno do servidor ao listar clientes');
        }
    }
    
    /**
     * Atualizar dados do cliente
     * @param {string} cpf - CPF do cliente
     * @param {Object} dadosAtualizacao - Dados para atualização
     * @returns {Promise<Object>} - Cliente atualizado
     */
    static async atualizar(cpf, dadosAtualizacao) {
        try {
            const cpfLimpo = limparCPF(cpf);
            
            // Verificar se cliente existe
            const clienteExistente = await this.buscarPorCpf(cpfLimpo);
            if (!clienteExistente) {
                throw new Error('Cliente não encontrado');
            }
            
            // Construir query dinamicamente
            const campos = Object.keys(dadosAtualizacao);
            const valores = Object.values(dadosAtualizacao);
            
            if (campos.length === 0) {
                throw new Error('Nenhum campo para atualizar foi fornecido');
            }
            
            const placeholders = campos.map(campo => `${campo} = ?`).join(', ');
            const query = `
                UPDATE clientes 
                SET ${placeholders}, updated_at = CURRENT_TIMESTAMP
                WHERE cpf = ?
            `;
            
            await database.run(query, [...valores, cpfLimpo]);
            
            logger.info(`Cliente atualizado: CPF ${formatarCPF(cpfLimpo)}`);
            
            // Retornar cliente atualizado
            return await this.buscarPorCpf(cpfLimpo);
            
        } catch (error) {
            logger.error('Erro ao atualizar cliente:', error);
            
            if (error.message === 'Cliente não encontrado') {
                throw error;
            }
            
            if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw new Error('Email já está em uso por outro cliente');
            }
            
            throw new Error('Erro interno do servidor ao atualizar cliente');
        }
    }
    
    /**
     * Desativar cliente (soft delete)
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<boolean>} - Sucesso da operação
     */
    static async desativar(cpf) {
        try {
            const cpfLimpo = limparCPF(cpf);
            
            // Verificar se cliente existe
            const clienteExistente = await this.buscarPorCpf(cpfLimpo);
            if (!clienteExistente) {
                throw new Error('Cliente não encontrado');
            }
            
            const query = `
                UPDATE clientes 
                SET status = 'INATIVO', updated_at = CURRENT_TIMESTAMP
                WHERE cpf = ?
            `;
            
            await database.run(query, [cpfLimpo]);
            
            logger.info(`Cliente desativado: CPF ${formatarCPF(cpfLimpo)}`);
            return true;
            
        } catch (error) {
            logger.error('Erro ao desativar cliente:', error);
            
            if (error.message === 'Cliente não encontrado') {
                throw error;
            }
            
            throw new Error('Erro interno do servidor ao desativar cliente');
        }
    }
    
    /**
     * Contar total de clientes ativos
     * @returns {Promise<number>} - Número de clientes ativos
     */
    static async contarAtivos() {
        try {
            const query = 'SELECT COUNT(*) as total FROM clientes WHERE status = "ATIVO"';
            const result = await database.get(query);
            return result.total;
            
        } catch (error) {
            logger.error('Erro ao contar clientes ativos:', error);
            throw new Error('Erro interno do servidor ao contar clientes');
        }
    }
}

module.exports = Cliente;