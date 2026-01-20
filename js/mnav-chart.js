/**
 * Script para carregar e renderizar gráfico mNAV do Dune Analytics
 */

let mnavChart = null;

async function loadMNAVChart() {
    const canvas = document.getElementById('mnav-chart');
    const noteElement = document.getElementById('mnav-note');
    
    if (!canvas) {
        console.warn('Canvas mnav-chart não encontrado');
        return;
    }

    try {
        // Carregar dados do JSON gerado pelo script Python
        let dataUrl = 'data/mnav_data.json';
        
        // Se estiver rodando em localhost (servidor), usar URL do servidor
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const port = window.location.port || '8000';
            dataUrl = `http://${window.location.hostname}:${port}/data/mnav_data.json`;
        }
        // Se estiver em file://, tentar carregar do arquivo local
        // Isso permite que funcione mesmo sem servidor
        
        console.log('Carregando dados de:', dataUrl);
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar dados: ${response.status}`);
        }

        const jsonData = await response.json();
        const rows = jsonData.data;

        if (!rows || rows.length === 0) {
            throw new Error('Nenhum dado encontrado');
        }

        // Processar dados - a query retorna taxas de Aave, Ethena, Morpho
        let labels = [];
        let aaveSupplyRates = [];
        let aaveVariableBorrowRates = [];
        let ethenaSusdeRates = [];
        let morphoSupplyRates = [];
        
        // Ordenar por data (mais antiga primeiro)
        const sortedRows = [...rows].sort((a, b) => {
            const dateA = new Date(a.date || a.Date || 0);
            const dateB = new Date(b.date || b.Date || 0);
            return dateA - dateB;
        });
        
        sortedRows.forEach((row) => {
            const dateField = row.date || row.Date;
            if (dateField) {
                // Formatar data
                try {
                    const date = new Date(dateField);
                    if (!isNaN(date.getTime())) {
                        labels.push(date.toLocaleDateString('pt-BR', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        }));
                    } else {
                        labels.push(dateField);
                    }
                } catch (e) {
                    labels.push(dateField);
                }
                
                // Coletar taxas
                aaveSupplyRates.push(row.aave_supply_rate !== null ? parseFloat(row.aave_supply_rate) : null);
                aaveVariableBorrowRates.push(row.aave_variable_borrow_rate !== null ? parseFloat(row.aave_variable_borrow_rate) : null);
                ethenaSusdeRates.push(row.ethena_susde_rate !== null ? parseFloat(row.ethena_susde_rate) : null);
                morphoSupplyRates.push(row.morpho_supply_rate !== null ? parseFloat(row.morpho_supply_rate) : null);
            }
        });

        // Atualizar nota
        const lastRow = sortedRows[sortedRows.length - 1];
        if (lastRow) {
            const rates = [];
            if (lastRow.aave_supply_rate !== null) rates.push(`Aave Supply: ${(lastRow.aave_supply_rate * 100).toFixed(2)}%`);
            if (lastRow.ethena_susde_rate !== null) rates.push(`Ethena: ${(lastRow.ethena_susde_rate * 100).toFixed(2)}%`);
            if (lastRow.morpho_supply_rate !== null) rates.push(`Morpho: ${(lastRow.morpho_supply_rate * 100).toFixed(2)}%`);
            noteElement.textContent = `Última atualização: ${rates.join(' | ')}`;
        }

        // Criar gráfico com Chart.js
        const ctx = canvas.getContext('2d');
        
        // Destruir gráfico anterior se existir
        if (mnavChart) {
            mnavChart.destroy();
        }

        mnavChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Aave Supply Rate',
                        data: aaveSupplyRates,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        spanGaps: true
                    },
                    {
                        label: 'Aave Variable Borrow Rate',
                        data: aaveVariableBorrowRates,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        spanGaps: true
                    },
                    {
                        label: 'Ethena susDE Rate',
                        data: ethenaSusdeRates,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        spanGaps: true
                    },
                    {
                        label: 'Morpho Supply Rate',
                        data: morphoSupplyRates,
                        borderColor: 'rgb(153, 102, 255)',
                        backgroundColor: 'rgba(153, 102, 255, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                        spanGaps: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                if (value === null) return `${context.dataset.label}: N/A`;
                                return `${context.dataset.label}: ${(value * 100).toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Taxa (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return (value * 100).toFixed(2) + '%';
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        console.log('✅ Gráfico mNAV carregado com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao carregar gráfico mNAV:', error);
        noteElement.textContent = `Erro ao carregar dados: ${error.message}. Execute o script fetch_dune_data.py primeiro.`;
        noteElement.style.color = 'red';
        
        // Mostrar instruções
        const instructions = document.createElement('p');
        instructions.className = 'chart-instruction';
        
        // Verificar se está em file:// ou localhost
        if (window.location.protocol === 'file:') {
            instructions.innerHTML = `
                <strong>Como carregar os dados:</strong><br>
                <strong>Opção 1 (Recomendado):</strong> Use o servidor automático<br>
                1. Execute: <code>./iniciar-servidor.sh</code> ou <code>python3 server.py</code><br>
                2. Acesse: <code>http://localhost:8000</code><br><br>
                <strong>Opção 2:</strong> Execute manualmente<br>
                1. Execute: <code>python3 fetch_dune_data.py</code><br>
                2. Recarregue esta página
            `;
        } else {
            instructions.innerHTML = `
                <strong>Erro ao carregar dados do servidor.</strong><br>
                Verifique se o servidor está rodando: <code>python3 server.py</code>
            `;
        }
        
        canvas.parentElement.appendChild(instructions);
    }
}

// Carregar gráfico quando a página estiver pronta
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMNAVChart);
} else {
    loadMNAVChart();
}
