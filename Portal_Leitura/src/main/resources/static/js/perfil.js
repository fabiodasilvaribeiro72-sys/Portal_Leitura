let carrinho = [];
let enderecos = [];
let cartoes = [];
let valoresCartoes = {};
let cartoesSelecionados = [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

console.log("JS NOVO CARREGADO 🚀");

function toggleMenu() {
    document.getElementById("nav-menu")?.classList.toggle("active");
}

// ================= USUÁRIO =================
async function carregarUsuario() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    console.log("USUARIO:", usuario);

    if (!usuario || !usuario.id) return;

    const nome = document.getElementById("nome");
    if (nome) nome.innerText = usuario.nome;

    try {
        const response = await fetch(`http://localhost:8080/cliente/${usuario.id}`);
        const clienteAtual = await response.json();

        console.log("CLIENTE COMPLETO:", clienteAtual);

        enderecos = clienteAtual.enderecosEntrega || [];
        atualizarEnderecos();

    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
    }
}

// ================= CARRINHO =================
async function carregarPedidos() {
    const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || !usuario.id) return;

    try {
        const response = await fetch(`http://localhost:8080/carrinho/${usuario.id}`);
        const pedido = await response.json();

        console.log("PEDIDO:", pedido);

        const container = document.getElementById("listaPedidos");
        if (!container) return;

        container.innerHTML = "";

        if (!pedido || !pedido.itens || pedido.itens.length === 0) {
            carrinho = [];
            container.innerHTML = "<p>Carrinho vazio</p>";
            calcularTotal();
            return;
        }

        carrinho = pedido.itens;


        carrinho.forEach((item, index) => {
                    const div = document.createElement("div");
                    div.className = "flex justify-between items-center border-b pb-3 mb-3 bg-white p-2 rounded shadow-sm";


                    let caminhoOriginal = item.imagem || item.image || "imagens/default.jpg";

                   if (caminhoOriginal.startsWith("/")) {
                           caminhoOriginal = caminhoOriginal.substring(1);
                    }
                    const urlCorretaImagem = `${window.location.origin}/${caminhoOriginal}`;

                    div.innerHTML = `
                        <div class="flex items-center gap-4">
                            <img src="${caminhoOriginal}"
                                 alt="${item.nomeLivro}"
                                 class="w-16 h-20 object-cover rounded shadow-sm border"
                                 onerror="this.onerror=null; this.src='https://placehold.co/60x80?text=Sem+Capa';">

                            <div>
                                <p><strong>${item.nomeLivro}</strong></p>
                                <p class="text-sm text-gray-600">Quantidade: ${item.quantidade}</p>
                                <p class="text-sm text-gray-600">Preço: R$ ${Number(item.preco).toFixed(2)}</p>
                            </div>
                        </div>

                        <div class="flex flex-col items-end gap-1">
                            <label class="text-xs font-semibold text-gray-700" for="troca-${index}">Solicitar TROCA20:</label>
                            <input type="text" id="troca-${index}"
                                   class="border p-1 rounded text-sm w-36 text-center uppercase focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                   placeholder="Digite TROCA20">
                        </div>
                    `;

                    container.appendChild(div);
                });


                document.querySelectorAll(".cupom-troca-item").forEach(input => {
                    input.addEventListener("input", calcularTotal);
                });
            } catch (error) {
                console.error("Erro ao carregar carrinho:", error);
            }
        }

// ================= CARTÕES =================
async function carregarCartoes() {

    const usuario =
        JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuario || !usuario.id) return;

    try {

        const response =
            await fetch(`http://localhost:8080/cartao/${usuario.id}`);

        cartoes = await response.json();

        gerarInputsPagamento();

    } catch (error) {

        console.error(
            "Erro ao carregar cartões:",
            error
        );
    }
}
// ================= ENDEREÇOS =================
function adicionarEndereco() {
    const endereco = {
        cep: document.getElementById("cep").value,
        rua: document.getElementById("rua").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value
    };

    enderecos.push(endereco);
    atualizarEnderecos();
}

function atualizarEnderecos() {
    const select = document.getElementById("enderecos");
    if (!select) return;

    select.innerHTML = "";

    enderecos.forEach((e, index) => {
        select.innerHTML += `
            <option value="${index}">
                ${e.rua} - ${e.cidade} - ${e.estado}
            </option>
        `;
    });

    if (enderecos.length > 0) {
        select.value = enderecos.length - 1;
    }

    calcularFrete();
}
async function adicionarCartao() {

    const usuario =
        JSON.parse(localStorage.getItem("usuarioLogado"));

    const dto = {

        clienteId: usuario.id,

        numero:
            document.getElementById("numero").value,

        nome:
            document.getElementById("nomeImpresso").value,

        bandeira:
            document.getElementById("bandeira").value,

        codigo:
            document.getElementById("codigoSeguranca").value
    };

    try {

        const response = await fetch(
            "http://localhost:8080/cartao/adicionar",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dto)
            }
        );


        const cartaoSalvo = await response.json();


        cartoes.push(cartaoSalvo);


        gerarInputsPagamento();

        alert("Cartão adicionado com sucesso");

    } catch (error) {

        console.error(error);

        alert("Erro ao adicionar cartão");
    }
}

