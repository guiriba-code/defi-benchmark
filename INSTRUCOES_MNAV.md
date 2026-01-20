# 🎯 Instruções Rápidas - Gráfico mNAV do Dune Analytics

## ✅ O que foi implementado

1. ✅ Script Python (`fetch_dune_data.py`) para buscar dados da API do Dune
2. ✅ Gráfico interativo usando Chart.js na seção "mNAV Analysis"
3. ✅ Integração automática: dados JSON → gráfico HTML
4. ✅ Sua chave da API já está configurada no script

---

## 🚀 Como Usar (3 Passos)

### Passo 1: Instalar Dependências

```bash
cd relatorio-site
pip install requests dune-client
```

**OU** instale individualmente:
```bash
pip install requests
pip install dune-client
```

### Passo 2: Buscar Dados do Dune

```bash
python3 fetch_dune_data.py
```

Isso vai:
- ✅ Conectar com a API do Dune (Query ID: 6517647)
- ✅ Baixar os dados
- ✅ Salvar em `data/mnav_data.json`

### Passo 3: Abrir o Site

Abra o `index.html` no navegador. O gráfico aparecerá automaticamente na **Previsão 3 - mNAV Strategy**!

---

## 📊 Onde Está o Gráfico?

O gráfico está na seção:
- **Previsão 3: "O mNAV da Strategy vai bater 0.6"**
- Título do gráfico: **"mNAV Analysis"**

---

## 🔄 Atualizar os Dados

Para atualizar o gráfico com dados mais recentes:

1. Execute: `python3 fetch_dune_data.py`
2. Recarregue a página no navegador (F5)

---

## 🐛 Problemas Comuns

### "ModuleNotFoundError: No module named 'requests'"
**Solução:**
```bash
pip install requests dune-client
```

### "Erro ao carregar dados: 404"
**Solução:** Execute o script primeiro:
```bash
python3 fetch_dune_data.py
```

### Gráfico não aparece
**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros
3. Certifique-se de que `data/mnav_data.json` existe

---

## 📁 Arquivos Criados

- `fetch_dune_data.py` - Script para buscar dados
- `js/mnav-chart.js` - JavaScript para renderizar o gráfico
- `data/mnav_data.json` - Dados do Dune (gerado automaticamente)
- `requirements.txt` - Dependências Python

---

## 🔧 Configuração

Sua chave da API já está configurada:
- **API Key:** `W8eHxGbL5IdI2dL9sKwNqAkPrYFoEHjt`
- **Query ID:** `6517647`

Se precisar mudar, edite `fetch_dune_data.py`.

---

## 💡 Dica

O script tenta usar o cliente oficial do Dune primeiro (`dune-client`), e se não estiver instalado, usa `requests` como fallback. Ambos funcionam!

---

**Pronto! Agora é só instalar as dependências e executar o script!** 🎉
