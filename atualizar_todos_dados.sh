#!/bin/bash
# Atualiza os 4 JSONs do Dune de uma vez (4 chamadas à API).
# Rode: ./atualizar_todos_dados.sh
# Requer: python3 e acesso à internet

cd "$(dirname "$0")"
echo "🔄 Atualizando dados do Dune Analytics (4 queries)..."
echo ""
python3 fetch_dune_data.py && \
python3 fetch_dune_data_query2.py && \
python3 fetch_dune_data_query3.py && \
python3 fetch_dune_data_query4.py && \
echo "" && echo "✅ Todos os dados foram atualizados."
