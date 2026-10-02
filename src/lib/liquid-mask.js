// A lightweight liquid coating for the existing transparent Hannya artwork.
// The same renderer also supports a transparent, viewport-wide liquid layer.
const vertexSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform vec2 uFit;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uEnergy;
  uniform float uScreen;
  uniform vec2 uContact;
  uniform float uContactLevel;
  uniform float uContactAge;

  float surface(vec2 p) {
    float t = uTime * 0.48;
    // Intersecting slow currents create a poured, glossy film.
    float flow = sin(p.x * 14.0 + sin(p.y * 9.0 + t) * 1.8 - t);
    flow += sin(p.y * 19.0 + p.x * 5.0 + t * 1.4) * 0.5;
    flow += sin(p.x * 26.0 - p.y * 12.0 - t * 0.7) * 0.22;
    vec2 delta = p - uPointer;
    float distance = length(delta);
    float ripple = sin(distance * 46.0 - uTime * 5.0);
    float impactDistance = length((p - uContact) * vec2(1.0, 1.35));
    float front = smoothstep(0.0, 0.07, uContactAge * 0.2 - impactDistance);
    float wake = sin(impactDistance * 58.0 - uContactAge * 6.5);
    return flow * 0.34 + ripple * exp(-distance * 8.0) * uEnergy * 0.65
      + wake * exp(-impactDistance * 3.5) * uContactLevel * front * 0.65;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * uFit + 0.5;
    if (uScreen < 0.5 && (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0)) discard;
    vec4 original = texture2D(uImage, clamp(uv, 0.0, 1.0));
    if (uScreen < 0.5 && original.a < 0.01) discard;

    float height = surface(uv);
    vec2 slope = vec2(surface(uv + vec2(0.003, 0.0)) - height,
                      surface(uv + vec2(0.0, 0.003)) - height) / 0.003;
    // Refraction stays inside the original silhouette and preserves fine detail.
    vec2 offset = slope * (0.0007 + uEnergy * 0.00035);
    vec4 refracted = texture2D(uImage, clamp(uv + offset, 0.0, 1.0));
    vec3 base = mix(original.rgb, refracted.rgb, refracted.a * 0.65);
    vec3 normal = normalize(vec3(-slope * 0.12, 1.0));
    vec3 light = normalize(vec3(-0.5, 0.8, 1.1));
    vec3 halfway = normalize(light + vec3(0.0, 0.0, 1.0));
    float highlight = pow(max(dot(normal, halfway), 0.0), 28.0);
    float softLight = pow(max(dot(normal, halfway), 0.0), 5.0);
    float rim = pow(1.0 - max(normal.z, 0.0), 2.0);
    vec3 pearl = mix(vec3(0.69, 0.78, 1.0), vec3(1.0, 0.76, 0.9),
                     sin(height * 2.0 + uTime * 0.15) * 0.5 + 0.5);
    if (uScreen > 0.5) {
      // Transparent highlights let the actual HTML, including text, show through.
      float ribbon = pow(max(0.0, 1.0 - abs(height - 0.12) * 3.0), 8.0);
      float alpha = min(0.42, highlight * 0.24 + rim * 0.13 + ribbon * 0.16);
      float distanceToMask = length((uv - uContact) * vec2(1.0, 1.6));
      float caustic = pow(max(0.0, 1.0 - abs(height + 0.08) * 4.0), 9.0);
      caustic *= exp(-distanceToMask * 7.0) * uContactLevel;
      alpha = min(0.7, alpha + caustic * 0.7);
      vec3 film = mix(pearl, vec3(1.0, 0.97, 1.0), max(highlight, caustic));
      gl_FragColor = vec4(film * alpha, alpha);
      return;
    }
    // Red lacquer remains visible beneath the pearlescent liquid.
    vec3 color = base * (0.88 + softLight * 0.14);
    color += pearl * (highlight * 0.66 + rim * 0.24);
    color += vec3(1.0, 0.93, 0.87) * pow(highlight, 3.0) * 0.24;
    gl_FragColor = vec4(color * original.a, original.a);
  }
