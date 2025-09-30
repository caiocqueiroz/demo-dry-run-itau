const express = require('express');
const ContaController = require('../controllers/ContaController');
const { contaSchema, cpfParamSchema, contaParamSchema } = require('../utils/validators');

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
 *     Conta:
 *       type: object
 *       required:
 *         - cpf_cliente
 *         - tipo_conta
 *       properties:
 *         cpf_cliente:
 *           type: string
 *           description: CPF do cliente (com ou sem formatação)
 *           example: "123.456.789-01"
 *         tipo_conta:
 *           type: string
 *           enum: [corrente, poupanca]
 *           description: Tipo da conta
 *           example: "corrente"
 *         saldo_inicial:
 *           type: number
 *           minimum: 0
 *           description: Saldo inicial da conta
 *           example: 1000.00
 *         limite_diario:
 *           type: number
 *           minimum: 0
 *           description: Limite diário para transações
 *           example: 5000.00
 */

/**
 * @swagger
 * /api/contas:
 *   post:
 *     summary: Criar nova conta
 *     tags: [Contas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Conta'
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Cliente não encontrado
 */
router.post('/', validarDados(contaSchema), ContaController.criarConta);

/**
 * @swagger
 * /api/contas:
 *   get:
 *     summary: Listar todas as contas
 *     tags: [Contas]
 *     responses:
 *       200:
 *         description: Lista de contas
 */
router.get('/', ContaController.listarTodasContas);

/**
 * @swagger
 * /api/contas/stats:
 *   get:
 *     summary: Obter estatísticas das contas
 *     tags: [Contas]
 *     responses:
 *       200:
 *         description: Estatísticas das contas
 */
router.get('/stats', ContaController.obterEstatisticas);

/**
 * @swagger
 * /api/contas/health:
 *   get:
 *     summary: Health check do serviço de contas
 *     tags: [Contas]
 *     responses:
 *       200:
 *         description: Serviço operacional
 */
router.get('/health', ContaController.healthCheck);

/**
 * @swagger
 * /api/contas/numero/{numero}:
 *   get:
 *     summary: Buscar conta por número
 *     tags: [Contas]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da conta (6 dígitos)
 *     responses:
 *       200:
 *         description: Conta encontrada
 *       404:
 *         description: Conta não encontrada
 */
router.get('/numero/:numero', 
    validarParametros(contaParamSchema), 
    ContaController.buscarContaPorNumero
);

/**
 * @swagger
 * /api/contas/saldo/{numero}:
 *   get:
 *     summary: Consultar saldo da conta
 *     tags: [Contas]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da conta (6 dígitos)
 *     responses:
 *       200:
 *         description: Saldo consultado com sucesso
 *       404:
 *         description: Conta não encontrada
 */
router.get('/saldo/:numero', 
    validarParametros(contaParamSchema), 
    ContaController.consultarSaldo
);

/**
 * @swagger
 * /api/contas/cliente/{cpf}:
 *   get:
 *     summary: Listar contas por cliente
 *     tags: [Contas]
 *     parameters:
 *       - in: path
 *         name: cpf
 *         required: true
 *         schema:
 *           type: string
 *         description: CPF do cliente
 *     responses:
 *       200:
 *         description: Contas do cliente
 *       404:
 *         description: Cliente não encontrado
 */
router.get('/cliente/:cpf', 
    validarParametros(cpfParamSchema), 
    ContaController.listarContasPorCliente
);

/**
 * @swagger
 * /api/contas/{numero}/deposito:
 *   post:
 *     summary: Realizar depósito na conta
 *     tags: [Contas]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - valor
 *             properties:
 *               valor:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 50000
 *                 description: Valor do depósito
 *                 example: 500.00
 *     responses:
 *       200:
 *         description: Depósito realizado com sucesso
 *       400:
 *         description: Valor inválido
 *       404:
 *         description: Conta não encontrada
 */
router.post('/:numero/deposito', 
    validarParametros(contaParamSchema), 
    ContaController.depositar
);

/**
 * @swagger
 * /api/contas/{numero}/saque:
 *   post:
 *     summary: Realizar saque da conta
 *     tags: [Contas]
 *     parameters:
 *       - in: path
 *         name: numero
 *         required: true
 *         schema:
 *           type: string
 *         description: Número da conta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - valor
 *             properties:
 *               valor:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Valor do saque
 *                 example: 200.00
 *     responses:
 *       200:
 *         description: Saque realizado com sucesso
 *       400:
 *         description: Valor inválido ou saldo insuficiente
 *       404:
 *         description: Conta não encontrada
 */
router.post('/:numero/saque', 
    validarParametros(contaParamSchema), 
    ContaController.sacar
);

/**
 * @swagger
 * /api/contas/transferencia:
 *   post:
 *     summary: Realizar transferência entre contas
 *     tags: [Contas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - conta_origem
 *               - conta_destino
 *               - valor
 *             properties:
 *               conta_origem:
 *                 type: string
 *                 description: Número da conta origem
 *                 example: "123456"
 *               conta_destino:
 *                 type: string
 *                 description: Número da conta destino
 *                 example: "654321"
 *               valor:
 *                 type: number
 *                 minimum: 0.01
 *                 description: Valor da transferência
 *                 example: 300.00
 *     responses:
 *       200:
 *         description: Transferência realizada com sucesso
 *       400:
 *         description: Dados inválidos ou saldo insuficiente
 *       404:
 *         description: Conta não encontrada
 */
router.post('/transferencia', ContaController.transferir);

module.exports = router;