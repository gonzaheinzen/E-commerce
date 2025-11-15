import { getProducts } from "./api.js";
import {
  addToCart,
  updateCartCount,
  updateCartUI,
} from "./services/carrito.service.js";

let products = await getProducts();

function renderProducts(products) {
  let productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product, index) => {
    const div = document.createElement("div");
    div.classList.add("col-6", "col-md-4", "col-lg-3");

    div.innerHTML = `
    <div class="card h-100 product-card" data-index="${index}">
      <div class="product-image-container">
        <img src="${product.image}" class="card-img-top product-image" alt="${product.title}">
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
         <button class="btn btn-dark w-100 add-to-cart" data-index="${index}">
  Agregar al carrito
</button>
        </div>
      </div>
    </div>
  `;

    productList.appendChild(div);
  });
}

document.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;
  const index = card.dataset.index;
  const product = products[index];

  if (product) openProductModal(product);
});

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
  };
  const modal = new bootstrap.Modal(document.getElementById("productModal"));
  modal.show();
}

//Carrito
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const index = e.target.dataset.index;
    addToCart(products[index]);
  }
});

renderProducts(products);
