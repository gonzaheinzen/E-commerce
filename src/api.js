export function getProducts(){
   let response = fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => data);

    return response;
}