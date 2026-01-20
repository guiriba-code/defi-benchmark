#!/usr/bin/env python3
"""
Servidor HTTP que executa fetch_dune_data.py automaticamente ao iniciar
e serve os arquivos estáticos do site
"""

import http.server
import socketserver
import subprocess
import os
import sys

PORT = 8000
FETCH_SCRIPT_1 = "fetch_dune_data.py"
FETCH_SCRIPT_2 = "fetch_dune_data_query2.py"
FETCH_SCRIPT_3 = "fetch_dune_data_query3.py"
FETCH_SCRIPT_4 = "fetch_dune_data_query4.py"

# Mudar para o diretório do script
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Handler que executa o script antes de servir dados"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def do_GET(self):
        """Intercepta requisições para atualizar dados se necessário"""
        from urllib.parse import urlparse
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Se for requisição para arquivos JSON de dados, atualizar antes de servir
        if path == '/data/defi_rates_data.json' or path.endswith('/defi_rates_data.json'):
            # Executar script para atualizar dados da query 1
            print(f"🔄 Atualizando dados da Query 1 (6517647)...")
            try:
                result = subprocess.run(
                    [sys.executable, FETCH_SCRIPT_1],
                    cwd=os.getcwd(),
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                if result.returncode == 0:
                    print("✅ Dados Query 1 atualizados com sucesso")
                else:
                    print(f"⚠️ Script retornou código {result.returncode}")
                    if result.stderr:
                        print(f"Erro: {result.stderr[:200]}")
            except Exception as e:
                print(f"⚠️ Erro ao atualizar dados Query 1: {e}")
        
        elif path == '/data/defi_rates_query2_data.json' or path.endswith('/defi_rates_query2_data.json'):
            # Executar script para atualizar dados da query 2
            print(f"🔄 Atualizando dados da Query 2 (6554864)...")
            try:
                result = subprocess.run(
                    [sys.executable, FETCH_SCRIPT_2],
                    cwd=os.getcwd(),
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                if result.returncode == 0:
                    print("✅ Dados Query 2 atualizados com sucesso")
                else:
                    print(f"⚠️ Script retornou código {result.returncode}")
                    if result.stderr:
                        print(f"Erro: {result.stderr[:200]}")
            except Exception as e:
                print(f"⚠️ Erro ao atualizar dados Query 2: {e}")
        
        elif path == '/data/defi_rates_query3_data.json' or path.endswith('/defi_rates_query3_data.json'):
            # Executar script para atualizar dados da query 3
            print(f"🔄 Atualizando dados da Query 3 (6555058)...")
            try:
                result = subprocess.run(
                    [sys.executable, FETCH_SCRIPT_3],
                    cwd=os.getcwd(),
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                if result.returncode == 0:
                    print("✅ Dados Query 3 atualizados com sucesso")
                else:
                    print(f"⚠️ Script retornou código {result.returncode}")
                    if result.stderr:
                        print(f"Erro: {result.stderr[:200]}")
            except Exception as e:
                print(f"⚠️ Erro ao atualizar dados Query 3: {e}")
        
        elif path == '/data/defi_rates_query4_data.json' or path.endswith('/defi_rates_query4_data.json'):
            # Executar script para atualizar dados da query 4
            print(f"🔄 Atualizando dados da Query 4 (6559258)...")
            try:
                result = subprocess.run(
                    [sys.executable, FETCH_SCRIPT_4],
                    cwd=os.getcwd(),
                    capture_output=True,
                    text=True,
                    timeout=60
                )
                if result.returncode == 0:
                    print("✅ Dados Query 4 atualizados com sucesso")
                else:
                    print(f"⚠️ Script retornou código {result.returncode}")
                    if result.stderr:
                        print(f"Erro: {result.stderr[:200]}")
            except Exception as e:
                print(f"⚠️ Erro ao atualizar dados Query 4: {e}")
        
        # Servir arquivo normalmente
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Customiza mensagens de log"""
        from datetime import datetime
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {format % args}")

def main():
    """Inicia o servidor"""
    # Garantir que o diretório data existe
    os.makedirs('data', exist_ok=True)
    
    # Executar scripts na inicialização
    print("=" * 60)
    print("🚀 Iniciando servidor do relatório")
    print("=" * 60)
    print(f"📊 Atualizando dados do Dune Analytics...")
    
    # Atualizar Query 1
    print(f"\n📊 Query 1 (6517647)...")
    try:
        result = subprocess.run(
            [sys.executable, FETCH_SCRIPT_1],
            cwd=os.getcwd(),
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            print("✅ Query 1 atualizada com sucesso")
        else:
            print(f"⚠️ Query 1 retornou código {result.returncode}")
    except Exception as e:
        print(f"⚠️ Erro ao atualizar Query 1: {e}")
    
    # Atualizar Query 2
    print(f"\n📊 Query 2 (6554864)...")
    try:
        result = subprocess.run(
            [sys.executable, FETCH_SCRIPT_2],
            cwd=os.getcwd(),
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            print("✅ Query 2 atualizada com sucesso")
        else:
            print(f"⚠️ Query 2 retornou código {result.returncode}")
    except Exception as e:
        print(f"⚠️ Erro ao atualizar Query 2: {e}")
    
    # Atualizar Query 3
    print(f"\n📊 Query 3 (6555058)...")
    try:
        result = subprocess.run(
            [sys.executable, FETCH_SCRIPT_3],
            cwd=os.getcwd(),
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            print("✅ Query 3 atualizada com sucesso")
        else:
            print(f"⚠️ Query 3 retornou código {result.returncode}")
    except Exception as e:
        print(f"⚠️ Erro ao atualizar Query 3: {e}")
    
    # Atualizar Query 4
    print(f"\n📊 Query 4 (6559258)...")
    try:
        result = subprocess.run(
            [sys.executable, FETCH_SCRIPT_4],
            cwd=os.getcwd(),
            capture_output=True,
            text=True,
            timeout=60
        )
        if result.returncode == 0:
            print("✅ Query 4 atualizada com sucesso")
        else:
            print(f"⚠️ Query 4 retornou código {result.returncode}")
    except Exception as e:
        print(f"⚠️ Erro ao atualizar Query 4: {e}")
    
    print("\n💡 Os dados serão atualizados automaticamente a cada acesso aos gráficos")
    
    # Iniciar servidor
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"\n✅ Servidor rodando em http://localhost:{PORT}")
            print(f"📁 Abra http://localhost:{PORT} no navegador")
            print(f"🔄 Os dados serão atualizados automaticamente a cada acesso ao gráfico")
            print(f"⏹️  Pressione Ctrl+C para parar o servidor\n")
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"❌ Erro: Porta {PORT} já está em uso!")
            print(f"   Pare o outro processo ou mude a porta")
        else:
            print(f"❌ Erro ao iniciar servidor: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Servidor parado")

if __name__ == "__main__":
    main()
