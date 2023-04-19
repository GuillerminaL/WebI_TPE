"use strict";
//variables formulario
const max = 7;
const min = 1;
const ARRAY_CAMPOS = ["nombre", "apellido", "tel", "email"];
let aleatorio;
let okCaptcha = false;



function funcionFormulario() {
    // muestra div de tipo de conexion
    document.getElementById("conexionSi").addEventListener("click", () => {
        document.getElementById("conectionType").classList.remove("noShow");
    });
    document.getElementById("conexionNo").addEventListener("click", () => {
        document.getElementById("conectionType").classList.add("noShow");
    });

    document.getElementById("btnEnvio").addEventListener("click", validarForm);
    document.getElementById("imgCaptcha").addEventListener("click", creaCaptcha);

}


//--------------------Funcion validar campos--------------------------
function validarCampo(id) {
    let input = document.getElementById(id);
    let error = document.getElementById("error-" + id);
    if (input.value !== "") {
        error.style.display = 'none';
        return true; //como el es distinto a vacio, devuelve verdadero
    } else {
        error.style.display = 'block';
        return false;
    }
}

//----------------- Funcion crear captcha --------------------
function creaCaptcha() {
    aleatorio = Math.floor((Math.random() * (max - min)) + min);
    document.getElementById("imgCaptcha").src = "images/CAPTCHA/imag" + aleatorio + ".png";
}

//--------------- Funcion validar captcha-----------------------
function validacionCaptcha(event) {
    let txtCaptcha = document.getElementById("txtCaptcha");
    let rtaC = document.getElementById("respuestaC");

    if (txtCaptcha.value == aleatorio) {
        okCaptcha = true;
        return true;
    } else {
        rtaC.innerHTML = "Captcha incorrecto, intente nuevamente";
        txtCaptcha.value = "";
        creaCaptcha();
        return false;
    }
}


//--------------------------- Funcion validar formulario----------------
function validarForm(event) {
    event.preventDefault();
    let rtaF = document.getElementById("respuesta");
    let txtCaptcha = document.getElementById("txtCaptcha");

    let error = false; //En ppio, asumo que el formulario es valido
    //Declaro un arreglo como constante para chequear todos los campos a la vez
    for (let i = 0; i < ARRAY_CAMPOS.length; i++) { //Creo una estructura iterativa para chequear el arreglo
        const campoValido = validarCampo(ARRAY_CAMPOS[i]);

        if (!campoValido) {
            error = true;
        }
    }
    if (error) { //Hay errores en los campos del formulario
        window.scrollTo(0, 0);
        rtaF.innerHTML = "Error en los campos completados";
        txtCaptcha.value = "";
        creaCaptcha();
        return false;
    } else { //No hay errores en los campos del formulario
        validacionCaptcha(); //Compruebo captcha
        rtaF.innerHTML = "";
        if (okCaptcha) {
            mostrarMensaje();
            return true;
        }
    }
}


//mostrarMensaje: Si el formulario valida true, desaparece el formulario y aparece un mensaje de agradecimiento. 
function mostrarMensaje() {
    window.scrollTo(0, 0);

    document.getElementsByClassName("formulario")[0].classList.add("noShow");

    let inputNombre = document.getElementById("nombre");
    document.getElementById("gxFormulario").innerHTML = "Gracias por completar la encuesta, " + inputNombre.value + "!";
}