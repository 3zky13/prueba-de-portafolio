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
// Reemplazar el fragment shader existente
const fragmentSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform float u_scroll;

  // Función de ruido
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    st.x *= u_resolution.x / u_resolution.y;
    
    // Mayor sensibilidad al scroll
    float scrollFactor = u_scroll * 0.5;
    
    // Efecto de ondas basado en mouse
    vec2 mousePos = u_mouse / u_resolution;
    float mouseDist = distance(st, mousePos);
    float wave = sin(mouseDist * 30.0 - u_time * 3.0) * 0.1;
    
    // Nuevo efecto de ondas concéntricas
    float ripple = sin((mouseDist * 40.0) - u_time * 5.0 + scrollFactor) * 0.5;
    
    // Efecto de distorsión sutil
    vec2 distortion = vec2(
      cos(st.y * 10.0 + u_time * 2.0) * 0.01,
      sin(st.x * 8.0 + u_time * 1.5) * 0.01
    );
    
    st += distortion;
    
    // Patrón de ruido para textura
    float n = noise(st * 10.0 + u_time * 0.5);
    n = smoothstep(0.3, 0.7, n);
    
    // Colores dinámicos con variación basada en posición y tiempo
    vec3 color = vec3(
      0.2 + ripple * 0.4 + st.x * 0.1, 
      0.3 + wave * 0.3 + st.y * 0.2, 
      0.6 - ripple * 0.2 + n * 0.1
    );
    
    // Añadir efecto de brillo basado en movimiento
    float glow = sin(u_time * 2.0 + st.x * 15.0) * 0.1 + 
                 cos(u_time * 1.7 + st.y * 12.0) * 0.1;
    color += vec3(glow * 0.5, glow * 0.3, glow * 0.7);
    
    // Ajuste final de color para ambos modos
    if (gl_FragCoord.x < u_resolution.x * 0.5) {
      color.r *= 1.2;
    } else {
      color.b *= 1.2;
    }
    
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

