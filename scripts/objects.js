class DrewObject {
    drawObject(ctx) { }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class CustomLine extends DrewObject {
    constructor() {
        super();
        this.dots = [];
    }

    addDot(x, y) {
        this.dots.push(new Point(x, y));
    }

    drawObject(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.dots[0].x, this.dots[0].y);

        for (const dot of this.dots) {
            ctx.lineTo(dot.x, dot.y);
        }

        ctx.stroke();
    }
}