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
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
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
    if (undo.length > 50) {
        undo.shift();
    }
});

canvas.addEventListener("mousemove", function (e) {
    if (drawMode) {
        if (touching) {
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            undo[undo.length - 1].addDot(mouse.x, mouse.y);
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
            undo[undo.length - 1].addDot(mouse.x, mouse.y);
        }
        if (square) {
            var rectangle = new Path2D();
            rectangle.rect(oldx, oldy, mouse.x - oldx, mouse.y - oldy);
            ctx.stroke(rectangle);
            if (fill) {
                ctx.fill(rectangle);
            }
            undo[undo.length - 1].setSize(mouse.x - oldx, mouse.y - oldy);
        }
        if (ellips) {
            var circle = new Path2D();
            r = Math.abs(mouse.x - oldx);
            circle.arc(oldx + 0.5 * r, oldy + 0.5 * r, r, 0, 2 * Math.PI);
            ctx.stroke(circle);
            undo.push(new CustomCircle(oldx + 0.5 * r, oldy + 0.5 * r, ctx.strokeStyle, ctx.lineWidth, fill));
            undo[undo.length - 1].setSize(r, r);
        }
        if (line) {
            ctx.moveTo(oldx, oldy);
            ctx.lineTo(mouse.x, mouse.y);
            undo[undo.length - 1].setFinish(mouse.x, mouse.y);
        }
    }
    drawMode = false;
    ctx.stroke();
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