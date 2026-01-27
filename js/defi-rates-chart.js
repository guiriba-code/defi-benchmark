/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GRÁFICO 1 - BENCHMARK (Aave, Ethena, Morpho, T-Bill)
 * Cores: Verde/Ciano/Azul/Teal
 * ═══════════════════════════════════════════════════════════════════════════
 */

let defiRatesChart = null;

// Cores específicas para Query 1 (Benchmark)
const COLORS_Q1 = {
    aave: '#800080',    // Roxo
    juros: '#FF0000',   // Vermelho (Juros de Títulos Americanos)
    ethena: '#000000',  // Preto
    morpho: '#0000FF',  // Azul
};

// NÃO carregar automaticamente - será chamado pelo ScrollAnimations
async function loadDefiRatesChart() {
    const canvas = document.getElementById('defi-rates-chart');
    const noteElement = document.getElementById('defi-rates-note');
    
    if (!canvas) {
        console.warn('> Canvas defi-rates-chart não encontrado');
        return;
    }

    try {
        let dataUrl = 'data/defi_rates_data.json';
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const port = window.location.port || '8000';
            dataUrl = `http://${window.location.hostname}:${port}/data/defi_rates_data.json?t=${Date.now()}`;
        }
        
        console.log('> Carregando Query 1 (Benchmark):', dataUrl);
        const response = await fetch(dataUrl);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}`);
        }

        const jsonData = await response.json();
        const rows = jsonData.data;

        if (!rows || rows.length === 0) {
            throw new Error('Nenhum dado encontrado');
        }

        let labels = [];
        let aaveSupplyRates = [];
        let tbillRates = [];
        let ethenaSusdeRates = [];
        let morphoSupplyRates = [];
        
        // Função para extrair data de forma robusta (funciona em todos os navegadores)
        const parseDate = (dateField) => {
            if (!dateField) return new Date(0);
            // Extrair apenas YYYY-MM-DD da string (remove timestamp se houver)
            const dateStr = dateField.toString().split(' ')[0];
            // Criar data no formato ISO: YYYY-MM-DDT00:00:00
            const date = new Date(dateStr + 'T00:00:00');
            return isNaN(date.getTime()) ? new Date(0) : date;
        };
        
        const sortedRows = [...rows].sort((a, b) => {
            const dateA = parseDate(a.date || a.Date);
            const dateB = parseDate(b.date || b.Date);
            return dateA - dateB;
        });
        
        sortedRows.forEach((row) => {
            const dateField = row.date || row.Date;
            if (dateField) {
                try {
                    // Extrair apenas a parte da data (YYYY-MM-DD) se vier com timestamp
                    const dateStr = dateField.toString().split(' ')[0];
                    const date = new Date(dateStr + 'T00:00:00');
                    if (!isNaN(date.getTime())) {
                        // Formato simples DD/MM (sem hora)
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        labels.push(`${day}/${month}`);
                    } else {
                        // Fallback: tentar extrair manualmente
                        const parts = dateStr.split('-');
                        if (parts.length >= 3) {
                            labels.push(`${parts[2]}/${parts[1]}`);
                        } else {
                            labels.push(dateField);
                        }
                    }
                } catch (e) {
                    labels.push(dateField);
                }
                
                aaveSupplyRates.push(row.aave_supply_rate !== null ? parseFloat(row.aave_supply_rate) : null);
                tbillRates.push(row.tbill_rate !== null ? parseFloat(row.tbill_rate) : null);
                ethenaSusdeRates.push(row.ethena_susde_rate !== null ? parseFloat(row.ethena_susde_rate) : null);
                morphoSupplyRates.push(row.morpho_supply_rate !== null ? parseFloat(row.morpho_supply_rate) : null);
            }
        });

        // Buscar o valor mais recente não-nulo para cada campo
        if (noteElement) {
            const isMobile = window.innerWidth < 768;
            const rates = [];
            
            // Links das operações
            const LINKS = {
                aave: 'https://app.aave.com/',
                ethena: 'https://ethena.fi/',
                morpho: 'https://app.morpho.org/ethereum/vault/0xBEEF01735c132Ada46AA9aA4c54623cAA92A64CB/steakhouse-usdc'
            };
            
            // Função para encontrar o último valor não-nulo
            const findLastValue = (field) => {
                for (let i = sortedRows.length - 1; i >= 0; i--) {
                    if (sortedRows[i][field] !== null && sortedRows[i][field] !== undefined) {
                        return sortedRows[i][field];
                    }
                }
                return null;
            };
            
            const aaveVal = findLastValue('aave_supply_rate');
            const tbillVal = findLastValue('tbill_rate');
            const ethenaVal = findLastValue('ethena_susde_rate');
            const morphoVal = findLastValue('morpho_supply_rate');
            
            if (aaveVal !== null) rates.push(`<a href="${LINKS.aave}" target="_blank">Aave</a>: ${(aaveVal * 100).toFixed(1)}%`);
            if (tbillVal !== null) rates.push(`Juros US: ${(tbillVal * 100).toFixed(1)}%`);
            if (ethenaVal !== null) rates.push(`<a href="${LINKS.ethena}" target="_blank">Ethena</a>: ${(ethenaVal * 100).toFixed(1)}%`);
            if (morphoVal !== null) rates.push(`<a href="${LINKS.morpho}" target="_blank">Morpho</a>: ${(morphoVal * 100).toFixed(1)}%`);
            
            if (isMobile) {
                noteElement.innerHTML = `<strong>> Última atualização:</strong><br>${rates.join('<br>')}`;
            } else {
                noteElement.innerHTML = `> Última atualização: ${rates.join(' | ')}`;
            }
        }

        const ctx = canvas.getContext('2d');
        
        if (defiRatesChart) {
            defiRatesChart.destroy();
        }

        defiRatesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Aave',  // Simplificado
                        data: aaveSupplyRates,
                        borderColor: COLORS_Q1.aave,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q1.aave,
                        spanGaps: true
                    },
                    {
                        label: 'Juros Títulos US',  // Juros de Títulos Americanos
                        data: tbillRates,
                        borderColor: COLORS_Q1.juros,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q1.juros,
                        spanGaps: true
                    },
                    {
                        label: 'Ethena',  // Simplificado
                        data: ethenaSusdeRates,
                        borderColor: COLORS_Q1.ethena,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q1.ethena,
                        spanGaps: true
                    },
                    {
                        label: 'Morpho',  // Simplificado
                        data: morphoSupplyRates,
                        borderColor: COLORS_Q1.morpho,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q1.morpho,
                        spanGaps: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false  // Usando legenda HTML customizada
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#ffffff',
                        titleColor: '#000000',
                        bodyColor: '#000000',
                        borderColor: '#000000',
                        borderWidth: 1,
                        titleFont: {
                            family: "'Monaco', 'Menlo', monospace",
                            size: 11
                        },
                        bodyFont: {
                            family: "'Monaco', 'Menlo', monospace",
                            size: 10
                        },
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                if (value === null) return `${context.dataset.label}: N/A`;
                                return `> ${context.dataset.label}: ${(value * 100).toFixed(2)}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: false  // Usando label HTML customizado
                        },
                        ticks: {
                            color: '#666666',
                            font: {
                                family: "'Monaco', 'Menlo', monospace",
                                size: 9
                            },
                            callback: function(value) {
                                return (value * 100).toFixed(1) + '%';
                            }
                        },
                        grid: {
                            color: '#e0e0e0',
                            lineWidth: 1
                        },
                        border: {
                            color: '#cccccc'
                        }
                    },
                    x: {
                        title: {
                            display: false  // Usando label HTML customizado
                        },
                        ticks: {
                            color: '#666666',
                            font: {
                                family: "'Monaco', 'Menlo', monospace",
                                size: window.innerWidth < 768 ? 7 : 9
                            },
                            maxRotation: 90,
                            minRotation: 45,
                            autoSkip: true,
                            autoSkipPadding: 10,
                            maxTicksLimit: window.innerWidth < 480 ? 6 : (window.innerWidth < 768 ? 10 : 15)
                        },
                        grid: {
                            color: '#e0e0e0',
                            lineWidth: 1
                        },
                        border: {
                            color: '#cccccc'
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

        // Criar legenda HTML customizada
        createCustomLegend('defi-rates-legend', [
            { label: 'Aave', color: COLORS_Q1.aave },
            { label: 'Juros Títulos US', color: COLORS_Q1.juros },
            { label: 'Ethena', color: COLORS_Q1.ethena },
            { label: 'Morpho', color: COLORS_Q1.morpho }
        ]);

        console.log('> Gráfico 1 (Benchmark) carregado ✓');
        
    } catch (error) {
        console.error('> Erro ao carregar gráfico 1:', error);
        if (noteElement) {
            noteElement.textContent = `Erro: ${error.message}`;
            noteElement.style.color = '#cc0000';
        }
    }
}

// Função para criar legenda HTML customizada com efeito glitch
function createCustomLegend(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    items.forEach(item => {
        const legendItem = document.createElement('div');
        legendItem.className = 'chart-legend-item glitch-text';
        legendItem.innerHTML = `
            <span class="chart-legend-color" style="background-color: ${item.color}"></span>
            <span class="chart-legend-label">${item.label}</span>
        `;
        container.appendChild(legendItem);
    });
}

// Expor função globalmente para o ScrollAnimations
window.loadDefiRatesChart = loadDefiRatesChart;
