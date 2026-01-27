#!/bin/bash
# ============================================================
# Script de atualização automática dos dados DeFi
# Agendamento: Segunda e Quinta às 00h
# ============================================================

# Configuração
PROJECT_DIR="/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi"
LOG_DIR="/tmp/defi_logs"
LOG_FILE="$LOG_DIR/update_$(date +%Y%m%d_%H%M%S).log"

# API Keys
export FRED_API_KEY="eaf5339d101c0216d2f6c733828ea1db"

# Criar diretório de logs se não existir
mkdir -p "$LOG_DIR"

# Log de início
echo "============================================================" >> "$LOG_FILE"
echo "Atualização iniciada: $(date)" >> "$LOG_FILE"
echo "============================================================" >> "$LOG_FILE"

# Mudar para o diretório do projeto
cd "$PROJECT_DIR" || exit 1

# Executar atualização COM REFRESH das queries do Dune
# Isso garante que os dados estejam sempre atualizados
python3 update_all_data.py --refresh >> "$LOG_FILE" 2>&1

# Log de fim
echo "" >> "$LOG_FILE"
echo "============================================================" >> "$LOG_FILE"
echo "Atualização finalizada: $(date)" >> "$LOG_FILE"
echo "============================================================" >> "$LOG_FILE"

# Limpar logs antigos (manter últimos 30 dias)
find "$LOG_DIR" -name "update_*.log" -mtime +30 -delete 2>/dev/null

# Mostrar resultado
if [ $? -eq 0 ]; then
    echo "✅ Atualização concluída - Log: $LOG_FILE"
else
    echo "❌ Erro na atualização - Verifique: $LOG_FILE"
fi
