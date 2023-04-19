"use strict"

/*--------------------------- MENU RESPONSIVE -------------------------------*/

let btnMenu = document.querySelector(".btn_menu");
btnMenu.addEventListener("click", toggle);

function toggle() {
    document.querySelector(".navegador").classList.toggle("show");
}

/*--------------------------------------------------------------------------*/