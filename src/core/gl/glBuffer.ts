import { runInThisContext } from 'vm';
import { gl } from './gl';
/**
 * Represents the information needed for a GLBuffer attribute.
 */
export class AttributeInfo {
    public location: number;
    public size: number;
    /**
     * The number of element from the beginning of the buffer
     */
    public offset: number;
}
/**
 *  Represent a gl buffer
 */
export class GLBuffer {
    private _hasAttributeLocation: boolean = false;
    private _elementSize: number;
    private _stride: number; //大步
    private _buffer: WebGLBuffer;
    private _targetBufferType: number;
    private _dataType: number;
    private _mode: number;
    private _typeSize: number;
    private _data: number[] = [];
    private _attributes: AttributeInfo[] = [];
    /**
     * creates a new GL buffer
     * @param elementSize the size of each ele in buffer
     * @param dataType the data type of this buffer.Default:gl.FlOAT
     * @param targetBufferType The buffer target type. Can be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER.Default:ARRAY_BUFFER
     * @param mode drawing mode of buffer (i,e gl.TRIANGLES);
     */
    constructor(elementSize: number, dataType: number = gl.FLOAT, targetBufferType: number = gl.ARRAY_BUFFER, mode: number = gl.TRIANGLES) {
        this._elementSize = elementSize;
        this._dataType = dataType;
        this._targetBufferType = targetBufferType;
        this._mode = mode;
        //determine type size 确定type
        switch (this._dataType) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._typeSize = 4;
                break;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._typeSize = 2;
                break;
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._typeSize = 1;
                break;

            default:
                throw new Error('Unrecognized data type: ' + dataType.toString());
        }
        this._stride = this._elementSize * this._typeSize;
        this._buffer = gl.createBuffer();
    }

    public destroy(): void {
        gl.deleteBuffer(this._buffer);
    }
    /**
     *
     * @param normalized indicate if the data should be normalized
     */
    public bind(normalized: boolean = false): void {
        gl.bindBuffer(this._targetBufferType, this._buffer);
        if (this._hasAttributeLocation) {
            for (let item of this._attributes) {
                /**
                 * 告诉显卡从当前绑定的缓冲区（bindBuffer()指定的缓冲区）中读取顶点数据
                 * WebGL API 的WebGLRenderingContext.vertexAttribPointer()方法绑定当前缓冲区范围到gl.ARRAY_BUFFER,成为当前顶点缓冲区对象的通用顶点属性并指定它的布局(缓冲区对象中的偏移量)。
                 *location 指定要修改的顶点属性的索引。
                 * 指定每个顶点属性的组成数量，必须是1，2，3或4。
                 * size: 指定每个顶点属性的组成数量，必须是1，2，3或4。
                 * type: 数组中每个元素的数据类型
                 * normalized: 当转换为浮点数时是否应该将整数数值归一化到特定的范围。
                 * stride:一个GLsizei，以字节为单位指定连续顶点属性开始之间的偏移量(即数组中一行长度)。不能大于255。如果stride为0，则假定该属性是紧密打包的，即不交错属性，每个属性在一个单独的块中，下一个顶点的属性紧跟当前顶点之后。
                 * offset: GLintptr指定顶点属性数组中第一部分的字节偏移量。必须是类型的字节长度的倍数。
                 * */
                gl.vertexAttribPointer(item.location, item.size, this._dataType, normalized, this._stride, item.offset * this._typeSize);
                gl.enableVertexAttribArray(item.location);
            }
        }
    }

    unbind(): void {
        for (let item of this._attributes) {
            gl.disableVertexAttribArray(item.location);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
    }
    /**
     * add an attribute to buffer
     * @param info The information to be added
     */
    addAttributeLocation(info: AttributeInfo): void {
        this._hasAttributeLocation = true;
        this._attributes.push(info);
    }

    /**
     * add data to buffer
     * @param data
     */
    pushBackData(data: number[]): void {
        gl.bindBuffer(this._targetBufferType, this._buffer);
        for (let d of data) {
            this._data.push(d);
        }
    }
    upload(): void {
        let bufferData: ArrayBuffer;
        console.log(this._dataType, 'this._dataType');
        switch (this._dataType) {
            case gl.FLOAT:
                bufferData = new Float32Array(this._data);
                break;
            case gl.INT:
                bufferData = new Int32Array(this._data);
                break;
            case gl.UNSIGNED_INT:
                bufferData = new Uint32Array(this._data);
                this._typeSize = 4;
                break;
            case gl.SHORT:
                bufferData = new Int16Array(this._data);
                break;
            case gl.UNSIGNED_SHORT:
                bufferData = new Uint16Array(this._data);
                this._typeSize = 2;
                break;
            case gl.BYTE:
                bufferData = new Int8Array(this._data);
                break;
            case gl.UNSIGNED_BYTE:
                bufferData = new Uint8Array(this._data);
                this._typeSize = 1;
                break;
        }
        console.log(bufferData, 'bufferData');
        gl.bufferData(this._targetBufferType, bufferData, gl.STATIC_DRAW);
    }
    draw(): void {
        // console.log(this._data);
        if (this._targetBufferType === gl.ARRAY_BUFFER) {
            // this._data.length/this._elementSize how many else we have from total array
            // console.log('draw');
            gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
        } else if (this._targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
            gl.drawElements(this._mode, this._data.length, this._dataType, 0);
        }
    }
}
