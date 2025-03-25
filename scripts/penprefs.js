var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

$(document).ready(function () {
    $('#color-picker').colorpicker({
        inline: true,
        container: true
    });
});

function setNewColor(event, color) {
    ctx.strokeStyle = color;
}

function setNewSize(event, width) {
    ctx.lineWidth = width;
}