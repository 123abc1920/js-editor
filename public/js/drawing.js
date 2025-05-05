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

var tool = getCookie("tool");
if (tool == "touching") {
    touching = true;
}
if (tool == "square") {
    square = true;
}
if (tool == "ellips") {
    ellips = true;
}
if (tool == "line") {
    line = true;
}
if (tool == "checkColor") {
    checkColor = true;
}
if (tool == "cover") {
    cover = true;
}
resetColors();

canvas.addEventListener("mousedown", function (e) {
    if (imgHere) {
        var BB = canvas.getBoundingClientRect();
        mouse.x = parseInt(e.clientX - BB.left);
        mouse.y = parseInt(e.clientY - BB.top);
        drawMode = true;
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth;
        if (fill) {
            ctx.fillStyle = currentColor;
        }
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        if (touching) {
            undo.push(new CustomLine(ctx.strokeStyle, ctx.lineWidth, currentBrush));
            redo.length = 0;
        }
        if (square) {
            undo.push(new CustomSquare(mouse.x, mouse.y, ctx.strokeStyle, ctx.lineWidth, fill, currentBrush));
            redo.length = 0;
        }
        if (ellips) {
            redo.length = 0;
        }
        if (line) {
            undo.push(new CustomDirectLine(mouse.x, mouse.y, ctx.strokeStyle, ctx.lineWidth, currentBrush));
            redo.length = 0;
        }
        if (checkColor) {
            var imgData = ctx.getImageData(mouse.x, mouse.y, 1, 1);
            var red = imgData.data[0];
            var green = imgData.data[1];
            var blue = imgData.data[2];
            var alpha = imgData.data[3];
            var color = "rgb(" + red + ", " + green + ", " + blue + ")";
            joe.set(color);
            ctx.strokeStyle = color;
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
    }
});

canvas.addEventListener("mousemove", function (e) {
    if (imgHere) {
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
    }
});

canvas.addEventListener("mouseup", function (e) {
    if (imgHere) {
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
                undo.push(new CustomCircle(oldx + rx / 2, oldy + ry / 2, ctx.strokeStyle, ctx.lineWidth, fill, currentBrush));
                undo[undo.length - 1].setSize(rx, ry);
            }
            if (line) {
                undo[undo.length - 1].setFinish(mouse.x, mouse.y);
            }
        }
        drawMode = false;
        repaint();
    }
});

function setTools() {
    if (touching) {
        document.cookie = "tool=touching";
    }
    if (square) {
        document.cookie = "tool=square";
    }
    if (ellips) {
        document.cookie = "tool=ellips";
    }
    if (line) {
        document.cookie = "tool=line";
    }
    if (checkColor) {
        document.cookie = "tool=checkColor";
    }
    if (cover) {
        document.cookie = "tool=cover";
    }
}

function startDraw(event) {
    touching = !touching;
    ellips = false;
    line = false;
    square = false;
    checkColor = false;
    cover = false;
    setTools();
    resetColors();
}

function drawSquare(event) {
    square = !square;
    touching = false;
    ellips = false;
    line = false;
    checkColor = false;
    cover = false;
    setTools();
    resetColors();
}

function drawEllips(event) {
    ellips = !ellips;
    touching = false;
    line = false;
    square = false;
    checkColor = false;
    cover = false;
    setTools();
    resetColors();
}

function drawLine(event) {
    line = !line;
    ellips = false;
    square = false;
    touching = false;
    checkColor = false;
    cover = false;
    setTools();
    resetColors();
}

function startCheckColor(event) {
    checkColor = !checkColor;
    line = false;
    ellips = false;
    square = false;
    touching = false;
    cover = false;
    setTools();
    resetColors();
}

function startCover(event) {
    cover = !cover;
    checkColor = false;
    line = false;
    ellips = false;
    square = false;
    touching = false;
    setTools();
    resetColors();
}

function repaint() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img != null) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rotateAngle);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        if (!mirroredX && !mirroredY) {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        } else {
            if (mirroredX && mirroredY) {
                ctx.scale(-1, -1);
                ctx.drawImage(img, 0, 0, img.width, img.height, -canvas.width, -canvas.height, canvas.width, canvas.height);
            } else {
                if (mirroredX) {
                    ctx.scale(-1, 1);
                    ctx.drawImage(img, 0, 0, img.width, img.height, -canvas.width, 0, canvas.width, canvas.height);
                }
                if (mirroredY) {
                    ctx.scale(1, -1);
                    ctx.drawImage(img, 0, 0, img.width, img.height, 0, -canvas.height, canvas.width, canvas.height);
                }
            }
        }
        ctx.restore();
    }
    for (const item of undo) {
        item.drawObject(ctx);
    }
}