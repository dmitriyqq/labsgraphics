const SIZE = 600; 
document.addEventListener('DOMContentLoaded', setup);
let context;
let model;
let imageData;

function setup(){
    const canvas  = document.getElementById('canvas');
    canvas.width  = SIZE;
    canvas.height = SIZE;
    context = canvas.getContext('2d');
    imageData = context.createImageData(SIZE, SIZE);
    model = new Model();
    loop();
}

function circle(x, y, r){
    context.beginPath();
    context.arc(x, y, r, 0, 2*Math.PI);
    context.stroke();
}

function clear(){
    context.fillStyle = 'white';
    context.fillRect(0, 0, SIZE, SIZE);    
}

function loop(){
    for(let i = 0; i < 200; i++){
        clear();
        if(model.ticks % 66 == 0){
            console.log(model.ticks);
        }
        model.update();
        if(model.ticks > 200000){
            setup();
        }
    }
    model.draw(imageData.data);
    context.putImageData(imageData, 0, 0);
    window.requestAnimationFrame(loop);
}

function draw(){
    clear();
}