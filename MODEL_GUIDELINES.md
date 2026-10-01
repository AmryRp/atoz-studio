# AtoZ Studio: Blender and Substance Painter export rules

These are project starting budgets for one visible web model, not universal hardware limits. Triangle count alone does not predict loading speed or frame rate. Textures, materials, transparency, lighting, decode cost and device memory all matter.

## Starting budgets

- Small props and icons: 5,000–20,000 triangles.
- Standard featured model: 20,000–50,000 triangles.
- Complex hero model: 50,000–100,000 triangles only after checking a real midrange phone. Keep a lighter copy available.
- Start with 1–4 materials and fewer than 10 draw calls. Combining meshes does not necessarily reduce draw calls when material groups remain separate.
- Default textures: 1024 px. Use 2048 px for close-up surfaces that benefit. Avoid routine 4K or 8K textures for mobile.
- Target a complete GLB around 2–5 MB, including textures. The panel warns above 5 MB or 100k triangles and rejects uploads larger than 15 MiB. A 15 MiB model is not a recommended target.
- Poster: WebP around 100–250 KB. The panel permits PNG, JPEG and WebP up to 2 MiB.

## Blender workflow

1. Preserve the high-poly master in a separate file or collection. Retopologize or decimate a duplicate for the web. Protect the silhouette and bake smaller surface details to normal maps.
2. Check evaluated geometry after modifiers. Count triangles, not quads: a quad normally exports as two triangles. UV seams and hard normals can split exported vertices.
3. Apply scale on the export copy; verify orientation, normals and UVs. Remove hidden geometry and unneeded objects. Export selected objects without irrelevant lights or cameras.
4. Use Principled BSDF and image textures. Bake procedural textures; arbitrary Blender shader graphs cannot be reproduced directly by glTF.
5. Export glTF 2.0 as GLB for a single packaged model with textures. Test the exported file itself, not just the Blender viewport.

## Substance Painter workflow

1. Bake mesh maps from the high-poly source onto the low-poly UV layout.
2. Use PBR metallic/roughness textures and OpenGL normal maps (+Y). Choose a matching export template and reconnect the images to Blender's Principled material before GLB export.
3. Base color and emissive images use sRGB. Normal, metallic, roughness and AO maps are data and should be Non-Color in Blender.
4. If packing ORM: occlusion in red, roughness in green and metallic in blue. Use the correct glTF material hookup, including AO export support; do not treat a packed map as a base-color texture.
5. Keep texture sets and material slots modest. A 2048 × 2048 RGBA texture takes roughly 16 MiB uncompressed, or about 21.3 MiB with a full mip chain. A small JPEG/PNG file does not imply small GPU memory use.
6. Prefer opaque materials where practical. Alpha blending, transmission, double-sided surfaces and overlapping layers can be expensive.

## Compression and delivery

- Draco or Meshopt reduces geometry transfer size, with a decode cost. Compare the final files and loading behavior, especially for small models.
- KTX2/Basis can reduce GPU texture memory when transcoded to supported compressed formats. It requires a suitable conversion tool and testing; the website does not automatically compress uploaded models.
- The Three.js loader supports Draco, Meshopt and KTX2. Decoder assets are served from the same site.
- Local uploads accept GLB and self-contained glTF. Multi-file glTF is supported through a hosted URL only when every referenced file resolves and CORS allows access.
- Use image posters before loading 3D. Load one model at a time and release its textures, geometry and WebGL resources when switching or leaving the viewer.
- Portfolio geometry and textures delivered to browsers are downloadable; do not upload confidential source work.

## Acceptance check before publishing

- Open on your actual target midrange phone and a desktop, using both a normal and throttled connection.
- Check texture appearance, normal-map direction, transparency, color space, mesh scale and initial framing.
- Orbit and zoom; aim for smooth 30 FPS or better on the target phone. Measure rather than assuming a triangle budget guarantees that result.
- Verify the page still scrolls on touch devices and that a failed model leaves a usable page with retry controls.
- Confirm the exported file includes its textures and that the cover image represents that model.
- If it stutters, first inspect texture dimensions, material count, transparency and draw calls, then reduce geometry as needed.

Sources: [Blender glTF manual](https://docs.blender.org/manual/en/3.6/addons/import_export/scene_gltf2.html), [Adobe Substance Painter export presets](https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/export/output-templates/default-output-templates/default-presets), [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html). Numerical budgets above are AtoZ project recommendations, not limits specified by these tools.
