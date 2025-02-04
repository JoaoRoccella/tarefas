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
    turmaSelect.innerHTML = '<option value="">-- Escolha a turma --</option>'; // Adiciona o valor padrão

    // Itera pelas turmas no JSON e cria as opções
    data.turmas.forEach((turma) => {
        const option = document.createElement("option");
        option.value = turma.id;
        option.textContent = turma.codigo;
        turmaSelect.appendChild(option);
    });

    // Adiciona o evento para reiniciar os seletores quando a turma for alterada
    turmaSelect.addEventListener("change", () => {
        const turmaId = turmaSelect.value;

        // Reinicia os demais seletores
        professorSelect.innerHTML = '<option value="">-- Escolha o professor --</option>';
        tarefaSelect.innerHTML = '<option value="">-- Escolha a tarefa --</option>';
        professorSelect.disabled = true;
        tarefaSelect.disabled = true;
        fileInput.disabled = true;
        uploadButton.disabled = true;

        if (turmaId) {
            updateProfessores(turmaId);
        }
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

    // Reinicia as tarefas ao alterar o professor
    professorSelect.addEventListener("change", () => {
        const professorId = professorSelect.value;
        if (turmaId && professorId) {
            updateTarefas(turmaId, professorId);
        } else {
            tarefaSelect.innerHTML = '<option value="">-- Escolha a tarefa --</option>';
            tarefaSelect.disabled = true;
        }
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
}

// Atualiza os arquivos selecionados no input
fileInput.addEventListener("change", () => {
    const files = fileInput.files;
    const fileNames = Array.from(files).map((file) => file.name).join(", ");
    statusMessage.textContent = `Arquivos anexados: ${fileNames}`;
    statusMessage.style.color = "blue"; // Exibe a mensagem em azul
});

// Evento para o botão de upload
uploadButton.addEventListener("click", (event) => {
    event.preventDefault(); // Evita o comportamento padrão do botão
    const turmaId = turmaSelect.value;
    const professorId = professorSelect.value;
    const tarefaId = tarefaSelect.value;

    if (turmaId && professorId && tarefaId && fileInput.files.length > 0) {
        statusMessage.textContent = "Upload realizado com sucesso!";
        statusMessage.style.color = "green"; // Exibe a mensagem em verde
    } else {
        statusMessage.textContent = "Por favor, preencha todos os campos e selecione pelo menos um arquivo.";
        statusMessage.style.color = "red"; // Exibe a mensagem em vermelho
    }
});

// Carrega os dados ao inicializar
loadData();
