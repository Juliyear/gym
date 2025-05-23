// --- CONFIGURAÇÕES DO SITE ---
// URLs fornecidas pelo Sheety para sua planilha "gym2" e aba "Exercicios"
const SHEETY_API_URL_EXERCICIOS = 'https://api.sheety.co/d528f68442f942c04387dec50427dfac/gym2/exercicios';

// O código só será executado quando o DOM (HTML) estiver completamente carregado
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
                method: 'POST', // Método HTTP para adicionar dados
                headers: {
                    'Content-Type': 'application/json' // Indica que o corpo da requisição é JSON
                },
                // ESSA LINHA É A CRÍTICA. O Sheety espera 'exercicio' (singular, minúscula inicial)
                // porque a aba é "Exercicios" (plural).
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

        // Os nomes das chaves (Nome, GrupoMuscular, etc.) devem corresponder EXATAMENTE
        // aos cabeçalhos da sua planilha Google
        const payload = {
  nome: "Teste API",
  grupoMuscular: "Costas",
  subGrupoMuscular: "Dorsal",
  linkImagem: "https://exemplo.com/imagem.gif"
};


        const result = await postDataToSheety(payload);

        if (result && result.exercicio) {
            responseMessage.textContent = 'Exercício adicionado com sucesso! ID: ' + result.exercicio.id;
            responseMessage.className = 'success';
            addExerciseForm.reset();
        } else {
            const result = await response.json();
            console.log("Falha ao adicionar exercício, verificar mensagem de erro no DOM.");
        }
    });
});
