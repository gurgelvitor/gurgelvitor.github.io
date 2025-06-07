// Função para salvar dados no localStorage
function saveProgress(data) {
    localStorage.setItem('userProgress', JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadProgress() {
    const savedData = localStorage.getItem('userProgress');
    return savedData ? JSON.parse(savedData) : [];
}

// Função para adicionar nova medida/peso
function addProgress(exercise, weight, date) {
    const progressData = loadProgress();
    progressData.push({
        exercise: exercise,
        weight: weight,
        date: date || new Date().toISOString()
    });
    saveProgress(progressData);
    updateProgressList();
}

// Função para atualizar a lista de progressos
function updateProgressList() {
    const progressList = document.getElementById('progress-list');
    if (!progressList) return;

    const progressData = loadProgress();
    progressList.innerHTML = '';

    if (progressData.length === 0) {
        progressList.innerHTML = '<p>Nenhum registro encontrado</p>';
        return;
    }

    progressData.forEach((item, index) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        const li = document.createElement('li');
        li.className = 'progress-item';
        li.innerHTML = `
            <div class="progress-details">
                <span class="exercise-name">${item.exercise}</span>
                <span class="weight">${item.weight} kg</span>
                <span class="date">${formattedDate}</span>
            </div>
            <div class="action-buttons">
                <button onclick="editProgress(${index})" class="edit-btn">
                    <i class="material-icons">edit</i>
                </button>
                <button onclick="deleteProgress(${index})" class="delete-btn">
                    <i class="material-icons">delete</i>
                </button>
            </div>
        `;
        progressList.appendChild(li);
    });
}

// Função para editar um registro
function editProgress(index) {
    const progressData = loadProgress();
    if (index >= 0 && index < progressData.length) {
        // Criar um modal de edição
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="edit-modal-content">
                <h3>Editar Progresso</h3>
                <form id="edit-form">
                    <div class="form-group">
                        <label for="edit-exercise">Exercício:</label>
                        <input type="text" id="edit-exercise" value="${progressData[index].exercise}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="edit-weight">Peso (kg):</label>
                        <input type="number" id="edit-weight" value="${progressData[index].weight}" step="0.1" min="0" required>
                    </div>
                    <div class="modal-buttons">
                        <button type="button" class="cta-button cancel-btn">Cancelar</button>
                        <button type="submit" class="cta-button">Salvar</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Configurar o formulário de edição
        const editForm = modal.querySelector('#edit-form');
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newWeight = document.getElementById('edit-weight').value;
            if (newWeight) {
                progressData[index].weight = newWeight;
                saveProgress(progressData);
                updateProgressList();
                modal.remove();
            }
        });
        
        // Configurar botão de cancelar
        const cancelButton = modal.querySelector('.cancel-btn');
        cancelButton.addEventListener('click', () => {
            modal.remove();
        });
    }
}

// Função para deletar um registro
function deleteProgress(index) {
    const progressData = loadProgress();
    if (index >= 0 && index < progressData.length) {
        progressData.splice(index, 1);
        saveProgress(progressData);
        updateProgressList();
    }
}

// Função para inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados salvos
    updateProgressList();

    // Configurar o formulário
    const form = document.getElementById('progress-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const exercise = document.getElementById('exercise').value;
            const weight = document.getElementById('weight').value;
            
            if (exercise && weight) {
                addProgress(exercise, weight);
                form.reset();
            }
        });
    }
});
