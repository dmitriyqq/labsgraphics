class Cam{
    constructor(){
        this.cameraPos = [0, 0, 0];
        this.target = [0, 0, 0];
        this.up = [0, -1, 0];
        this.right = [1, 0, 0];
        this.speed = 0.1;
        this.pitch = 0;
        this.yaw = 0;
        this.lastMouse = {x: 0, y: 0};
    }

    update(key){
        const speed = this.speed;
        switch(key){
            case 'w':
                this.cameraPos[2]+=speed; break;
            case 's':
                this.cameraPos[2]-=speed; break;
            case 'a':
                this.cameraPos[0]-=speed; break;
            case 'd':
                this.cameraPos[0]+=speed; break;
        }
        // console.log(this.camera.cameraPos)
    }

    getPosition(){
        return this.cameraPos;
    }

    getLookAtMatrix(){
        // const forward = math.subtract(this.cameraPos, this.target);
        let forward = [];
        forward[0] = Math.cos(this.pitch) * Math.cos(this.yaw);
        forward[1] = Math.sin(this.pitch);
        forward[2] = Math.cos(this.pitch) * Math.sin(this.yaw);

        forward = math.add(forward, this.cameraPos);

        const lenForward = Math.sqrt(forward[0] * forward[0]
                                   + forward[1] * forward[1]
                                   + forward[2] * forward[2]);
        forward[0] /= lenForward;
        forward[1] /= lenForward;
        forward[2] /= lenForward;
        const tmp = [0, 1, 0];
        const right = math.cross(tmp, forward);
        const up = math.cross(forward, right);
        const from = this.cameraPos;
        const A =  math.matrix([
            [right[0],   right[1],   right[2],   0],
            [up[0],      up[1],      up[2],      0],
            [-forward[0], -forward[1], -forward[2], 0],
            [0,          0,          0,          1],
        ]);
        const B =  math.matrix([
            [1, 0, 0, -from[0],],
            [0, 1, 0, -from[1],],
            [0, 0, 1, -from[2],],
            [0, 0, 0, 1,],
        ]);

        return math.multiply(A, B);
    }

}