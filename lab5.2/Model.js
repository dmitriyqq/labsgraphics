const r = () => (Math.floor(255*Math.random()));

function line(x1, y1, x2, y2){
    context.beginPath()
    context.moveTo(x1, y1);
    context.lineTo(x2, y2)
    context.stroke();
}

class Particle{
    constructor(){
        this.speed = 0.3;
        this.length = 30;
        this.x = Math.floor(SIZE * Math.random());
        this.y = Math.floor(SIZE * Math.random());
        this.lastX = this.x;
        this.lastY = this.y; 
        this.angle = 2 * Math.PI * Math.random();
        this.vx = 0;
        this.vy = 0;
        this.color = {r: r(), g: r(), b: r()};
        this.currentLength = 0;
        this.age = 0;
        this.turnage = 100;
        this.segments = new Queue();
    }

    turn(){
        this.angle += Math.random() > 0.5 ? Math.PI/6 : -Math.PI/6;
    }

    update(grid, used){
        this.age++;
        if(this.age > this.turnage){
            this.age = 0;
            this.turn();
        }

        this.vx = this.speed * Math.cos(this.angle);
        this.vy = this.speed * Math.sin(this.angle);

        this.x += this.vx;
        this.y += this.vy;

        const x = Math.floor(this.x);
        const y = Math.floor(this.y);

        if(this.x < 0 || this.x >= SIZE || this.y < 0 || this.y >= SIZE) return false;
        
        if(this.lastX != x || this.lastY != y){
            if(used[x][y] != 0) return false;
            this.lastX = x;
            this.lastY = y;
            this.segments.enqueue({x, y});
            grid[x][y] = this.color;

            if(this.segments.getLength() > 10){
                const segment = this.segments.dequeue();
                grid[segment.x][segment.y] = 0;
            }
        }
        return true;
    }

    draw(data){
        // // const time = new Date();
        // const segments = this.segments.toArray();
        // console.log(segments.length);
        // for(let pos of segments){
        //     if(!pos) return;
        //     const pixelIndex = ((pos.y * (SIZE * 4)) + (pos.x * 4));
        //     data[pixelIndex] = this.color.r;
        //     data[pixelIndex+1] = this.color.g;
        //     data[pixelIndex+2] = this.color.b;
        //     data[pixelIndex+3] = 255;
        // }
        // // const delta = new Date() - time;
        // // console.log(delta + 'ms');
    }

}

class Model{
    constructor(){
        this.grid = [];
        this.used = [];

        for(let i = 0; i < SIZE; i++){
            this.grid[i] = []
            this.used[i] = [];
            for(let j = 0; j < SIZE; j++){
                this.grid[i][j] = 0;
                this.used[i][j] = 0;
            }
        }
        this.ticks = 0;
        this.activeParticles = [];
        for(let i = 0; i < 100; i++){
            this.activeParticles.push(new Particle());
        }
    }

    update(){
        this.ticks++;
        for(let i = this.activeParticles.length - 1; i >= 0; i--){
            const particle = this.activeParticles[i];
            if(!particle.update(this.grid, this.used)){
                let segments = particle.segments;
                while(!segments.isEmpty()){
                    const seg = segments.dequeue();
                    this.used[seg.x][seg.y] = 1;
                }
                this.activeParticles[i] = new Particle();
            }
        }
    }

    draw(data){
        const grid = this.grid;
        for(let y = 0; y < SIZE; y++){
            for(let x = 0; x < SIZE; x++){
                let pixelColor = grid[x][y];
                const pixelIndex = ((y * (SIZE * 4)) + (x * 4));

                if(pixelColor == 0){
                    data[pixelIndex]   = 0;
                    data[pixelIndex+1] = 0;
                    data[pixelIndex+2] = 0;
                    data[pixelIndex+3] = 255;
                    continue;    
                }

                data[pixelIndex]   = pixelColor.r;
                data[pixelIndex+1] = pixelColor.g;
                data[pixelIndex+2] = pixelColor.b;
                data[pixelIndex+3] = 255;
            }
        }
    }
}