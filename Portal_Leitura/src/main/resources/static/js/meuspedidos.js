document.addEventListener("DOMContentLoaded", async () => {

    const usuario =
        JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || !usuario.id) {
        window.location.href = "/login.html";
        return;
    }

    const container =
        document.getElementById("listaItens");

    try {

        const response = await fetch(
            `http://localhost:8080/pedido/cliente/${usuario.id}`
        );

        const pedidos = await response.json();

        // 🔴 SEM PEDIDOS
        if (!pedidos || pedidos.length === 0) {

            document.getElementById("numeroPedido").innerText =
                "Nenhum pedido ainda";

            document.getElementById("statusPedido").innerText =
                "-";

            container.innerHTML = `
                <div class="text-center p-10 text-gray-500">

                    <p class="text-xl">
                        📦 Você ainda não fez pedidos
                    </p>

                    <p class="mt-2">
                        Quando comprar algo, aparecerá aqui
                    </p>

                    <a href="/perfil.html"
                       class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">

                       Ir às compras
                    </a>
                </div>
            `;

            return;
        }

        container.innerHTML = "";

        pedidos.forEach(pedido => {

            const div =
                document.createElement("div");

            div.className =
                "border p-4 rounded mb-4 bg-white shadow";

            let corStatus =
                "bg-yellow-100 text-yellow-700";

            if (pedido.status === "APROVADO") {

                corStatus =
                    "bg-green-100 text-green-700";

            } else if (pedido.status === "RECUSADO") {

                corStatus =
                    "bg-red-100 text-red-700";
            }

            div.innerHTML = `
                <p class="font-bold text-lg">
                    Pedido nº ${pedido.id}
                </p>

                <span class="${corStatus} px-2 py-1 rounded text-sm">
                    ${pedido.status}
                </span>

                <div class="mt-3" id="itens-${pedido.id}"></div>

                <p class="mt-3 font-semibold">
                    Total: R$ ${pedido.total.toFixed(2)}
                </p>
            `;

            const itensContainer =
                div.querySelector(`#itens-${pedido.id}`);

            // 🔥 ITENS
            if (pedido.itens && pedido.itens.length > 0) {

                pedido.itens.forEach(item => {

                    const itemDiv =
                        document.createElement("div");

                    itemDiv.className =
                        "flex justify-between border-b py-2 text-sm";

                    itemDiv.innerHTML = `
                        <div>
                            <p class="font-medium">
                                ${item.nomeLivro}
                            </p>

                            <p>
                                Quantidade: ${item.quantidade}
                            </p>
                        </div>

                        <div>
                            R$ ${item.preco.toFixed(2)}
                        </div>
                    `;

                    itensContainer.appendChild(itemDiv);
                });
            }

            container.appendChild(div);
        });

    } catch (error) {

        console.error(
            "Erro ao carregar pedidos:",
            error
        );

        container.innerHTML = `
            <p class="text-red-500">
                Erro ao carregar pedidos
            </p>
        `;
    }
});