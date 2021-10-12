"use strict"

//declaraciones
const form = document.getElementById("formulario");
const botonAdd = document.querySelector(".boton-1");
const tabla = document.getElementById("tabla");
const formularioMedio = document.querySelector(".formulario__botones");
let mensaje;
//el id que se pasara para editar
let editar;
const opcionesCategoria = [ 
                "Categoria",
                "trabajo",
                "gastos",
                "servivios",
                "alimentos",
                "entretenimiento"
];
const spanTotalPositivo = document.getElementById("total-p");
const spanTotalNegativo = document.getElementById("total-n");
const spanTotal = document.getElementById("total");

//eventos
botonAdd.addEventListener("click",(e)=>{
    //evito que recarge el navegador
    e.preventDefault();
    
    //hago un objeto de los datos del formulario
    let dato = formData();
    //valida si esta activo la validacion
    mensaje = "todo ok";
    if(form.getAttribute("data-validacion-activada")){
        mensaje = formularioValidacionesJs(); 
    }
    if(mensaje == "todo ok"){
        // lo guardo en localstorage lo que agrego
        guardaDatosObj(dato[0]);
        //agrego los datos en la tabla
        dato = agregarTabla(dato[0]);
        // agrego a la tabla 
        tabla.appendChild(dato);
        //reseteo el form
        form.reset();
    }
    else{
        document.querySelector(".mensaje-error").textContent = mensaje;
    }
})

tabla.addEventListener("click", (e)=>{
    if(e.target.className == "opciones-eliminar"){
        eliminiarElementoHTML(e); 
        eliminarDatoDelElemento(e.target.parentNode.parentNode.getAttribute("data-numero-id"));
    }
    else if(e.target.className == "opciones-editar"){
        if(e.target.textContent == "Editar" ){
            editar = editarElementoHTML(e.target);
        }
        else{
            editarDatoDelElemento(e.target, editar)
        }
    }
})
 
formularioMedio.addEventListener("click", (e)=>{
    if(e.target.id == "eliminar-ejemplo"){
        e.target.style.animatio = "";
    }
    if(e.target.classList == "botones boton-3"){
        limpiarLista()
    }
    if(e.target.classList == "botones boton-2"){
        formularioValidacionesHTML();
    }
})

// para iniciar con los datos guardados en el localstorage
// DOMContentLoaded evento que es disparado al terminar de cargar el DOM
addEventListener("DOMContentLoaded",()=>{
    mostrarDatosObj();
    mostrarOpciones();
})

//funciones
function formData(){
    let transactionFormData = new FormData(form);
    // console.log(transactionFormData.get("formularioCategoria"));
    let dato = {
    t : transactionFormData.get("formularioTransacion"),
    m : transactionFormData.get("formularioMonto"),
    d : transactionFormData.get("formularioDescripcion"),
    c : transactionFormData.get("formularioCategoria")
    };
    //devuelvo simplificado y el objeto entero
    return [dato,transactionFormData]
}

const agregarTabla =(objeto)=>{
    let comprobadoObjeto = comprobarObjeto(objeto);

    let divContenedor = document.createElement("div");
    divContenedor.classList.add("flexs");
    // agrego el id
    divContenedor.setAttribute("data-numero-id", objeto.id);

    let pTipo = document.createElement("p");
    pTipo.classList.add("flex__items");
    pTipo.textContent = comprobadoObjeto.t;
    
    let pMonto = document.createElement("p");
    pMonto.classList.add("flex__items");
    pMonto.textContent =  comprobadoObjeto.m;

    //agregar totales
    if(comprobadoObjeto.t = "Ingreso" ) agregarTotalPositivo(comprobadoObjeto.m);
    else  agregarTotalNegativo(comprobadoObjeto.m);
    agregarTotal()
    

    let pCategoria = document.createElement("p");
    pCategoria.classList.add("flex__items");
    pCategoria.textContent = comprobadoObjeto.c;

    let pDescripcion = document.createElement("p");
    pDescripcion.classList.add("flex__items");
    pDescripcion.textContent = comprobadoObjeto.d;

    let divOpciones = document.createElement("div");
    let btaOpciones1 = document.createElement("button");
    let btaOpciones2 = document.createElement("button");

    divOpciones.classList.add("flex__items");
    divOpciones.classList.add("opciones");
    btaOpciones1.classList.add("opciones-editar");
    btaOpciones2.classList.add("opciones-eliminar");

    btaOpciones1.textContent = "Editar";
    btaOpciones2.textContent = "Eliminar";

    //
    if(pTipo.textContent == "Tipo") {
        pTipo.classList.add("sin-descripcion");
    }
    if (pMonto.textContent == "Monto") {
        pMonto.classList.add("sin-descripcion")
    }
    if (pCategoria.textContent == "Categoria"){
        pCategoria.classList.add("sin-descripcion")
    }
    if (pDescripcion.textContent == "Descripción"){
        pDescripcion.classList.add("sin-descripcion")
    }

    divOpciones.appendChild(btaOpciones1);
    divOpciones.appendChild(btaOpciones2);

    divContenedor.appendChild(pTipo);
    divContenedor.appendChild(pMonto);
    divContenedor.appendChild(pCategoria);
    divContenedor.appendChild(pDescripcion);
    divContenedor.appendChild(divOpciones);

    return divContenedor
}

