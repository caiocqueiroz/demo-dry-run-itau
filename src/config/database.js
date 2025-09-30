const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

class Database {
    constructor() {
        this.db = null;
        this.dbPath = process.env.DB_PATH || './data/banco.sqlite';
    }

    async connect() {
        return new Promise((resolve, reject) => {
            // Garantir que o diretório existe
            const dbDir = path.dirname(this.dbPath);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    logger.error('Erro ao conectar com o banco de dados:', err);
                    reject(err);
                } else {
                    logger.info('Conectado ao banco de dados SQLite');
                    resolve();
                }
            });
        });
    }

    async createTables() {
        const createClientesTable = `
            CREATE TABLE IF NOT EXISTS clientes (
                cpf TEXT PRIMARY KEY,
                nome TEXT NOT NULL,
                email TEXT UNIQUE,
                telefone TEXT,
                data_nascimento DATE NOT NULL,
                endereco TEXT,
                cep TEXT,
                cidade TEXT,
                estado TEXT,
                status TEXT DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO', 'SUSPENSO')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createContasTable = `
            CREATE TABLE IF NOT EXISTS contas (
                numero_conta TEXT PRIMARY KEY,
                cpf_cliente TEXT NOT NULL,
                saldo DECIMAL(15,2) DEFAULT 0.00,
                tipo_conta TEXT NOT NULL CHECK (tipo_conta IN ('corrente', 'poupanca')),
                ativa BOOLEAN DEFAULT TRUE,
                limite_diario DECIMAL(15,2) DEFAULT 5000.00,
                agencia TEXT DEFAULT '0001',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cpf_cliente) REFERENCES clientes(cpf)
            )
        `;

        const createIndexes = [
            'CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email)',
            'CREATE INDEX IF NOT EXISTS idx_contas_cliente ON contas(cpf_cliente)',
            'CREATE INDEX IF NOT EXISTS idx_contas_ativa ON contas(ativa)'
        ];

        try {
            await this.run(createClientesTable);
            await this.run(createContasTable);
            
            for (const indexQuery of createIndexes) {
                await this.run(indexQuery);
            }

            logger.info('Tabelas e índices criados com sucesso');
        } catch (error) {
            logger.error('Erro ao criar tabelas:', error);
            throw error;
        }
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        logger.error('Erro ao fechar banco:', err);
                    } else {
                        logger.info('Conexão com banco fechada');
                    }
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

// Singleton instance
const database = new Database();

module.exports = database;