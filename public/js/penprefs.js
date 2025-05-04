var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var fill = false;

var currentColor = '#113c38';
var cookie = getCookie("color");
if (cookie) {
    currentColor = cookie;
} else {
    document.cookie = "color=" + currentColor;
}

var joe = colorjoe.rgb("rgbPicker", currentColor, [
    'currentColor',
    ['fields', { space: 'RGB', limit: 255, fix: 2 }],
    'hex',
    'text',
    ['text', { text: 'param demo' }]
]);

document.getElementsByClassName("twod")[0].style.width = "80%";
document.getElementsByClassName("twod")[0].style.aspectRatio = "1/1";
document.getElementsByClassName("twod")[0].style.height = "auto";

joe.on("change", function (color) {
    document.getElementsByClassName("twod")[0].style.width = "80%";
    document.getElementsByClassName("twod")[0].style.aspectRatio = "1/1";
    document.getElementsByClassName("twod")[0].style.height = "auto";

    currentColor = color.css();
    document.cookie = "color=" + currentColor;
});

function setNewColor(event, color) {
    ctx.strokeStyle = color;
    if (fill) {
        ctx.fillStyle = color;
    }
}

function setFill(event) {
    fill = !fill;
}

var currentWidth = 1;
cookie = getCookie("width");
if (cookie) {
    currentWidth = cookie;
    document.getElementById('width-picker').value = currentWidth;
    document.getElementById('width-text').value = currentWidth;
} else {
    document.cookie = "width=" + currentWidth;
}

function setNewSize(event, width) {
    document.getElementById('width-picker').value = width;
    document.getElementById('width-text').value = width;
    ctx.lineWidth = width;
    currentWidth = width;
    document.cookie = "width=" + currentWidth;
}