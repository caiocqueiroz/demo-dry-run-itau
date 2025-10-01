const CarrinhoService = require('../services/CarrinhoService');
const logger = require('../config/logger');

class CarrinhoController {
    /**
     * Adicionar produto ao carrinho
     * @param {Object} req - Request
     * @param {Object} res - Response
     */
    static async adicionarProduto(req, res) {
        try {
            const item = await CarrinhoService.adicionarProduto(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Produto adicionado ao carrinho com sucesso',
                data: item
            });
            
        } catch (error) {
            logger.error('Erro no controller ao adicionar produto ao carrinho:', error);
            
            if (error.message === 'CPF inválido' || 
                error.message === 'Dados do produto incompletos' ||
                error.message === 'Preço unitário deve ser maior que zero' ||
                error.message === 'Quantidade deve ser um número inteiro positivo') {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 400
                    }
                });
            }
            
            if (error.message === 'Cliente não encontrado') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 404
                    }
                });
            }
            
            res.status(500).json({
                success: false,
                error: {
                    message: 'Erro interno do servidor ao adicionar produto ao carrinho',
                    code: 500
                }
            });
        }
    }
    
    /**
     * Listar carrinho do cliente
     * @param {Object} req - Request
     * @param {Object} res - Response
     */
    static async listarCarrinho(req, res) {
        try {
            const { cpf } = req.params;
            const carrinho = await CarrinhoService.listarCarrinho(cpf);
            
            res.status(200).json({
                success: true,
                message: 'Carrinho obtido com sucesso',
                data: carrinho
            });
            
        } catch (error) {
            logger.error('Erro no controller ao listar carrinho:', error);
            
            if (error.message === 'CPF inválido') {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 400
                    }
                });
            }
            
            if (error.message === 'Cliente não encontrado') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 404
                    }
                });
            }
            
            res.status(500).json({
                success: false,
                error: {
                    message: 'Erro interno do servidor ao listar carrinho',
                    code: 500
                }
            });
        }
    }
    
    /**
     * Atualizar quantidade de produto
     * @param {Object} req - Request
     * @param {Object} res - Response
     */
    static async atualizarQuantidade(req, res) {
        try {
            const { cpf, produtoId } = req.params;
            const { quantidade } = req.body;
            
            const item = await CarrinhoService.atualizarQuantidade(cpf, produtoId, quantidade);
            
            res.status(200).json({
                success: true,
                message: 'Quantidade atualizada com sucesso',
                data: item
            });
            
        } catch (error) {
            logger.error('Erro no controller ao atualizar quantidade:', error);
            
            if (error.message === 'CPF inválido' || 
                error.message === 'Quantidade deve ser um número inteiro positivo' ||
                error.message === 'Quantidade deve ser maior que zero') {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 400
                    }
                });
            }
            
            if (error.message === 'Cliente não encontrado' || 
                error.message === 'Item não encontrado no carrinho') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 404
                    }
                });
            }
            
            res.status(500).json({
                success: false,
                error: {
                    message: 'Erro interno do servidor ao atualizar quantidade',
                    code: 500
                }
            });
        }
    }
    
    /**
     * Remover produto do carrinho
     * @param {Object} req - Request
     * @param {Object} res - Response
     */
    static async removerProduto(req, res) {
        try {
            const { cpf, produtoId } = req.params;
            await CarrinhoService.removerProduto(cpf, produtoId);
            
            res.status(200).json({
                success: true,
                message: 'Produto removido do carrinho com sucesso',
                data: null
            });
            
        } catch (error) {
            logger.error('Erro no controller ao remover produto:', error);
            
            if (error.message === 'CPF inválido') {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 400
                    }
                });
            }
            
            if (error.message === 'Cliente não encontrado' || 
                error.message === 'Item não encontrado no carrinho') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 404
                    }
                });
            }
            
            res.status(500).json({
                success: false,
                error: {
                    message: 'Erro interno do servidor ao remover produto do carrinho',
                    code: 500
                }
            });
        }
    }
    
    /**
     * Limpar carrinho
     * @param {Object} req - Request
     * @param {Object} res - Response
     */
    static async limparCarrinho(req, res) {
        try {
            const { cpf } = req.params;
            await CarrinhoService.limparCarrinho(cpf);
            
            res.status(200).json({
                success: true,
                message: 'Carrinho limpo com sucesso',
                data: null
            });
            
        } catch (error) {
            logger.error('Erro no controller ao limpar carrinho:', error);
            
            if (error.message === 'CPF inválido') {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 400
                    }
                });
            }
            
            if (error.message === 'Cliente não encontrado') {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: error.message,
                        code: 404
                    }
                });
            }
            
            res.status(500).json({
                success: false,
                error: {
                    message: 'Erro interno do servidor ao limpar carrinho',
                    code: 500
                }
            });
        }
    }
}

module.exports = CarrinhoController;
