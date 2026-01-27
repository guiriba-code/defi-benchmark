# Lógica de Atualização e Uso das APIs do Dune

## Resumo executivo

| Aspecto | Situação atual |
|--------|-----------------|
| **Frequência** | Não existe agendamento (cron). Atualização só quando alguém executa os scripts ou quando o `server.py` recebe requisição dos JSONs. |
| **Triggers** | (1) Execução manual dos scripts; (2) Servidor customizado: **cada requisição** a um arquivo de dados dispara o fetch daquela query. |
| **Chamadas à API por “atualização completa”** | **4 chamadas** (uma por query). |
| **Chamadas por carregamento do site (com server.py)** | **4 chamadas** — uma por gráfico, pois cada gráfico pede seu JSON e o servidor chama o Dune em toda requisição. |

---

## 1. Quando os dados são atualizados?

### 1.1 Forma atual: sem cron, sem intervalo fixo

- Não há **cron job**, **GitHub Actions** nem outro agendador.
- Atualização acontece só quando:
  1. **Manual:** você roda os scripts (`fetch_dune_data.py`, etc.), ou
  2. **Servidor customizado:** usa `server.py` e o navegador (ou outro cliente) faz **GET** em um dos arquivos de dados.

Ou seja: **não há “a cada X horas” ou “a cada 5 minutos”** programado em código. A doc que fala em “5 minutos” não condiz com o que o `server.py` faz hoje.

### 1.2 Comportamento real do `server.py`

No `server.py`, **toda vez** que chega uma requisição para um destes caminhos:

- `/data/defi_rates_data.json`       → roda `fetch_dune_data.py`
- `/data/defi_rates_query2_data.json` → roda `fetch_dune_data_query2.py`
- `/data/defi_rates_query3_data.json` → roda `fetch_dune_data_query3.py`
- `/data/defi_rates_query4_data.json` → roda `fetch_dune_data_query4.py`

o servidor **executa o script** correspondente e depois serve o arquivo. Não há checagem de “última atualização” nem intervalo mínimo entre fetches.

Consequência:

- **1 página com os 4 gráficos carregados** = **4 requisições** (uma por JSON) = **4 vezes** que os 4 scripts são disparados.
- Se o usuário recarregar a página várias vezes, cada reload = **4 chamadas à API do Dune** de novo.

Ou seja: **o uso da API acompanha diretamente o número de acessos aos JSONs**, e não um “refresh a cada 5 minutos”.

---

## 2. Quanto a API do Dune é usada?

### 2.1 Por “rodada” de atualização

Cada execução “completa” de atualização dos 4 gráficos corresponde a:

| Script | Query ID Dune | Arquivo de saída | Chamadas à API |
|--------|----------------|------------------|----------------|
| `fetch_dune_data.py`        | 6517647 | `defi_rates_data.json`        | 1 |
| `fetch_dune_data_query2.py` | 6590944 | `defi_rates_query2_data.json` | 1 |
| `fetch_dune_data_query3.py` | 6555058 | `defi_rates_query3_data.json` | 1 |
| `fetch_dune_data_query4.py` | 6563351 | `defi_rates_query4_data.json` | 1 |

**Total por “atualização completa”: 4 chamadas à API do Dune.**

### 2.2 Endpoint e tipo de uso

Todos os scripts usam:

- **Método:** `GET`
- **Base:** `https://api.dune.com/api/v1/query/{query_id}/results`
- **Parâmetro:** `limit=1000`
- **Autenticação:** header `x-dune-api-key`

Ou seja, usam o endpoint de **resultados já executados** da query (`/results`), não disparam execução nova da query no Dune. Isso conta como **leitura de resultado em cache** no lado do Dune, mas cada request ainda é uma chamada à API.

### 2.3 Com o servidor customizado ligado

- **1 visita à página (4 gráficos)** → 4 requests aos JSONs → **4 chamadas à API**.
- **10 visitas no dia (ou 10 reloads)** → até **40 chamadas/dia** só pelo site local.
- Em desenvolvimento, com muitos reloads, o número pode subir rápido.

Não há cache “no servidor” entre uma requisição e outra: cada GET no JSON dispara de novo o script e, portanto, nova chamada ao Dune.

---

## 3. Onde está a lógica de atualização no código

| Arquivo | O que faz |
|---------|-----------|
| `server.py` | Para cada GET em `.../defi_rates_data.json` ou `.../defi_rates_queryN_data.json`, chama o subprocess do script correspondente e depois serve o arquivo. **Não** verifica idade do cache nem intervalo mínimo. |
| `fetch_dune_data*.py` | Só fazem:请求 GET na API do Dune → gravam JSON em `data/`. Não têm lógica de “só atualizar se passou X tempo”. |
| `COMO_USAR_SERVIDOR.md` | Diz “atualização a cada 5 minutos”, mas **não existe** essa lógica no `server.py` atual. |

Ou seja: a “lógica” hoje é **sempre atualizar quando o JSON é pedido**, se estiver usando `server.py`.

---

## 4. Recomendações para controlar o uso da API

1. **Cache com tempo mínimo no servidor**  
   Só chamar o Dune se o arquivo em `data/` tiver mais de X horas (ex.: 6h ou 24h). Assim, várias visitas seguidas usam o mesmo JSON e **não** disparam 4 novas chamadas a cada reload.

2. **Atualização em background (ex.: 1x por dia)**  
   Usar um cron (ou script agendado) que rode os 4 scripts, por exemplo às 6h. O site sempre serviria os JSONs do disco; a API seria usada **no máximo 4 vezes por dia**.

3. **Manter atualização “sob demanda” só para admin**  
   Ex.: rota `/admin/refresh` ou script manual para você rodar quando quiser dados frescos. O site normal só leria os arquivos já gravados, sem chamar o Dune em todo acesso.

4. **Variável de ambiente para a API key**  
   A chave do Dune está hoje fixa nos scripts. É mais seguro usar algo como `os.environ.get("DUNE_API_KEY")` e configurar no ambiente do servidor / máquina.

---

## 5. Resumo do uso das APIs

- **Frequência de atualização:** definida só por (a) execução manual ou (b) quantas vezes o site (com `server.py`) é acessado e quantos gráficos carregam.
- **Lógica atual:** “a cada requisição ao JSON, rodar o script e chamar o Dune”.
- **Uso da API:** **4 chamadas** por “rodada” completa; com `server.py`, cada visita que carrega os 4 gráficos = **4 chamadas**.

Para reduzir uso e tornar o comportamento previsível, o próximo passo é introduzir **cache por tempo** no `server.py` e/ou **agendamento (cron)** para atualizar os JSONs no disco independentemente do tráfego do site.
