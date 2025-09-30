const ContaService = require('../services/ContaService');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

class ContaController {
    /**
     * Criar nova conta
     * POST /api/contas
     */
    static criarConta = asyncHandler(async (req, res) => {
        const conta = await ContaService.criarConta(req.body);
        
        logger.info(`Conta criada com sucesso via API: ${conta.numero_conta}`);
        
        res.status(201).json({
            success: true,
            message: 'Conta criada com sucesso',
            data: conta
        });
    });
    
    /**
     * Buscar conta por número
     * GET /api/contas/numero/:numero
     */
    static buscarContaPorNumero = asyncHandler(async (req, res) => {
        const { numero } = req.params;
        const conta = await ContaService.buscarContaPorNumero(numero);
        
        res.status(200).json({
            success: true,
            message: 'Conta encontrada',
            data: conta
        });
    });
    
    /**
     * Consultar saldo da conta
     * GET /api/contas/saldo/:numero
     */
    static consultarSaldo = asyncHandler(async (req, res) => {
        const { numero } = req.params;
        const saldoInfo = await ContaService.consultarSaldo(numero);
        
        res.status(200).json({
            success: true,
            message: 'Saldo consultado com sucesso',
            data: saldoInfo
        });
    });
    
    /**
     * Listar contas por cliente
     * GET /api/contas/cliente/:cpf
     */
    static listarContasPorCliente = asyncHandler(async (req, res) => {
        const { cpf } = req.params;
        const resultado = await ContaService.listarContasPorCliente(cpf);
        
        res.status(200).json({
            success: true,
            message: 'Contas do cliente listadas com sucesso',
            data: resultado
        });
    });
    
    /**
     * Realizar depósito
     * POST /api/contas/:numero/deposito
     */
    static depositar = asyncHandler(async (req, res) => {
        const { numero } = req.params;
        const { valor } = req.body;
        
        if (!valor || valor <= 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Valor do depósito é obrigatório e deve ser positivo',
                    code: 400
                }
            });
        }
        
        const resultado = await ContaService.depositar(numero, valor);
        
        logger.info(`Depósito realizado via API: Conta ${numero} - R$ ${valor}`);
        
        res.status(200).json({
            success: true,
            message: 'Depósito realizado com sucesso',
            data: resultado
        });
    });
    
    /**
     * Realizar saque
     * POST /api/contas/:numero/saque
     */
    static sacar = asyncHandler(async (req, res) => {
        const { numero } = req.params;
        const { valor } = req.body;
        
        if (!valor || valor <= 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Valor do saque é obrigatório e deve ser positivo',
                    code: 400
                }
            });
        }
        
        const resultado = await ContaService.sacar(numero, valor);
        
        logger.info(`Saque realizado via API: Conta ${numero} - R$ ${valor}`);
        
        res.status(200).json({
            success: true,
            message: 'Saque realizado com sucesso',
            data: resultado
        });
    });
    
    /**
     * Realizar transferência
     * POST /api/contas/transferencia
     */
    static transferir = asyncHandler(async (req, res) => {
        const { conta_origem, conta_destino, valor } = req.body;
        
        // Validações básicas
        if (!conta_origem || !conta_destino || !valor) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Conta origem, conta destino e valor são obrigatórios',
                    code: 400
                }
            });
        }
        
        if (valor <= 0) {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Valor da transferência deve ser positivo',
                    code: 400
                }
            });
        }
        
        const resultado = await ContaService.transferir(conta_origem, conta_destino, valor);
        
        logger.info(`Transferência realizada via API: ${conta_origem} → ${conta_destino} - R$ ${valor}`);
        
        res.status(200).json({
            success: true,
            message: 'Transferência realizada com sucesso',
            data: resultado
        });
    });
    
    /**
     * Listar todas as contas (para admin)
     * GET /api/contas
     */
    static listarTodasContas = asyncHandler(async (req, res) => {
        const contas = await ContaService.listarTodasContas();
        
        res.status(200).json({
            success: true,
            message: 'Contas listadas com sucesso',
            data: contas,
            total: contas.length
        });
    });
    
    /**
     * Obter estatísticas das contas
     * GET /api/contas/stats
     */
    static obterEstatisticas = asyncHandler(async (req, res) => {
        const estatisticas = await ContaService.obterEstatisticas();
        
        res.status(200).json({
            success: true,
            message: 'Estatísticas obtidas com sucesso',
            data: estatisticas
        });
    });
    
    /**
     * Health check para contas
     * GET /api/contas/health
     */
    static healthCheck = asyncHandler(async (req, res) => {
        const stats = await ContaService.obterEstatisticas();
        
        res.status(200).json({
            success: true,
            message: 'Serviço de contas operacional',
            data: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                total_contas: stats.total_contas,
                saldo_total_formatado: stats.saldo_total_formatado
            }
        });
    });
}

module.exports = ContaController;