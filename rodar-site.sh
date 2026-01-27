#!/bin/bash
# Roda o site localmente em http://localhost:8000
# Uso: ./rodar-site.sh
# Ou: bash rodar-site.sh

cd "$(dirname "$0")"
SITE_DIR="$(pwd)"

echo "════════════════════════════════════════════"
echo "  DeFi Benchmark - Servidor local"
echo "════════════════════════════════════════════"
echo ""
echo "  Pasta: $SITE_DIR"
echo "  Porta: 8000"
echo ""
echo "  Depois de iniciar, abra no navegador:"
echo "  → http://localhost:8000"
echo "  → http://localhost:8000/index.html"
echo ""
echo "  Para parar: Ctrl+C"
echo "════════════════════════════════════════════"
echo ""

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Instale Python 3 e tente novamente."
    exit 1
fi

# Verificar se porta 8000 está em uso
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  A porta 8000 já está em uso."
    echo "   Feche o outro processo ou use outra porta, por exemplo:"
    echo "   python3 -m http.server 8080"
    echo ""
    read -p "Tentar mesmo assim? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[sS]$ ]]; then
        exit 1
    fi
fi

echo "🚀 Iniciando servidor..."
echo ""
python3 -m http.server 8000
