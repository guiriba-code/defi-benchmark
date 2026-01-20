#!/usr/bin/env python3
"""
Script de teste para verificar se o servidor está funcionando
"""

import urllib.request
import urllib.error
import ssl
import sys

PORT = 8000
URL = f"http://localhost:{PORT}"

def test_server():
    """Testa se o servidor está respondendo"""
    print(f"🧪 Testando servidor em {URL}...")
    
    # Criar contexto SSL que não verifica certificado
    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE
    
    try:
        # Testar página principal
        req = urllib.request.Request(f"{URL}/index.html")
        with urllib.request.urlopen(req, timeout=5, context=ssl_context) as response:
            if response.status == 200:
                print("✅ Servidor está respondendo!")
                print(f"   Status: {response.status}")
                print(f"   URL: {URL}/index.html")
                return True
            else:
                print(f"⚠️ Servidor respondeu com status {response.status}")
                return False
    except urllib.error.URLError as e:
        print(f"❌ Erro ao conectar com o servidor: {e}")
        print(f"\n💡 O servidor não está rodando!")
        print(f"   Execute: python3 server.py")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return False

if __name__ == "__main__":
    success = test_server()
    sys.exit(0 if success else 1)
