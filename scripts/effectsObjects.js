class EffectObject extends DrewObject {
    constructor() {
        super(0, 0, false);
        this.imageData = null;
        this.coeff = scalingCanvas;
    }

    update() { }

    drawObject(ctx) {
        if (this.coeff != scalingCanvas) {
            this.coeff = scalingCanvas;
            this.update();
        }
        ctx.putImageData(this.imageData, 0, 0);
    }
}

class GrayEffect extends EffectObject {
    constructor() {
        super();
        this.update();
    }

    update() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let red, green, blue, grayscale;

        for (let i = 0; i < imageData.data.length; i += 4) {
            red = imageData.data[i];
            green = imageData.data[i + 1];
            blue = imageData.data[i + 2];
            grayscale = red * 0.3 + green * 0.59 + blue * 0.11;
            imageData.data[i] = grayscale;
            imageData.data[i + 1] = grayscale;
            imageData.data[i + 2] = grayscale;
        }
        this.imageData = imageData;
    }
}

class NoiseEffect extends EffectObject {
    constructor() {
        super();
        this.update();
    }

    update() {
        let imageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const color = Math.random() * 255;
            imageData.data[i] = color;
            imageData.data[i + 1] = color;
            imageData.data[i + 2] = color;
            imageData.data[i + 3] = 255;
        }
        this.imageData = imageData;
    }
}

class GlitchEffect extends EffectObject {
    constructor(levels) {
        super();
        this.levels = levels;
        this.update();
    }

    update() {
        this.offsetsx = []
        this.offsetsy = []
        this.imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < this.levels; i++) {
            const yOffset = Math.floor(Math.random() * canvas.height);
            const xOffset = Math.floor(Math.random() * this.levels);
            this.offsetsx.push(xOffset);
            this.offsetsy.push(yOffset);
        }
    }

    drawObject(ctx) {
        if (this.coeff != scalingCanvas) {
            this.coeff = scalingCanvas;
            this.update();
        }
        for (let i = 0; i < this.levels; i++) {
            ctx.putImageData(this.imageData, this.offsetsx[i], this.offsetsy[i]);
        }
    }
}

class BrightnessEffect extends EffectObject {
    constructor(brightnessFactor) {
        super();
        this.brightnessFactor = brightnessFactor;
        this.update();
    }

    update() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(data[i] * this.brightnessFactor, 255);
            data[i + 1] = Math.min(data[i + 1] * this.brightnessFactor, 255);
            data[i + 2] = Math.min(data[i + 2] * this.brightnessFactor, 255);
        }

        this.imageData = imageData;
    }
}

class ContrastEffect extends EffectObject {
    constructor(contrast) {
        super();
        this.contrast = contrast;
        this.update();
    }

    update() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const contrast_f = (259 * (this.contrast + 255)) / (255 * (259 - this.contrast));

        for (let i = 0; i < data.length; i += 4) {
            let Red = data[i] / 255.0;
            let Green = data[i + 1] / 255.0;
            let Blue = data[i + 2] / 255.0;
            Red = (((Red - 0.5) * this.contrast) + 0.5) * 255.0;
            Green = (((Green - 0.5) * this.contrast) + 0.5) * 255.0;
            Blue = (((Blue - 0.5) * this.contrast) + 0.5) * 255.0;

            let iR = Red;
            iR = iR > 255 ? 255 : iR;
            iR = iR < 0 ? 0 : iR;
            let iG = Green;
            iG = iG > 255 ? 255 : iG;
            iG = iG < 0 ? 0 : iG;
            let iB = Blue;
            iB = iB > 255 ? 255 : iB;
            iB = iB < 0 ? 0 : iB;

            data[i] = iR;
            data[i + 1] = iG;
            data[i + 2] = iB;
        }

        this.imageData = imageData;
    }
}

class SaturationEffect extends EffectObject {
    constructor(saturation) {
        super();
        this.saturation = saturation;
        this.update();
    }

    update() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const avg = (r + g + b) / 3;

            data[i] = avg + (r - avg) * this.saturation;
            data[i + 1] = avg + (g - avg) * this.saturation;
            data[i + 2] = avg + (b - avg) * this.saturation;
        }

        this.imageData = imageData;
    }
}

class SepiaEffect extends EffectObject {
    constructor() {
        super();
        this.update();
    }

    update() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            data[i] = r * 0.393 + g * 0.769 + b * 0.189;
            data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
            data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
        }


        this.imageData = imageData;
    }
}