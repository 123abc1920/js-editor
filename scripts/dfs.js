class DFS {
    constructor(r, g, b, cover, maxx, maxy) {
        this.marked = new Set();
        this.probeColor = [r, g, b];
        this.cover = cover;
        this.maxx = maxx;
        this.maxy = maxy;
    }

    dfs(x, y, ctx) {
        var stack = [];
        var point = new Point(x, y);
        stack.push(point);
        while (stack.length > 0) {
            var p = stack.pop();

            if (p.x < 0 || p.y < 0 || p.x >= this.maxx || p.y >= this.maxy) {
                continue;
            }
            if (this.marked.has(`${p.x},${p.y}`)) {
                continue;
            }

            this.marked.add(`${p.x},${p.y}`);
            this.cover.addPoint(p);

            var imgData = ctx.getImageData(p.x, p.y, 1, 1).data;
            if (imgData[0] != this.probeColor[0] || imgData[1] != this.probeColor[1] || imgData[2] != this.probeColor[2]) {
                continue;
            }

            stack.push(new Point(p.x + 1, p.y));
            stack.push(new Point(p.x - 1, p.y));
            stack.push(new Point(p.x, p.y - 1));
            stack.push(new Point(p.x, p.y + 1));
        }
    }
}