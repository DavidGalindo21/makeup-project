document.addEventListener('DOMContentLoaded', function () {
    const iso = new Isotope('.productos-contenedor', {
      itemSelector: '.producto-item',
      layoutMode: 'fitRows'
    });

    document.querySelectorAll('.filtro-categoria').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const categoria = this.getAttribute('data-categoria');
        console.log('Filtrando por:', categoria); // 👈 esto ayuda a depurar
        iso.arrange({ filter: categoria });
      });
    });
  });