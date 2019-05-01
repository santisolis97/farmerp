// en ms
let mostrarDurante = 10 * 1000;
const delayActualizacion = 10;

// Descontar();

document.addEventListener('DOMContentLoaded', function () {
    jQuery($ => {
        $(".mensaje_timer").animate({
            width: "0%"
        }, {
            duration: mostrarDurante,
            easing: "linear",
            complete() {
                $(this).parent().parent().fadeTo(500, 0).slideUp(500, function () {
                    $(this).remove()
                });
            }
        })
    })
}, false);

function RemoveAlert(elem) {
    jQuery($ => {
        const id = typeof elem == 'string' ? elem : elem.parentElement.id;
        $("#" + id).fadeTo(500, 0).slideUp(500, function () {
            $(this).remove()
        });
    })
}