//genera un id para cada elemento
const generarID =()=>{
    let lastTransactionId = localStorage.getItem("IdMIAPP") || "-1" ;
    let newTransactionId = JSON.parse(lastTransactionId) + 1 ;
    localStorage.setItem("IdMIAPP", JSON.stringify(newTransactionId));
    return newTransactionId
}

const guardaDatosObj =(objeto)=>{
    objeto.id = generarID();
    let array = localStorage.getItem("DatosMIAPP") || [];
    if(typeof array !== typeof []){
        array = JSON.parse(array);
    }
    array.push(objeto)
    array = JSON.stringify(array);
    localStorage.setItem("DatosMIAPP", array);
}

//comprobar losdatos ingresados y si el dato del objeto(el objeto es casi inesesario) 
const comprobarObjeto =(objeto)=>{
    if (objeto.m == null || objeto.m == undefined || objeto.m == "") objeto.m = "Monto";
    if (objeto.t == null || objeto.t == undefined || objeto.t == "") objeto.t = "Tipo";
    if (objeto.c == null || objeto.c == undefined || objeto.c == "") objeto.c = "Categoria";
    if (objeto.d == null || objeto.d == undefined || objeto.d == "") objeto.d = "Descripción";
    return objeto
}

const mostrarDatosObj =()=>{
    let array = localStorage.getItem("DatosMIAPP");
    array = JSON.parse(array);
    if (array !== null){
        for(let elemento of array){
            let comprobado = comprobarObjeto(elemento)
            let dato = agregarTabla(comprobado);
            tabla.appendChild(dato);
        }
    }
}

const eliminiarElementoHTML =(evento)=>{
    // let asegurar = confirm("¿Deseas eliminar?");
    // if(asegurar){
        // remove() metodo que elimina elemento html
        evento.target.parentNode.parentNode.remove()

    // }
} 
//pasar el id, para eliminar el elemento
const eliminarDatoDelElemento = (elementoID)=>{
    //obtengo los datos de la base de datos
    let array = localStorage.getItem("DatosMIAPP");
    array = JSON.parse(array);
    //busco el indice que voy a eliminar
    let posicion = array.findIndex(elemento => elemento.id == elementoID)
    // lo elimino del array
    array.splice(posicion,1);
    //guardo denuevo los datos
    array = JSON.stringify(array);
    localStorage.setItem("DatosMIAPP", array)

}

