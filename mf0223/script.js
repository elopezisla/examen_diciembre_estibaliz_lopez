const form = document.getElementById('form');
const listaComponentes = document.getElementById('lista-componentes');
/* const API_URL = 'http://localhost:3000/productos'; */
const API_URL = 'http://api:3000/productos';



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
        listaComponentes.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #777;">No hay servidores registrados aún.</p>';
        return;
    }

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        // Calcular total
        const total = producto.totalPresupuesto || 
                      (Number(producto.precioServidor) + 
                       Number(producto.precioCpu) + 
                       Number(producto.precioRam) + 
                       Number(producto.precioAlmacenamiento));

        tarjeta.innerHTML = `
            
            <h4>${producto.nombre || 'Sin nombre'}</h4>
            <p><strong>CPU:</strong> ${producto.cpu || 'No especificado'} <span style="color: #2980b9;">(${producto.precioCpu || 0}€)</span></p>
            <p><strong>RAM:</strong> ${producto.ram || 0} GB <span style="color: #2980b9;">(${producto.precioRam || 0}€)</span></p>
            <p><strong>Almacenamiento:</strong> ${producto.almacenamiento || 'No especificado'} <span style="color: #2980b9;">(${producto.precioAlmacenamiento || 0}€)</span></p>
            <p><strong>Precio base servidor:</strong> ${producto.precioServidor || 0}€</p>
            <p style="font-size: 1.3rem; font-weight: bold;">Total: ${total}€</p>
            <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
        `;

        // Botón eliminar
        tarjeta.querySelector('.btn-eliminar').addEventListener('click', () => {
            borrarProducto(producto.id);
        });

        listaComponentes.appendChild(tarjeta);
    });
}

// Guardar nuevo producto
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mensajeErrorExistente = document.querySelector('.mensaje-error');
    if (mensajeErrorExistente) {
        mensajeErrorExistente.remove();
    }

    // Obtener valores
    const nombre = document.getElementById('servidor').value.trim();
    const precioServidor = Number(document.getElementById('precio-servidor').value);
    const cpu = document.getElementById('cpu').value.trim();
    const precioCpu = Number(document.getElementById('precio-cpu').value);
    const ram = Number(document.getElementById('ram').value);
    const precioRam = Number(document.getElementById('precio-ram').value);
    const almacenamiento = document.getElementById('almacenamiento').value.trim();
    const precioAlmacenamiento = Number(document.getElementById('precio-almacenamiento').value);


    // Calcular total
    const total = precioServidor + precioCpu + precioRam + precioAlmacenamiento;

    // Validación límite 700€
    if (total > 700) {
        mostrarMensajeError(`Presupuesto excedido. Máximo permitido 700€.`);
        return;
    }

    // Objeto a guardar
    const newProducto = { nombre, cpu, ram, almacenamiento, precioServidor, precioCpu, precioRam, precioAlmacenamiento, totalPresupuesto: total };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProducto)
        });

        if (!response.ok) throw new Error('Error del servidor');

        form.reset();
        fetchProductos();
    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarMensajeError('Error al conectar con el servidor. ¿Está json-server ejecutándose?');
    }
});

// Mostrar mensaje de error
function mostrarMensajeError(texto) {
    const anterior = document.querySelector('.mensaje-error');
    if (anterior) anterior.remove();

    const mensaje = document.createElement('div');
    mensaje.classList.add('mensaje-error');
    mensaje.textContent = texto;  
    mensaje.style.color = 'red';
    mensaje.style.textAlign = 'center';
    mensaje.style.marginTop = '1rem';
    
    const boton = form.querySelector('button[type="submit"]');
    boton.insertAdjacentElement('afterend', mensaje);
}

// Eliminar producto
async function borrarProducto(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchProductos();  
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

fetchProductos();