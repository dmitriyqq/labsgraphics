class UI{
    constructor(client){
        this.client = client;
        this.transforms = [];
        this.box = document.getElementById('transforms-box');

        this.angleInput = document.getElementById('angle');
        this.xInput = document.getElementById('x');
        this.yInput = document.getElementById('y');
        this.dxInput = document.getElementById('dx');
        this.dyInput = document.getElementById('dy');
        this.sxInput = document.getElementById('sx');
        this.syInput = document.getElementById('sy');

        const addRotationButton = document.getElementById('add-rotation-button');
        const addTranslateButton = document.getElementById('add-translate-button');
        const addScaleButton = document.getElementById('add-scale-button');

        addRotationButton.onclick = () => {
            this.addTransform({type: 'rotate', x: +this.xInput.value, y: +this.yInput.value, angle: +this.angleInput.value});
        }
        
        addTranslateButton.onclick = () => {
            this.addTransform({type: 'translate', x: +this.dxInput.value, y: +this.dyInput.value});
        }
        
        addScaleButton.onclick = () => {
            this.addTransform({type: 'scale', x: +this.sxInput.value, y: +this.syInput.value});
        }

        this.deleteTransform = this.deleteTransform.bind(this);
        this.renderTransform = this.renderTransform.bind(this);
    }

    addTransform(transform){
        this.transforms.push(transform);
        this.updateViewBox();
    }

    deleteTransform(i){
        this.transforms.splice(i, 1);
        this.updateViewBox();
    }

    updateViewBox(){
        this.client(this.transforms);
        while (this.box.firstChild) {
            this.box.removeChild(this.box.firstChild);
        }

        this.transforms.map(this.renderTransform)
    }

    renderTransform(transform, i){
        const transformElement = document.createElement('div');

        const button = document.createElement('button');
        button.innerHTML = 'X';
        button.onclick = () => {
            this.deleteTransform(i);
        }

        const name = document.createElement('i');
        name.innerHTML = transform.type;

        const params = document.createElement('span');
        params.innerHTML = transform.type == 'rotate' ? 
        transform.angle+", " : "";
        params.innerHTML += transform.x + ", " + transform.y;

        transformElement.appendChild(button);
        transformElement.appendChild(name);
        transformElement.appendChild(params);
        this.box.appendChild(transformElement);
    }
}