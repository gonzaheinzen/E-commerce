

/**
 * Filtra un array de productos basándose en un término de búsqueda.
 * @param {Array<Object>} products El array completo de productos obtenidos al inicio.
 * @param {string} searchTerm El término de búsqueda introducido por el usuario (el input).
 * @returns {Array<Object>} Un nuevo array con los productos filtrados.
 */
export function filterProducts(products, searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
        return products;
    }

    // Pasar el input a lowercase y eliminar espacios extra
    const lowerCaseSearch = searchTerm.toLowerCase().trim();
    
    // Usar filter con .includes() (lógica de "contains")
    return products.filter(product =>
        product.title.toLowerCase().includes(lowerCaseSearch) ||
        product.category.toLowerCase().includes(lowerCaseSearch)
    );
}