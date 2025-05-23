// --- CONFIGURAÇÕES DO SITE ---
const SHEETY_API_URL_EXERCICIOS = 'https://api.sheety.co/d528f68442f942c04387dec50427dfac/gym2/exercicios';

// TODO o resto do seu código JavaScript deve vir dentro deste bloco:
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const addExerciseForm = document.getElementById('add-exercise-form');
    const responseMessage = document.getElementById('response-message');

    // --- FUNÇÃO PARA ENVIAR DADOS PARA O SHEETY (Adicionar Exercício) ---
    async function postDataToSheety(payload) {
        try {
            responseMessage.textContent = 'Enviando dados...';
            responseMessage.className = '';

            const response = await fetch(SHEETY_API_URL_EXERCICIOS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ exercicio: payload })
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMsg = result.errors && result.errors[0] ? result.errors[0].detail : 'Erro desconhecido ao enviar dados para Sheety.';
                throw new Error(`HTTP error! status: ${response.status} - ${errorMsg}`);
            }

            return result;
        } catch (error) {
            console.error('Erro ao enviar dados para Sheety:', error);
            responseMessage.textContent = 'Erro: ' + error.message;
            responseMessage.className = 'error';
            return null;
        }
    }

    // --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
    addExerciseForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const exerciseName = document.getElementById('exercise-name').value;
        const groupMuscular = document.getElementById('group-muscular').value;
        const focus = document.getElementById('focus').value;
        const imageLink = document.getElementById('image-link').value;

        const payload = {
            "Nome": exerciseName,
            "GrupoMuscular": groupMuscular,
            "SubGrupoMuscular": focus,
            "LinkImagem": imageLink
        };

        const result = await postDataToSheety(payload);

        if (result && result.exercicio) {
            responseMessage.textContent = 'Exercício adicionado com sucesso! ID: ' + result.exercicio.id;
            responseMessage.className = 'success';
            addExerciseForm.reset();
        } else {
            console.log("Falha ao adicionar exercício, verificar mensagem no DOM.");
        }
    });

}); // FIM DO DOMContentLoaded LISTENER
