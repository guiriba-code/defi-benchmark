#!/usr/bin/env python3
"""
Script para buscar dados da segunda query do Dune Analytics (Query ID: 6590944)
Mostra dados sobre J3, sNUSD e USDai (APY)
Usa o cliente oficial do Dune, requests, ou urllib como fallback
"""

import json
import os
from datetime import datetime

# Configuração
DUNE_API_KEY = "W8eHxGbL5IdI2dL9sKwNqAkPrYFoEHjt"
QUERY_ID = 6590944
OUTPUT_FILE = "data/defi_rates_query2_data.json"

def fetch_with_urllib():
    """Usa urllib (biblioteca padrão do Python)"""
    try:
        import urllib.request
        import urllib.error
        import ssl
        
        url = f"https://api.dune.com/api/v1/query/{QUERY_ID}/results?limit=1000"
        
        print(f"🔄 Buscando dados via API REST com urllib (Query ID: {QUERY_ID})...")
        
        req = urllib.request.Request(url)
        req.add_header("x-dune-api-key", DUNE_API_KEY)
        req.add_header("Content-Type", "application/json")
        
        # Criar contexto SSL que não verifica certificado (apenas para desenvolvimento)
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        with urllib.request.urlopen(req, context=ssl_context) as response:
            data = json.loads(response.read().decode())
            
            if "result" in data and "rows" in data["result"]:
                rows = data["result"]["rows"]
                print(f"✅ {len(rows)} registros encontrados")
                
                # Criar diretório se não existir
                os.makedirs("data", exist_ok=True)
                
                # Salvar dados
                with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                    json.dump({
                        "last_updated": datetime.now().isoformat(),
                        "query_id": QUERY_ID,
                        "data": rows
                    }, f, indent=2, ensure_ascii=False)
                
                print(f"✅ Dados salvos em {OUTPUT_FILE}")
                if rows:
                    print(f"📊 Primeiros registros:")
                    for i, row in enumerate(rows[:3]):
                        print(f"   {i+1}. {row}")
                
                return rows
            else:
                print("⚠️ Resposta da API não contém dados esperados")
                print(f"Resposta: {json.dumps(data, indent=2)}")
                return None
                
    except Exception as e:
        print(f"❌ Erro ao buscar dados com urllib: {e}")
        return None

def fetch_with_dune_client():
    """Tenta usar o cliente oficial do Dune"""
    try:
        from dune_client.client import DuneClient
        
        print(f"🔄 Buscando dados do Dune Analytics usando cliente oficial (Query ID: {QUERY_ID})...")
        
        dune = DuneClient(DUNE_API_KEY)
        query_result = dune.get_latest_result(QUERY_ID)
        
        if query_result and hasattr(query_result, 'result') and query_result.result:
            rows = query_result.result.rows if hasattr(query_result.result, 'rows') else []
            
            print(f"✅ {len(rows)} registros encontrados")
            
            # Criar diretório se não existir
            os.makedirs("data", exist_ok=True)
            
            # Salvar dados
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "last_updated": datetime.now().isoformat(),
                    "query_id": QUERY_ID,
                    "data": rows
                }, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Dados salvos em {OUTPUT_FILE}")
            return rows
        else:
            print("⚠️ Nenhum dado retornado")
            return None
            
    except ImportError:
        print("⚠️ Cliente Dune não instalado, tentando com requests...")
        return fetch_with_requests()
    except Exception as e:
        print(f"⚠️ Erro com cliente Dune: {e}")
        print("Tentando com requests...")
        return fetch_with_requests()

def fetch_with_requests():
    """Fallback usando requests"""
    try:
        import requests
        
        url = f"https://api.dune.com/api/v1/query/{QUERY_ID}/results"
        headers = {
            "x-dune-api-key": DUNE_API_KEY,
            "Content-Type": "application/json"
        }
        
        params = {"limit": 1000}
        
        print(f"🔄 Buscando dados via API REST com requests (Query ID: {QUERY_ID})...")
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        data = response.json()
        
        if "result" in data and "rows" in data["result"]:
            rows = data["result"]["rows"]
            print(f"✅ {len(rows)} registros encontrados")
            
            # Criar diretório se não existir
            os.makedirs("data", exist_ok=True)
            
            # Salvar dados
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
                json.dump({
                    "last_updated": datetime.now().isoformat(),
                    "query_id": QUERY_ID,
                    "data": rows
                }, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Dados salvos em {OUTPUT_FILE}")
            if rows:
                print(f"📊 Primeiros registros:")
                for i, row in enumerate(rows[:3]):
                    print(f"   {i+1}. {row}")
            
            return rows
        else:
            print("⚠️ Resposta da API não contém dados esperados")
            print(f"Resposta: {json.dumps(data, indent=2)}")
            return None
            
    except ImportError:
        print("⚠️ Biblioteca 'requests' não instalada, tentando com urllib...")
        return fetch_with_urllib()
    except Exception as e:
        print(f"⚠️ Erro com requests: {e}")
        print("Tentando com urllib...")
        return fetch_with_urllib()

def fetch_dune_data():
    """Função principal - tenta cliente oficial primeiro, depois requests, depois urllib"""
    return fetch_with_dune_client()

if __name__ == "__main__":
    fetch_dune_data()
