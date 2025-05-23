// --- CONFIGURAÇÕES DO SITE ---
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx9iUyMz7cgbQCaJ0LzQ3SY_a4R9sjfIC5AzWL0A2X1TcK1Ua72a-bm8PZdrGFQwfJu/exec'; // SUA URL DO WEB APP AQUI

// Elementos do DOM
const addExerciseForm = document.getElementById('add-exercise-form');
const responseMessage = document.getElementById('response-message');

// --- FUNÇÃO PARA ENVIAR DADOS PARA O APPS SCRIPT ---
async function postData(action, payload) {
    const urlParams = new URLSearchParams({ action: action });
    const url = `${WEB_APP_URL}?${urlParams.toString()}`;

    try {
        responseMessage.textContent = 'Enviando dados...';
        responseMessage.className = ''; // Limpa classes de status

        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors', // Essencial para requisições de origem cruzada
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json(); // Tenta ler a resposta como JSON

        if (!response.ok) {
            // Se a resposta HTTP não for OK (ex: 400, 500)
            const errorMsg = result.error || 'Erro desconhecido ao enviar dados.';
            throw new Error(`Erro HTTP! Status: ${response.status} - ${errorMsg}`);
        }

        return result; // Retorna o JSON de sucesso
    } catch (error) {
        console.error('Erro ao enviar dados:', error);
        responseMessage.textContent = 'Erro: ' + error.message;
        responseMessage.className = 'error';
        return null; // Retorna null em caso de erro
    }
}

// --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
addExerciseForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento padrão da página

    // Coleta os valores dos campos do formulário
    const exerciseName = document.getElementById('exercise-name').value;
    const groupMuscular = document.getElementById('group-muscular').value;
    const focus = document.getElementById('focus').value; // 'Foco' do site
    const imageLink = document.getElementById('image-link').value;

    // Prepara o "payload" (os dados a serem enviados)
    const payload = {
        Nome: exerciseName,
        GrupoMuscular: groupMuscular,
        Foco: focus, // Mapeado para 'SubGrupoMuscular' no Apps Script
        LinkImagem: imageLink
    };

    // Envia os dados para o Apps Script com a ação 'addExercicio'
    const result = await postData('addExercicio', payload);

    if (result && result.success) {
        responseMessage.textContent = result.message;
        responseMessage.className = 'success';
        addExerciseForm.reset(); // Limpa o formulário após o sucesso
    } else if (result && result.error) {
        responseMessage.textContent = 'Erro: ' + result.error;
        responseMessage.className = 'error';
    }
});