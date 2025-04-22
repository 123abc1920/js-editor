function gray(event) {
    undo.push(new GrayEffect());
    redo.length = 0;
    repaint();
}

function noise(event) {
    undo.push(new NoiseEffect());
    redo.length = 0;
    repaint();
}

function glitch(event) {
    undo.push(new GlitchEffect(document.getElementById("glitch-param").value));
    redo.length = 0;
    repaint();
}

function bright(event) {
    undo.push(new BrightnessEffect(document.getElementById("bright-param").value));
    redo.length = 0;
    repaint();
}

function contrast(event) {
    var val = document.getElementById("contrast-param").value
    if (val == 0) {
        return;
    }
    undo.push(new ContrastEffect());
    redo.length = 0;
    repaint();
}

function saturation(event) {
    undo.push(new SaturationEffect(document.getElementById("saturation-param").value));
    redo.length = 0;
    repaint();
}

function sepia(event) {
    undo.push(new SepiaEffect());
    redo.length = 0;
    repaint();
}