let cliente = {  //1
    mesa: "",
    hora: "",
    pedido: []
};

const categorias = {
    1: "Comida",
    2: "Bebida",
    3: "Postre"
}

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
   
        
    }
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
    
}

function mostrarSecciones() {   //6
    const seccionesOcultas = document.querySelectorAll(".d-none");
    seccionesOcultas.forEach(seccion => seccion.classList.remove("d-none"));
}

function obtenerPlatillos() {  //7  consulta la API
    const url = "http://localhost:4000/platillos";

    fetch(url).then(respuesta => respuesta.json())
    .then(resultado => mostrarPlatillos(resultado))
    .catch(error => console.log(error));
}

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

        const agregar = document.createElement("div");
        agregar.classList.add("col-md-2");
        agregar.appendChild(inputCantidad);


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
        
    })
}