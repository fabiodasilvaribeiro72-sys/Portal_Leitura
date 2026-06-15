async function login(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {

        const response = await fetch("http://localhost:8080/cliente/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            alert("E-mail ou senha inválidos");
            return;
        }

        const cliente = await response.json();

        console.log("CLIENTE:", cliente);

        localStorage.setItem("usuarioLogado", JSON.stringify(cliente));

        // 🔥 ENVIA CARRINHO SE EXISTIR
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length > 0) {

            const responseCarrinho = await fetch("http://localhost:8080/carrinho", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clienteId: cliente.id,
                    itens: cart.map(item => ({
                        nomeLivro: item.name,
                        preco: parseFloat(item.price.replace(",", ".")),
                        quantidade: 1
                    }))
                })
            });

            if (!responseCarrinho.ok) {
                alert("Erro ao enviar carrinho");
                return;
            }

            localStorage.removeItem("cart");
        }

        // 🔥 REDIRECIONA NO FINAL
        window.location.href = "perfil.html";

    } catch (error) {
        console.error(error);
        alert("Erro no login");
    }
}