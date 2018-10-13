class PerspectiveProjection extends FrontProjection{
    constructor(context, cam){
        super();
        this.camera = cam;
        this.context = context;
        this.far = 100;
        this.aspect = 1;
        this.near = 0.1;
        this.speed = 0.1;
        this.fov = Math.PI / 3;
    }

    // update(key){
    //     const speed = this.speed;
    //     switch(key){
    //         case 'w':
    //             this.camera.cameraPos[2]+=speed; break;
    //         case 's':
    //             this.camera.cameraPos[2]-=speed; break;
    //         case 'a':
    //             this.camera.cameraPos[0]-=speed; break;
    //         case 'd':
    //             this.camera.cameraPos[0]+=speed; break;
    //     }
    //     // console.log(this.camera.cameraPos)
    // }

    getProjectionMatrix(){
        const m00 = 1 / (this.aspect * Math.tan(this.fov / 2));
        const m11 = 1 / Math.tan(this.fov / 2);
        const m22 = -(this.far + this.near)/(this.far - this.near);
        const m23 = (-2*this.far*this.near)/(this.far - this.near);
        // console.log(m00, m11, m22, m23);
        return math.matrix([
            [m00, 0, 0, 0],
            [0, m11, 0, 0,],
            [0, 0, m22, m23],
            [0, 0, -1, 0],
        ]);
    }

    clear(){
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, SIZE, SIZE);    
    }

    draw(figure){
        this.figure = figure;
        const mat = math.multiply(this.getProjectionMatrix(), this.camera.getLookAtMatrix());
        for(let edge of figure.edges){
            let v1 = math.matrix([figure.vertex[edge[0]].concat([1])]);
            let v2 = math.matrix([figure.vertex[edge[1]].concat([1])]);
            // console.log(JSON.stringify(v1._data));
            // console.log(JSON.stringify(v2._data));
            v1 = math.multiply(v1, mat)._data[0];
            v2 = math.multiply(v2, mat)._data[0];
            // console.log(JSON.stringify(v1));
            // console.log(JSON.stringify(v2));
            line(this.context, v1[0], v1[1], v2[0], v2[1]);
        }

    }
} 