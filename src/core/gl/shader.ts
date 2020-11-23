import { gl } from './gl';
export class Shader {
    private _name: string;
    private _program: WebGLProgram;
    private _attributes: { [name: string]: number } = {};

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
        this.createProgram(vertexShader, fragmentShader);
        this.detectAttributes();
    }
    /**
     * get name of shader
     */
    get name() {
        return this._name;
    }

    use(): void {
        gl.useProgram(this._program);
    }
    /**
     * get location of attribute with the provided name
     * @param name
     */
    getAttributeLocation(name: string): number {
        if (!this._attributes) {
            throw new Error(`Unable find attribute ${name}`);
        }
        return this._attributes[name];
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
    private detectAttributes() {
        let attributes = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES); // return all active attributes
        for (let i = 0; i < attributes; i++) {
            let attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            if (!attributeInfo) break;
            this._attributes[attributeInfo.name] = gl.getAttribLocation(this._program, attributeInfo.name);
        }
    }
}
