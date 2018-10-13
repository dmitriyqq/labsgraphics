class OrthographicProjection extends PerspectiveProjection {
    constructor(context, camera){
        super(context, camera);
    }

    getProjectionMatrix(){
        return math.matrix(
        [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]);
    }
} 