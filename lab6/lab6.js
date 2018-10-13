const SIZE = 300; 
document.addEventListener('DOMContentLoaded', setup);
let rotatingCam;
let fpsCam;
let Figures = [];
let perspectiveProjA;
let perspectiveProjB;
let orthoProjA;
let orthoProjB;
let topProj;
let frontProj;

let Topes = [];
let lastMouse = {x: SIZE/2, y: SIZE/2};
let rotating = false;

let figure = {
    vertex: [
        // x y z
        [0, 0, 0.1],
        [0.5, 0, 0.1],
        [0.5, 0.5, 0.1],
        [0, 0.5, 0.1],
        [0, 0, 1],
        [0.5, 0, 1],
    ],
    edges: [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [0, 4],
        [4, 5],
        [5, 1],
    ]
}

function circle(context, x, y, r){
    x = map(x, -1.0, 1.0, 0, SIZE);
    y = map(y, -1.0, 1.0, 0, SIZE);
    context.beginPath();
    context.arc(x, y, r, 0, 2*Math.PI);
    context.fill();
}

function line(context, x1, y1, x2, y2){
    x1 = map(x1, -1.0, 1.0, 0, SIZE);
    x2 = map(x2, -1.0, 1.0, 0, SIZE);
    y1 = map(y1, -1.0, 1.0, 0, SIZE);
    y2 = map(y2, -1.0, 1.0, 0, SIZE);
    context.beginPath()
    context.moveTo(x1, y1);
    context.lineTo(x2, y2)
    context.stroke();
}

function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}

function setup(){
    fpsCam = new Cam();
    setInterval(() => {
        // console.log(rotatingCam);
        rotatingCam.update();
        draw();
    }, 100);
    
    const frontCanvas  = document.getElementById('front');
    const topCanvas  = document.getElementById('top');
    const perspectiveCanvasA  = document.getElementById('perspectiveFps');
    const perspectiveCanvasB  = document.getElementById('perspectiveRotating');
    const orthoCanvasA  = document.getElementById('orthographicFps');
    const orthoCanvasB  = document.getElementById('orthographicRotating');
    
    topCanvas.width = perspectiveCanvasB.width = perspectiveCanvasA.width = frontCanvas.width = SIZE;
    topCanvas.height = perspectiveCanvasB.height = perspectiveCanvasB.height = frontCanvas.height = SIZE;
    
    frontProj = new FrontProjection(frontCanvas.getContext('2d'), frontCanvas);
    topProj = new TopProjection(topCanvas.getContext('2d'), topCanvas);

    rotatingCam = new RotatingCam(() => {
        topProj.updateRotating(rotatingCam.getPosition());
        frontProj.updateRotating(rotatingCam.getPosition());
    });

    perspectiveProjA = new PerspectiveProjection(perspectiveCanvasA.getContext('2d'), fpsCam);
    perspectiveProjB = new PerspectiveProjection(perspectiveCanvasB.getContext('2d'), rotatingCam);
    
    perspectiveCanvasA.onmouseup = e => {
        fpsCam.rotating = false;
    }

    perspectiveCanvasA.onmousedown = e => {
        fpsCam.rotating = true;
        fpsCam.lastMouse = { x: e.clientX, y: e.clientY };
    }

    perspectiveCanvasA.onmousemove = e => {
        e.preventDefault();
        const dx = e.clientX - fpsCam.lastMouse.x;
        const dy = e.clientY - fpsCam.lastMouse.y;
        // console.log(dx, dy);
        const sens = 0.003;

        // if (rotating) {
        fpsCam.pitch += -sens * dy; //xoffset;
        if(fpsCam.pitch < -Math.PI/2)
            fpsCam.pitch = -Math.PI/2;
        if(fpsCam.pitch > Math.PI/2)
            fpsCam.pitch = Math.PI/2;
        fpsCam.yaw += sens * dx; //;
        // }

        draw();
        fpsCam.lastMouse = { x: e.clientX, y: e.clientY };
    }

    document.onkeydown = e => {
        fpsCam.update(e.key);
        topProj.updateFps(fpsCam.getPosition());
        frontProj.updateFps(fpsCam.getPosition());
        draw();
    }

    orthoProjA = new OrthographicProjection(orthoCanvasA.getContext('2d'), fpsCam)
    orthoProjB = new OrthographicProjection(orthoCanvasB.getContext('2d'), rotatingCam)
    
    const R = 0.2;
    const numPoints = 30;
    let frontPoints = [];
    let backPoints = [];
    let edges = [];
    for(let i = 0; i < 2*Math.PI; i+=2*Math.PI/numPoints){
        const x = R * Math.sin(i);
        const y = R * Math.cos(i);
        frontPoints.push([x, y, -0.1])
        backPoints.push([x, y, 0.1])
    }

    for(let i = 0; i < frontPoints.length-1; i++){
        edges.push([i, i+1]);
    }
    edges.push([0, 29])
    
    for(let i = 30; i < 30+backPoints.length-1; i++){
        edges.push([i, i+1]);
    }

    for(let i = 0; i < 30; i++){
        edges.push([i, i+30])
    }
    edges.push([30, 59]);
    let cyllinder = {};
    cyllinder.vertex = frontPoints.concat(backPoints);
    cyllinder.edges = edges;

    Figures.push(cyllinder);

    let xaxies = {
        vertex: [[-5, 0, 0], [5, 0, 0]],
        edges: [[0, 1]],
        color: 'blue' 
    }

    let yaxies = {
        vertex: [[0, -5, 0], [0, 5, 0]],
        edges: [[0, 1]],
        color: 'red'
    }

    let zaxies = {
        vertex: [[0, 0, -5], [0, 0, 5]],
        edges: [[0, 1]],
        color: 'green',
    }

    Figures.push(xaxies);
    Figures.push(yaxies);
    Figures.push(zaxies);
    draw();
}

function draw(){
    const projections = [
        perspectiveProjA, perspectiveProjB, topProj, frontProj, orthoProjA, orthoProjB
    ]
    for(let projection of projections){
        projection.clear();

        for(let figure of Figures){
            projection.context.strokeStyle = figure.color || 'black'; 
            projection.draw(figure)
        }

    }
}