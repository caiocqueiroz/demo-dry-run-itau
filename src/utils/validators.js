const Joi = require('joi');
const { validarCPF } = require('./cpfValidator');

/**
 * Validador customizado para CPF
 */
const cpfValidator = (value, helpers) => {
    if (!validarCPF(value)) {
        return helpers.error('any.invalid');
    }
    return value;
};

/**
 * Schema para validação de cliente
 */
const clienteSchema = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
        .required()
        .messages({
            'string.min': 'Nome deve ter pelo menos 2 caracteres',
            'string.max': 'Nome deve ter no máximo 100 caracteres',
            'string.pattern.base': 'Nome deve conter apenas letras e espaços',
            'any.required': 'Nome é obrigatório'
        }),
    
    cpf: Joi.string()
        .custom(cpfValidator)
        .required()
        .messages({
            'any.invalid': 'CPF inválido',
            'any.required': 'CPF é obrigatório'
        }),
    
    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Email deve ter um formato válido'
        }),
    
    telefone: Joi.string()
        .pattern(/^(\+55)?(\d{2})(\d{4,5})(\d{4})$/)
        .optional()
        .messages({
            'string.pattern.base': 'Telefone deve ter o formato brasileiro válido'
        }),
    
    data_nascimento: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.max': 'Data de nascimento não pode ser futura',
            'any.required': 'Data de nascimento é obrigatória'
        }),
    
    endereco: Joi.string()
        .max(200)
        .optional()
        .messages({
            'string.max': 'Endereço deve ter no máximo 200 caracteres'
        }),
    
    cep: Joi.string()
        .pattern(/^(\d{5})-?(\d{3})$/)
        .optional()
        .messages({
            'string.pattern.base': 'CEP deve ter o formato brasileiro válido (XXXXX-XXX)'
        }),
    
    cidade: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'Cidade deve ter no máximo 50 caracteres'
        }),
    
    estado: Joi.string()
        .length(2)
        .pattern(/^[A-Z]{2}$/)
        .optional()
        .messages({
            'string.length': 'Estado deve ter 2 caracteres',
            'string.pattern.base': 'Estado deve ser sigla válida (ex: SP, RJ)'
        })
});

/**
 * Schema para atualização de cliente (todos os campos opcionais exceto CPF)
 */
const clienteUpdateSchema = Joi.object({
    nome: Joi.string()
        .min(2)
        .max(100)
        .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
        .optional(),
    
    email: Joi.string()
        .email()
        .optional(),
    
    telefone: Joi.string()
        .pattern(/^(\+55)?(\d{2})(\d{4,5})(\d{4})$/)
        .optional(),
    
    endereco: Joi.string()
        .max(200)
        .optional(),
    
    cep: Joi.string()
        .pattern(/^(\d{5})-?(\d{3})$/)
        .optional(),
    
    cidade: Joi.string()
        .max(50)
        .optional(),
    
    estado: Joi.string()
        .length(2)
        .pattern(/^[A-Z]{2}$/)
        .optional()
});

/**
 * Schema para validação de conta
 */
const contaSchema = Joi.object({
    cpf_cliente: Joi.string()
        .custom(cpfValidator)
        .required()
        .messages({
            'any.invalid': 'CPF do cliente inválido',
            'any.required': 'CPF do cliente é obrigatório'
        }),
    
    tipo_conta: Joi.string()
        .valid('corrente', 'poupanca')
        .required()
        .messages({
            'any.only': 'Tipo de conta deve ser "corrente" ou "poupanca"',
            'any.required': 'Tipo de conta é obrigatório'
        }),
    
    saldo_inicial: Joi.number()
        .min(0)
        .precision(2)
        .default(0.00)
        .messages({
            'number.min': 'Saldo inicial não pode ser negativo',
            'number.precision': 'Saldo deve ter no máximo 2 casas decimais'
        }),
    
    limite_diario: Joi.number()
        .min(0)
        .precision(2)
        .default(5000.00)
        .messages({
            'number.min': 'Limite diário não pode ser negativo',
            'number.precision': 'Limite deve ter no máximo 2 casas decimais'
        })
});

/**
 * Schema para validação de parâmetros CPF na URL
 */
const cpfParamSchema = Joi.object({
    cpf: Joi.string()
        .custom(cpfValidator)
        .required()
        .messages({
            'any.invalid': 'CPF inválido',
            'any.required': 'CPF é obrigatório'
        })
});

/**
 * Schema para validação de número de conta na URL
 */
const contaParamSchema = Joi.object({
    numero: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            'string.pattern.base': 'Número da conta deve ter 6 dígitos',
            'any.required': 'Número da conta é obrigatório'
        })
});

module.exports = {
    clienteSchema,
    clienteUpdateSchema,
    contaSchema,
    cpfParamSchema,
    contaParamSchema
};