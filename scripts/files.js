var canvas = document.getElementById("canvas");
canvas.width = 1000;
canvas.height = 1000;
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

var img = null;

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
    undo.length = 0;
    redo.length = 0;
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

function openImg(url) {
    img = new Image();
    img.src = url;
    canvas.width = 100;
    canvas.height = 100;
    img.onload = () => {
        var imgPanel = document.getElementById("imgPanel");
        const rect = imgPanel.getBoundingClientRect();

        canvas.width = rect.width;
        canvas.height = rect.height;

        var scale = Math.min(rect.width / img.width, rect.height / img.height);

        var newWidth = img.width * scale;
        var newHeight = img.height * scale;

        var xOffset = (rect.width - newWidth) / 2;
        var yOffset = (rect.height - newHeight) / 2;

        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, xOffset, yOffset, newWidth, newHeight);
    }
    undo.length = 0;
    redo.length = 0;
}

function resizeCanvas() {
    const canvasAspectRatio = canvas.width / canvas.height;
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    const width = window.innerWidth;
    const height = width / canvasAspectRatio;

    if (windowAspectRatio < canvasAspectRatio) {
        canvas.width = window.innerHeight * canvasAspectRatio;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = width;
        canvas.height = height;
    }
}