"use strict"

const url = `https://60caa42721337e0017e42bf9.mockapi.io/api/cronograma`;

let tbCrono; 
let filtrando = false;
let creando = false;
let valoresFiltrados = []

valoresFiltrados = {
    "fecha": "",
    "modulo": "",
    "tema": "",
    "trabajoPractico": "-",
};


function funcionalidadTabla() {

    document.querySelector("#agregar").addEventListener("click", (e) => formCrear(e));
    document.querySelector("#filtrar").addEventListener("click", (e) => formFiltrar(e));

    document.querySelector("#btnSend").addEventListener("click", (e) => enviarDatos(e, 1));
    document.querySelector("#btnSendx3").addEventListener("click", (e) => enviarDatos(e, 3));
    document.querySelector("#btnNoEnviar").addEventListener("click", function(e) {
        e.preventDefault();
        creando = true;
        formCrear(e);
    });

    document.querySelector("#btnFiltrar").addEventListener("click", (e) => filtrar(e));
    document.querySelector("#btnNoFiltrar").addEventListener("click", function(e) {
        e.preventDefault();
        filtrando = true;
        formFiltrar(e);
    });

    tbCrono = document.querySelector('.tabla')
    mostrarTabla();

}


//---------------------------------------- MOSTRAR TABLA -  GET     -----------------------------------//
function mostrarTabla() {
    mostrarEncabezado();
    crearFilas();
}

function crearCelda(tipoCelda, encabezado, resaltar, noWrap) {
    let celda = document.createElement(tipoCelda);
    celda.appendChild(document.createTextNode(encabezado));
    if (resaltar) {
        celda.classList.add("resaltar");
    }
    if (noWrap == 1) {
        celda.classList.add("noWrap");
    }
    return celda;
}

function mostrarEncabezado() {

    tbCrono.innerHTML = "";

    let tr = document.createElement("tr");              
    tr.appendChild(crearCelda("th", "CLASE"));
    tr.appendChild(crearCelda("th", "FECHA", false, 1));
    tr.appendChild(crearCelda("th", "MODULO"));
    tr.appendChild(crearCelda("th", "TEMA"));
    tr.appendChild(crearCelda("th", "TP"));

    tbCrono.appendChild(tr);

}

async function crearFilas(tabla) {         //Obtiene los datos de Rest y crea las filas

    let cronograma = await obtenerDatos();

    for (let i = 0; i < cronograma.length; i++) {

        if ((comprobarFiltro(cronograma[i]) == true) || (filtrando == false)) {

            let tr = document.createElement("tr");
            tr.id = `cronograma-${cronograma[i].clase}`; //identifica a la fila

            let resaltar = cronograma[i].tp;

            tr.appendChild(crearCelda("td", cronograma[i].clase, resaltar));
            tr.appendChild(crearCelda("td", cronograma[i].fecha, resaltar, 1));
            tr.appendChild(crearCelda("td", cronograma[i].modulo, resaltar));
            tr.appendChild(crearCelda("td", cronograma[i].tema, resaltar));
            if ((cronograma[i].tp)) {
                tr.appendChild(crearCelda("td", "SI", resaltar));
            } else {
                tr.appendChild(crearCelda("td", "NO", resaltar));
            }

            const botonEliminar = crearBoton("trash", () => borrarFila(cronograma[i].clase));
            const botonEditar = crearBoton("editar", () => editarFila(cronograma[i].clase));

            const celdaCanviar = crearCelda("td", '', false, 1);
            celdaCanviar.appendChild(botonEliminar);
            celdaCanviar.appendChild(botonEditar);
            tr.appendChild(celdaCanviar);

            celdaCanviar.classList.add("celda-btn-tabla");

            tbCrono.appendChild(tr);
        }
    }
}

function crearBoton(tipo, funcion) {
    const boton = document.createElement('button');
    boton.innerHTML = '<img class="btn-tabla" src="images/BOTONES/' + tipo + '.png" alt="' + tipo + '">';
    boton.addEventListener('click', funcion);
    return boton;
}

//----------------------------------  GET -----------------------------------//
async function obtenerDatos() {
    try {
        let res = await fetch(url);
        let json = await res.json();
        return json;
    } catch (error) {
        console.log(error);
        return [];
    }
}

