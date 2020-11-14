/**
 * setting webgl context
 */
export class GLUtilities {
    /**
     *
     * @param elementId HTMLElementId
     */
    static initialize(elementId?: string): HTMLCanvasElement {
        let canvas: HTMLCanvasElement;
        if (elementId !== undefined) {
            canvas = document.getElementById(elementId) as HTMLCanvasElement;
            if (!canvas) throw new Error(`Can not find canvas element id named: ${elementId}`);
        } else {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
        }
        gl = canvas.getContext('webgl2');
        if (gl === undefined) throw new Error('initial fail,Browser do not support?');
        return canvas;
    }
}
export var gl: WebGLRenderingContext;
