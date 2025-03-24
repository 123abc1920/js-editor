let touching = false;
let drawMode = false;
let square = false;
let ellips = false;
let line = false;
var mouse = { x: 0, y: 0 };
var canvas = document.getElementById("canvas");

canvas.addEventListener("mousedown", function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    drawMode = true;
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
});

canvas.addEventListener("mousemove", function (e) {
    if (drawMode) {
        if (touching) {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
});

canvas.addEventListener("mouseup", function (e) {
    oldx = mouse.x;
    oldy = mouse.y;
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    if (drawMode) {
        if (touching) {
            ctx.lineTo(mouse.x, mouse.y);
        }
        if (square) {
            var rectangle = new Path2D();
            rectangle.rect(oldx, oldy, mouse.x - oldx, mouse.y - oldy);
            ctx.stroke(rectangle);
        }
        if (ellips) {
            var circle = new Path2D();
            r = Math.abs(mouse.x - oldx);
            circle.arc(oldx + 0.5 * r, oldy + 0.5 * r, r, 0, 2 * Math.PI);
            ctx.stroke(circle);
        }
        if (line) {
            ctx.moveTo(oldx, oldy);
            ctx.lineTo(mouse.x, mouse.y);
        }
    }
    drawMode = false;
    ctx.stroke();
});

function startDraw(event) {
    touching = !touching;
    ellips = false;
    line = false;
    square = false;
}

function drawSquare(event) {
    square = !square;
    touching = false;
    ellips = false;
    line = false;
}

function drawEllips(event) {
    ellips = !ellips;
    touching = false;
    line = false;
    square = false;
}

function drawLine(event) {
    line = !line;
    ellips = false;
    square = false;

}