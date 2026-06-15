async function carregarLivros() {
    try {
        const resposta = await fetch("http://localhost:8080/livro");
        const livros = await resposta.json();

        // Ajuda a depurar: Veja no F12 exatamente o que o Java te devolveu
        console.log("Dados recebidos do Java:", livros);

        const tabela = document.getElementById("lista-livros");

        if (!tabela) {
            console.error("Erro: O elemento #lista-livros não foi encontrado no HTML.");
            return;
        }

        tabela.innerHTML = "";

        if (livros.length === 0) {
            tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum livro encontrado no banco de dados.</td></tr>`;
            return;
        }

        livros.forEach(livro => {
            // Garante que se o Java mandou 'id' ou 'Id', ou 'titulo' ou 'Titulo', o JS tente ler os dois
            const id = livro.id || livro.Id || "";
            const isbn = livro.isbn || livro.Isbn || "";
            const titulo = livro.titulo || livro.Titulo || "";
            const autor = livro.autor || livro.Autor || "";
            const ano = livro.ano || livro.Ano || "";

            tabela.innerHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${isbn}</td>
                    <td>${titulo}</td>
                    <td>${autor}</td>
                    <td>${ano}</td>
                </tr>
            `;
        });
    } catch (erro) {
        console.error("Erro feio no fetch:", erro);
    }
}

// Isso força o JS a só rodar DEPOIS que todo o HTML e CSS estiverem carregados na tela
document.addEventListener("DOMContentLoaded", carregarLivros);