//----------------------------------  POST -----------------------------------//
async function enviarDatos(e, j) {
    e.preventDefault();

    try {
   
        let clase = {
            "fecha": document.querySelector("#fecha").value,
            "modulo": document.querySelector("#modulo").value,
            "tema": document.querySelector("#tema").value,
            "tp": document.querySelector(".tp").checked,
        }

        for (let index = 0; index < j; index++) {
            let res = await fetch(url, {
                "method": "POST",
                "headers": { "Content-type": "application/json" },
                "body": JSON.stringify(clase),
            });
            res = res;
        }
       
        muestraRespuesta("Los datos han sido enviados!");
        muestraBtnsCrear("add");
        muestraBtnsFiltrar("add");
        document.querySelector(".seccionformulario").classList.add("noShow");
        mostrarTabla();   

    } catch (error) {
        console.log(error);
    }
}

//------------------------------------  DELETE -----------------------------------------//
async function borrarFila(clase) {
    try {

        if (window.confirm("¿Realmente quiere eliminar la clase?")) { 

            let res = await fetch(`${url}/${clase}`, {
                "method": "DELETE",
            });

            const fila = document.querySelector(`#cronograma-${clase}`);
            fila.remove();

            if (res.status == 200) { 
                muestraRespuesta(`La clase ${clase} ha sido eliminada!`);
             }

        }
    } catch (error) {
        console.log(error);
    }
}

function muestraRespuesta(texto){

    let cuadroMsg = document.querySelector("#msg");
    cuadroMsg.classList.remove("noShow");
    cuadroMsg.innerHTML = `<p>${texto}</p>`;
    setTimeout(function(){cuadroMsg.classList.add("noShow");}, 3000);

}


//---------------------------   EDITAR (PUT)  --------------------------//
async function enviarEdicion(e, id) {
    e.preventDefault();
    try {

        let tp = document.querySelector("#Etp").value;
        console.log(tp);
        if (tp == "Si") {
            tp = true;
        } else {
            tp = false;
        }
        let clase = {
            "fecha": document.querySelector("#Efecha").value,
            "modulo": document.querySelector("#Emodulo").value,
            "tema": document.querySelector("#Etema").value,
            "tp": tp,
        }

        let res = await fetch(`${url}/${id}`, {
            "method": "PUT",
            "headers": { "Content-type": "application/json" },
            "body": JSON.stringify(clase),
        });

        if (res.status == 200) {
            muestraRespuesta(`La clase ${id} ha sido modificada!`);
        }
    } catch (error) {
        console.log(error);
    }

    muestraBtnsCrear("add");
    muestraBtnsFiltrar("add");
    document.querySelector(".seccionformulario").classList.add("noShow");

    mostrarTabla();
    editando = false;

}

let editando = false;

/*-------------------------------- modifico -----------------------------*/


function templateEdicion(leccion, fecha, modulo, tema, tp) {
    return `
        <td>${leccion}</td>
        <td><input class="date" type="date" name="fecha" id="Efecha" value="${fecha}"></td>
        <td><input class="number" type="number" name="modulo" id="Emodulo" min=1 value="${modulo}"></td>
        <td><input class="text" type="text" name="temario" id="Etema" value="${tema}"></td>
        <td><select name="tp" id="Etp">
                <option ${tp === 'SI' ? 'selected="selected"' : ''} value="Si">Si</option>
                <option ${tp === 'NO' ? 'selected="selected"' : ''} value="No">No</option>
            </select>
        </td>
        <td class="celda-btn-tabla noWrap">
            <button id="btn-enviarEdicion">
            <img src="images/BOTONES/aceptar.png" alt="Aceptar" class="btn-tabla">
            </button>
            <button id="btn-anularEdicion">
            <img src="images/BOTONES/cancelar.png" alt="Cancelar" class="btn-tabla">
            </button>
        </td>
        `
} 

function editarFila(clase) {
    
    if (editando == false) {

        //recorre la fila y toma el texto de cada celda
        let nodoTr = document.querySelector(`#cronograma-${clase}`);
        let nodosEnTr = nodoTr.getElementsByTagName('td');
        let leccion = nodosEnTr[0].textContent;
        let fecha = nodosEnTr[1].textContent;
        let modulo = nodosEnTr[2].textContent;
        let tema = nodosEnTr[3].textContent;
        let tp = nodosEnTr[4].textContent;

        nodoTr.innerHTML = templateEdicion(leccion, fecha, modulo, tema, tp);

        document.querySelector("#btn-anularEdicion").addEventListener("click", anularEdicion);
        document.querySelector("#btn-enviarEdicion").addEventListener("click", (e) => enviarEdicion(e, clase));

        editando = "true";

    } else {

        alert('Solo se puede editar de a una fila. Pulse Aceptar para guardar los cambios o Cancelar para salir de la edición.');

    }
}

