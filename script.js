// Elementos DOM
const turmaSelect = document.getElementById("turma");
const professorSelect = document.getElementById("professor");
const tarefaSelect = document.getElementById("tarefa");
const fileInput = document.getElementById("file-input");
const uploadButton = document.getElementById("upload-button");
const statusMessage = document.getElementById("status-message");

// Variável para armazenar os dados do JSON
let data = {};

// Função para carregar os dados do arquivo data.json
async function loadData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error("Erro ao carregar o arquivo JSON.");
        }
        data = await response.json();
        populateTurmas(); // Popula as turmas após carregar os dados
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

// Popula o dropdown de turmas
function populateTurmas() {
    turmaSelect.innerHTML = '<option value="">-- Escolha a turma --</option>';
    data.turmas.forEach((turma) => {
        const option = document.createElement("option");
        option.value = turma.id;
        option.textContent = turma.codigo;
        turmaSelect.appendChild(option);
    });
}

// Atualiza os professores com base na seleção da turma
function updateProfessores(turmaId) {
    professorSelect.innerHTML = '<option value="">-- Escolha o professor --</option>';
    professorSelect.disabled = false;

    const professoresFiltrados = data.professores.filter((prof) =>
        data.tarefas.some((tarefa) => tarefa.turmaId == turmaId && tarefa.professorId == prof.id)
    );

    professoresFiltrados.forEach((prof) => {
        const option = document.createElement("option");
        option.value = prof.id;
        option.textContent = prof.nome;
        professorSelect.appendChild(option);
    });
}

// Atualiza as tarefas com base na turma e no professor
function updateTarefas(turmaId, professorId) {
    tarefaSelect.innerHTML = '<option value="">-- Escolha a tarefa --</option>';
    tarefaSelect.disabled = false;

    const tarefasFiltradas = data.tarefas.filter(
        (tarefa) => tarefa.turmaId == turmaId && tarefa.professorId == professorId
    );

    tarefasFiltradas.forEach((tarefa) => {
        const option = document.createElement("option");
        option.value = tarefa.id;
        option.textContent = `${tarefa.titulo} - ${tarefa.descricao}`;
        tarefaSelect.appendChild(option);
    });
}

// Habilita o botão de upload quando uma tarefa é selecionada
tarefaSelect.addEventListener("change", () => {
    if (tarefaSelect.value) {
        fileInput.disabled = false;
        uploadButton.disabled = false;
    } else {
        fileInput.disabled = true;
        uploadButton.disabled = true;
    }
});

// Eventos de seleção
turmaSelect.addEventListener("change", () => {
    const turmaId = turmaSelect.value;
    if (turmaId) {
        updateProfessores(turmaId);
    } else {
        professorSelect.disabled = true;
        tarefaSelect.disabled = true;
        fileInput.disabled = true;
        uploadButton.disabled = true;
    }
});

professorSelect.addEventListener("change", () => {
    const turmaId = turmaSelect.value;
    const professorId = professorSelect.value;
    if (turmaId && professorId) {
        updateTarefas(turmaId, professorId);
    } else {
        tarefaSelect.disabled = true;
        fileInput.disabled = true;
        uploadButton.disabled = true;
    }
});

// Carrega os dados ao inicializar
loadData();
