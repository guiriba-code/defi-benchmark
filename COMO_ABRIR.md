# 🚀 Como Abrir o Site - Guia Passo a Passo

## ⭐ Método Recomendado: Usar o Servidor Automático

O servidor executa o script Python automaticamente e atualiza os dados!

```bash
cd relatorio-site
./iniciar-servidor.sh
```

Depois abra: `http://localhost:8000`

**Vantagens:**
- ✅ Executa `fetch_dune_data.py` automaticamente
- ✅ Atualiza dados a cada 5 minutos
- ✅ Gráficos sempre funcionando

Veja mais detalhes em `COMO_USAR_SERVIDOR.md`

---

## Método 1: Abrir Diretamente no Navegador (Mais Simples)

### No Mac:
1. Abra o **Finder**
2. Navegue até: `Documents/Paradigma/2025/Pesquisas/Gambling/Code/relatorio-site/`
3. Encontre o arquivo **`index.html`**
4. Clique duas vezes nele (ou clique com botão direito → "Abrir com" → escolha seu navegador)

### No Windows:
1. Abra o **Explorador de Arquivos**
2. Navegue até a pasta `relatorio-site`
3. Encontre o arquivo **`index.html`**
4. Clique duas vezes nele

### No Linux:
1. Abra o gerenciador de arquivos
2. Navegue até a pasta `relatorio-site`
3. Clique duas vezes em **`index.html`**

---

## Método 2: Arrastar e Soltar

1. Abra seu navegador (Chrome, Firefox, Safari, Edge)
2. Abra o Finder/Explorador na pasta `relatorio-site`
3. **Arraste o arquivo `index.html`** para a janela do navegador
4. Pronto! O site abrirá

---

## Método 3: Usar um Servidor Local (Recomendado)

### Opção A: Python (se você tem Python instalado)

1. Abra o **Terminal** (Mac) ou **Prompt de Comando** (Windows)
2. Navegue até a pasta:
   ```bash
   cd /Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Gambling/Code/relatorio-site
   ```
3. Execute:
   ```bash
   python3 -m http.server 8000
   ```
4. Abra o navegador e acesse: **http://localhost:8000**

### Opção B: Node.js (se você tem Node.js instalado)

1. Instale o http-server (uma vez só):
   ```bash
   npm install -g http-server
   ```
2. Navegue até a pasta:
   ```bash
   cd /Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Gambling/Code/relatorio-site
   ```
3. Execute:
   ```bash
   http-server
   ```
4. Abra o navegador e acesse o endereço mostrado (geralmente **http://localhost:8080**)

---

## Método 4: Usar o VS Code (se você usa VS Code)

1. Abra o VS Code
2. Abra a pasta `relatorio-site`
3. Clique com botão direito em `index.html`
4. Escolha **"Open with Live Server"** (se tiver a extensão)
   - Ou escolha **"Open in Browser"**

---

## 📍 Localização do Arquivo

O arquivo está em:
```
/Users/guilhermebarbosa/Documents/Paradigma/2025/Pesquisas/Gambling/Code/relatorio-site/index.html
```

---

## ✅ Como Saber se Funcionou

Quando o site abrir, você verá:
- Uma capa verde com "10 Previsões Para 2026"
- Um botão ☰ no canto superior esquerdo
- O menu lateral funcionando quando você clicar no botão

---

## 🐛 Problemas Comuns

### "O arquivo não abre"
- Certifique-se de que está abrindo o arquivo `index.html` (não o README.md)
- Tente abrir com um navegador diferente

### "O site não tem estilo/formatação"
- Certifique-se de que a pasta `css` e `js` estão na mesma pasta que `index.html`
- Use o Método 3 (servidor local) em vez de abrir diretamente

### "Menu não funciona"
- Abra o console do navegador (F12) para ver se há erros
- Certifique-se de que o arquivo `js/main.js` está carregando

---

## 💡 Dica

**O método mais simples é o Método 1**: apenas clique duas vezes no arquivo `index.html` no Finder/Explorador!
