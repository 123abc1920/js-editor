let isDraw = false;
let draw = false;
let square = false;
let ellips = false;
let line = false;

var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 1000;
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
var mouse = { x: 0, y: 0 };

canvas.addEventListener("mousedown", function (e) {
    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
    draw = true;
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
});

canvas.addEventListener("mousemove", function (e) {
    if (draw) {
        if (isDraw) {
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
    if (draw) {
        if (isDraw) {
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
    draw = false;
    ctx.stroke();
});

function openFile(event) {
    event.preventDefault();

    const pickerOpts = { types: [{ accept: { "image/*": [".gif", ".jpeg", ".jpg"] } }] };
    window.showOpenFilePicker(pickerOpts).then(fileHandles => {
        return fileHandles[0].getFile();
    }).then(file => {
        openImg(URL.createObjectURL(file));
    })
}

function newFile(event) {
    event.preventDefault();
    canvas.width = 1000;
    canvas.height = 1000;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveFile(event) {
    event.preventDefault();
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function startDraw(event) {
    isDraw = !isDraw;
}

function openImg(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        if (img.width >= 2 * img.height) {
            canvas.setAttribute('style', 'height: auto; width: 100%;');
        } else {
            canvas.setAttribute('style', 'height: 100%; width: auto;');
        }
        canvas.width = img.width;
        canvas.height = img.height;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    }
}

function drawSquare(event) {
    square = !square;
    isDraw = false;
    ellips = false;
    line = false;
}

function drawEllips(event) {
    ellips = !ellips;
    isDraw = false;
    line = false;
    square = false;
}

function drawLine(event) {
    line = !line;
    ellips = false;
    square = false;

}