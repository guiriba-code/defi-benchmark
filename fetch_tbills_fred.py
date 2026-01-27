#!/usr/bin/env python3
"""
Script para buscar dados de T-Bills (3-Month Treasury Bill) do FRED API
e salvar em formato JSON para o site DeFi.

O FRED (Federal Reserve Economic Data) fornece dados oficiais do Federal Reserve.
API Key gratuita: https://fred.stlouisfed.org/docs/api/api_key.html
"""

import json
import os
from datetime import datetime, timedelta

# Configuração
FRED_API_KEY = os.getenv('FRED_API_KEY', '')  # Defina via variável de ambiente
SERIES_ID = 'DTB3'  # 3-Month Treasury Bill (Secondary Market Rate)
OUTPUT_FILE = "data/tbills_data.json"
DAYS_HISTORY = 400  # ~13 meses de histórico


def fetch_tbills_fred(api_key=None, series_id=SERIES_ID, days=DAYS_HISTORY):
    """
    Busca dados de T-Bills do FRED API.
    
    Series IDs disponíveis:
    - DTB3: 3-Month Treasury Bill (recomendado)
    - DTB6: 6-Month Treasury Bill
    - DGS1: 1-Year Treasury Rate
    - DGS2: 2-Year Treasury Rate
    - DGS10: 10-Year Treasury Rate
    
    Returns:
        Lista de dicts com {date, tbill_rate}
    """
    if not api_key:
        api_key = FRED_API_KEY
    
    if not api_key:
        print("❌ ERRO: API Key do FRED não configurada!")
        print("   Obtenha grátis em: https://fred.stlouisfed.org/docs/api/api_key.html")
        print("   Configure via: export FRED_API_KEY=sua_chave")
        return None
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    
    url = "https://api.stlouisfed.org/fred/series/observations"
    params = {
        'series_id': series_id,
        'api_key': api_key,
        'file_type': 'json',
        'observation_start': start_date.strftime('%Y-%m-%d'),
        'observation_end': end_date.strftime('%Y-%m-%d'),
        'sort_order': 'desc'  # Mais recente primeiro
    }
    
    try:
        # Tenta com requests primeiro
        try:
            import requests
            print(f"🔄 Buscando T-Bills do FRED (série {series_id})...")
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()
        except ImportError:
            # Fallback para urllib
            import urllib.request
            import urllib.parse
            
            print(f"🔄 Buscando T-Bills do FRED via urllib (série {series_id})...")
            query_string = urllib.parse.urlencode(params)
            full_url = f"{url}?{query_string}"
            
            with urllib.request.urlopen(full_url, timeout=30) as response:
                data = json.loads(response.read().decode())
        
        observations = data.get('observations', [])
        
        if not observations:
            print("⚠️ Nenhuma observação retornada pelo FRED")
            return None
        
        results = []
        for obs in observations:
            date_str = obs.get('date', '')
            value = obs.get('value', '.')
            
            # FRED usa '.' para valores faltantes (fins de semana, feriados)
            if value != '.' and date_str:
                try:
                    # FRED retorna em percentual (ex: 4.35 = 4.35%)
                    # Convertemos para decimal (ex: 0.0435)
                    rate = float(value) / 100
                    
                    # Formato de data compatível com o site
                    formatted_date = f"{date_str} 00:00:00.000 UTC"
                    
                    results.append({
                        'date': formatted_date,
                        'tbill_rate': rate
                    })
                except ValueError:
                    continue
        
        print(f"✅ {len(results)} registros de T-Bills encontrados")
        return results
        
    except Exception as e:
        print(f"❌ Erro ao buscar dados do FRED: {e}")
        return None


def save_tbills_data(data):
    """Salva dados de T-Bills em arquivo JSON separado."""
    if not data:
        return False
    
    # Criar diretório se não existir
    os.makedirs("data", exist_ok=True)
    
    output = {
        "last_updated": datetime.now().isoformat(),
        "source": "FRED API",
        "series_id": SERIES_ID,
        "series_name": "3-Month Treasury Bill (Secondary Market Rate)",
        "data": data
    }
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Dados salvos em {OUTPUT_FILE}")
    return True


