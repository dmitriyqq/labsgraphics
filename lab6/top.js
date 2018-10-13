class TopProjection{
    constructor(context){
        this.context = context;
        this.fpsPos = [0, 0, 0];
        this.rotatingPos = [0, 0, 0];
    }

    clear(){
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, SIZE, SIZE);    
    }

    updateFps(newPos){
        this.fpsPos = newPos;
    }

    updateRotating(newPos){
        this.rotatingPos = newPos;
    }

    update(){

    }

    draw(figure){
        this.clear();
        for(let edge of figure.edges){
            const v1 = figure.vertex[edge[0]];
            const v2 = figure.vertex[edge[1]];
            line(this.context, v1[0], v1[2], v2[0], v2[2]);
            // console.log(v1[0], v1[2], v2[0], v2[2])
        }

        this.context.fillStyle = "green";
        circle(this.context, this.fpsPos[0], this.fpsPos[2], 10);
        console.log(this.fpsPos[0])
        this.context.fillStyle = "blue";
        circle(this.context, this.rotatingPos[0], this.rotatingPos[2], 10);
    }
} 