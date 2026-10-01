<script>
  import { onMount } from 'svelte';
  export let src;
  export let motion = false;
  export let visible = true;
  export let interactionRoot;
  let canvas, renderer;
  let ready = false;
  let failed = false;
  let mounted = false;
  let started = false;
  let disposed = false;
  let textureImage;

  async function start() {
    started = true;
    try {
      const { createLiquidMask } = await import('../lib/liquid-mask');
      if (disposed) return;
      textureImage = new Image();
      textureImage.crossOrigin = 'anonymous';
      textureImage.src = src;
      await textureImage.decode();
      if (disposed) return;
      renderer = createLiquidMask(canvas, textureImage, interactionRoot, () => {
        failed = true;
        ready = false;
      });
      ready = true;
    } catch {
      // Keep the original artwork if the texture or WebGL cannot be used.
      failed = true;
    }
  }
  $: if (mounted && motion && visible && interactionRoot && !started) start();
  $: renderer?.setActive(motion && visible && !failed);

  onMount(() => {
    mounted = true;
    return () => {
      disposed = true;
      renderer?.destroy();
      if (textureImage && !textureImage.complete) textureImage.src = '';
    };
  });
</script>

<div class="liquid-mask floating-art" class:ready>
  <img {src} alt="" width="1000" height="1000" fetchpriority="high" />
  <canvas bind:this={canvas} aria-hidden="true"></canvas>
</div>

<style>
  .liquid-mask { position: relative; width: 100%; height: 100%; pointer-events: none; }
  img, canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
  img { object-fit: contain; }
  canvas { opacity: 0; }
  .ready canvas { opacity: 1; }
  .ready img { opacity: 0; }
</style>
