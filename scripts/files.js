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
    img.onload = () => {
        if (img.width > img.height) {
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
    undo.length = 0;
    redo.length = 0;
}