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
    undo.push(new GlitchEffect());
    redo.length = 0;
    repaint();
}

function bright(event) {
    undo.push(new BrightnessEffect());
    redo.length = 0;
    repaint();
}

function contrast(event) {
    undo.push(new ContrastEffect());
    redo.length = 0;
    repaint();
}

function saturation(event) {
    undo.push(new SaturationEffect());
    redo.length = 0;
    repaint();
}

function sepia(event) {
    undo.push(new SepiaEffect());
    redo.length = 0;
    repaint();
}