var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var fill = false;

$(document).ready(function () {
    $('#color-picker').colorpicker({
        inline: true,
        container: true
    });
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