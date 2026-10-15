const WHATSAPP_NUMBER = "5493844546841";
const MERCADO_PAGO = "https://link.mercadopago.com.ar/pirunet";

const PRODUCTS = [
  {
    id: "netflix",
    name: "Netflix Premium",
    plan: "1 mes",
    price: 11000,
    category: "Películas y series",
    icon: "N",
    style: "netflix"
  },
  {
    id: "disney-premium",
    name: "Disney+ Premium",
    plan: "1 mes",
    price: 9500,
    category: "Películas y series",
    icon: "D+",
    style: "disney"
  },
  {
    id: "disney-estandar",
    name: "Disney+ Estándar",
    plan: "1 mes",
    price: 7500,
    category: "Películas y series",
    icon: "D+",
    style: "disney"
  },
  {
    id: "hbo-1",
    name: "HBO Max",
    plan: "1 mes",
    price: 5000,
    category: "Películas y series",
    icon: "H",
    style: "hbo"
  },
  {
    id: "hbo-2",
    name: "HBO Max",
    plan: "2 meses",
    price: 6500,
    category: "Películas y series",
    icon: "H",
    style: "hbo"
  },
  {
    id: "hbo-3",
    name: "HBO Max",
    plan: "3 meses",
    price: 8500,
    category: "Películas y series",
    icon: "H",
    style: "hbo"
  },
  {
    id: "prime",
    name: "Prime Video",
    plan: "1 mes",
    price: 5000,
    category: "Películas y series",
    icon: "▶",
    style: "prime"
  },
  {
    id: "paramount",
    name: "Paramount+",
    plan: "1 mes",
    price: 3500,
    category: "Películas y series",
    icon: "P+",
    style: "paramount"
  },
  {
    id: "vix",
    name: "ViX",
    plan: "1 mes",
    price: 2500,
    category: "Películas y series",
    icon: "ViX",
    style: "vix"
  },
  {
    id: "youtube-individual",
    name: "YouTube Premium",
    plan: "Individual · 1 mes",
    price: 6500,
    category: "Video y música",
    icon: "▶",
    style: "youtube"
  },
  {
    id: "youtube-familiar",
    name: "YouTube Premium",
    plan: "Familiar · 1 mes",
    price: 10000,
    category: "Video y música",
    icon: "▶",
    style: "youtube"
  }
];

let cart = [];

const productsContainer = document.getElementById("products");
const cartContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("category-filter");
const checkoutForm = document.getElementById("checkout-form");
const emptyCart = document.getElementById("empty-cart");

function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(price);
}

function renderProducts(list = PRODUCTS) {
  if (!productsContainer) return;

  if (list.length === 0) {
    productsContainer.innerHTML = `
      <div class="no-results">
        No encontramos servicios con esa búsqueda.
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-icon ${product.style}">
        ${product.icon}
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="provider">${product.plan}</div>
        <div class="product-price">${formatPrice(product.price)}</div>
      </div>

      <button
        class="add-to-cart"
        type="button"
        data-add="${product.id}"
        aria-label="Agregar ${product.name} al carrito"
      >
        Agregar
      </button>
    </article>
  `).join("");
}

function addToCart(productId) {
  const product = PRODUCTS.find(item => item.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

function changeQuantity(productId, change) {
  const item = cart.find(entry => entry.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  renderCart();
}

function getCartDetails() {
  return cart.map(item => {
    const product = PRODUCTS.find(entry => entry.id === item.id);

    return {
      ...product,
      quantity: item.quantity,
      subtotal: product.price * item.quantity
    };
  }).filter(item => item.id);
}

function renderCart() {
  if (!cartContainer) return;

  const items = getCartDetails();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartTotal) {
    cartTotal.textContent = formatPrice(total);
  }

  if (emptyCart) {
    emptyCart.hidden = items.length > 0;
  }

  cartContainer.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <small>${item.plan}</small>
        <span>${formatPrice(item.subtotal)}</span>
      </div>

      <div class="quantity-controls">
        <button
          type="button"
          data-decrease="${item.id}"
          aria-label="Disminuir cantidad"
        >−</button>

        <span>${item.quantity}</span>

        <button
          type="button"
          data-increase="${item.id}"
          aria-label="Aumentar cantidad"
        >+</button>

        <button
          type="button"
          class="remove-item"
          data-remove="${item.id}"
          aria-label="Eliminar producto"
        >✕</button>
      </div>
    </div>
  `).join("");
}

function filterProducts() {
  const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const category = categoryFilter
    ? categoryFilter.value
    : "all";

  const filtered = PRODUCTS.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.plan.toLowerCase().includes(searchTerm);

    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

function openCart() {
  const cartSection = document.getElementById("carrito");

  if (cartSection) {
    cartSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function buildWhatsAppMessage(customerName, customerPhone) {
  const items = getCartDetails();
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const productLines = items.map(item =>
    `• ${item.name} (${item.plan}) x${item.quantity} — ${formatPrice(item.subtotal)}`
  );

  return [
    "🛍️ *NUEVO PEDIDO - PIRUNET STREAMING STORE*",
    "",
    `👤 Cliente: ${customerName}`,
    `📱 WhatsApp: ${customerPhone}`,
    "",
    "📺 *Servicios solicitados:*",
    ...productLines,
    "",
    `💰 *Total: ${formatPrice(total)}*`,
    "",
    "💳 Solicito instrucciones para completar el pago."
  ].join("\n");
}

function checkout() {
  if (cart.length === 0) {
    alert("Tu carrito está vacío. Agregá un servicio para continuar.");
    return;
  }

  const nameInput = document.getElementById("customer-name");
  const phoneInput = document.getElementById("customer-phone");

  const customerName = nameInput ? nameInput.value.trim() : "";
  const customerPhone = phoneInput ? phoneInput.value.trim() : "";

  if (!customerName || !customerPhone) {
    alert("Completá tu nombre y tu WhatsApp para continuar.");
    return;
  }

  const message = buildWhatsAppMessage(customerName, customerPhone);
  const whatsappUrl =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const removeButton = event.target.closest("[data-remove]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const cartButton = event.target.closest("[data-open-cart]");
  const paymentButton = event.target.closest("[data-payment-link]");

  if (addButton) {
    addToCart(addButton.dataset.add);
  }

  if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
  }

  if (increaseButton) {
    changeQuantity(increaseButton.dataset.increase, 1);
  }

  if (decreaseButton) {
    changeQuantity(decreaseButton.dataset.decrease, -1);
  }

  if (cartButton) {
    openCart();
  }

  if (paymentButton) {
    window.open(MERCADO_PAGO, "_blank");
  }
});

if (searchInput) {
  searchInput.addEventListener("input", filterProducts);
}

if (categoryFilter) {
  categoryFilter.addEventListener("change", filterProducts);
}

if (checkoutForm) {
  checkoutForm.addEventListener("submit", event => {
    event.preventDefault();
    checkout();
  });
}

renderProducts();
renderCart();
