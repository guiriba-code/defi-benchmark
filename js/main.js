/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MAIN.JS - Estética ASCII com dinamismo
 * Animações inspiradas em nfinitepaper.com e axon-pulse.com
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONTROLE DE CARREGAMENTO DOS GRÁFICOS (LAZY LOAD NO SCROLL)
// ═══════════════════════════════════════════════════════════════════════════

// Flag para controlar se cada gráfico já foi carregado
window.chartLoadState = {
    'grafico-1': false,
    'grafico-2': false,
    'grafico-3': false,
    'grafico-4': false
};

// Funções de carregamento serão definidas pelos scripts individuais
window.chartLoaders = {};

// ═══════════════════════════════════════════════════════════════════════════
// FIGURA ASCII ANIMADA NO FUNDO
// ═══════════════════════════════════════════════════════════════════════════

class ASCIIBackground {
    constructor() {
        this.canvas = document.getElementById('ascii-background');
        if (!this.canvas) {
            this.createCanvas();
        }
        this.ctx = this.canvas.getContext('2d');
        this.chars = '.·:;+*#@█▓▒░';
        this.fontSize = 12;
        this.columns = 0;
        this.rows = 0;
        this.grid = [];
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ascii-background';
        document.body.prepend(this.canvas);
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.rows = Math.floor(this.canvas.height / this.fontSize);
        
        this.grid = [];
        for (let y = 0; y < this.rows; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.columns; x++) {
                this.grid[y][x] = {
                    char: ' ',
                    targetChar: ' ',
                    phase: Math.random() * Math.PI * 2
                };
            }
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }

    getCharAtPosition(x, y, time) {
        const centerX = this.columns / 2;
        const centerY = this.rows / 2;
        
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const wave1 = Math.sin(dist * 0.15 - time * 0.02) * 0.5 + 0.5;
        const angle = Math.atan2(dy, dx);
        const wave2 = Math.sin(angle * 3 + dist * 0.1 - time * 0.015) * 0.5 + 0.5;
        const wave3 = Math.sin(x * 0.1 + time * 0.01) * Math.cos(y * 0.1 + time * 0.008);
        
        const value = (wave1 + wave2 + wave3 * 0.5) / 2.5;
        
        const mouseDx = (this.mouseX / this.fontSize) - x;
        const mouseDy = (this.mouseY / this.fontSize) - y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        const mouseEffect = Math.max(0, 1 - mouseDist / 15);
        
        const finalValue = Math.min(1, value + mouseEffect * 0.5);
        const charIndex = Math.floor(finalValue * (this.chars.length - 1));
        return this.chars[charIndex] || ' ';
    }

    animate() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.font = `${this.fontSize}px Monaco, Menlo, monospace`;
        this.ctx.fillStyle = '#000000';
        this.ctx.textBaseline = 'top';
        
        this.time++;
        
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                const char = this.getCharAtPosition(x, y, this.time);
                this.ctx.fillText(char, x * this.fontSize, y * this.fontSize);
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSIÇÕES DINÂMICAS AO SCROLL (estilo nfinitepaper.com / axon-pulse.com)
// ═══════════════════════════════════════════════════════════════════════════

class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.init();
    }

    init() {
        // Observer para detectar quando seções entram/saem da viewport
        // Funciona em AMBAS direções (subindo e descendo)
        const observerOptions = {
            threshold: [0, 0.15, 0.5], // Múltiplos thresholds para detecção precisa
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const sectionId = entry.target.getAttribute('id');
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
                    // ENTRANDO na viewport (descendo OU subindo)
                    entry.target.classList.add('visible');
                    
                    // Carregar o gráfico quando a seção fica visível
                    this.loadChartForSection(sectionId);
                    
                    console.log(`> Seção ${sectionId} visível`);
                } else if (!entry.isIntersecting) {
                    // SAINDO da viewport (em qualquer direção)
                    entry.target.classList.remove('visible');
                    
                    console.log(`> Seção ${sectionId} oculta`);
                }
            });
        }, observerOptions);

        this.sections.forEach(section => {
            observer.observe(section);
        });

        // Parallax suave no fundo
        this.initParallax();
    }

    loadChartForSection(sectionId) {
        // Verifica se o gráfico já foi carregado
        if (window.chartLoadState[sectionId]) {
            return;
        }
        
        // Marca como carregado
        window.chartLoadState[sectionId] = true;
        
        // Chama a função de carregamento apropriada
        const loaderMap = {
            'grafico-1': 'loadDefiRatesChart',
            'grafico-2': 'loadDefiRatesQuery2Chart',
            'grafico-3': 'loadDefiRatesQuery3Chart',
            'grafico-4': 'loadDefiRatesQuery4Chart'
        };
        
        const loaderName = loaderMap[sectionId];
        if (loaderName && typeof window[loaderName] === 'function') {
            // Delay pequeno para a animação CSS iniciar primeiro
            setTimeout(() => {
                window[loaderName]();
            }, 400);
        }
    }

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const bg = document.getElementById('ascii-background');
            
            if (bg) {
                bg.style.transform = `translateY(${scrollY * 0.05}px)`;
            }
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// EFEITO DE TREMOR NO TEXTO
// ═══════════════════════════════════════════════════════════════════════════

