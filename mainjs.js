function openFile(event) {
    event.preventDefault();

    const pickerOpts = { types: [{ accept: { "image/*": [".gif", ".jpeg", ".jpg"] } }] };
    window.showOpenFilePicker(pickerOpts).then(fileHandles => {
        return fileHandles[0].getFile();
    }).then(file => {
        document.getElementById("main-img").setAttribute("src", URL.createObjectURL(file));
    })
}

function newFile(event) {
    event.preventDefault();
}

function saveFile(event) {
    event.preventDefault();
}