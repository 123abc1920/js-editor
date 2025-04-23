var mirroredY = false;
var mirroredX = false;
var rotateAngle = 0;

function mirrorY(event) {
    mirroredY = !mirroredY;
    repaint();
}

function mirrorX(event) {
    mirroredX = !mirroredX;
    repaint();
}

function rotateLeft(event) {
    rotateAngle = rotateAngle + Math.PI / 2;
    repaint();
}

function rotateRight(event) {
    rotateAngle = rotateAngle - Math.PI / 2;
    repaint();
}
