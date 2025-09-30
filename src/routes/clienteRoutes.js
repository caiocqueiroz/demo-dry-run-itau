const express = require('express');
const ClienteController = require('../controllers/ClienteController');
const { clienteSchema, clienteUpdateSchema, cpfParamSchema } = require('../utils/validators');

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
 *     Cliente:
 *       type: object
 *       required:
 *         - nome
 *         - cpf
 *         - data_nascimento
 *       properties:
 *         nome:
 *           type: string
 *           description: Nome completo do cliente
 *           example: "João Silva Santos"
 *         cpf:
 *           type: string
 *           description: CPF do cliente (com ou sem formatação)
 *           example: "123.456.789-01"
 *         email:
 *           type: string
 *           format: email
 *           description: Email do cliente
 *           example: "joao@email.com"
 *         telefone:
 *           type: string
 *           description: Telefone do cliente
 *           example: "(11) 99999-9999"
 *         data_nascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento
 *           example: "1990-05-15"
 *         endereco:
 *           type: string
 *           description: Endereço completo
 *           example: "Rua das Flores, 123"
 *         cep:
 *           type: string
 *           description: CEP brasileiro
 *           example: "01234-567"
 *         cidade:
 *           type: string
 *           description: Cidade
 *           example: "São Paulo"
 *         estado:
 *           type: string
 *           description: Estado (sigla)
 *           example: "SP"
 */

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Criar novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: CPF já cadastrado
 */
router.post('/', validarDados(clienteSchema), ClienteController.criarCliente);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Listar todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/', ClienteController.listarClientes);

/**
 * @swagger
 * /api/clientes/stats:
 *   get:
 *     summary: Obter estatísticas dos clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Estatísticas dos clientes
 */
router.get('/stats', ClienteController.obterEstatisticas);

/**
 * @swagger
 * /api/clientes/{cpf}:
 *   get:
 *     summary: Buscar cliente por CPF
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:cpf', validarParametros(cpfParamSchema), ClienteController.buscarClientePorCpf);

/**
 * @swagger
 * /api/clientes/{cpf}:
 *   put:
 *     summary: Atualizar dados do cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               telefone:
 *                 type: string
 *               endereco:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.put('/:cpf', 
    validarParametros(cpfParamSchema), 
    validarDados(clienteUpdateSchema), 
    ClienteController.atualizarCliente
);

/**
 * @swagger
 * /api/clientes/{cpf}:
 *   delete:
 *     summary: Desativar cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Cliente desativado com sucesso
 *       404:
 *         description: Cliente não encontrado
 */
router.delete('/:cpf', validarParametros(cpfParamSchema), ClienteController.desativarCliente);

/**
 * @swagger
 * /api/clientes/{cpf}/validar-operacoes:
 *   get:
 *     summary: Validar se cliente pode realizar operações
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Validação realizada
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/:cpf/validar-operacoes', 
    validarParametros(cpfParamSchema), 
    ClienteController.validarOperacoes
);

module.exports = router;