var canvas = document.getElementById("canvas");
const rect = canvas.getBoundingClientRect();
var ctx = canvas.getContext("2d");

var scalingCanvas = 1;
var img = null;
var imgWidth = 1000;
var imgHeight = 1000;

var imgHere = false;
var cookie = getCookie("imgHere");
if (cookie) {
    imgHere = true;
}

function openFile(event) {
    event.preventDefault();
    document.cookie = 'current_file=; Max-Age=-1;';
    const pickerOpts = { types: [{ accept: { "image/*": [".gif", ".jpeg", ".jpg"] } }] };
    window.showOpenFilePicker(pickerOpts).then(fileHandles => {
        return fileHandles[0].getFile();
    }).then(file => {
        openImg(URL.createObjectURL(file));
    })
}

function showModal(event) {
    let modal = new bootstrap.Modal(document.getElementById("newFileModal"));
    modal.show();
}

function createFile() {
    let width = document.getElementById("width").value;
    let height = document.getElementById("height").value;
    $('#newFileModal').modal('hide');
    newFile(width, height);
}

function newFile(width, height) {
    imgHere = true;
    document.cookie = "imgHere=true";
    document.cookie = 'current_file=; Max-Age=-1;';
    imgHeight = height;
    imgWidth = width;
    img = null;
    const rect = imgPanel.getBoundingClientRect();
    var scale = Math.min(rect.width / imgWidth, rect.height / imgHeight);
    var newWidth;
    var newHeight;
    if (imgWidth > imgHeight) {
        newWidth = rect.width;
        newHeight = imgHeight * scale;
    } else if (imgWidth < imgHeight) {
        newHeight = rect.height;
        newWidth = imgWidth * scale;
    } else if (imgWidth == imgHeight) {
        newHeight = rect.height;
        newWidth = imgWidth * scale;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    undo.length = 0;
    redo.length = 0;
}

function saveFile(event, type) {
    event.preventDefault();
    if (imgHere) {
        let link;
        if (type == "png") {
            link = document.createElement('a');
            let dataUrl = canvas.toDataURL('image/png', 0.5);
            link.href = dataUrl;
            link.download = 'image.png';
        }
        if (type == "jpeg") {
            link = document.createElement('a');
            let dataUrl = canvas.toDataURL('image/jpeg', 0.5);
            link.href = dataUrl;
            link.download = 'image.jpeg';
        }
        if (type == "server") {
            var username = getCookie("username");
            if (username) {
                let dataUrl = canvas.toDataURL('image/png', 0.5);
                const form = document.createElement('form');
                form.action = '/upload';
                form.method = 'POST';
                const input = document.createElement('input');
                input.type = 'text';
                input.name = 'img';
                input.value = dataUrl;

                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
                form.remove();
            } else {
                console.log("jjjj");
                let modal = new bootstrap.Modal(document.getElementById("infomodal"));
                modal.show();
            }
        }
        if (link) {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function openImg(url) {
    imgHere = true;
    document.cookie = "imgHere=true";
    img = new Image();
    img.src = url;
    canvas.width = 100;
    canvas.height = 100;
    img.onload = () => {
        var imgPanel = document.getElementById("imgPanel");
        const rect = imgPanel.getBoundingClientRect();
        imgWidth = img.width;
        imgHeight = img.height;

        var scale = Math.min(rect.width / imgWidth, rect.height / imgHeight);
        var newWidth;
        var newHeight;
        if (imgWidth > imgHeight) {
            newWidth = rect.width;
            newHeight = imgHeight * scale;
        } else if (imgWidth <= imgHeight) {
            newHeight = rect.height;
            newWidth = imgWidth * scale;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);
    }
    undo.length = 0;
    redo.length = 0;
}

function resizeCanvas(event, value) {
    value = Math.max(20, Math.min(value, 200));

    document.getElementById('size-picker').value = value;
    document.getElementById('size-text').value = value;

    scalingCanvas = value / 100;

    if (imgHere) {
        var imgPanel = document.getElementById("imgPanel");
        const rect = imgPanel.getBoundingClientRect();
        var rectWidth = rect.width * scalingCanvas;
        var rectHeight = rect.height * scalingCanvas;
        var scale = Math.min(rectWidth / imgWidth, rectHeight / imgHeight);
        var newWidth;
        var newHeight;
        if (imgWidth > imgHeight) {
            newWidth = rectWidth;
            newHeight = imgHeight * scale;
        } else if (imgWidth <= imgHeight) {
            newHeight = rectHeight;
            newWidth = imgWidth * scale;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx = canvas.getContext("2d");
        if (img != null) {
            ctx.drawImage(img, 0, 0, imgWidth, imgHeight, 0, 0, newWidth, newHeight);
        } else {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        repaint();
    }
}