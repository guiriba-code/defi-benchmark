# Atualização Automática dos Dados

Este guia explica como configurar a atualização automática dos dados do site DeFi, incluindo T-Bills do FRED e dados do Dune Analytics.

**Agendamento configurado: Segunda e Quinta às 00h**

## Configuração Atual

As API keys já estão configuradas nos scripts:
- **FRED API Key:** `eaf5339d101c0216d2f6c733828ea1db`
- **Dune API Key:** Configurada em cada script `fetch_dune_data*.py`

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `fetch_tbills_fred.py` | Busca T-Bills do FRED e atualiza `defi_rates_data.json` |
| `fetch_dune_data.py` | Gráfico 1 - Benchmark (Aave, Ethena, Morpho) |
| `fetch_dune_data_query2.py` | Gráfico 2 - sUSD3, sNUSD, USDai |
| `fetch_dune_data_query3.py` | Gráfico 3 - mNAV |
| `fetch_dune_data_query4.py` | Gráfico 4 - gtUSDa, autoUSD |
| `update_all_data.py` | **Master** - executa todos os scripts acima |

## Atualização Manual

### Atualizar tudo de uma vez

```bash
cd "/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi"
python update_all_data.py
```

### Apenas T-Bills

```bash
cd "/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi"
python fetch_tbills_fred.py
```

### Apenas dados do Dune

```bash
cd "/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi"
python update_all_data.py --dune-only
```

## Automação com Cron (Linux/macOS)

### Configurar crontab para Segunda e Quinta às 00h

```bash
crontab -e
```

Adicione esta linha:

```cron
# Atualizar dados DeFi - Segunda (1) e Quinta (4) às 00h
0 0 * * 1,4 "/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi/cron_update.sh"
```

### Verificar se foi configurado

```bash
crontab -l
```

### Script de atualização (já criado)

O script `cron_update.sh` já está pronto com:
- API keys configuradas
- Logs em `/tmp/defi_logs/`
- Limpeza automática de logs antigos (30 dias)

## Automação com LaunchAgent (macOS - recomendado)

Crie o arquivo `~/Library/LaunchAgents/com.paradigma.defi-update.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.paradigma.defi-update</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi/update_all_data.py</string>
    </array>
    
    <key>WorkingDirectory</key>
    <string>/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi</string>
    
    <key>EnvironmentVariables</key>
    <dict>
        <key>FRED_API_KEY</key>
        <string>SUA_API_KEY_AQUI</string>
    </dict>
    
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>8</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    
    <key>StandardOutPath</key>
    <string>/tmp/defi_update.log</string>
    
    <key>StandardErrorPath</key>
    <string>/tmp/defi_update_error.log</string>
</dict>
</plist>
```

Ative o LaunchAgent:

```bash
launchctl load ~/Library/LaunchAgents/com.paradigma.defi-update.plist
```

Para verificar se está ativo:
```bash
launchctl list | grep paradigma
```

Para desativar:
```bash
launchctl unload ~/Library/LaunchAgents/com.paradigma.defi-update.plist
```

## Frequência Configurada

| Frequência | Cron | Descrição |
|------------|------|-----------|
| **2x/semana (atual)** | `0 0 * * 1,4` | Segunda e Quinta às 00h |

### Outras opções

| Frequência | Cron | Quando Usar |
|------------|------|-------------|
| Diária 8h | `0 8 * * *` | Dados diários |
| 3x/semana | `0 0 * * 1,3,5` | Seg, Qua, Sex às 00h |
| Dias úteis | `0 8 * * 1-5` | Seg a Sex às 8h |

**Nota:** O FRED atualiza T-Bills apenas em dias úteis (seg-sex), exceto feriados americanos.

## Verificar Logs

```bash
# Último log
tail -50 /tmp/defi_update.log

# Monitorar em tempo real
tail -f /tmp/defi_update.log
```

## Troubleshooting

### T-Bills retornando erro

1. Verifique se a API key está configurada:
   ```bash
   echo $FRED_API_KEY
   ```

2. Teste manualmente:
   ```bash
   python fetch_tbills_fred.py
   ```

### Dados não atualizando

1. Verifique se o Python está acessível:
   ```bash
   which python3
   ```

2. Verifique permissões:
   ```bash
   ls -la data/
   ```

### Cron não executando

1. Verifique se o cron está rodando:
   ```bash
   crontab -l
   ```

2. Veja logs do sistema (macOS):
   ```bash
   log show --predicate 'process == "cron"' --last 1h
   ```

## Estrutura de Arquivos de Dados

```
Site DeFi/data/
├── defi_rates_data.json      # Gráfico 1 + T-Bills combinados
├── defi_rates_query2_data.json  # Gráfico 2 (sUSD3, sNUSD, USDai)
├── defi_rates_query3_data.json  # Gráfico 3 (mNAV)
├── defi_rates_query4_data.json  # Gráfico 4 (gtUSDa, autoUSD)
├── tbills_data.json          # T-Bills brutos do FRED
└── mnav_data.json            # mNAV (legado)
```
