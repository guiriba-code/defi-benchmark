# 📊 Exemplos de Como Embedar Gráficos

## Dune Analytics

### Método 1: Substituir o Placeholder Diretamente no HTML

Encontre a seção da **Previsão 10** no `index.html` e substitua:

```html
<!-- ANTES (placeholder) -->
<div class="chart-placeholder dune-chart" data-chart-type="dune-analytics" data-dune-query="obchakevich">
    <p>📊 Gráfico do Dune Analytics</p>
    <!-- ... conteúdo do placeholder ... -->
</div>

<!-- DEPOIS (com iframe do Dune) -->
<div class="chart-container">
    <h3 class="chart-title">Volume Mensal de Cripto-cartões (depósitos e gastos)</h3>
    <iframe 
        src="https://dune.com/embeds/[QUERY_ID_AQUI]" 
        width="100%" 
        height="600" 
        frameborder="0"
        style="border: none; border-radius: 8px;">
    </iframe>
    <p class="chart-note">Cripto-cartões já movimentam, mensalmente, U$418M. via @obchakevich</p>
</div>
```

### Método 2: Usar JavaScript

Adicione no final do arquivo `js/main.js` ou no console do navegador:

```javascript
// Quando tiver o ID da query do Dune
embedDuneChart('chart-placeholder-10', 'SEU_QUERY_ID_AQUI', 600);
```

**Como encontrar o Query ID:**
1. Acesse o dashboard/query no Dune Analytics
2. Veja a URL: `https://dune.com/queries/[QUERY_ID]`
3. Ou clique em "Share" → "Embed" e copie o ID do iframe

---

## Polymarket

### Embedar Gráfico de Probabilidades Presidenciais (Previsão 7)

```html
<!-- Substitua o placeholder na Previsão 7 -->
<div class="chart-container">
    <h3 class="chart-title">Gráficos da Paradigma News sobre as chances de cada candidato ser presidente do Brasil em 2026</h3>
    <iframe 
        src="https://polymarket.com/event/[MARKET_ID]" 
        width="100%" 
        height="600" 
        frameborder="0"
        style="border: none; border-radius: 8px;">
    </iframe>
</div>
```

**Ou via JavaScript:**

```javascript
embedPolymarketChart('chart-placeholder-7', 'brazil-presidential-2026', 600);
```

---

## StrategyTracker (Previsão 3)

Para o gráfico de mNAV da Strategy:

```html
<div class="chart-container">
    <h3 class="chart-title">mNAV Analysis</h3>
    <iframe 
        src="https://www.strategytracker.com/[CHART_URL]" 
        width="100%" 
        height="500" 
        frameborder="0"
        style="border: none; border-radius: 8px;">
    </iframe>
    <p class="chart-note">Atualmente, o mNAV da Strategy está em 0,94.</p>
</div>
```

---

## Twitter/X Embed (Previsão 4)

Para embedar o tweet do Brian Armstrong:

```html
<div class="tweet-container">
    <blockquote class="twitter-tweet">
        <p lang="en" dir="ltr">
            We're exploring a Base network token. It could be a great tool for accelerating 
            decentralization and expanding creator and developer growth in the ecosystem. 
            To be clear, there are no definitive plans. We're just updating our philosophy. 
            As of now, we're exploring it.
        </p>
        &mdash; Brian Armstrong (@brian_armstrong) 
        <a href="https://twitter.com/brian_armstrong/status/[TWEET_ID]">[DATA]</a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>
```

---

## Gráficos Customizados (Chart.js, Plotly, etc.)

Se você quiser criar gráficos customizados com dados atualizados:

### Exemplo com Chart.js

```html
<div class="chart-container">
    <h3 class="chart-title">Título do Gráfico</h3>
    <canvas id="meuGrafico" width="400" height="200"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('meuGrafico').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar'],
            datasets: [{
                label: 'Dados',
                data: [12, 19, 3],
                borderColor: 'rgb(75, 192, 192)',
            }]
        }
    });
</script>
```

---

## Dicas Importantes

1. **CORS**: Alguns sites bloqueiam iframes. Se o gráfico não aparecer, pode ser uma restrição CORS.

2. **Altura do iframe**: Ajuste a altura conforme necessário (400px, 600px, 800px, etc.)

3. **Responsividade**: Os iframes já estão configurados para serem responsivos com `width="100%"`

4. **Teste**: Sempre teste em diferentes navegadores e dispositivos

5. **Fallback**: Mantenha uma imagem estática como fallback caso o embed não funcione

---

## Checklist para Embedar

- [ ] Identificar qual gráfico precisa ser embedado
- [ ] Obter o link/ID do gráfico (Dune, Polymarket, etc.)
- [ ] Localizar o placeholder correspondente no HTML
- [ ] Substituir o placeholder pelo iframe/código
- [ ] Testar no navegador
- [ ] Verificar responsividade em mobile
- [ ] Verificar se atualiza em tempo real

---

**Nota**: Alguns serviços podem exigir autenticação ou ter restrições de embed. Sempre verifique a documentação do serviço específico.
