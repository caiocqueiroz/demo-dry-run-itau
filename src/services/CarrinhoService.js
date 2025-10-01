const Carrinho = require('../models/Carrinho');
const Cliente = require('../models/Cliente');
const logger = require('../config/logger');
const { validarCPF } = require('../utils/cpfValidator');

class CarrinhoService {
    /**
     * Adicionar produto ao carrinho
     * @param {Object} dados - Dados do item
     * @returns {Promise<Object>} - Item adicionado
     */
    static async adicionarProduto(dados) {
        try {
            // Validar CPF
            if (!validarCPF(dados.cpf_cliente)) {
                throw new Error('CPF inválido');
            }
            
            // Verificar se cliente existe
            const cliente = await Cliente.buscarPorCpf(dados.cpf_cliente);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            // Validar dados do produto
            if (!dados.produto_id || !dados.nome_produto || !dados.preco_unitario || !dados.quantidade) {
                throw new Error('Dados do produto incompletos');
            }
            
            if (dados.preco_unitario <= 0) {
                throw new Error('Preço unitário deve ser maior que zero');
            }
            
            if (dados.quantidade <= 0 || !Number.isInteger(dados.quantidade)) {
                throw new Error('Quantidade deve ser um número inteiro positivo');
            }
            
            const item = await Carrinho.adicionarItem(dados);
            
            logger.info(`Produto adicionado ao carrinho com sucesso: ${dados.produto_id}`);
            return item;
            
        } catch (error) {
            logger.error('Erro no serviço ao adicionar produto ao carrinho:', error);
            throw error;
        }
    }
    
    /**
     * Listar itens do carrinho
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Object>} - Resumo do carrinho
     */
    static async listarCarrinho(cpf) {
        try {
            // Validar CPF
            if (!validarCPF(cpf)) {
                throw new Error('CPF inválido');
            }
            
            // Verificar se cliente existe
            const cliente = await Cliente.buscarPorCpf(cpf);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            const resumo = await Carrinho.obterResumo(cpf);
            
            logger.info(`Carrinho listado com sucesso para CPF: ${cpf}`);
            return resumo;
            
        } catch (error) {
            logger.error('Erro no serviço ao listar carrinho:', error);
            throw error;
        }
    }
    
    /**
     * Atualizar quantidade de produto no carrinho
     * @param {string} cpf - CPF do cliente
     * @param {string} produtoId - ID do produto
     * @param {number} quantidade - Nova quantidade
     * @returns {Promise<Object>} - Item atualizado
     */
    static async atualizarQuantidade(cpf, produtoId, quantidade) {
        try {
            // Validar CPF
            if (!validarCPF(cpf)) {
                throw new Error('CPF inválido');
            }
            
            // Verificar se cliente existe
            const cliente = await Cliente.buscarPorCpf(cpf);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            if (quantidade <= 0 || !Number.isInteger(quantidade)) {
                throw new Error('Quantidade deve ser um número inteiro positivo');
            }
            
            const item = await Carrinho.atualizarQuantidade(cpf, produtoId, quantidade);
            
            logger.info(`Quantidade atualizada no carrinho: Produto ${produtoId}`);
            return item;
            
        } catch (error) {
            logger.error('Erro no serviço ao atualizar quantidade:', error);
            throw error;
        }
    }
    
    /**
     * Remover produto do carrinho
     * @param {string} cpf - CPF do cliente
     * @param {string} produtoId - ID do produto
     * @returns {Promise<boolean>} - Sucesso da operação
     */
    static async removerProduto(cpf, produtoId) {
        try {
            // Validar CPF
            if (!validarCPF(cpf)) {
                throw new Error('CPF inválido');
            }
            
            // Verificar se cliente existe
            const cliente = await Cliente.buscarPorCpf(cpf);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            const sucesso = await Carrinho.removerItem(cpf, produtoId);
            
            logger.info(`Produto removido do carrinho: ${produtoId}`);
            return sucesso;
            
        } catch (error) {
            logger.error('Erro no serviço ao remover produto do carrinho:', error);
            throw error;
        }
    }
    
    /**
     * Limpar carrinho
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<boolean>} - Sucesso da operação
     */
    static async limparCarrinho(cpf) {
        try {
            // Validar CPF
            if (!validarCPF(cpf)) {
                throw new Error('CPF inválido');
            }
            
            // Verificar se cliente existe
            const cliente = await Cliente.buscarPorCpf(cpf);
            if (!cliente) {
                throw new Error('Cliente não encontrado');
            }
            
            const sucesso = await Carrinho.limpar(cpf);
            
            logger.info(`Carrinho limpo com sucesso para CPF: ${cpf}`);
            return sucesso;
            
        } catch (error) {
            logger.error('Erro no serviço ao limpar carrinho:', error);
            throw error;
        }
    }
}

module.exports = CarrinhoService;
