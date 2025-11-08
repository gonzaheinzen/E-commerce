
export function showSuccessAlert(message) {
    Swal.fire({
        icon: 'success',
        title: 'Accion realizada exitosamente',
        text: message,
    });
}


export function showErrorAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error',
        text: message,
    });
}


export async function showConfirmAlert(title, text) {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar'
    });

    return result.isConfirmed;
}