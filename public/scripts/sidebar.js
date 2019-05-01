let path = document.location.pathname;

let lis = document.querySelectorAll("aside #main-menu li");
lis.forEach(function (li) {
    var a = li.querySelector("a");
    if (a) {
        var href = a.attributes["href"].value;
        if (path.startsWith(href)) {
            li.classList.add("active");
            var parent = li.parentElement;
            if (parent && parent.classList.contains('sub-menu')) {
                var parent2 = parent.parentElement;
                if (parent2 && parent2.classList.contains('menu-item-has-children')) {
                    parent.classList.add('show');
                    parent2.classList.add('show');
                }
            }
        } else {
            li.classList.remove("active");
        }
    }
});

let addView = document.querySelectorAll("aside #main-menu li .add-view");
addView.forEach(function (a) {
    a.attributes["href"].value = a.attributes["href"].value.replace(":view", path);
});