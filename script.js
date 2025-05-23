// --- CONFIGURAÇÕES DO SITE ---
// SUBSTITUA PELA URL QUE VOCÊ COPIOU DO GOOGLE APPS SCRIPT APÓS A IMPLANTAÇÃO
const WEB_APP_URL = 'SUA_URL_DO_WEB_APP_AQUI'; // EX: 'https://script.google.com/macros/s/AKfycb.../exec';

// O código só será executado quando o DOM (HTML) estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
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

            // Apps Script pode retornar texto mesmo em erro HTTP
            const responseText = await response.text();
            let result;
            try {
                result = JSON.parse(responseText); // Tenta parsear como JSON
            } catch (e) {
                // Se não for JSON, trata como texto simples de erro
                result = { success: false, error: responseText || 'Erro desconhecido do servidor.' };
            }


            if (!response.ok) {
                // Se a resposta HTTP não for OK (ex: 400, 500)
                const errorMsg = result.error || 'Erro desconhecido do servidor.';
                throw new Error(`HTTP error! status: ${response.status} - ${errorMsg}`);
            }

            return result;
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            responseMessage.textContent = 'Erro: ' + error.message;
            responseMessage.className = 'error';
            return null;
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
            SubGrupoMuscular: focus, // 'Foco' do site vai para 'SubGrupoMuscular'
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
}); // FIM DO DOMContentLoaded LISTENER
