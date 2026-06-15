async function cadastrar(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;
    const senha = document.getElementById("senha").value.trim();
    const confirmesenha = document.getElementById("confirmesenha").value;

    if (senha !== confirmesenha) {
        alert("As senhas não coincidem");
        return;
    }

    const cliente = {
        nome,
        cpf,
        email,
        telefone,
        senha,
        ativo: true,
        ranking: 0,
        enderecosEntrega: [{
            logradouro: document.getElementById("logradouroEntrega").value,
            bairro: document.getElementById("bairroEntrega").value,
            numero: document.getElementById("numeroEntrega").value,
            estado: document.getElementById("estadoEntrega").value,
            cep: document.getElementById("cepEntrega").value,
            cidade: document.getElementById("cidadeEntrega").value
        }],
        enderecosCobranca: [{
            logradouro: document.getElementById("logradouroCobranca").value,
            bairro: document.getElementById("bairroCobranca").value,
            numero: document.getElementById("numeroCobranca").value,
            estado: document.getElementById("estadoCobranca").value,
            cep: document.getElementById("cepCobranca").value,
            cidade: document.getElementById("cidadeCobranca").value
        }]
    };

    try {
        const response = await fetch("http://localhost:8080/cliente/salvar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cliente)
        });

        console.log("STATUS:", response.status);

        if (!response.ok) {
            const erro = await response.text();
            console.error("ERRO BACK:", erro);
            alert("Erro ao cadastrar: " + erro);
            return;
        }

        // ✅ LER JSON UMA ÚNICA VEZ
        const clienteSalvo = await response.json();

        console.log("CLIENTE SALVO:", clienteSalvo);

        // ✅ SALVA USUÁRIO
        localStorage.setItem("usuarioLogado", JSON.stringify(clienteSalvo));

        // 🔥 ENVIA CARRINHO (SE EXISTIR)
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length > 0) {
            await fetch("http://localhost:8080/carrinho", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clienteId: clienteSalvo.id,
                    itens: cart.map(item => ({
                        nomeLivro: item.name,
                        preco: parseFloat(item.price.replace(",", ".")),
                        quantidade: 1
                    }))
                })
            });

            console.log("Carrinho enviado pro backend");

            // 🔥 limpa carrinho local
            localStorage.removeItem("cart");
        }


            await new Promise(r => setTimeout(r, 200));

        // ✅ REDIRECIONA
        window.location.href = "perfil.html";

    } catch (error) {
        console.error("ERRO FETCH:", error);
        alert("Erro ao cadastrar");
    }
}