class TextGlitchEffect {
    constructor() {
        this.init();
    }

    init() {
        // Aplicar efeito glitch a TODOS os textos do site
        const glitchElements = document.querySelectorAll('.glitch-text, .chart-title, .chart-note, .nav-menu a, .footer p, .menu-toggle, .sidebar-header h2');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.startGlitch(element));
            element.addEventListener('mouseleave', () => this.stopGlitch(element));
        });
        
        // Observer para aplicar efeito a elementos criados dinamicamente
        this.observeDynamicElements();
        
        // Observar legendas criadas dinamicamente pelos gráficos
        this.observeLegendElements();
    }
    
    observeLegendElements() {
        // Observer para aplicar efeito às legendas criadas pelos gráficos
        const legendContainers = document.querySelectorAll('.chart-legend');
        
        const config = { childList: true, subtree: true };
        
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList.contains('chart-legend-item')) {
                            if (!node.hasGlitchEvent) {
                                node.hasGlitchEvent = true;
                                node.addEventListener('mouseenter', () => this.startGlitch(node));
                                node.addEventListener('mouseleave', () => this.stopGlitch(node));
                            }
                        }
                    });
                }
            }
        };
        
        const observer = new MutationObserver(callback);
        legendContainers.forEach(container => observer.observe(container, config));
    }
    
    observeDynamicElements() {
        // Observar mudanças no DOM para aplicar efeito a novos elementos
        const targetNodes = document.querySelectorAll('.chart-note');
        
        const config = { characterData: true, subtree: true, childList: true };
        
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'characterData' || mutation.type === 'childList') {
                    const target = mutation.target.parentElement || mutation.target;
                    if (target.classList && target.classList.contains('chart-note')) {
                        // Re-aplicar eventos se necessário
                        if (!target.hasGlitchEvent) {
                            target.hasGlitchEvent = true;
                            target.addEventListener('mouseenter', () => this.startGlitch(target));
                            target.addEventListener('mouseleave', () => this.stopGlitch(target));
                        }
                    }
                }
            }
        };
        
        const observer = new MutationObserver(callback);
        targetNodes.forEach(node => observer.observe(node, config));
    }

    startGlitch(element) {
        element.classList.add('glitching');
        
        // Para legendas de gráfico, aplicar glitch apenas no texto (não na cor)
        const labelSpan = element.querySelector('.chart-legend-label');
        const targetElement = labelSpan || element;
        
        if (!targetElement.dataset.originalText) {
            targetElement.dataset.originalText = targetElement.textContent;
        }
        
        let iterations = 0;
        const maxIterations = 10;
        const originalText = targetElement.dataset.originalText;
        
        element.glitchInterval = setInterval(() => {
            if (iterations >= maxIterations) {
                targetElement.textContent = originalText;
                clearInterval(element.glitchInterval);
                return;
            }
            
            targetElement.textContent = originalText.split('').map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return this.getRandomChar();
            }).join('');
            
            iterations++;
        }, 30);
    }

    stopGlitch(element) {
        element.classList.remove('glitching');
        
        if (element.glitchInterval) {
            clearInterval(element.glitchInterval);
        }
        
        // Para legendas de gráfico, restaurar apenas o texto
        const labelSpan = element.querySelector('.chart-legend-label');
        const targetElement = labelSpan || element;
        
        if (targetElement.dataset.originalText) {
            targetElement.textContent = targetElement.dataset.originalText;
        }
    }

    getRandomChar() {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█';
        return chars[Math.floor(Math.random() * chars.length)];
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// MENU LATERAL
// ═══════════════════════════════════════════════════════════════════════════

class SidebarMenu {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.sidebar = document.getElementById('sidebar');
        this.closeSidebar = document.getElementById('closeSidebar');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        
        this.init();
    }

    init() {
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.open());
        }
        
        if (this.closeSidebar) {
            this.closeSidebar.addEventListener('click', () => this.close());
        }
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.close();
                this.setActive(link);
            });
        });

        document.addEventListener('click', (e) => {
            if (this.sidebar && !this.sidebar.contains(e.target) && 
                this.menuToggle && !this.menuToggle.contains(e.target)) {
                this.close();
            }
        });

        this.initSmoothScroll();
        this.initScrollSpy();
    }

    open() {
        if (this.sidebar) {
            this.sidebar.classList.add('active');
        }
    }

    close() {
        if (this.sidebar) {
            this.sidebar.classList.remove('active');
        }
    }

    setActive(activeLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 50;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('.section');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  SITE DEFI - ESTÉTICA ASCII');
    console.log('  Paradigma Education');
    console.log('═══════════════════════════════════════════════════════════════');
    
    // Inicializar componentes
    new ASCIIBackground();
    new TextGlitchEffect();
    new ScrollAnimations();
    new SidebarMenu();
    
    console.log('> Sistema inicializado');
    console.log('> Gráficos serão carregados conforme scroll (lazy load)');
});
