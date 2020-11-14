import { gl, GLUtilities } from './gl';
export class Engine {
    constructor() {
        console.log('hi ts engine');
    }
    private _count = 0;
    private _canvas: HTMLCanvasElement;
    start(): void {
        this._canvas = GLUtilities.initialize();
        gl.clearColor(0, 0, 0, 1);
        this.loop();
    }

    resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
        }
    }

    private loop(): void {
        // this._count++;
        // document.title = this._count.toString();
        gl.clear(gl.COLOR_BUFFER_BIT);
        requestAnimationFrame(this.loop.bind(this));
    }
}
