const winston = require('winston');
const path = require('path');

// Configuração de formato personalizado
const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        if (stack) {
            return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
        }
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

// Configuração dos transportes
const transports = [
    // Console para desenvolvimento
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            customFormat
        )
    })
];

// Adicionar arquivo de log se não for teste
if (process.env.NODE_ENV !== 'test') {
    transports.push(
        // Arquivo para todos os logs
        new winston.transports.File({
            filename: path.join('logs', 'app.log'),
            format: customFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Arquivo separado para erros
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            format: customFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    );
}

// Criar logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    transports,
    // Não sair do processo em caso de exceção não tratada
    exitOnError: false,
});

// Capturar exceções não tratadas
logger.exceptions.handle(
    new winston.transports.File({ 
        filename: path.join('logs', 'exceptions.log'),
        format: customFormat
    })
);

// Capturar promises rejeitadas
logger.rejections.handle(
    new winston.transports.File({ 
        filename: path.join('logs', 'rejections.log'),
        format: customFormat
    })
);

module.exports = logger;