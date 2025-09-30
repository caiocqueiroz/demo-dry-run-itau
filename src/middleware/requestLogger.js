const logger = require('../config/logger');

/**
 * Middleware para log de todas as requisições HTTP
 */
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Capturar informações da requisição
    const requestInfo = {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentType: req.get('Content-Type'),
        timestamp: new Date().toISOString()
    };
    
    // Log da requisição recebida
    logger.info(`${req.method} ${req.url}`, requestInfo);
    
    // Interceptar a resposta para logar quando completar
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - startTime;
        
        // Log da resposta
        logger.info(`${req.method} ${req.url} - ${res.statusCode}`, {
            ...requestInfo,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            responseSize: data ? data.length : 0
        });
        
        // Chamar método original
        originalSend.call(this, data);
    };
    
    next();
};

/**
 * Middleware para log apenas de erros HTTP
 */
const errorRequestLogger = (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
        // Log apenas para status de erro (4xx e 5xx)
        if (res.statusCode >= 400) {
            logger.warn(`Erro HTTP: ${req.method} ${req.url} - ${res.statusCode}`, {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                timestamp: new Date().toISOString()
            });
        }
        
        originalSend.call(this, data);
    };
    
    next();
};

/**
 * Middleware simplificado para logs em produção
 */
const productionLogger = (req, res, next) => {
    // Em produção, log apenas informações essenciais
    if (req.method !== 'GET' || res.statusCode >= 400) {
        logger.info(`${req.method} ${req.url}`, {
            method: req.method,
            url: req.url,
            ip: req.ip,
            timestamp: new Date().toISOString()
        });
    }
    
    next();
};

// Escolher middleware baseado no ambiente
const getRequestLogger = () => {
    if (process.env.NODE_ENV === 'production') {
        return productionLogger;
    } else if (process.env.NODE_ENV === 'test') {
        return errorRequestLogger;
    } else {
        return requestLogger;
    }
};

module.exports = getRequestLogger();