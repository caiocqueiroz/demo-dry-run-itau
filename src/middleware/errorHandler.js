const logger = require('../config/logger');

/**
 * Middleware para tratamento centralizado de erros
 */
const errorHandler = (error, req, res, next) => {
    // Log do erro
    logger.error('Erro capturado pelo middleware:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    
    // Resposta padrão
    let statusCode = 500;
    let message = 'Erro interno do servidor';
    
    // Categorizar tipos de erro
    if (error.message.includes('não encontrado') || 
        error.message.includes('não encontrada')) {
        statusCode = 404;
        message = error.message;
    } else if (error.message.includes('já cadastrado') ||
               error.message.includes('já possui') ||
               error.message.includes('inválido') ||
               error.message.includes('deve ser') ||
               error.message.includes('não pode') ||
               error.message.includes('insuficiente') ||
               error.message.includes('excede') ||
               error.message.includes('mínimo') ||
               error.message.includes('máximo')) {
        statusCode = 400;
        message = error.message;
    } else if (error.message.includes('não está ativo') ||
               error.message.includes('não autorizado')) {
        statusCode = 403;
        message = error.message;
    }
    
    // Estrutura de resposta padronizada
    const errorResponse = {
        success: false,
        error: {
            message: message,
            code: statusCode,
            timestamp: new Date().toISOString()
        }
    };
    
    // Adicionar detalhes extras em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error.details = error.message;
        errorResponse.error.stack = error.stack;
    }
    
    res.status(statusCode).json(errorResponse);
};

/**
 * Middleware para capturar rotas não encontradas (404)
 */
const notFoundHandler = (req, res) => {
    logger.warn(`Rota não encontrada: ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    
    res.status(404).json({
        success: false,
        error: {
            message: 'Rota não encontrada',
            code: 404,
            timestamp: new Date().toISOString(),
            path: req.url,
            method: req.method
        }
    });
};

/**
 * Wrapper para async functions nos controllers
 * Captura automaticamente erros em funções assíncronas
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler
};