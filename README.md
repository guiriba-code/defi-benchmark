# DeFi Benchmark - Comparativo de Rendas Dolarizadas

Dashboard interativo para comparação de rendimentos em protocolos DeFi e ativos tokenizados. Dados atualizados via Dune Analytics.

**Site ao vivo:** [rendadolarizada.vercel.app](https://rendadolarizada.vercel.app)

---

## O que é este projeto?

Este site apresenta uma análise comparativa de diferentes oportunidades de renda em dólar no ecossistema DeFi e RWA (Real World Assets), permitindo visualizar e comparar yields de:

- Protocolos de lending (Aave, Morpho)
- Stablecoins com rendimento (Ethena, sUSD3, sNUSD, USDai)
- Vaults curados (mAPOLLO, mHYPER, autoUSD, gtUSDa)
- Ativos reais tokenizados (OnRe, Re, PayFi Vault, Rain Vault)

---

## Seções do Dashboard

### 1. Benchmark
Comparativo das principais taxas de referência do mercado DeFi:
- **Aave** - Taxa de supply em USDC
- **Ethena** - Rendimento do sUSDe
- **Morpho** - Taxa de supply otimizada
- **Juros Títulos US** - Taxa de T-Bills como referência tradicional

### 2. Stablecoins Exóticas
Stablecoins alternativas com mecanismos de rendimento diferenciados:
- **sUSD3** - 3jane
- **sNUSD** - Neutrl Finance
- **USDai** - USD.ai Protocol

### 3. Operações Curadas por Terceiros
Vaults gerenciados por terceiros que otimizam estratégias de yield:
- **mAPOLLO** - Midas Protocol
- **mHYPER** - Midas Protocol
- **autoUSD** - Auto Finance
- **gtUSDa** - Gauntlet USD Alpha

### 4. Garantidos por Ativos Reais Tokenizados
Rendimentos lastreados em ativos do mundo real:
- **OnRe** - OnRe Finance
- **Re** - Re Protocol (Insurance Alpha)
- **PayFi Vault** - Credit Coop
- **Rain Vault** - Credit Coop

---

## Início Rápido

### Rodar localmente (no seu terminal)

O site **precisa** de um servidor HTTP — abrir o `index.html` direto (file://) faz os gráficos falharem ao carregar os dados.

**No Terminal** (Terminal.app, iTerm ou terminal do Cursor), dentro da pasta do projeto:

```bash
cd "Site DeFi"    # ou o caminho completo até a pasta Site DeFi
./rodar-site.sh
```

**Ou**, sem o script:

```bash
cd "Site DeFi"
python3 -m http.server 8000
```

Deixe o terminal aberto e abra no navegador: **http://localhost:8000**

Se a pasta estiver em outro lugar (ex.: workspace Taxas Médias):

```bash
cd "/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi"
./rodar-site.sh
```

Se `http://localhost:8000` não abrir, veja **TROUBLESHOOTING.md**.

### Verificar se está em dia com o GitHub

```bash
git fetch origin
git status          # Ver se há commits à frente/atrás de origin/main
git log -1 --oneline HEAD
git log -1 --oneline origin/main
```

Se `Your branch is up to date with 'origin/main'` e não houver alterações locais importantes, você está alinhado. Alterações locais aparecem em `git status`.

### Atualizar dados do Dune Analytics

```bash
# Opção 1: atualizar os 4 gráficos de uma vez (4 chamadas à API)
./atualizar_todos_dados.sh

# Opção 2: rodar cada script separadamente
python3 fetch_dune_data.py
python3 fetch_dune_data_query2.py
python3 fetch_dune_data_query3.py
python3 fetch_dune_data_query4.py
```

**Frequência e uso da API:** não há cron nem agendamento. Cada execução desses scripts faz **4 chamadas** à API do Dune (uma por query). Se usar o `server.py`, cada carregamento da página que pede os 4 JSONs dispara **4 chamadas**. Detalhes em `LOGICA_ATUALIZACAO_E_USO_APIS.md`.

---

## Estrutura do Projeto

```
defi-benchmark/
├── index.html                    # Página principal
├── css/
│   └── style.css                 # Estilos (estética ASCII)
├── js/
│   ├── main.js                   # Animações e scroll
│   ├── defi-rates-chart.js       # Gráfico 1 - Benchmark
│   ├── defi-rates-query2-chart.js # Gráfico 2 - Stablecoins
│   ├── defi-rates-query3-chart.js # Gráfico 3 - Vaults Curados
│   └── defi-rates-query4-chart.js # Gráfico 4 - RWA
├── data/
│   ├── defi_rates_data.json      # Dados Benchmark
│   ├── defi_rates_query2_data.json
│   ├── defi_rates_query3_data.json
│   └── defi_rates_query4_data.json
├── fetch_dune_data*.py           # Scripts de fetch
└── README.md
```

---

## Queries do Dune Analytics

| Seção | Query ID | Dados |
|-------|----------|-------|
| Benchmark | 6517647 | Aave, Ethena, Morpho, T-Bills |
| Stablecoins Exóticas | 6554864 | sNUSD, USDai |
| Operações Curadas | 6555058 | mAPOLLO, mHYPER, autoUSD, gtUSDa |
| Ativos Reais | 6563351 | OnRe, Re, PayFi Vault, Rain Vault |

---

## Tecnologias

- **Chart.js** - Gráficos interativos
- **Dune Analytics API** - Fonte de dados on-chain
- **Vanilla JS** - Sem frameworks
- **CSS Animations** - Estética ASCII/terminal

---

## Links dos Protocolos

| Protocolo | Link |
|-----------|------|
| Aave | [app.aave.com](https://app.aave.com/) |
| Ethena | [ethena.fi](https://ethena.fi/) |
| Morpho | [app.morpho.org](https://app.morpho.org/) |
| sNUSD | [app.neutrl.fi](https://app.neutrl.fi/protocol) |
| USDai | [app.usd.ai](https://app.usd.ai/) |
| mAPOLLO | [midas.app/mapollo](https://midas.app/mapollo) |
| mHYPER | [midas.app/mhyper](https://midas.app/mhyper) |
| autoUSD | [app.auto.finance](https://app.auto.finance/) |
| gtUSDa | [app.gauntlet.xyz](https://app.gauntlet.xyz/vaults/gtusda) |
| OnRe | [app.onre.finance](https://app.onre.finance/earn) |
| Re | [app.re.xyz](https://app.re.xyz/reusde) |
| PayFi Vault | [app.creditcoop.xyz](https://app.creditcoop.xyz/earn/details/0x6c99a74a62aaf2e6aa3ff08ce7661d5c86e01dbc) |
| Rain Vault | [app.creditcoop.xyz](https://app.creditcoop.xyz/earn/details/0xdfb94de0838b1989fbbb800042b17a6404692001) |

---

**Desenvolvido por [Paradigma Education](https://paradigma.education)**
