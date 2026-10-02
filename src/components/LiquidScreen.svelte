<script>
  import { onMount } from 'svelte';
  export let motion = false;
  export let visible = true;
  export let intensity = 1;
  export let ready = false;
  export let contact = { active: false, x: 0.5, y: 0.5 };
  let canvas, noise, displacement, renderer;
  let mounted = false, started = false, disposed = false, failed = false;

  async function start() {
    started = true;
    try {
      const { createLiquidMask } = await import('../lib/liquid-mask');
      if (disposed) return;
      renderer = createLiquidMask(canvas, null, window, () => {
        ready = false;
        failed = true;
      }, {
        fullscreen: true,
        onDraw({ time, energy, strength, coarse }) {
          noise.setAttribute('baseFrequency',
            (0.007 + Math.sin(time * 0.18) * 0.001) + ' ' +
            (0.012 + Math.cos(time * 0.15) * 0.002));
          displacement.setAttribute('scale', String(strength * (coarse ? 6 : 10) * (1 + energy * 0.35)));
        },
      });
      ready = true;
    } catch {
      failed = true;
      ready = false;
    }
  }
  $: if (mounted && motion && visible && intensity > 0 && !started) start();
  $: renderer?.setContact(contact);
  $: renderer?.setStrength(intensity);
  $: renderer?.setActive(motion && visible && intensity > 0 && !failed);
  onMount(() => {
    mounted = true;
    return () => { disposed = true; renderer?.destroy(); };
  });
</script>

<div class="liquid-screen" class:ready style:opacity={ready ? intensity : 0} aria-hidden="true">
  <svg class="filter-definitions" xmlns="http://www.w3.org/2000/svg" focusable="false">
    <defs>
      <filter id="home-liquid-refraction" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
        <feTurbulence bind:this={noise} type="fractalNoise" baseFrequency="0.007 0.014" numOctaves="1" seed="8" result="liquidNoise" />
        <feDisplacementMap bind:this={displacement} in="SourceGraphic" in2="liquidNoise" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .liquid-screen { position: fixed; inset: 0; z-index: 4; pointer-events: none; overflow: hidden; visibility: hidden; }
  .liquid-screen.ready { visibility: visible; }
  canvas { display: block; width: 100%; height: 100%; }
  .filter-definitions { position: absolute; width: 0; height: 0; overflow: hidden; }
</style>
