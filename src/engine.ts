import { gl, GLUtilities } from './core/gl/gl';
import { Shader } from './core/gl/shader';
export class Engine {
    constructor() {
        console.log('hi ts engine');
    }
    private _count = 0;
    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _buffer: WebGLBuffer;

    start(): void {
        this._canvas = GLUtilities.initialize();
        gl.clearColor(0, 0, 0, 1);
        this.loadShader();
        this._shader.use();
        this.createBuffer();
        this.resize();
        this.loop();
    }

    resize(): void {
        if (this._canvas) {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
        }
        gl.viewport(0, 0, window.innerWidth, window.innerHeight); //坐标标准化
    }

    private loop(): void {
        this._count++;
        document.title = this._count.toString();
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(this.loop.bind(this));
    }

    private createBuffer(): void {
        this._buffer = gl.createBuffer();
        let vertices = [
            //x,y,z
            0,
            0,
            0,
            0,
            0.5,
            0,
            0.5,
            0.5,
            0,
        ];
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, undefined);
        gl.disableVertexAttribArray(0);
    }

    private loadShader(): void {
        let vertexShaderSource = `
        attribute vec3 a_position;
        void main() {
            gl_Position = vec4(a_position, 1.0);
        }
        `;
        let fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
        `;
        this._shader = new Shader('base', vertexShaderSource, fragmentShaderSource);
    }
}
