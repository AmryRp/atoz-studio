<script>
  import Icon from './Icon.svelte';
  import LiquidMask from './LiquidMask.svelte';
  export let project;
  export let motion = false;
  export let visible = true;
  export let intensity = 1;
  export let interactionRoot;
  export let offset = { x: 0, y: 0, scroll: 0, turn: 0 };

</script>

<div
  class="scene-floating-layer"
  class:motion-enabled={motion}
  class:scene-visible={visible}
  aria-hidden="true"
  style:--pointer-x={(motion ? offset.x : 0) + 'px'}
  style:--pointer-y={(motion ? offset.y : 0) + 'px'}
  style:--scene-scroll={(motion ? offset.scroll : 0) + 'px'}
  style:--scene-turn={(motion ? offset.turn : 0) + 'deg'}
>
  <div class="scene-object">
    <div class="surface-contact" style:opacity={intensity}>
      <div class="float-shadow"></div>
      <div class="surface-ripple"></div>
      <div class="surface-ripple delayed"></div>
    </div>
    {#if project.poster}
      <div class="floating-body">
        {#key project.poster}
          <LiquidMask src={project.poster} {motion} {visible} {intensity} {interactionRoot} />
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
  .scene-object { z-index: 1; perspective: 1000px; }
  .floating-body { position: absolute; inset: 0; z-index: 1; perspective: 1000px; }
  .surface-contact { position: absolute; left: 28%; top: 88%; width: 48%; height: 12%; }
  .float-shadow { position: absolute; left: 14%; top: 18%; width: 72%; height: 42%; border-radius: 50%; background: radial-gradient(ellipse, #26153770, #39254832 45%, transparent 73%); filter: blur(9px); transform: scale(1); }
  .surface-ripple { position: absolute; inset: -7% 0 0; border: 1px solid #f6eaff75; border-radius: 50%; box-shadow: 0 1px 0 #66418b30, inset 0 1px 0 #ffffff35; opacity: .3; transform: scale(.8); }
  .delayed { inset: -27% -12% -20%; opacity: .15; }
  /* Motion stays off for reduced-motion users until they explicitly enable it. */
  .motion-enabled .float-shadow { animation: floating-shadow 8s ease-in-out infinite !important; animation-play-state: paused !important; }
  .motion-enabled .surface-ripple { animation: floating-ripple 6s ease-out infinite !important; animation-play-state: paused !important; }
  .motion-enabled .surface-ripple.delayed { animation-delay: -3s !important; }
  .motion-enabled.scene-visible .float-shadow, .motion-enabled.scene-visible .surface-ripple { animation-play-state: running !important; }
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
