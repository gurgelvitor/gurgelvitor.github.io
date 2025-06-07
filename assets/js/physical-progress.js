// Função para salvar dados no localStorage
function savePhysicalProgress(type, data) {
    const key = `physicalProgress_${type}`;
    localStorage.setItem(key, JSON.stringify(data));
}

// Função para carregar dados do localStorage
function loadPhysicalProgress(type) {
    const key = `physicalProgress_${type}`;
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : [];
}

// Função para atualizar a seção ativa
function updateActiveSection(type) {
    const sections = document.querySelectorAll('.progress-section');
    const buttons = document.querySelectorAll('.progress-type-btn');
    
    sections.forEach(section => {
        section.classList.toggle('active', section.dataset.section === type);
    });
    
    buttons.forEach(button => {
        button.classList.toggle('active', button.dataset.type === type);
    });
}

// Função para registrar peso
function registerWeight() {
    const weight = document.getElementById('current-weight').value;
    const date = document.getElementById('weight-date').value;
    
    if (weight && date) {
        const weightData = loadPhysicalProgress('peso');
        weightData.push({
            weight: parseFloat(weight),
            date: date
        });
        savePhysicalProgress('peso', weightData);
        updateWeightHistory();
        document.getElementById('weight-form').reset();
    }
}

// Função para registrar massa muscular
function registerMass() {
    const mass = document.getElementById('current-mass').value;
    const date = document.getElementById('mass-date').value;
    
    if (mass && date) {
        const massData = loadPhysicalProgress('massa');
        massData.push({
            mass: parseFloat(mass),
            date: date
        });
        savePhysicalProgress('massa', massData);
        updateMassHistory();
        document.getElementById('mass-form').reset();
    }
}

// Função para registrar medida
function registerMeasure() {
    const type = document.getElementById('measure-type').value;
    const value = document.getElementById('measure-value').value;
    const date = document.getElementById('measure-date').value;
    
    // Validar se todos os campos estão preenchidos
    if (!type || !value || !date) {
        alert('Por favor, preencha todos os campos');
        return;
    }

    // Validar se é um número válido
    if (isNaN(value)) {
        alert('Por favor, insira um número válido para a medida');
        return;
    }

    // Validar se a data é válida
    if (new Date(date).toString() === 'Invalid Date') {
        alert('Por favor, selecione uma data válida');
        return;
    }

    // Converter valor para número
    const numericValue = parseFloat(value);
    
    // Criar novo registro
    const newMeasure = {
        type: type,
        value: numericValue,
        date: date
    };

    // Carregar dados existentes
    const measuresData = loadPhysicalProgress('medidas');
    
    // Adicionar novo registro
    measuresData.push(newMeasure);
    
    // Salvar no localStorage
    savePhysicalProgress('medidas', measuresData);
    
    // Atualizar a interface
    updateMeasuresHistory();
    
    // Limpar o formulário
    document.getElementById('measure-form').reset();
}

// Função para excluir registro de peso
function deleteWeight(index) {
    const weightData = loadPhysicalProgress('peso');
    if (index >= 0 && index < weightData.length) {
        weightData.splice(index, 1);
        savePhysicalProgress('peso', weightData);
        updateWeightHistory();
    }
}

// Função para atualizar histórico de peso
function updateWeightHistory() {
    const history = document.getElementById('weight-history');
    const weightData = loadPhysicalProgress('peso');
    
    if (!history) return;
    
    history.innerHTML = '';
    if (weightData.length === 0) {
        history.innerHTML = '<p>Nenhum registro encontrado</p>';
        return;
    }
    
    weightData.forEach((item, index) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        
        const li = document.createElement('li');
        li.className = 'progress-item';
        li.innerHTML = `
            <div class="progress-details">
                <span class="weight">${item.weight.toFixed(1)} kg</span>
                <span class="date">${formattedDate}</span>
            </div>
            <button onclick="deleteWeight(${index})" class="delete-btn">
                <i class="material-icons">delete</i>
            </button>
        `;
        history.appendChild(li);
    });
}

// Função para excluir registro de medidas
function deleteMeasure(index) {
    const measuresData = loadPhysicalProgress('medidas');
    if (index >= 0 && index < measuresData.length) {
        measuresData.splice(index, 1);
        savePhysicalProgress('medidas', measuresData);
        updateMeasuresHistory();
    }
}

// Função para filtrar medidas por tipo
function filterMeasuresByType(type) {
    const measuresData = loadPhysicalProgress('medidas');
    return measuresData.filter(item => item.type === type);
}

// Função para atualizar histórico de medidas
function updateMeasuresHistory() {
    const history = document.getElementById('measure-history');
    const measuresData = loadPhysicalProgress('medidas');
    const selectedType = document.getElementById('measure-type').value;
    
    if (!history) return;
    
    history.innerHTML = '';
    
    // Se nenhum tipo foi selecionado, mostra todos os registros
    const filteredData = selectedType ? 
        filterMeasuresByType(selectedType) : 
        measuresData;
    
    if (filteredData.length === 0) {
        history.innerHTML = '<p>Nenhum registro encontrado</p>';
        return;
    }
    
    filteredData.forEach((item, index) => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('pt-BR');
        const type = item.type.charAt(0).toUpperCase() + item.type.slice(1);
        
        const li = document.createElement('li');
        li.className = 'progress-item';
        li.innerHTML = `
            <div class="progress-details">
                <span class="measure-type">${type}</span>
                <span class="measure-value">${item.value.toFixed(1)} cm</span>
                <span class="date">${formattedDate}</span>
            </div>
            <button onclick="deleteMeasure(${index})" class="delete-btn">
                <i class="material-icons">delete</i>
            </button>
        `;
        history.appendChild(li);
    });
}

