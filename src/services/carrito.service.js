
let cart = [];

export function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  updateCartCount();
}

export function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

export function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("d-flex", "border", "p-2", "rounded");

    div.innerHTML = `
      <img src="${item.image}" class="me-3" style="width:70px; height:70px; object-fit:cover">

      <div class="flex-grow-1">
        <h6>${item.title}</h6>
        <p class="small text-muted">${item.category}</p>

        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary decrease">-</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary increase">+</button>
          </div>

          <p class="fw-bold mb-0">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>

      <button class="btn btn-sm btn-danger ms-2 delete">
        <i class="bi bi-trash"></i>
      </button>
    `;

    // Eventos de +/- y eliminar
    div.querySelector(".increase").onclick = () => {
      item.quantity++;
      updateCartUI();
      updateCartCount();
    };

    div.querySelector(".decrease").onclick = () => {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(c => c.id !== item.id);
      }
      updateCartUI();
      updateCartCount();
    };

    div.querySelector(".delete").onclick = () => {
      cart = cart.filter(c => c.id !== item.id);
      updateCartUI();
      updateCartCount();
    };

    cartItems.appendChild(div);
  });
}
