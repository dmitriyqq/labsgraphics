class FrontProjection{
    constructor(context){
        this.context = context;
        this.fpsPos = [0, 0, 0];
        this.rotatingPos = [0, 0, 0];
    }

    clear(){
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, SIZE, SIZE);    
    }

    update(){
        
    }

    updateFps(newPos){
        this.fpsPos = newPos;
    }

    updateRotating(newPos){
        this.rotatingPos = newPos;
    }

    draw(figure){
        for(let edge of figure.edges){
            const v1 = figure.vertex[edge[0]];
            const v2 = figure.vertex[edge[1]];
            line(this.context, v1[0], v1[1], v2[0], v2[1]);
        }

        
        this.context.fillStyle = "green";
        circle(this.context, this.fpsPos[0], this.fpsPos[1], 10);
        this.context.fillStyle = "blue";
        circle(this.context, this.rotatingPos[0], this.rotatingPos[1], 10);
    }
} 