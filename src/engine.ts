import { gl, GLUtilities } from './core/gl/gl';
import { Shader } from './core/gl/shader';
import { GLBuffer, AttributeInfo } from './core/gl/glBuffer';
export class Engine {
    constructor() {
        console.log('hi ts engine');
    }
    private _count = 0;
    private _canvas: HTMLCanvasElement;
    private _shader: Shader;
    private _buffer: GLBuffer;
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
        gl.clear(gl.COLOR_BUFFER_BIT);
        this._buffer.bind();
        this._buffer.draw();
        requestAnimationFrame(this.loop.bind(this));
    }

    private createBuffer(): void {
        //3: x,y,z
        this._buffer = new GLBuffer(3);
        let positionAttribute = new AttributeInfo();
        positionAttribute.location = this._shader.getAttributeLocation('a_position');
        positionAttribute.offset = 0;
        positionAttribute.size = 3;
        this._buffer.addAttributeLocation(positionAttribute);
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
        this._buffer.pushBackData(vertices);
        this._buffer.upload();
        this._buffer.unbind();
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
