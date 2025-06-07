document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o botão de mostrar/esconder exercícios em todas as seções de treino
    const trainingCards = document.querySelectorAll('.training-card');
    
    trainingCards.forEach(card => {
        const ol = card.querySelector('ol');
        if (ol) {
            // Cria o botão
            const button = document.createElement('button');
            button.className = 'show-exercises-btn';
            button.innerHTML = '<i class="material-icons">expand_more</i> Mostrar Exercícios';
            
            // Insere o botão após o título
            const h2 = card.querySelector('h2');
            h2.parentNode.insertBefore(button, h2.nextSibling);
            
            // Adiciona o evento de clique
            button.addEventListener('click', function() {
                ol.classList.toggle('show');
                button.classList.toggle('active');
                button.innerHTML = button.classList.contains('active') 
                    ? '<i class="material-icons">expand_less</i> Esconder Exercícios'
                    : '<i class="material-icons">expand_more</i> Mostrar Exercícios';
            });
        }
    });
}); 