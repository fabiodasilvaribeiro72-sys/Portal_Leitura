const lista = document.getElementById("lista-clientes");

// Função principal que carrega e renderiza a tabela de trocas
async function carregarTrocas() {
    try {
        const response = await fetch("http://localhost:8080/admin/pedidos");
        const pedidos = await response.json();
        console.log("Todos os pedidos carregados:", pedidos);

        lista.innerHTML = "";

        const pedidosComTroca = pedidos.filter(p => p.cupomTroca && p.cupomTroca !== "Sem cupom");

        if (pedidosComTroca.length === 0) {
            lista.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum pedido com cupom de troca encontrado.</td></tr>`;
            return;
        }

        pedidosComTroca.forEach(p => {
            const tr = document.createElement("tr");
            tr.setAttribute("data-id", p.id);

            // 1. Status do Cupom
            let statusCupomTexto = "Pendente";
            let statusCupomCor = "orange";

            if (p.cupomTrocaAprovado) {
                statusCupomTexto = "Aprovado ✓";
                statusCupomCor = "green";
            } else if (p.cupomTrocaAprovado === false && p.status === "RECUSADO") {
                statusCupomTexto = "Recusado ✕";
                statusCupomCor = "red";
            }

            let cuponsExibicao = `
                <div><strong>Troca:</strong> ${p.cupomTroca}</div>
                <div style="color: ${statusCupomCor}; font-weight: bold;">Status: ${statusCupomTexto}</div>
            `;

            // 2. Gerenciador de Botões Simplificado (Sem travas de IF complexas)
            let botoes = "";
            const statusAtual = p.status ? p.status.toUpperCase().trim() : "PENDENTE";

            // Se o cupom ainda NÃO foi aprovado pelo painel, mostra o botão de Validar
            if (!p.cupomTrocaAprovado && statusAtual !== "RECUSADO") {
                botoes += `
                    <button
                        class="btn btn-cupom"
                        onclick="aprovarCupom(${p.id})"
                        style="background-color: #28a745; margin-bottom: 5px; color: white;">
                        ✓ Validar Cupom
                    </button>
                `;
            }

            // SE O CUPOM JÁ FOI APROVADO: Libera os botões das próximas fases do ciclo de vida
            if (p.cupomTrocaAprovado) {

                // Fase 1: Pronto para despachar (Aceita APROVADO, PROCESSANDO, AGUARDANDO_APROVACAO ou PENDENTE)
                if (statusAtual !== "DESPACHADO" && statusAtual !== "EM_TRANSPORTE" && statusAtual !== "FINALIZADO" && statusAtual !== "ENTREGUE" && statusAtual !== "RECUSADO") {
                    botoes += `
                        <button
                            class="btn-despachar bg-blue-500 text-white px-3 py-1 rounded"
                            onclick="despachar(${p.id})">
                            Despachar
                        </button>
                    `;
                }

                // Fase 2: Em transporte, aguardando entrega
                if (statusAtual === "DESPACHADO" || statusAtual === "EM_TRANSPORTE") {
                    botoes += `
                        <button
                            class="btn-entregue bg-blue-500 text-white px-3 py-1 rounded"
                            onclick="marcarComoEntregue(${p.id})">
                            Confirmar Entrega
                        </button>
                    `;
                }
            }

            // Fase Final: Ciclo encerrado
            if (statusAtual === "FINALIZADO" || statusAtual === "ENTREGUE") {
                botoes += `<span style="color: #6c757d; font-weight: bold; text-align: center; display: block;">Finalizado ✓</span>`;
            }

            // 3. Tradução Visual do Status do Pedido
            let statusPedidoExibicao = p.status || "PENDENTE";
            if (statusAtual === "DESPACHADO" || statusAtual === "EM_TRANSPORTE") {
                statusPedidoExibicao = "EM TRANSPORTE 🚚";
            } else if (statusAtual === "FINALIZADO" || statusAtual === "ENTREGUE") {
                statusPedidoExibicao = "FINALIZADO 🎉";
            }

            const classeStatus = p.status ? p.status.toLowerCase() : "pendente";

            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.nomeCliente}</td>
                <td>${p.livros ? p.livros.join("<br>") : "Nenhum livro"}</td>
                <td>${p.enderecoEntrega || "Não informado"}</td>
                <td><span class="status-badge status-${classeStatus}">${statusPedidoExibicao}</span></td>
                <td>${cuponsExibicao}</td>
                <td><div style="display: flex; flex-direction: column; gap: 4px;">${botoes}</div></td>
            `;

            lista.appendChild(tr);
        });
    } catch (e) {
        console.error("ERRO AO CARREGAR PEDIDOS DE TROCA:", e);
    }
}