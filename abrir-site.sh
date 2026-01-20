#!/bin/bash

# Script para abrir o site do relatório
# Uso: ./abrir-site.sh

echo "🚀 Abrindo o site do relatório..."
echo ""

# Caminho do arquivo
HTML_FILE="$(pwd)/index.html"

# Verificar se o arquivo existe
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ Erro: Arquivo index.html não encontrado!"
    echo "   Certifique-se de executar este script na pasta relatorio-site"
    exit 1
fi

# Tentar abrir no navegador padrão
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$HTML_FILE"
    echo "✅ Site aberto no navegador padrão!"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$HTML_FILE"
    echo "✅ Site aberto no navegador padrão!"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    start "$HTML_FILE"
    echo "✅ Site aberto no navegador padrão!"
else
    echo "⚠️  Sistema operacional não reconhecido."
    echo "   Abra manualmente o arquivo: $HTML_FILE"
fi

echo ""
echo "💡 Dica: Se o site não aparecer formatado, use um servidor local:"
echo "   python3 -m http.server 8000"
echo "   Depois acesse: http://localhost:8000"
