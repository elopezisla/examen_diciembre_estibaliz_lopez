const form = document.getElementById('form');
const panelLista = document.getElementById('panel-lista');
const API_URL = 'http://localhost:3000/productos';

/* mostrar*/
async function fetchProductos() {
    try {
        const res = await fetch(API_URL);
        const productos = await res.json();
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al mostrar los productos:', error);
    }
}

/* tarjetas */
function mostrarProductos(productos) {
    panelLista.classList.add('updating');
    panelLista.replaceChildren(); // limpiar antes

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');

        // Añadir clase 'tarjeta'
       /*  const clases = ['tarjeta'];
        if (alien.peligrosidad) clases.push(alien.peligrosidad);
        tarjeta.classList.add(...clases); */

        tarjeta.innerHTML = `
            <strong>${producto.nombre}</strong><br>
            CPU: ${producto.cpu}<br>
            RAM: ${producto.ram}
            Almacenamiento: ${producto.almacenamiento}
            <button data-id="${producto.nombre}">Eliminar</button>
        `;

        // Evento para eliminar
        tarjeta.querySelector('button').addEventListener('click', () => borrarAlien(producto.nombre));

        alienList.appendChild(tarjeta);
    });
}

/* nuevo producto */
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // evitar recarga automatica

    const nombre = document.getElementById('nombre').value.trim();
    const cpu = document.getElementById('cpu').value.trim();
    const ram = document.getElementById('ram').value;
    const almacenamiento = document.getElementById('almacenamiento').value;

    
   

    const newProducto = { id, nombre, cpu, ram, almacenamiento };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProducto)
        });

        form.reset(); // limpiar formulario
        fetchProductos(); //actualizar
    } catch (error) {
        console.error('Error al registrar el producto:', error);
    }
});


/* eliminar */
async function borrarProducto(nombre) {
    try {
        await fetch(`${API_URL}/${nombre}`, { method: 'DELETE' });
        fetchProductos(); 
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}



fetchProductos();