const editarElementoHTML =(evento)=>{
    //seleciono a los hijos para editarlos
    let lista = evento.parentNode.parentNode.children;
    //obtego el id para poder identificar caul cambiar
    let id = evento.parentNode.parentNode.getAttribute("data-numero-id");
    for(let i = 0; i < (lista.length -1); i++){
        lista[i].setAttribute("contenteditable","");
        lista[i].style.color = "var(--color-primario)";
        lista[i].style.borderColor = "var(--color-2)";
        }
    //cambio el valor para confirmar elprimer click en guardar
    evento.textContent ="Continuar";

    return id
} 
const editarDatoDelElemento = (evento, elementoId)=>{
    //seleciono a los hijos para editarlos
    let lista = evento.parentNode.parentNode.children;
    //seran los datos para guardar
    let objeto = {};
    for(let i = 0; i < lista.length -1; i++){
        lista[i].removeAttribute("contenteditable");
        //cambiar el color a los que no edito
        if( lista[i].textContent == "Tipo" ||
            lista[i].textContent == "Monto" ||
            lista[i].textContent == "Categoria" ||
            lista[i].textContent == "Descripción"){
            lista[i].style.color = "var(--color-cuarto)";
            lista[i].style.borderColor = "var(--color-tercero)";
            }
        lista[i].style.borderColor = "var(--color-tercero)";
        switch(i){
            case 0:
            objeto.t = lista[i].textContent;
            break
            case 1:
            objeto.m = lista[i].textContent;
            break
            case 2:
            objeto.c = lista[i].textContent;
            break
            case 3:
            objeto.d = lista[i].textContent;
            break
        }
    }      
     //cambio el valor para confirmar elprimer click en guardar
    evento.textContent = "Editar";
    //ya con esto el nuevo objeto esta listo
    objeto.id = elementoId;

    //obtengo los datos de la base de datos
    let array = localStorage.getItem("DatosMIAPP");
    array = JSON.parse(array);
    //busco el indice que voy a eliminar
    let posicion = array.findIndex(elemento => elemento.id == elementoId)
    // lo elimino del array
    array.splice(posicion,1,objeto);
    //guardo denuevo los datos
    array = JSON.stringify(array);
    localStorage.setItem("DatosMIAPP", array)
}

//añadir animacion de eliminacion de todo
const limpiarLista=()=>{
    let asegurar = confirm("¿seguro que deseas eliminar todos?");
    if(asegurar){
        // remove() metodo que elimina elemento html
        localStorage.clear()
        let elementos = document.querySelectorAll(".flexs");
        for(let i = 0; i < elementos.length; i++){
            elementos[i].remove()
        }
    }
}

//activa y desactiva las retricciones del formulario
const formularioValidacionesHTML = ()=>{
    let formulario = document.getElementsByTagName("input");
    if (formulario[0].getAttribute("required") == null){
        for(let elemento of formulario){
            elemento.setAttribute("required","");
            if(elemento.id == "formulario__monto"){    
                elemento.setAttribute("min","1");
            }
        }
        form.setAttribute("data-validacion-activada","activada")
    }
    else{
        for(let elemento of formulario){
        elemento.removeAttribute("required");
        }
        form.removeAttribute("data-validacion-activada")
    }
}
const formularioValidacionesJs = ()=>{
    let mensaje = "todo ok";
    if (form.formularioMonto.value == "" ||
        form.formularioDescripcion.value == "" ||
        form.formularioCategoria.value == "" ||
        form.formularioTransacion.value == ""){
        mensaje = "tienes que rellenar los campos";
    }
    if (form.formularioTransacion.value == "Egreso" && form.formularioMonto.value < 0){
        mensaje = "¿como es quieres ingresar un monto negativo con ingreso?";
    }
    return mensaje
}

const insertarOpciones = categoria =>{
    let selecionElemento = document.getElementById("selecionar-categorias");
    let htmlInsertar = `<option class="${categoria}">${categoria}</option>`
    selecionElemento.insertAdjacentHTML("beforeend", htmlInsertar)
    //guarda la categoria antes de cerrar la etiqueta selecionada
}

const mostrarOpciones = () =>{
    opcionesCategoria.forEach((e)=>{
        insertarOpciones(e)
    })
}

const agregarTotalPositivo = valor =>{
    let num1 = spanTotalPositivo.textContent;
    let num2 = valor;
    let suma = parseInt(num1) + parseInt(num2);
    console.log(suma, typeof suma)
    spanTotalPositivo.textContent = suma;
}
const agregarTotalNegativo = valor =>{
    let num1 = spanTotalNegativo.textContent;
    let num2 = valor;
    let suma = parseInt(num1) + parseInt(num2);
    spanTotalNegativo.textContent = suma;
}
const agregarTotal = () =>{
    let num1 = spanTotal.textContent;
    let num2 = spanTotalPositivo.textContent;
    let num3 = spanTotalNegativo.textContent;
    let suma = parseInt(num1) +  parseInt(num2) - parseInt(num3);
    spanTotal.textContent = suma;
}

//codigo a ejecutar


//añadir total, egreso y ingreso en el ejemplos

//ver comomide los tamaños de los botones

//quitar botaon de activar lavidaciones?