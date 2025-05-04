var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var fill = false;

var joe = colorjoe.rgb("rgbPicker", '#113c38', [
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
    console.log("Selecting " + color.css());
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

function setNewSize(event, width) {
    document.getElementById('width-picker').value = width;
    document.getElementById('width-text').value = width;
    ctx.lineWidth = width;
}