let isDraw = false;
var canvas = document.getElementById("canvas");
canvas.width = 100;
canvas.height = 100;
var ctx = canvas.getContext("2d");
ctx.fillRect(0, 0, canvas.width, canvas.height);

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
}

function saveFile(event) {
    event.preventDefault();
}

function startDraw(event) {
    isDraw = !isDraw;
}

function openImg(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        if (img.width >= 2 * img.height) {
            canvas.setAttribute('style', 'height: auto; width: 100%;');
        } else {
            canvas.setAttribute('style', 'height: 100%; width: auto;');
        }
    }
}

if (isDraw) {

}