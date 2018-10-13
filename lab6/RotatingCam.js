class RotatingCam{
    constructor(onupdate){
        this.cameraPos = [0, 0, 0];
        this.target = [0, 0, 0];
        this.up = [0, -1, 0];
        this.right = [1, 0, 0];
        this.speed = 0.05;
        this.pitch = 0;
        this.yaw = 0;
        this.lastMouse = {x: 0, y: 0};
        this.R = 0.7;
        this.T = 0;
        this.onupdate = onupdate;
    }

    getPosition(){
        return this.cameraPos;
    }

    update(){
        this.T+=this.speed;
        const cost = Math.cos(this.T);
        const sint = Math.sin(this.T);
        this.cameraPos[0] = this.target[0] + this.R * cost;
        this.cameraPos[1] = this.target[1] - 0.5;
        this.cameraPos[2] = this.target[2] + this.R * sint;
        console.log(this.cameraPos[1]);
        this.onupdate();
    }

    getLookAtMatrix(){
        // const forward = math.subtract(this.cameraPos, this.target);
        let forward = math.subtract(this.cameraPos, this.target);
        const lenForward = Math.sqrt(forward[0] * forward[0]
                                   + forward[1] * forward[1]
                                   + forward[2] * forward[2]);
        forward[0] /= lenForward;
        forward[1] /= lenForward;
        forward[2] /= lenForward;
        const tmp = [0, -1, 0];
        const right = math.cross(tmp, forward);
        const up = math.cross(forward, right);
        // const from = this.cameraPos;
        const A =  math.matrix([
            [right[0],   right[1],   right[2],   0],
            [up[0],      up[1],      up[2],      0],
            [forward[0], forward[1], forward[2], 0],
            [0,          0,          0,          1],
        ]);
        const B =  math.matrix([
            [1, 0, 0, 0,],
            [0, 1, 0, 0,],
            [0, 0, 1, 0,],
            [0, 0, 0, 1,],
        ]);

        return math.multiply(A, B);
    }

}