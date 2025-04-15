document.addEventListener("DOMContentLoaded", () => {
  const carButton = document.querySelectorAll("#carritoBtn");

  carButton.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
            // Verificar el estado del producto
            const status = btn.dataset.status;

            if (status.toLowerCase() === "agotado") {
              Swal.fire({
                title: "Producto agotado",
                text: "Este producto no está disponible actualmente.",
                icon: "warning",
                confirmButtonText: "Ok",
              });
              return; // No continuar con la acción de agregar al carrito
            }

      const product = {
        nombre: btn.dataset.nombre,
        cantidad: 1,
        precio: parseFloat(btn.dataset.precio),
        imagen: btn.dataset.imagen,
        categoriaId: parseInt(btn.dataset.categoria),
        idProducto: parseInt(btn.dataset.id),
        existencias: parseInt(btn.dataset.existencias), // Añadido para las existencias
      };

      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

      const productoExistente = carrito.find((item) => item.idProducto === product.idProducto);
      if (productoExistente) {
        productoExistente.cantidad += 1;
        if (productoExistente.cantidad > productoExistente.existencias) {
          productoExistente.cantidad = productoExistente.existencias; // Limitar a las existencias
          Swal.fire({
            title: "Sin existencias",
            text: "No hay más productos disponibles.",
            icon: "warning",
            confirmButtonText: "Ok",
          });
        }
      } else {
        carrito.push(product);
      }

      localStorage.setItem("carrito", JSON.stringify(carrito));
      console.log("Producto agregado al carrito:", product);

      Swal.fire({
        title: "¡Agregado!",
        text: "Tu producto ha sido agregado al carrito.",
        icon: "success",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/client/dashboard";
        }
      });
    });
  });

  renderizarCarrito();
});

function renderizarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const lista = document.getElementById("carrito-lista");
  const subtotalSpan = document.getElementById("subtotal");

  lista.innerHTML = ""; // Limpiar la lista

  let subtotal = 0;

  carrito.forEach((producto) => {
    const li = document.createElement("li");
    li.classList.add("aside-product-list-item");

    // Generar opciones para el <select> con la cantidad máxima de existencias
    let options = "";
    for (let i = 1; i <= producto.existencias; i++) {
      options += `<option value="${i}" ${i === producto.cantidad ? "selected" : ""}>${i}</option>`;
    }

    li.innerHTML = `
      <a href="#" class="remove" data-id="${producto.idProducto}">×</a>
      <a href="product-details.html">
        <img src="${producto.imagen}" width="68" height="84" alt="${producto.nombre}">
        <span class="product-title">${producto.nombre}</span>
      </a>
      <span class="product-price">$${producto.precio.toFixed(2)}</span>
      <select class="product-quantity" data-id="${producto.idProducto}" data-existencias="${producto.existencias}">
        ${options}
      </select>
    `;

    lista.appendChild(li);
    subtotal += producto.cantidad * producto.precio;
  });

  subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;

  // Agregar listener para actualizar cantidad y subtotal
  const quantitySelectors = document.querySelectorAll(".product-quantity");
  quantitySelectors.forEach((select) => {
    select.addEventListener("change", (e) => {
      const idProducto = parseInt(e.target.dataset.id);
      const nuevaCantidad = parseInt(e.target.value);
      actualizarCantidadProducto(idProducto, nuevaCantidad);
    });
  });
}

function actualizarCantidadProducto(idProducto, nuevaCantidad) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const producto = carrito.find((item) => item.idProducto === idProducto);

  if (producto) {
    // Asegurarse de que la cantidad no supere las existencias
    const maxCantidad = producto.existencias;
    if (nuevaCantidad > maxCantidad) {
      producto.cantidad = maxCantidad; // Limitar a las existencias
    } else {
      producto.cantidad = nuevaCantidad;
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove")) {
    e.preventDefault();
    const id = parseInt(e.target.getAttribute("data-id"));
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter((item) => item.idProducto !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
  }
});

document.getElementById("enviarCarrito").addEventListener("click", async () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    Swal.fire({
      title: "Carrito vacío",
      text: "No hay productos en el carrito.",
      icon: "warning",
      confirmButtonText: "Ok",
    });
    return;
  }

  Swal.fire({
    title: "Confirmar pedido",
    text: "¿Estás seguro de que deseas realizar el pedido?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, comprar",
    cancelButtonText: "Cancelar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch("/client/crearpedido", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carrito),
        });

        if (response.ok) {
          localStorage.removeItem("carrito");
          Swal.fire({
            title: "Pedido exitosa",
            text: "Tu pedido ha sido realizado con éxito.",
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            window.location.href = "/client/dashboard";
          });
        } else {
          throw new Error("Error al procesar la pedido");
        }
      } catch (error) {
        console.error("Error en la pedido:", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al procesar tu pedido.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  });
});