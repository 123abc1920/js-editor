class SimpleBrush {
    constructor(name = "Простая") {
        this.name = name;
    }

    drawCustomLine(obj, ctx) {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.width;
        ctx.beginPath();

        var startP = prepareToDrawDot(obj.dots[0].x, obj.dots[0].y);
        ctx.moveTo(startP.x, startP.y);

        for (const dot of obj.dots) {
            var miniP = prepareToDrawDot(dot.x, dot.y);
            ctx.lineTo(miniP.x, miniP.y);
        }
        ctx.stroke();
    }

    drawSquare(obj, ctx) {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.width;
        var rectangle = new Path2D();
        var newP = prepareToDrawDot(obj.center.x, obj.center.y);
        var finP = prepareToDrawDot(obj.finish.x, obj.finish.y);
        var startP = prepareToDrawDot(obj.start.x, obj.start.y);
        var w = Math.abs(finP.x - startP.x);
        var h = Math.abs(finP.y - startP.y);

        rectangle.rect(newP.x - w / 2, newP.y - h / 2, w, h);
        ctx.stroke(rectangle);
    }

    drawCircle(obj, ctx) {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.width;
        ctx.beginPath();
        var newP = prepareToDrawDot(obj.start.x, obj.start.y);
        var finP = prepareToDrawDot(obj.finish.x, obj.finish.y);
        ctx.ellipse(newP.x, newP.y, Math.abs(finP.x - newP.x), Math.abs(finP.y - newP.y), 0, 0, 180);
        ctx.stroke();
    }

    drawDirectLine(obj, ctx) {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.width;
        ctx.beginPath();
        var newP = prepareToDrawDot(obj.start.x, obj.start.y);
        ctx.moveTo(newP.x, newP.y);
        newP = prepareToDrawDot(obj.finish.x, obj.finish.y);
        ctx.lineTo(newP.x, newP.y);
        ctx.stroke();
    }
}

class SmoothBrush extends SimpleBrush {
    constructor() {
        super("Мягкая");
    }

    drawCustomLine(obj, ctx) {
        ctx.fillStyle = obj.color;
        ctx.lineWidth = obj.width;

        var startP = prepareToDrawDot(obj.dots[0].x, obj.dots[0].y);
        ctx.moveTo(startP.x, startP.y);

        for (const dot of obj.dots) {
            var miniP = prepareToDrawDot(dot.x, dot.y);
            ctx.beginPath();
            ctx.ellipse(miniP.x, miniP.y, obj.width, obj.width, 0, 0, 180);
            ctx.fill();
        }
    }

    /*drawSquare(obj, ctx) {
        ctx.fillStyle = obj.color;
        ctx.lineWidth = obj.width;

        var newP = prepareToDrawDot(obj.center.x, obj.center.y);
        var finP = prepareToDrawDot(obj.finish.x, obj.finish.y);
        var startP = prepareToDrawDot(obj.start.x, obj.start.y);
        var w = Math.abs(finP.x - startP.x);
        var h = Math.abs(finP.y - startP.y);

        if (!obj.special) {
            obj.special = [[], []]
            for (let i = newP.x - w / 2, k = 0; i < newP.x + w / 2; i += Math.random() * (w / 20), k++) {
                obj.special[0].push(prepareToSaveDot(i, startP.y).x);
            }
            for (let i = newP.y - h / 2, k = 0; i < newP.y + h / 2; i += Math.random() * (h / 20), k++) {
                obj.special[1].push(prepareToSaveDot(startP.x, i).y);
            }
        }

        for (let k = 0; k < obj.special[0].length; k++) {
            ctx.beginPath();
            ctx.ellipse(prepareToDrawDot(obj.special[0][k], startP.y).x, startP.y, obj.width, obj.width, 0, 0, 180);
            ctx.ellipse(prepareToDrawDot(obj.special[0][k], startP.y).x, finP.y, obj.width, obj.width, 0, 0, 180);
            ctx.fill();
        }

        for (let k = 0; k < obj.special[1].length; k++) {
            ctx.beginPath();
            ctx.ellipse(startP.x, prepareToDrawDot(startP.x, obj.special[1][k]).y, obj.width, obj.width, 0, 0, 180);
            ctx.ellipse(finP.x, prepareToDrawDot(startP.x, obj.special[1][k]).y, obj.width, obj.width, 0, 0, 180);
            ctx.fill();
        }
    }*/

    drawDirectLine(obj, ctx) {
        ctx.fillStyle = obj.color;
        ctx.lineWidth = obj.width;

        var newP = prepareToDrawDot(obj.start.x, obj.start.y);
        var finP = prepareToDrawDot(obj.finish.x, obj.finish.y);

        var sizex = Math.abs(newP.x - finP.x);
        var sizey = Math.abs(newP.y - finP.y);

        let start = new Point(0, 0);
        let fin = new Point(0, 0);
        start.x = Math.min(newP.x, finP.x);
        fin.x = Math.max(newP.x, finP.x);
        start.y = Math.min(newP.y, finP.y);
        fin.y = Math.max(newP.y, finP.y);

        if (!obj.special) {
            obj.special = [[], []]
            for (let i = start.x, j = start.y, k = 0; i < start.x + sizex; i += Math.random() * (sizex / 50), j += Math.random() * (sizey / 50), k++) {
                obj.special[0].push(prepareToSaveDot(i, 0).x)
                obj.special[1].push(prepareToSaveDot(j, 0).x)
            }
        }
        for (let i = start.x, j = start.y, k = 0; i < start.x + sizex; i = obj.special[0][k], j = obj.special[1][k], k++) {
            ctx.beginPath();
            ctx.ellipse(prepareToDrawDot(i, 0).x, prepareToDrawDot(j, 0).x, obj.width, obj.width, 0, 0, 180);
            ctx.fill();
        }
    }
}

