import { gl } from './gl';
export class Shader {
    private _name: string;
    private _program: WebGLProgram;

    /**
     * new shader constructor
     * @param name name of this shader
     * @param vertexSource resource of vertex shader
     * @param fragmentSource resource of fragment shader
     */
    constructor(name: string, vertexSource, fragmentSource) {
        this._name = name;
        let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);
        console.log(vertexShader, 'vertexShader');
        console.log(fragmentShader, 'fragmentShader');
        this.createProgram(vertexShader, fragmentShader);
        this.use();
    }

    get name() {
        return this._name;
    }

    use(): void {
        gl.useProgram(this._program);
    }
    private loadShader(source: string, shaderType: number): WebGLShader {
        let shader: WebGLShader = gl.createShader(shaderType);
        // if()
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let error = gl.getShaderInfoLog(shader);
        if (error) {
            throw new Error("Error compiling shader '" + this._name + "': " + error + '  ' + shaderType + '   ' + source);
        }
        return shader;
    }
    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = gl.createProgram();
        //attachShader 添加一个着色器
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);
        let error = gl.getProgramInfoLog(this._program);
        if (error) {
            throw new Error('link program Error' + error);
        }
    }
}
