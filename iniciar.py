#!/usr/bin/env python3
"""
Script simples para iniciar servidor e buscar dados automaticamente
"""

import subprocess
import sys
import os
import time

# Mudar para o diretório do script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8000

def main():
    print("=" * 60)
    print("🚀 Iniciando servidor do relatório")
    print("=" * 60)
    print()
    
    # 1. Buscar dados primeiro
    print("📊 Passo 1: Buscando dados do Dune Analytics...")
    try:
        result = subprocess.run(
            [sys.executable, "fetch_dune_data.py"],
            cwd=os.getcwd(),
            timeout=60
        )
        if result.returncode == 0:
            print("✅ Dados carregados com sucesso!")
        else:
            print("⚠️ Aviso: Script retornou código", result.returncode)
    except Exception as e:
        print(f"⚠️ Aviso ao buscar dados: {e}")
        print("   Continuando mesmo assim...")
    
    print()
    
    # 2. Verificar se porta está livre
    print(f"🔍 Passo 2: Verificando porta {PORT}...")
    try:
        import socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', PORT))
        sock.close()
        if result == 0:
            print(f"❌ Porta {PORT} já está em uso!")
            print(f"   Pare o outro processo ou mude a porta")
            return
        else:
            print(f"✅ Porta {PORT} está livre")
    except Exception as e:
        print(f"⚠️ Não foi possível verificar porta: {e}")
    
    print()
    
    # 3. Iniciar servidor
    print(f"🌐 Passo 3: Iniciando servidor na porta {PORT}...")
    print()
    print("=" * 60)
    print(f"✅ Servidor iniciado!")
    print(f"📁 Abra no navegador: http://localhost:{PORT}")
    print(f"⏹️  Pressione Ctrl+C para parar")
    print("=" * 60)
    print()
    
    # Usar servidor simples do Python
    try:
        import http.server
        import socketserver
        
        Handler = http.server.SimpleHTTPRequestHandler
        
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n❌ Erro: Porta {PORT} já está em uso!")
            print(f"   Execute: lsof -ti:{PORT} | xargs kill -9")
        else:
            print(f"\n❌ Erro: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
