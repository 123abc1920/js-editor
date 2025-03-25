class DrewObject {
    constructor(color, width) {
        this.color = color;
        this.width = width;
    }

    drawObject(ctx) { }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class CustomLine extends DrewObject {
    constructor(color, width) {
        super(color, width);
        this.dots = [];
    }

    addDot(x, y) {
        this.dots.push(new Point(x, y));
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.dots[0].x, this.dots[0].y);

        for (const dot of this.dots) {
            ctx.lineTo(dot.x, dot.y);
        }

        ctx.stroke();
    }
}

class CustomSquare extends DrewObject {
    constructor(x, y, color, width) {
        super(color, width);
        this.start = new Point(x, y);
        this.size = null;
    }

    setSize(w, h) {
        this.size = new Point(w, h);
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        var rectangle = new Path2D();
        rectangle.rect(this.start.x, this.start.y, this.size.x, this.size.y);
        ctx.stroke(rectangle);
    }
}

class CustomCircle extends DrewObject {
    constructor(x, y, color, width) {
        super(color, width);
        this.start = new Point(x, y);
        this.size = null;
    }

    setSize(w, h) {
        this.size = new Point(w, h);
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        var circle = new Path2D();
        circle.arc(this.start.x, this.start.y, this.size.x, 0, 2 * Math.PI);
        ctx.stroke(circle);
    }
}

class CustomDirectLine extends DrewObject {
    constructor(x, y, color, width) {
        super(color, width);
        this.start = new Point(x, y);
        this.finish = null;
    }

    setFinish(x, y) {
        this.finish = new Point(x, y);
    }

    drawObject(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.finish.x, this.finish.y);
        ctx.stroke();
    }
}