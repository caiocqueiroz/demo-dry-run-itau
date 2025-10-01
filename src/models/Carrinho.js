const database = require('../config/database');
const logger = require('../config/logger');
const { limparCPF, formatarCPF } = require('../utils/cpfValidator');

class Carrinho {
    /**
     * Adicionar item ao carrinho
     * @param {Object} item - Item do carrinho
     * @returns {Promise<Object>} - Item adicionado
     */
    static async adicionarItem(item) {
        try {
            const cpfLimpo = limparCPF(item.cpf_cliente);
            
            // Verificar se item já existe no carrinho
            const itemExistente = await this.buscarItem(cpfLimpo, item.produto_id);
            
            if (itemExistente) {
                // Atualizar quantidade se item já existe
                const novaQuantidade = itemExistente.quantidade + item.quantidade;
                return await this.atualizarQuantidade(cpfLimpo, item.produto_id, novaQuantidade);
            }
            
            const query = `
                INSERT INTO carrinho (
                    cpf_cliente, produto_id, nome_produto, preco_unitario, quantidade
                ) VALUES (?, ?, ?, ?, ?)
            `;
            
            const params = [
                cpfLimpo,
                item.produto_id,
                item.nome_produto,
                item.preco_unitario,
                item.quantidade
            ];
            
            await database.run(query, params);
            
            logger.info(`Item adicionado ao carrinho: Produto ${item.produto_id} para CPF ${formatarCPF(cpfLimpo)}`);
            
            return await this.buscarItem(cpfLimpo, item.produto_id);
            
        } catch (error) {
            logger.error('Erro ao adicionar item ao carrinho:', error);
            
            if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
                throw new Error('Cliente não encontrado');
            }
            
            throw new Error('Erro interno do servidor ao adicionar item ao carrinho');
        }
    }
    
    /**
     * Buscar item específico no carrinho
     * @param {string} cpf - CPF do cliente
     * @param {string} produtoId - ID do produto
     * @returns {Promise<Object|null>} - Item encontrado ou null
     */
    static async buscarItem(cpf, produtoId) {
        try {
            const cpfLimpo = limparCPF(cpf);
            const query = `
                SELECT * FROM carrinho 
                WHERE cpf_cliente = ? AND produto_id = ?
            `;
            
            const item = await database.get(query, [cpfLimpo, produtoId]);
            
            if (item) {
                item.cpf_cliente = formatarCPF(item.cpf_cliente);
                item.preco_unitario = parseFloat(item.preco_unitario);
                item.subtotal = parseFloat(item.preco_unitario) * parseInt(item.quantidade);
            }
            
            return item;
            
        } catch (error) {
            logger.error('Erro ao buscar item no carrinho:', error);
            throw new Error('Erro interno do servidor ao buscar item');
        }
    }
    
    /**
     * Listar todos os itens do carrinho de um cliente
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Array>} - Lista de itens do carrinho
     */
    static async listarPorCliente(cpf) {
        try {
            const cpfLimpo = limparCPF(cpf);
            
            const query = `
                SELECT id, produto_id, nome_produto, preco_unitario, quantidade, created_at
                FROM carrinho 
                WHERE cpf_cliente = ?
                ORDER BY created_at DESC
            `;
            
            const itens = await database.all(query, [cpfLimpo]);
            
            // Calcular subtotal para cada item
            itens.forEach(item => {
                item.preco_unitario = parseFloat(item.preco_unitario);
                item.subtotal = item.preco_unitario * item.quantidade;
            });
            
            logger.info(`${itens.length} itens encontrados no carrinho do CPF ${formatarCPF(cpfLimpo)}`);
            return itens;
            
        } catch (error) {
            logger.error('Erro ao listar itens do carrinho:', error);
            throw new Error('Erro interno do servidor ao listar itens do carrinho');
        }
    }
    
    /**
     * Obter resumo do carrinho
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<Object>} - Resumo do carrinho
     */
    static async obterResumo(cpf) {
        try {
            const cpfLimpo = limparCPF(cpf);
            const itens = await this.listarPorCliente(cpfLimpo);
            
            const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);
            const valorTotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
            
            return {
                cpf_cliente: formatarCPF(cpfLimpo),
                total_itens: totalItens,
                total_produtos: itens.length,
                valor_total: parseFloat(valorTotal.toFixed(2)),
                itens: itens
            };
            
        } catch (error) {
            logger.error('Erro ao obter resumo do carrinho:', error);
            throw new Error('Erro interno do servidor ao obter resumo do carrinho');
        }
    }
    
    /**
     * Atualizar quantidade de um item no carrinho
     * @param {string} cpf - CPF do cliente
     * @param {string} produtoId - ID do produto
     * @param {number} quantidade - Nova quantidade
     * @returns {Promise<Object>} - Item atualizado
     */
    static async atualizarQuantidade(cpf, produtoId, quantidade) {
        try {
            const cpfLimpo = limparCPF(cpf);
            
            if (quantidade <= 0) {
                throw new Error('Quantidade deve ser maior que zero');
            }
            
            const query = `
                UPDATE carrinho 
                SET quantidade = ?, updated_at = CURRENT_TIMESTAMP
                WHERE cpf_cliente = ? AND produto_id = ?
            `;
            
            const result = await database.run(query, [quantidade, cpfLimpo, produtoId]);
            
            if (result.changes === 0) {
                throw new Error('Item não encontrado no carrinho');
            }
            
            logger.info(`Quantidade atualizada: Produto ${produtoId} para ${quantidade} unidades`);
            
            return await this.buscarItem(cpfLimpo, produtoId);
            
        } catch (error) {
            logger.error('Erro ao atualizar quantidade:', error);
            
            if (error.message === 'Quantidade deve ser maior que zero' || 
                error.message === 'Item não encontrado no carrinho') {
                throw error;
            }
            
            throw new Error('Erro interno do servidor ao atualizar quantidade');
        }
    }
    
    /**
     * Remover item do carrinho
     * @param {string} cpf - CPF do cliente
     * @param {string} produtoId - ID do produto
     * @returns {Promise<boolean>} - Sucesso da operação
     */
    static async removerItem(cpf, produtoId) {
        try {
            const cpfLimpo = limparCPF(cpf);
            
            const query = `
                DELETE FROM carrinho 
                WHERE cpf_cliente = ? AND produto_id = ?
            `;
            
            const result = await database.run(query, [cpfLimpo, produtoId]);
            
            if (result.changes === 0) {
                throw new Error('Item não encontrado no carrinho');
            }
            
            logger.info(`Item removido do carrinho: Produto ${produtoId} do CPF ${formatarCPF(cpfLimpo)}`);
            return true;
            
        } catch (error) {
            logger.error('Erro ao remover item do carrinho:', error);
            
            if (error.message === 'Item não encontrado no carrinho') {
                throw error;
            }
            
            throw new Error('Erro interno do servidor ao remover item do carrinho');
        }
    }
    
    /**
     * Limpar todo o carrinho de um cliente
     * @param {string} cpf - CPF do cliente
     * @returns {Promise<boolean>} - Sucesso da operação
     */
    static async limpar(cpf) {
        try {
            const cpfLimpo = limparCPF(cpf);
            
            const query = `
                DELETE FROM carrinho 
                WHERE cpf_cliente = ?
            `;
            
            const result = await database.run(query, [cpfLimpo]);
            
            logger.info(`Carrinho limpo: ${result.changes} itens removidos do CPF ${formatarCPF(cpfLimpo)}`);
            return true;
            
        } catch (error) {
            logger.error('Erro ao limpar carrinho:', error);
            throw new Error('Erro interno do servidor ao limpar carrinho');
        }
    }
}

module.exports = Carrinho;
