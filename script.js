// --- CONFIGURAÇÕES DO SITE ---
// URLs fornecidas pelo Sheety
const SHEETY_API_URL_EXERCICIOS = 'https://api.sheety.co/d528f68442f942c04387dec50427dfac/gym2/exercicios'; // ATUALIZE AQUI!

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
            // Sheety espera os dados aninhados sob o nome da aba no singular
            // O nome da aba é 'exercicios', então o singular é 'exercicio'
            body: JSON.stringify({ exercicio: payload })
        });

        const result = await response.json();

        if (!response.ok) {
            // Se a resposta HTTP não for OK, Sheety retorna um objeto de erro
            const errorMsg = result.error ? result.error.message : 'Erro desconhecido ao enviar dados para Sheety.';
            throw new Error(`HTTP error! status: ${response.status} - ${errorMsg}`);
        }

        return result; // Sheety retorna o objeto salvo aninhado (ex: { exercicio: { ... } })
    } catch (error) {
        console.error('Erro ao enviar dados para Sheety:', error);
        responseMessage.textContent = 'Erro: ' + error.message;
        responseMessage.className = 'error';
        return null;
    }
}

// --- LÓGICA DE SUBMISSÃO DO FORMULÁRIO ---
addExerciseForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    // Coleta os valores dos campos do formulário
    const exerciseName = document.getElementById('exercise-name').value;
    const groupMuscular = document.getElementById('group-muscular').value;
    const focus = document.getElementById('focus').value; // 'Foco' do site
    const imageLink = document.getElementById('image-link').value;

    // Prepara o "payload" (os dados a serem enviados)
    // Os nomes das chaves devem corresponder EXATAMENTE aos cabeçalhos da sua planilha Google
    const payload = {
        "Nome": exerciseName,
        "GrupoMuscular": groupMuscular,
        "SubGrupoMuscular": focus, // Mapeado para 'SubGrupoMuscular' na planilha
        "LinkImagem": imageLink
    };

    // Envia os dados para o Sheety
    const result = await postDataToSheety(payload);

    if (result && result.exercicio) { // Verifica se o Sheety retornou o objeto de exercício
        responseMessage.textContent = 'Exercício adicionado com sucesso! ID: ' + result.exercicio.id;
        responseMessage.className = 'success';
        addExerciseForm.reset(); // Limpa o formulário após o sucesso
    } else {
        // A mensagem de erro já é definida dentro de postDataToSheety
        console.log("Falha ao adicionar exercício, verificar mensagem no DOM.");
    }
});
