# 🚀 Como Usar o Servidor Automático

## ✅ O que foi implementado

Criei um servidor Python que:
- ✅ Executa `fetch_dune_data.py` automaticamente ao iniciar
- ✅ Atualiza os dados automaticamente a cada 5 minutos
- ✅ Serve os arquivos do site (HTML, CSS, JS)
- ✅ Não precisa executar o script manualmente!

---

## 🚀 Como Usar (2 Opções)

### Opção 1: Usar o Script Shell (Mais Fácil)

```bash
cd relatorio-site
./iniciar-servidor.sh
```

### Opção 2: Executar Diretamente

```bash
cd relatorio-site
python3 server.py
```

---

## 📊 O que acontece

1. **Servidor inicia** na porta 8000
2. **Script executa automaticamente** para buscar dados do Dune
3. **Dados são salvos** em `data/mnav_data.json`
4. **Site fica disponível** em `http://localhost:8000`
5. **Dados são atualizados** automaticamente a cada 5 minutos

---

## 🌐 Acessar o Site

Depois de iniciar o servidor, abra no navegador:

```
http://localhost:8000/index.html
```

Ou simplesmente:

```
http://localhost:8000
```

---

## 🔄 Atualização Automática

- Os dados são atualizados automaticamente a cada **5 minutos**
- Quando você acessa `/data/mnav_data.json`, o servidor verifica se precisa atualizar
- Se os dados tiverem menos de 5 minutos, usa os dados existentes
- Se tiverem mais de 5 minutos, executa o script automaticamente

---

## ⏹️ Parar o Servidor

Pressione `Ctrl+C` no terminal onde o servidor está rodando.

---

## 🐛 Problemas Comuns

### "Port already in use"
**Solução:** Outro processo está usando a porta 8000. Pare o outro processo ou mude a porta no `server.py`.

### "ModuleNotFoundError"
**Solução:** O script usa apenas bibliotecas padrão do Python. Não precisa instalar nada!

### Dados não aparecem
**Solução:** 
1. Verifique se o servidor está rodando
2. Abra o console do navegador (F12) para ver erros
3. Certifique-se de acessar via `http://localhost:8000`

---

## 💡 Vantagens

✅ **Automático** - Não precisa executar script manualmente  
✅ **Atualizado** - Dados sempre recentes (até 5 minutos)  
✅ **Simples** - Um comando e pronto!  
✅ **Sem dependências** - Usa apenas Python padrão  

---

**Agora é só iniciar o servidor e abrir no navegador!** 🎉