function anularEdicion() {   
    editando = false;
    mostrarTabla();
}


/*-------------------------------- FILTRAR --------------------------------------------------*/
function comprobarFiltro(i) { //Compara JSON con valoresFiltrados
    if ((valoresFiltrados.fecha == "") || (valoresFiltrados.fecha == i.fecha)) {
        if ((valoresFiltrados.modulo == "") || (valoresFiltrados.modulo == i.modulo)) {
            if ((valoresFiltrados.tema == "") || (valoresFiltrados.tema == i.tema)) {
                if (valoresFiltrados.trabajoPractico == "-") {
                    return true
                } else if (valoresFiltrados.trabajoPractico == i.tp) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function filtrar(e) {          //click en FILTRAR, toma valoresFiltrados desde form y muestra tabla
    e.preventDefault();

    let form = document.querySelector("#formCrono");
    let formData = new FormData(form);

    //-------una opcion/**/
    let fecha = formData.get('fecha');
    let modulo = formData.get('modulo');
    let tema = formData.get('temario');
    let tp = formData.get('tp');
    if (tp == "si") {
        tp = true;
    } else if (tp == "no") {
        tp = false;
    } else {
        tp = "-";
    }
    valoresFiltrados = {
        "fecha": fecha,
        "modulo": modulo,
        "tema": tema,
        "trabajoPractico": tp,
    };

    muestraBtnsCrear("add");
    muestraBtnsFiltrar("add");
    document.querySelector(".seccionformulario").classList.add("noShow");
    mostrarTabla();

}



function formCrear(e) {
    e.preventDefault();
    if (creando == false) {
        muestraBtnsCrear("remove");
        muestraBtnsFiltrar("add");
        document.querySelector(".seccionformulario").classList.remove("noShow");
        creando = true;
        filtrando = false;
    } else {
        muestraBtnsCrear("add");
        muestraBtnsFiltrar("add");
        document.querySelector(".seccionformulario").classList.add("noShow");
        creando = false;
        filtrando = false;

    }
}


function formFiltrar(e) {
    e.preventDefault();
    if (filtrando == false) {
        muestraBtnsCrear("add");
        muestraBtnsFiltrar("remove");
        document.querySelector(".seccionformulario").classList.remove("noShow");
        filtrando = true;
        creando = false;
    } else {
        muestraBtnsCrear("add");
        muestraBtnsFiltrar("add");
        document.querySelector(".seccionformulario").classList.add("noShow");
        filtrando = false;
        creando = false;
    }
}

function cancelaFiltro(e) {
    e.preventDefault();
    muestraBtnsCrear("add");
    muestraBtnsFiltrar("add");
    document.querySelector(".seccionformulario").classList.remove("noShow");

    valoresFiltrados[0] = {
        "fecha": "",
        "modulo": "",
        "tema": "",
        "trabajoPractico": "-",
    };
    creando = false;
    filtrando = false;
    mostrarTabla();

}

function muestraBtnsCrear(muestra) {
    if (muestra == "add") {
        document.querySelector("#btnSend").classList.add("noShow");
        document.querySelector("#btnSendx3").classList.add("noShow");
        document.querySelector("#btnNoEnviar").classList.add("noShow");


    } else {
        document.querySelector("#btnSend").classList.remove("noShow");
        document.querySelector("#btnSendx3").classList.remove("noShow");
        document.querySelector("#btnNoEnviar").classList.remove("noShow");
        document.querySelector("#TPfiltro").classList.remove("item-form-radio");
        document.querySelector("#TPfiltro").classList.add("noShow");

    }
}

function muestraBtnsFiltrar(muestra) {
    if (muestra == "add") {
        document.querySelector("#btnFiltrar").classList.add("noShow");
        document.querySelector("#btnNoFiltrar").classList.add("noShow");
        document.querySelector("#TPfiltro").classList.add("noShow");
        document.querySelector("#TPfiltro").classList.remove("item-form-radio");
        document.querySelector("#TPfiltro").classList.remove("item-form-radio");


    } else {
        document.querySelector("#btnFiltrar").classList.remove("noShow");
        document.querySelector("#btnNoFiltrar").classList.remove("noShow");
        document.querySelector("#TPfiltro").classList.remove("noShow");
        document.querySelector("#TPfiltro").classList.add("item-form-radio");

    }
}