# 🔧 Troubleshooting - Servidor não funciona

## Problema: http://localhost:8000 não está funcionando

### Passo 1: Verificar se o servidor está rodando

Abra um terminal e execute:

```bash
cd relatorio-site
python3 server.py
```

Você deve ver:
```
🚀 Iniciando servidor na porta 8000...
✅ Servidor rodando em http://localhost:8000
```

**Se não aparecer isso, há um erro. Veja as mensagens de erro abaixo.**

---

### Passo 2: Verificar erros comuns

#### Erro: "Address already in use"
**Solução:** Outro processo está usando a porta 8000

```bash
# Encontrar processo usando a porta
lsof -ti:8000

# Parar o processo (substitua PID pelo número retornado)
kill -9 PID

# Ou mude a porta no server.py (linha 15)
PORT = 8001  # ou outra porta
```

#### Erro: "ModuleNotFoundError"
**Solução:** O servidor usa apenas bibliotecas padrão do Python. Não deveria acontecer.

Verifique sua versão do Python:
```bash
python3 --version
```

Deve ser Python 3.6 ou superior.

#### Erro: "Permission denied"
**Solução:** Problema de permissões

```bash
chmod +x server.py
chmod +x fetch_dune_data.py
```

#### Erro ao executar fetch_dune_data.py
**Solução:** O servidor tenta executar o script mas falha

Teste o script manualmente:
```bash
python3 fetch_dune_data.py
```

Se funcionar manualmente, o servidor também deve funcionar.

---

### Passo 3: Testar o servidor

Em outro terminal, execute:

```bash
cd relatorio-site
python3 testar-servidor.py
```

Isso vai testar se o servidor está respondendo.

---

### Passo 4: Verificar no navegador

1. **Certifique-se de que o servidor está rodando** (veja Passo 1)
2. Abra o navegador
3. Acesse: `http://localhost:8000`
4. Ou: `http://localhost:8000/index.html`

**Se aparecer "This site can't be reached":**
- O servidor não está rodando
- Execute `python3 server.py` primeiro

**Se aparecer "404 Not Found":**
- Verifique se está na pasta correta
- Certifique-se de que `index.html` existe

---

### Passo 5: Verificar console do navegador

1. Abra o navegador
2. Pressione F12 (ou Cmd+Option+I no Mac)
3. Vá na aba "Console"
4. Veja se há erros

**Erro comum:** "Failed to fetch"
- O servidor não está rodando
- Ou o arquivo `data/mnav_data.json` não existe
- Execute `python3 fetch_dune_data.py` manualmente primeiro

---

### Passo 6: Alternativa - Servidor Python simples

Se o servidor customizado não funcionar, use o servidor simples do Python:

```bash
cd relatorio-site

# Primeiro, buscar dados manualmente
python3 fetch_dune_data.py

# Depois, iniciar servidor simples
python3 -m http.server 8000
```

Depois acesse: `http://localhost:8000`

**Nota:** Com este método, você precisa executar `fetch_dune_data.py` manualmente para atualizar os dados.

---

### Passo 7: Verificar firewall

Se nada funcionar, pode ser um problema de firewall:

**Mac:**
```bash
# Verificar se há bloqueio
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
```

**Linux:**
```bash
# Verificar firewall
sudo ufw status
```

---

## Checklist de Diagnóstico

Execute estes comandos e verifique:

```bash
cd relatorio-site

# 1. Verificar se os arquivos existem
ls -la index.html server.py fetch_dune_data.py

# 2. Verificar Python
python3 --version

# 3. Testar script de dados
python3 fetch_dune_data.py

# 4. Verificar se dados foram gerados
ls -la data/mnav_data.json

# 5. Iniciar servidor
python3 server.py
```

---

## Solução Rápida

Se nada funcionar, use esta solução simples:

```bash
cd relatorio-site

# 1. Buscar dados
python3 fetch_dune_data.py

# 2. Servidor simples
python3 -m http.server 8000
```

Depois acesse: `http://localhost:8000`

---

## Ainda não funciona?

1. Verifique se há mensagens de erro no terminal
2. Compartilhe as mensagens de erro
3. Verifique a versão do Python: `python3 --version`
4. Tente outra porta (mude PORT no server.py)
