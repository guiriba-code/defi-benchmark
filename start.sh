#!/bin/bash

# Script para iniciar o servidor que atualiza dados automaticamente
# Uso: ./start.sh

cd "$(dirname "$0")"

echo "🚀 Iniciando servidor do relatório..."
echo ""

# Verificar se Python está disponível
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado!"
    exit 1
fi

# Executar servidor (que atualiza dados automaticamente)
python3 server.py
