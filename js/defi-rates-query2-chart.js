/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GRÁFICO 2 - sNUSD e USDai
 * Cores: Dourado/Âmbar (tons quentes)
 * ═══════════════════════════════════════════════════════════════════════════
 */

let defiRatesQuery2Chart = null;

// Cores específicas para Query 2 (sNUSD/USDai)
const COLORS_Q2 = {
    snusd: '#00FF00',   // Lime
    usdai: '#ffaa00',   // Mantém a mesma cor (Âmbar)
};

async function loadDefiRatesQuery2Chart() {
    const canvas = document.getElementById('defi-rates-query2-chart');
    const noteElement = document.getElementById('defi-rates-query2-note');
    
    if (!canvas) {
        console.warn('> Canvas defi-rates-query2-chart não encontrado');
        return;
    }

    try {
        let dataUrl = 'data/defi_rates_query2_data.json';
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const port = window.location.port || '8000';
            dataUrl = `http://${window.location.hostname}:${port}/data/defi_rates_query2_data.json?t=${Date.now()}`;
        }
        
        console.log('> Carregando Query 2 (sNUSD/USDai):', dataUrl);
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
        let snusdApy7d = [];
        let usdaiApy7dma = [];
        
        const sortedRows = [...rows].sort((a, b) => {
            const dateA = new Date(a.date || a.Date || 0);
            const dateB = new Date(b.date || b.Date || 0);
            return dateA - dateB;
        });
        
        sortedRows.forEach((row) => {
            const dateField = row.date || row.Date;
            if (dateField) {
                try {
                    const date = new Date(dateField);
                    if (!isNaN(date.getTime())) {
                        labels.push(date.toLocaleDateString('pt-BR', { 
                            month: 'short', 
                            day: 'numeric' 
                        }));
                    } else {
                        labels.push(dateField);
                    }
                } catch (e) {
                    labels.push(dateField);
                }
                
                snusdApy7d.push(row.snusd_apy_7d !== null ? parseFloat(row.snusd_apy_7d) : null);
                usdaiApy7dma.push(row.usdai_apy_7dma !== null ? parseFloat(row.usdai_apy_7dma) : null);
            }
        });

        const lastRow = sortedRows[sortedRows.length - 1];
        if (lastRow && noteElement) {
            const info = [];
            if (lastRow.snusd_apy_7d !== null) info.push(`sNUSD: ${(lastRow.snusd_apy_7d * 100).toFixed(2)}%`);
            if (lastRow.usdai_apy_7dma !== null) info.push(`USDai: ${(lastRow.usdai_apy_7dma * 100).toFixed(2)}%`);
            noteElement.textContent = `Última atualização: ${info.join(' | ')}`;
        }

        const ctx = canvas.getContext('2d');
        
        if (defiRatesQuery2Chart) {
            defiRatesQuery2Chart.destroy();
        }

        defiRatesQuery2Chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'sNUSD',  // Simplificado
                        data: snusdApy7d,
                        borderColor: COLORS_Q2.snusd,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q2.snusd,
                        spanGaps: true
                    },
                    {
                        label: 'USDai',  // Simplificado
                        data: usdaiApy7dma,
                        borderColor: COLORS_Q2.usdai,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q2.usdai,
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
                            color: '#e0e0e0'
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
                                size: 9
                            },
                            maxRotation: 45,
                            minRotation: 45,
                            maxTicksLimit: 15
                        },
                        grid: {
                            color: '#e0e0e0'
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
        createCustomLegend2('defi-rates-query2-legend', [
            { label: 'sNUSD', color: COLORS_Q2.snusd },
            { label: 'USDai', color: COLORS_Q2.usdai }
        ]);

        console.log('> Gráfico 2 (sNUSD/USDai) carregado ✓');
        
    } catch (error) {
        console.error('> Erro ao carregar gráfico 2:', error);
        if (noteElement) {
            noteElement.textContent = `Erro: ${error.message}`;
            noteElement.style.color = '#cc0000';
        }
    }
}

// Função para criar legenda HTML customizada com efeito glitch
function createCustomLegend2(containerId, items) {
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

// Expor função globalmente
window.loadDefiRatesQuery2Chart = loadDefiRatesQuery2Chart;
