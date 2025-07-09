// ================================
// 🌌 SHADER WEBGL INTERACTIVO
// ================================

const canvas = document.getElementById('shader-canvas');
const gl = canvas.getContext('webgl');

// 📏 Ajuste del canvas al tamaño de la ventana
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 🔧 Compilación de shaders
function createShader(type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(vShader, fShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program error:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

// 🎨 Vertex shader (simple)
const vertexSource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// 🌈 Fragment shader reactivo
const fragmentSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_scroll;

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;

    vec2 m = u_mouse / u_resolution;
    float dist = distance(st, m) * 30.0;

    float scrollFactor = u_scroll * 0.2;
    float wave = sin(st.x * 10.0 + dist + u_time * 2.0 + scrollFactor);

    vec3 color = vec3(0.1 + wave * 0.3, 0.4 + wave * 0.2, 0.7 - wave * 0.1);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
const program = createProgram(vertexShader, fragmentShader);

// 🧠 Atributos y buffers
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
const mouseUniformLocation = gl.getUniformLocation(program, 'u_mouse');
const scrollUniformLocation = gl.getUniformLocation(program, 'u_scroll');

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

// 🖱️ Mouse y scroll tracking
let mouse = { x: 0, y: 0 };
let scrollY = 0;

document.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = canvas.height - e.clientY; // invertido para WebGL
});

document.addEventListener('scroll', () => {
  scrollY = window.scrollY;
}, { passive: true });

// 🌀 Animación
function render(time) {
  time *= 0.001;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
  gl.uniform1f(timeUniformLocation, time);
  gl.uniform2f(mouseUniformLocation, mouse.x, mouse.y);
 gl.uniform1f(scrollUniformLocation, scrollY * 0.01);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

