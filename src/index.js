import { getProducts } from "./api.js";
import {
  addToCart,
  updateCartCount,
  updateCartUI,
  getCartTotal, 
  clearCart,    
  getCart       
} from "./services/carrito.service.js";

import { filterProducts } from "./services/products.service.js";
import { showSuccessAlert, showErrorAlert } from "./utils/alerts.util.js";

// Inicializamos la instancia del modal de Bootstrap de forma global
const productModal = new bootstrap.Modal(document.getElementById("productModal"));

// 1. Cargar productos de forma asíncrona al inicio
let products = await getProducts();

// Obtener referencias a elementos del DOM
let productList = document.getElementById("product-list");
let checkoutForm = document.getElementById("checkout-form");
let goToCheckoutBtn = document.getElementById("goToCheckoutBtn");
let backToHomeBtn = document.getElementById("backToHomeBtn");
let searchForm = document.querySelector("form.d-flex");

// Referencia a la sección de Categorías Populares (para ocultarla en checkout)
const popularCategoriesSection = document.querySelector('.container.py-5 .row.text-center').closest('section');


// ===============================
// LÓGICA DE PRODUCTOS Y RENDERIZADO
// ===============================

function renderProducts(productsToRender) {
  productList.innerHTML = "";

  productsToRender.forEach((product) => {
    // Usamos el ID del producto para encontrar su índice original en el array 'products'
    const originalIndex = products.findIndex(p => p.id === product.id);
    
    const div = document.createElement("div");
    div.classList.add("col-6", "col-md-4", "col-lg-3");

    div.innerHTML = `
    <div class="card h-100 product-card" data-index="${originalIndex}">
      <div class="product-image-container">
        <img src="${product.image}" class="card-img-top product-image" alt="${product.title}" >
      </div>
      <div class="card-body d-flex flex-column">
        <p class="card-text text-muted mb-1">${product.category}</p>
        <h5 class="card-title product-title">${product.title}</h5>
        <div class="d-flex justify-content-between align-items-center mt-auto">
          <p class="card-text fs-5 fw-bold mb-0">$${product.price}</p>
          <div class="product-rating">
            <i class="bi bi-star-fill text-warning"></i>
            <span class="rating-text">${product.rating.rate} (${product.rating.count})</span>
          </div>
        </div>
        <div class="mt-3">
         <button class="btn btn-dark w-100 add-to-cart" data-index="${originalIndex}">
  Agregar al carrito
</button>
        </div>
      </div>
    </div>
  `;

    productList.appendChild(div);
  });
}

function openProductModal(product) {
  document.getElementById("productModalLabel").textContent = product.title;
  document.getElementById("modal-product-image").src = product.image;
  document.getElementById("modal-product-title").textContent = product.title;
  document.getElementById("modal-product-category").textContent =
    product.category;
  document.getElementById("modal-product-description").textContent =
    product.description;
  document.getElementById(
    "modal-product-price"
  ).textContent = `$${product.price}`;
  document.querySelector(
    "#modal-product-rating .rating-text"
  ).textContent = `${product.rating.rate} (${product.rating.count})`;
  document.querySelector("#productModal button.btn-dark").onclick = () => {
    addToCart(product);
    productModal.hide();
    showSuccessAlert(`${product.title} se ha añadido al carrito.`);
  };
  
  productModal.show();
}


// ===============================
// LÓGICA DE BÚSQUEDA
// ===============================

searchForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    
    const searchInput = searchForm.querySelector('input[type="search"]');
    const searchTerm = searchInput.value;
    
    // Usar la función importada y pasar el array 'products'
    const filteredProducts = filterProducts(products, searchTerm); 
    
    renderProducts(filteredProducts);
    
    // Limpiar el campo de búsqueda
    searchInput.value = ''; 
    
    if (filteredProducts.length === 0) {
        showErrorAlert(`No se encontraron productos que coincidan con "${searchTerm}".`);
    }
});


// ===============================
// LÓGICA DE CHECKOUT
// ===============================

