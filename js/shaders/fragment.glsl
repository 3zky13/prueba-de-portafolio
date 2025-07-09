#ifdef GL_ES
precision mediump float;
#endif

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

