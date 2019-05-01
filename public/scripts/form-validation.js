//  JavaScript for Validation
(function () {
    "use strict";
    window.addEventListener("load", function () {
        var forms = document.querySelectorAll("#form-validation");
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                form.classList.add("was-validated");
                if (form.checkValidity() == false) {
                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
                const checkboxes = form.querySelectorAll("input[type='checkbox']");
                checkboxes.forEach(checkbox => {
                    checkbox.value = checkbox.checked
                    checkbox.checked = true;
                })
            }, false);
        });

    }, false);
}());