// Função para mostrar gráfico de peso
function showWeightGraph() {
    const weightData = loadPhysicalProgress('peso');
    
    // Verifica se temos dados suficientes
    if (!weightData || weightData.length < 2) {
        alert('Você precisa ter pelo menos 2 medições de peso para gerar o gráfico');
        return;
    }

    // Ordenar os dados por data (mais antigo primeiro)
    const sortedData = [...weightData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = sortedData.map(item => new Date(item.date));
    const weights = sortedData.map(item => item.weight);

    // Criar modal do gráfico
    const chartModal = document.createElement('div');
    chartModal.className = 'chart-modal';
    chartModal.innerHTML = `
        <div class="chart-modal-content">
            <h3>Evolução do Peso</h3>
            <div id="chart-container"></div>
            <button class="cta-button" onclick="this.closest('.chart-modal').remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(chartModal);
    
    // Criar e configurar o gráfico
    const ctx = document.createElement('canvas');
    ctx.id = 'chart';
    document.getElementById('chart-container').appendChild(ctx);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => date.toLocaleDateString('pt-BR')),
            datasets: [{
                label: 'Peso (kg)',
                data: weights,
                borderColor: '#2196F3',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Peso (kg)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Evolução do Peso'
                }
            }
        }
    });
}

// Função para mostrar gráfico de medidas
function showMeasureGraph() {
    const selectedType = document.getElementById('measure-type').value;
    const measuresData = loadPhysicalProgress('medidas');
    
    // Verifica se temos dados suficientes
    if (!selectedType || !measuresData) {
        alert('Selecione uma parte do corpo e tenha pelo menos 2 medições para gerar o gráfico');
        return;
    }

    // Filtrar dados pelo tipo selecionado
    const filteredData = measuresData.filter(item => item.type === selectedType);
    
    if (filteredData.length < 2) {
        alert('Você precisa ter pelo menos 2 medições para gerar o gráfico');
        return;
    }

    // Ordenar os dados por data (mais antigo primeiro)
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dates = sortedData.map(item => new Date(item.date));
    const values = sortedData.map(item => item.value);

    const title = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
    
    // Criar modal do gráfico
    const chartModal = document.createElement('div');
    chartModal.className = 'chart-modal';
    chartModal.innerHTML = `
        <div class="chart-modal-content">
            <h3>${title}</h3>
            <div id="chart-container"></div>
            <button class="cta-button" onclick="this.closest('.chart-modal').remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(chartModal);
    
    // Criar e configurar o gráfico
    const ctx = document.createElement('canvas');
    ctx.id = 'chart';
    document.getElementById('chart-container').appendChild(ctx);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(date => date.toLocaleDateString('pt-BR')),
            datasets: [{
                label: title,
                data: values,
                borderColor: '#4CAF50',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Medida (cm)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

// Função para criar gráficos
function createChart(title, dates, values) {
    const chartModal = document.createElement('div');
    chartModal.className = 'chart-modal';
    chartModal.innerHTML = `
        <div class="chart-modal-content">
            <h3>${title}</h3>
            <div id="chart-container">
                <canvas id="chart"></canvas>
            </div>
            <button class="cta-button" onclick="this.closest('.chart-modal').remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(chartModal);

    // Configurar o gráfico usando Chart.js
    const ctx = document.getElementById('chart').getContext('2d');
    
    // Converter datas para formato do Chart.js
    const chartDates = dates.map(date => new Date(date).toLocaleDateString('pt-BR'));
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartDates,
            datasets: [{
                label: title,
                data: values,
                borderColor: '#4CAF50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: title
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}

// Função para inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    // Configurar troca de seções
    const typeButtons = document.querySelectorAll('.progress-type-btn');
    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateActiveSection(button.dataset.type);
        });
    });

    // Configurar formulários
    document.getElementById('weight-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        registerWeight();
    });

    const measureForm = document.getElementById('measure-form');
    if (measureForm) {
        measureForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registerMeasure();
        });
        
        // Adicionar evento para o select de tipo de medida
        const measureTypeSelect = document.getElementById('measure-type');
        if (measureTypeSelect) {
            measureTypeSelect.addEventListener('change', (e) => {
                const selectedType = e.target.value;
                if (selectedType) {
                    // Atualizar o histórico quando um tipo for selecionado
                    updateMeasuresHistory();
                    
                    // Verificar se há medições suficientes para mostrar o botão do gráfico
                    const filteredData = filterMeasuresByType(selectedType);
                    const graphButton = document.querySelector('.graph-btn');
                    if (graphButton) {
                        // Mostrar o botão se houver pelo menos 2 medições
                        graphButton.style.display = filteredData.length >= 2 ? 'inline-block' : 'none';
                        
                        // Atualizar o texto do botão para mostrar quantas medições existem
                        const measuresCount = filteredData.length;
                        graphButton.innerHTML = `Gráfico (${measuresCount} medições)`;
                    }
                }
            });
        }
    }

    // Carregar dados salvos
    updateWeightHistory();
    updateMeasuresHistory();
});
