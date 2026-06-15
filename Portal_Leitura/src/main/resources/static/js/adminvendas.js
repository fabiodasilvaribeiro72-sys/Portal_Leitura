const lista = document.getElementById("lista-clientes");

async function carregarPedidos() {

    try {

        const response = await fetch("http://localhost:8080/admin/pedidos");
        const pedidos = await response.json();

        console.log(pedidos);

        lista.innerHTML = "";

        pedidos.forEach(p => {

            const tr = document.createElement("tr");

            const itensComTroca = p.itens
                ? p.itens.filter(item => item.cupomTroca)
                : [];

            const temCupomTrocaNoPedido =
                itensComTroca.length > 0;

            const temCupomTrocaPendente =
                itensComTroca.some(item =>
                    !item.cupomTrocaAprovado
                );

            let botoes = "";

            if (p.status === "AGUARDANDO_APROVACAO") {

                botoes += `
                    <button class="btn btn-aprovar"
                            onclick="aprovar(${p.id})">
                        Aprovar Pedido
                    </button>

                    <button class="btn btn-recusar"
                            onclick="recusar(${p.id})">
                        Recusar Pedido
                    </button>
                `;
            }

            if (
                temCupomTrocaNoPedido &&
                temCupomTrocaPendente &&
                p.status !== "DESPACHADO" &&
                p.status !== "FINALIZADO"
            ) {

                botoes += `
                    <div class="acoes-cupom"
                         style="
                            margin-top:5px;
                            border-top:1px dashed #ccc;
                            padding-top:5px;">

                        <small style="
                            display:block;
                            margin-bottom:5px;
                            color:#b45309;
                            font-weight:bold;">
                            Cupom de Troca Pendente
                        </small>

                        <button
                            class="btn btn-cupom"
                            style="background:#28a745"
                            onclick="aprovarCupom(${p.id})">
                            ✓ Validar Cupom
                        </button>

                        <button
                            class="btn btn-recusar"
                            style="background:#dc3545"
                            onclick="recusarCupom(${p.id})">
                            ✕ Recusar Cupom
                        </button>

                    </div>
                `;
            }

            if (
                p.status === "APROVADO" &&
                !temCupomTrocaPendente
            ) {

                botoes += `
                    <button
                        class="btn btn-despachar"
                        onclick="despachar(${p.id})"
                        style="
                            margin-top:5px;
                            width:100%;">
                        🚚 Despachar Pedido
                    </button>
                `;
            }

            if (p.status === "DESPACHADO") {

                botoes += `
                    <button
                        class="btn btn-entregar"
                        onclick="entregar(${p.id})"
                        style="
                            margin-top:5px;
                            width:100%;">
                        📦 Confirmar Entrega
                    </button>
                `;
            }

            let textoCupomNormal =
                p.cupom
                    ? (p.cupom.codigo || p.cupom)
                    : "Nenhum";

            let textoCupomTroca =
                temCupomTrocaNoPedido
                    ? itensComTroca
                        .map(item =>
                            `${item.cupomTroca} (${item.nomeLivro})`
                        )
                        .join("<br>")
                    : "Sem cupom";

            let statusTroca = "";

            if (temCupomTrocaNoPedido) {

                const todosAprovados =
                    itensComTroca.every(
                        item => item.cupomTrocaAprovado
                    );

                if (todosAprovados) {

                    statusTroca =
                        "<span style='color:green'>(Validado)</span>";

                } else {

                    statusTroca =
                        "<span style='color:orange'>(Pendente)</span>";
                }
            }

            let cuponsExibicao = `
                <div>
                    <strong>Promo:</strong>
                    ${textoCupomNormal}
                </div>

                <div>
                    <strong>Troca:</strong>
                    ${textoCupomTroca}
                    ${statusTroca}
                </div>
            `;

            tr.innerHTML = `
                <td>${p.id}</td>

                <td>${p.nomeCliente}</td>

                <td>

                    ${
                        p.itens && p.itens.length > 0

                            ? p.itens.map(item => {

                           const caminhoImagem = item.imagem
                               ? `${window.location.origin}/${item.imagem.replace(/^\/+/, "")}`
                               : "https://placehold.co/60x90?text=Sem+Capa";

                           return `
                               <div class="livro-card">

                                   <img
                                       src="${caminhoImagem}"
                                       alt="${item.nomeLivro}"
                                       class="livro-imagem"
                                       onerror="this.src='https://placehold.co/60x90?text=Sem+Capa'">

                                   <div class="livro-dados">

                                       <div class="livro-titulo">
                                           ${item.nomeLivro}
                                       </div>

                                       <div class="livro-info">
                                           Qtd: ${item.quantidade}
                                       </div>

                                       <div class="livro-info">
                                           R$ ${Number(item.preco).toFixed(2)}
                                       </div>

                                       ${
                                           item.cupomTroca
                                           ? `
                                               <span class="badge-cupom">
                                                   ${item.cupomTroca}
                                               </span>

                                               ${
                                                   item.cupomTrocaAprovado
                                                   ? `<span class="status-cupom-ok">Validado</span>`
                                                   : `<span class="status-cupom-pendente">Pendente</span>`
                                               }
                                           `
                                           : ""
                                       }

                                   </div>

                               </div>
                           `;

                              }).join("")

                            : "Nenhum livro"
                    }

                </td>

                <td>
                    ${p.enderecoEntrega || "Não informado"}
                </td>

                <td>
                    <span class="status-badge">
                        ${p.status}
                    </span>
                </td>

                <td>
                    ${cuponsExibicao}
                </td>

                <td>
                    ${botoes}
                </td>
            `;

            lista.appendChild(tr);

        });

    } catch (e) {

        console.error(
            "ERRO AO CARREGAR PEDIDOS:",
            e
        );
    }
}

async function aprovar(id) {

    await fetch(
        `http://localhost:8080/admin/pedidos/${id}/aprovar`,
        {
            method: "PUT"
        }
    );

    carregarPedidos();
}

async function recusar(id) {

    await fetch(
        `http://localhost:8080/admin/pedidos/${id}/recusar`,
        {
            method: "PUT"
        }
    );

    carregarPedidos();
}

async function aprovarCupom(id) {

    await fetch(
        `http://localhost:8080/admin/pedidos/${id}/aprovar-cupom`,
        {
            method: "PUT"
        }
    );

    carregarPedidos();
}

async function recusarCupom(id) {

    if (!confirm("Deseja realmente recusar o cupom de troca?")) {
        return;
    }

    await fetch(
        `http://localhost:8080/admin/pedidos/${id}/recusar-cupom`,
        {
            method: "PUT"
        }
    );

    carregarPedidos();
}

async function despachar(id) {

    await fetch(
        `http://localhost:8080/admin/pedidos/${id}/despachar`,
        {
            method: "PUT"
        }
    );

    carregarPedidos();
}

async function entregar(id) {

    await fetch(
        `http://localhost:8080/admin/pedidos/${id}/entregar`,
        {
            method: "PUT"
        }
    );

    carregarPedidos();
}

carregarPedidos();