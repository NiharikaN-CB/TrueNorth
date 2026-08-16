import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [0, 0, 0];
}

export default function GradientWaves({
  horizonColor = '#E8D8D2',
  waveColor = '#C98F9A',
  crestColor = '#F8F1EA',
  speed = 0.15,
  amplitude = 1.7,
  waveScale = 0.6,
  waveRatio = 0.85,
  swell = 28.5,
  turbulence = 10.5,
  tilt = 1.05,
  zoom = 1,
  height = 5.5,
  fogDepth = 15,
  detail = 'medium',
  brightness = 0.85,
  opacity = 0.78,
  grain = true,
  grainIntensity = 0.13,
  mouseInteraction = true,
  parallaxStrength = 0.59
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create OGL Renderer
    const renderer = new Renderer({
      alpha: true,
      antialias: true
    });
    const gl = renderer.gl;
    containerRef.current.appendChild(gl.canvas);

    // Setup Camera
    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, height, 15);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();

    // Set grid resolution based on detail prop
    let gridResolution = 100;
    if (detail === 'low') gridResolution = 50;
    if (detail === 'high') gridResolution = 200;

    // Create Plane geometry representing wave field
    const position = [];
    const uv = [];
    const index = [];

    const size = 40;
    const segments = gridResolution;

    for (let i = 0; i <= segments; i++) {
      const z = (i / segments) * size - size / 2;
      for (let j = 0; j <= segments; j++) {
        const x = (j / segments) * size - size / 2;
        position.push(x, 0, z);
        uv.push(j / segments, i / segments);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = i * (segments + 1) + j + 1;
        const c = (i + 1) * (segments + 1) + j;
        const d = (i + 1) * (segments + 1) + j + 1;
        index.push(a, c, b);
        index.push(b, c, d);
      }
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(position) },
      uv: { size: 2, data: new Float32Array(uv) },
      index: { data: new Uint16Array(index) }
    });

    // Uniform values
    const uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uAmplitude: { value: amplitude },
      uWaveScale: { value: waveScale },
      uWaveRatio: { value: waveRatio },
      uSwell: { value: swell },
      uTurbulence: { value: turbulence },
      uTilt: { value: tilt * parallaxStrength },
      uZoom: { value: zoom },
      uHeight: { value: height },
      uMouse: { value: [0, 0] },
      uHorizonColor: { value: hexToRgb(horizonColor) },
      uWaveColor: { value: hexToRgb(waveColor) },
      uCrestColor: { value: hexToRgb(crestColor) },
      uFogDepth: { value: fogDepth },
      uBrightness: { value: brightness },
      uOpacity: { value: opacity },
      uGrainIntensity: { value: grainIntensity },
      uGrain: { value: grain ? 1.0 : 0.0 }
    };

    const vertexShader = `
      attribute vec3 position;
      attribute vec2 uv;

      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      uniform float uSpeed;
      uniform float uAmplitude;
      uniform float uWaveScale;
      uniform float uWaveRatio;
      uniform float uSwell;
      uniform float uTurbulence;
      uniform float uTilt;
      uniform float uZoom;
      uniform vec2 uMouse;

      varying vec2 vUv;
      varying float vHeight;
      varying vec3 vPosition;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vUv = uv;
        vec3 pos = position;
        
        vec2 wavePos = pos.xz * uWaveScale;
        float swellEffect = sin(wavePos.x * 0.1 + uTime * uSpeed) * uSwell * 0.05;
        float turb = noise(wavePos * uTurbulence * 0.05 + uTime * uSpeed) * uAmplitude;
        
        float waveHeight = (swellEffect + turb) * uWaveRatio;
        pos.y += waveHeight;
        
        vHeight = pos.y;
        vPosition = pos;
        
        vec3 finalPos = pos;
        finalPos.x += uMouse.x * uTilt;
        finalPos.y += uMouse.y * uTilt;
        finalPos.z *= uZoom;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform vec3 uHorizonColor;
      uniform vec3 uWaveColor;
      uniform vec3 uCrestColor;
      uniform float uFogDepth;
      uniform float uBrightness;
      uniform float uOpacity;
      uniform float uGrainIntensity;
      uniform float uTime;
      uniform float uGrain;

      varying vec2 vUv;
      varying float vHeight;
      varying vec3 vPosition;

      float random(vec2 co) {
        return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
        float h = clamp((vHeight + 1.0) / 2.0, 0.0, 1.0);
        vec3 color = mix(uWaveColor, uCrestColor, h);
        
        float depth = vPosition.z;
        float fog = clamp(depth / uFogDepth, 0.0, 1.0);
        color = mix(color, uHorizonColor, fog);
        
        color *= uBrightness;
        
        if (uGrain > 0.5) {
          float noiseVal = random(gl_FragCoord.xy + vec2(uTime)) * 2.0 - 1.0;
          color += noiseVal * uGrainIntensity;
        }
        
        gl_FragColor = vec4(color, uOpacity);
      }
    `;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
      transparent: true,
      depthTest: true
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    function resize() {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    }
    window.addEventListener('resize', resize, false);
    resize();

    const targetMouse = [0, 0];
    const currentMouse = [0, 0];
    function onMouseMove(event) {
      if (!mouseInteraction) return;
      const rect = gl.canvas.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouse[0] = x;
      targetMouse[1] = y;
    }
    window.addEventListener('mousemove', onMouseMove, false);

    let animationId;
    function update(t) {
      animationId = requestAnimationFrame(update);
      const time = t * 0.001;
      uniforms.uTime.value = time;

      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.05;
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.05;
      uniforms.uMouse.value = currentMouse;

      renderer.render({ scene, camera });
    }
    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas);
      }
    };
  }, [
    horizonColor,
    waveColor,
    crestColor,
    speed,
    amplitude,
    waveScale,
    waveRatio,
    swell,
    turbulence,
    tilt,
    zoom,
    height,
    fogDepth,
    detail,
    brightness,
    opacity,
    grain,
    grainIntensity,
    mouseInteraction,
    parallaxStrength
  ]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'absolute', 
        top: 0, 
        left: 0,
        overflow: 'hidden'
      }} 
    />
  );
}