function renderCheckoutSummary() {
    const cartItems = getCart();
    const cartSummary = document.getElementById("checkout-cart-summary");
    cartSummary.innerHTML = "";
    
    // Contar items
    document.getElementById("checkout-count").textContent = getCart().reduce((acc, item) => acc + item.quantity, 0);
    
    const submitButton = checkoutForm.querySelector('button[type="submit"]');

    if (cartItems.length === 0) {
        cartSummary.innerHTML = `<li class="list-group-item">El carrito está vacío.</li>`;
        submitButton.disabled = true;
        return;
    }
    
    submitButton.disabled = false;

    cartItems.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "lh-sm");
        li.innerHTML = `
            <div>
                <h6 class="my-0">${item.title}</h6>
                <small class="text-muted">Cant: ${item.quantity}</small>
            </div>
            <span class="text-muted">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartSummary.appendChild(li);
    });

    const totalLi = document.createElement("li");
    totalLi.classList.add("list-group-item", "d-flex", "justify-content-between", "fw-bold", "bg-light");
    totalLi.innerHTML = `
        <span>Total (USD)</span>
        <strong>$${getCartTotal()}</strong>
    `;
    cartSummary.appendChild(totalLi);
}

function showHome() {
    // Mostrar elementos del home
    document.querySelector('header').classList.remove('d-none');
    document.querySelector('.hero-section').classList.remove('d-none');
    
    // MOSTRAR SECCIONES DE PRODUCTOS Y CATEGORÍAS
    document.getElementById('product-list').closest('section').classList.remove('d-none');
    popularCategoriesSection.classList.remove('d-none'); // Muestra categorías
    
    // Ocultar checkout
    document.getElementById('checkout-section').classList.add('d-none');
    // Asegura que se muestren todos los productos al volver
    renderProducts(products); 
}

function showCheckout() {
    if (getCartTotal() <= 0) {
        showErrorAlert("El carrito está vacío. Agregue productos para continuar.");
        return;
    }
    
    // Ocultar home
    document.querySelector('header').classList.add('d-none');
    document.querySelector('.hero-section').classList.add('d-none');
    
    // OCULTAR SECCIONES DE PRODUCTOS Y CATEGORÍAS
    document.getElementById('product-list').closest('section').classList.add('d-none');
    popularCategoriesSection.classList.add('d-none'); // Oculta categorías
    
    // Mostrar checkout
    document.getElementById('checkout-section').classList.remove('d-none');
    
    renderCheckoutSummary();
    window.scrollTo(0, 0); 
}

// ===============================
// MANEJO DE EVENTOS INICIALES
// ===============================

// Evento: Abrir Modal (Click en cualquier parte de la tarjeta, excepto el botón)
document.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card || e.target.classList.contains("add-to-cart")) return; 

  const index = card.dataset.index;
  const product = products[index];

  if (product) openProductModal(product);
});

// Evento: Añadir al carrito (Click en el botón)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const index = e.target.dataset.index;
    const product = products[index];
    addToCart(product);
    showSuccessAlert(`${product.title} se ha añadido al carrito.`);
  }
});

// Evento: Botón "Ir a pagar"
goToCheckoutBtn.addEventListener("click", showCheckout);

// Evento: Botón "Seguir comprando"
backToHomeBtn.addEventListener("click", showHome);

// Evento: Envío del formulario de pago (Simulación de pago)
checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (!checkoutForm.checkValidity()) {
        e.stopPropagation();
        checkoutForm.classList.add('was-validated');
        showErrorAlert("Por favor, complete todos los campos requeridos.");
        return;
    }
    
    // Simulación de pago
    showSuccessAlert("🎉 ¡Pago realizado con éxito! Su pedido está siendo procesado.");
    clearCart(); 
    showHome(); 
    checkoutForm.classList.remove('was-validated'); 
    checkoutForm.reset(); 
});

// Inicialización de la UI: ESTO DEBE SER LO ÚLTIMO
renderProducts(products);