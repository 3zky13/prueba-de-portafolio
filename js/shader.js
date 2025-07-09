// ================================
// 🌌 SHADER WEBGL – FONDO ANIMADO
// ================================

const canvas = document.getElementById('shader-canvas');
const gl = canvas.getContext('webgl');

// Ajustar tamaño del canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Crear y compilar shaders
function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Error compilando shader:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

// Crear programa WebGL
function createProgram(vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Error enlazando programa:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

// Vertex shader (simple)
const vertexSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// Fragment shader (ondas animadas)
const fragmentSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    float color = 0.0;
    color += sin(st.x * 10.0 + u_time) * 0.5;
    color += sin(st.y * 10.0 + u_time) * 0.5;

    gl_FragColor = vec4(vec3(0.1 + color * 0.5), 1.0);
  }
`;

const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
const program = createProgram(vertexShader, fragmentShader);

// Atributos y uniformes
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
const timeUniformLocation = gl.getUniformLocation(program, 'u_time');

// Buffer de posición
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]),
  gl.STATIC_DRAW
);

// Animación
function render(time) {
  time *= 0.001; // ms → s

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.uniform1f(timeUniformLocation, time);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
