"use strict";

cargaEspecifica("", "nav").then(() => {        //Termino de cargar nav, entonces seteo eventos del navegador
    document.querySelector(".btn_menu").addEventListener("click", () => //listener para desplegar el navegador
        document.querySelector(".navegador").classList.toggle("show")
    );
    const itemsMenu = document.querySelectorAll('.boton-nav'); // atribuyo evento click a cada item del navegador
    itemsMenu.forEach((item) => item.addEventListener('click', e => push(e)));
});

cargaEspecifica("", "footer");


function cargarInicio() {                       //nos permite refrescar
    const urlActual = window.location.href;
    const partesUrl = urlActual.split('#');    //divide la url -string- con separadores # y nos devuelve un array
    if ( partesUrl.length > 0 && partesUrl[1] && partesUrl[1] != '') { // si hay algo despues del # y es distinto de vacío, cargo ese algo
        cargaEspecifica(partesUrl[1], "section");
        cargaEspecifica(partesUrl[1], "aside");
    } else { // si no hay nada, voy a la home
        cargaEspecifica('home', "section");
        cargaEspecifica('home', "aside");
    }
}

cargarInicio();


function push(event) {

    let id = event.target.id;
    console.log(id);

    //----------------------------
    //una vez que se elije, se quita el nav y queda solo el icono
    document.querySelector(".navegador").classList.toggle("show");


    //----------------------------
    //cambia titulo de la pestaña
    if (id == "home") {
        document.title = "Home";
    } else if (id == "primeranio") {
        document.title = "PLG - 1ro";
    } else if (id == "encuesta") {
        document.title = "Encuesta";
    }
    //----------------------------

    //----------------------------
    //carga contenido del main
    cargaEspecifica(id, "section");
    cargaEspecifica(id, "aside");
    //----------------------------

    //cambia historial para poder ir atras
    window.history.pushState({ id }, +`${id}`, `#${id}`); 
}

async function cargaEspecifica(pag, seccion) {
    let container = document.querySelector("#" + seccion);
    container.innerHTML = "";
    try {
        let response = await fetch(`html/${pag}${seccion}.html`);

        if (response.ok) {

            if ((pag == "encuesta") && (seccion == "section")) {
                let content = await response.text();
                cargaFormulario(content);
            } else if ((pag == "primeranio") && (seccion == "section")) {
                response.text().then(t => (cargaTabla(t)));
            } else {
                let content = await response.text();
                container.innerHTML = content;
            }
        } else {
            container.innerHTML = "Error loading for /" + pag + seccion + "...";
        }
    } catch (error) {
        container.innerHTML = "Error";
    }
}


window.addEventListener("popstate", (event) => {
    
    let stateId = event.state.id;             //Graba historial ID
    console.log("popstate: " + stateId);
    
    cargaEspecifica(stateId, "section");     //carga contenido de /page
    cargaEspecifica(stateId, "aside");
    
});


function cargaFormulario(t) {
    let container = document.querySelector("#section");
    container.innerHTML = t;

    funcionFormulario();
}


function cargaTabla(j) {
    let container = document.querySelector("#section");
    container.innerHTML = j;

    funcionalidadTabla();
}
