const CIRCLE_RADIUS = 5;
const PADDING = 10;

const SIZE = 600;
const MATRIX = 30;
const CELL_SIZE = SIZE / MATRIX;

let innerLine = true;
let fullLine = false;

let markers = [{x: 0, y: 0},{x: MATRIX-1,y: MATRIX-1},{x: MATRIX-1,y: 0},{x: 0,y: MATRIX-1}];

let context;

document.addEventListener('DOMContentLoaded', setup);

function rect(x, y, w, h){
    context.fillRect(x, y, w, h);
}

function fillCell(x, y, color){
    context.fillStyle = color;
    rect(x*CELL_SIZE, y*CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function line(x1, y1, x2, y2){
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function drawGrid(){
    context.strokeStyle = 'black';
    for(let i = 0; i < MATRIX; i++){
        line(i*CELL_SIZE, 0, i*CELL_SIZE, SIZE)
    }
    for(let i = 0; i < MATRIX; i++){
        line(0, i*CELL_SIZE, SIZE, i*CELL_SIZE)
    }
}

function circle(x, y, d){
    context.beginPath();
    context.arc(x, y, d/2, 0, Math.PI * 2, true);
    context.fill();
    context.stroke();
}

function drawMarkers(markers){
    for(let marker of markers){
        context.fillStyle = marker.selected ? 'red': 'white';
        circle(marker.x * CELL_SIZE + CELL_SIZE/2,
                marker.y * CELL_SIZE + CELL_SIZE/2,
                CELL_SIZE-4);  
    }
}

function drawLine(point1, point2, cellColor){

    if(Math.abs(point1.x - point2.x) < Math.abs(point1.y - point2.y)){
        lineRastr(point1.y, point1.x, point2.y, point2.x, true);
    }else{
        lineRastr(point1.x, point1.y, point2.x, point2.y, false);
    }

    function lineRastr(x0, y0, x1, y1, flipAxies){
        // swap points so x0 is at the left and x1 is right point
        if(x0 > x1){
            const x = x0;
            x0 = x1;
            x1 = x;

            const y = y0;
            y0 = y1;
            y1 = y;
        }
        let deltax = Math.abs(x1 - x0);
        let deltay = Math.abs(y1 - y0);
        let error = 0;
        let deltaerr = deltay;
        let y = y0

        // if y1 is lower then we should add +1 and -1 
        // if point is higher because coords lower at the top
        let diry = (y1 - y0 > 0) ? 1 : -1;

        for (let x = x0; x <= x1; x++){
            

            // flip axies if angle is greater then PI/4 or lower then -PI/4
            if(flipAxies){
                fillCell(y, x, cellColor);
            }else{
                fillCell(x, y, cellColor);
            }

            error = error + deltaerr;
            if (2 * error >= deltax){
                y = y + diry;
                error = error - deltax;
            }
        }
    }

    line(point1.x*CELL_SIZE+CELL_SIZE/2,
        point1.y*CELL_SIZE+CELL_SIZE/2,
        point2.x*CELL_SIZE+CELL_SIZE/2,
        point2.y*CELL_SIZE+CELL_SIZE/2);
}


function cohenSutherland (r, a, b){
    const LEFT  = 1;
    const RIGHT = 2;
    const BOT   = 4;
    const TOP   = 8;

    function vcode(r, p) {
        return (((p.x < r.x0) ? LEFT : 0)+
            ((p.x > r.x1) ? RIGHT : 0)+
            ((p.y < r.y0) ? BOT : 0)+
            ((p.y > r.y1) ? TOP : 0));
    }
    let code1, code2, code;
    let c;
    code1 = vcode(r, a);
    code2 = vcode(r, b);
    while (code1 | code2) {
        if (code1 & code2)
            return -1;

        if (code1){
            code = code1;
            c = a;
        } else {
            code = code2;
            c = b;
        }

        if (code & LEFT){
            c.y += (a.y - b.y) * (r.x0 - c.x) / (a.x - b.x);
            c.x = r.x0;
        } else if (code & RIGHT) {
            c.y += (a.y - b.y) * (r.x1 - c.x) / (a.x - b.x);
            c.x = r.x1;
        }
        else if (code & BOT) {
            c.x += (a.x - b.x) * (r.y0 - c.y) / (a.y - b.y);
            c.y = r.y0;
        } else if (code & TOP) {
            c.x += (a.x - b.x) * (r.y1 - c.y) / (a.y - b.y);
            c.y = r.y1;
        }

        if (code == code1) {
            a = c;
            code1 = vcode(r,a);
        } else {
            b = c;
            code2 = vcode(r,b);
        }
    }

    return 0;
}

function drawRect(point1, point2, marker1, marker2){
    context.fillStyle = 'rgba(0, 255, 0, 0.2)';
    const leftX = Math.min(point1.x, point2.x);
    const rightX = Math.max(point1.x, point2.x);
    const topY = Math.min(point1.y, point2.y);
    const bottomY = Math.max(point1.y, point2.y);


    rect(leftX*CELL_SIZE,
         topY*CELL_SIZE,
         Math.abs(point2.x - point1.x)*CELL_SIZE + CELL_SIZE,
         Math.abs(point2.y - point1.y)*CELL_SIZE + CELL_SIZE);

    context.strokeStyle = 'black';

    const cmarker1 = Object.assign({}, marker1);
    const cmarker2 = Object.assign({}, marker2);
    
    const res = cohenSutherland({x0: leftX, y0: topY, x1: rightX,  y1: bottomY}, cmarker1, cmarker2);

    if(res !== -1){
        cmarker1.x = Math.round(cmarker1.x);
        cmarker2.x = Math.round(cmarker2.x);
        cmarker1.y = Math.round(cmarker1.y);
        cmarker2.y = Math.round(cmarker2.y);
        
        if(innerLine){
            const innerColor = 'rgba(0, 0, 245, 0.8)';
            drawLine(cmarker1, cmarker2, innerColor);
        }
    }
}

function updateMarkers(markers){
    const cellColor = 'rgba(255, 0, 0, 0.8)';
    if(fullLine){
        drawLine(markers[0], markers[1], cellColor);
    }
    drawRect(markers[2], markers[3], markers[0], markers[1]);
}

function mapScreenToGrid(screenX, screenY){
    return {
        x: Math.floor(screenX / CELL_SIZE),
        y: Math.floor(screenY / CELL_SIZE)
    }
}

function clear(){
    context.fillStyle = 'white'
    context.fillRect(0, 0, SIZE, SIZE);
}

function setup(){
    const canvas = document.getElementById('canvas')
    canvas.width = SIZE;
    canvas.height = SIZE;
    context = canvas.getContext('2d');
    const innerButton = document.getElementById('inner-line');
    const fullButton =  document.getElementById('full-line');
    
    innerLine = innerButton.checked;
    fullLine = fullButton.checked;
    
    canvas.onclick = mousePressed;
    canvas.onmousemove = mouseMoved;
    
    innerButton.onclick = e => {
        innerLine = innerButton.checked;
        draw();
    };
    
    fullButton.onclick = ()=>{
        fullLine = fullButton.checked;
        draw();
    }
    draw();
}

function draw(){
    clear();
    updateMarkers(markers);
    drawMarkers(markers);
    drawGrid();
}

function mouseMoved(e){
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    let coords = mapScreenToGrid(mouseX, mouseY);

    for(let marker of markers){
        if(marker.selected){
            marker.x = coords.x;
            marker.y = coords.y;
        }
    }

    draw();
}

function mouseReleased(){
    for(let marker of markers){
        marker.selected = false;
    }
}

function mousePressed(e){
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    console.log('clicked');
    let coords = mapScreenToGrid(mouseX, mouseY);

    for(let marker of markers){
        if(!marker.selected && marker.x === coords.x && marker.y === coords.y){
            marker.selected = true;
        }else{
            marker.selected = false;
        }
    }

    draw();
}