// ================= CARTÃO ADD =================
function adicionarRemocaoCartao() {

    const botoes =
        document.querySelectorAll(".remover-cartao");

    botoes.forEach(botao => {

        botao.onclick = (e) => {

            const cartaoId =
                e.target.dataset.id;

            // pega cartão removido
            const cartaoRemovido =
                cartoes.find(c => c.id == cartaoId);

            // remove valor salvo
            if (cartaoRemovido) {

                delete valoresCartoes[
                    cartaoRemovido.numero
                ];
            }

            // remove do array
            cartoes =
                cartoes.filter(
                    c => c.id != cartaoId
                );

            // renderiza novamente
            renderCartoes(cartoes);

            // atualiza total
            atualizarTotalPagamento();
        };
    });
}


function renderCartoes(cartoes) {

    const container =
        document.getElementById("cartoesContainer");

    if (!container) return;

    container.innerHTML = "";

    cartoes.forEach(cartao => {

        const valorSalvo =
            valoresCartoes[cartao.numero] || "";

        const div =
            document.createElement("div");

        div.className =
            "border rounded p-4 mb-3 bg-white shadow";

        div.innerHTML = `
            <div class="flex justify-between items-center mb-3">

                <div>
                    <span class="font-bold">
                        ${cartao.bandeira}
                    </span>

                    <span>
                        **** ${cartao.numero.slice(-4)}
                    </span>
                </div>

                <button
                    type="button"
                    class="bg-red-500 text-white px-3 py-1 rounded remover-cartao"
                    data-id="${cartao.id}">
                    Remover
                </button>
            </div>

            <input
                type="number"
                step="0.01"
                min="10"
                value="${valorSalvo}"
                data-id="${cartao.numero}"
                class="valorCartao border p-2 rounded w-full"
                placeholder="Mínimo R$ 10,00"
            >

            <p
                class="text-red-500 text-sm erro-cartao hidden"
                id="erro-${cartao.numero}">
                Valor mínimo é R$ 10,00
            </p>
        `;

        container.appendChild(div);
    });

    adicionarValidacao();

    adicionarRemocaoCartao();
}

// ================= PAGAMENTO =================
function gerarInputsPagamento() {

    const container =
        document.getElementById("pagamentosCartoes");

    if (!container) return;

    container.innerHTML = "";

    cartoes.forEach(cartao => {

        const valorSalvo =
            valoresCartoes[cartao.numero] || "";

        const div =
            document.createElement("div");

        div.className =
            "border rounded p-3 mb-3 bg-white shadow";

        div.innerHTML = `
            <div class="flex justify-between items-center mb-2">

                <p class="font-bold">
                    ${cartao.bandeira}
                    **** ${cartao.numero.slice(-4)}
                </p>

                <button
                    type="button"
                    class="bg-red-500 text-white px-3 py-1 rounded remover-cartao"
                    data-id="${cartao.id}">
                    Remover
                </button>
            </div>

            <input
                type="number"
                step="0.01"
                min="10"
                value="${valorSalvo}"
                data-numero="${cartao.numero}"
                class="valorCartao border p-2 rounded w-full"
                placeholder="Mínimo R$ 10,00"
            >

            <p class="erro-cartao text-red-500 text-sm hidden">
                Valor mínimo por cartão é R$ 10,00
            </p>
        `;

        container.appendChild(div);
    });

    adicionarValidacao();

    adicionarRemocaoCartao();
}

function adicionarValidacao() {

    const inputs =
        document.querySelectorAll(".valorCartao");

    inputs.forEach(input => {

        input.oninput = (e) => {

            const valor =
                parseFloat(e.target.value);

            const numero =
                e.target.dataset.numero;

            const erro =
                e.target.parentElement
                    .querySelector(".erro-cartao");

            if (isNaN(valor) || valor < 10) {

                erro.classList.remove("hidden");

            } else {

                erro.classList.add("hidden");
            }

            valoresCartoes[numero] =
                valor || 0;

            atualizarTotalPagamento();
        };
    });
}

function adicionarRemocaoCartao() {

    const botoes =
        document.querySelectorAll(".remover-cartao");

    botoes.forEach(botao => {

        botao.onclick = (e) => {

            const cartaoId =
                e.target.dataset.id;

            cartoes =
                cartoes.filter(
                    c => c.id != cartaoId
                );

            gerarInputsPagamento();

            atualizarTotalPagamento();
        };
    });
}

function validarPagamentos() {
    const inputs = document.querySelectorAll(".valorCartao");
    const erro = document.getElementById("erroPagamento");

    let soma = 0;
    let valido = true;

    inputs.forEach(input => {
        const valor = parseFloat(input.value);

        if (isNaN(valor) || valor < 10) {
            valido = false;
            if (erro) erro.innerText = "Valor mínimo por cartão é R$ 10";
        } else {
            soma += valor;
        }
    });

    return valido;
}

