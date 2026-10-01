<script>
 import { onDestroy } from 'svelte';
 import Icon from './Icon.svelte';
 export let project;
 let surface, engine, loading=false, loaded=false, error='', progress=null, stats=null, rotating=false, disposed=false, loadId=0;
 let colors=['#d4fa74','#8bafff','#ff7868'];
 async function open(){const id=++loadId;loading=true;error='';try{const {createViewer}=await import('../lib/viewer');if(disposed||id!==loadId)return;const result=await createViewer(surface,project.model,{onProgress:p=>progress=p,onStats:s=>stats=s,onError:e=>error=e});if(disposed||id!==loadId){result.dispose();return}engine=result;loaded=true;}catch(e){if(!disposed)error='This model could not be opened. Check the model file, texture links, connection and WebGL support.';}finally{if(!disposed)loading=false}}
 function close(){loadId++;engine?.dispose();engine=null;loaded=false;rotating=false;error='';}
 function snapshot(){try{const a=document.createElement('a');a.download=project.id+'-preview.png';a.href=engine.snapshot();a.click();}catch{error='Could not save the image. Please try again.'}}
 function toggleRotation(){rotating=!rotating;engine?.rotate(rotating)}
 onDestroy(()=>{disposed=true;close()});
</script>
<div class="viewer"><div class="viewer-surface" bind:this={surface}>
{#if !loaded && !loading}<div class="viewer-placeholder">{#if project.poster}<img class="viewer-poster" src={project.poster} alt={project.title} loading="lazy"/>{:else}<Icon name="box" size={68}/>{/if}{#if project.model}<button class="button primary" on:click={open}><Icon name="play"/> Open 3D preview</button><p>Loaded on your request.<br/>Made to explore at your pace.</p>{:else}<span class="work-badge">Still render · {project.title}</span>{/if}</div>{/if}
{#if loading}<div class="viewer-loading" role="status"><Icon name="box" size={40}/><p>Preparing your 3D preview{progress!==null?' · '+progress+'%':'…'}</p></div>{/if}
</div>
{#if error}<div class="notice error" role="alert">{error}{#if loaded}<button class="icon-button" on:click={close}>Close preview</button>{:else}<button class="icon-button" on:click={open}>Retry</button>{/if}</div>{/if}
<div class="viewer-toolbar">{#if loaded}<div class="toolbar-buttons"><button class="icon-button" aria-label={rotating?'Pause rotation':'Start auto rotation'} aria-pressed={rotating} on:click={toggleRotation}><Icon name={rotating?'pause':'play'}/></button><button class="icon-button" aria-label="Rotate left" on:click={()=>engine.step(-1)}>↶</button><button class="icon-button" aria-label="Rotate right" on:click={()=>engine.step(1)}>↷</button><button class="icon-button" aria-label="Zoom in" on:click={()=>engine.zoom(.85)}>+</button><button class="icon-button" aria-label="Zoom out" on:click={()=>engine.zoom(1.15)}>−</button><button class="icon-button" aria-label="Reset view and materials" on:click={()=>engine.reset()}><Icon name="reset"/></button><button class="icon-button" aria-label="Save preview image" on:click={snapshot}><Icon name="download"/></button><button class="icon-button" aria-label="Close 3D preview" on:click={close}><Icon name="close"/></button></div>{#if project.colors}<div class="color-controls">{#each colors as color,i}<input type="color" value={color} aria-label={'Material '+(i+1)+' color'} on:input={e=>engine.color(i,e.currentTarget.value)}/>{/each}</div>{/if}<span class="viewer-stats">{stats?.triangles.toLocaleString()} triangles</span>{:else}<span class="viewer-stats">{project.model?'360° interactive preview':'Rendered artwork'}</span><span class="viewer-stats">{project.model?'GLB / glTF':'AtoZ Studio'}</span>{/if}</div></div>
