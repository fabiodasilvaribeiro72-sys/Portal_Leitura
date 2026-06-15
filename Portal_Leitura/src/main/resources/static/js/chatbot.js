document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("chat-input");

    input.addEventListener("keypress", function(event) {

        if (event.key === "Enter") {
            enviarMensagemChat();
        }
    });
});

async function enviarMensagemChat() {

    const input = document.getElementById("chat-input");

    const mensagem = input.value.trim();

    if (!mensagem) {
        return;
    }

    adicionarMensagem(mensagem, "user");

    input.value = "";

    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                mensagem: mensagem
            })
        });

        const data = await response.json();

        adicionarMensagem(data.resposta, "bot");

    } catch (e) {

        adicionarMensagem(
            "Erro ao conectar com a IA.",
            "bot"
        );
    }
}

function adicionarMensagem(texto, tipo) {

    const area = document.getElementById("chat-mensagens");

    const div = document.createElement("div");

    div.className =
        tipo === "user"
            ? "mensagem-user"
            : "mensagem-bot";

    div.innerText = texto;

    area.appendChild(div);

    area.scrollTop = area.scrollHeight;
}

function toggleChat() {

    const chat = document.getElementById("chat-container");

    chat.classList.toggle("fechado");
}