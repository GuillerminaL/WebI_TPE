"use strict"

//--------------------------JSON precargado
let cronograma = [
    {
        "fecha": "2021-03-25",
        "modulo": 1,
        "tema": "voluptates dolorum culpa itaque voluptatem aperiam nemo alias harum corporis",
        "trabajoPractico": "si",
    },{
        "fecha": "2021-04-01",
        "modulo": 2,
        "tema": "explicabo error fugiat blanditiis expedita",
        "trabajoPractico": "no",
    },{
        "fecha": "2021-04-25",
        "modulo": 3,
        "tema": "Neque voluptas reiciendis mollitia, dolores quod, eaque explicabo",
        "trabajoPractico": "si",
    }
];

mostrarTabla();




// BOTON eliminar
document.querySelector("#eliminar").addEventListener("click", function (event) {
    event.preventDefault();
    cronograma = [];
    mostrarTabla();
});


// BOTONES + publicar
document.querySelector("#btnSend").addEventListener("click", () => publicar(1));
document.querySelector("#btnSendx3").addEventListener("click", () => publicar(3));

function publicar(j) {
    event.preventDefault();
    agregarLinea(j); //paso la cantidad de lineas iguales que crear
    mostrarTabla();
}


// TOMAR INPUT CREAR LINEAS
let form = document.querySelector("#formCrono");
function agregarLinea(i) {
    let formData = new FormData(form);
    let dateInp = formData.get('fecha');
    let mod = formData.get('modulo');
    let tema = formData.get('temario');
    let tp = formData.get('tp');

    for (let index = 0; index < i; index++) {
        let temaX = {
            "fecha": dateInp,
            "modulo": mod,
            "tema": tema,
            "trabajoPractico": tp,
        };
        cronograma.push(temaX);
    }
    //dateInp = "";
    //tema= "";
    //tp.checked = true;
}




//-----------------MOSTRAR TABLA
function mostrarTabla() {
    let tbCrono = document.querySelector('.tabla');
    tbCrono.innerHTML = "";

    let tr = document.createElement("tr");
    tr.appendChild(crearCelda("th", "FECHA", false, 1));
    tr.appendChild(crearCelda("th", "MODULO"));
    tr.appendChild(crearCelda("th", "TEMA"));
    tr.appendChild(crearCelda("th", "TP"));
    tbCrono.appendChild(tr);

    for (let i = 0; i < cronograma.length; i++) {
        let tr = document.createElement("tr");
        let resaltar;
        if ((cronograma[i].trabajoPractico) == "si") {
            resaltar = true;
        } else {
            resaltar = false;
        }

        tr.appendChild(crearCelda("td", cronograma[i].fecha, resaltar, 1));
        tr.appendChild(crearCelda("td", cronograma[i].modulo, resaltar));
        tr.appendChild(crearCelda("td", cronograma[i].tema, resaltar));
        if ((cronograma[i].trabajoPractico) == "si") {
            tr.appendChild(crearCelda("td", "SI", resaltar));
        }
        else {
            tr.appendChild(crearCelda("td","NO", resaltar));
        }

        tbCrono.appendChild(tr);
    }
}

function crearCelda(tipoCelda, encabezado, resaltar, primerColumna) {
    let celda = document.createElement(tipoCelda);
    celda.appendChild(document.createTextNode(encabezado));
    if (resaltar) {
        celda.classList.add("resaltar");
    }
    if (primerColumna == 1) {
        celda.classList.add("noWrap");
    }
    return celda;
}


