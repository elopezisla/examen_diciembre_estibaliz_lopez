const form = document.getElementById('form');
const listaComponentes = document.getElementById('lista-componentes');
const API_URL = 'http://localhost:3000/productos';




// Mostrar productos
async function fetchProductos() {
    try {
        const res = await fetch(API_URL);
        const productos = await res.json();  
        //console.log('Productos cargados:', productos);
        mostrarProductos(productos);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        listaComponentes.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: red;">Error al conectar con el servidor</p>';
    }
}

// Tarjetas
function mostrarProductos(productos) {
    listaComponentes.innerHTML = '';  

    if (productos.length === 0) {
        listaComponentes.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No hay servidores registrados aún.</p>';
        return;
    }

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        tarjeta.innerHTML = `
            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
            <h4>${producto.nombre}</h4>
            <p><strong>CPU:</strong> ${producto.cpu}</p>
            <p><strong>RAM:</strong> ${producto.ram} GB</p>
            <p><strong>Almacenamiento:</strong> ${producto.almacenamiento}</p>
        `;

        //eliminar
        tarjeta.querySelector('.btn-eliminar').addEventListener('click', () => {
            borrarProducto(producto.id);
        });

        listaComponentes.appendChild(tarjeta);
    });
}

// Guardar nuevo producto
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpiar mensajes de error anteriores
    const mensajeErrorExistente = document.querySelector('.mensaje-error');
    if (mensajeErrorExistente) {
        mensajeErrorExistente.remove();
    }

    const nombre = document.getElementById('servidor').value.trim();
    const cpu = document.getElementById('cpu').value.trim();
    const ram = Number(document.getElementById('ram').value);
    const almacenamiento = document.getElementById('almacenamiento').value.trim();

    const newProducto = { nombre, cpu, ram, almacenamiento };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProducto)
        });

        form.reset();
        fetchProductos();  
    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarMensajeError('Error al conectar con el servidor. Verifica que json-server esté corriendo.');
    }
});

// Mostrar mensaje de error
function mostrarMensajeError(texto) {
    // Eliminar mensaje anterior si existe
    const anterior = document.querySelector('.mensaje-error');
    if (anterior) anterior.remove();

    const tarjetaError = document.createElement('div');
    tarjetaError.classList.add('tarjeta', 'mensaje-error');
    tarjetaError.style.backgroundColor = '#ffebee';
    tarjetaError.style.borderLeft = '5px solid #e74c3c';
    tarjetaError.innerHTML = `
        <p style="color: #c0392b; font-weight: bold; margin: 0;">
            ${texto}
        </p>
    `;

    // Insertar al principio de la lista
    listaComponentes.prepend(tarjetaError);

    
}

// Eliminar servidor
async function borrarProducto(id) {
    /* if (!confirm('¿Seguro que quieres eliminar este servidor?')) return; */

    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchProductos();  
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

fetchProductos();