class DistBrush extends SimpleBrush {
    constructor() {
        super("Изменяющаяся");
    }

    drawCustomLine(obj, ctx) {
        ctx.fillStyle = obj.color;
        ctx.lineWidth = obj.width;

        var oldP = prepareToDrawDot(obj.dots[0].x, obj.dots[0].y);
        for (const dot of obj.dots) {
            var miniP = prepareToDrawDot(dot.x, dot.y);
            ctx.beginPath();
            const r = Math.sqrt((miniP.x - oldP.x) * (miniP.x - oldP.x) + (miniP.y - oldP.y) * (miniP.y - oldP.y));
            ctx.ellipse(miniP.x, miniP.y, r, r, 0, 0, 180);
            oldP = miniP;
            ctx.fill();
        }
    }
}

class PenBrush extends SimpleBrush {
    constructor() {
        super("Ручка");
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    drawCustomLine(obj, ctx) {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.width;

        ctx.beginPath();

        var oldP = prepareToDrawDot(obj.dots[0].x, obj.dots[0].y);
        for (const dot of obj.dots) {
            var miniP = prepareToDrawDot(dot.x, dot.y);
            const lerps = 10
            for (let i = 0; i < lerps; i++) {
                const x = this.lerp(oldP.x, miniP.x, i / lerps);
                const y = this.lerp(oldP.y, miniP.y, i / lerps);
                ctx.moveTo(x - obj.width, y - obj.width);
                ctx.lineTo(x + obj.width, y + obj.width);
            }
            oldP = miniP;
        }

        ctx.stroke();
        ctx.closePath();
    }
}

class SprayBrush extends SimpleBrush {
    constructor() {
        super("Рассыпчатая");
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    drawCustomLine(obj, ctx) {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.width;

        ctx.beginPath();

        var oldP = prepareToDrawDot(obj.dots[0].x, obj.dots[0].y);
        for (const dot of obj.dots) {
            var miniP = prepareToDrawDot(dot.x, dot.y);
            const lerps = 10;
            for (let i = 0; i < lerps; i++) {
                const x = this.lerp(miniP.x, oldP.x, i / lerps + lerps)
                const y = this.lerp(miniP.y, oldP.y, i / lerps + lerps)
                ctx.moveTo(x - obj.width, y - obj.width);
                ctx.lineTo(x + obj.width, y + obj.width);
            }
            oldP = miniP;
        }

        ctx.stroke();
        ctx.closePath();
    }
}

class CoalBrush extends SimpleBrush {
    constructor() {
        super("Угольная");
    }

    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    drawCustomLine(obj, ctx) {
        ctx.fillStyle = obj.color;
        ctx.lineWidth = obj.width;

        if (!obj.special) {
            obj.special = [[], []];

            const minRadius = 10;
            const sprayDensity = 80;
            const lerps = 10;

            var oldP = prepareToDrawDot(obj.dots[0].x, obj.dots[0].y);
            for (const dot of obj.dots) {
                var miniP = prepareToDrawDot(dot.x, dot.y);
                const speed = Math.abs(miniP.x - oldP.x) + Math.abs(miniP.y - oldP.y);
                const r = speed + minRadius;
                const rSquared = r * r;
                for (let i = 0; i < lerps; i++) {
                    const lerpX = this.lerp(miniP.x, oldP.x, i / lerps)
                    const lerpY = this.lerp(miniP.y, oldP.y, i / lerps)
                    for (let j = 0; j < sprayDensity; j++) {
                        const randX = -r + Math.random() * r;
                        const randY = (-1 + Math.random()) * Math.sqrt(rSquared - randX * randX);
                        obj.special[0].push(prepareToSaveDot(lerpX + randX, 0).x);
                        obj.special[1].push(prepareToSaveDot(lerpY + randY, 0).x);
                    }
                }
                oldP = miniP;
            }
        }

        const xCoordinates = obj.special[0];
        const yCoordinates = obj.special[1];
        ctx.beginPath();
        xCoordinates.forEach((x, i) => {
            let xx = prepareToDrawDot(x, 0).x;
            let yy = prepareToDrawDot(yCoordinates[i], 0).x
            ctx.moveTo(xx, yy);
            ctx.arc(xx, yy, 1, 0, Math.PI * 2);
        })
        ctx.fill();
    }
}

let brushes = [new SimpleBrush(), new SmoothBrush(), new DistBrush(), new PenBrush(), new SprayBrush(), new CoalBrush()];

let currentBrush = brushes[0];

const brushList = document.getElementById('brushList');
brushes.forEach((obj, ind) => {
    const button = document.createElement('button');
    button.textContent = `${obj.name}`;
    button.onclick = () => btnClick(ind);
    button.classList.add('row');
    brushList.appendChild(button);
});

function btnClick(index) {
    currentBrush = brushes[index];
}