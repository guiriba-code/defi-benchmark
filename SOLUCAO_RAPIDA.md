# ✅ Solução Rápida - Servidor não funciona

## Método 1: Script Simplificado (Recomendado)

Execute este comando:

```bash
cd relatorio-site
python3 iniciar.py
```

Isso vai:
1. ✅ Buscar dados automaticamente
2. ✅ Verificar se a porta está livre
3. ✅ Iniciar o servidor

Depois abra: **http://localhost:8000**

---

## Método 2: Servidor Python Simples

Se o método 1 não funcionar:

```bash
cd relatorio-site

# 1. Buscar dados primeiro
python3 fetch_dune_data.py

# 2. Iniciar servidor simples
python3 -m http.server 8000
```

Depois abra: **http://localhost:8000**

**Nota:** Com este método, você precisa executar `fetch_dune_data.py` manualmente para atualizar os dados.

---

## Método 3: Abrir Diretamente (Sem Servidor)

Se os servidores não funcionarem:

```bash
cd relatorio-site

# 1. Buscar dados
python3 fetch_dune_data.py

# 2. Abrir index.html diretamente no navegador
open index.html  # Mac
# ou
xdg-open index.html  # Linux
```

**Nota:** O gráfico pode não funcionar perfeitamente sem servidor devido a restrições CORS.

---

## Problema: Porta 8000 em uso

Se aparecer "Address already in use":

```bash
# Parar processo na porta 8000
lsof -ti:8000 | xargs kill -9

# Ou usar outra porta
python3 -m http.server 8001
```

Depois acesse: **http://localhost:8001**

---

## Verificar se está funcionando

1. Execute o servidor (um dos métodos acima)
2. Abra o navegador
3. Acesse: `http://localhost:8000`
4. Você deve ver a capa verde "10 Previsões Para 2026"

Se não aparecer, verifique:
- O servidor está rodando? (veja o terminal)
- Há erros no terminal?
- A URL está correta? (`http://localhost:8000`)

---

## Ainda não funciona?

Execute e me envie a saída:

```bash
cd relatorio-site
python3 iniciar.py
```

Ou tente o método 2 (servidor simples) que é mais confiável.
