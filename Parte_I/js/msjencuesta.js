"use strict";

const max = 7;
const min = 1;
const ARRAY_CAMPOS = ["nombre", "apellido", "tel", "email"];
let aleatorio;
let okCaptcha = false;

//--------------------- Funcion radio ¿Posee conexion? -------------------------------
//         Si-->despliega checkbox ¿de qué tipo?  No --> No despliega ckechbox

let conexionSi = document.getElementById("conexionSi");
conexionSi.addEventListener("click", conexionSiClick);

let conexionNo = document.getElementById("conexionNo");
conexionNo.addEventListener("click", conexionNoClick);

function conexionSiClick() {
    let elemTipoConexion = document.getElementById("conectionType");
    elemTipoConexion.classList.remove("noShow");
}

function conexionNoClick() {
    let elemTipoConexion = document.getElementById("conectionType");
    elemTipoConexion.classList.add("noShow");
}


/*--------------------Funcion validar campos--------------------------
 */

function validarCampo(id) {
    let input = document.getElementById(id);
    let error = document.getElementById("error-" + id);
    if (input.value !== "") {
        error.style.display = 'none';
        return true;                         //como el es distinto a vacio, devuelve verdadero
    } else {
        error.style.display = 'block';
        return false;
    }
}

/*----------------- Funcion crear captcha --------------------
*/

let imgCaptcha = document.getElementById("imgCaptcha");
imgCaptcha.addEventListener("click", creaCaptcha);

function creaCaptcha() {
    console.log("creado");
    aleatorio = Math.floor((Math.random() * (max - min)) + min);
    document.getElementById("imgCaptcha").src = "images/CAPTCHA/imag" + aleatorio + ".png";
}

/*--------------- Funcion validar captcha-----------------------
*/

let txtCaptcha = document.getElementById("txtCaptcha");
let rtaC = document.getElementById("respuestaC");
function validacionCaptcha(event) {
    console.log("el texto enviado es: " + txtCaptcha.value);
    if (txtCaptcha.value == aleatorio) {
        okCaptcha = true;
        return true;
    }
    else {
        rtaC.innerHTML = "Captcha incorrecto, intente nuevamente";
        txtCaptcha.value = "";
        creaCaptcha();
        return false;
    }
}


/*--------------------------- Funcion validar formulario----------------
*/

let btnEnvio = document.getElementById("btnEnvio");
btnEnvio.addEventListener("click", validarForm);

let rtaF = document.getElementById("respuesta");

function validarForm(event) {
    event.preventDefault();
    let error = false;  //En ppio, asumo que el formulario es valido
    //Declaro un arreglo como constante para chequear todos los campos a la vez
    for (let i = 0; i < ARRAY_CAMPOS.length; i++) {  //Creo una estructura iterativa para chequear el arreglo
        const campoValido = validarCampo(ARRAY_CAMPOS[i]);

        if (!campoValido) {
            error = true;
        }
    }
    if (error) {                //Hay errores en los campos del formulario
        window.scrollTo(0, 0);
        rtaF.innerHTML = "Error en los campos completados";
        txtCaptcha.value = "";
        creaCaptcha();
        return false;
    }
    else {                      //No hay errores en los campos del formulario
        validacionCaptcha();    //Compruebo captcha
        rtaF.innerHTML = "";
        if (okCaptcha) {
            mostrarMensaje();
            return true;
        }
    }
}


/*
 * @mostrarMensaje: Si el formulario valida true, desaparece el formulario 
 * y aparece un mensaje de agradecimiento. */
function mostrarMensaje() {
    window.scrollTo(0, 0);

    let showForm = document.getElementsByClassName("formulario");
    showForm[0].classList.add("noShow");

    let inputNombre = document.getElementById("nombre");
    let mostrarMensaje = document.getElementById("gxFormulario");
    mostrarMensaje.innerHTML = "Gracias por completar la encuesta, " + inputNombre.value + "!";
}
