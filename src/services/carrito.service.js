

import { LocalStorageHandler } from "../utils/localstorage.util.js";

const CART_STORAGE_KEY = "shopping-cart";
const storageHandler = new LocalStorageHandler();

// INICIALIZACIÓN: Cargar el carrito desde localStorage al inicio.
let cart = storageHandler.getItem(CART_STORAGE_KEY) || [];

// FUNCIÓN DE UTILIDAD: Guarda el estado actual del carrito en localStorage
function saveCart() {
  storageHandler.saveItem(CART_STORAGE_KEY, cart);
}

export function getCart() {
  return cart;
}

export function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  updateCartCount();
}

export function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

export function getCartTotal() {
  return cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);
}

export function clearCart() {
    cart = [];
    storageHandler.removeItem(CART_STORAGE_KEY);
    updateCartCount();
    updateCartUI();
}

export function updateCartUI() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("d-flex", "border", "p-2", "rounded", "align-items-start");

    div.innerHTML = `
      <img src="${item.image}" class="me-3" style="width:70px; height:70px; object-fit:cover">

      <div class="flex-grow-1">
        <h6>${item.title}</h6>
        <p class="small text-muted">${item.category}</p>

        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary decrease" type="button">-</button>
            <span class="mx-2">${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary increase" type="button">+</button>
          </div>

          <p class="fw-bold mb-0">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>

      <button class="btn btn-sm btn-danger ms-2 delete" type="button">
        <i class="bi bi-trash"></i>
      </button>
    `;

    // Eventos de +/- y eliminar
    div.querySelector(".increase").onclick = () => {
      item.quantity++;
      saveCart();
      updateCartUI();
      updateCartCount();
    };

    div.querySelector(".decrease").onclick = () => {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(c => c.id !== item.id);
      }
      saveCart();
      updateCartUI();
      updateCartCount();
    };

    div.querySelector(".delete").onclick = () => {
      cart = cart.filter(c => c.id !== item.id);
      saveCart();
      updateCartUI();
      updateCartCount();
    };

    cartItems.appendChild(div);
  });

  const cartTotalElement = document.getElementById("cart-total");
  if(cartTotalElement) {
    cartTotalElement.textContent = getCartTotal();
  }
}

// Inicialización de la UI desde localStorage
updateCartCount();
updateCartUI();