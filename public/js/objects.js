class DrewObject {
    constructor(color, width, isFill, brush) {
        this.color = color;
        this.width = width;
        this.isFill = isFill;
        this.brush = brush;
        this.special = null;
    }

    drawObject(ctx) { }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    equals(other) {
        return (other.x === this.x && other.y === this.y);
    }
}

function prepareToDrawDot(x, y) {
    if (mirroredX) {
        x = canvas.width - x;
    }
    if (mirroredY) {
        y = canvas.height - y;
    }
    xc = canvas.width / 2;
    yc = canvas.height / 2;
    xn = Math.round(xc + (x - xc) * Math.cos(rotateAngle) - (y - yc) * Math.sin(rotateAngle))
    yn = Math.round(yc + (x - xc) * Math.sin(rotateAngle) + (y - yc) * Math.cos(rotateAngle))
    return new Point(xn * scalingCanvas, yn * scalingCanvas);
}

function prepareToSaveDot(x, y) {
    if (mirroredX) {
        x = canvas.width - x;
    }
    if (mirroredY) {
        y = canvas.height - y;
    }
    xc = canvas.width / 2;
    yc = canvas.height / 2;
    xn = Math.round(xc + (x - xc) * Math.cos(-rotateAngle) - (y - yc) * Math.sin(-rotateAngle))
    yn = Math.round(yc + (x - xc) * Math.sin(-rotateAngle) + (y - yc) * Math.cos(-rotateAngle))
    return new Point(xn / scalingCanvas, yn / scalingCanvas);
}

class CustomLine extends DrewObject {
    constructor(color, width, brush) {
        super(color, width, false, brush);
        this.dots = [];
    }

    addDot(x, y) {
        var p = prepareToSaveDot(x, y);
        this.dots.push(new Point(p.x, p.y));
    }

    drawObject(ctx) {
        this.brush.drawCustomLine(this, ctx);
    }
}

class CustomSquare extends DrewObject {
    constructor(x, y, color, width, isFill, brush) {
        super(color, width, isFill, brush);
        this.start = prepareToSaveDot(x, y);
        this.center = new Point(0, 0);
        this.finish = new Point(0, 0);
    }

    setSize(w, h) {
        this.finish.x = this.start.x + w / scalingCanvas;
        this.finish.y = this.start.y + h / scalingCanvas;
        this.center.x = this.start.x + w / scalingCanvas / 2;
        this.center.y = this.start.y + h / scalingCanvas / 2;
    }

    drawObject(ctx) {
        this.brush.drawSquare(this, ctx);
        if (this.isFill) {
            ctx.fillStyle = this.color;
            ctx.fill(rectangle);
        }
    }
}

class CustomCircle extends DrewObject {
    constructor(x, y, color, width, isFill, brush) {
        super(color, width, isFill, brush);
        this.start = prepareToSaveDot(x, y);
        this.finish = new Point(0, 0);
    }

    setSize(w, h) {
        this.finish.x = this.start.x + w / scalingCanvas;
        this.finish.y = this.start.y + h / scalingCanvas;
    }

    drawObject(ctx) {
        this.brush.drawCircle(this, ctx);
        if (this.isFill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
}

class CustomDirectLine extends DrewObject {
    constructor(x, y, color, width, brush) {
        super(color, width, false, brush);
        this.start = prepareToSaveDot(x, y);
        this.finish = null;
    }

    setFinish(x, y) {
        this.finish = prepareToSaveDot(x, y);
    }

    drawObject(ctx) {
        this.brush.drawDirectLine(this, ctx);
    }
}

class CustomCover extends DrewObject {
    constructor(color, width) {
        super(color, width, false, null);
        this.points = []
    }

    addPoint(p) {
        this.points.push(prepareToSaveDot(p.x, p.y));
    }

    sort() {
        this.points.sort((a, b) => a.y - b.y);
    }

    drawObject(ctx) {
        const hexToRgb = hex => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b, 255];
        };
        var clr = hexToRgb(this.color);

        const imageData = ctx.createImageData(1, 1);
        const data = imageData.data;
        data[0] = clr[0];
        data[1] = clr[1];
        data[2] = clr[2];
        data[3] = clr[3];
        this.points.forEach(function (item) {
            var newP = prepareToDrawDot(item.x, item.y);
            ctx.putImageData(imageData, newP.x, newP.y);
        });
    }
}