/**
 * Sistema de gráficos para o dashboard bancário
 */

class BankingCharts {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#ff6600',
            primaryDark: '#e55a00',
            secondary: '#0066cc',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#17a2b8'
        };
    }

    // Configurar tema dos gráficos
    getChartDefaults() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: isDark ? '#ffffff' : '#333333',
                        font: {
                            family: 'var(--font-family)',
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: isDark ? '#cccccc' : '#666666'
                    },
                    grid: {
                        color: isDark ? '#444444' : '#e0e0e0'
                    }
                },
                y: {
                    ticks: {
                        color: isDark ? '#cccccc' : '#666666'
                    },
                    grid: {
                        color: isDark ? '#444444' : '#e0e0e0'
                    }
                }
            }
        };
    }

    // Gráfico de tipos de conta (Pizza)
    createAccountTypesChart(accounts) {
        const ctx = document.getElementById('accountTypesChart');
        if (!ctx) return;

        // Destruir gráfico existente
        if (this.charts.accountTypes) {
            this.charts.accountTypes.destroy();
        }

        // Contar tipos de conta
        const typeCounts = accounts.reduce((acc, account) => {
            const type = account.tipo_conta;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        const data = {
            labels: Object.keys(typeCounts).map(type => 
                type === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'
            ),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: [
                    this.colors.primary,
                    this.colors.success
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                ...this.getChartDefaults(),
                plugins: {
                    ...this.getChartDefaults().plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        };

        this.charts.accountTypes = new Chart(ctx, config);
    }

    // Gráfico de crescimento de clientes (Linha)
    createClientGrowthChart(clients) {
        const ctx = document.getElementById('clientGrowthChart');
        if (!ctx) return;

        // Destruir gráfico existente
        if (this.charts.clientGrowth) {
            this.charts.clientGrowth.destroy();
        }

        // Agrupar clientes por mês
        const monthlyData = this.groupClientsByMonth(clients);
        
        const data = {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Novos Clientes',
                data: monthlyData.data,
                borderColor: this.colors.primary,
                backgroundColor: this.colors.primary + '20',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: this.colors.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        };

        const config = {
            type: 'line',
            data: data,
            options: {
                ...this.getChartDefaults(),
                scales: {
                    ...this.getChartDefaults().scales,
                    y: {
                        ...this.getChartDefaults().scales.y,
                        beginAtZero: true,
                        ticks: {
                            ...this.getChartDefaults().scales.y.ticks,
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    ...this.getChartDefaults().plugins,
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `Novos clientes: ${context.parsed.y}`;
                            }
                        }
                    }
                }
            }
        };

        this.charts.clientGrowth = new Chart(ctx, config);
    }

    // Agrupar clientes por mês para o gráfico de crescimento
    groupClientsByMonth(clients) {
        const now = new Date();
        const last6Months = [];
        
        // Gerar últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push({
                key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
                label: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
                count: 0
            });
        }
        
        // Contar clientes por mês
        clients.forEach(client => {
            if (client.data_criacao) {
                const clientDate = new Date(client.data_criacao);
                const key = `${clientDate.getFullYear()}-${String(clientDate.getMonth() + 1).padStart(2, '0')}`;
                
                const monthData = last6Months.find(m => m.key === key);
                if (monthData) {
                    monthData.count++;
                }
            }
        });
        
        return {
            labels: last6Months.map(m => m.label),
            data: last6Months.map(m => m.count)
        };
    }

    // Gráfico de distribuição de saldos (Barra)
    createBalanceDistributionChart(accounts) {
        const ctx = document.getElementById('balanceDistributionChart');
        if (!ctx) return;

        // Destruir gráfico existente
        if (this.charts.balanceDistribution) {
            this.charts.balanceDistribution.destroy();
        }

        // Categorizar saldos
        const categories = {
            'Até R$ 1.000': 0,
            'R$ 1.001 - R$ 5.000': 0,
            'R$ 5.001 - R$ 10.000': 0,
            'R$ 10.001 - R$ 50.000': 0,
            'Acima de R$ 50.000': 0
        };

        accounts.forEach(account => {
            const balance = parseFloat(account.saldo || 0);
            if (balance <= 1000) {
                categories['Até R$ 1.000']++;
            } else if (balance <= 5000) {
                categories['R$ 1.001 - R$ 5.000']++;
            } else if (balance <= 10000) {
                categories['R$ 5.001 - R$ 10.000']++;
            } else if (balance <= 50000) {
                categories['R$ 10.001 - R$ 50.000']++;
            } else {
                categories['Acima de R$ 50.000']++;
            }
        });

        const data = {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Número de Contas',
                data: Object.values(categories),
                backgroundColor: [
                    this.colors.info,
                    this.colors.primary,
                    this.colors.warning,
                    this.colors.success,
                    this.colors.secondary
                ],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                ...this.getChartDefaults(),
                scales: {
                    ...this.getChartDefaults().scales,
                    y: {
                        ...this.getChartDefaults().scales.y,
                        beginAtZero: true,
                        ticks: {
                            ...this.getChartDefaults().scales.y.ticks,
                            stepSize: 1
                        }
                    }
                }
            }
        };

        this.charts.balanceDistribution = new Chart(ctx, config);
    }

    // Atualizar tema de todos os gráficos
    updateTheme() {
        Object.values(this.charts).forEach(chart => {
            const options = this.getChartDefaults();
            chart.options = { ...chart.options, ...options };
            chart.update();
        });
    }

    // Destruir todos os gráficos
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            chart.destroy();
        });
        this.charts = {};
    }

    // Redimensionar gráficos
    resize() {
        Object.values(this.charts).forEach(chart => {
            chart.resize();
        });
    }
}

// Instanciar sistema de gráficos
const bankingCharts = new BankingCharts();

// Funções para criar gráficos com dados
async function createDashboardCharts() {
    try {
        showLoading(true);
        
        // Buscar dados
        const [clientsResponse, accountsResponse] = await Promise.all([
            getCachedClients(),
            getCachedAccounts()
        ]);
        
        const clients = clientsResponse.data || [];
        const accounts = accountsResponse.data || [];
        
        // Criar gráficos
        if (accounts.length > 0) {
            bankingCharts.createAccountTypesChart(accounts);
        }
        
        if (clients.length > 0) {
            bankingCharts.createClientGrowthChart(clients);
        }
        
        // Se houver dados suficientes, criar gráfico de distribuição de saldos
        if (accounts.length > 5) {
            bankingCharts.createBalanceDistributionChart(accounts);
        }
        
    } catch (error) {
        console.error('Erro ao criar gráficos:', error);
        showToast('Erro ao carregar gráficos do dashboard', 'error');
    } finally {
        showLoading(false);
    }
}

// Event listeners para redimensionamento
window.addEventListener('resize', Utils.throttle(() => {
    bankingCharts.resize();
}, 250));

// Exportar para uso global
window.bankingCharts = bankingCharts;
window.createDashboardCharts = createDashboardCharts;