<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  import LiquidMask from './LiquidMask.svelte';
  export let project;
  export let onContact = (_contact) => {};
  export let motion = false;
  export let visible = true;
  export let intensity = 1;
  export let interactionRoot;
  export let offset = { x: 0, y: 0, scroll: 0, turn: 0 };

  let objectElement, surfaceElement;
  let hovered = false;
  let alphaSource = '', alphaPixels = null;
  $: submerged = motion && visible && intensity > 0 && hovered;
  $: if ((!motion || !visible || intensity <= 0) && hovered) reset();

  function publish(active) {
    hovered = active;
    const rect = surfaceElement?.getBoundingClientRect();
    onContact({ active, x: rect ? (rect.left + rect.width / 2) / document.documentElement.clientWidth : 0.5,
      y: rect ? 1 - (rect.top + rect.height / 2) / innerHeight : 0.5 });
  }
  function reset() { if (hovered) publish(false); }
  function hit(event) {
    if (!motion || !visible || intensity <= 0 || !interactionRoot?.contains(event.target)) return false;
    if (event.target.closest?.('a, button, input, select, textarea')) return false;
    const rect = objectElement.getBoundingClientRect();
    const image = objectElement.querySelector('img');
    const imageWidth = image?.naturalWidth || rect.width;
    const imageHeight = image?.naturalHeight || rect.height;
    const fit = Math.min(rect.width / imageWidth, rect.height / imageHeight);
    const width = imageWidth * fit, height = imageHeight * fit;
    const u = (event.clientX - rect.left - (rect.width - width) / 2) / width;
    const v = (event.clientY - rect.top - (rect.height - height) / 2) / height;
    if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;
    if (image?.complete && image.naturalWidth && alphaSource !== image.currentSrc) {
      alphaSource = image.currentSrc;
      alphaPixels = null;
      try {
        const sample = document.createElement('canvas');
        sample.width = sample.height = 64;
        const context = sample.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0, 64, 64);
        alphaPixels = context.getImageData(0, 0, 64, 64).data;
      } catch { /* Remote posters without CORS use the contained image bounds. */ }
    }
    return !alphaPixels || alphaPixels[(Math.floor(v * 64) * 64 + Math.floor(u * 64)) * 4 + 3] > 24;
  }
  onMount(() => {
    let touchDown = false;
    function move(event) {
      if (event.pointerType === 'touch' && !touchDown) return;
      const active = hit(event);
      if (active || hovered) publish(active);
    }
    function down(event) { touchDown = event.pointerType === 'touch'; move(event); }
    function up(event) { if (event.pointerType !== 'mouse') { touchDown = false; reset(); } }
    function cancel() { touchDown = false; reset(); }
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down, { passive: true });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('blur', cancel);
    window.addEventListener('resize', cancel);
    window.addEventListener('scroll', cancel, { passive: true });
    document.documentElement.addEventListener('pointerleave', cancel);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('blur', cancel);
      window.removeEventListener('resize', cancel);
      window.removeEventListener('scroll', cancel);
      document.documentElement.removeEventListener('pointerleave', cancel);
    };
  });
</script>

<div
  class="scene-floating-layer"
  class:submerged
  class:motion-enabled={motion}
  class:scene-visible={visible}
  aria-hidden="true"
  style:--pointer-x={(motion ? offset.x : 0) + 'px'}
  style:--pointer-y={(motion ? offset.y : 0) + 'px'}
  style:--scene-scroll={(motion ? offset.scroll : 0) + 'px'}
  style:--scene-turn={(motion ? offset.turn : 0) + 'deg'}
>
  <div class="scene-object" bind:this={objectElement}>
    <div class="surface-contact" bind:this={surfaceElement} style:opacity={intensity}>
      <div class="float-shadow"></div>
      <div class="surface-wake">
        <div class="surface-ripple"></div>
        <div class="surface-ripple delayed"></div>
        <div class="surface-ripple trailing"></div>
      </div>
    </div>
    {#if project.poster}
      <div class="floating-body">
        {#key project.poster}
          <LiquidMask src={project.poster} {motion} {visible} intensity={intensity * (submerged ? 1 : 0)} contact={{ active: submerged, x: 0.5, y: 0.45 }} {interactionRoot} />
        {/key}
      </div>
    {:else}
      <div class="floating-body">
        <div class="scene-model-placeholder floating-art"><Icon name="box" size={110} /><span>{project.title}</span></div>
      </div>
    {/if}
  </div>
</div>

<style>
  .scene-floating-layer { position: absolute; inset: 0; z-index: 5; pointer-events: none; overflow: hidden; }
  .scene-floating-layer.submerged { z-index: 3; }
  .scene-object { z-index: 1; perspective: 1000px; }
  .floating-body { position: absolute; inset: 0; z-index: 1; perspective: 1000px; transform: translateY(0) scale(1); transition: transform .85s cubic-bezier(.2,.7,.2,1); }
  .submerged .floating-body { transform: translateY(38px) scale(.96) rotateX(7deg); }
  .scene-floating-layer.submerged :global(.floating-art) { animation-play-state: paused !important; }
  .surface-contact { position: absolute; left: 28%; top: 88%; width: 48%; height: 12%; }
  .float-shadow { position: absolute; left: 14%; top: 18%; width: 72%; height: 42%; border-radius: 50%; background: radial-gradient(ellipse, #26153770, #39254832 45%, transparent 73%); filter: blur(9px); transform: scale(1); }
  .surface-wake { position: absolute; inset: 0; opacity: 0; transition: opacity .65s ease; }
  .submerged .surface-wake { opacity: 1; }
  .surface-ripple { position: absolute; inset: -7% 0 0; border: 1px solid #f6eaffbb; border-radius: 50%; box-shadow: 0 1px 0 #66418b30, inset 0 1px 0 #ffffff35; opacity: .3; transform: scale(.8); }
  .delayed { inset: -27% -12% -20%; opacity: .15; }
  /* Motion stays off for reduced-motion users until they explicitly enable it. */
  .motion-enabled .float-shadow { animation: floating-shadow 8s ease-in-out infinite !important; animation-play-state: paused !important; }
  .motion-enabled .surface-ripple { animation: floating-ripple 3s ease-out infinite !important; animation-play-state: paused !important; }
  .motion-enabled .surface-ripple.delayed { animation-delay: -1s !important; }
  .motion-enabled .surface-ripple.trailing { animation-delay: -2s !important; }
  .motion-enabled.scene-visible .float-shadow, .motion-enabled.scene-visible .surface-ripple { animation-play-state: running !important; }
  .submerged .float-shadow { animation: none !important; transform: scale(1.18); opacity: .35; }
  @media(prefers-reduced-motion:reduce) {
    .motion-enabled .floating-body { transition: transform .85s cubic-bezier(.2,.7,.2,1) !important; }
    .motion-enabled .surface-wake { transition: opacity .65s ease !important; }
  }
  @keyframes floating-shadow {
    0%, 100% { transform: scale(1); opacity: .8; }
    50% { transform: scale(.83); opacity: .48; }
  }
  @keyframes floating-ripple {
    0% { transform: scale(.64); opacity: 0; }
    18% { opacity: .42; }
    100% { transform: scale(1.3); opacity: 0; }
  }
  @media(max-width:720px) {
    .surface-contact { top: 83%; left: 30%; width: 46%; height: 9%; }
    .float-shadow { filter: blur(6px); }
  }
</style>
