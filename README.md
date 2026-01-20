# 📊 Site Navegável - 10 Previsões Para 2026

Site interativo convertido do relatório PDF, com suporte para gráficos embebidos do Dune Analytics e outras fontes.

## 🚀 Início Rápido

### Opção 1: Servidor Automático (Recomendado) ⭐

O servidor executa o script Python automaticamente e atualiza os dados!

```bash
cd relatorio-site
./iniciar-servidor.sh
```

Depois abra: **http://localhost:8000**

**Vantagens:**
- ✅ Executa `fetch_dune_data.py` automaticamente
- ✅ Atualiza dados a cada 5 minutos
- ✅ Gráficos sempre funcionando

### Opção 2: Abrir Diretamente

1. Abra o arquivo `index.html` no navegador
2. Execute `python3 fetch_dune_data.py` manualmente para atualizar dados

---

## 📈 Gráficos do Dune Analytics

O site já está configurado com:
- ✅ **Query ID:** 6517647
- ✅ **API Key:** Configurada no script
- ✅ **Atualização automática** quando usando o servidor

### Gráfico Implementado

- **Previsão 3:** Análise de Taxas - Aave, Ethena e Morpho
  - Mostra taxas de supply e borrow ao longo do tempo
  - Atualiza automaticamente via servidor

---

## 📁 Estrutura de Arquivos

```
relatorio-site/
├── index.html              # Página principal
├── server.py               # Servidor que executa script automaticamente
├── iniciar-servidor.sh      # Script para iniciar servidor
├── fetch_dune_data.py       # Script para buscar dados do Dune
├── css/
│   └── style.css           # Estilos
├── js/
│   ├── main.js             # JavaScript principal
│   └── mnav-chart.js       # Gráfico do Dune Analytics
├── data/
│   └── mnav_data.json      # Dados do Dune (gerado automaticamente)
└── README.md               # Este arquivo
```

---

## 🔧 Funcionalidades

- ✅ Menu lateral de navegação
- ✅ Scroll suave entre seções
- ✅ Destaque da seção atual no menu
- ✅ Design responsivo
- ✅ Gráfico interativo do Dune Analytics
- ✅ Atualização automática de dados (via servidor)

---

## 📝 Seções do Relatório

1. **Capa** - Apresentação visual
2. **Introdução** - Contexto geral
3. **10 Previsões** - Cada uma em sua seção:
   - Previsão 1: Polymarket Presidencial
   - Previsão 2: Computação Quântica
   - Previsão 3: mNAV Strategy (com gráfico Dune)
   - Previsão 4: Base e Polymarket Tokens
   - Previsão 5: MVRV Bitcoin
   - Previsão 6: Bitcoin em Debates
   - Previsão 7: Apostar Lula vs BTC
   - Previsão 8: Patrocínio Futebol
   - Previsão 9: Bancões e BTC
   - Previsão 10: Cripto-cartões

---

## 🐛 Troubleshooting

### Gráfico não aparece
- **Com servidor:** Verifique se o servidor está rodando
- **Sem servidor:** Execute `python3 fetch_dune_data.py` manualmente
- Abra o console do navegador (F12) para ver erros

### "Failed to fetch"
- Use o servidor automático: `./iniciar-servidor.sh`
- Ou execute `python3 fetch_dune_data.py` antes de abrir a página

### Porta 8000 já em uso
- Pare o outro processo ou mude a porta no `server.py`

---

## 📚 Documentação Adicional

- `COMO_ABRIR.md` - Guia completo de como abrir o site
- `COMO_USAR_SERVIDOR.md` - Detalhes sobre o servidor automático
- `INSTRUCOES_MNAV.md` - Instruções do gráfico mNAV
- `EXEMPLO_EMBED.md` - Exemplos de como embedar outros gráficos

---

**Desenvolvido para Paradigma Education** 🎓
