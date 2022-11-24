let cliente = {  //1
    mesa: "",
    hora: "",
    pedido: []
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

function obtenerPlatillos() {  //7
    const url = "http://localhost:4000/platillos";

    fetch(url)
    .then(respuesta => console.log(respuesta))
    .catch(error => console.log(error));
}
