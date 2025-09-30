const ClienteService = require('../services/ClienteService');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../config/logger');

class ClienteController {
    /**
     * Criar novo cliente
     * POST /api/clientes
     */
    static criarCliente = asyncHandler(async (req, res) => {
        const cliente = await ClienteService.criarCliente(req.body);
        
        logger.info(`Cliente criado com sucesso via API: ${cliente.nome}`);
        
        res.status(201).json({
            success: true,
            message: 'Cliente criado com sucesso',
            data: cliente
        });
    });
    
    /**
     * Listar todos os clientes
     * GET /api/clientes
     */
    static listarClientes = asyncHandler(async (req, res) => {
        const clientes = await ClienteService.listarClientes();
        
        res.status(200).json({
            success: true,
            message: 'Clientes listados com sucesso',
            data: clientes,
            total: clientes.length
        });
    });
    
    /**
     * Buscar cliente por CPF
     * GET /api/clientes/:cpf
     */
    static buscarClientePorCpf = asyncHandler(async (req, res) => {
        const { cpf } = req.params;
        const cliente = await ClienteService.buscarClientePorCpf(cpf);
        
        res.status(200).json({
            success: true,
            message: 'Cliente encontrado',
            data: cliente
        });
    });
    
    /**
     * Atualizar cliente
     * PUT /api/clientes/:cpf
     */
    static atualizarCliente = asyncHandler(async (req, res) => {
        const { cpf } = req.params;
        const clienteAtualizado = await ClienteService.atualizarCliente(cpf, req.body);
        
        logger.info(`Cliente atualizado via API: CPF ${cpf}`);
        
        res.status(200).json({
            success: true,
            message: 'Cliente atualizado com sucesso',
            data: clienteAtualizado
        });
    });
    
    /**
     * Desativar cliente
     * DELETE /api/clientes/:cpf
     */
    static desativarCliente = asyncHandler(async (req, res) => {
        const { cpf } = req.params;
        const resultado = await ClienteService.desativarCliente(cpf);
        
        logger.info(`Cliente desativado via API: CPF ${cpf}`);
        
        res.status(200).json({
            success: true,
            message: resultado.message,
            data: {
                cpf: cpf,
                status: 'INATIVO',
                data_desativacao: new Date().toISOString()
            }
        });
    });
    
    /**
     * Obter estatísticas dos clientes
     * GET /api/clientes/stats
     */
    static obterEstatisticas = asyncHandler(async (req, res) => {
        const estatisticas = await ClienteService.obterEstatisticas();
        
        res.status(200).json({
            success: true,
            message: 'Estatísticas obtidas com sucesso',
            data: estatisticas
        });
    });
    
    /**
     * Validar se cliente pode realizar operações
     * GET /api/clientes/:cpf/validar-operacoes
     */
    static validarOperacoes = asyncHandler(async (req, res) => {
        const { cpf } = req.params;
        const podeOperar = await ClienteService.validarOperacoes(cpf);
        
        res.status(200).json({
            success: true,
            message: 'Cliente validado para operações',
            data: {
                cpf: cpf,
                pode_operar: podeOperar,
                data_validacao: new Date().toISOString()
            }
        });
    });
}

module.exports = ClienteController;