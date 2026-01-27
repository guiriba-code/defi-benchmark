# Documentação do Site DeFi – Queries, APIs, Automação e Formatação

Este documento descreve como funcionam as fontes de dados, a automação das atualizações e a formatação visual do site.

---

## 1. Queries, APIs e Automação

### 1.1 Visão geral

O site consome dados de duas fontes:

| Fonte | Uso | Atualização |
|-------|-----|--------------|
| **Dune Analytics** | Gráficos 1 a 4 (taxas DeFi, mNAV, etc.) | Via API, com *refresh* das queries |
| **FRED (Federal Reserve)** | Taxa dos T-Bills (3 meses) para o Gráfico 1 | Via API, depois merge com dados do Dune |

A atualização é **automática** duas vezes por semana: **segunda e quinta às 00h**.

---

### 1.2 O que dispara a automação (segunda e quinta às 00h)

O agendamento é feito pelo **cron** do sistema operacional (macOS/Linux).

**Configuração no crontab:**

```cron
# Atualizar dados DeFi - Segunda (1) e Quinta (4) às 00h
0 0 * * 1,4 "/caminho/para/Site DeFi/cron_update.sh"
```

- `0 0` = 00:00 (meia-noite)
- `* * 1,4` = todo mês, todo ano, nos dias da semana 1 (segunda) e 4 (quinta)

O **único** agendamento é este: não há outro script ou serviço definido para seg/qui 00h. Quem “aciona” as atualizações é o cron ao chamar `cron_update.sh` nesses horários.

**Script chamado:** `cron_update.sh`

- Define `FRED_API_KEY` e o diretório do projeto
- Redireciona saída para um log em `/tmp/defi_logs/`
- Chama: `python3 update_all_data.py --refresh`
- Remove logs com mais de 30 dias

Ou seja: **o cron + `cron_update.sh`** são o que fazem as atualizações rodarem de segunda e quinta às 00h.

---

### 1.3 Fluxo da atualização (o que roda quando o cron dispara)

Quando o cron chama `cron_update.sh`, a sequência é:

```
cron (seg/qui 00h)
    → cron_update.sh
        → python3 update_all_data.py --refresh
```

Dentro de `update_all_data.py --refresh`:

1. **Refresh das queries no Dune** (consome créditos)
   - Para cada query, chama a API do Dune para *executar* a query.
   - Endpoint: `POST https://api.dune.com/api/v1/query/{id}/execute`
   - Depois faz polling em `GET .../execution/{id}/status` até `QUERY_STATE_COMPLETED`.
   - IDs: 6517647 (Gráfico 1), 6590944 (Gráfico 2), 6555058 (Gráfico 3), 6563351 (Gráfico 4).

2. **Download dos resultados do Dune**
   - `fetch_dune_data.py` → `data/defi_rates_data.json` (Gráfico 1)
   - `fetch_dune_data_query2.py` → `data/defi_rates_query2_data.json` (Gráfico 2)
   - `fetch_dune_data_query3.py` → `data/defi_rates_query3_data.json` (Gráfico 3)
   - `fetch_dune_data_query4.py` → `data/defi_rates_query4_data.json` (Gráfico 4)

3. **T-Bills (FRED) e merge com o Gráfico 1**
   - `fetch_tbills_fred.py` é chamado por `update_all_data.py`.
   - Esse script faz as duas coisas descritas na seção 1.5 (busca no FRED e merge).

Resumo: **segunda e quinta às 00h** o cron chama `cron_update.sh` → `update_all_data.py --refresh` → refresh no Dune → fetch dos 4 gráficos → fetch T-Bills + merge. Não há outro “gatilho” para esse horário.

---

### 1.4 Queries do Dune e arquivos de dados

| Gráfico | Query ID | Arquivo JSON | Conteúdo |
|---------|----------|--------------|----------|
| 1 – Benchmark | 6517647 | `defi_rates_data.json` | Aave, Ethena, Morpho, T-Bills (após merge) |
| 2 – Stablecoins exóticas | 6590944 | `defi_rates_query2_data.json` | sUSD3, sNUSD, USDai |
| 3 – Operações curadas | 6555058 | `defi_rates_query3_data.json` | mNAV, mAPOLLO, mHYPER, gtUSDa, autoUSD |
| 4 – Ativos reais | 6563351 | `defi_rates_query4_data.json` | gtUSDa, autoUSD, Re, OnRe |

As APIs usadas são as REST do Dune (`https://api.dune.com/...`) com a chave em header `x-dune-api-key`.

---

### 1.5 Como as taxas de T-Bills são atualizadas

As taxas de T-Bills não vêm do Dune. Elas vêm do **FRED** e são colocadas no Gráfico 1 por um **merge** em `fetch_tbills_fred.py`.

**Passo a passo:**

1. **Busca no FRED**
   - API: `https://api.stlouisfed.org/fred/series/observations`
   - Série: **DTB3** (3-Month Treasury Bill, Secondary Market Rate)
   - Parâmetros: `api_key`, `observation_start` / `observation_end` (últimos ~400 dias), `file_type=json`
   - A taxa vem em percentual (ex.: 4.35); o script converte para decimal (0.0435).

2. **Salvar série bruta**
   - Os pontos (data + taxa) são gravados em `data/tbills_data.json` para uso e auditoria.

3. **Merge com o Gráfico 1**
   - O script lê `data/defi_rates_data.json` (resultado do Dune para o Gráfico 1).
   - Para cada linha, pega a data (YYYY-MM-DD) e:
     - Se existir taxa do FRED na mesma data: preenche `tbill_rate` e recalcula `aave_tbill_spread`, `ethena_tbill_spread`, `morpho_tbill_spread`.
     - Em datas sem dado do FRED (ex.: fins de semana), usa **forward fill**: repete o último `tbill_rate` conhecido e recalcula os spreads.
   - Grava de volta em `data/defi_rates_data.json`.

