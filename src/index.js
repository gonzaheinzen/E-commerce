import { getProducts } from "./api.js";

let products = await getProducts();

function renderProducts(products){

    let productList = document.getElementById('product-list');
    productList.innerHTML = '';


    products.forEach(product => {

        const div = document.createElement('div');
        div.classList.add('product');

        div.innerHTML = `
            <div class="col">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.title}">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${product.description}</p>
                    </div>
                </div>
            </div>
        `;

        productList.appendChild(div);
    });
}

renderProducts(products);



