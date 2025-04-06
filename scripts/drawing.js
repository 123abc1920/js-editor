let touching = false;
let drawMode = false;
let square = false;
let ellips = false;
let line = false;
let checkColor = false;
let cover = false;
var mouse = { x: 0, y: 0 };
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("mousedown", function (e) {
    var BB = canvas.getBoundingClientRect();
    mouse.x = parseInt(e.clientX - BB.left);
    mouse.y = parseInt(e.clientY - BB.top);
    drawMode = true;
    ctx.strokeStyle = document.getElementById('color-picker-text').value;
    ctx.lineWidth = document.getElementById('width-picker').value;
    if (fill) {
        ctx.fillStyle = document.getElementById('color-picker-text').value;
    }
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    if (touching) {
        undo.push(new CustomLine(ctx.strokeStyle, ctx.lineWidth));
        redo.length = 0;
    }
    if (square) {
        undo.push(new CustomSquare(mouse.x, mouse.y, ctx.strokeStyle, ctx.lineWidth, fill));
        redo.length = 0;
    }
    if (ellips) {
        redo.length = 0;
    }
    if (line) {
        undo.push(new CustomDirectLine(mouse.x, mouse.y, ctx.strokeStyle, ctx.lineWidth));
        redo.length = 0;
    }
    if (checkColor) {
        var imgData = ctx.getImageData(mouse.x, mouse.y, 1, 1);
        var red = imgData.data[0];
        var green = imgData.data[1];
        var blue = imgData.data[2];
        var alpha = imgData.data[3];
        var color = "rgb(" + red + ", " + green + ", " + blue + ")";
        var colorAlpha = "rgb(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
        $('#color-picker-text').val(color).colorpicker('setValue', color);
        $('.input-group-addon').css('background-color', color);
        ctx.strokeStyle = colorAlpha;
    }
    if (cover) {
        var imgData = ctx.getImageData(mouse.x, mouse.y, 1, 1);
        var red = imgData.data[0];
        var green = imgData.data[1];
        var blue = imgData.data[2];
        var coverObj = new CustomCover(ctx.strokeStyle, ctx.lineWidth);
        var dfs = new DFS(red, green, blue, coverObj, canvas.width, canvas.height);
        dfs.dfs(mouse.x, mouse.y, ctx);
        undo.push(coverObj);
    }
});

canvas.addEventListener("mousemove", function (e) {
    if (drawMode) {
        if (touching) {
            var BB = canvas.getBoundingClientRect();
            mouse.x = parseInt(e.clientX - BB.left);
            mouse.y = parseInt(e.clientY - BB.top);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            undo[undo.length - 1].addDot(mouse.x, mouse.y);
        }
    }
});

canvas.addEventListener("mouseup", function (e) {
    oldx = mouse.x;
    oldy = mouse.y;
    var BB = canvas.getBoundingClientRect();
    mouse.x = parseInt(e.clientX - BB.left);
    mouse.y = parseInt(e.clientY - BB.top);
    if (drawMode) {
        if (touching) {
            ctx.lineTo(mouse.x, mouse.y);
            undo[undo.length - 1].addDot(mouse.x, mouse.y);
        }
        if (square) {
            undo[undo.length - 1].setSize(mouse.x - oldx, mouse.y - oldy);
        }
        if (ellips) {
            var rx = Math.abs(mouse.x - oldx);
            var ry = Math.abs(mouse.y - oldy);
            undo.push(new CustomCircle(oldx + rx / 2, oldy + ry / 2, ctx.strokeStyle, ctx.lineWidth, fill));
            undo[undo.length - 1].setSize(rx, ry);
        }
        if (line) {
            undo[undo.length - 1].setFinish(mouse.x, mouse.y);
        }
    }
    drawMode = false;
    repaint();
});

function startDraw(event) {
    touching = !touching;
    ellips = false;
    line = false;
    square = false;
    checkColor = false;
    cover = false;
}

function drawSquare(event) {
    square = !square;
    touching = false;
    ellips = false;
    line = false;
    checkColor = false;
    cover = false;
}

function drawEllips(event) {
    ellips = !ellips;
    touching = false;
    line = false;
    square = false;
    checkColor = false;
    cover = false;
}

function drawLine(event) {
    line = !line;
    ellips = false;
    square = false;
    touching = false;
    checkColor = false;
    cover = false;
}

function startCheckColor(event) {
    checkColor = !checkColor;
    line = false;
    ellips = false;
    square = false;
    touching = false;
    cover = false;
}

function startCover(event) {
    cover = !cover;
    checkColor = false;
    line = false;
    ellips = false;
    square = false;
    touching = false;
}

function repaint() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img != null) {
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    }
    for (const item of undo) {
        item.drawObject(ctx);
    }
}