Com isso, o Gráfico 1 passa a exibir T-Bills atualizados sempre que `fetch_tbills_fred.py` roda (nesse projeto, nas execuções de `update_all_data.py` aos seg/qui 00h).

**Resumo:** T-Bills = FRED (DTB3) → `tbills_data.json` + merge em `defi_rates_data.json`. A “atualização” das T-Bills no site é essa passagem de dados do FRED para o JSON do Gráfico 1, feita dentro do mesmo ciclo de automação que atualiza o Dune.

---

### 1.6 Resumo da automação

| O quê | Como |
|-------|------|
| **Quando roda** | Segunda e quinta às 00h |
| **Quem dispara** | Cron do SO, linha `0 0 * * 1,4` apontando para `cron_update.sh` |
| **O que executa** | `cron_update.sh` → `python3 update_all_data.py --refresh` |
| **Dune** | Refresh das 4 queries via API, depois download para os 4 JSON em `data/` |
| **T-Bills** | `fetch_tbills_fred.py`: busca FRED (DTB3) → `tbills_data.json` + merge em `defi_rates_data.json` |

Logs: `/tmp/defi_logs/update_YYYYMMDD_HHMMSS.log`.

---

## 2. Formatação do texto e do site

### 2.1 Estética geral

O site segue uma **estética “terminal/ASCII”**:

- Fundo branco, texto preto
- Fonte monoespaçada: `Monaco`, `Menlo`, `Lucida Console`, `Courier New`
- Elementos que remetem a interface de linha de comando: `>`, `//`, blocos de texto corrido
- Animações leves de “glitch” em títulos e rótulos, inspiradas em referências como ertdfgcvb e nfinitepaper.com

Isso é definido em `css/style.css` (variáveis em `:root`, regras de `.glitch-text`, `.glitch-subtle`, etc.) e na estrutura do `index.html`.

---

### 2.2 Estrutura do conteúdo

- **Navegação:** menu lateral (`> índice`) com links âncora para as quatro seções.
- **Seções:** cada gráfico vive em uma `<section>` com `id="grafico-1"` … `id="grafico-4"`.
- **Dentro de cada seção:**
  - `h3.chart-title` – título em minúsculas (ex.: “benchmark”, “stablecoins exóticas”).
  - Área do gráfico: legenda + canvas (Chart.js) + nota “Última atualização” (e links quando houver).
  - `div.chart-description.glitch-subtle`: parágrafos e listas que explicam o gráfico.

O “texto” que o usuário lê vem desse bloco de descrição no HTML, tipado em `index.html`. A referência editorial para esse conteúdo é o arquivo **`Textos Gráficos.md`**: é nele que ficam os textos por seção, e as alterações desejadas (como “São operações que demandam KYC” ou “sUSD3 (3jane)”) devem ser replicadas no HTML para aparecer no site.

---

### 2.3 Convenções de texto no HTML

- **Títulos de seção:** minúsculas, estilo “código” (`benchmark`, `stablecoins exóticas`, etc.).
- **Nomes de protocolos/produtos:** em `<strong>` quando são o foco da frase (Aave, Morpho, sUSD3, etc.).
- **Termos em inglês / jargão:** em `<em>` (ex.: *on-chain*, *scoring*, *benchmarks*).
- **Links externos:** `<a href="..." target="_blank">` para documentação, apps (ex.: 3jane Supply) e dashboards.

Ou seja: a “formatação do texto” no site é essa combinação de tags semânticas (strong, em, a) e classes CSS (glitch-subtle, chart-title, etc.), aplicada ao conteúdo que está em `index.html` e espelhado em `Textos Gráficos.md`.

---

### 2.4 Gráficos e “Última atualização”

Cada gráfico é desenhado por um script em `js/` (por exemplo, `defi-rates-query2-chart.js`). Esses scripts:

- Carregam o JSON correspondente em `data/`.
- Montam um Chart.js (linhas, cores, eixos).
- Preenchem a “Última atualização” com valores recentes e, quando definido, com links (ex.: sUSD3 → 3jane Supply, sNUSD → Neutrl, USDai → app.usd.ai).

As cores e rótulos das séries podem ser definidos nos próprios arquivos JS (ex.: `COLORS_Q2`, `label: 'sUSD3'`), em paralelo ao que está no HTML/CSS.

---

### 2.5 Onde ajustar texto e formatação

| Objetivo | Onde alterar |
|----------|---------------|
| Textos das seções (parágrafos, listas) | `index.html` (e manter `Textos Gráficos.md` como referência) |
| Estilo visual, cores, fontes, glitch | `css/style.css` |
| Títulos, estrutura do layout | `index.html` |
| Rótulos e links abaixo dos gráficos | Arquivos em `js/` (ex.: `defi-rates-query2-chart.js` para sUSD3, sNUSD, USDai) |

---

## Referência rápida

- **Automação:** cron `0 0 * * 1,4` → `cron_update.sh` → `update_all_data.py --refresh` → Dune (refresh + fetch) + FRED (T-Bills) + merge em `defi_rates_data.json`.
- **T-Bills:** FRED série DTB3, em `fetch_tbills_fred.py`; merge em `data/defi_rates_data.json`.
- **Textos do site:** `index.html` + `Textos Gráficos.md`; formatação em `css/style.css` e, para gráficos, em `js/*.js`.
