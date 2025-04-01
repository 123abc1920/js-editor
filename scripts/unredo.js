const undo = [];
const redo = [];

function unDo(event) {
    if (undo.length != 0) {
        redo.push(undo.pop());
        repaint();
    }
}

function reDo(event) {
    if (redo.length != 0) {
        undo.push(redo.pop());
        repaint();
    }
}