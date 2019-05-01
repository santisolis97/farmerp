// Si hay una alerta no ocultar la barra de login
const overlay = document.querySelector('#home-overlay');
if (!document.querySelector('.alert')) {
    document.querySelector('.navbar').setAttribute('style', "opacity:0;");
    overlay.classList.remove('d-none');
    overlay.addEventListener('click', showNavbar)
}

function showNavbar() {
    jQuery($ => {
        $('.navbar').fadeTo(500, 1);
        overlay.classList.add('d-none');
    })
}