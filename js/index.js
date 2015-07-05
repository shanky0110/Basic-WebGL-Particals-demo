//This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
//by Ethan Shulman

var width = 800;
var height = 600;

var vbuf;
var pstart;
var nump;

var canvasElement;
var gl;
window.onload = function() {
  canvasElement = document.getElementById("display");
  canvasElement.width = width;
  canvasElement.height = height;
  
  
gl = canvasElement.getContext("webgl");
  
if (!gl) {
    gl = canvasElement.getContext("experimental-webgl");
   
 if (!gl) alert("WebGL not supported!");
  }
  
  nump = 48000;
  pstart = new Float32Array(nump*2);
  var i = pstart.length;
  while (i--) {
    pstart[i] = 0;
    while (pstart[i]*pstart[i] < .3) {
      pstart[i] = Math.random()*2-1;
    }
  }
  
  vbuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,vbuf);
  gl.bufferData(gl.ARRAY_BUFFER,pstart,gl.STATIC_DRAW);
  
  var vsh = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vsh,
  "\nprecision mediump float;"+
  "attribute vec2 Vertex; varying vec2 V; uniform float T;"+
  "void main(void) {"+
  "gl_PointSize = 2.; V = Vertex;"+
  "vec2 v = Vertex*(mod(T+length(Vertex),1.));"+
  "float ct = (sin(v.x*30.+T*20.)+cos(v.y*30.+T*20.));"+
  "v = mat2(cos(v.x*(10.+ct)),tan(v.x*(10.+ct)),cos(v.y*(10.+ct)),sin(v.y*(10.+ct)))*v;"+
  "gl_Position=vec4(v,0.,1.);"+
  "}"               
                 );
  gl.compileShader(vsh);
  
  var fsh = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fsh,
  "\nprecision mediump float; varying vec2 V; uniform float T;"+
  "void main(void) {"+
  "gl_FragColor = vec4(1.,1.,1.,.05);}");
  
  gl.compileShader(fsh);
  
  var program = gl.createProgram();
  gl.attachShader(program,vsh);
  gl.attachShader(program,fsh);
  gl.linkProgram(program);
  gl.useProgram(program);
  
  var vattr = gl.getAttribLocation(program,"Vertex");
  gl.enableVertexAttribArray(vattr);
  gl.vertexAttribPointer(vbuf,2,gl.FLOAT,false,4,0);
  
  tuni = gl.getUniformLocation(program,"T");
  
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  
  gl.disable(gl.DEPTH_TEST);
  
  gl.clearColor(0,0,0,1);
  
  if (!window.requestAnimationFrame) window.requestAnimationFrame = setTimeout;
    
  startTime = Date.now();
  render();
}
                
 var tuni,startTime;      
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(tuni,(Date.now()-startTime)/30000.);
  gl.drawArrays(gl.POINTS,0,nump);
  
  window.requestAnimationFrame(render);
}