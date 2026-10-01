<script>
  import { onMount } from 'svelte';
  import Icon from './Icon.svelte';
  export let project;
  export let onExplore;
  let root;
  let motion = false;
  let visible = true;

  onMount(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(pointer: fine)');
    motion = !preference.matches;
    let frame = 0, x = 0, y = 0;
    function update() {
      frame = 0;
      if (!root) return;
      const rect = root.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      root.style.setProperty('--pointer-x', motion ? x + 'px' : '0px');
      root.style.setProperty('--pointer-y', motion ? y + 'px' : '0px');
      root.style.setProperty('--scene-scroll', motion ? progress * 90 + 'px' : '0px');
      root.style.setProperty('--scene-turn', motion ? progress * -8 + 'deg' : '0deg');
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function move(event) {
      if (!motion || !visible || !pointer.matches) return;
      const rect = root.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width - .5) * 24;
      y = ((event.clientY - rect.top) / rect.height - .5) * 16;
      schedule();
    }
    function leave() { x = 0; y = 0; schedule(); }
    function visibility() { visible = !document.hidden && root.getBoundingClientRect().bottom > 0; }
    function preferenceChanged() { motion = !preference.matches; leave(); }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && !document.hidden; });
    observer.observe(root);
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    preference.addEventListener('change', preferenceChanged);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', schedule);
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', preferenceChanged);
    };
  });
</script>

<section id="home" class="scene-hero" class:motion-enabled={motion} class:scene-visible={visible} bind:this={root} aria-labelledby="hero-heading">
  <div class="scene-landscape" aria-hidden="true"></div>
  <div class="scene-shade" aria-hidden="true"></div>
  <div class="scene-object" aria-hidden="true">
    {#if project.poster}
      <img src={project.poster} alt="" width="1000" height="1000" fetchpriority="high" class="floating-art" />
    {:else}
      <div class="scene-model-placeholder"><Icon name="box" size={110} /><span>{project.title}</span></div>
    {/if}
  </div>
  <div class="scene-intro"><span class="scene-dot"></span> INDEPENDENT 3D ARTIST <span class="intro-divider">/</span> ATOZ STUDIO</div>
  <div class="scene-content">
    <h1 id="hero-heading">A little idea.<br />A whole new <em>world.</em></h1>
    <p>Custom 3D models, made for your imagination.<br class="desktop-break" /> Created in Blender. Brought to life in Substance Painter.</p>
    <div class="hero-actions">
      <a class="button primary" href="#contact">Let’s create together <Icon /></a>
      <a class="button secondary" href="#work">Explore the work <Icon name="right" /></a>
    </div>
  </div>
  <div class="scene-caption">
    <span>IN THE SPOTLIGHT</span>
    <button on:click={() => onExplore(project.id)}>{project.title} <Icon /></button>
    <small>{project.model ? 'Interactive model available' : 'Original AtoZ artwork · Still render'}</small>
  </div>
  <div class="scene-bottom">
    <button class="motion-toggle" aria-pressed={!motion} on:click={() => motion = !motion} aria-label={motion ? 'Pause scene motion' : 'Enable scene motion'}><Icon name={motion ? 'pause' : 'play'} size={14} /> {motion ? 'Pause motion' : 'Motion paused'}</button>
    <a href="#work" class="dive-link"><span>Scroll to<br />discover more</span><span class="down-arrow"><Icon name="down" size={32}/></span></a>
  </div>
</section>
