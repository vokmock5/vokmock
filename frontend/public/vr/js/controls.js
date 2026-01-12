// Camera Controls
class CameraControls {
    constructor(camera) {
        this.camera = camera;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseMove(event) {
        this.mouseX = (event.clientX - this.windowHalfX) / 100;
        this.mouseY = (event.clientY - this.windowHalfY) / 100;
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
    }

    update() {
        this.targetX = this.mouseX * 0.3;
        this.targetY = this.mouseY * 0.2;

        this.camera.rotation.y += 0.05 * (this.targetX - this.camera.rotation.y);
        this.camera.rotation.x += 0.05 * (this.targetY - this.camera.rotation.x);
    }
}