// ================= FRETE E TOTAL =================
function calcularFrete() {
    const select = document.getElementById("enderecos");

    if (!select || !enderecos[select.value]) {
        document.getElementById("frete").innerText = "0";
        calcularTotal();
        return;
    }

    const cep = enderecos[select.value].cep;

    let frete = 20;
    if (cep.startsWith("01")) frete = 10;
    else if (cep.startsWith("02")) frete = 15;

    document.getElementById("frete").innerText = frete;
    calcularTotal();
}

function calcularTotal() {
    let subtotal = 0;

    carrinho.forEach(item => {
        subtotal += item.preco * item.quantidade;
    });

    let frete = parseFloat(document.getElementById("frete").innerText || 0);

    let cupom = document.getElementById("cupom")?.value.trim().toUpperCase();
    let cupomTroca = document.getElementById("cupomTroca")?.value.trim().toUpperCase();

    let total = subtotal;

    if (cupom === "DESCONTO10") {
        total *= 0.9;
    }



    total += frete;

    document.getElementById("total").innerText = total.toFixed(2);
}
    function atualizarTotalPagamento() {

        let total = 0;

        Object.values(valoresCartoes).forEach(valor => {

            total += Number(valor || 0);
        });

        console.log("TOTAL:", total);

        // exemplo visual
        const totalDiv = document.getElementById("totalPagamento");

        if (totalDiv) {

            totalDiv.innerText =
                "Total pago: R$ " + total.toFixed(2);
        }
    }

// ================= FINALIZAÇÃO =================
async function enviarFinalizacao() {

    try {

        const usuario =
            JSON.parse(localStorage.getItem("usuarioLogado"));

        const enderecoIndex =
            document.getElementById("enderecos").value;

        const enderecoSelecionado =
            enderecos[enderecoIndex];

        if (!enderecoSelecionado) {

            alert("Selecione um endereço");

            return;
        }

        console.log("PAGAMENTOS", cartoes.map(c => ({
            numeroCartao: c.numero,
            valor: valoresCartoes[c.numero] || 0
        })));

        const response = await fetch(
            "http://localhost:8080/pedido/finalizar",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },
body: JSON.stringify({

            clienteId: usuario.id,

            cep: enderecoSelecionado.cep,
            rua: enderecoSelecionado.rua,
            cidade: enderecoSelecionado.cidade,
            estado: enderecoSelecionado.estado,

            cupom:
                   document.getElementById("cupom").value,



            itens: carrinho.map((item, index) => {
                // AQUI o JS lê o HTML de cada input de troca da tela
                const inputTroca = document.getElementById(`troca-${index}`);
                return {
                    nomeLivro: item.nomeLivro,
                    quantidade: item.quantidade,
                    preco: item.preco,
                    // Envia o valor digitado no HTML para dentro do item correspondente
                    cupomTroca: inputTroca ? inputTroca.value.trim().toUpperCase() : "",
                    cupomTrocaAprovado: false
                };
            }),

            pagamentos: cartoes.map(c => ({
                numeroCartao: c.numero,
                valor: valoresCartoes[c.numero] || 0
            }))
        })
    }
);


        if (!response.ok) {

            const erro = await response.text();

            alert(erro);

            return;
        }


        const pedido = await response.json();

          const historico =
                    JSON.parse(localStorage.getItem("pedidos")) || [];

                const novoPedido = {

                    id: pedido.id,

                    status: pedido.status || "PROCESSANDO",

                    total: parseFloat(
                        document.getElementById("total").innerText
                    ),

                    itens: carrinho.map(item => ({

                        nomeLivro: item.nomeLivro,

                        quantidade: item.quantidade,

                        preco: item.preco
                    }))
                };


                historico.push(novoPedido);


                localStorage.setItem(
                    "pedidos",
                    JSON.stringify(historico)
                );

                alert(
                    `Pedido realizado! ID: ${pedido.id}`
                );
    } catch (error) {

        console.error(error);

        alert("Erro ao finalizar compra");
    }
}
function finalizarCompra() {


        const inputs =
            document.querySelectorAll(".valorCartao");

        let invalido = false;

        inputs.forEach(input => {

            const valor =
                parseFloat(input.value);

            if (isNaN(valor) || valor < 10) {

                invalido = true;
            }
        });

        if (invalido) {

            alert(
                "Cada cartão precisa ter no mínimo R$ 10"
            );

            return;
        }

        enviarFinalizacao();
    }

// ================= INIT =================
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM carregado");

document.getElementById("cupom")
    ?.addEventListener("input", calcularTotal);

document.getElementById("cupomTroca")
    ?.addEventListener("input", calcularTotal);

    await carregarUsuario();
    await carregarPedidos();


    setTimeout(calcularTotal, 100);
});