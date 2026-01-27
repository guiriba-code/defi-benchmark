#!/usr/bin/env python3
"""
Exemplo: Buscar dados do Aave diretamente on-chain (sem Dune)
Usa web3.py para ler contratos Ethereum
"""

import json
import os
from datetime import datetime
from web3 import Web3

# RPC público grátis (alternativas: https://llamarpc.com, https://publicnode.com)
RPC_URL = "https://eth.llamarpc.com"

# Endereços dos contratos
AAVE_LENDING_POOL_V2 = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9"
AAVE_LENDING_POOL_V3 = "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA5E2"
USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"

# ABI simplificado para getReserveData (Aave V2)
AAVE_V2_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "asset", "type": "address"}],
        "name": "getReserveData",
        "outputs": [
            {"internalType": "uint256", "name": "currentLiquidityRate", "type": "uint256"},
            {"internalType": "uint256", "name": "currentStableBorrowRate", "type": "uint256"},
            {"internalType": "uint256", "name": "currentVariableBorrowRate", "type": "uint256"},
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

# ABI para Aave V3
AAVE_V3_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "asset", "type": "address"}],
        "name": "getReserveData",
        "outputs": [
            {"components": [
                {"internalType": "uint256", "name": "currentLiquidityIndex", "type": "uint256"},
                {"internalType": "uint256", "name": "currentLiquidityRate", "type": "uint256"},
                {"internalType": "uint256", "name": "currentStableBorrowRate", "type": "uint256"},
                {"internalType": "uint256", "name": "currentVariableBorrowRate", "type": "uint256"},
            ], "name": "", "type": "tuple"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

def fetch_aave_v2_supply_rate():
    """Busca taxa de supply do Aave V2"""
    try:
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        
        if not w3.is_connected():
            print("❌ Não foi possível conectar ao RPC")
            return None
        
        contract = w3.eth.contract(
            address=Web3.to_checksum_address(AAVE_LENDING_POOL_V2),
            abi=AAVE_V2_ABI
        )
        
        # getReserveData retorna vários valores, o primeiro é currentLiquidityRate
        result = contract.functions.getReserveData(
            Web3.to_checksum_address(USDC_ADDRESS)
        ).call()
        
        # currentLiquidityRate está em RAY (1e27), converter para decimal
        liquidity_rate = result[0] / 1e27
        
        return liquidity_rate
        
    except Exception as e:
        print(f"❌ Erro ao buscar Aave V2: {e}")
        return None

def fetch_aave_v3_supply_rate():
    """Busca taxa de supply do Aave V3"""
    try:
        w3 = Web3(Web3.HTTPProvider(RPC_URL))
        
        if not w3.is_connected():
            print("❌ Não foi possível conectar ao RPC")
            return None
        
        contract = w3.eth.contract(
            address=Web3.to_checksum_address(AAVE_LENDING_POOL_V3),
            abi=AAVE_V3_ABI
        )
        
        result = contract.functions.getReserveData(
            Web3.to_checksum_address(USDC_ADDRESS)
        ).call()
        
        # currentLiquidityRate está em RAY (1e27)
        liquidity_rate = result[1] / 1e27  # Índice 1 é currentLiquidityRate
        
        return liquidity_rate
        
    except Exception as e:
        print(f"❌ Erro ao buscar Aave V3: {e}")
        return None

def main():
    print("🔄 Buscando dados do Aave on-chain...")
    
    # Tentar V3 primeiro (mais recente)
    rate_v3 = fetch_aave_v3_supply_rate()
    rate_v2 = fetch_aave_v2_supply_rate()
    
    # Usar V3 se disponível, senão V2
    rate = rate_v3 or rate_v2
    
    if rate:
        print(f"✅ Taxa de supply Aave: {(rate * 100):.2f}%")
        
        # Salvar em formato compatível com o site
        output = {
            "last_updated": datetime.now().isoformat(),
            "source": "on-chain",
            "aave_supply_rate": rate,
            "note": "Dados buscados diretamente do contrato Aave"
        }
        
        os.makedirs("data", exist_ok=True)
        with open("data/aave_onchain.json", "w") as f:
            json.dump(output, f, indent=2)
        
        print("✅ Dados salvos em data/aave_onchain.json")
    else:
        print("❌ Não foi possível buscar dados")

if __name__ == "__main__":
    # Instalar: pip install web3
    try:
        main()
    except ImportError:
        print("❌ web3.py não instalado. Execute: pip install web3")
