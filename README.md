# AtoZ Studio

A responsive Svelte 5 portfolio, powered by Vite, Bun and an on-demand Three.js viewer. The previous React/Create React App entry points and packages have been replaced. Original artwork remains in src/resource.

## Run on this Windows computer

Open PowerShell in this project folder:

```powershell
.\run.ps1
```

Or double-click **start.bat**. The launcher uses an installed Bun, or the workspace-local Bun already prepared in .tools. It installs project dependencies if they are missing. It does not change PowerShell execution policy or install global software.

Open the Local URL printed by Vite, normally http://127.0.0.1:5173. Open http://127.0.0.1:5173/#studio for the model-management panel. Stop the server with Ctrl+C.

Other launcher tasks:

```powershell
.\run.ps1 install
.\run.ps1 check
.\run.ps1 test
.\run.ps1 build
.\run.ps1 preview
```

## Standard Bun commands

For another computer, install Bun from https://bun.sh, then:

```sh
bun install --frozen-lockfile
bun run dev
bun run check
bun test
bun run build
bun run preview
```

Bun 1.4.2 was used for validation. Vite and svelte-check are explicitly run with the Bun runtime, so this setup does not depend on the older Node version on this computer. The production output is dist/. A build prepares local Draco and Basis decoders from the installed Three.js package.

## Portfolio and viewer

- Immersive pastel studio design inspired by PeachWeb, with DM Sans and Instrument Serif from Google Fonts, with system fallbacks and font-display swap.
- Custom-model service copy, selected work, process, email and WhatsApp links.
- Hero, project order, titles, descriptions, models and cover images come from public/portfolio.json.
- Contact email: studio.atoz@gmail.com. WhatsApp is normalized to Indonesia's international format: 6281414040297.
- GLB and glTF viewing with orbit, zoom, reset, optional auto rotation, material tints and PNG snapshot download.
- Three.js loads only after Open 3D preview. A single canvas renders on demand, uses a pixel ratio capped at 1.5 and stops optional rotation when hidden.
- On mobile, vertical page scrolling remains available; horizontal dragging rotates the model and two-finger gestures zoom. Buttons provide keyboard-accessible rotation and zoom.
- Draco, Meshopt and KTX2/Basis support. Model animations and material-variant selection are not implemented; this is a static asset portfolio viewer.
- Existing icons.gltf is the interactive sample. Hannya mask and headpiece are still renders until their matching models are added. They are not presented as interactive models.

## Studio panel: works without a backend

Open /#studio. Add or edit a project, upload a GLB, add a WebP cover, choose the featured piece and reorder projects. The embedded viewer previews the model before you publish. The panel checks model structure and counts triangles in the default scene; it warns above the recommended mobile budget. It is a lightweight preflight, not a full Khronos glTF validator.

**Save device draft** uses IndexedDB for the catalog and uploaded files. Drafts are local to this browser and origin, including its port. They do not change the public site. Browser data clearing can remove them, so export a backup.

**Export portfolio ZIP** includes public/portfolio.json and referenced local assets. Extract its public directory into the project, review file replacements, build and redeploy. Externally hosted HTTPS models remain URL references and are not copied. Hosted glTF must keep its companion .bin and texture files at their expected URLs with CORS enabled. Uploading a single GLB avoids this issue.

The draft panel can be opened by any visitor, but it cannot modify the shared portfolio without server-side authorization. Opening the panel is not an admin login. Do not use browser storage or a hidden route as a security boundary.

## Vercel setup

Import this repository into Vercel and choose **atoz-studio** as Root Directory if the repository is its parent directory. vercel.json selects the Vite framework, Bun install/build commands, dist output, and the Bun 1.4.x Functions runtime. Keep bun.lock committed. No Vercel deployment or storage connection has been made by this change.

The static site and ZIP workflow work immediately. To enable **live publishing**:

1. Connect a **public Vercel Blob** store to the project. Vercel supplies BLOB_READ_WRITE_TOKEN.
2. Add server-only ADMIN_PASSWORD and SESSION_SECRET environment variables. Use two different, random values of at least 32 characters each. Never put these values in frontend code or VITE_ variables.
3. Redeploy, open /#studio, and sign in with ADMIN_PASSWORD. Publish live uploads local assets directly to Blob, then writes the shared catalog. Existing relative assets continue to come from your deployment.
4. For development with the same integration, copy .env.example to .env.local and populate it locally. Bun loads environment files. Restart the development server after changes. Do not commit secrets.

The API is api/studio.js. It checks same-origin POST requests, validates catalogs, signs one-hour HttpOnly/SameSite sessions, requires authentication for upload tokens and catalog writes, and enforces upload size/type limits. Login attempts are limited per function instance; for a public production admin endpoint, configure a persistent Vercel Firewall rate limit on login requests. HTTPS deployments set Secure cookies. The Blob read/write token stays on the server. Uploaded portfolio models are public downloadable assets, so only publish files you intend to share.

Publishing overwrites the current catalog; simultaneous admin editors use last-writer-wins. Removing a project from the catalog does not delete its Blob files. This avoids deleting assets still used elsewhere; unused uploads can be removed deliberately through the Blob dashboard. A failed publish may leave uploaded but unreferenced files. Keep an exported ZIP as a catalog backup.

bun run dev includes the management API. bun run preview previews only the static build; use Vercel preview deployment for live-storage integration testing. The authenticated API logic has automated tests, but real Blob upload/publish needs your connected Vercel environment and has not been exercised here.

Official references: [Vercel Blob client uploads](https://vercel.com/docs/vercel-blob/client-upload), [Bun runtime on Vercel](https://vercel.com/docs/functions/runtimes/bun).

## Model budgets and export

See [MODEL_GUIDELINES.md](MODEL_GUIDELINES.md), also available inside the Studio panel. Start with **20–50k triangles**, **1K–2K textures** and a **2–5 MB GLB**. These are targets, not speed guarantees. Test on your intended phone and network.

## Validation

- bun test covers model headers, active-scene triangle counts, invalid paths, missing glTF dependencies, upload size limits, disguised images, contact/catalog validation, authentication, forged cookies and cross-origin writes.
- bun run check validates Svelte components and accessibility diagnostics.
- bun run build creates the production site. Vite reports a large lazy viewer chunk because it contains Three.js and loaders; it is absent from the initial page download.
- The initial app JavaScript is approximately 26 KB gzip; the Three.js viewer is approximately 194 KB gzip on demand. These are build sizes, not measured network or frame-rate results. The Hannya WebP is about 43 KB. The original landscape background is about 77 KB on desktop and 24 KB on mobile.
- No real-device performance benchmark or automated browser interaction suite was run.

## Immersive art direction

The full-screen hero uses original generated landscape artwork with the existing AtoZ model render layered above it. Pointer and scroll motion use transforms, and floating stops when the hero is out of view or the page is hidden. A visible Pause motion control and the system reduced-motion preference disable movement. This is a lightweight image-based hero, not PeachWeb’s full real-time ocean scene. Actual interactive GLB/glTF viewing remains available in the showcase. The studio featured-project setting controls the hero artwork.

The scene background uses the built-in image generation tool, with separate desktop/mobile WebP outputs. Asset paths and generation prompt are recorded in [ART_DIRECTION.md](ART_DIRECTION.md).
