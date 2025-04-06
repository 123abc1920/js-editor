class DrewObject {
    constructor(color, width, isFill) {
        this.color = color;
        this.width = width;
        this.isFill = isFill;
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

class CustomLine extends DrewObject {
    constructor(color, width) {
        super(color, width, false);
        this.dots = [];
    }

    addDot(x, y) {
        this.dots.push(new Point(x / scalingCanvas, y / scalingCanvas));
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.dots[0].x * scalingCanvas, this.dots[0].y * scalingCanvas);

        for (const dot of this.dots) {
            ctx.lineTo(dot.x * scalingCanvas, dot.y * scalingCanvas);
        }

        ctx.stroke();
    }
}

class CustomSquare extends DrewObject {
    constructor(x, y, color, width, isFill) {
        super(color, width, isFill);
        this.start = new Point(x / scalingCanvas, y / scalingCanvas);
        this.size = null;
    }

    setSize(w, h) {
        this.size = new Point(w / scalingCanvas, h / scalingCanvas);
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        var rectangle = new Path2D();
        rectangle.rect(this.start.x * scalingCanvas, this.start.y * scalingCanvas, this.size.x * scalingCanvas, this.size.y * scalingCanvas);
        ctx.stroke(rectangle);
        if (this.isFill) {
            ctx.fillStyle = this.color;
            ctx.fill(rectangle);
        }
    }
}

class CustomCircle extends DrewObject {
    constructor(x, y, color, width, isFill) {
        super(color, width, isFill);
        this.start = new Point(x / scalingCanvas, y / scalingCanvas);
        this.size = null;
    }

    setSize(w, h) {
        this.size = new Point(w / scalingCanvas, h / scalingCanvas);
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.ellipse(this.start.x * scalingCanvas, this.start.y * scalingCanvas, this.size.x * scalingCanvas, this.size.y * scalingCanvas, 0, 0, 180);
        ctx.stroke();
        if (this.isFill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
}

class CustomDirectLine extends DrewObject {
    constructor(x, y, color, width) {
        super(color, width, false);
        this.start = new Point(x / scalingCanvas, y / scalingCanvas);
        this.finish = null;
    }

    setFinish(x, y) {
        this.finish = new Point(x / scalingCanvas, y / scalingCanvas);
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.start.x * scalingCanvas, this.start.y * scalingCanvas);
        ctx.lineTo(this.finish.x * scalingCanvas, this.finish.y * scalingCanvas);
        ctx.stroke();
    }
}

class CustomCover extends DrewObject {
    constructor(color, width) {
        super(color, width, false);
        this.points = []
    }

    addPoint(p) {
        this.points.push(new Point(p.x / scalingCanvas, p.y / scalingCanvas));
    }

    drawObject(ctx) {
        var minx = canvas.width, miny = canvas.height, maxx = 0, maxy = 0;
        this.points.forEach(function (item) {
            if (item.x < minx) {
                minx = item.x;
            }
            if (item.y < miny) {
                miny = item.y;
            }
            if (item.x > maxx) {
                maxx = item.x;
            }
            if (item.y > maxy) {
                maxy = item.y;
            }
        });

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
            ctx.putImageData(imageData, item.x * scalingCanvas, item.y * scalingCanvas);
        });
    }
}