# Script para Demo GitHub Copilot -

## 🎯 Objetivos da Demonstração

1. Usar Copilot Agent com ChatMode para gerar um plano de implementação a partir de um arquivo de arquitetura de uma solução de API bancária.
2. Usar Prompt Reutilizavel para verificar violações DRY (Dont Repeat Yourself) no código gerado.
3. Criar uma issue com o plano de otimização baseado na na validação DRY


## Prompts, Comandos e afins

2. **Curls para Insomnia**

### 📋 **Fluxo Completo: Cliente + Conta**

- **1. Cadastrar Cliente** - Dados válidos para demonstração
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Ana Paula Costa",
    "cpf": "987.654.321-00",
    "data_nascimento": "1992-08-15",
    "email": "ana.costa@email.com",
    "telefone": "11987654321"
  }'
```

- **2. Criar Conta Corrente** - Para o cliente cadastrado acima
```bash
curl -X POST http://localhost:3000/api/contas \
  -H "Content-Type: application/json" \
  -d '{
    "cpf_cliente": "98765432100",
    "tipo_conta": "corrente",
    "saldo_inicial": 1500.00
  }'
```

- **3. Criar Conta Poupança** - Segunda conta para o mesmo cliente
```bash
curl -X POST http://localhost:3000/api/contas \
  -H "Content-Type: application/json" \
  -d '{
    "cpf_cliente": "98765432100",
    "tipo_conta": "poupanca",
    "saldo_inicial": 5000.00
  }'
```

### 🔍 **Curls de Consulta**

- **Listar Todos os Clientes**
```bash
curl -X GET http://localhost:3000/api/clientes
```

- **Buscar Cliente por CPF**
```bash
curl -X GET http://localhost:3000/api/clientes/98765432100
```

- **Listar Contas do Cliente**
```bash
curl -X GET http://localhost:3000/api/contas/cliente/98765432100
```

- **Consultar Saldo** (substitua NUMERO_CONTA pelo número retornado)
```bash
curl -X GET http://localhost:3000/api/contas/saldo/NUMERO_CONTA
```

### 🧪 **Curls de Teste/Validação**

- **Cliente com CPF Inválido** (deve retornar erro)
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Cliente Teste Erro",
    "cpf": "123.456.789-00",
    "data_nascimento": "1990-01-01",
    "email": "erro@email.com",
    "telefone": "11999888777"
  }'
```

- **Conta com Cliente Inexistente** (deve retornar erro)
```bash
curl -X POST http://localhost:3000/api/contas \
  -H "Content-Type: application/json" \
  -d '{
    "cpf_cliente": "99999999999",
    "tipo_conta": "corrente",
    "saldo_inicial": 1000.00
  }'
```

### 🏥 **Health Check**
```bash
curl -X GET http://localhost:3000/health
```

