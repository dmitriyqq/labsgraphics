document.addEventListener('DOMContentLoaded', setup);
let context;
const SIZE = 600; 

function setup(){
    const canvas = document.getElementById('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    context = canvas.getContext('2d');
    
    var imageData = context.createImageData(SIZE, SIZE);
    const maxiterations = 30;
    for(let y = 0; y < SIZE; y++){
        for(let x = 0; x < SIZE; x++){
            const xx = map(x, 0, SIZE, -2.5, 1.5);
            const yy = map(y, 0, SIZE, -2, 2);
            const pixelColor = mandlebrot(xx, yy, maxiterations);
            const pixelIndex = ((y * (SIZE * 4)) + (x * 4));
            imageData.data[pixelIndex] = pixelColor.r;
            imageData.data[pixelIndex+1] = pixelColor.g;
            imageData.data[pixelIndex+2] = pixelColor.b;
            imageData.data[pixelIndex+3] = 255;
        }
    }

    context.putImageData(imageData, 0, 0);
    console.log('done');
}

function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function calcColor(maxiterations, n) {
    let r, g, b;
    let p = map(n, 0.0, maxiterations * 1.0, 0.0, 1.0);	
    if (p < 0.16) {
        r = map(p, 0.0, 0.16, 0.0, 32.0);
        g = map(p, 0.0, 0.16, 7.0, 107.0);
        b = map(p, 0.0, 0.16, 100.0, 203.0);
    }else if (p < 0.42) {
        r = map(p, 0.16, 0.42, 32.0, 237.0);
        g = map(p, 0.16, 0.42, 107.0, 255.0);
        b = map(p, 0.16, 0.42, 203.0, 255.0);
    }else if (p < 0.6425) {
        r = map(p, 0.42, 0.6425, 237.0, 255.0);
        g = map(p, 0.42, 0.6425, 255.0, 170.0);
        b = map(p, 0.42, 0.6425, 255.0, 0.0);
    }else if (p < 0.8575) {
        r = map(p, 0.6425, 0.8575, 255.0, 0.0);
        g = map(p, 0.6425, 0.8575, 170.0, 2.0);
        b = map(p, 0.6425, 0.8575, 0.0, 0.0);
    }else if (p < 0.6425) {
        r = map(p, 0.8575, 1.0, 0.0, 0.0);
        g = map(p, 0.8575, 1.0, 2.0, 7.0);
        b = map(p, 0.8575, 1.0, 0.0, 100.0);
    }

    return {r, g, b};
}

function mandlebrot(a, b, maxiterations){
    let ca = a;
    let cb = b;
    let n = 0.0;
    while (n < maxiterations) {
            let aa = a * a - b * b;
            let bb = 2.0 * a * b;
            a = aa + ca;
            b = bb + cb;
            if (a * a + b * b > 16.0) {
                break;
            }
            n += 1.0;
    }

    if (n == maxiterations){
        n = 0.0;
    }
    
    return calcColor(maxiterations, n);
}
