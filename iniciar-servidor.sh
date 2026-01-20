#!/bin/bash

# Script para iniciar o servidor que executa fetch_dune_data.py automaticamente

echo "🚀 Iniciando servidor do relatório..."
echo ""

cd "$(dirname "$0")"

# Verificar se Python está disponível
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado!"
    echo "   Instale Python 3 para continuar"
    exit 1
fi

# Executar servidor
python3 server.py
