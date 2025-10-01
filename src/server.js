const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configurações
const database = require('./config/database');
const logger = require('./config/logger');

// Importar middleware
const requestLogger = require('./middleware/requestLogger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Importar rotas
const clienteRoutes = require('./routes/clienteRoutes');
const contaRoutes = require('./routes/contaRoutes');
const carrinhoRoutes = require('./routes/carrinhoRoutes');

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por janela
    message: {
        success: false,
        error: {
            message: 'Muitas requisições. Tente novamente em alguns minutos.',
            code: 429,
            timestamp: new Date().toISOString()
        }
    },
    standardHeaders: true, // Retorna headers `RateLimit-*`
    legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
});

// Middleware de segurança
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Configurar CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://itau.com.br', 'https://www.itau.com.br'] 
        : true, // Permitir todas as origens em desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Aplicar rate limiting
app.use(limiter);

// Logger de requisições
app.use(requestLogger);

// Rota de health check principal
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API Bancária operacional',
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        }
    });
});

// Rota de informações da API
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API Bancária Itau',
        data: {
            name: 'Banking API',
            version: '1.0.0',
            description: 'API REST simples para sistema bancário',
            endpoints: {
                clientes: '/api/clientes',
                contas: '/api/contas',
                carrinho: '/api/carrinho',
                health: '/health',
                docs: '/api-docs'
            },
            features: [
                'Cadastro de clientes',
                'Criação de contas',
                'Consulta de saldo',
                'Depósitos e saques',
                'Transferências',
                'Carrinho de compras',
                'Validação de CPF',
                'Logging estruturado',
                'Rate limiting'
            ]
        }
    });
});

// Configurar rotas da API
app.use('/api/clientes', clienteRoutes);
app.use('/api/contas', contaRoutes);
app.use('/api/carrinho', carrinhoRoutes);

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Função para inicializar a aplicação
async function iniciarServidor() {
    try {
        // Conectar ao banco de dados
        await database.connect();
        await database.createTables();
        
        logger.info('Banco de dados inicializado com sucesso');
        
        // Iniciar servidor
        const server = app.listen(PORT, () => {
            logger.info(`🏦 Servidor da API Bancária iniciado`);
            logger.info(`🚀 Servidor rodando na porta ${PORT}`);
            logger.info(`🌐 URL: http://localhost:${PORT}`);
            logger.info(`💻 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`📊 Health Check: http://localhost:${PORT}/health`);
            logger.info(`📋 API Info: http://localhost:${PORT}/api`);
        });
        
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('Recebido sinal SIGTERM. Iniciando shutdown graceful...');
            
            server.close(async () => {
                logger.info('Servidor HTTP fechado');
                
                try {
                    await database.close();
                    logger.info('Conexão com banco de dados fechada');
                } catch (error) {
                    logger.error('Erro ao fechar banco de dados:', error);
                }
                
                process.exit(0);
            });
        });
        
        process.on('SIGINT', async () => {
            logger.info('Recebido sinal SIGINT. Iniciando shutdown graceful...');
            
            server.close(async () => {
                logger.info('Servidor HTTP fechado');
                
                try {
                    await database.close();
                    logger.info('Conexão com banco de dados fechada');
                } catch (error) {
                    logger.error('Erro ao fechar banco de dados:', error);
                }
                
                process.exit(0);
            });
        });
        
    } catch (error) {
        logger.error('Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

// Capturar erros não tratados
process.on('uncaughtException', (error) => {
    logger.error('Exceção não tratada:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Promise rejeitada não tratada:', { reason, promise });
    process.exit(1);
});

// Inicializar servidor apenas se não for importado como módulo
if (require.main === module) {
    iniciarServidor();
}

module.exports = app;