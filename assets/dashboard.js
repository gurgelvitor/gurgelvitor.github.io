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
});