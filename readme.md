loadShader(constructor:createProgram,detectAttributes)

->useProgram
一个 WebGLProgram 对象由两个编译过后的 WebGLShader 组成 - 顶点着色器和片段着色器（均由 GLSL 语言所写）。这些组合成一个可用的 WebGL 着色器程序。

->createBuffer
bindBuffer
bufferData
disableVertexAttribArray

物体是由一系列顶点组成的，每一个顶点都有位置和颜色信息。
第一步，要给这些顶点建立相应的颜色。首先我们要创建一个顶点颜色数组，然后将它们存在WebGL的缓冲区中。
色器可以从颜色缓冲区中取出颜色.清空画布然后画图
