document.addEventListener('DOMContentLoaded', () => {
    // Set dynamic greeting
    const greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            greetingElement.textContent = 'Bom dia!';
        } else if (currentHour < 18) {
            greetingElement.textContent = 'Boa tarde!';
        } else {
            greetingElement.textContent = 'Boa noite!';
        }
    }

    // Motivational Quote
    const motivationalQuoteElement = document.getElementById('motivational-quote');
    if (motivationalQuoteElement) {
        const quotes = [
            "Acredite em você mesmo e tudo será possível.",
            "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
            "A persistência realiza o impossível.",
            "Não espere por oportunidades extraordinárias. Agarre as ocasiões comuns e as torne grandes.",
            "Sua única limitação é você mesmo.",
            "Comece onde você está. Use o que você tem. Faça o que você pode.",
            "A jornada de mil milhas começa com um único passo."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        motivationalQuoteElement.innerHTML = `<em>${randomQuote}</em>`;
    }

    // Placeholder for Weather API
    const temperatureElement = document.getElementById('temperature');
    const locationElement = document.getElementById('location');
    if (temperatureElement && locationElement) {
        // Simulating weather data
        temperatureElement.textContent = '28°C'; // Example temperature
        locationElement.textContent = 'Rio de Janeiro'; // Example Location
        // Replace with actual API call as commented in previous versions
    }

    // Theme Switcher Logic
    const themeToggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggleButton) {
            themeToggleButton.innerHTML = theme === 'dark' ? '<i class="material-icons">light_mode</i>' : '<i class="material-icons">dark_mode</i>';
        }
    }

    if (currentTheme) {
        applyTheme(currentTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Card Animations with IntersectionObserver
    const cards = document.querySelectorAll('.card');
    if (cards.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    // observer.unobserve(entry.target); // Optional: unobserve after animation
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }

    // Bottom Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const pageMap = {
        'home': 'index.html',
        'workout': 'treinos.html', // Updated to use the main workouts page
        'nutrition': 'tabelanutricional.html',
        'progress': 'mapacorpo.html', // Using body map as progress page
        'profile': 'sobrenos.html' // About us as profile
    };

    // Set active nav item based on current page
    function setActiveNav() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop();
        
        navItems.forEach(item => {
            const page = item.getAttribute('data-page');
            item.classList.remove('active');
            
            // Smart page detection
            if (page === 'home' && (currentPage === 'index.html' || currentPage === '' || currentPath.endsWith('/'))) {
                item.classList.add('active');
            } else if (page === 'workout' && (currentPath.includes('pasttreinos') || currentPath.includes('treino'))) {
                item.classList.add('active');
            } else if (page === 'nutrition' && (currentPage === 'tabelanutricional.html' || currentPath.includes('nutri'))) {
                item.classList.add('active');
            } else if (page === 'progress' && (currentPage === 'mapacorpo.html' || currentPath.includes('mapa') || currentPath.includes('progress'))) {
                item.classList.add('active');
            } else if (page === 'profile' && (currentPage === 'sobrenos.html' || currentPage === 'dicas.html' || currentPath.includes('sobre') || currentPath.includes('dica'))) {
                item.classList.add('active');
            }
        });
    }

    // Navigation click handlers
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.getAttribute('data-page');
            let targetUrl = pageMap[page];
            
            // Calculate relative path based on current location
            const currentPath = window.location.pathname;
            const currentDepth = currentPath.split('/').length - 1;
            
            if (currentDepth > 1) {
                // We're in a subdirectory, need to go up
                const upLevels = currentDepth - 1;
                const prefix = '../'.repeat(upLevels);
                targetUrl = prefix + targetUrl;
            }
            
            if (targetUrl) {
                // Add loading state
                e.currentTarget.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.currentTarget.style.transform = '';
                }, 150);
                
                // Navigate to page
                window.location.href = targetUrl;
            }
        });

        // Add haptic feedback for mobile devices
        item.addEventListener('touchstart', () => {
            if (navigator.vibrate) {
                navigator.vibrate(10); // Very light vibration
            }
        });
    });

    // Set initial active state
    setActiveNav();

    // Update active nav when page changes (for single page apps)
    window.addEventListener('popstate', setActiveNav);

    // Theme color picker logic
    function setThemeColor(color) {
        document.documentElement.setAttribute('data-theme-color', color);
        localStorage.setItem('themeColor', color);
        // Atualiza seleção visual
        document.querySelectorAll('.theme-color-btn').forEach(btn => {
            btn.classList.toggle('selected', btn.getAttribute('data-color') === color);
        });
    }

    // Inicialização do tema de cor
    const savedColor = localStorage.getItem('themeColor') || 'default';
    setThemeColor(savedColor);
    // Eventos dos botões de cor
    document.querySelectorAll('.theme-color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setThemeColor(this.getAttribute('data-color'));
            picker.style.display = 'none';
            pickerOpen = false;
        });
    });

    // Theme color picker dropdown logic
    function closeThemeColorPicker() {
        document.getElementById('theme-color-picker').style.display = 'none';
    }
    function openThemeColorPicker() {
        document.getElementById('theme-color-picker').style.display = 'flex';
    }

    const mainBtn = document.getElementById('theme-color-main-btn');
    const picker = document.getElementById('theme-color-picker');
    let pickerOpen = false;

    mainBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        pickerOpen = !pickerOpen;
        picker.style.display = pickerOpen ? 'flex' : 'none';
    });

    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (pickerOpen && !picker.contains(e.target) && e.target !== mainBtn) {
            picker.style.display = 'none';
            pickerOpen = false;
        }
    });

    // Fechar ao escolher cor
    document.querySelectorAll('.theme-color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            picker.style.display = 'none';
            pickerOpen = false;
        });
    });

    // Função para criar a tabela de visualização rápida
    function createQuickViewTable(card) {
        const exercises = card.querySelectorAll('li');
        const table = document.createElement('table');
        table.className = 'quick-view-table';
        
        // Cabeçalho da tabela
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Exercício</th>
                <th>Repetições</th>
                <th>Grupo Muscular</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Corpo da tabela
        const tbody = document.createElement('tbody');
        exercises.forEach(exercise => {
            const reps = exercise.querySelector('.reps')?.textContent || '';
            const muscleGroup = exercise.querySelector('.ativ')?.textContent || '';
            
            // Pega o texto do exercício de acordo com o padrão presente
            let exerciseName = '';
            const textContent = exercise.textContent;
            
            if (reps) {
                // Se tem reps, pega o texto até a primeira ocorrência de reps
                const repsIndex = textContent.indexOf(reps);
                if (repsIndex !== -1) {
                    exerciseName = textContent.substring(0, repsIndex).trim();
                }
            } else if (muscleGroup) {
                // Se não tem reps mas tem muscleGroup, pega o texto até a primeira ocorrência de muscleGroup
                const muscleIndex = textContent.indexOf(muscleGroup);
                if (muscleIndex !== -1) {
                    exerciseName = textContent.substring(0, muscleIndex).trim();
                }
            }
                
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${exerciseName}</td>
                <td>${reps}</td>
                <td>${muscleGroup}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        return table;
    }

    // Função para criar o modal
    function createQuickViewModal(card) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        
        const content = document.createElement('div');
        content.className = 'quick-view-content';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'quick-view-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };
        
        const title = document.createElement('h2');
        title.textContent = card.querySelector('h2')?.textContent || 'Treino';
        
        const table = createQuickViewTable(card);
        
        content.appendChild(closeBtn);
        content.appendChild(title);
        content.appendChild(table);
        modal.appendChild(content);
        
        return modal;
    }

    // Função para adicionar o botão de visualização rápida
    function addQuickViewButton(card) {
        // Verifica se o botão já existe
        if (card.querySelector('.quick-view-btn')) return;
        
        const button = document.createElement('button');
        button.className = 'quick-view-btn';
        button.innerHTML = '<i class="material-icons">visibility</i>';
        button.title = 'Visualização Rápida';
        
        button.onclick = () => {
            const modal = createQuickViewModal(card);
            document.body.appendChild(modal);
            // Pequeno delay para garantir que o modal seja adicionado antes de mostrar
            setTimeout(() => modal.classList.add('active'), 10);
            
            // Fechar modal ao clicar fora
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => modal.remove(), 300);
                }
            };
        };
        
        card.appendChild(button);
    }

    // Função para inicializar os botões de visualização rápida
    function initializeQuickViewButtons() {
        const trainingCards = document.querySelectorAll('.card.content-card.training-card');
        trainingCards.forEach(addQuickViewButton);
    }

    // Inicializa os botões quando o DOM estiver carregado
    initializeQuickViewButtons();

    // Observa mudanças no DOM para adicionar botões a novos cards
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList?.contains('card') && 
                            node.classList?.contains('content-card') && 
                            node.classList?.contains('training-card')) {
                            addQuickViewButton(node);
                        }
                        // Verifica também os filhos do nó adicionado
                        const trainingCards = node.querySelectorAll('.card.content-card.training-card');
                        trainingCards.forEach(addQuickViewButton);
                    }
                });
            }
        });
    });

    // Inicia a observação do DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});