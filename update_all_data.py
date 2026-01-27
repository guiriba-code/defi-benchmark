#!/usr/bin/env python3
"""
Script master para atualizar todos os dados do site DeFi.
Executa todos os scripts de fetch em sequência.

Configurado para rodar 2x por semana: segunda e quinta às 00h

Uso:
    python update_all_data.py              # Usa variáveis de ambiente
    python update_all_data.py --tbills-only  # Apenas T-Bills
    python update_all_data.py --dune-only    # Apenas dados Dune
    python update_all_data.py --refresh      # Executa refresh das queries no Dune (consome créditos)
"""

import subprocess
import sys
import os
import json
from datetime import datetime

# Diretório do script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Configuração
DUNE_API_KEY = "W8eHxGbL5IdI2dL9sKwNqAkPrYFoEHjt"
FRED_API_KEY = os.getenv('FRED_API_KEY', 'eaf5339d101c0216d2f6c733828ea1db')

# IDs das queries do Dune
DUNE_QUERIES = {
    "benchmark": 6517647,      # Gráfico 1 - Aave, Ethena, Morpho, T-Bills
    "j3_snusd": 6590944,       # Gráfico 2 - sUSD3, sNUSD, USDai
    "mnav": 6555058,           # Gráfico 3 - mNAV, mAPOLLO, mHYPER, gtUSDa, autoUSD
    "gtusd_autousd": 6563351,  # Gráfico 4 - gtUSDa, autoUSD, Re, OnRe
}


def refresh_dune_query(query_id, description):
    """
    Executa (refresh) uma query no Dune Analytics.
    ATENÇÃO: Isso consome créditos da sua conta Dune.
    """
    try:
        import urllib.request
        import urllib.error
        import ssl
        import time
        
        print(f"   🔄 Executando refresh: {description} (Query {query_id})...")
        
        # 1. Iniciar execução
        url = f"https://api.dune.com/api/v1/query/{query_id}/execute"
        
        req = urllib.request.Request(url, method='POST')
        req.add_header("x-dune-api-key", DUNE_API_KEY)
        req.add_header("Content-Type", "application/json")
        
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, context=ssl_context, timeout=30) as response:
            data = json.loads(response.read().decode())
            execution_id = data.get('execution_id')
        
        if not execution_id:
            print(f"   ❌ Falha ao iniciar execução")
            return False
        
        # 2. Aguardar conclusão (polling)
        status_url = f"https://api.dune.com/api/v1/execution/{execution_id}/status"
        
        for attempt in range(30):  # Máximo 5 minutos (30 * 10s)
            time.sleep(10)
            
            req = urllib.request.Request(status_url)
            req.add_header("x-dune-api-key", DUNE_API_KEY)
            
            with urllib.request.urlopen(req, context=ssl_context, timeout=30) as response:
                status_data = json.loads(response.read().decode())
                state = status_data.get('state', '')
            
            if state == 'QUERY_STATE_COMPLETED':
                print(f"   ✅ Refresh concluído: {description}")
                return True
            elif state in ['QUERY_STATE_FAILED', 'QUERY_STATE_CANCELLED']:
                print(f"   ❌ Refresh falhou: {description} ({state})")
                return False
            
            print(f"      Aguardando... ({state})")
        
        print(f"   ⏱️ Timeout aguardando refresh: {description}")
        return False
        
    except Exception as e:
        print(f"   ❌ Erro no refresh: {e}")
        return False


