# 📊 Como Usar o Gráfico do Dune Analytics - mNAV Analysis

## Passo a Passo

### 1. Instalar Dependências

```bash
cd relatorio-site
pip install -r requirements.txt
```

Ou instale individualmente:
```bash
pip install requests dune-client
```

### 2. Buscar Dados do Dune Analytics

Execute o script Python:

```bash
python3 fetch_dune_data.py
```

Isso irá:
- ✅ Conectar com a API do Dune usando sua chave
- ✅ Buscar os dados da query 6517647
- ✅ Salvar os dados em `data/mnav_data.json`

### 3. Abrir o Site

Abra o `index.html` no navegador. O gráfico será carregado automaticamente!

---

## Estrutura dos Dados

O script espera que a query do Dune retorne dados com campos como:
- `date` ou `Date` ou `timestamp` (para o eixo X)
- `mnav` ou `mNAV` ou `nav` ou `value` (para o eixo Y)

Se a estrutura for diferente, você pode ajustar o script `js/mnav-chart.js` na função `loadMNAVChart()`.

---

## Atualizar Dados

Para atualizar os dados do gráfico:

1. Execute novamente: `python3 fetch_dune_data.py`
2. Recarregue a página no navegador (F5)

---

## Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'requests'"
**Solução:** Instale as dependências:
```bash
pip install requests dune-client
```

### Erro: "Erro ao carregar dados: 404"
**Solução:** Verifique se o arquivo `data/mnav_data.json` existe. Execute o script `fetch_dune_data.py` primeiro.

### Gráfico não aparece
**Solução:** 
1. Abra o console do navegador (F12)
2. Verifique se há erros
3. Certifique-se de que o arquivo JSON foi gerado corretamente

### Dados não estão no formato esperado
**Solução:** 
1. Abra `data/mnav_data.json` e veja a estrutura
2. Ajuste o script `js/mnav-chart.js` para mapear os campos corretos

---

## Personalização

### Ajustar Cores do Gráfico

Edite `js/mnav-chart.js`:

```javascript
borderColor: 'rgb(255, 99, 132)',  // Cor da linha
backgroundColor: 'rgba(255, 99, 132, 0.1)',  // Cor de preenchimento
```

### Ajustar Tamanho do Gráfico

Edite `css/style.css`:

```css
#mnav-chart {
    max-height: 600px;  /* Ajuste a altura aqui */
}
```

---

## API do Dune Analytics

A chave da API está configurada no script:
- **Query ID:** 6517647
- **API Key:** Configurada em `fetch_dune_data.py`

Para usar outra query, edite o `QUERY_ID` no script.

---

## Exemplo de Estrutura de Dados Esperada

```json
{
  "last_updated": "2025-01-14T10:00:00",
  "query_id": 6517647,
  "data": [
    {
      "date": "2020-09-11",
      "mnav": 0.94
    },
    {
      "date": "2020-10-11",
      "mnav": 0.92
    }
  ]
}
```

Se seus dados tiverem campos diferentes, ajuste o mapeamento em `js/mnav-chart.js`.
