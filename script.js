const WHATSAPP_NUMBER = "5493844546841";
const MERCADO_PAGO = "https://link.mercadopago.com.ar/pirunet";

const PRODUCTS = [
  { id: "netflix", name: "Netflix Premium", plan: "1 mes", price: 11000, category: "Películas y series", icon: "N", style: "netflix" },
  { id: "disney-premium", name: "Disney+ Premium", plan: "1 mes", price: 9500, category: "Películas y series", icon: "D+", style: "disney" },
  { id: "disney-estandar", name: "Disney+ Estándar", plan: "1 mes", price: 7500, category: "Películas y series", icon: "D+", style: "disney" },
  { id: "hbo-1", name: "HBO Max", plan: "1 mes", price: 5000, category: "Películas y series", icon: "H", style: "hbo" },
  { id: "hbo-2", name: "HBO Max", plan: "2 meses", price: 6500, category: "Películas y series", icon: "H", style: "hbo" },
  { id: "hbo-3", name: "HBO Max", plan: "3 meses", price: 8500, category: "Películas y series", icon: "H", style: "hbo" },
  { id: "prime", name: "Prime Video", plan: "1 mes", price: 5000, category: "Películas y series", icon: "▶", style: "prime" },
  { id: "paramount", name: "Paramount+", plan: "1 mes", price: 3500, category: "Películas y series", icon: "P+", style: "paramount" },
  { id: "vix", name: "ViX", plan: "1 mes", price: 2500, category: "Películas y series", icon: "ViX", style: "vix" },
  { id: "youtube-individual", name: "YouTube Premium", plan: "Individual · 1 mes", price: 6500, category: "Video y música", icon: "▶", style: "youtube" },
  { id: "youtube-familiar", name: "YouTube Premium", plan: "Familiar · 1 mes", price: 10000, category: "Video y música", icon: "▶", style: "youtube" }
];

let cart = [];
let activeFilter = "Todos";

const productGrid = document.getElementById("product-grid");
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");
const cartEmpty = document.getElementById("cart-empty");
const toast = document.getElementById("toast");

function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  }).format(price);
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function renderProducts() {
  if (!productGrid) {
    console.error('No se encontró el elemento "product-grid".');
    return;
  }

  const filteredProducts = PRODUCTS.filter(product =>
    activeFilter === "Todos" || product.category === activeFilter
  );

  productGrid.innerHTML = filteredProducts.map(product => `
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
      >
        Agregar
      </button>
    </article>
  `).join("");
}

function getCartProducts() {
  return cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);

    if (!product) return null;

    return {
      ...product,
      quantity: item.quantity,
      subtotal: product.price * item.quantity
    };
  }).filter(Boolean);
}

function renderCart() {
  const items = getCartProducts();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (cartCount) cartCount.textContent = totalQuantity;
  if (cartTotal) cartTotal.textContent = formatPrice(total);

  if (cartEmpty) {
    cartEmpty.hidden = items.length > 0;
  }

  if (cartItems) {
    cartItems.innerHTML = items.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <strong>${item.name}</strong>
          <small>${item.plan}</small>
          <span>${formatPrice(item.subtotal)}</span>
        </div>

        <div class="quantity-controls">
          <button type="button" data-decrease="${item.id}" aria-label="Restar">−</button>
          <span>${item.quantity}</span>
          <button type="button" data-increase="${item.id}" aria-label="Sumar">+</button>
          <button type="button" class="remove-item" data-remove="${item.id}" aria-label="Eliminar">✕</button>
        </div>
      </div>
    `).join("");
  }
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  renderCart();
  showToast(`${product.name} agregado al carrito`);
}

function changeQuantity(productId, amount) {
  const item = cart.find(p => p.id === productId);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== productId);
  }

  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
  showToast("Producto eliminado");
}

function openCart() {
  if (!cartPanel || !overlay) return;

  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.classList.add("cart-open");
}

function closeCart() {
  if (!cartPanel || !overlay) return;

  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.classList.remove("cart-open");
}

function sendOrder() {
  const items = getCartProducts();

  if (items.length === 0) {
    showToast("Primero agregá un servicio al carrito");
    return;
  }

  const nameInput = document.getElementById("customer-name");
  const phoneInput = document.getElementById("customer-phone");

  const customerName = nameInput ? nameInput.value.trim() : "";
  const customerPhone = phoneInput ? phoneInput.value.trim() : "";

  if (!customerName) {
    showToast("Ingresá tu nombre para continuar");
    if (nameInput) nameInput.focus();
    return;
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const lines = items.map(item =>
    `• ${item.name} (${item.plan}) x${item.quantity}: ${formatPrice(item.subtotal)}`
  );

  const message = [
    "🛍️ *PEDIDO NUEVO - PIRUNET STREAMING*",
    "",
    `👤 Cliente: ${customerName}`,
    `📱 WhatsApp: ${customerPhone || "No indicado"}`,
    "",
    "📺 *Servicios solicitados:*",
    ...lines,
    "",
    `💰 *TOTAL: ${formatPrice(total)}*`,
    "",
    "Hola, quiero confirmar este pedido. ¿Me indican cómo realizar el pago?"
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener");
}

document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const increaseButton = event.target.closest("[data-increase]");
  const decreaseButton = event.target.closest("[data-decrease]");
  const removeButton = event.target.closest("[data-remove]");
  const filterButton = event.target.closest("[data-filter]");

  if (addButton) addToCart(addButton.dataset.add);

  if (increaseButton) changeQuantity(increaseButton.dataset.increase, 1);

  if (decreaseButton) changeQuantity(decreaseButton.dataset.decrease, -1);

  if (removeButton) removeFromCart(removeButton.dataset.remove);

  if (filterButton) {
    activeFilter = filterButton.dataset.filter;

    document.querySelectorAll("[data-filter]").forEach(button => {
      button.classList.toggle("active", button === filterButton);
    });

    renderProducts();
  }
});

document.getElementById("open-cart")?.addEventListener("click", openCart);
document.getElementById("close-cart")?.addEventListener("click", closeCart);
document.getElementById("send-order")?.addEventListener("click", sendOrder);
overlay?.addEventListener("click", closeCart);

document.querySelector(".payment-btn")?.addEventListener("click", () => {
  // El enlace de Mercado Pago se abre normalmente.
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