`;

export function createLiquidMask(canvas, image, interactionRoot, onError, options = {}) {
  const fullscreen = !!options.fullscreen;
  const gl = canvas.getContext('webgl', {
    alpha: true, premultipliedAlpha: true, antialias: false,
    depth: false, stencil: false, powerPreference: 'low-power',
  });
  if (!gl) throw new Error('WebGL is unavailable');
  const shaders = [];
  let program, buffer, texture;
  function release() {
    if (texture) gl.deleteTexture(texture);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach(shader => gl.deleteShader(shader));
  }
  function compile(type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Cannot allocate shader');
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
    }
    return shader;
  }
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Cannot link liquid shader');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (fullscreen) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }
    gl.uniform1f(gl.getUniformLocation(program, 'uScreen'), fullscreen ? 1 : 0);
    gl.uniform1i(gl.getUniformLocation(program, 'uImage'), 0);
  } catch (error) {
    release();
    throw error;
  }

  const uniforms = Object.fromEntries(['uFit', 'uPointer', 'uTime', 'uEnergy', 'uContact', 'uContactLevel', 'uContactAge']
    .map(name => [name, gl.getUniformLocation(program, name)]));
  const coarse = matchMedia('(pointer: coarse)').matches;
  const interval = 1000 / (coarse ? 30 : 45);
  let frame = 0, last = 0, time = 0, active = false, disposed = false;
  let fitX = 1, fitY = 1, energy = 0, targetEnergy = 0;
  let pointerX = 0.5, pointerY = 0.5, targetX = 0.5, targetY = 0.5;
  let strength = 1;
  let contactX = 0.5, contactY = 0.5, contactLevel = 0, targetContact = 0, contactStart = 0;

  function draw() {
    if (disposed || gl.isContextLost()) return;
    gl.uniform2f(uniforms.uFit, fitX, fitY);
    gl.uniform2f(uniforms.uPointer, pointerX, pointerY);
    gl.uniform1f(uniforms.uTime, time);
    gl.uniform1f(uniforms.uEnergy, energy);
    gl.uniform2f(uniforms.uContact, (contactX - 0.5) * fitX + 0.5, (contactY - 0.5) * fitY + 0.5);
    gl.uniform1f(uniforms.uContactLevel, contactLevel);
    gl.uniform1f(uniforms.uContactAge, Math.max(0, time - contactStart));
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    options.onDraw?.({ time, energy, strength, coarse });
  }
  function resize() {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height || disposed) return;
    const ratio = Math.min(devicePixelRatio || 1, coarse ? 1.25 : 1.5, 1200 / Math.max(width, height));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
    if (fullscreen) {
      fitX = width / height;
      fitY = 1;
    } else {
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      fitX = width / (image.naturalWidth * scale);
      fitY = height / (image.naturalHeight * scale);
    }
    draw();
  }
  function tick(now) {
    frame = 0;
    if (!active || disposed) return;
    if (!last) last = now;
    const elapsed = now - last;
    if (elapsed >= interval) {
      const delta = Math.min(elapsed / 1000, 0.06);
      last = now;
      time += delta;
      const ease = 1 - Math.exp(-delta * 8);
      pointerX += (targetX - pointerX) * ease;
      pointerY += (targetY - pointerY) * ease;
      energy += (targetEnergy - energy) * ease;
      contactLevel += (targetContact - contactLevel) * ease;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function setActive(value) {
    if (disposed || active === value) return;
    active = value;
    last = 0;
    if (active) frame = requestAnimationFrame(tick);
    else { cancelAnimationFrame(frame); frame = 0; targetEnergy = 0; }
  }
  function move(event) {
    if (!active || options.controlled) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;
    targetX = (x - 0.5) * fitX + 0.5;
    targetY = (y - 0.5) * fitY + 0.5;
    targetEnergy = x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 1 : 0;
  }
  function leave() { if (!options.controlled) targetEnergy = 0; }
  function contextLost() { setActive(false); onError(); }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  interactionRoot.addEventListener('pointermove', move, { passive: true });
  interactionRoot.addEventListener('pointerdown', move, { passive: true });
  interactionRoot.addEventListener('pointerleave', leave);
  interactionRoot.addEventListener('pointerup', leave);
  interactionRoot.addEventListener('pointercancel', leave);
  canvas.addEventListener('webglcontextlost', contextLost);
  resize();

  return {
    setActive,
    setContact(contact) {
      const next = contact.active ? 1 : 0;
      if (next && !targetContact) contactStart = time;
      targetContact = next;
      contactX = contact.x;
      contactY = contact.y;
      if (options.controlled) {
        targetEnergy = next;
        targetX = contact.x;
        targetY = contact.y;
      }
    },
    setStrength(value) {
      strength = Math.max(0, Math.min(1, value));
      if (!active) draw();
    },
    destroy() {
      setActive(false);
      disposed = true;
      observer.disconnect();
      interactionRoot.removeEventListener('pointermove', move);
      interactionRoot.removeEventListener('pointerdown', move);
      interactionRoot.removeEventListener('pointerleave', leave);
      interactionRoot.removeEventListener('pointerup', leave);
      interactionRoot.removeEventListener('pointercancel', leave);
      canvas.removeEventListener('webglcontextlost', contextLost);
      release();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
