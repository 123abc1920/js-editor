function getCookie(name) {
    const fullCookieString = '; ' + document.cookie;
    const splitCookie = fullCookieString.split('; ' + name + '=');
    return splitCookie.length === 2 ? splitCookie.pop().split(';').shift() : null;
}

function resetColors() {
    document.getElementById("pen").classList.remove("selected-btns");
    document.getElementById("square").classList.remove("selected-btns");
    document.getElementById("circle").classList.remove("selected-btns");
    document.getElementById("line").classList.remove("selected-btns");
    document.getElementById("pipette").classList.remove("selected-btns");
    document.getElementById("fill").classList.remove("selected-btns");

    if (touching) {
        document.getElementById("pen").classList.add("selected-btns");
    }
    if (square) {
        document.getElementById("square").classList.add("selected-btns");
    }
    if (ellips) {
        document.getElementById("circle").classList.add("selected-btns");
    }
    if (line) {
        document.getElementById("line").classList.add("selected-btns");
    }
    if (checkColor) {
        document.getElementById("pipette").classList.add("selected-btns");
    }
    if (cover) {
        document.getElementById("fill").classList.add("selected-btns");
    }
}

function resetBrushes(selected) {
    let brushes = document.getElementsByClassName("brush");
    for (let i = 0; i < brushes.length; i++) {
        brushes[i].classList.remove("selected-btns");
    }

    brushes[selected].classList.add("selected-btns");
}