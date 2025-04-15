document.addEventListener('DOMContentLoaded', () => {
  // Obtención de botones y modales
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtnE = document.getElementById('closeModalBtnE');
  const modal = document.getElementById('AgregarCat');
  const openModalBtnProd = document.getElementById('openModalBtnProd');
  const closeModalBtnP = document.getElementById('closeModalBtnP');
  const modalP = document.getElementById('agregarProd');
  const openModalBtnEC = document.getElementById('openME');
  const modalEC= document.getElementById('EditarCat')
  const closeModalBtnEc= document.getElementById('closeModalBtnEC')

  // Solo agregar event listener si el modal de categoría existe
  if (openModalBtn && modal && closeModalBtnE) {
    // Abrir modal de categoría
    openModalBtn.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    // Cerrar modal de categoría
    closeModalBtnE.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Solo agregar event listener si el modal de producto existe
  if (openModalBtnProd && modalP && closeModalBtnP) {
    // Abrir modal de producto
    openModalBtnProd.addEventListener('click', () => {
      modalP.style.display = 'block';
    });

    // Cerrar modal de producto
    closeModalBtnP.addEventListener('click', () => {
      modalP.style.display = 'none';
    });
  }

  //modal editar categoria
  if (openModalBtnEC && modalEC) {
    // Abrir modal de categoría
    openModalBtnEC.addEventListener('click', () => {
      modalEC.style.display = 'block';
    });

    closeModalBtnEc.addEventListener('click', () => {
      modalEC.style.display = 'none';
    });
  }
  // Cerrar modales si se hace clic fuera de ellos
  window.addEventListener('click', (event) => {
    if (modal && event.target === modal) {
      modal.style.display = 'none';
    }
    if (modalP && event.target === modalP) {
      modalP.style.display = 'none';
    }
    if (modalEC && event.target === modalEC) {
      modalEC.style.display = 'none';
    }
  });
});

// Función de vista previa de imagen para el modal de categoría
function previewImageE(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('previewE');
  const uploadBtn = document.getElementById('uploadButtonContainer');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      uploadBtn.style.display = 'block'; // Mostrar botón de cargar imagen
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
    uploadBtn.style.display = 'none'; // Ocultar botón si se cancela selección
  }
}

function previewImageEc(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('previewE');
  const uploadBtn = document.getElementById('uploadButtonContainer');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      uploadBtn.style.display = 'block'; // Mostrar botón de cargar imagen
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
    uploadBtn.style.display = 'none'; // Ocultar botón si se cancela selección
  }
}

// Función de vista previa de imagen para el modal de producto
function previewImageP(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('previewP');
  const uploadBtn = document.getElementById('uploadButtonContainer');

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      uploadBtn.style.display = 'block'; // Mostrar botón de cargar imagen
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
    uploadBtn.style.display = 'none'; // Ocultar botón si se cancela selección
  }
}


// Función de vista previa para edición de categorías
function previewImageEdit(event, categoriaId) {
  const file = event.target.files[0];
  const preview = document.getElementById(`img-preview-${categoriaId}`); // Seleccionar la vista previa correcta

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result; // Actualizar la vista previa
      preview.style.display = 'block'; // Mostrar la vista previa
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = ''; // Restaurar si se cancela la selección
    preview.style.display = 'none'; // Ocultar vista previa
  }
}


// Función de vista previa para edición de productos
function previewImageEditP(event, productoId) {
  const file = event.target.files[0];
  const preview = document.getElementById(`img-previewP-${productoId}`); // Seleccionar la vista previa correcta

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result; 
      preview.style.display = 'block'; 
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = ''; 
    preview.style.display = 'none'; 
  }
}


// Función para abrir modales de imagen 
function abrirModal(id) {
  var modal = document.getElementById("modal-img-" + id);
  modal.style.display = "block";
}

function cerrarModal(id) {
  var modal = document.getElementById("modal-img-" + id);
  modal.style.display = "none";
}


function modaleditarCategoria(id) {
  var modalEditar = document.getElementById("modal-editC-" + id);
  modalEditar.style.display = "block";
}

function cerrarModaE(id) {
  var modalEditar = document.getElementById("modal-editC-" + id);
  modalEditar.style.display = "none";
}



function abrirModalEditar(id) {
  console.log("Producto con ID:", "modal-editarProducto" + id);
  var modalEditarProd = document.getElementById("modal-editarProducto" + id);
  if (modalEditarProd) {
    modalEditarProd.style.display = "block";
  } else {
    console.error("No se encontró el modal con ID:", "modal-editarProducto" + id);
  }
}

function cerrarModalEditProd(id) {
  var modalEditarProd = document.getElementById("modal-editarProducto" + id);
  modalEditarProd.style.display = "none";
}


function eliminarCategoria(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡Esta acción no se puede deshacer!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/admin/inventario/eliminar/categoria/${id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        if (data.mensaje === 'Categoría eliminada correctamente') {
          Swal.fire({
            title: 'Eliminado',
            text: data.mensaje,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire('Error', data.mensaje || 'Ocurrió un error inesperado.', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error en la petición', 'error');
      });
    }
  });
}


function eliminarProducto(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡Esta acción no se puede deshacer!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/admin/inventario/eliminar/producto/${id}`, {
        method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
        if (data.mensaje === 'Producto eliminado correctamente') {
          Swal.fire({
            title: 'Eliminado',
            text: data.mensaje,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            location.reload();
          });
        } else {
          Swal.fire('Error', data.mensaje || 'Ocurrió un error inesperado.', 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error en la petición', 'error');
      });
    }
  });
}