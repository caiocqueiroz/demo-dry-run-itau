#!/usr/bin/env node

const http = require('http');

// Função melhorada para fazer requisições HTTP
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
                        data: jsonData,
                        headers: res.headers 
                    });
                } catch (e) {
                    resolve({ 
                        status: res.statusCode, 
                        data: body,
                        headers: res.headers 
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

// Função para formatear dados de resposta
function formatResponse(response) {
    if (response.data && typeof response.data === 'object') {
        return JSON.stringify(response.data, null, 2);
    }
    return response.data;
}

async function demonstrarAPI() {
    console.log('🏦 DEMONSTRAÇÃO COMPLETA - API BANCÁRIA ITAÚ\n');
    console.log('='.repeat(60));

    try {
        // 1. Health Check
        console.log('\n1️⃣ VERIFICANDO SAÚDE DA API');
        console.log('-'.repeat(40));
        
        const health = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/health',
            method: 'GET'
        });
        
        console.log(`Status: ${health.status} ${health.status === 200 ? '✅' : '❌'}`);
        if (health.data.success) {
            console.log(`🟢 API Status: ${health.data.data.status}`);
            console.log(`📅 Timestamp: ${health.data.data.timestamp}`);
            console.log(`🔧 Ambiente: ${health.data.data.environment}`);
        }

        // 2. Cadastrar múltiplos clientes
        console.log('\n2️⃣ CADASTRANDO CLIENTES');
        console.log('-'.repeat(40));

        const clientes = [
            {
                nome: "João Santos",
                cpf: "111.444.777-35",
                data_nascimento: "1990-01-15",
                email: "joao.santos@email.com",
                telefone: "11999887766"
            },
            {
                nome: "Ana Costa",
                cpf: "222.333.444-87",
                data_nascimento: "1985-05-22",
                email: "ana.costa@email.com", 
                telefone: "11988776655"
            },
            {
                nome: "Carlos Silva",
                cpf: "333.666.999-52",
                data_nascimento: "1992-11-08",
                email: "carlos.silva@email.com",
                telefone: "11977665544"
            }
        ];

        for (let i = 0; i < clientes.length; i++) {
            const cliente = clientes[i];
            console.log(`\n📝 Cadastrando: ${cliente.nome}`);
            
            const response = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/clientes',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, cliente);

            if (response.status === 201 && response.data.success) {
                console.log(`✅ Cliente cadastrado com sucesso!`);
                console.log(`   CPF: ${response.data.data.cpf}`);
                console.log(`   Nome: ${response.data.data.nome}`);
            } else {
                console.log(`❌ Erro no cadastro: ${response.data.error?.message || 'Erro desconhecido'}`);
                if (response.data.error?.details) {
                    console.log(`   Detalhes: ${response.data.error.details.join(', ')}`);
                }
            }
        }

        // 3. Listar clientes cadastrados
        console.log('\n3️⃣ LISTANDO CLIENTES CADASTRADOS');
        console.log('-'.repeat(40));

        const listaClientes = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/clientes',
            method: 'GET'
        });

        if (listaClientes.data.success) {
            console.log(`📊 Total de clientes: ${listaClientes.data.total}`);
            listaClientes.data.data.forEach((cliente, index) => {
                console.log(`\n👤 Cliente ${index + 1}:`);
                console.log(`   Nome: ${cliente.nome}`);
                console.log(`   CPF: ${cliente.cpf}`);
                console.log(`   Email: ${cliente.email}`);
                console.log(`   Idade: ${cliente.idade} anos`);
                console.log(`   Status: ${cliente.status}`);
            });
        }

        // 4. Criar contas para os clientes
        console.log('\n4️⃣ CRIANDO CONTAS BANCÁRIAS');
        console.log('-'.repeat(40));

        const contasParaCriar = [
            { cpf: "11144477735", tipo: "corrente", saldo: 2500.00 },
            { cpf: "22233344487", tipo: "poupanca", saldo: 5000.00 },
            { cpf: "33366699952", tipo: "corrente", saldo: 1200.00 }
        ];

        const contasCriadas = [];

        for (const dadosConta of contasParaCriar) {
            console.log(`\n💰 Criando conta ${dadosConta.tipo} para CPF: ${dadosConta.cpf}`);
            
            const response = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: '/api/contas',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, {
                cpf_cliente: dadosConta.cpf,
                tipo_conta: dadosConta.tipo,
                saldo_inicial: dadosConta.saldo
            });

            if (response.status === 201 && response.data.success) {
                console.log(`✅ Conta criada com sucesso!`);
                console.log(`   Número: ${response.data.data.numero_conta}`);
                console.log(`   Tipo: ${response.data.data.tipo_conta}`);
                console.log(`   Saldo: R$ ${response.data.data.saldo.toFixed(2)}`);
                console.log(`   Cliente: ${response.data.data.nome_cliente}`);
                
                contasCriadas.push(response.data.data.numero_conta);
            } else {
                console.log(`❌ Erro na criação: ${response.data.error?.message || 'Erro desconhecido'}`);
            }
        }

        // 5. Consultar saldos
        console.log('\n5️⃣ CONSULTANDO SALDOS DAS CONTAS');
        console.log('-'.repeat(40));

        for (const numeroConta of contasCriadas) {
            console.log(`\n🔍 Consultando saldo da conta: ${numeroConta}`);
            
            const response = await makeRequest({
                hostname: 'localhost',
                port: 3000,
                path: `/api/contas/saldo/${numeroConta}`,
                method: 'GET'
            });

            if (response.data.success) {
                const dados = response.data.data;
                console.log(`✅ Saldo consultado:`);
                console.log(`   Cliente: ${dados.nome_cliente}`);
                console.log(`   Conta: ${dados.numero_conta} (${dados.tipo_conta})`);
                console.log(`   Saldo: ${dados.saldo_formatado}`);
                console.log(`   Status: ${dados.status_conta}`);
                console.log(`   Agência: ${dados.agencia}`);
            }
        }

        // 6. Demonstrar validações (casos de erro)
        console.log('\n6️⃣ DEMONSTRANDO VALIDAÇÕES');
        console.log('-'.repeat(40));

        console.log('\n❌ Tentando cadastrar cliente com CPF inválido:');
        const clienteInvalido = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/clientes',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, {
            nome: "Cliente Inválido",
            cpf: "123.456.789-00", // CPF inválido
            data_nascimento: "1990-01-01",
            email: "invalido@email.com"
        });

        if (!clienteInvalido.data.success) {
            console.log(`   🚫 Erro capturado: ${clienteInvalido.data.error.message}`);
            console.log(`   📋 Detalhes: ${clienteInvalido.data.error.details.join(', ')}`);
        }

        // 7. Estatísticas finais
        console.log('\n7️⃣ ESTATÍSTICAS FINAIS');
        console.log('-'.repeat(40));

        const estatisticas = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api',
            method: 'GET'
        });

        if (estatisticas.data.success) {
            console.log('📊 Estatísticas da API:');
            console.log(`   Clientes cadastrados: ${estatisticas.data.data.total_clientes}`);
            console.log(`   Contas ativas: ${estatisticas.data.data.total_contas}`);
            console.log(`   Saldo total sistema: ${estatisticas.data.data.saldo_total_formatado}`);
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎉 DEMONSTRAÇÃO CONCLUÍDA COM SUCESSO!');
        console.log('🏦 API Bancária Itaú - Totalmente Funcional');
        console.log('📍 Servidor: http://localhost:3000');
        console.log('💻 Ambiente: Desenvolvimento');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('\n❌ ERRO NA DEMONSTRAÇÃO:', error.message);
        console.error('🔧 Verifique se o servidor está rodando em http://localhost:3000');
    }
}

// Executar demonstração
console.log('⏳ Iniciando demonstração...\n');
demonstrarAPI();