const WHATSAPP_NUMBER = "5493844546841";
const MERCADO_PAGO = "https://link.mercadopago.com.ar/pirunet";

const PRODUCTS = [
  {
    id: "netflix",
    name: "Netflix Premium",
    plan: "1 mes",
    provider: "Houseflix",
    price: 11000,
    category: "Películas y series",
    icon: "N",
    style: "netflix"
  },
  {
    id: "disney-premium",
    name: "Disney+ Premium",
    plan: "1 mes",
    provider: "Houseflix",
    price: 9500,
    category: "Películas y series",
    icon: "D+",
    style: "disney"
  },
  {
    id: "disney-estandar",
    name: "Disney+ Estándar",
    plan: "1 mes",
    provider: "Houseflix",
    price: 7500,
    category: "Películas y series",
    icon: "D+",
    style: "disney"
  },
  {
    id: "hbo-1",
    name: "HBO Max",
    plan: "1 mes",
    provider: "JG Store",
    price: 5000,
    category: "Películas y series",
    icon: "H",
    style: "hbo"
  },
  {
    id: "hbo-2",
    name: "HBO Max",
    plan: "2 meses",
    provider: "JG Store",
    price: 6500,
    category: "Películas y series",
    icon: "H",
    style: "hbo"
  },
  {
    id: "hbo-3",
    name: "HBO Max",
    plan: "3 meses",
    provider: "JG Store",
    price: 8500,
    category: "Películas y series",
    icon: "H",
    style: "hbo"
  },
  {
    id: "prime",
    name: "Prime Video",
    plan: "1 mes",
    provider: "JG Store",
    price: 5000,
    category: "Películas y series",
    icon: "▶",
    style: "prime"
  },
  {
    id: "paramount",
    name: "Paramount+",
    plan: "1 mes",
    provider: "JG Store",
    price: 3500,
    category: "Películas y series",
    icon: "P+",
    style: "paramount"
  },
  {
    id: "vix",
    name: "ViX",
    plan: "1 mes",
    provider: "JG Store",
    price: 2500,
    category: "Películas y series",
    icon: "ViX",
    style: "vix"
  },
  {
    id: "youtube-individual",
    name: "YouTube Premium",
    plan: "Individual · 1 mes",
    provider: "JG Store",
    price: 6500,
    category: "Video y música",
    icon: "▶",
    style: "youtube"
  },
  {
    id: "youtube-familiar",
    name: "YouTube Premium",
    plan: "Familiar · 1 mes",
    provider: "JG Store",
    price: 10000,
    category: "Video y música",
    icon: "▶",
    style: "youtube"
  }
];

const cart = new Map();

const grid = document.getElementById("product-grid");
const panel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");

const money = amount =>
  "$" + amount.toLocaleString("es-AR");

let toastTimer;

function renderProducts(filter = "Todos") {
  const products = PRODUCTS.filter(product =>
    filter === "Todos" || product.category === filter
  );

  grid.innerHTML = products.map(product => `
    <article class="product-card">
      <div class="product-top">
        <div class="platform-icon ${product.style}">
          ${product.icon}
        </div>

        <div>
          <div class="product-name">${product.name}</div>
          <div class="provider">
            ${product.plan} · ${product.provider}
          </div>
        </div>
      </div>

      <p class="product-desc">
        Acceso por ${product.plan}
      </p>

      <div class="price-row">
        <div class="price">
          ${money(product.price)}
        </div>
        <span class="available">Disponible</span>
      </div>

      <button class="add-btn" data-add="${product.id}">
        ＋ Agregar al carrito
      </button>
    </article>
  `).join("");
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addToCart(id) {
  const product = PRODUCTS.find(item => item.id === id);

  if (!product) return;

  const current = cart.get(id);

  cart.set(id, {
    product,
    qty: current ? current.qty + 1 : 1
  });

  renderCart();
  showToast("¡Agregado al carrito!");
}

function renderCart() {
  const items = [...cart.values()];

  const count = items.reduce(
    (sum, item) => sum + item.qty, 0
  );

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.qty, 0
  );

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = money(total);

  document.getElementById("cart-empty").hidden =
    items.length > 0;

  document.getElementById("cart-items").innerHTML =
    items.map(({ product, qty }) => `
      <div class="cart-item">
        <div>
          <strong>${product.name}</strong>
          <small>
            ${product.plan} · ${product.provider}
          </small>

          <div class="item-controls">
            <button class="qty-btn"
              data-qty="${product.id}"
              data-delta="-1">−</button>

            <span>${qty}</span>

            <button class="qty-btn"
              data-qty="${product.id}"
              data-delta="1">+</button>

            <button class="remove-btn"
              data-remove="${product.id}">
              Eliminar
            </button>
          </div>
        </div>

        <div class="item-price">
          ${money(product.price * qty)}
        </div>
      </div>
    `).join("");
}

function openCart() {
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCart() {
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.style.overflow = "";
}

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (button) {
    addToCart(button.dataset.add);
  }
});

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(item => {
      item.classList.toggle("active", item === button);
    });

    renderProducts(button.dataset.filter);
  });
});

document.getElementById("open-cart")
  .addEventListener("click", openCart);

document.getElementById("close-cart")
  .addEventListener("click", closeCart);

overlay.addEventListener("click", closeCart);

document.getElementById("cart-items")
  .addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");

    if (removeButton) {
      cart.delete(removeButton.dataset.remove);
    }

    if (quantityButton) {
      const id = quantityButton.dataset.qty;
      const item = cart.get(id);

      if (item) {
        item.qty += Number(quantityButton.dataset.delta);

        if (item.qty <= 0) {
          cart.delete(id);
        }
      }
    }

    renderCart();
  });

document.getElementById("send-order")
  .addEventListener("click", () => {
    const items = [...cart.values()];

    if (items.length === 0) {
      showToast("Agregá un servicio al carrito");
      return;
    }

    const name = document
      .getElementById("customer-name")
      .value.trim();

    const phone = document
      .getElementById("customer-phone")
      .value.trim();

    if (!name) {
      document.getElementById("customer-name").focus();
      showToast("Escribí tu nombre para continuar");
      return;
    }

    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    );

    const lines = items.map(({ product, qty }) =>
      `• ${product.name} (${product.plan}) x${qty} — ${money(product.price * qty)}`
    );

    const message = [
      "¡Hola, PiruNet! Quiero hacer este pedido:",
      "",
      ...lines,
      "",
      `Total: ${money(total)}`,
      `Nombre: ${name}`,
      ...(phone ? [`WhatsApp: ${phone}`] : []),
      "",
      "¿Me indicás cómo continuar con el pago y la activación?"
    ].join("\n");

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener");
  });

// El enlace de pago utiliza tu link general de Mercado Pago.
document.querySelector(".payment-btn").href = MERCADO_PAGO;

renderProducts();
renderCart();
