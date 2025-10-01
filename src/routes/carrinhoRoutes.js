const express = require('express');
const CarrinhoController = require('../controllers/CarrinhoController');
const { carrinhoItemSchema, carrinhoQuantidadeSchema, carrinhoParamSchema, cpfParamSchema } = require('../utils/validators');

const router = express.Router();

/**
 * Middleware para validação de dados
 */
const validarDados = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        
        if (error) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Dados inválidos',
                    details: error.details.map(detail => detail.message),
                    code: 400
                }
            });
        }
        
        next();
    };
};

/**
 * Middleware para validação de parâmetros
 */
const validarParametros = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        
        if (error) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Parâmetros inválidos',
                    details: error.details.map(detail => detail.message),
                    code: 400
                }
            });
        }
        
        next();
    };
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CarrinhoItem:
 *       type: object
 *       required:
 *         - cpf_cliente
 *         - produto_id
 *         - nome_produto
 *         - preco_unitario
 *         - quantidade
 *       properties:
 *         cpf_cliente:
 *           type: string
 *           description: CPF do cliente (com ou sem formatação)
 *           example: "123.456.789-01"
 *         produto_id:
 *           type: string
 *           description: ID do produto
 *           example: "PROD001"
 *         nome_produto:
 *           type: string
 *           description: Nome do produto
 *           example: "Notebook Dell Inspiron 15"
 *         preco_unitario:
 *           type: number
 *           description: Preço unitário do produto
 *           example: 2999.90
 *         quantidade:
 *           type: integer
 *           minimum: 1
 *           description: Quantidade do produto
 *           example: 2
 */

/**
 * @swagger
 * /api/carrinho:
 *   post:
 *     summary: Adicionar produto ao carrinho
 *     tags: [Carrinho]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarrinhoItem'
 *     responses:
 *       201:
 *         description: Produto adicionado ao carrinho com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 */
router.post('/', validarDados(carrinhoItemSchema), CarrinhoController.adicionarProduto);

/**
 * @swagger
 * /api/carrinho/{cpf}:
 *   get:
 *     summary: Listar itens do carrinho de um cliente
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Carrinho obtido com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:cpf', validarParametros(cpfParamSchema), CarrinhoController.listarCarrinho);

/**
 * @swagger
 * /api/carrinho/{cpf}/{produtoId}:
 *   put:
 *     summary: Atualizar quantidade de produto no carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantidade
 *             properties:
 *               quantidade:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente ou item não encontrado
 */
router.put('/:cpf/:produtoId', 
    validarParametros(carrinhoParamSchema),
    validarDados(carrinhoQuantidadeSchema),
    CarrinhoController.atualizarQuantidade
);

/**
 * @swagger
 * /api/carrinho/{cpf}/{produtoId}:
 *   delete:
 *     summary: Remover produto do carrinho
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *       404:
 *         description: Cliente ou item não encontrado
 */
router.delete('/:cpf/:produtoId', 
    validarParametros(carrinhoParamSchema),
    CarrinhoController.removerProduto
);

/**
 * @swagger
 * /api/carrinho/{cpf}:
 *   delete:
 *     summary: Limpar carrinho do cliente
 *     tags: [Carrinho]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Carrinho limpo com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:cpf', validarParametros(cpfParamSchema), CarrinhoController.limparCarrinho);

module.exports = router;
