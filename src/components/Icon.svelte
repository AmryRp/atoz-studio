<script>
  export let name = 'arrow';
  export let size = 20;

  // Shared sharp icons: a 24px grid, square ends, and consistent bold strokes.
  const paths = {
    arrow: 'M5 19 19 5M5 5h14v14',
    right: 'M3 12h17m-7-7 7 7-7 7',
    down: 'M12 3v17m-7-7 7 7 7-7',
    box: 'm12 3 9 5v8l-9 5-9-5V8l9-5Zm0 9 9-4m-9 4-9-4m9 4v9',
    layers: 'm12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5',
    menu: 'M3 5h18M3 12h18M3 19h18',
    close: 'm5 5 14 14M5 19 19 5',
    play: 'm7 4 13 8-13 8V4Z',
    pause: 'M6 4h3v16H6zM15 4h3v16h-3z',
    reset: 'M4 10a8 8 0 1 1 1 8M4 3v7h7',
    'rotate-left': 'M4 10a8 8 0 1 1 1 8M4 3v7h7',
    'rotate-right': 'M20 10a8 8 0 1 0-1 8M20 3v7h-7',
    download: 'M12 3v12m-5-5 5 5 5-5M3 16v5h18v-5',
    check: 'm4 12 5 5L20 6',
    plus: 'M12 4v16M4 12h16',
    minus: 'M4 12h16',
    trash: 'M3 6h18M9 6V3h6v3M5 6v15h14V6M10 10v7m4-7v7',
    mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
    lock: 'M7 11V3h10v8M4 11h16v10H4zM12 15v2',
    star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z',
    asterisk: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4 18.4 5.6',
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill={name === 'play' || name === 'pause' ? 'currentColor' : 'none'}
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="square"
  stroke-linejoin="miter"
  aria-hidden="true"
  focusable="false"
>
  <path d={paths[name] || paths.arrow} />
</svg>

<style>
  svg {
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
  }
</style>
