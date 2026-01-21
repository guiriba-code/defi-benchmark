/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GRÁFICO 4 - OnRe e Re
 * Cores: Navy/Índigo (tons azuis escuros)
 * ═══════════════════════════════════════════════════════════════════════════
 */

let defiRatesQuery4Chart = null;

// Cores específicas para Query 4 (OnRe/Re)
const COLORS_Q4 = {
    onre: '#7FFFD4',    // Aquamarine
    re: '#FFA500',      // Laranja
};

async function loadDefiRatesQuery4Chart() {
    const canvas = document.getElementById('defi-rates-query4-chart');
    const noteElement = document.getElementById('defi-rates-query4-note');
    
    if (!canvas) {
        console.warn('> Canvas defi-rates-query4-chart não encontrado');
        return;
    }

    try {
        let dataUrl = 'data/defi_rates_query4_data.json';
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const port = window.location.port || '8000';
            dataUrl = `http://${window.location.hostname}:${port}/data/defi_rates_query4_data.json?t=${Date.now()}`;
        }
        
        console.log('> Carregando Query 4 (OnRe/Re):', dataUrl);
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
        let onReApr = [];
        let reApr = [];
        
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
                        // Formato simples DD/MM (sem hora)
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        labels.push(`${day}/${month}`);
                    } else {
                        labels.push(dateField);
                    }
                } catch (e) {
                    labels.push(dateField);
                }
                
                onReApr.push(row.OnRe_APR_7D !== null && row.OnRe_APR_7D !== undefined ? parseFloat(row.OnRe_APR_7D) : null);
                reApr.push(row.Re_APR_7D !== null && row.Re_APR_7D !== undefined ? parseFloat(row.Re_APR_7D) : null);
            }
        });

        const lastRow = sortedRows[sortedRows.length - 1];
        if (lastRow && noteElement) {
            const isMobile = window.innerWidth < 768;
            const info = [];
            if (lastRow.OnRe_APR_7D !== null && lastRow.OnRe_APR_7D !== undefined) info.push(`OnRe: ${(lastRow.OnRe_APR_7D * 100).toFixed(1)}%`);
            if (lastRow.Re_APR_7D !== null && lastRow.Re_APR_7D !== undefined) info.push(`Re: ${(lastRow.Re_APR_7D * 100).toFixed(1)}%`);
            
            if (isMobile) {
                noteElement.innerHTML = `<strong>> Última atualização:</strong><br>${info.join('<br>')}`;
            } else {
                noteElement.textContent = `Última atualização: ${info.join(' | ')}`;
            }
        }

        const ctx = canvas.getContext('2d');
        
        if (defiRatesQuery4Chart) {
            defiRatesQuery4Chart.destroy();
        }

        defiRatesQuery4Chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'OnRe',  // Simplificado
                        data: onReApr,
                        borderColor: COLORS_Q4.onre,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q4.onre,
                        spanGaps: true
                    },
                    {
                        label: 'Re',  // Simplificado
                        data: reApr,
                        borderColor: COLORS_Q4.re,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q4.re,
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
                                size: window.innerWidth < 768 ? 7 : 9
                            },
                            maxRotation: 90,
                            minRotation: 45,
                            autoSkip: true,
                            autoSkipPadding: 10,
                            maxTicksLimit: window.innerWidth < 480 ? 6 : (window.innerWidth < 768 ? 10 : 15)
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
        createCustomLegend4('defi-rates-query4-legend', [
            { label: 'OnRe', color: COLORS_Q4.onre },
            { label: 'Re', color: COLORS_Q4.re }
        ]);

        console.log('> Gráfico 4 (OnRe/Re) carregado ✓');
        
    } catch (error) {
        console.error('> Erro ao carregar gráfico 4:', error);
        if (noteElement) {
            noteElement.textContent = `Erro: ${error.message}`;
            noteElement.style.color = '#cc0000';
        }
    }
}

// Função para criar legenda HTML customizada com efeito glitch
function createCustomLegend4(containerId, items) {
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
window.loadDefiRatesQuery4Chart = loadDefiRatesQuery4Chart;
