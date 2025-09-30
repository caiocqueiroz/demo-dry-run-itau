#!/usr/bin/env node

const http = require('http');

// Função para fazer requisições HTTP
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(body);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testAPI() {
    console.log('🧪 Testando API Bancária\n');

    try {
        // 1. Testar Health Check
        console.log('1. Health Check...');
        const health = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/health',
            method: 'GET'
        });
        console.log(`✅ Status: ${health.status}`);
        console.log(`📊 Response:`, health.data);
        console.log('');

        // 2. Testar criação de cliente
        console.log('2. Criando cliente...');
        const novoCliente = {
            nome: "João Silva",
            cpf: "123.456.789-01",
            data_nascimento: "1990-05-15",
            email: "joao@email.com",
            telefone: "(11) 99999-9999"
        };

        const clienteResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/clientes',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, novoCliente);

        console.log(`✅ Status: ${clienteResponse.status}`);
        console.log(`👤 Cliente:`, clienteResponse.data);
        console.log('');

        // 3. Listar clientes
        console.log('3. Listando clientes...');
        const listaClientes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/clientes',
            method: 'GET'
        });

        console.log(`✅ Status: ${listaClientes.status}`);
        console.log(`📋 Total clientes: ${listaClientes.data.total}`);
        console.log('');

        // 4. Criar conta
        console.log('4. Criando conta...');
        const novaConta = {
            cpf_cliente: "12345678901", // CPF limpo
            tipo_conta: "corrente",
            saldo_inicial: 1000.00
        };

        const contaResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/contas',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, novaConta);

        console.log(`✅ Status: ${contaResponse.status}`);
        console.log(`💰 Conta:`, contaResponse.data);
        console.log('');

        console.log('🎉 Todos os testes concluídos!');

    } catch (error) {
        console.error('❌ Erro nos testes:', error.message);
    }
}

// Executar testes
testAPI();