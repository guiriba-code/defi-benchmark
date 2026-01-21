# Alternativas ao Dune Analytics - Reduzir Uso de Créditos

Com apenas 2.500 créditos no Dune, aqui estão alternativas para buscar dados sem depender da API.

---

## 📊 Estratégias Recomendadas

### 1. **Cachear Dados + Atualização Menos Frequente** ⭐ (Mais Fácil)

**Estratégia:** Rodar queries apenas 1x por dia (ou menos) e servir dados do cache.

**Implementação:**
- Executar scripts de fetch apenas 1x/dia via cron job
- Dados ficam em JSON estático no GitHub Pages
- Site sempre funciona, mesmo sem créditos

**Economia:** De ~120 chamadas/mês para ~4 chamadas/mês (30x menos)

```bash
# Adicionar ao crontab (executa 1x por dia às 6h)
0 6 * * * cd /caminho/do/projeto && python3 fetch_dune_data.py && python3 fetch_dune_data_query2.py && python3 fetch_dune_data_query3.py && python3 fetch_dune_data_query4.py && git add data/*.json && git commit -m "Atualização diária" && git push
```

---

### 2. **Buscar Dados Diretamente On-Chain** ⭐⭐ (Recomendado)

**Estratégia:** Usar web3.py ou ethers.js para ler contratos diretamente.

**Vantagens:**
- ✅ Sem limites de créditos
- ✅ Dados em tempo real
- ✅ Controle total

**Desvantagens:**
- ⚠️ Requer conhecimento de contratos
- ⚠️ Precisa indexar/calcular médias manualmente

**Exemplo para Aave:**
```python
from web3 import Web3
import json

# Conectar à Ethereum
w3 = Web3(Web3.HTTPProvider('https://eth.llamarpc.com'))  # RPC público grátis

# Contrato Aave Lending Pool
AAVE_LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'
USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

# ABI simplificado para getReserveData
abi = [{
    "inputs": [{"internalType": "address", "name": "asset", "type": "address"}],
    "name": "getReserveData",
    "outputs": [{"internalType": "uint256", "name": "currentLiquidityRate", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
}]

contract = w3.eth.contract(address=AAVE_LENDING_POOL, abi=abi)
rate = contract.functions.getReserveData(USDC_ADDRESS).call()
# rate[0] é a taxa de supply (em ray, precisa dividir por 1e27)
supply_rate = rate[0] / 1e27
```

---

### 3. **Usar The Graph** ⭐⭐⭐ (Bom para dados indexados)

**Estratégia:** Usar subgraphs públicos que já indexam dados DeFi.

**Vantagens:**
- ✅ Grátis (até certo limite)
- ✅ Dados já processados
- ✅ GraphQL fácil de usar

**Desvantagens:**
- ⚠️ Nem todos os protocolos têm subgraph
- ⚠️ Pode ter delay

**Exemplo:**
```python
import requests

# The Graph endpoint
url = "https://api.thegraph.com/subgraphs/name/aave/aave-v2-ethereum"

query = """
{
  reserves(where: {symbol: "USDC"}) {
    liquidityRate
    variableBorrowRate
    timestamp
  }
}
"""

response = requests.post(url, json={"query": query})
data = response.json()
```

**Subgraphs úteis:**
- Aave: `aave/aave-v2-ethereum`
- Morpho: Verificar se existe subgraph público
- Ethena: Verificar se existe

---

### 4. **APIs dos Próprios Protocolos** ⭐⭐

Alguns protocolos oferecem APIs públicas:

**Ethena:**
```python
import requests

# API pública do Ethena
response = requests.get("https://api.ethena.fi/api/v1/susde/apy")
data = response.json()
apy = data.get('apy', 0)
```

**Aave:**
```python
# Aave tem API pública (mas limitada)
response = requests.get("https://aave-api-v2.aave.com/data/liquidity/v2?chainId=1")
```

---

### 5. **Webhooks do Dune** ⭐ (Economiza créditos)

**Estratégia:** Configurar webhooks para atualizar apenas quando necessário.

**Como funciona:**
1. Configura webhook no Dune
2. Query roda apenas quando você chama via webhook
3. Site faz polling menos frequente

**Limitação:** Ainda usa créditos, mas de forma mais eficiente.

---

### 6. **Indexador Próprio** ⭐⭐⭐⭐ (Mais complexo, mas sem limites)

**Estratégia:** Criar seu próprio indexador usando:
- **Ethereum RPC** (Alchemy, Infura, ou RPCs públicos)
- **Eventos de contratos** (logs)
- **Banco de dados** (PostgreSQL, MongoDB)
- **Cron jobs** para atualizar

**Tecnologias:**
- Python: `web3.py` + `psycopg2`
- Node.js: `ethers.js` + `prisma`
- Serviços: Alchemy SDK, Moralis

**Exemplo básico:**
```python
from web3 import Web3
import time
from datetime import datetime

w3 = Web3(Web3.HTTPProvider('https://eth.llamarpc.com'))

def fetch_aave_rate():
    # Ler contrato Aave
    # Calcular taxa
    # Salvar em banco/JSON
    pass

# Rodar a cada hora
while True:
    fetch_aave_rate()
    time.sleep(3600)
```

---

## 🎯 Recomendação por Prioridade

### **Curto Prazo (Imediato):**
1. ✅ **Cachear dados** - Rodar queries 1x/dia via cron
2. ✅ **Combinar com APIs públicas** - Ethena, Aave (quando disponível)

### **Médio Prazo (1-2 semanas):**
3. ✅ **Implementar busca on-chain** - Para Aave e Morpho (mais simples)
4. ✅ **Usar The Graph** - Para protocolos com subgraph

### **Longo Prazo (1+ mês):**
5. ✅ **Indexador próprio** - Se precisar de mais controle

---

## 📝 Exemplo: Script Híbrido (Dune + On-Chain)

Criar script que:
- Tenta buscar do Dune (se tiver créditos)
- Se falhar, busca on-chain como fallback
- Cacheia resultado por 24h

```python
import json
import os
from datetime import datetime, timedelta
from web3 import Web3

def fetch_from_dune():
    # Tenta Dune primeiro
    try:
        # ... código do Dune ...
        return data
    except Exception as e:
        print(f"Dune falhou: {e}")
        return None

def fetch_from_chain():
    # Fallback on-chain
    w3 = Web3(Web3.HTTPProvider('https://eth.llamarpc.com'))
    # ... buscar dados ...
    return data

def get_data():
    # Verifica cache
    cache_file = "data/cache.json"
    if os.path.exists(cache_file):
        with open(cache_file) as f:
            cache = json.load(f)
            last_update = datetime.fromisoformat(cache['last_updated'])
            if datetime.now() - last_update < timedelta(hours=24):
                return cache['data']
    
    # Tenta Dune, depois on-chain
    data = fetch_from_dune() or fetch_from_chain()
    
    # Salva cache
    with open(cache_file, 'w') as f:
        json.dump({
            'last_updated': datetime.now().isoformat(),
            'data': data
        }, f)
    
    return data
```

---

## 🔗 Recursos Úteis

- **RPCs Públicos Grátis:**
  - https://llamarpc.com
  - https://publicnode.com
  - https://rpc.ankr.com

- **The Graph Explorer:**
  - https://thegraph.com/explorer

- **ABI de Contratos:**
  - https://etherscan.io (ver "Contract" > "Code")
  - https://github.com/OpenZeppelin/openzeppelin-contracts

---

**Próximo passo:** Quer que eu implemente alguma dessas alternativas? Recomendo começar com **cache + atualização diária** (mais rápido) e depois adicionar **fallback on-chain** para Aave.
