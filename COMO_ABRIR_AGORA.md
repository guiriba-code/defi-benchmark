# Como abrir o site agora (localhost:8000)

## Por que http://localhost:8000 não abria?

O servidor **não tinha sido iniciado** no seu terminal. O site é estático (HTML/CSS/JS) mas os gráficos carregam dados de arquivos JSON; o navegador só consegue acessar esses arquivos quando há um **servidor HTTP** rodando na pasta. Por isso é preciso rodar o servidor **você mesmo** no Terminal.

---

## Passo a passo (rápido)

1. **Abra o Terminal** (Terminal.app no Mac, ou o terminal integrado do Cursor).

2. **Entre na pasta do site:**
   ```bash
   cd "/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Taxas Médias Aave_Ethena_Tbills/Site DeFi"
   ```

3. **Suba o servidor:**
   ```bash
   ./rodar-site.sh
   ```
   Ou: `python3 -m http.server 8000`

4. **Deixe esse terminal aberto.** Deve aparecer algo como:
   ```
   Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
   ```

5. **No navegador,** acesse: **http://localhost:8000**

---

## Conferir se deu certo

- A página do DeFi Benchmark carrega.
- O menu [MENU] e as seções (benchmark, stablecoins, etc.) aparecem.
- Os gráficos mostram linhas (ou “carregando…” até os dados virem).

Se der “This site can't be reached” ou “Connection refused”, o servidor não está rodando nessa máquina/porta — volte ao passo 3 e use o mesmo terminal.

---

## Porta 8000 em uso

Se aparecer “Address already in use”:

```bash
# Ver o que está na 8000
lsof -i :8000

# Usar outra porta, ex. 8080
python3 -m http.server 8080
```

Aí use **http://localhost:8080** no navegador.

---

## Checklist final (está tudo certo?)

| Item | Como conferir |
|------|-------------------------------|
| Pasta do projeto | Você está em `.../Taxas Médias Aave_Ethena_Tbills/Site DeFi` |
| `index.html` | Existe na pasta: `ls index.html` |
| Dados dos gráficos | Existem: `ls data/defi_rates*.json` (4 arquivos) |
| Servidor rodando | Terminal mostra “Serving HTTP on … port 8000” e **não** foi fechado |
| Navegador | Abriu **http://localhost:8000** (e não file://…) |

Se tudo isso estiver ok e a página ainda não carregar, abra o console do navegador (F12 → Console) e veja se há erros de rede ou de script.
