/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GRÁFICO 3 - mAPOLLO e mHYPER
 * Cores: Magenta/Pink (tons rosados)
 * ═══════════════════════════════════════════════════════════════════════════
 */

let defiRatesQuery3Chart = null;

// Cores específicas para Query 3 (mAPOLLO/mHYPER/autoUSD/gtUSDa)
const COLORS_Q3 = {
    mapollo: '#00FFFF',  // Cyan
    mhyper: '#008000',   // Verde
    autousd: '#808080',  // Cinza
    gtusda: '#00008B',   // Azul Escuro
};

async function loadDefiRatesQuery3Chart() {
    const canvas = document.getElementById('defi-rates-query3-chart');
    const noteElement = document.getElementById('defi-rates-query3-note');
    
    if (!canvas) {
        console.warn('> Canvas defi-rates-query3-chart não encontrado');
        return;
    }

    try {
        let dataUrl = 'data/defi_rates_query3_data.json';
        
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const port = window.location.port || '8000';
            dataUrl = `http://${window.location.hostname}:${port}/data/defi_rates_query3_data.json?t=${Date.now()}`;
        }
        
        console.log('> Carregando Query 3 (mAPOLLO/mHYPER):', dataUrl);
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
        let mApolloReturns = [];
        let mHyperReturns = [];
        let autoUSDReturns = [];
        let gtUSDAReturns = [];
        
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
                
                const mApollo = row.mAPOLLO_annualized_return_ma7 || row['mAPOLLO annualized_return_ma7'] || row.mapollo_annualized_return_ma7;
                const mHyper = row.mHYPER_annualized_return_ma7 || row['mHYPER annualized_return_ma7'] || row.mhyper_annualized_return_ma7;
                const autoUSD = row['autoUSD annualized_return_ma7'] || row.autoUSD_annualized_return_ma7;
                const gtUSDa = row['gtUSDa annualized_return_ma7'] || row.gtUSDa_annualized_return_ma7;
                
                mApolloReturns.push(mApollo !== null && mApollo !== undefined ? parseFloat(mApollo) : null);
                mHyperReturns.push(mHyper !== null && mHyper !== undefined ? parseFloat(mHyper) : null);
                autoUSDReturns.push(autoUSD !== null && autoUSD !== undefined ? parseFloat(autoUSD) : null);
                gtUSDAReturns.push(gtUSDa !== null && gtUSDa !== undefined ? parseFloat(gtUSDa) : null);
            }
        });

        const lastRow = sortedRows[sortedRows.length - 1];
        if (lastRow && noteElement) {
            const isMobile = window.innerWidth < 768;
            const info = [];
            const mApollo = lastRow.mAPOLLO_annualized_return_ma7 || lastRow['mAPOLLO annualized_return_ma7'];
            const mHyper = lastRow.mHYPER_annualized_return_ma7 || lastRow['mHYPER annualized_return_ma7'];
            const autoUSD = lastRow['autoUSD annualized_return_ma7'] || lastRow.autoUSD_annualized_return_ma7;
            const gtUSDa = lastRow['gtUSDa annualized_return_ma7'] || lastRow.gtUSDa_annualized_return_ma7;
            if (mApollo !== null && mApollo !== undefined) info.push(`mAPOLLO: ${(mApollo * 100).toFixed(1)}%`);
            if (mHyper !== null && mHyper !== undefined) info.push(`mHYPER: ${(mHyper * 100).toFixed(1)}%`);
            if (autoUSD !== null && autoUSD !== undefined) info.push(`autoUSD: ${(autoUSD * 100).toFixed(1)}%`);
            if (gtUSDa !== null && gtUSDa !== undefined) info.push(`gtUSDa: ${(gtUSDa * 100).toFixed(1)}%`);
            
            if (isMobile) {
                noteElement.innerHTML = `<strong>> Última atualização:</strong><br>${info.join('<br>')}`;
            } else {
                noteElement.textContent = `Última atualização: ${info.join(' | ')}`;
            }
        }

        const ctx = canvas.getContext('2d');
        
        if (defiRatesQuery3Chart) {
            defiRatesQuery3Chart.destroy();
        }

        defiRatesQuery3Chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'mAPOLLO',  // Simplificado
                        data: mApolloReturns,
                        borderColor: COLORS_Q3.mapollo,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q3.mapollo,
                        spanGaps: true
                    },
                    {
                        label: 'mHYPER',  // Simplificado
                        data: mHyperReturns,
                        borderColor: COLORS_Q3.mhyper,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q3.mhyper,
                        spanGaps: true
                    },
                    {
                        label: 'autoUSD',
                        data: autoUSDReturns,
                        borderColor: COLORS_Q3.autousd,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q3.autousd,
                        spanGaps: true
                    },
                    {
                        label: 'gtUSDa',
                        data: gtUSDAReturns,
                        borderColor: COLORS_Q3.gtusda,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q3.gtusda,
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
        createCustomLegend3('defi-rates-query3-legend', [
            { label: 'mAPOLLO', color: COLORS_Q3.mapollo },
            { label: 'mHYPER', color: COLORS_Q3.mhyper },
            { label: 'autoUSD', color: COLORS_Q3.autousd },
            { label: 'gtUSDa', color: COLORS_Q3.gtusda }
        ]);

        console.log('> Gráfico 3 (mAPOLLO/mHYPER) carregado ✓');
        
    } catch (error) {
        console.error('> Erro ao carregar gráfico 3:', error);
        if (noteElement) {
            noteElement.textContent = `Erro: ${error.message}`;
            noteElement.style.color = '#cc0000';
        }
    }
}

// Função para criar legenda HTML customizada com efeito glitch
function createCustomLegend3(containerId, items) {
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
window.loadDefiRatesQuery3Chart = loadDefiRatesQuery3Chart;