def merge_tbills_with_defi_rates(tbills_data, defi_rates_file="data/defi_rates_data.json"):
    """
    Combina dados de T-Bills do FRED com dados DeFi do Dune.
    Atualiza tbill_rate e calcula spreads.
    """
    if not tbills_data:
        return False
    
    # Criar índice de T-Bills por data (apenas YYYY-MM-DD)
    tbills_by_date = {}
    for item in tbills_data:
        date_str = item['date'].split(' ')[0]  # "2026-01-24"
        tbills_by_date[date_str] = item['tbill_rate']
    
    # Carregar dados DeFi existentes
    if not os.path.exists(defi_rates_file):
        print(f"⚠️ Arquivo {defi_rates_file} não encontrado")
        return False
    
    with open(defi_rates_file, 'r', encoding='utf-8') as f:
        defi_data = json.load(f)
    
    rows = defi_data.get('data', [])
    updated_count = 0
    
    for row in rows:
        date_str = row.get('date', '').split(' ')[0]
        
        if date_str in tbills_by_date:
            tbill_rate = tbills_by_date[date_str]
            row['tbill_rate'] = tbill_rate
            
            # Calcular spreads (taxa DeFi - taxa T-Bill)
            aave_rate = row.get('aave_supply_rate')
            ethena_rate = row.get('ethena_susde_rate')
            morpho_rate = row.get('morpho_supply_rate')
            
            if aave_rate is not None:
                row['aave_tbill_spread'] = round(aave_rate - tbill_rate, 4)
            if ethena_rate is not None:
                row['ethena_tbill_spread'] = round(ethena_rate - tbill_rate, 4)
            if morpho_rate is not None:
                row['morpho_tbill_spread'] = round(morpho_rate - tbill_rate, 4)
            
            updated_count += 1
        else:
            # Dias sem dados do FRED (fins de semana/feriados)
            # Usa o último valor conhecido (forward fill)
            pass
    
    # Aplicar forward fill para preencher fins de semana
    rows_sorted = sorted(rows, key=lambda x: x.get('date', ''))
    last_tbill = None
    
    for row in rows_sorted:
        if row.get('tbill_rate') is not None:
            last_tbill = row['tbill_rate']
        elif last_tbill is not None:
            row['tbill_rate'] = last_tbill
            
            # Recalcular spreads
            aave_rate = row.get('aave_supply_rate')
            ethena_rate = row.get('ethena_susde_rate')
            morpho_rate = row.get('morpho_supply_rate')
            
            if aave_rate is not None:
                row['aave_tbill_spread'] = round(aave_rate - last_tbill, 4)
            if ethena_rate is not None:
                row['ethena_tbill_spread'] = round(ethena_rate - last_tbill, 4)
            if morpho_rate is not None:
                row['morpho_tbill_spread'] = round(morpho_rate - last_tbill, 4)
    
    # Salvar dados atualizados
    defi_data['tbills_last_updated'] = datetime.now().isoformat()
    defi_data['tbills_source'] = 'FRED API (DTB3)'
    
    with open(defi_rates_file, 'w', encoding='utf-8') as f:
        json.dump(defi_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ {updated_count} registros atualizados com T-Bills em {defi_rates_file}")
    return True


def main():
    """Função principal - busca T-Bills e atualiza dados do site."""
    import sys
    
    # Verifica API key
    api_key = FRED_API_KEY
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    
    if not api_key:
        print("=" * 60)
        print("CONFIGURAÇÃO NECESSÁRIA")
        print("=" * 60)
        print()
        print("Uso: python fetch_tbills_fred.py [FRED_API_KEY]")
        print()
        print("Ou configure a variável de ambiente:")
        print("  export FRED_API_KEY=sua_chave")
        print("  python fetch_tbills_fred.py")
        print()
        print("Obtenha sua API key grátis em:")
        print("  https://fred.stlouisfed.org/docs/api/api_key.html")
        print()
        print("=" * 60)
        sys.exit(1)
    
    print("=" * 60)
    print("ATUALIZANDO DADOS DE T-BILLS (3-Month Treasury Bill)")
    print("=" * 60)
    print()
    
    # 1. Buscar T-Bills do FRED
    tbills_data = fetch_tbills_fred(api_key)
    
    if tbills_data:
        # 2. Salvar arquivo separado de T-Bills
        save_tbills_data(tbills_data)
        
        # 3. Atualizar dados DeFi com T-Bills
        print()
        print("Atualizando dados DeFi com T-Bills...")
        merge_tbills_with_defi_rates(tbills_data)
        
        print()
        print("=" * 60)
        print("✅ ATUALIZAÇÃO CONCLUÍDA")
        print("=" * 60)
        print()
        print("Arquivos atualizados:")
        print(f"  • {OUTPUT_FILE} (dados brutos de T-Bills)")
        print(f"  • data/defi_rates_data.json (dados combinados)")
        
        if tbills_data:
            latest = tbills_data[0]
            print()
            print(f"Último dado: {latest['date'].split(' ')[0]}")
            print(f"Taxa T-Bill: {latest['tbill_rate']*100:.2f}%")
    else:
        print()
        print("❌ Falha ao buscar dados de T-Bills")
        sys.exit(1)


if __name__ == "__main__":
    main()
