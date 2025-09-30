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
                    resolve({ 
                        status: res.statusCode, 
                        data: jsonData
                    });
                } catch (e) {
                    resolve({ 
                        status: res.statusCode, 
                        data: body
                    });
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

async function demonstracaoSimples() {
    console.log('🏦 DEMONSTRAÇÃO API BANCÁRIA ITAÚ\n');

    try {
        // 1. Health Check
        console.log('1️⃣ Verificando saúde da API...');
        const health = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/health',
            method: 'GET'
        });
        console.log(`   ✅ Status: ${health.status}`);
        console.log(`   🟢 API: ${health.data.data?.status || 'Operacional'}\n`);

        // 2. Listar clientes existentes
        console.log('2️⃣ Clientes atuais no sistema...');
        const clientes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/clientes',
            method: 'GET'
        });
        console.log(`   📊 Total: ${clientes.data.total} clientes\n`);

        // 3. Criar novo cliente (com CPF válido único)
        console.log('3️⃣ Cadastrando novo cliente...');
        const novoCliente = {
            nome: "Pedro Oliveira",
            cpf: "444.555.666-78",
            data_nascimento: "1988-07-12",
            email: "pedro.oliveira@email.com",
            telefone: "11912345678"
        };

        const clienteResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/clientes',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, novoCliente);

        if (clienteResponse.data.success) {
            console.log(`   ✅ Cliente cadastrado: ${clienteResponse.data.data.nome}`);
            console.log(`   📋 CPF: ${clienteResponse.data.data.cpf}\n`);

            // 4. Criar conta para o cliente
            console.log('4️⃣ Criando conta bancária...');
            const novaConta = {
                cpf_cliente: "44455566678", // CPF limpo
                tipo_conta: "corrente",
                saldo_inicial: 3000.00
            };

            const contaResponse = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/contas',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, novaConta);

            if (contaResponse.data.success) {
                const conta = contaResponse.data.data;
                console.log(`   ✅ Conta criada: ${conta.numero_conta}`);
                console.log(`   💰 Saldo inicial: R$ ${conta.saldo.toFixed(2)}`);
                console.log(`   🏦 Tipo: ${conta.tipo_conta}\n`);

                // 5. Consultar saldo
                console.log('5️⃣ Consultando saldo...');
                const saldoResponse = await makeRequest({
                    hostname: 'localhost',
                    port: 3000,
                    path: `/api/contas/saldo/${conta.numero_conta}`,
                    method: 'GET'
                });

                if (saldoResponse.data.success) {
                    const saldo = saldoResponse.data.data;
                    console.log(`   💳 Conta: ${saldo.numero_conta}`);
                    console.log(`   👤 Cliente: ${saldo.nome_cliente}`);
                    console.log(`   💵 Saldo: ${saldo.saldo_formatado}`);
                    console.log(`   📊 Status: ${saldo.status_conta}\n`);
                }
            } else {
                console.log(`   ❌ Erro ao criar conta: ${contaResponse.data.error?.message}\n`);
            }
        } else {
            console.log(`   ❌ Erro ao cadastrar cliente: ${clienteResponse.data.error?.message}\n`);
        }

        // 6. Estatísticas finais
        console.log('6️⃣ Estatísticas do sistema...');
        const stats = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api',
            method: 'GET'
        });

        if (stats.data.success) {
            console.log(`   👥 Clientes: ${stats.data.data.total_clientes}`);
            console.log(`   🏦 Contas: ${stats.data.data.total_contas}`);
            console.log(`   💰 Saldo total: ${stats.data.data.saldo_total_formatado}`);
        }

        console.log('\n🎉 DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('🌐 API disponível em: http://localhost:3000');

    } catch (error) {
        console.error('\n❌ Erro na demonstração:', error.message);
    }
}

// Executar
demonstracaoSimples();