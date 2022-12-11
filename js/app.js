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

    if(cliente.pedido.length) {
        //Mostrar el resumen:
        actualizarResumen();
    }else {
        mensajePedidoVacio();
    }

    
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

    //Mostrar el formulario de propinas:
    formularioPropinas();

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

    //Limpiar el codigo HTML anterior
    limpiarHtml();

    if(cliente.pedido.length) {
        //Mostrar el resumen:
        actualizarResumen();
    }else {
        mensajePedidoVacio();
    }

    //Cuando elimino un platillo regresa el input a cero:
    const platilloEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(platilloEliminado);
    inputEliminado.value = 0;
};

function mensajePedidoVacio() {
    const contenido = document.querySelector("#resumen .contenido");
    
    const texto = document.createElement("p");
    texto.classList.add("text-center");
    texto.textContent = "Añade los Platillos del Pedido"

    contenido.appendChild(texto);
};

function formularioPropinas() {
    const contenido = document.querySelector("#resumen .contenido");

    const formulario = document.createElement("div");
    formulario.classList.add("col-md-6","formulario");

    const divFormulario = document.createElement("div");
    divFormulario.classList.add("card", "py-4", "px-3", "shadow");

    const heading = document.createElement("h4");
    heading.classList.add("my-4", "fst-italic","text-center");
    heading.textContent = "Propina:";

    //Radio button 0%:
    const radio0 = document.createElement("input");
    radio0.type = "radio";
    radio0.name = "propina";
    radio0.value = "0";
    radio0.classList.add("form-check-input");
    radio0.onclick = calcularPropina;

    const radio0Label = document.createElement("label");
    radio0Label.textContent = "0%";
    radio0Label.classList.add("form-check-label");

    const radio0Div = document.createElement("div");
    radio0Div.classList.add("form-check", "fw-bold");

    radio0Div.appendChild(radio0);
    radio0Div.appendChild(radio0Label);
    
    //Radio button 10%:
    const radio10 = document.createElement("input");
    radio10.type = "radio";
    radio10.name = "propina";
    radio10.value = "10";
    radio10.classList.add("form-check-input");
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement("label");
    radio10Label.textContent = "10%";
    radio10Label.classList.add("form-check-label");

    const radio10Div = document.createElement("div");
    radio10Div.classList.add("form-check", "fw-bold");

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);


    //Radio button 25%:
    const radio25 = document.createElement("input");
    radio25.type = "radio";
    radio25.name = "propina";
    radio25.value = "25";
    radio25.classList.add("form-check-input");
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement("label");
    radio25Label.textContent = "25%";
    radio25Label.classList.add("form-check-label");

    const radio25Div = document.createElement("div");
    radio25Div.classList.add("form-check", "fw-bold");

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

     //Radio button 50%:
     const radio50 = document.createElement("input");
     radio50.type = "radio";
     radio50.name = "propina";
     radio50.value = "50";
     radio50.classList.add("form-check-input");
     radio50.onclick = calcularPropina;
 
     const radio50Label = document.createElement("label");
     radio50Label.textContent = "50%";
     radio50Label.classList.add("form-check-label");
 
     const radio50Div = document.createElement("div");
     radio50Div.classList.add("form-check", "fw-bold");
 
     radio50Div.appendChild(radio50);
     radio50Div.appendChild(radio50Label);

    //Agregar al Div principal:
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio0Div);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
    
    //Agregar al formulario:
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);
};

    function calcularPropina() {
        const {pedido} = cliente;
        let subtotal = 0;

        //Calcular el subtotal a pagar:
        pedido.forEach(articulo => {
            subtotal += articulo.cantidad * articulo.precio;
        });

        //Selecciona el radio button de propina:
        const propinaSeleccionada = document.querySelector("[name='propina']:checked").value;
        
        //Calcula propina:
        const propina = ((subtotal * parseInt(propinaSeleccionada))/100);
       
        //Calcula el total a pagar(propina+subtotal):
        const total = subtotal+propina;
        
        mostrarTotal(subtotal, total, propina);
};

function mostrarTotal(subtotal, total, propina) {
    const divTotales = document.createElement("div");
    divTotales.classList.add("total-pagar");
    
    //Subtotal:
    const subtotalParrafo = document.createElement("p");
    subtotalParrafo.classList.add("fs-4","fw-bold","mt-5");
    subtotalParrafo.textContent = "Subtotal Consumo: ";

    const subtotalSpan = document.createElement("span");
    subtotalSpan.classList.add("fw-normal");
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    


    //Propina:
    const propinaParrafo = document.createElement("p");
    propinaParrafo.classList.add("fs-4","fw-bold","mt-1");
    propinaParrafo.textContent = "Propina: ";

    const propinaSpan = document.createElement("span");
    propinaSpan.classList.add("fw-normal");
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    


     //Total:
     const totalParrafo = document.createElement("p");
     totalParrafo.classList.add("fs-4","fw-bold","mt-1");
     totalParrafo.textContent = "Total a Pagar: ";
 
     const totalSpan = document.createElement("span");
     totalSpan.classList.add("fw-normal");
     totalSpan.textContent = `$${total}`;
 
     totalParrafo.appendChild(totalSpan);


     //Eliminar el ultimo resultado:
     const totalPagarDiv = document.querySelector(".total-pagar");
     if(totalPagarDiv) {
        totalPagarDiv.remove();
     }
 
     divTotales.appendChild(subtotalParrafo);
     divTotales.appendChild(propinaParrafo);
     divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector(".formulario > div");
    formulario.appendChild(divTotales);
};

//****************** NOTA *******************
//Para simular el servidor de los platillos:
//en la terminal escribir: json-server --watch db.json --port 4000