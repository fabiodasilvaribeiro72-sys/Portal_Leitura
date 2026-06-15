let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cart-count");

function updateCartCount() {
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function renderCart() {

    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        if (item.price) {
            total += parseFloat(item.price.replace(",", "."));
        }

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" class="cart-img">
                <div>
                    <p>${item.name}</p>
                    <p>R$ ${item.price}</p>
                    <button onclick="removeItem(${index})">Remover</button>
                </div>
            </div>
        `;
    });

    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function adicionarAoCarrinho(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}


document.querySelectorAll(".buy-button").forEach(btn => {
    btn.addEventListener("click", () => {
        const product = {
            name: btn.dataset.name,
            price: btn.dataset.price,
            image: btn.dataset.image
        };

        adicionarAoCarrinho(product);
    });
});


const cartIcon = document.querySelector(".cart");
const sideCart = document.getElementById("side-cart");
const closeCart = document.getElementById("close-cart");

if (cartIcon) {
    cartIcon.addEventListener("click", function () {
        renderCart();
        sideCart.classList.add("open");
    });
}

if (closeCart) {
    closeCart.addEventListener("click", function () {
        sideCart.classList.remove("open");
    });
}


function finalizarCompra() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Carrinho vazio");
        return;
    }


    window.location.href = "clientecadastro.html";
}

updateCartCount();
renderCart();