def run_script(script_name, description, args=None):
    """Executa um script Python e retorna sucesso/falha."""
    script_path = os.path.join(SCRIPT_DIR, script_name)
    
    if not os.path.exists(script_path):
        print(f"   ⚠️ Script não encontrado: {script_name}")
        return False
    
    print(f"   📥 {description}...")
    
    cmd = [sys.executable, script_path]
    if args:
        cmd.extend(args)
    
    try:
        result = subprocess.run(
            cmd,
            cwd=SCRIPT_DIR,
            capture_output=True,
            text=True,
            timeout=120  # 2 minutos de timeout
        )
        
        if result.returncode == 0:
            print(f"   ✅ {description} - OK")
            return True
        else:
            print(f"   ❌ {description} - FALHOU")
            if result.stderr:
                print(f"      Erro: {result.stderr[:200]}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"   ⏱️ {description} - TIMEOUT")
        return False
    except Exception as e:
        print(f"   ❌ {description} - Erro: {e}")
        return False


def update_dune_data(do_refresh=False):
    """Atualiza todos os dados do Dune."""
    print()
    print("📊 ATUALIZANDO DADOS DO DUNE ANALYTICS")
    print("-" * 40)
    
    # Se --refresh, executa as queries primeiro
    if do_refresh:
        print()
        print("🔄 EXECUTANDO REFRESH DAS QUERIES (consome créditos Dune)")
        print("-" * 40)
        refresh_dune_query(DUNE_QUERIES["benchmark"], "Query 1 - Benchmark")
        refresh_dune_query(DUNE_QUERIES["j3_snusd"], "Query 2 - sUSD3, sNUSD, USDai")
        refresh_dune_query(DUNE_QUERIES["mnav"], "Query 3 - mNAV, mAPOLLO, mHYPER")
        refresh_dune_query(DUNE_QUERIES["gtusd_autousd"], "Query 4 - gtUSDa, autoUSD")
        print()
    
    print("📥 BAIXANDO RESULTADOS DAS QUERIES")
    print("-" * 40)
    
    results = []
    
    # Query 1: Benchmark (Aave, Ethena, Morpho, T-Bills)
    results.append(run_script(
        "fetch_dune_data.py",
        "Gráfico 1 - Benchmark"
    ))
    
    # Query 2: sUSD3, sNUSD, USDai
    results.append(run_script(
        "fetch_dune_data_query2.py",
        "Gráfico 2 - sUSD3, sNUSD, USDai"
    ))
    
    # Query 3: mNAV
    results.append(run_script(
        "fetch_dune_data_query3.py",
        "Gráfico 3 - mNAV"
    ))
    
    # Query 4: gtUSDa, autoUSD
    results.append(run_script(
        "fetch_dune_data_query4.py",
        "Gráfico 4 - gtUSDa, autoUSD"
    ))
    
    return all(results)


def update_tbills_data():
    """Atualiza dados de T-Bills do FRED."""
    print()
    print("🏛️ ATUALIZANDO DADOS DE T-BILLS (FRED)")
    print("-" * 40)
    
    # Usa a API key configurada
    os.environ['FRED_API_KEY'] = FRED_API_KEY
    
    return run_script(
        "fetch_tbills_fred.py",
        "T-Bills 3-Month (FRED API)"
    )


def main():
    """Função principal."""
    print("=" * 60)
    print("ATUALIZAÇÃO DE DADOS DO SITE DEFI")
    print(f"Data/Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("Agendamento recomendado: Segunda e Quinta às 00h")
    print("=" * 60)
    
    # Parse argumentos
    tbills_only = '--tbills-only' in sys.argv
    dune_only = '--dune-only' in sys.argv
    do_refresh = '--refresh' in sys.argv
    
    if do_refresh:
        print()
        print("⚠️  MODO REFRESH ATIVADO - Isso consome créditos do Dune!")
    
    success = True
    
    # Atualizar dados do Dune
    if not tbills_only:
        if not update_dune_data(do_refresh=do_refresh):
            success = False
    
    # Atualizar T-Bills
    if not dune_only:
        if not update_tbills_data():
            # T-Bills falhar não é crítico
            print("   ⚠️ T-Bills não atualizados (dados anteriores mantidos)")
    
    # Resumo
    print()
    print("=" * 60)
    if success:
        print("✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO")
    else:
        print("⚠️ ATUALIZAÇÃO CONCLUÍDA COM ALGUNS ERROS")
    print("=" * 60)
    print()
    print("Arquivos de dados em: Site DeFi/data/")
    print("Para visualizar: python -m http.server 8000")
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
