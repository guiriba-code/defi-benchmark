/**
 * ═══════════════════════════════════════════════════════════════════════════
 * GRÁFICO 4 - Ativos Reais Tokenizados (OnRe, Re, PayFi Vault, Rain Vault)
 * ═══════════════════════════════════════════════════════════════════════════
 */

let defiRatesQuery4Chart = null;

// Cores específicas para Query 4
const COLORS_Q4 = {
    onre: '#7FFFD4',      // Aquamarine
    re: '#FFA500',        // Laranja
    payfi: '#9932CC',     // Dark Orchid (roxo)
    rain: '#20B2AA',      // Light Sea Green (verde-azulado)
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
        let payfiApr = [];
        let rainApr = [];
        
        // Campos dos vaults
        const PAYFI_FIELD = 'avg_total_yield_address_0x6c99a74a62aaf2e6aa3ff08ce7661d5c86e01dbc';
        const RAIN_FIELD = 'avg_total_yield_address_0xdfb94de0838b1989fbbb800042b17a6404692001';
        
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
                
                onReApr.push(row.OnRe_APR_7D !== null && row.OnRe_APR_7D !== undefined ? parseFloat(row.OnRe_APR_7D) : null);
                reApr.push(row.Re_APR_7D !== null && row.Re_APR_7D !== undefined ? parseFloat(row.Re_APR_7D) : null);
                payfiApr.push(row[PAYFI_FIELD] !== null && row[PAYFI_FIELD] !== undefined ? parseFloat(row[PAYFI_FIELD]) : null);
                rainApr.push(row[RAIN_FIELD] !== null && row[RAIN_FIELD] !== undefined ? parseFloat(row[RAIN_FIELD]) : null);
            }
        });

        // Buscar o valor mais recente não-nulo para cada campo
        if (noteElement) {
            const isMobile = window.innerWidth < 768;
            const info = [];
            
            // Links das operações
            const LINKS = {
                onre: 'https://app.onre.finance/earn',
                re: 'https://app.re.xyz/reusde',
                payfi: 'https://app.creditcoop.xyz/earn/details/0x6c99a74a62aaf2e6aa3ff08ce7661d5c86e01dbc',
                rain: 'https://app.creditcoop.xyz/earn/details/0xdfb94de0838b1989fbbb800042b17a6404692001'
            };
            
            // Função para encontrar o último valor não-nulo
            const findLastValue = (field) => {
                for (let i = sortedRows.length - 1; i >= 0; i--) {
                    const val = sortedRows[i][field];
                    if (val !== null && val !== undefined) {
                        return val;
                    }
                }
                return null;
            };
            
            const onReVal = findLastValue('OnRe_APR_7D');
            const reVal = findLastValue('Re_APR_7D');
            const payfiVal = findLastValue(PAYFI_FIELD);
            const rainVal = findLastValue(RAIN_FIELD);
            
            if (onReVal !== null) info.push(`<a href="${LINKS.onre}" target="_blank">OnRe</a>: ${(onReVal * 100).toFixed(1)}%`);
            if (reVal !== null) info.push(`<a href="${LINKS.re}" target="_blank">Re</a>: ${(reVal * 100).toFixed(1)}%`);
            if (payfiVal !== null) info.push(`<a href="${LINKS.payfi}" target="_blank">PayFi Vault</a>: ${(payfiVal * 100).toFixed(1)}%`);
            if (rainVal !== null) info.push(`<a href="${LINKS.rain}" target="_blank">Rain Vault</a>: ${(rainVal * 100).toFixed(1)}%`);
            
            if (isMobile) {
                noteElement.innerHTML = `<strong>> Última atualização:</strong><br>${info.join('<br>')}`;
            } else {
                noteElement.innerHTML = `> Última atualização: ${info.join(' | ')}`;
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
                        label: 'OnRe',
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
                        label: 'Re',
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
                    },
                    {
                        label: 'PayFi Vault',
                        data: payfiApr,
                        borderColor: COLORS_Q4.payfi,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q4.payfi,
                        spanGaps: true
                    },
                    {
                        label: 'Rain Vault',
                        data: rainApr,
                        borderColor: COLORS_Q4.rain,
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        fill: false,
                        stepped: 'before',
                        borderJoinStyle: 'round',
                        borderCapStyle: 'round',
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: COLORS_Q4.rain,
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
            { label: 'Re', color: COLORS_Q4.re },
            { label: 'PayFi Vault', color: COLORS_Q4.payfi },
            { label: 'Rain Vault', color: COLORS_Q4.rain }
        ]);

        console.log('> Gráfico 4 (Ativos Reais Tokenizados) carregado ✓');
        
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
