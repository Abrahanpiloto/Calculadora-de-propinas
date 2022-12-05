let cliente = {  //1
    mesa: "",
    hora: "",
    pedido: []
};

const categorias = {
    1: "Comida",
    2: "Bebida",
    3: "Postre"
};

const btnGuardarCliente = document.querySelector("#guardar-cliente");  //2
btnGuardarCliente.addEventListener("click", guardarCliente);

function guardarCliente() {  //3
    const mesa = document.querySelector("#mesa").value;
    const hora = document.querySelector("#hora").value;

    //Revisa si hay campos vacios
    const camposVacios = [mesa,hora].some(campo => campo === "");

    if(camposVacios) {
        //verifica si ya hay una alerta en el modal
        const existeAlerta = document.querySelector(".invalid-feedback");

        if(!existeAlerta) {
            const alerta = document.createElement("div");
            alerta.classList.add("invalid-feedback", "d-block", "text-center");
            alerta.textContent= "TODOS LOS CAMPOS SON OBLIGATORIOS";
            document.querySelector(".modal-body form").appendChild(alerta);
        
            //elimina la alerta del modal
            setTimeout(() => {
                alerta.remove();
            }, 3000);
        }
       
        return;      
    };
    //Asigna los datos del formulario al cliente  //4
    cliente = {...cliente, mesa, hora};
    
    //Oculta el modal con un metodo de bootstrap  //5
    const modalFormulario = document.querySelector("#formulario"); 
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostrar las secciones
    mostrarSecciones();

    //Obtener platillos de la API de JSON-SERVER
    obtenerPlatillos();
    
};

function mostrarSecciones() {   //6
    const seccionesOcultas = document.querySelectorAll(".d-none");
    seccionesOcultas.forEach(seccion => seccion.classList.remove("d-none"));
};

function obtenerPlatillos() {  //7  consulta la API
    const url = "http://localhost:4000/platillos";

    fetch(url).then(respuesta => respuesta.json())
    .then(resultado => mostrarPlatillos(resultado))
    .catch(error => console.log(error));
};

function mostrarPlatillos(platillos) {  //8
    const contenido = document.querySelector("#platillos .contenido");

    platillos.forEach(platillo => {
        const row = document.createElement("div");
        row.classList.add("row", "py-3", "border-top");

        const nombre = document.createElement("div");
        nombre.classList.add("col-md-4");
        nombre.textContent = platillo.nombre;

        const precio = document.createElement("div");
        precio.classList.add("col-md-3", "fw-bold");
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement("div");
        categoria.classList.add("col-md-3",);
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement("input");
        inputCantidad.type = "number";
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add("form-control");

        //Funcion q detecta la cantidad y el platillo q se esta agregando:  //9
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});  
        };

        const agregar = document.createElement("div");
        agregar.classList.add("col-md-2");
        agregar.appendChild(inputCantidad);


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
        
    })
};

function agregarPlatillo(producto) {  // 10
    //Extrae el pedido actual
    let {pedido} = cliente;  //Distructuring

    //Revisa que la cantidad sea mayor a cero
    if(producto.cantidad > 0) {

        //Comprueba si el elemento ya existe en el array
        if(pedido.some(articulo => articulo.id === producto.id)){
            //El articulo ya existe, actualiza la cantidad
            const pedidoActualizado = pedido.map(articulo => {
                if(articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            //se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];

        }else {
            //El articulo no existe lo agrega al array de pedido
            cliente.pedido = [...pedido, producto];
        }
    } else {
        //Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo=> articulo.id !== producto.id);
        cliente.pedido = [...resultado];    
    } 

    //Limpiar el codigo HTML anterior
    limpiarHtml();
    //Mostrar el resumen:
    actualizarResumen();
};

function actualizarResumen() {  //11
    const contenido = document.querySelector("#resumen .contenido");

    const resumen = document.createElement("div");
    resumen.classList.add("col-md-6", "card", "py-4", "px-3", "shadow");

    //Informacion de la mesa:
    const mesa = document.createElement("p");
    mesa.textContent = "Mesa: ";
    mesa.classList.add("fw-bold");

    const mesaSpan = document.createElement("span");
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add("font-normal");

    //Informacion de la hora:
    const hora = document.createElement("p");
    hora.textContent = "Hora: ";
    hora.classList.add("fw-bold");

    const horaSpan = document.createElement("span");
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add("font-normal");

    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Subtitulo del Resumen de Consumo: 
    const heading = document.createElement("h4");
    heading.textContent = "Platillos Consumidos:";
    heading.classList.add("my-4", "text-center", "fst-italic");

    //Iterar sobre el array de pedidos:
    const grupo = document.createElement("ul");
    grupo.classList.add("list-group");

    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;
        
        const lista = document.createElement("li");
        lista.classList.add("list-group-item");

        //Nombre de articulo:
        const nombreEl = document.createElement("h5");
        nombreEl.textContent = nombre;
        nombreEl.classList.add("my-3");

        //Cantidad del articulo:
        const cantidadEl = document.createElement("p");
        cantidadEl.classList.add("fw-bold");
        cantidadEl.textContent = "Cantidad: ";

        const cantidadValor = document.createElement("span");
        cantidadValor.classList.add("fw-normal");
        cantidadValor.textContent = cantidad;

        cantidadEl.appendChild(cantidadValor);


        //Precio del articulo:
        const precioEl = document.createElement("p");
        precioEl.classList.add("fw-bold");
        precioEl.textContent = "Precio Unidad: ";

        const precioValor = document.createElement("span");
        precioValor.classList.add("fw-normal");
        precioValor.textContent = `$${precio}`;

        precioEl.appendChild(precioValor);

        //Categoria del articulo:
        const categoriaEl = document.createElement("p");
        categoriaEl.classList.add("fw-normal");
        categoriaEl.textContent = categorias[articulo.categoria];

        //Subtotal:
        const subtotal = document.createElement("p");
        subtotal.classList.add("fw-bold");
        subtotal.textContent = "Subtotal: ";

        const subtotalValor = document.createElement("span");
        subtotalValor.classList.add("fw-normal");
        subtotalValor.textContent = `$${precio * cantidad}`;

        //Boton para eliminar un platillo:
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger");
        btnEliminar.textContent = "Eliminar Platillo";

        //Funcion del button que elimina el platillo:
        btnEliminar.onclick = function() {
            eliminarProducto(id);
        }

        subtotal.appendChild(subtotalValor);

        //Agregar elementos al li:
        lista.appendChild(categoriaEl);
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotal);
        lista.appendChild(btnEliminar);
        
        //Agregar li al ul:
        grupo.appendChild(lista);
    });   

    //Agrega al resumen:
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    //agrega al contenido:
    contenido.appendChild(resumen);
};

function limpiarHtml() {
    const contenido = document.querySelector("#resumen .contenido");
    while(contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
};

function eliminarProducto(id) {
    const {pedido} = cliente;
    const resultado = pedido.filter(articulo=> articulo.id !== id);
        cliente.pedido = [...resultado];   
        console.log(cliente.pedido);

    //Limpiar el codigo HTML anterior
    limpiarHtml();
    //Mostrar el resumen:
    actualizarResumen();
};