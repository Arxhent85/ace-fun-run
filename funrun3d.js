// ============================================================================
// FUN RUN 3D / POCKET RUN - THREE.JS WEBGL RACING ENGINE
// True 3D Smooth Mesh World, Dynamic Camera, High-Detail Characters & Combat
// ============================================================================

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. SOUND ENGINE (WebAudio with Synthesis Fallback)
  // --------------------------------------------------------------------------
  class FunRun3DSound {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.buffers = {};
      this.soundUrls = {
        jump: 'assets/sound/sfx_jump.wav',
        double_jump: 'assets/sound/sfx_jump.wav',
        pickup: 'assets/sound/sfx_pickup.wav',
        blade_act: 'assets/sound/sfx_blade_activate.wav',
        blade_hit: 'assets/sound/sfx_blade_hit.wav',
        trap_act: 'assets/sound/sfx_trap_activate.wav',
        trap_hit: 'assets/sound/sfx_trap_hit.wav',
        lightning_act: 'assets/sound/sfx_lightning_activate.wav',
        lightning_hit: 'assets/sound/sfx_lightning_hit.wav',
        speed_act: 'assets/sound/sfx_speed_activate.wav',
        shield_act: 'assets/sound/sfx_invul_activate.wav',
        blood: 'assets/sound/sfx_blood.wav',
        bounce: 'assets/sound/sfx_bounce_activate.wav',
        countdown: 'assets/sound/sfx_countdown.wav',
        start: 'assets/sound/sfx_start.wav',
        coins: 'assets/sound/sfx_coins.wav'
      };
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
        this.loadAudioFiles();
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    async loadAudioFiles() {
      for (const [key, url] of Object.entries(this.soundUrls)) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const buf = await res.arrayBuffer();
            this.buffers[key] = await this.ctx.decodeAudioData(buf);
          }
        } catch (e) {}
      }
    }

    play(name) {
      if (!this.enabled) return;
      this.init();
      if (this.ctx && this.buffers[name]) {
        try {
          const src = this.ctx.createBufferSource();
          src.buffer = this.buffers[name];
          src.connect(this.ctx.destination);
          src.start(0);
          return;
        } catch (e) {}
      }
      this.synthFallback(name);
    }

    synthFallback(name) {
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        if (name === 'jump') {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
          g.gain.setValueAtTime(0.3, now);
          g.gain.linearRampToValueAtTime(0.01, now + 0.16);
          osc.connect(g); g.connect(this.ctx.destination);
          osc.start(); osc.stop(now + 0.16);
        } else if (name === 'double_jump') {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(420, now);
          osc.frequency.exponentialRampToValueAtTime(950, now + 0.18);
          g.gain.setValueAtTime(0.35, now);
          g.gain.linearRampToValueAtTime(0.01, now + 0.18);
          osc.connect(g); g.connect(this.ctx.destination);
          osc.start(); osc.stop(now + 0.18);
        } else if (name === 'rock_hit') {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
          g.gain.setValueAtTime(0.4, now);
          g.gain.linearRampToValueAtTime(0.01, now + 0.22);
          osc.connect(g); g.connect(this.ctx.destination);
          osc.start(); osc.stop(now + 0.22);
        } else if (name === 'blade_hit' || name === 'blood') {
          const bufSize = this.ctx.sampleRate * 0.35;
          const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buf;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1200, now);
          filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);
          const g = this.ctx.createGain();
          g.gain.setValueAtTime(0.5, now);
          g.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
          noise.connect(filter); filter.connect(g); g.connect(this.ctx.destination);
          noise.start();
        } else if (name === 'trap_hit') {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.2);
          g.gain.setValueAtTime(0.4, now);
          g.gain.linearRampToValueAtTime(0.01, now + 0.2);
          osc.connect(g); g.connect(this.ctx.destination);
          osc.start(); osc.stop(now + 0.2);
        } else if (name === 'pickup') {
          [523, 659, 784].forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.07);
            g.gain.setValueAtTime(0.2, now + i * 0.07);
            g.gain.linearRampToValueAtTime(0.01, now + i * 0.07 + 0.08);
            osc.connect(g); g.connect(this.ctx.destination);
            osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.08);
          });
        } else if (name === 'bounce') {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(800, now + 0.25);
          g.gain.setValueAtTime(0.35, now);
          g.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.connect(g); g.connect(this.ctx.destination);
          osc.start(); osc.stop(now + 0.25);
        } else if (name === 'countdown') {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          g.gain.setValueAtTime(0.25, now);
          g.gain.linearRampToValueAtTime(0.01, now + 0.12);
          osc.connect(g); g.connect(this.ctx.destination);
          osc.start(); osc.stop(now + 0.12);
        } else if (name === 'start') {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now);
          g.gain.setValueAtTime(0.35, now);
          g.gain.linearRampToValueAtTime(0.01, now + 0.35);
          osc.connect(g); g.connect(this.ctx.destination);
          osc.start(); osc.stop(now + 0.35);
        }
      } catch (e) {}
    }
  }

  const sfx = new FunRun3DSound();

  function formatTime(totalSeconds) {
    let m = Math.floor(totalSeconds / 60);
    let s = Math.floor(totalSeconds % 60);
    let ms = Math.floor((totalSeconds % 1) * 100);
    return (m > 0 ? m + ':' : '') + (s < 10 && m > 0 ? '0' : '') + s + '.' + (ms < 10 ? '0' : '') + ms + 's';
  }

  // Deterministic PRNG helper for repeatable world textures & props
  function createSeededRng(seed = 1337) {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  /**
   * Generates a velvety smooth, slightly undulating organic canopy sphere (BotW painterly look)
   */
  function makeOrganicCanopyGeo(radius, seed = 1) {
    const geo = new THREE.SphereGeometry(radius, 14, 10);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const bump = 1.0 + 0.08 * Math.sin(x * 1.9 + seed) * Math.cos(y * 2.1 - seed) + 0.06 * Math.sin(z * 2.3 + seed);
      pos.setXYZ(i, x * bump, y * bump, z * bump);
    }
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * Merges transformed BufferGeometries with per-part colors and subtle vertical ambient occlusion
   * while preserving smooth vertex normals on curved canopies/clouds/trunks.
   */
  function mergeColoredGeometries(parts, aoStrength = 0.24) {
    const prepped = [];
    let totalVerts = 0;
    const mat4 = new THREE.Matrix4();
    const euler = new THREE.Euler();
    const quat = new THREE.Quaternion();
    const posVec = new THREE.Vector3();
    const scaleVec = new THREE.Vector3();
    const colObj = new THREE.Color();

    for (const part of parts) {
      const raw = part.geo.clone();
      if (!part.flat && raw.index && !raw.attributes.normal) {
        raw.computeVertexNormals();
      }
      posVec.set(part.pos ? part.pos[0] : 0, part.pos ? part.pos[1] : 0, part.pos ? part.pos[2] : 0);
      euler.set(part.rot ? part.rot[0] : 0, part.rot ? part.rot[1] : 0, part.rot ? part.rot[2] : 0);
      quat.setFromEuler(euler);
      scaleVec.set(part.scale ? part.scale[0] : 1, part.scale ? part.scale[1] : 1, part.scale ? part.scale[2] : 1);
      mat4.compose(posVec, quat, scaleVec);
      raw.applyMatrix4(mat4);
      if (!part.flat && raw.index) {
        // Compute smooth vertex normals while vertices are still shared!
        raw.computeVertexNormals();
      }
      const g = raw.index ? raw.toNonIndexed() : raw;
      if (part.flat) {
        g.computeVertexNormals();
      }
      g.computeBoundingBox();

      colObj.set(part.color !== undefined ? part.color : 0xffffff);
      const count = g.attributes.position.count;
      totalVerts += count;
      prepped.push({ geo: g, color: colObj.clone(), bbox: g.boundingBox, ao: part.ao !== false });
    }

    const positions = new Float32Array(totalVerts * 3);
    const normals = new Float32Array(totalVerts * 3);
    const colors = new Float32Array(totalVerts * 3);
    const uvs = new Float32Array(totalVerts * 2);

    let vOffset = 0;
    for (const item of prepped) {
      const pAttr = item.geo.attributes.position;
      const nAttr = item.geo.attributes.normal;
      const uvAttr = item.geo.attributes.uv;
      const c = item.color;
      const minY = item.bbox.min.y;
      const spanY = Math.max(0.01, item.bbox.max.y - minY);

      for (let i = 0; i < pAttr.count; i++) {
        const idx3 = (vOffset + i) * 3;
        const idx2 = (vOffset + i) * 2;
        const py = pAttr.getY(i);
        positions[idx3] = pAttr.getX(i);
        positions[idx3 + 1] = py;
        positions[idx3 + 2] = pAttr.getZ(i);

        normals[idx3] = nAttr ? nAttr.getX(i) : 0;
        normals[idx3 + 1] = nAttr ? nAttr.getY(i) : 1;
        normals[idx3 + 2] = nAttr ? nAttr.getZ(i) : 0;

        uvs[idx2] = uvAttr ? uvAttr.getX(i) : 0;
        uvs[idx2 + 1] = uvAttr ? uvAttr.getY(i) : 0;

        // Baked canopy/part light-to-shadow gradient for crisp BotW depth
        let shade = 1.0;
        if (item.ao) {
          const hNorm = Math.max(0, Math.min(1, (py - minY) / spanY));
          shade = (1.0 - aoStrength) + hNorm * (aoStrength * 1.35);
        }
        colors[idx3] = Math.min(1, c.r * shade);
        colors[idx3 + 1] = Math.min(1, c.g * shade);
        colors[idx3 + 2] = Math.min(1, c.b * shade);
      }

      vOffset += pAttr.count;
      item.geo.dispose();
    }

    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    out.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    out.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    return out;
  }

  // --------------------------------------------------------------------------
  // 1b. PROCEDURAL HIGH-RES TEXTURE FACTORY (BotW Terrain, Dirt Trail, Wood Bridges, Bark)
  // --------------------------------------------------------------------------
  class TextureFactory {
    constructor(maxAnisotropy = 4) {
      this.maxAnisotropy = maxAnisotropy;
      this.cache = new Map();
    }

    configureTex(canvas, repeatX = 1, repeatY = 1, wrap = THREE.RepeatWrapping) {
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = wrap;
      tex.wrapT = wrap;
      tex.repeat.set(repeatX, repeatY);
      tex.anisotropy = this.maxAnisotropy;
      tex.needsUpdate = true;
      return tex;
    }

    getTrackTextures(level = 1) {
      const key = 'track_' + level;
      if (this.cache.has(key)) return this.cache.get(key);

      const W = 512, H = 512;
      const colCanvas = document.createElement('canvas');
      colCanvas.width = W; colCanvas.height = H;
      const ctx = colCanvas.getContext('2d');

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = W; bumpCanvas.height = H;
      const bctx = bumpCanvas.getContext('2d');

      const rng = createSeededRng(100 + level * 77);

      // Base soil/path tone per level (high-contrast AAA palettes for Levels 1-8)
      let baseCol = '#7c4a24', rutCol = '#532d12', highlightCol = '#a36536', grassEdgeCol = '#2d6e22', pebbleCols = ['#5c5147', '#827467', '#3f362e'];
      if (level === 2) {
        baseCol = '#5d7c9c'; rutCol = '#3d5873'; highlightCol = '#a8cce8'; grassEdgeCol = '#cbe5ff'; pebbleCols = ['#3a4e63', '#84a4c2', '#e4f2ff'];
      } else if (level === 3) {
        baseCol = '#d17b54'; rutCol = '#a45430'; highlightCol = '#f2b899'; grassEdgeCol = '#e65b92'; pebbleCols = ['#ffe8a3', '#ff528e', '#4dd0e1'];
      } else if (level === 4) {
        baseCol = '#c48b53'; rutCol = '#966131'; highlightCol = '#ebd0a2'; grassEdgeCol = '#14a398'; pebbleCols = ['#fde68a', '#d95d39', '#14b8a6'];
      } else if (level === 5) {
        baseCol = '#3d373b'; rutCol = '#221e21'; highlightCol = '#665a5e'; grassEdgeCol = '#f97316'; pebbleCols = ['#fb923c', '#57534e', '#1c1917'];
      } else if (level === 6) {
        baseCol = '#5c4028'; rutCol = '#3b2514'; highlightCol = '#85603e'; grassEdgeCol = '#15803d'; pebbleCols = ['#4d7c0f', '#78350f', '#365314'];
      } else if (level === 7) {
        baseCol = '#d49a4c'; rutCol = '#a87028'; highlightCol = '#f7d594'; grassEdgeCol = '#d97706'; pebbleCols = ['#fef3c7', '#b45309', '#92400e'];
      } else if (level === 8) {
        baseCol = '#334155'; rutCol = '#1e293b'; highlightCol = '#64748b'; grassEdgeCol = '#38bdf8'; pebbleCols = ['#38bdf8', '#a855f7', '#e2e8f0'];
      }

      ctx.fillStyle = baseCol;
      ctx.fillRect(0, 0, W, H);
      bctx.fillStyle = '#808080';
      bctx.fillRect(0, 0, W, H);

      // Soft organic vertical strips & soil streaks
      for (let i = 0; i < 420; i++) {
        const x = rng() * W;
        const y = rng() * H;
        const rw = 6 + rng() * 26;
        const rh = 30 + rng() * 140;
        ctx.fillStyle = rng() > 0.45 ? highlightCol : rutCol;
        ctx.globalAlpha = 0.08 + rng() * 0.10;
        ctx.fillRect(x, y, rw, rh);
        ctx.fillRect(x, y - H, rw, rh); // seamless Y wrap
      }
      ctx.globalAlpha = 1.0;

      // 3 Packed Running Lane Ruts (centered around u = 0.17, 0.50, 0.83 corresponding to +4.5, 0, -4.5)
      const laneCenters = [W * 0.17, W * 0.50, W * 0.83];
      for (const lc of laneCenters) {
        const grad = ctx.createLinearGradient(lc - 48, 0, lc + 48, 0);
        grad.addColorStop(0.0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.35, level === 2 ? 'rgba(40,65,95,0.28)' : level === 3 ? 'rgba(180,85,55,0.22)' : 'rgba(65,34,14,0.34)');
        grad.addColorStop(0.5, level === 2 ? 'rgba(200,235,255,0.18)' : 'rgba(255,255,255,0.06)');
        grad.addColorStop(0.65, level === 2 ? 'rgba(40,65,95,0.28)' : level === 3 ? 'rgba(180,85,55,0.22)' : 'rgba(65,34,14,0.34)');
        grad.addColorStop(1.0, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(lc - 48, 0, 96, H);

        // Depression in bump map for running ruts
        bctx.fillStyle = 'rgba(40,40,40,0.25)';
        bctx.fillRect(lc - 26, 0, 52, H);
      }

      // Scattered pebbles, clovers & dirt grain
      for (let i = 0; i < 2400; i++) {
        const px = rng() * W;
        const py = rng() * H;
        const pr = 1.0 + rng() * 3.4;
        const pcol = pebbleCols[Math.floor(rng() * pebbleCols.length)];
        ctx.fillStyle = pcol;
        ctx.globalAlpha = 0.18 + rng() * 0.45;
        ctx.beginPath();
        ctx.ellipse(px, py, pr, pr * (0.6 + rng() * 0.6), rng() * Math.PI, 0, Math.PI * 2);
        ctx.fill();

        bctx.fillStyle = rng() > 0.5 ? '#b4b4b4' : '#555555';
        bctx.globalAlpha = 0.35;
        bctx.fillRect(px, py, pr + 1, pr + 1);
      }
      ctx.globalAlpha = 1.0;
      bctx.globalAlpha = 1.0;

      // Soft mossy / snowy / candy fringe along far outer left & right 5% shoulders
      const edgeL = ctx.createLinearGradient(0, 0, W * 0.08, 0);
      edgeL.addColorStop(0.0, grassEdgeCol);
      edgeL.addColorStop(1.0, 'rgba(0,0,0,0)');
      ctx.fillStyle = edgeL;
      ctx.fillRect(0, 0, W * 0.08, H);

      const edgeR = ctx.createLinearGradient(W, 0, W * 0.92, 0);
      edgeR.addColorStop(0.0, grassEdgeCol);
      edgeR.addColorStop(1.0, 'rgba(0,0,0,0)');
      ctx.fillStyle = edgeR;
      ctx.fillRect(W * 0.92, 0, W * 0.08, H);

      const res = {
        map: this.configureTex(colCanvas, 1, 1, THREE.RepeatWrapping),
        bumpMap: this.configureTex(bumpCanvas, 1, 1, THREE.RepeatWrapping)
      };
      this.cache.set(key, res);
      return res;
    }

    getBridgeTextures(level = 1) {
      const key = 'bridge_' + level;
      if (this.cache.has(key)) return this.cache.get(key);

      const W = 512, H = 512;
      const colCanvas = document.createElement('canvas');
      colCanvas.width = W; colCanvas.height = H;
      const ctx = colCanvas.getContext('2d');

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = W; bumpCanvas.height = H;
      const bctx = bumpCanvas.getContext('2d');

      const rng = createSeededRng(303 + level * 31);
      const planks = 8;
      const plankH = H / planks;

      for (let p = 0; p < planks; p++) {
        const y0 = p * plankH;
        const tone = (rng() - 0.5) * 18;
        if (level === 2) {
          ctx.fillStyle = `rgb(${98 + tone}, ${86 + tone}, ${78 + tone})`;
        } else if (level === 3) {
          ctx.fillStyle = `rgb(${194 + tone}, ${124 + tone * 0.5}, ${82 + tone * 0.4})`;
        } else if (level === 4) {
          ctx.fillStyle = `rgb(${158 + tone}, ${120 + tone * 0.6}, ${74 + tone * 0.4})`;
        } else if (level === 5) {
          ctx.fillStyle = `rgb(${68 + tone * 0.6}, ${56 + tone * 0.5}, ${54 + tone * 0.5})`;
        } else if (level === 6) {
          ctx.fillStyle = `rgb(${96 + tone}, ${66 + tone * 0.6}, ${36 + tone * 0.4})`;
        } else if (level === 7) {
          ctx.fillStyle = `rgb(${176 + tone}, ${130 + tone * 0.6}, ${72 + tone * 0.4})`;
        } else if (level === 8) {
          ctx.fillStyle = `rgb(${64 + tone * 0.6}, ${76 + tone * 0.6}, ${108 + tone * 0.6})`;
        } else {
          ctx.fillStyle = `rgb(${108 + tone}, ${64 + tone * 0.7}, ${30 + tone * 0.4})`;
        }
        ctx.fillRect(0, y0, W, plankH - 4);

        bctx.fillStyle = '#a8a8a8';
        bctx.fillRect(0, y0, W, plankH - 4);

        // Dark bevel gap between planks
        ctx.fillStyle = '#241307';
        ctx.fillRect(0, y0 + plankH - 4, W, 4);
        bctx.fillStyle = '#181818';
        bctx.fillRect(0, y0 + plankH - 4, W, 4);

        // Horizontal wood grain streaks
        for (let g = 0; g < 22; g++) {
          const gy = y0 + 4 + rng() * (plankH - 12);
          ctx.fillStyle = rng() > 0.5 ? 'rgba(255,220,175,0.09)' : 'rgba(30,14,4,0.16)';
          ctx.fillRect(0, gy, W, 1 + rng() * 2.5);
        }

        // Forged iron bolts at ends of every plank
        for (const bx of [26, W - 26]) {
          for (const by of [y0 + plankH * 0.28, y0 + plankH * 0.68]) {
            ctx.fillStyle = '#1e293b';
            ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.beginPath(); ctx.arc(bx - 1.5, by - 1.5, 2, 0, Math.PI * 2); ctx.fill();

            bctx.fillStyle = '#ffffff';
            bctx.beginPath(); bctx.arc(bx, by, 5, 0, Math.PI * 2); bctx.fill();
          }
        }
      }

      const res = {
        map: this.configureTex(colCanvas, 1, 1, THREE.RepeatWrapping),
        bumpMap: this.configureTex(bumpCanvas, 1, 1, THREE.RepeatWrapping)
      };
      this.cache.set(key, res);
      return res;
    }

    getTerrainTextures(level = 1) {
      const key = 'terrain_' + level;
      if (this.cache.has(key)) return this.cache.get(key);

      const W = 512, H = 512;
      const colCanvas = document.createElement('canvas');
      colCanvas.width = W; colCanvas.height = H;
      const ctx = colCanvas.getContext('2d');

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = W; bumpCanvas.height = H;
      const bctx = bumpCanvas.getContext('2d');

      const rng = createSeededRng(505 + level * 19);

      // Neutral white-grey micro-modulation so vertex biome colors keep exact Zelda vibrancy
      ctx.fillStyle = '#dcdcdc';
      ctx.fillRect(0, 0, W, H);
      bctx.fillStyle = '#808080';
      bctx.fillRect(0, 0, W, H);

      // Painted painterly grass strokes & clover patches
      for (let i = 0; i < 3600; i++) {
        const x = rng() * W;
        const y = rng() * H;
        const bright = rng() > 0.45;
        ctx.fillStyle = bright ? 'rgba(255,255,255,0.18)' : 'rgba(85,115,85,0.22)';
        const bw = 2 + rng() * 5;
        const bh = 5 + rng() * 11;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rng() - 0.5) * 0.8);
        ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
        ctx.restore();

        bctx.fillStyle = bright ? 'rgba(180,180,180,0.25)' : 'rgba(60,60,60,0.25)';
        bctx.fillRect(x, y, bw + 1, bh * 0.5);
      }

      const res = {
        map: this.configureTex(colCanvas, 1, 1, THREE.RepeatWrapping),
        bumpMap: this.configureTex(bumpCanvas, 1, 1, THREE.RepeatWrapping)
      };
      this.cache.set(key, res);
      return res;
    }

    getBarkTexture() {
      if (this.cache.has('bark')) return this.cache.get('bark');
      const W = 256, H = 256;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d');
      const rng = createSeededRng(707);

      ctx.fillStyle = '#d4c8be';
      ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 240; i++) {
        const x = rng() * W;
        const y = rng() * H;
        ctx.fillStyle = rng() > 0.4 ? 'rgba(40,22,10,0.28)' : 'rgba(255,245,235,0.16)';
        ctx.fillRect(x, y, 2 + rng() * 5, 24 + rng() * 80);
      }
      const tex = this.configureTex(c, 1, 2, THREE.RepeatWrapping);
      this.cache.set('bark', tex);
      return tex;
    }

    getGlowParticleTexture() {
      if (this.cache.has('glow')) return this.cache.get('glow');
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      g.addColorStop(0.0, 'rgba(255,255,255,1.0)');
      g.addColorStop(0.35, 'rgba(255,248,200,0.85)');
      g.addColorStop(1.0, 'rgba(255,240,150,0.0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(32, 32, 30, 0, Math.PI * 2); ctx.fill();
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      this.cache.set('glow', tex);
      return tex;
    }

    getSnowflakeTexture() {
      if (this.cache.has('snowflake')) return this.cache.get('snowflake');
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.3, 'rgba(235, 248, 255, 0.9)');
      grad.addColorStop(1.0, 'rgba(160, 210, 255, 0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(32, 32, 30, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(32, 32);
        ctx.lineTo(32 + Math.cos(a) * 20, 32 + Math.sin(a) * 20);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      this.cache.set('snowflake', tex);
      return tex;
    }
  }

  // --------------------------------------------------------------------------
  // 2. 3D PARTICLE SYSTEM (Sparks, Blood, Dust, Speed Trail)
  // --------------------------------------------------------------------------
  class ParticleSystem3D {
    constructor(scene) {
      this.scene = scene;
      this.particles = [];
      this.sphereGeo = new THREE.SphereGeometry(0.14, 6, 6);
      this.bloodMat = new THREE.MeshBasicMaterial({ color: 0xcc0000 });
      this.sparkMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      this.dustMat = new THREE.MeshBasicMaterial({ color: 0xdcdcdc, transparent: true, opacity: 0.65 });
      this.fireMat = new THREE.MeshBasicMaterial({ color: 0xff5722 });
    }

    spawn(x, y, z, vx, vy, vz, mat, maxLife = 0.5, scale = 1.0) {
      const mesh = new THREE.Mesh(this.sphereGeo, mat);
      mesh.position.set(x, y, z);
      mesh.scale.setScalar(scale);
      this.scene.add(mesh);
      this.particles.push({ mesh, vx, vy, vz, life: maxLife, maxLife });
    }

    spawnBlood(x, y, z, count = 24) {
      for (let i = 0; i < count; i++) {
        this.spawn(
          x + (Math.random() - 0.5) * 0.6, y + 0.6 + Math.random() * 0.6, z + (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 12, Math.random() * 10 + 3, (Math.random() - 0.5) * 12,
          this.bloodMat, 0.65, Math.random() * 0.8 + 0.6
        );
      }
    }

    spawnSparks(x, y, z, count = 16) {
      for (let i = 0; i < count; i++) {
        this.spawn(
          x, y + 0.6, z,
          (Math.random() - 0.5) * 14, Math.random() * 12 + 4, (Math.random() - 0.5) * 14,
          this.sparkMat, 0.45, Math.random() * 0.6 + 0.5
        );
      }
    }

    spawnDust(x, y, z, count = 5) {
      for (let i = 0; i < count; i++) {
        this.spawn(
          x + (Math.random() - 0.5) * 0.8, y + 0.15, z - 0.5,
          (Math.random() - 0.5) * 3, Math.random() * 3 + 1, -Math.random() * 4,
          this.dustMat, 0.38, Math.random() * 0.7 + 0.5
        );
      }
    }

    spawnSpeedFlames(x, y, z) {
      for (let i = 0; i < 2; i++) {
        this.spawn(
          x + (Math.random() - 0.5) * 0.6, y + 0.4, z - 0.8,
          (Math.random() - 0.5) * 2, Math.random() * 2 + 1, -Math.random() * 8 - 4,
          this.fireMat, 0.28, Math.random() * 0.8 + 0.6
        );
      }
    }

    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          this.scene.remove(p.mesh);
          this.particles.splice(i, 1);
          continue;
        }
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;
        p.vy -= 22 * dt;
        const progress = p.life / p.maxLife;
        p.mesh.scale.setScalar(progress);
      }
    }

    clear() {
      for (let p of this.particles) {
        this.scene.remove(p.mesh);
      }
      this.particles = [];
    }
  }

  // --------------------------------------------------------------------------
  // 3. HIGH-DETAIL 3D RACER CHARACTER (Fun Run & Pocket Champs Style)
  // --------------------------------------------------------------------------
  class Racer3D {
    constructor(laneIndex, animal, isPlayer, name, engine) {
      this.laneIndex = laneIndex; // 0: Screen Left (+4.5), 1: Center (0), 2: Screen Right (-4.5)
      // Screen Left is +X, Screen Right is -X when camera looks towards +Z
      this.x = (1 - laneIndex) * 4.5;
      this.targetX = this.x;
      this.z = isPlayer ? 10 : 15 + Math.random() * 15;
      this.animal = animal || 'bear';
      this.isPlayer = isPlayer;
      this.name = name;
      this.engine = engine;

      // Speeds: base ~22 m/s (~80 km/h)
      this.baseSpeed = isPlayer ? 22.0 : 21.0 + Math.random() * 2.0;
      this.speed = this.baseSpeed;
      this.jumpY = 0;
      this.vy = 0;
      this.isJumping = false;
      this.jumpCount = 0;
      this.isFlipping = false;
      this.flipAngle = 0;
      this.stumbleTimer = 0;
      this.shieldTimer = 0;
      this.speedBoostTimer = 0;
      this.stunTimer = 0;
      this.dead = false;
      this.respawnTimer = 0;
      this.finishTime = null;
      this.currentWeapon = null;
      this.aiTimer = 0;

      // 3D Mesh Group
      this.group = new THREE.Group();
      this.buildAnimalModel();
      this.engine.scene.add(this.group);

      // Contact Shadow
      const shadowGeo = new THREE.CircleGeometry(0.78, 18);
      shadowGeo.rotateX(-Math.PI / 2);
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x091609, transparent: true, opacity: 0.44 });
      this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      this.engine.scene.add(this.shadowMesh);
    }

    createBadgeSprite(text) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffea00';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.font = '900 48px "Luckiest Guy", Impact, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(text, 64, 32);
      ctx.fillText(text, 64, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const mat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(1.9, 0.95, 1);
      return sprite;
    }

    buildAnimalModel() {
      while (this.group.children.length > 0) {
        this.group.remove(this.group.children[0]);
      }
      this.wingL = null;
      this.wingR = null;
      this.tailGroup = null;

      let mainColor = 0x9c5a28, bellyColor = 0xf7dfc4, darkColor = 0x522d12, earInnerColor = 0xff9eb5;
      let collarColor = this.isPlayer ? 0x1976d2 : 0xd32f2f;
      if (this.animal === 'fox') {
        mainColor = 0xf26422; bellyColor = 0xfdf8f2; darkColor = 0x1e242b; earInnerColor = 0xffc4aa;
        collarColor = this.isPlayer ? 0x1976d2 : 0x10b981;
      } else if (this.animal === 'beaver') {
        mainColor = 0x824421; bellyColor = 0xdba06b; darkColor = 0x3b1e0d; earInnerColor = 0xdba06b;
        collarColor = this.isPlayer ? 0x1976d2 : 0xf59e0b;
      } else if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        mainColor = 0x3a2b20; bellyColor = 0xf8fafc; darkColor = 0xfab005; earInnerColor = 0xfab005;
        collarColor = this.isPlayer ? 0x1976d2 : 0x7c3aed;
      }

      this.bodyMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.58, metalness: 0.04 });
      this.bellyMat = new THREE.MeshStandardMaterial({ color: bellyColor, roughness: 0.62, metalness: 0.02 });
      this.darkMat = new THREE.MeshStandardMaterial({ color: darkColor, roughness: 0.65, metalness: 0.05 });
      this.innerEarMat = new THREE.MeshStandardMaterial({ color: earInnerColor, roughness: 0.55 });
      this.eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
      this.eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      this.shoeMat = new THREE.MeshStandardMaterial({ color: this.isPlayer ? 0xe53935 : 0x3949ab, roughness: 0.42, metalness: 0.1 });
      this.soleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });

      // 1. Torso
      const torsoGeo = new THREE.SphereGeometry(0.72, 18, 16);
      torsoGeo.scale(1.0, 1.25, 0.96);
      this.torsoMesh = new THREE.Mesh(torsoGeo, this.bodyMat);
      this.torsoMesh.position.y = 0.92;
      this.torsoMesh.castShadow = true;
      this.torsoMesh.receiveShadow = true;
      this.group.add(this.torsoMesh);

      // Creamy Belly Wrap
      const bellyGeo = new THREE.SphereGeometry(0.56, 14, 12);
      bellyGeo.scale(0.85, 0.96, 0.38);
      const bellyMesh = new THREE.Mesh(bellyGeo, this.bellyMat);
      bellyMesh.position.set(0, 0.88, 0.62);
      this.group.add(bellyMesh);

      // Racing Scarf / Collar + Front & Back Golden Emblems (clearly visible from behind!)
      const collarMat = new THREE.MeshStandardMaterial({ color: collarColor, roughness: 0.45, metalness: 0.1 });
      const collarGeo = new THREE.TorusGeometry(0.68, 0.09, 10, 20);
      collarGeo.rotateX(Math.PI / 2);
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.position.set(0, 1.35, 0.08);
      collar.castShadow = true;
      this.group.add(collar);

      const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.25 });
      const starGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.06, 5);
      starGeo.rotateX(Math.PI / 2);
      const starFront = new THREE.Mesh(starGeo, goldMat);
      starFront.position.set(0, 1.35, 0.78);
      this.group.add(starFront);

      // Flying Scarf Tails billowing behind neck
      const scarfTailMat = new THREE.MeshStandardMaterial({ color: collarColor, roughness: 0.5 });
      for (const side of [-1, 1]) {
        const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.58), scarfTailMat);
        scarfTail.position.set(side * 0.18, 1.33, -0.78);
        scarfTail.rotation.set(0.28, side * 0.25, 0);
        scarfTail.castShadow = true;
        this.group.add(scarfTail);
      }

      // 2. Head
      const isEagle = (this.animal === 'baldeagle' || this.animal === 'eagle');
      const headGeo = new THREE.SphereGeometry(0.58, 18, 16);
      this.headMesh = new THREE.Mesh(headGeo, isEagle ? this.bellyMat : this.bodyMat);
      this.headMesh.position.set(0, 1.78, 0.08);
      this.headMesh.castShadow = true;
      this.group.add(this.headMesh);

      // Expressive Comic Eyes + Brows
      const eyeGeo = new THREE.SphereGeometry(0.14, 12, 10);
      eyeGeo.scale(0.9, 1.15, 0.5);
      const pupilGeo = new THREE.SphereGeometry(0.08, 8, 6);
      pupilGeo.scale(0.9, 1.0, 0.4);

      for (let eyeSide of [-1, 1]) {
        const eyeWhite = new THREE.Mesh(eyeGeo, this.eyeWhiteMat);
        eyeWhite.position.set(eyeSide * 0.24, 1.88, 0.54);
        eyeWhite.rotation.y = eyeSide * 0.15;
        this.group.add(eyeWhite);

        const eyePupil = new THREE.Mesh(pupilGeo, this.eyePupilMat);
        eyePupil.position.set(eyeSide * 0.24, 1.88, 0.59);
        this.group.add(eyePupil);

        const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.032, 6, 4), this.eyeWhiteMat);
        catchlight.position.set(eyeSide * 0.22, 1.92, 0.62);
        this.group.add(catchlight);
      }

      // Snout / Beak & Species Facial Detail
      if (isEagle) {
        const beakUpper = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.56, 8), this.darkMat);
        beakUpper.rotation.x = Math.PI / 2 + 0.15;
        beakUpper.position.set(0, 1.70, 0.68);
        this.group.add(beakUpper);

        // White feathered head crest visible from back
        const crestGeo = new THREE.ConeGeometry(0.24, 0.50, 7);
        const crest = new THREE.Mesh(crestGeo, this.bellyMat);
        crest.position.set(0, 2.15, -0.35);
        crest.rotation.x = -0.95;
        this.group.add(crest);
      } else {
        const snoutGeo = new THREE.SphereGeometry(0.32, 14, 10);
        snoutGeo.scale(1.0, 0.75, 0.88);
        const snout = new THREE.Mesh(snoutGeo, this.bellyMat);
        snout.position.set(0, 1.64, 0.54);
        this.group.add(snout);

        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.25 }));
        nose.position.set(0, 1.73, 0.80);
        this.group.add(nose);

        if (this.animal === 'beaver') {
          // Iconic cute buck teeth
          const toothGeo = new THREE.BoxGeometry(0.10, 0.14, 0.06);
          for (const side of [-1, 1]) {
            const tooth = new THREE.Mesh(toothGeo, this.eyeWhiteMat);
            tooth.position.set(side * 0.06, 1.50, 0.78);
            this.group.add(tooth);
          }
        }
      }

      // Ears & Tails (Tail placed in movable tailGroup)
      this.tailGroup = new THREE.Group();
      this.tailGroup.position.set(0, 0.62, -0.66);
      this.group.add(this.tailGroup);

      if (this.animal === 'bear') {
        for (let side of [-1, 1]) {
          const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), this.darkMat);
          earOuter.position.set(side * 0.48, 2.24, 0.02);
          earOuter.castShadow = true;
          const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), this.innerEarMat);
          earInner.position.set(side * 0.48, 2.24, 0.12);
          this.group.add(earOuter);
          this.group.add(earInner);
        }
        const bobtail = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), this.darkMat);
        bobtail.position.set(0, 0.02, -0.08);
        bobtail.castShadow = true;
        this.tailGroup.add(bobtail);
      } else if (this.animal === 'fox') {
        for (let side of [-1, 1]) {
          const earOuter = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.64, 7), this.bodyMat);
          earOuter.position.set(side * 0.36, 2.34, 0.05);
          earOuter.rotation.z = -side * 0.22;
          earOuter.castShadow = true;
          const earTip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.26, 7), this.darkMat);
          earTip.position.set(side * 0.42, 2.54, 0.05);
          earTip.rotation.z = -side * 0.22;
          this.group.add(earOuter);
          this.group.add(earTip);
        }
        // Bushy Fox Tail with White Tip!
        const bushyTail = new THREE.Mesh(new THREE.ConeGeometry(0.36, 1.05, 10), this.bodyMat);
        bushyTail.position.set(0, 0.18, -0.35);
        bushyTail.rotation.x = -0.95;
        bushyTail.castShadow = true;
        const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.48, 10), this.bellyMat);
        tailTip.position.set(0, 0.40, -0.68);
        tailTip.rotation.x = -0.95;
        this.tailGroup.add(bushyTail);
        this.tailGroup.add(tailTip);
      } else if (this.animal === 'beaver') {
        for (let side of [-1, 1]) {
          const ear = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), this.darkMat);
          ear.position.set(side * 0.46, 2.16, 0.0);
          this.group.add(ear);
        }
        // Rounded Waffle Paddle Tail
        const paddleGeo = new THREE.BoxGeometry(0.62, 0.12, 1.02);
        const paddle = new THREE.Mesh(paddleGeo, this.darkMat);
        paddle.position.set(0, -0.05, -0.45);
        paddle.rotation.x = -0.28;
        paddle.castShadow = true;
        this.tailGroup.add(paddle);
      } else if (isEagle) {
        // Tail feathers fan
        for (let f = -1; f <= 1; f++) {
          const feather = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.75), this.bellyMat);
          feather.position.set(f * 0.20, 0.06, -0.36);
          feather.rotation.set(0.22, f * -0.26, 0);
          this.tailGroup.add(feather);
        }
      }

      // 3. Articulated Arms / Wings
      if (isEagle) {
        const makeWing = (side) => {
          const wg = new THREE.Group();
          const mainFeath = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8), this.bodyMat);
          mainFeath.scale.set(1.15, 0.28, 0.72);
          mainFeath.position.set(side * 0.42, 0, -0.08);
          mainFeath.rotation.y = side * -0.25;
          mainFeath.castShadow = true;
          wg.add(mainFeath);

          const tipFeath = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 6), this.bodyMat);
          tipFeath.rotation.z = side * -Math.PI / 2;
          tipFeath.rotation.y = side * -0.28;
          tipFeath.position.set(side * 0.92, -0.02, -0.18);
          wg.add(tipFeath);
          wg.position.set(side * 0.54, 1.12, 0.0);
          return wg;
        };
        this.wingL = makeWing(1);
        this.wingR = makeWing(-1);
        this.group.add(this.wingL);
        this.group.add(this.wingR);
      }
      const armGeo = new THREE.SphereGeometry(0.21, 10, 8);
      armGeo.scale(0.82, 1.32, 0.82);
      this.armL = new THREE.Mesh(armGeo, this.bodyMat);
      this.armR = new THREE.Mesh(armGeo, this.bodyMat);
      this.armL.position.set(0.74, 1.05, 0.1);
      this.armR.position.set(-0.74, 1.05, 0.1);
      this.armL.castShadow = true;
      this.armR.castShadow = true;
      this.group.add(this.armL);
      this.group.add(this.armR);

      // 4. Stylized Running Sneakers / Feet
      const buildFoot = () => {
        const fg = new THREE.Group();
        const sneaker = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.56), this.shoeMat);
        sneaker.position.y = 0.16;
        sneaker.castShadow = true;
        const toeCap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), this.soleMat);
        toeCap.scale.set(1.0, 0.65, 1.0);
        toeCap.position.set(0, 0.14, 0.24);
        const sole = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.08, 0.62), this.soleMat);
        sole.position.y = 0.04;
        fg.add(sneaker); fg.add(toeCap); fg.add(sole);
        return fg;
      };
      this.footL = buildFoot();
      this.footR = buildFoot();
      this.footL.position.set(0.36, 0, 0);
      this.footR.position.set(-0.36, 0, 0);
      this.group.add(this.footL);
      this.group.add(this.footR);

      // Translucent Glowing Energy Shield Aura + Orbit Ring
      this.shieldMesh = new THREE.Group();
      const shieldDome = new THREE.Mesh(
        new THREE.SphereGeometry(1.42, 20, 14),
        new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00b0ff,
          emissiveIntensity: 0.75,
          transparent: true,
          opacity: 0.24,
          roughness: 0.15
        })
      );
      const shieldRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.45, 0.055, 8, 28),
        new THREE.MeshBasicMaterial({ color: 0x80f8ff, transparent: true, opacity: 0.7 })
      );
      shieldRing.rotation.x = Math.PI / 2;
      this.shieldMesh.add(shieldDome);
      this.shieldMesh.add(shieldRing);
      this.shieldMesh.position.y = 1.1;
      this.shieldMesh.visible = false;
      this.group.add(this.shieldMesh);

      if (this.isPlayer) {
        this.badgeSprite = this.createBadgeSprite('DU');
        this.badgeSprite.position.y = 2.7;
        this.group.add(this.badgeSprite);
      }
    }

    jump() {
      if (this.dead || this.stunTimer > 0) return;

      if (!this.isJumping) {
        // First jump from ground
        this.vy = 14.5;
        this.isJumping = true;
        this.jumpCount = 1;
        this.isFlipping = false;
        this.flipAngle = 0;
        if (this.isPlayer) sfx.play('jump');
        this.engine.particles.spawnDust(this.x, this.engine.getHillY(this.z), this.z, 6);
      } else if (this.isJumping && this.jumpCount === 1) {
        // Double jump in mid-air with 360° somersault flip & golden sparks!
        this.vy = 13.8;
        this.jumpCount = 2;
        this.isFlipping = true;
        this.flipAngle = 0.05;
        if (this.isPlayer) sfx.play('double_jump');
        this.engine.particles.spawnSparks(this.x, this.engine.getHillY(this.z) + this.jumpY + 0.5, this.z, 20);
      }
    }

    usePowerup(direction = 'default') {
      if (!this.currentWeapon || this.dead) return;
      const wp = this.currentWeapon;
      this.currentWeapon = null;
      if (this.isPlayer) this.engine.hideWeaponButton();

      if (wp === 'blade') {
        sfx.play('blade_act');
        const bladeDir = (direction === 'backward') ? 'backward' : 'forward';
        this.engine.spawnSawblade(this.x, this.z, this, bladeDir);
      } else if (wp === 'trap') {
        sfx.play('trap_act');
        if (direction === 'forward') {
          // Thrown forward to hit opponents ahead or land on the track ahead!
          this.engine.spawnThrownTrap(this.x, this.z, this);
        } else {
          // Standard backward drop
          this.engine.spawnTrap(this.x, this.z - 3.2, this);
        }
      } else if (wp === 'punchBox') {
        sfx.play('bounce');
        if (direction === 'forward') {
          // Thrown forward: boxing glove on spring strikes enemies ahead!
          this.engine.spawnThrownPunchBox(this.x, this.z, this);
        } else {
          // Standard backward drop: surprise box with spring boxing glove
          this.engine.spawnPunchBox(this.x, this.z - 3.2, this);
        }
      } else if (wp === 'speed') {
        sfx.play('speed_act');
        this.speedBoostTimer = 2.8;
        this.speed = this.baseSpeed * 1.55;
      } else if (wp === 'shield') {
        sfx.play('shield_act');
        this.shieldTimer = 4.0;
      } else if (wp === 'lightning') {
        sfx.play('lightning_act');
        this.engine.triggerLightning(this);
      }
    }

    takeDamage(reason = 'blade') {
      if (this.shieldTimer > 0 || this.dead) return;

      this.dead = true;
      this.respawnTimer = 1.6;
      this.speed = 0;
      this.currentWeapon = null;
      this.group.visible = false;
      this.shadowMesh.visible = false;

      if (reason === 'blade') {
        sfx.play('blade_hit');
        sfx.play('blood');
        this.engine.particles.spawnBlood(this.x, this.engine.getHillY(this.z) + 1.0, this.z, 30);
        if (this.isPlayer) {
          this.engine.triggerBloodScreen();
          this.engine.cameraShake = 0.9;
        }
      } else if (reason === 'trap') {
        sfx.play('trap_hit');
        sfx.play('blood');
        this.engine.particles.spawnBlood(this.x, this.engine.getHillY(this.z) + 0.6, this.z, 25);
        if (this.isPlayer) {
          this.engine.triggerBloodScreen();
          this.engine.cameraShake = 0.7;
        }
      } else if (reason === 'punch') {
        sfx.play('bounce');
        sfx.play('blood');
        this.engine.particles.spawnBlood(this.x, this.engine.getHillY(this.z) + 1.2, this.z, 25);
        this.engine.particles.spawnSparks(this.x, this.engine.getHillY(this.z) + 1.2, this.z, 22);
        if (this.isPlayer) {
          this.engine.triggerBloodScreen();
          this.engine.cameraShake = 0.85;
        }
      } else if (reason === 'lightning') {
        sfx.play('lightning_hit');
        this.engine.particles.spawnSparks(this.x, this.engine.getHillY(this.z) + 1.0, this.z, 25);
        if (this.isPlayer) {
          this.engine.triggerBloodScreen();
          this.engine.cameraShake = 0.6;
        }
      }
    }

    update(dt) {
      if (this.dead) {
        this.respawnTimer -= dt;
        if (this.respawnTimer <= 0) {
          this.dead = false;
          this.group.visible = true;
          this.shadowMesh.visible = true;
          this.speed = this.baseSpeed * 0.75;
          this.jumpY = 4.0;
          this.vy = -4.0;
          this.isJumping = true;
          this.shieldTimer = 1.8;
          sfx.play('jump');
        }
        return;
      }

      // Timers & speed adjustments
      if (this.shieldTimer > 0) {
        this.shieldTimer -= dt;
        this.shieldMesh.visible = true;
      } else {
        this.shieldMesh.visible = false;
      }

      if (this.stumbleTimer > 0) {
        this.stumbleTimer -= dt;
        this.speed = Math.min(this.speed, this.baseSpeed * 0.45);
      } else if (this.speedBoostTimer > 0) {
        this.speedBoostTimer -= dt;
        this.engine.particles.spawnSpeedFlames(this.x, this.engine.getHillY(this.z) + this.jumpY, this.z);
      } else if (this.stunTimer > 0) {
        this.stunTimer -= dt;
        this.speed = 0;
      } else {
        this.speed += (this.baseSpeed - this.speed) * 3.5 * dt;
      }

      // Smooth lane transition
      this.x += (this.targetX - this.x) * 11.0 * dt;
      this.z += this.speed * dt;

      if (this.z >= this.engine.finishLineZ && this.finishTime === null) {
        this.finishTime = (Date.now() - this.engine.raceStartTime) / 1000;
      }

      // Jump & Gravity Physics
      if (this.isJumping) {
        this.jumpY += this.vy * dt;
        this.vy -= 34.0 * dt;
        if (this.isFlipping) {
          this.flipAngle += dt * 15.0;
        }
        if (this.jumpY <= 0) {
          this.jumpY = 0;
          this.isJumping = false;
          this.jumpCount = 0;
          this.isFlipping = false;
          this.flipAngle = 0;
          this.vy = 0;
          this.engine.particles.spawnDust(this.x, this.engine.getHillY(this.z), this.z, 4);
        }
      }

      // AI Logic for Bots
      if (!this.isPlayer) {
        this.aiTimer -= dt;
        if (this.aiTimer <= 0) {
          const lanes = [4.5, 0, -4.5];
          this.targetX = lanes[Math.floor(Math.random() * lanes.length)];
          this.aiTimer = 1.2 + Math.random() * 2.0;
        }

        if (this.currentWeapon && Math.random() < 0.04) {
          const opponentAhead = this.engine.racers.some(other => other !== this && other.z > this.z && (other.z - this.z) < 35.0);
          this.usePowerup(opponentAhead ? 'forward' : 'backward');
        }

        for (let r of this.engine.rocks) {
          if (r.active && r.z > this.z && (r.z - this.z) < 14.0 && Math.abs(r.laneX - this.x) < 2.0) {
            if (Math.random() < 0.75) {
              this.jump();
            } else {
              const openLanes = [4.5, 0, -4.5].filter(l => Math.abs(l - r.laneX) > 2.0);
              if (openLanes.length > 0) this.targetX = openLanes[0];
            }
          }
        }
      }

      // Synchronize 3D Position
      const trackCurveX = this.engine.getCurveX(this.z);
      const groundY = this.engine.getHillY(this.z);
      const finalX = trackCurveX + this.x;
      const finalY = groundY + this.jumpY;

      this.group.position.set(finalX, finalY, this.z);

      // Calculate terrain slope pitch angle (leaning naturally into climbs & descents!)
      const dz = 1.0;
      const slopeDy = this.engine.getHillY(this.z + dz) - this.engine.getHillY(this.z - dz);
      const slopePitch = Math.atan2(slopeDy, dz * 2.0);

      // Tilting & Somersault Rotation (Natural leaning into turns and hills!)
      const laneTilt = (this.targetX - this.x) * 0.08;
      if (this.isFlipping) {
        this.group.rotation.set(this.flipAngle, 0, laneTilt);
      } else {
        // Rotate X axis to follow slope incline
        this.group.rotation.set(-slopePitch, 0, laneTilt);
      }

      // Animated Running Limbs (Arms pump, sneakers step, tail wags, eagle wings flap)
      const runCycle = this.z * 1.6;
      if (!this.isJumping && this.speed > 2.0) {
        // Paws swing opposite
        this.footL.position.z = Math.sin(runCycle) * 0.40;
        this.footR.position.z = Math.sin(runCycle + Math.PI) * 0.40;
        this.footL.position.y = Math.max(0, -Math.sin(runCycle)) * 0.24;
        this.footR.position.y = Math.max(0, -Math.sin(runCycle + Math.PI)) * 0.24;
        this.footL.rotation.x = Math.cos(runCycle) * 0.35;
        this.footR.rotation.x = Math.cos(runCycle + Math.PI) * 0.35;

        this.armL.position.z = -Math.sin(runCycle) * 0.34;
        this.armR.position.z = Math.sin(runCycle) * 0.34;
        this.armL.rotation.x = Math.sin(runCycle) * 0.55;
        this.armR.rotation.x = -Math.sin(runCycle) * 0.55;

        // Running body bobbing
        this.torsoMesh.position.y = 0.92 + Math.abs(Math.sin(runCycle)) * 0.09;
        this.headMesh.position.y = 1.78 + Math.abs(Math.sin(runCycle)) * 0.09;

        if (this.tailGroup) {
          this.tailGroup.rotation.y = Math.sin(runCycle * 0.8) * 0.28;
          this.tailGroup.rotation.x = Math.sin(runCycle) * 0.12;
        }
        if (this.wingL && this.wingR) {
          const flap = Math.sin(runCycle * 1.2) * 0.42;
          this.wingL.rotation.z = flap;
          this.wingR.rotation.z = -flap;
        }
      } else {
        this.footL.position.set(0.36, this.isJumping ? 0.15 : 0, 0);
        this.footR.position.set(-0.36, this.isJumping ? 0.15 : 0, 0);
        this.footL.rotation.x = this.isJumping ? 0.3 : 0;
        this.footR.rotation.x = this.isJumping ? -0.2 : 0;
        this.armL.position.z = 0;
        this.armR.position.z = 0;
        this.armL.rotation.x = this.isJumping ? -0.6 : 0;
        this.armR.rotation.x = this.isJumping ? -0.6 : 0;
        this.torsoMesh.position.y = 0.92;
        this.headMesh.position.y = 1.78;
        if (this.wingL && this.wingR) {
          const wingAngle = this.isJumping ? 0.38 : 0.12;
          this.wingL.rotation.z = wingAngle;
          this.wingR.rotation.z = -wingAngle;
        }
      }

      if (this.shieldMesh && this.shieldMesh.visible) {
        this.shieldMesh.rotation.y += dt * 3.2;
      }

      // Contact Shadow aligned with terrain slope
      this.shadowMesh.position.set(finalX, groundY + 0.05, this.z);
      this.shadowMesh.rotation.set(-Math.PI / 2 - slopePitch, 0, 0);
      const shadowScale = Math.max(0.2, 1.0 - this.jumpY * 0.22);
      this.shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
    }

    destroy() {
      this.engine.scene.remove(this.group);
      this.engine.scene.remove(this.shadowMesh);
    }
  }

  // --------------------------------------------------------------------------
  // 4. MAIN THREE.JS 3D ENGINE
  // --------------------------------------------------------------------------
  class FunRun3DEngine {
    constructor() {
      this.canvas = document.getElementById('gameCanvas3d');
      this.renderer = null;
      this.scene = null;
      this.camera = null;

      this.isPlaying = false;
      this.lastTime = 0;
      this.elapsedTime = 0;
      this.raceStartTime = 0;
      this.controlMode = 'touch';
      this.currentLevel = 1;
      this.selectedAnimal = 'bear';

      this.finishLineZ = 1200; // ~55 second race
      this.cameraShake = 0;

      this.player = null;
      this.racers = [];
      this.rocks = [];
      this.crates = [];
      this.speedPads = [];
      this.bouncePads = [];
      this.projectiles = [];
      this.traps = [];
      this.punchBoxes = [];
      this.lightningEffects = [];
      this.lightningFlashTimer = 0;
      this.clouds = [];
      this.grassMaterials = [];
      this.flowerMaterials = [];
      this.waterMaterials = [];
      this.wildlifeActors = { birds: [], stags: [], blupees: [], runes: [] };
      this.ambientParticles = null;
      this.skyMaterial = null;
      this.terrainShader = null;
      this.textures = null;
      this.particles = null;
      this.keys = {};

      // World Scene Groups
      this.skyGroup = null;
      this.trackGroup = null;
      this.waterGroup = null;
      this.bridgeGroup = null;
      this.sceneryGroup = null;
      this.foliageGroup = null;
      this.wildlifeGroup = null;
      this.finishGateGroup = null;

      // UI References
      this.uiOverlay = document.getElementById('ui3d-overlay');
      this.weaponBtn = document.getElementById('btn3d-powerup');
      this.jumpBtn = document.getElementById('btn3d-jump');
      this.exitBtn = document.getElementById('btn3d-exit');
      this.rankDisplay = document.getElementById('rank3d-display');
      this.countdownDisplay = document.getElementById('countdown3d-display');
      this.bloodOverlay = document.getElementById('blood-overlay');
      this.resultsScreen = document.getElementById('results3d-screen');
      this.resultsList = document.getElementById('results3d-list');
      this.nextLevelBtn = document.getElementById('btn3d-next-level');
      this.restartBtn = document.getElementById('btn3d-restart');
      this.levelsBtn = document.getElementById('btn3d-levels');
      this.menuBtn = document.getElementById('btn3d-menu');
      this.levelSelectScreen = document.getElementById('levelselect3d-screen');
      this.countdownInterval = null;

      this.initThree();
      this.initEvents();
    }

    getBiomeConfig(level = 1) {
      if (level === 2) {
        // Level 2: Snowset Peaks (Glacier Alpine Peaks & Crystalline Snow)
        return {
          skyTop: '#163f7d',
          skyMid: '#68b9eb',
          skyHorizon: '#dff4ff',
          skyBottom: '#1c3b4d',
          sunColor: '#fff9e6',
          fogColor: '#cae8f7',
          fogDensity: 0.0020,
          hemiSky: 0xd8f3ff,
          hemiGround: 0x3b586e,
          sunLightCol: 0xf4faff,
          rimLightCol: 0xa5f3fc,
          grassBase: '#1b473a',
          grassMid: '#3a7a63',
          grassTip: '#9dd6be',
          waterDeep: '#00264d',
          waterShallow: '#22c4e0',
          curbA: 0x38bdf8,
          curbB: 0xf8fafc,
          treeMix: 'pine_heavy'
        };
      }
      if (level === 3) {
        // Level 3: Sugar Slope (Sakura Blossom & Vibrant Golden Twilight)
        return {
          skyTop: '#4c1d6b',
          skyMid: '#d96ba8',
          skyHorizon: '#ffc88a',
          skyBottom: '#2d572c',
          sunColor: '#fff0bd',
          fogColor: '#f5b3a6',
          fogDensity: 0.0017,
          hemiSky: 0xffd1ec,
          hemiGround: 0x3a6e2e,
          sunLightCol: 0xfff1dc,
          rimLightCol: 0xfbcfe8,
          grassBase: '#184725',
          grassMid: '#2c823b',
          grassTip: '#64d158',
          waterDeep: '#0a486b',
          waterShallow: '#2dd4bf',
          curbA: 0xff4081,
          curbB: 0xfff5f8,
          treeMix: 'sakura_heavy'
        };
      }
      if (level === 4) {
        // Level 4: Lagoon Canyon (Bright Tropical Coast & Sandstone Cliffs)
        return {
          skyTop: '#035991',
          skyMid: '#24a8e6',
          skyHorizon: '#fcd975',
          skyBottom: '#0f4725',
          sunColor: '#fff8d6',
          fogColor: '#9ed8f2',
          fogDensity: 0.00115,
          hemiSky: 0xd6f0ff,
          hemiGround: 0x20573d,
          sunLightCol: 0xfff4cc,
          rimLightCol: 0x67e8f9,
          grassBase: '#114d18',
          grassMid: '#2f8a36',
          grassTip: '#84cc16',
          waterDeep: '#025c8a',
          waterShallow: '#14b8a6',
          curbA: 0xf59e0b,
          curbB: 0x14b8a6,
          treeMix: 'hyrule'
        };
      }
      if (level === 5) {
        // Level 5: Volcano Ridge (Molten Lava Gorges, Basalt & Fiery Dusk)
        return {
          skyTop: '#240914',
          skyMid: '#9a241c',
          skyHorizon: '#ff7b29',
          skyBottom: '#1c0c09',
          sunColor: '#ffbf69',
          fogColor: '#7a2c22',
          fogDensity: 0.00145,
          hemiSky: 0xffa07a,
          hemiGround: 0x2b1512,
          sunLightCol: 0xffc88a,
          rimLightCol: 0xff5722,
          grassBase: '#291a16',
          grassMid: '#59291e',
          grassTip: '#b4481e',
          waterDeep: '#8c0d00',
          waterShallow: '#ff6600',
          curbA: 0xf97316,
          curbB: 0x292524,
          treeMix: 'pine_heavy'
        };
      }
      if (level === 6) {
        // Level 6: Emerald Jungle (Deep Tropical Rainforest & Sunbeams)
        return {
          skyTop: '#0d4f44',
          skyMid: '#22a089',
          skyHorizon: '#b5f2c4',
          skyBottom: '#0c3018',
          sunColor: '#fff9cc',
          fogColor: '#87d1ad',
          fogDensity: 0.00135,
          hemiSky: 0xa7f3d0,
          hemiGround: 0x123b1d,
          sunLightCol: 0xfff6d1,
          rimLightCol: 0x4ade80,
          grassBase: '#0a3314',
          grassMid: '#156b29',
          grassTip: '#4ade80',
          waterDeep: '#064e3b',
          waterShallow: '#10b981',
          curbA: 0x16a34a,
          curbB: 0xfef08a,
          treeMix: 'hyrule'
        };
      }
      if (level === 7) {
        // Level 7: Desert Oasis (Golden Sun Dunes & Azure Oasis Waters)
        return {
          skyTop: '#164e96',
          skyMid: '#489ce3',
          skyHorizon: '#ffd285',
          skyBottom: '#6b4214',
          sunColor: '#fff5b8',
          fogColor: '#e6c89a',
          fogDensity: 0.00115,
          hemiSky: 0xffe8b3,
          hemiGround: 0x7c4a1d,
          sunLightCol: 0xfff2c2,
          rimLightCol: 0xfbbf24,
          grassBase: '#5c4b1a',
          grassMid: '#8a7a26',
          grassTip: '#d4b84a',
          waterDeep: '#0369a1',
          waterShallow: '#22d3ee',
          curbA: 0xd97706,
          curbB: 0xfef3c7,
          treeMix: 'hyrule'
        };
      }
      if (level === 8) {
        // Level 8: Starlight Summit (Aurora Night Sky & Luminous Cyan Waters)
        return {
          skyTop: '#05081a',
          skyMid: '#1e1b4b',
          skyHorizon: '#38bdf8',
          skyBottom: '#0b1024',
          sunColor: '#e0f2fe',
          fogColor: '#1d2b53',
          fogDensity: 0.00125,
          hemiSky: 0x93c5fd,
          hemiGround: 0x1e1b4b,
          sunLightCol: 0xdbeafe,
          rimLightCol: 0x38bdf8,
          grassBase: '#0e2438',
          grassMid: '#1d4d6b',
          grassTip: '#38bdf8',
          waterDeep: '#0c1e4a',
          waterShallow: '#38bdf8',
          curbA: 0x38bdf8,
          curbB: 0xc084fc,
          treeMix: 'pine_heavy'
        };
      }
      // Level 1: Sunset Valley (Rich High-Contrast BotW Hyrule Plains!)
      return {
        skyTop: '#154ba8',
        skyMid: '#4ba8de',
        skyHorizon: '#ffc97d',
        skyBottom: '#1a3814',
        sunColor: '#fff2b2',
        fogColor: '#bfd9e3',
        fogDensity: 0.00125,
        hemiSky: 0xa8dffc,
        hemiGround: 0x26521b,
        sunLightCol: 0xfff4cf,
        rimLightCol: 0xffd58a,
        grassBase: '#0f2e12',
        grassMid: '#1c5e21',
        grassTip: '#4ab033',
        waterDeep: '#002247',
        waterShallow: '#0fa3c2',
        curbA: 0xd97706,
        curbB: 0xfef3c7,
        treeMix: 'hyrule'
      };
    }

    /**
     * Single source of truth for per-level 3D track geometry, elevation, bridges, lakes, and obstacles (Levels 1-8).
     */
    getTrackSpec(level = this.currentLevel) {
      if (level === 2) {
        return {
          name: 'Snowset Peaks',
          finishLineZ: 1260,
          bridges: [[290, 480], [880, 1050]],
          bridgeLift: 12.5,
          lakes: [{ z: 650, side: -1, offsetX: 48, radius: 44, depth: 12.0, waterDrop: 4.2, w: 86, l: 105 }],
          curveFn: (z) => Math.sin(z * 0.0155) * 19.0 - Math.sin(z * 0.0065) * 10.0,
          hillFn: (z) => Math.sin(z * 0.009) * 19.0 + Math.sin(z * 0.024 + 1.1) * 10.0 + Math.cos(z * 0.052) * 4.2,
          spawn: { stepMin: 19, stepVar: 9, wCrate: 0.22, wRock: 0.38, wBounce: 0.24, wSpeed: 0.16 }
        };
      }
      if (level === 3) {
        return {
          name: 'Sugar Slope',
          finishLineZ: 1220,
          bridges: [[170, 275], [500, 610], [830, 945]],
          bridgeLift: 9.0,
          lakes: [{ z: 385, side: 1, offsetX: 45, radius: 42, depth: 11.5, waterDrop: 4.0, w: 84, l: 100 }],
          curveFn: (z) => Math.sin(z * 0.0165) * 13.0 - Math.sin(z * 0.0075) * 11.5,
          hillFn: (z) => Math.sin(z * 0.021) * 10.5 + Math.sin(z * 0.044 + 0.4) * 7.2 + Math.cos(z * 0.080) * 3.0,
          spawn: { stepMin: 18, stepVar: 8, wCrate: 0.26, wRock: 0.16, wBounce: 0.26, wSpeed: 0.32 }
        };
      }
      if (level === 4) {
        return {
          name: 'Lagoon Canyon',
          finishLineZ: 1300,
          bridges: [[210, 345], [565, 725], [935, 1075]],
          bridgeLift: 11.0,
          lakes: [
            { z: 450, side: 1, offsetX: 45, radius: 46, depth: 12.0, waterDrop: 4.2, w: 88, l: 108 },
            { z: 825, side: -1, offsetX: 45, radius: 44, depth: 12.0, waterDrop: 4.2, w: 86, l: 102 }
          ],
          curveFn: (z) => -Math.sin(z * 0.013) * 20.5 + Math.sin(z * 0.0052) * 11.5,
          hillFn: (z) => Math.sin(z * 0.0115) * 14.0 - Math.sin(z * 0.025) * 8.0 + Math.sin(z * 0.056) * 3.5,
          spawn: { stepMin: 17, stepVar: 8, wCrate: 0.24, wRock: 0.32, wBounce: 0.24, wSpeed: 0.20 }
        };
      }
      if (level === 5) {
        // Volcano Ridge: Steep volcanic ridge climb, long lava chasm bridges & boulder runs
        return {
          name: 'Volcano Ridge',
          finishLineZ: 1340,
          bridges: [[260, 440], [820, 1010]],
          bridgeLift: 13.5,
          lakes: [{ z: 620, side: 1, offsetX: 46, radius: 46, depth: 13.0, waterDrop: 4.5, w: 92, l: 112 }],
          curveFn: (z) => Math.sin(z * 0.0145) * 18.0 + Math.sin(z * 0.0068) * 12.0,
          hillFn: (z) => Math.sin(z * 0.008) * 21.0 + Math.sin(z * 0.029) * 9.5 + Math.cos(z * 0.062) * 4.0,
          spawn: { stepMin: 17, stepVar: 7, wCrate: 0.24, wRock: 0.40, wBounce: 0.20, wSpeed: 0.16 }
        };
      }
      if (level === 6) {
        // Emerald Jungle: Winding rainforest chicanes, 3 river spans & bounce-pad chains
        return {
          name: 'Emerald Jungle',
          finishLineZ: 1280,
          bridges: [[190, 310], [530, 660], [900, 1030]],
          bridgeLift: 9.5,
          lakes: [{ z: 420, side: -1, offsetX: 46, radius: 44, depth: 11.5, waterDrop: 4.0, w: 86, l: 102 }],
          curveFn: (z) => -Math.sin(z * 0.016) * 16.5 + Math.sin(z * 0.008) * 10.5,
          hillFn: (z) => Math.sin(z * 0.017) * 12.5 + Math.cos(z * 0.036) * 7.8 + Math.sin(z * 0.072) * 3.2,
          spawn: { stepMin: 18, stepVar: 8, wCrate: 0.26, wRock: 0.22, wBounce: 0.34, wSpeed: 0.18 }
        };
      }
      if (level === 7) {
        // Desert Oasis: Wide sweeping sand dunes, twin oasis lakes & turbo speed strips
        return {
          name: 'Desert Oasis',
          finishLineZ: 1360,
          bridges: [[310, 460], [860, 1020]],
          bridgeLift: 10.5,
          lakes: [
            { z: 165, side: -1, offsetX: 48, radius: 46, depth: 11.5, waterDrop: 4.0, w: 90, l: 108 },
            { z: 660, side: 1, offsetX: 46, radius: 46, depth: 11.5, waterDrop: 4.0, w: 90, l: 108 }
          ],
          curveFn: (z) => Math.sin(z * 0.0105) * 21.0 - Math.sin(z * 0.0045) * 11.0,
          hillFn: (z) => Math.sin(z * 0.0125) * 15.0 + Math.sin(z * 0.032 + 0.7) * 7.5 + Math.cos(z * 0.055) * 3.0,
          spawn: { stepMin: 18, stepVar: 8, wCrate: 0.24, wRock: 0.20, wBounce: 0.20, wSpeed: 0.36 }
        };
      }
      if (level === 8) {
        // Starlight Summit: Grand Finale! 1420m aurora mountain track with 3 towering bridges
        return {
          name: 'Starlight Summit',
          finishLineZ: 1420,
          bridges: [[220, 380], [620, 780], [1020, 1180]],
          bridgeLift: 14.0,
          lakes: [{ z: 495, side: 1, offsetX: 47, radius: 46, depth: 12.5, waterDrop: 4.2, w: 90, l: 110 }],
          curveFn: (z) => Math.sin(z * 0.015) * 19.5 - Math.sin(z * 0.0072) * 12.5,
          hillFn: (z) => Math.sin(z * 0.010) * 18.0 + Math.sin(z * 0.028 + 0.8) * 10.5 + Math.cos(z * 0.064) * 4.2,
          spawn: { stepMin: 16, stepVar: 7, wCrate: 0.26, wRock: 0.30, wBounce: 0.22, wSpeed: 0.22 }
        };
      }
      // Level 1: Sunset Valley
      return {
        name: 'Sunset Valley',
        finishLineZ: 1180,
        bridges: [[240, 390], [740, 890]],
        bridgeLift: 10.0,
        lakes: [{ z: 115, side: 1, offsetX: 46, radius: 48, depth: 12.0, waterDrop: 4.2, w: 90, l: 110 }],
        curveFn: (z) => Math.sin(z * 0.0115) * 15.5 + Math.sin(z * 0.0048) * 9.5,
        hillFn: (z) => Math.sin(z * 0.014) * 12.0 + Math.sin(z * 0.030 + 0.9) * 8.5 + Math.cos(z * 0.065) * 3.8,
        spawn: { stepMin: 22, stepVar: 10, wCrate: 0.28, wRock: 0.30, wBounce: 0.20, wSpeed: 0.22 }
      };
    }

    initThree() {
      if (!this.canvas) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        ('ontouchstart' in window && window.innerWidth < 1024);
      this.isMobile = isMobile;

      // WebGL Renderer calibrated like Zelda-Copy1/GameEngine.ts
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2.0));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.94;

      const maxAniso = this.renderer.capabilities ? Math.min(8, this.renderer.capabilities.getMaxAnisotropy()) : 4;
      this.textures = new TextureFactory(maxAniso);

      // 3D Scene & Fog
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x4ba8de);
      this.scene.fog = new THREE.FogExp2(0xbfd9e3, 0.00125);

      // Perspective Camera (Behind-the-Back Follower with deep horizon culling)
      this.camera = new THREE.PerspectiveCamera(56, w / h, 0.15, 750);

      // High-Contrast AAA 4-Light Rig (Deep shadows + crisp sunlit highlights + silhouette rim)
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.24);
      this.scene.add(this.ambientLight);

      this.hemiLight = new THREE.HemisphereLight(0xa8dffc, 0x26521b, 0.36);
      this.scene.add(this.hemiLight);

      const shadowRes = isMobile ? 1024 : 2048;
      this.sunLight = new THREE.DirectionalLight(0xfff4cf, 1.42);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = shadowRes;
      this.sunLight.shadow.mapSize.height = shadowRes;
      this.sunLight.shadow.camera.near = 1.0;
      this.sunLight.shadow.camera.far = 200;
      this.sunLight.shadow.camera.left = -42;
      this.sunLight.shadow.camera.right = 42;
      this.sunLight.shadow.camera.top = 42;
      this.sunLight.shadow.camera.bottom = -42;
      this.sunLight.shadow.bias = -0.0004;
      this.sunLight.shadow.normalBias = 0.03;
      this.scene.add(this.sunLight);
      this.scene.add(this.sunLight.target);

      // BotW-style rim light for crisp racer & foliage highlights
      this.rimLight = new THREE.DirectionalLight(0xffd58a, 0.45);
      this.rimLight.castShadow = false;
      this.scene.add(this.rimLight);
      this.scene.add(this.rimLight.target);

      this.particles = new ParticleSystem3D(this.scene);
    }

    applyBiomeLighting() {
      const b = this.getBiomeConfig(this.currentLevel);
      if (this.scene && this.scene.fog) {
        this.scene.fog.color.set(b.fogColor);
        this.scene.fog.density = b.fogDensity;
        this.scene.background.set(b.skyMid);
      }
      if (this.hemiLight) {
        this.hemiLight.color.setHex(b.hemiSky);
        this.hemiLight.groundColor.setHex(b.hemiGround);
      }
      if (this.sunLight) {
        if (typeof b.sunLightCol === 'string') {
          this.sunLight.color.set(b.sunLightCol);
        } else {
          this.sunLight.color.setHex(b.sunLightCol);
        }
      }
      if (this.rimLight) {
        this.rimLight.color.setHex(b.rimLightCol);
      }
    }

    // ------------------------------------------------------------------------
    // TRACK MATHEMATICS (Per-level curves, roller-coaster hills, bridges & lakes)
    // ------------------------------------------------------------------------
    getCurveX(z) {
      return this.getTrackSpec().curveFn(z);
    }

    getBridgeSpanAt(z) {
      const bridges = this.getTrackSpec().bridges;
      for (let i = 0; i < bridges.length; i++) {
        const span = bridges[i];
        if (z >= span[0] && z <= span[1]) return span;
      }
      return null;
    }

    isBridge(z) {
      return this.getBridgeSpanAt(z) !== null;
    }

    getCanyonFactor(z) {
      const bridges = this.getTrackSpec().bridges;
      let maxF = 0;
      for (const [s, e] of bridges) {
        if (z >= s && z <= e) return 1.0;
        if (z > s - 16 && z < s) {
          const t = (z - (s - 16)) / 16.0;
          maxF = Math.max(maxF, t * t * (3 - 2 * t));
        } else if (z > e && z < e + 16) {
          const t = 1.0 - (z - e) / 16.0;
          maxF = Math.max(maxF, t * t * (3 - 2 * t));
        }
      }
      return maxF;
    }

    isNearCanyonMouth(z) {
      const bridges = this.getTrackSpec().bridges;
      for (const [s, e] of bridges) {
        if ((z > s - 22 && z < s + 5) || (z > e - 5 && z < e + 22)) return true;
      }
      return false;
    }

    isInLakeZone(z, side) {
      const lakes = this.getTrackSpec().lakes;
      for (const lake of lakes) {
        if (side === lake.side && Math.abs(z - lake.z) < lake.radius + 22) return true;
      }
      return false;
    }

    getRawHillY(z) {
      const spec = this.getTrackSpec();
      let h = spec.hillFn(z);
      const span = this.getBridgeSpanAt(z);
      if (span) {
        const length = Math.max(1, span[1] - span[0]);
        const t = (z - span[0]) / length;
        h += Math.sin(t * Math.PI) * spec.bridgeLift;
      }
      return h;
    }

    getHillY(z) {
      if (this._hillY0 === undefined) {
        this._hillY0 = this.getRawHillY(0);
      }
      return this.getRawHillY(z) - this._hillY0;
    }

    getGroundY(x, z) {
      const cx = this.getCurveX(z);
      const distFromCenter = Math.abs(x - cx);
      const trackH = this.getHillY(z);
      const canyon = this.getCanyonFactor(z);

      // Scenic lakeside depressions defined in track spec
      let lakeDip = 0;
      if (distFromCenter > 13.0) {
        const lakes = this.getTrackSpec().lakes;
        for (const lake of lakes) {
          const lakeDist = Math.hypot(x - (cx + lake.side * lake.offsetX), z - lake.z);
          if (lakeDist < lake.radius) {
            const lt = Math.pow(Math.max(0, 1.0 - lakeDist / lake.radius), 1.8);
            lakeDip = Math.max(lakeDip, lt * lake.depth);
          }
        }
      }

      // Natural rolling BotW meadows and side slopes
      const lateralOut = Math.max(0, distFromCenter - 7.5);
      const gentleRoll = Math.sin(x * 0.038 + z * 0.018) * 3.2 + Math.cos(x * 0.08 - z * 0.025) * 1.4;
      const sideHillRise = (lateralOut > 12 ? Math.pow((lateralOut - 12) / 28, 1.35) * 9.5 : -lateralOut * 0.06);
      const hillY = trackH + sideHillRise + gentleRoll * Math.min(1.0, lateralOut / 12.0) - lakeDip;

      if (canyon > 0.01 && distFromCenter > 6.8) {
        // Carve dramatic canyon river gorge under suspension bridges, rising back up beyond 28m
        const gorgeProfile = distFromCenter < 26
          ? -32.0
          : -32.0 + Math.min(28.0, (distFromCenter - 26) * 0.65);
        const gorgeY = trackH + gorgeProfile + Math.sin(x * 0.09 + z * 0.07) * 1.8;
        return THREE.MathUtils.lerp(hillY, gorgeY, canyon);
      }

      return hillY;
    }

    // ------------------------------------------------------------------------
    // ENVIRONMENT & SCENERY (Sky Dome Shader, Grounded Alpine Mountains, Clouds)
    // ------------------------------------------------------------------------
    buildSkyAndMountains() {
      if (this.skyGroup) this.scene.remove(this.skyGroup);
      this.skyGroup = new THREE.Group();
      const biome = this.getBiomeConfig(this.currentLevel);

      // 1. Procedural Zelda-Copy1 Sky Dome Shader with Luminous Sun Disc, Halo & High Cirrus Wisps
      if (this.skyDome) this.scene.remove(this.skyDome);
      const skyGeo = new THREE.SphereGeometry(620, 32, 20);
      this.skyMaterial = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTopColor: { value: new THREE.Color(biome.skyTop) },
          uMidColor: { value: new THREE.Color(biome.skyMid) },
          uHorizonColor: { value: new THREE.Color(biome.skyHorizon) },
          uBottomColor: { value: new THREE.Color(biome.skyBottom) },
          uSunPos: { value: new THREE.Vector3(110, 125, 240).normalize() },
          uSunColor: { value: new THREE.Color(biome.sunColor) },
          uTime: { value: 0 }
        },
        vertexShader: `
          varying vec3 vWorldDir;
          void main() {
            vWorldDir = normalize(position);
            vec4 wp = modelMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform vec3 uTopColor;
          uniform vec3 uMidColor;
          uniform vec3 uHorizonColor;
          uniform vec3 uBottomColor;
          uniform vec3 uSunPos;
          uniform vec3 uSunColor;
          uniform float uTime;
          varying vec3 vWorldDir;

          float hash21(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise2(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
              mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
              f.y
            );
          }

          void main() {
            vec3 dir = normalize(vWorldDir);
            float h = dir.y;
            vec3 col;
            if (h > 0.0) {
              float midBlend = smoothstep(0.0, 0.34, h);
              float topBlend = smoothstep(0.28, 0.88, h);
              col = mix(uHorizonColor, uMidColor, midBlend);
              col = mix(col, uTopColor, topBlend);

              // Subtle painted cirrus cloud wisps high in the BotW sky
              if (h > 0.05) {
                vec2 cloudUv = dir.xz / (dir.y + 0.18) * 1.4 + vec2(uTime * 0.012, uTime * 0.005);
                float wisp = noise2(cloudUv) * 0.6 + noise2(cloudUv * 2.3) * 0.4;
                float cloudMask = smoothstep(0.56, 0.82, wisp) * smoothstep(0.05, 0.25, h) * 0.22;
                col = mix(col, vec3(1.0, 0.98, 0.95), cloudMask);
              }
            } else {
              col = mix(uHorizonColor, uBottomColor, smoothstep(0.0, -0.35, h));
            }

            // Crisp radiant sun disc + BotW golden corona
            float sunDot = max(0.0, dot(dir, normalize(uSunPos)));
            float sunDisc = smoothstep(0.9980, 0.9990, sunDot);
            float sunGlow = pow(sunDot, 14.0) * 0.55 + pow(sunDot, 3.5) * 0.22;
            col += uSunColor * (sunDisc * 1.6 + sunGlow);

            gl_FragColor = vec4(col, 1.0);
          }
        `
      });
      this.skyDome = new THREE.Mesh(skyGeo, this.skyMaterial);
      this.scene.add(this.skyDome);

      // 2. Deeply Grounded Multi-Peak Alpine Mountain Ranges (NO floating bases!)
      // Build custom sculpted peak geometry with vertex-colored elevation bands
      const makeMountainGeo = (radius, height, radialSegs, seed) => {
        const rng = createSeededRng(seed);
        const geo = new THREE.ConeGeometry(radius, height, radialSegs, 6);
        const pos = geo.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        const col = new THREE.Color();
        const isSnowBiome = (this.currentLevel === 2);
        const cFoot = new THREE.Color(
          isSnowBiome ? 0x2c475c
            : this.currentLevel === 5 ? 0x331814
            : this.currentLevel === 7 ? 0x8f5b28
            : this.currentLevel === 8 ? 0x172554
            : 0x1c3d1a
        );
        const cRock = new THREE.Color(this.currentLevel === 5 ? 0x292121 : this.currentLevel === 7 ? 0xb4773a : 0x475569);
        const cSnow = new THREE.Color(this.currentLevel === 5 ? 0xf97316 : this.currentLevel === 7 ? 0xfde68a : this.currentLevel === 8 ? 0x7dd3fc : 0xf0f7ff);

        for (let i = 0; i < pos.count; i++) {
          let vx = pos.getX(i);
          let vy = pos.getY(i) + height * 0.5; // shift origin so y=0 is bottom, y=height is peak
          let vz = pos.getZ(i);
          const hNorm = vy / height;

          // Jagged natural mountain ridging on mid-slopes
          if (hNorm > 0.05 && hNorm < 0.96) {
            const ang = Math.atan2(vz, vx);
            const ridge = Math.sin(ang * 5.0 + seed) * 0.14 + Math.cos(ang * 3.0 + vy * 0.04) * 0.10;
            vx *= (1.0 + ridge);
            vz *= (1.0 + ridge);
          }
          pos.setXYZ(i, vx, vy, vz);

          // Elevation color gradient
          const snowLine = isSnowBiome ? 0.42 : 0.68;
          if (hNorm > snowLine + 0.06) {
            col.copy(cSnow);
          } else if (hNorm > snowLine) {
            col.copy(cRock).lerp(cSnow, (hNorm - snowLine) / 0.06);
          } else if (hNorm > 0.35) {
            col.copy(cFoot).lerp(cRock, Math.min(1, (hNorm - 0.35) / 0.25));
          } else {
            col.copy(cFoot);
          }
          const jitter = 0.92 + rng() * 0.14;
          colors[i * 3] = col.r * jitter;
          colors[i * 3 + 1] = col.g * jitter;
          colors[i * 3 + 2] = col.b * jitter;
        }
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
      };

      const mtnGeoA = makeMountainGeo(85, 195, 9, 41);
      const mtnGeoB = makeMountainGeo(105, 225, 11, 89);
      const mtnMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.92,
        metalness: 0.03,
        flatShading: true
      });

      const mtnRng = createSeededRng(4242);
      for (let z = 20; z < this.finishLineZ + 320; z += 95) {
        const cx = this.getCurveX(z);
        for (const side of [-1, 1]) {
          // Grounded far below (-105) so bottom rim is ALWAYS buried deep underground
          const xDist = side * (145 + mtnRng() * 75);
          const geoChoice = mtnRng() > 0.5 ? mtnGeoA : mtnGeoB;
          const mMesh = new THREE.Mesh(geoChoice, mtnMat);
          const sx = 0.85 + mtnRng() * 0.6;
          const sy = 0.8 + mtnRng() * 0.55;
          mMesh.scale.set(sx, sy, sx * (0.9 + mtnRng() * 0.3));
          mMesh.rotation.y = mtnRng() * Math.PI * 2;
          mMesh.position.set(cx + xDist, -105, z + (mtnRng() - 0.5) * 40);
          this.skyGroup.add(mMesh);
        }
      }

      // 3. Soft Volumetric Fluffy Stylized Clouds high above mountains & camera
      this.clouds = [];
      const cloudParts = [];
      const puffGeo = makeOrganicCanopyGeo(6.4, 7);
      for (let c = 0; c < 6; c++) {
        const ang = (c / 6) * Math.PI * 2;
        const rx = (c - 2.5) * 4.4;
        const ry = (c === 2 || c === 3) ? 2.2 : 0.4;
        const rz = Math.sin(ang) * 2.5;
        const sc = (c === 2 || c === 3) ? 1.25 : 0.82;
        cloudParts.push({
          geo: puffGeo,
          pos: [rx, ry, rz],
          scale: [sc * 1.15, sc * 0.72, sc * 0.95],
          color: ry > 1.0 ? 0xffffff : 0xeef5fc,
          ao: false
        });
      }
      const cloudMergedGeo = mergeColoredGeometries(cloudParts, 0.1);
      const cloudMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.95,
        metalness: 0.0,
        transparent: true,
        opacity: 0.92
      });

      const clRng = createSeededRng(777);
      for (let z = 30; z < this.finishLineZ + 260; z += 75) {
        const cx = this.getCurveX(z);
        const clMesh = new THREE.Mesh(cloudMergedGeo, cloudMat);
        const s = 0.8 + clRng() * 0.7;
        clMesh.scale.set(s, s * 0.85, s);
        clMesh.position.set(cx + (clRng() - 0.5) * 180, 92 + clRng() * 32, z);
        clMesh.rotation.y = (clRng() - 0.5) * 0.6;
        this.skyGroup.add(clMesh);
        this.clouds.push(clMesh);
      }

      this.scene.add(this.skyGroup);
    }

    buildTrackMesh() {
      if (this.trackGroup) this.scene.remove(this.trackGroup);
      this.trackGroup = new THREE.Group();

      const level = this.currentLevel;
      const segStep = 1.8; // High resolution for smooth curves & slopes
      const segCount = Math.ceil((this.finishLineZ + 160) / segStep);

      // ----------------------------------------------------------------------
      // 1. OUTER HYRULE TERRAIN & CANYON WALLS (Left & Right strips, zero bleed!)
      // ----------------------------------------------------------------------
      const leftOffsets = [-105, -62, -32, -16.5, -10.5, -7.8, -7.15, -6.85];
      const rightOffsets = [6.85, 7.15, 7.8, 10.5, 16.5, 32, 62, 105];

      const terrainPalettes = {
        1: { valley: '#226e1f', hill: '#358a2b', moss: '#174a14', rock: '#333a45' },
        2: { valley: '#9ec5e6', hill: '#d6ecff', moss: '#527694', rock: '#3b4a5c' },
        3: { valley: '#2d8f3b', hill: '#45ab4e', moss: '#1d6129', rock: '#694358' },
        4: { valley: '#228a38', hill: '#4db52f', moss: '#135922', rock: '#855739' },
        5: { valley: '#332422', hill: '#4f332c', moss: '#1f1514', rock: '#1f1a1c' },
        6: { valley: '#155c25', hill: '#237a32', moss: '#0d3d18', rock: '#2e3b34' },
        7: { valley: '#c78c3c', hill: '#e3ae59', moss: '#9c6623', rock: '#7a4b21' },
        8: { valley: '#1a2b4c', hill: '#294270', moss: '#111b33', rock: '#1e1b4b' }
      };
      const tp = terrainPalettes[level] || terrainPalettes[1];
      const terrainPalette = {
        valley: new THREE.Color(tp.valley),
        hill: new THREE.Color(tp.hill),
        moss: new THREE.Color(tp.moss),
        rock: new THREE.Color(tp.rock)
      };

      const buildSideTerrain = (offsets) => {
        const ptsPerRow = offsets.length;
        const pos = [];
        const uvs = [];
        const col = [];
        const idx = [];
        const cTmp = new THREE.Color();

        for (let i = 0; i <= segCount; i++) {
          const z = i * segStep;
          const cx = this.getCurveX(z);
          const cy = this.getHillY(z);
          const canyon = this.getCanyonFactor(z);

          const dx = this.getCurveX(z + 0.5) - this.getCurveX(z - 0.5);
          const len = Math.sqrt(dx * dx + 1);
          const nx = 1 / len;
          const nz = -dx / len;

          for (let j = 0; j < ptsPerRow; j++) {
            const w = offsets[j];
            const absW = Math.abs(w);
            const vx = cx + nx * w;
            const vz = z + nz * w;
            let vy;

            if (absW <= 7.25) {
              // Tuck smoothly under road/bridge edge, drop into canyon on bridges!
              const edgeDrop = absW <= 6.9 ? -0.02 : -0.10;
              const hillEdgeY = cy + edgeDrop;
              const canyonEdgeY = this.getGroundY(vx, vz);
              vy = THREE.MathUtils.lerp(hillEdgeY, canyonEdgeY, canyon);
            } else {
              vy = this.getGroundY(vx, vz);
            }

            // World biome coloring
            const hDiff = vy - cy;
            const noiseVar = (Math.sin(vx * 0.08) * Math.cos(vz * 0.07) + 1.0) * 0.5;
            if (canyon > 0.35 && absW < 30) {
              // Canyon wall slate rock & earthy stone
              cTmp.copy(terrainPalette.rock).lerp(terrainPalette.moss, noiseVar * 0.25);
            } else if (absW > 7.2 && absW < 9.5 && canyon < 0.2) {
              // Lush verge framing the trail
              cTmp.copy(terrainPalette.moss).lerp(terrainPalette.valley, 0.65);
            } else if (hDiff > 6.5) {
              cTmp.copy(terrainPalette.hill).lerp(terrainPalette.moss, 0.22 * noiseVar);
            } else {
              cTmp.copy(terrainPalette.valley).lerp(terrainPalette.hill, noiseVar);
            }

            pos.push(vx, vy, vz);
            uvs.push(vx * 0.075, vz * 0.075);
            col.push(cTmp.r, cTmp.g, cTmp.b);
          }
        }

        for (let i = 0; i < segCount; i++) {
          const r1 = i * ptsPerRow;
          const r2 = (i + 1) * ptsPerRow;
          for (let j = 0; j < ptsPerRow - 1; j++) {
            idx.push(r1 + j, r2 + j, r1 + j + 1);
            idx.push(r2 + j, r2 + j + 1, r1 + j + 1);
          }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
        geo.setIndex(idx);
        geo.computeVertexNormals();
        return geo;
      };

      const tTex = this.textures.getTerrainTextures(level);
      const terrainMat = new THREE.MeshStandardMaterial({
        map: tTex.map,
        bumpMap: tTex.bumpMap,
        bumpScale: 0.24,
        vertexColors: true,
        roughness: 0.94,
        metalness: 0.0
      });

      // Zelda-Copy1/Terrain.ts procedural organic cliff rock & meadow patch variation shader!
      terrainMat.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPosTerrain;\nvarying vec3 vWorldNormTerrain;')
          .replace('#include <project_vertex>', '#include <project_vertex>\nvWorldPosTerrain = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWorldNormTerrain = normalize(mat3(modelMatrix) * normal);');

        shader.fragmentShader = shader.fragmentShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vWorldPosTerrain;\nvarying vec3 vWorldNormTerrain;')
          .replace('#include <color_fragment>', `
            #include <color_fragment>
            float tSlope = 1.0 - clamp(vWorldNormTerrain.y, 0.0, 1.0);
            float macroPatch = sin(vWorldPosTerrain.x * 0.075 + 0.4) * cos(vWorldPosTerrain.z * 0.065) * 0.5 + 0.5;
            float rockNoise = sin(vWorldPosTerrain.x * 0.45 + vWorldPosTerrain.z * 0.38) * 0.035;
            float strata = sin(vWorldPosTerrain.y * 0.85 + sin(vWorldPosTerrain.z * 0.12) * 1.6) * 0.04 + rockNoise;
            if (tSlope > 0.28) {
              float rockMix = smoothstep(0.28, 0.55, tSlope);
              vec3 cliffColor = vec3(0.22, 0.24, 0.27) + vec3(strata);
              diffuseColor.rgb = mix(diffuseColor.rgb, cliffColor, rockMix * 0.88);
            } else {
              diffuseColor.rgb *= mix(0.86, 1.10, macroPatch);
            }
          `);
      };

      const tLeftMesh = new THREE.Mesh(buildSideTerrain(leftOffsets), terrainMat);
      tLeftMesh.receiveShadow = true;
      this.trackGroup.add(tLeftMesh);

      const tRightMesh = new THREE.Mesh(buildSideTerrain(rightOffsets), terrainMat);
      tRightMesh.receiveShadow = true;
      this.trackGroup.add(tRightMesh);

      // ----------------------------------------------------------------------
      // 2. MAIN TRACK TRAIL & BRIDGE DECKS (Separated cleanly, crisp UV maps!)
      // ----------------------------------------------------------------------
      const trackWOffsets = [-6.9, -4.5, -2.25, 0, 2.25, 4.5, 6.9];
      const wCols = trackWOffsets.length;

      const roadPos = [], roadUvs = [], roadIdx = [];
      const bridgePos = [], bridgeUvs = [], bridgeIdx = [];

      const pushStripRow = (arrPos, arrUv, z, offsets) => {
        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const dx = this.getCurveX(z + 0.5) - this.getCurveX(z - 0.5);
        const len = Math.sqrt(dx * dx + 1);
        const nx = 1 / len;
        const nz = -dx / len;

        for (let j = 0; j < offsets.length; j++) {
          const w = offsets[j];
          arrPos.push(cx + nx * w, cy, z + nz * w);
          arrUv.push((w + 6.9) / 13.8, z / 16.0);
        }
      };

      for (let i = 0; i <= segCount; i++) {
        const z = i * segStep;
        pushStripRow(roadPos, roadUvs, z, trackWOffsets);
        pushStripRow(bridgePos, bridgeUvs, z, [-7.1, -4.5, -2.25, 0, 2.25, 4.5, 7.1]);
      }

      for (let i = 0; i < segCount; i++) {
        const midZ = (i + 0.5) * segStep;
        const r1 = i * wCols;
        const r2 = (i + 1) * wCols;
        const targetIdx = this.isBridge(midZ) ? bridgeIdx : roadIdx;
        for (let j = 0; j < wCols - 1; j++) {
          targetIdx.push(r1 + j, r2 + j, r1 + j + 1);
          targetIdx.push(r2 + j, r2 + j + 1, r1 + j + 1);
        }
      }

      const roadGeo = new THREE.BufferGeometry();
      roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadPos, 3));
      roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
      roadGeo.setIndex(roadIdx);
      roadGeo.computeVertexNormals();

      const roadTex = this.textures.getTrackTextures(level);
      const roadMat = new THREE.MeshStandardMaterial({
        map: roadTex.map,
        bumpMap: roadTex.bumpMap,
        bumpScale: 0.16,
        roughness: 0.88,
        metalness: 0.04
      });
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.receiveShadow = true;
      this.trackGroup.add(roadMesh);

      const bridgeGeo = new THREE.BufferGeometry();
      bridgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(bridgePos, 3));
      bridgeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(bridgeUvs, 2));
      bridgeGeo.setIndex(bridgeIdx);
      bridgeGeo.computeVertexNormals();

      const bridgeTex = this.textures.getBridgeTextures(level);
      const bridgeMat = new THREE.MeshStandardMaterial({
        map: bridgeTex.map,
        bumpMap: bridgeTex.bumpMap,
        bumpScale: 0.18,
        roughness: 0.78,
        metalness: 0.08
      });
      const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridgeMesh.receiveShadow = true;
      this.trackGroup.add(bridgeMesh);

      // ----------------------------------------------------------------------
      // 3. CRISP 3D TIMBER & STONE TRACK BORDERS (InstancedMesh = Zero Color Bleed!)
      // ----------------------------------------------------------------------
      const biome = this.getBiomeConfig(level);
      const curbLen = 2.6;
      const curbBoxGeo = new THREE.BoxGeometry(0.62, 0.34, curbLen);
      const curbMat = new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0.08 });
      const totalCurbPairs = Math.floor((this.finishLineZ + 60) / 2.8);
      const curbMesh = new THREE.InstancedMesh(curbBoxGeo, curbMat, totalCurbPairs * 2);
      curbMesh.castShadow = true;
      curbMesh.receiveShadow = true;
      curbMesh.frustumCulled = false;

      const dummy = new THREE.Object3D();
      const colA = new THREE.Color(biome.curbA);
      const colB = new THREE.Color(biome.curbB);
      let cIdx = 0;

      for (let i = 0; i < totalCurbPairs; i++) {
        const z = 8 + i * 2.8;
        if (this.isBridge(z)) continue; // Bridges have custom wood guardrails & ropes!

        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const dzCurve = this.getCurveX(z + 0.5) - this.getCurveX(z - 0.5);
        const pitchY = this.getHillY(z + 0.8) - this.getHillY(z - 0.8);
        const yaw = Math.atan2(dzCurve, 1.0);
        const pitch = Math.atan2(pitchY, 1.6);

        const len = Math.sqrt(dzCurve * dzCurve + 1);
        const nx = 1 / len;
        const nz = -dzCurve / len;

        const blockColor = (i % 2 === 0) ? colA : colB;
        for (const side of [-1, 1]) {
          const w = side * 7.05;
          dummy.position.set(cx + nx * w, cy + 0.14, z + nz * w);
          dummy.rotation.set(-pitch, yaw, 0, 'YXZ');
          dummy.updateMatrix();
          curbMesh.setMatrixAt(cIdx, dummy.matrix);
          curbMesh.setColorAt(cIdx, blockColor);
          cIdx++;
        }
      }
      curbMesh.count = cIdx;
      curbMesh.instanceMatrix.needsUpdate = true;
      if (curbMesh.instanceColor) curbMesh.instanceColor.needsUpdate = true;
      this.trackGroup.add(curbMesh);

      // ----------------------------------------------------------------------
      // 4. CHECKERED GROUND LINES (At Start z=16 & Finish z=finishLineZ)
      // ----------------------------------------------------------------------
      const makeCheckeredLine = (lineZ) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        const sz = 32;
        for (let x = 0; x < 512; x += sz) {
          for (let y = 0; y < 64; y += sz) {
            ctx.fillStyle = ((x / sz + y / sz) % 2 === 0) ? '#ffffff' : '#111827';
            ctx.fillRect(x, y, sz, sz);
          }
        }
        const tex = new THREE.CanvasTexture(canvas);
        const geo = new THREE.PlaneGeometry(13.6, 1.8);
        geo.rotateX(-Math.PI / 2);
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.5 });
        const strip = new THREE.Mesh(geo, mat);
        const cx = this.getCurveX(lineZ);
        const cy = this.getHillY(lineZ);
        const dy = this.getHillY(lineZ + 0.5) - this.getHillY(lineZ - 0.5);
        strip.position.set(cx, cy + 0.035, lineZ);
        strip.rotation.x = -Math.atan2(dy, 1.0);
        strip.receiveShadow = true;
        this.trackGroup.add(strip);
      };
      makeCheckeredLine(16);
      makeCheckeredLine(this.finishLineZ);

      this.scene.add(this.trackGroup);
    }

    // ------------------------------------------------------------------------
    // SHIMMERING ZELDA WATER SHADER (Canyon Rivers under Bridges & Valley Lake)
    // Ported from Zelda-Copy1/src/game/WaterShader.ts
    // ------------------------------------------------------------------------
    buildWater() {
      if (this.waterGroup) this.scene.remove(this.waterGroup);
      this.waterGroup = new THREE.Group();
      this.waterMaterials = [];

      const biome = this.getBiomeConfig(this.currentLevel);

      const createWaterMaterial = () => {
        const mat = new THREE.ShaderMaterial({
          transparent: true,
          depthWrite: false,
          uniforms: {
            uTime: { value: 0 },
            uDeepColor: { value: new THREE.Color(biome.waterDeep) },
            uShallowColor: { value: new THREE.Color(biome.waterShallow) },
            uFoamColor: { value: new THREE.Color('#ffffff') },
            uSunDirection: { value: new THREE.Vector3(0.45, 0.78, 0.35).normalize() },
            uFogColor: { value: new THREE.Color(biome.fogColor) },
            uFogDensity: { value: biome.fogDensity }
          },
          vertexShader: `
            uniform float uTime;
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying float vWaveHeight;

            void main() {
              vec3 pos = position;
              vec4 wpBase = modelMatrix * vec4(pos, 1.0);

              float w1 = sin(wpBase.x * 0.14 + uTime * 1.8) * cos(wpBase.z * 0.14 + uTime * 1.4) * 0.24;
              float w2 = sin(wpBase.x * 0.36 - uTime * 2.4) * sin(wpBase.z * 0.30 + uTime * 2.1) * 0.09;
              float w3 = cos(wpBase.x * 0.8 + uTime * 3.4) * sin(wpBase.z * 0.7 - uTime * 2.9) * 0.03;
              float totalWave = w1 + w2 + w3;
              pos.y += totalWave;
              vWaveHeight = totalWave;

              float dx = (cos(wpBase.x * 0.14 + uTime * 1.8) * 0.14 * 0.24) + (cos(wpBase.x * 0.36 - uTime * 2.4) * 0.36 * 0.09);
              float dz = (-sin(wpBase.z * 0.14 + uTime * 1.4) * 0.14 * 0.24) + (cos(wpBase.z * 0.30 + uTime * 2.1) * 0.30 * 0.09);
              vNormal = normalize(vec3(-dx, 1.0, -dz));

              vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
              vWorldPosition = worldPosition.xyz;
              gl_Position = projectionMatrix * viewMatrix * worldPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 uDeepColor;
            uniform vec3 uShallowColor;
            uniform vec3 uFoamColor;
            uniform vec3 uSunDirection;
            uniform vec3 uFogColor;
            uniform float uFogDensity;
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying float vWaveHeight;

            void main() {
              vec3 viewDir = normalize(cameraPosition - vWorldPosition);
              vec3 normal = normalize(vNormal);

              float fresnel = pow(1.0 - max(0.0, dot(viewDir, normal)), 3.2);
              vec3 color = mix(uShallowColor, uDeepColor, 0.52 + fresnel * 0.45);

              // Sun Specular Shimmer on wave crests
              vec3 halfDir = normalize(uSunDirection + viewDir);
              float spec = pow(max(0.0, dot(normal, halfDir)), 56.0);
              color += vec3(1.0, 0.96, 0.85) * spec * 0.85;

              // Animated Foam crests
              float foamMask = smoothstep(0.14, 0.29, vWaveHeight);
              color = mix(color, uFoamColor, foamMask * 0.65);

              // Exponential Distance Fog blend
              float fogDist = length(cameraPosition - vWorldPosition);
              float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * fogDist * fogDist);
              color = mix(color, uFogColor, clamp(fogFactor, 0.0, 1.0));

              gl_FragColor = vec4(color, 0.86 + fresnel * 0.12);
            }
          `
        });
        this.waterMaterials.push(mat);
        return mat;
      };

      const segs = this.isMobile ? 28 : 42;
      const waterMat = createWaterMaterial();
      const trackSpec = this.getTrackSpec();

      // 1. Canyon Gorge Rivers under all Suspension Bridges in this level
      for (const [s, e] of trackSpec.bridges) {
        const midZ = (s + e) * 0.5;
        const spanLen = (e - s) + 55;
        const cx = this.getCurveX(midZ);
        const bridgeBaseY = Math.min(this.getHillY(s), this.getHillY(e));
        const waterY = bridgeBaseY - 14.0;
        const wGeo = new THREE.PlaneGeometry(145, spanLen, segs, segs);
        wGeo.rotateX(-Math.PI / 2);
        const river = new THREE.Mesh(wGeo, waterMat);
        river.position.set(cx, waterY, midZ);
        this.waterGroup.add(river);
      }

      // 2. Scenic Valley Lakes from level track spec
      for (const lake of trackSpec.lakes) {
        const lakeCx = this.getCurveX(lake.z) + lake.side * lake.offsetX;
        const lakeTrackH = this.getHillY(lake.z);
        const lakeGeo = new THREE.PlaneGeometry(lake.w, lake.l, segs, segs);
        lakeGeo.rotateX(-Math.PI / 2);
        const lakeMesh = new THREE.Mesh(lakeGeo, waterMat);
        lakeMesh.position.set(lakeCx, lakeTrackH - lake.waterDrop, lake.z);
        this.waterGroup.add(lakeMesh);
      }

      this.scene.add(this.waterGroup);
    }

    buildBridgeDetails() {
      if (this.bridgeGroup) this.scene.remove(this.bridgeGroup);
      this.bridgeGroup = new THREE.Group();
      const intervals = this.getTrackSpec().bridges;

      const postGeo = new THREE.CylinderGeometry(0.22, 0.26, 2.5, 8);
      const postMat = new THREE.MeshStandardMaterial({ color: 0x5c3618, roughness: 0.85, map: this.textures.getBarkTexture() });
      const pierGeo = new THREE.BoxGeometry(1.1, 38, 1.1);
      const pierMat = new THREE.MeshStandardMaterial({ color: 0x3b210e, roughness: 0.9 });
      const beamGeo = new THREE.BoxGeometry(15.2, 0.7, 0.9);
      const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd9a45b, roughness: 0.78 });
      const stoneTowerMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
      const amberGlowMat = new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        emissive: 0xff9800,
        emissiveIntensity: 2.6,
        roughness: 0.15
      });
      const ironMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.35 });

      const postPositions = [];
      const pierPositions = [];
      const beamPositions = [];
      const ropeGeosL = [];
      const ropeGeosR = [];

      for (const [startZ, endZ] of intervals) {
        // Monumental Weathered Stone Entry & Exit Gate Pillars with Open-Cage Glowing Amber Lanterns!
        for (const edgeZ of [startZ, endZ]) {
          const cx = this.getCurveX(edgeZ);
          const cy = this.getHillY(edgeZ);
          for (const side of [-1, 1]) {
            const tx = cx + side * 7.6;
            const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 5.4, 8), stoneTowerMat);
            tower.position.set(tx, cy + 2.4, edgeZ);
            tower.castShadow = true;
            tower.receiveShadow = true;
            this.bridgeGroup.add(tower);

            const cap = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.45, 1.45), stoneTowerMat);
            cap.position.set(tx, cy + 5.2, edgeZ);
            cap.castShadow = true;
            this.bridgeGroup.add(cap);

            // Open 4-strut iron lantern housing + pointed pyramid cap so the warm amber flame shines through!
            const lanternTop = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.35, 4), ironMat);
            lanternTop.rotation.y = Math.PI / 4;
            lanternTop.position.set(tx, cy + 6.18, edgeZ);
            this.bridgeGroup.add(lanternTop);

            for (let corner = 0; corner < 4; corner++) {
              const ca = (corner / 4) * Math.PI * 2 + Math.PI / 4;
              const strut = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.58, 0.06), ironMat);
              strut.position.set(tx + Math.cos(ca) * 0.24, cy + 5.72, edgeZ + Math.sin(ca) * 0.24);
              this.bridgeGroup.add(strut);
            }

            const lanternCore = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), amberGlowMat);
            lanternCore.position.set(tx, cy + 5.72, edgeZ);
            this.bridgeGroup.add(lanternCore);
          }
        }

        const upperL = [], upperR = [], lowerL = [], lowerR = [];
        for (let z = startZ; z <= endZ; z += 5.0) {
          const cx = this.getCurveX(z);
          const cy = this.getHillY(z);
          postPositions.push([cx - 7.35, cy + 1.2, z]);
          postPositions.push([cx + 7.35, cy + 1.2, z]);

          upperL.push(new THREE.Vector3(cx - 7.35, cy + 2.15, z));
          upperR.push(new THREE.Vector3(cx + 7.35, cy + 2.15, z));
          lowerL.push(new THREE.Vector3(cx - 7.35, cy + 1.32, z));
          lowerR.push(new THREE.Vector3(cx + 7.35, cy + 1.32, z));

          if ((z - startZ) % 15 === 0) {
            pierPositions.push([cx - 7.35, cy - 19.0, z]);
            pierPositions.push([cx + 7.35, cy - 19.0, z]);
            beamPositions.push([cx, cy - 0.5, z]);
          }
        }

        // Single smooth continuous spline rope per bridge side & rail level (only 4 draw calls per bridge!)
        const addSplineRope = (pts, radius) => {
          const curve = new THREE.CatmullRomCurve3(pts);
          const tube = new THREE.TubeGeometry(curve, pts.length * 3, radius, 5, false);
          const mesh = new THREE.Mesh(tube, ropeMat);
          mesh.castShadow = true;
          this.bridgeGroup.add(mesh);
        };
        addSplineRope(upperL, 0.08);
        addSplineRope(upperR, 0.08);
        addSplineRope(lowerL, 0.055);
        addSplineRope(lowerR, 0.055);
      }

      const dummy = new THREE.Object3D();
      const buildInstBatch = (geo, mat, coords, castShadow = true) => {
        if (coords.length === 0) return;
        const im = new THREE.InstancedMesh(geo, mat, coords.length);
        im.castShadow = castShadow;
        im.receiveShadow = true;
        im.frustumCulled = false;
        coords.forEach(([x, y, z], i) => {
          dummy.position.set(x, y, z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          im.setMatrixAt(i, dummy.matrix);
        });
        im.instanceMatrix.needsUpdate = true;
        this.bridgeGroup.add(im);
      };
      buildInstBatch(postGeo, postMat, postPositions, true);
      buildInstBatch(pierGeo, pierMat, pierPositions, true);
      buildInstBatch(beamGeo, pierMat, beamPositions, false);

      this.scene.add(this.bridgeGroup);
    }

    // ------------------------------------------------------------------------
    // HYRULE TREES, RUINS, MUSHROOMS & BUSHES (Ported from Zelda-Copy1)
    // ------------------------------------------------------------------------
    buildSceneryTrees() {
      if (this.sceneryGroup) this.scene.remove(this.sceneryGroup);
      this.sceneryGroup = new THREE.Group();

      const biome = this.getBiomeConfig(this.currentLevel);
      const rng = createSeededRng(2026 + this.currentLevel * 101);
      const barkTex = this.textures.getBarkTexture();

      const trunkMat = new THREE.MeshStandardMaterial({
        map: barkTex,
        vertexColors: true,
        roughness: 0.90,
        metalness: 0.03
      });
      const canopyMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.72,
        metalness: 0.02
      });

      // Helper: build Oak / Apple / Sakura / Pine / Birch prototype geometries with velvety BotW smoothing
      const createOakProtos = (withApples = false) => {
        const barkParts = [
          { geo: new THREE.CylinderGeometry(0.40, 0.78, 5.2, 12), pos: [0, 2.5, 0], color: 0x5c3b1e },
          { geo: new THREE.CylinderGeometry(0.75, 0.85, 0.42, 12), pos: [0, 0.2, 0], color: 0x2e5e29 }
        ];
        for (let r = 0; r < 4; r++) {
          const ra = (r / 4) * Math.PI * 2 + 0.35;
          barkParts.push({
            geo: new THREE.ConeGeometry(0.28, 1.5, 7),
            pos: [Math.cos(ra) * 0.62, 0.52, Math.sin(ra) * 0.62],
            rot: [Math.sin(ra) * 0.48, 0, -Math.cos(ra) * 0.48],
            color: 0x543418
          });
        }
        barkParts.push(
          { geo: new THREE.CylinderGeometry(0.18, 0.28, 2.4, 7), pos: [0.52, 4.3, 0.28], rot: [0, 0, -Math.PI / 4.5], color: 0x5c3b1e },
          { geo: new THREE.CylinderGeometry(0.16, 0.26, 2.2, 7), pos: [-0.50, 4.5, -0.28], rot: [0, 0, Math.PI / 4.4], color: 0x5c3b1e },
          { geo: new THREE.CylinderGeometry(0.15, 0.24, 2.0, 7), pos: [0.1, 4.6, -0.48], rot: [Math.PI / 4.8, 0, 0], color: 0x5c3b1e }
        );

        const greens = [0x275922, 0x1e4a1b, 0x33742d, 0x245e1f, 0x3d8635, 0x4ca142];
        const offsets = [
          { x: 0, y: 6.0, z: 0, r: 2.7, c: greens[0], sy: 0.86 },
          { x: 1.4, y: 5.7, z: 0.9, r: 2.1, c: greens[1], sy: 0.84 },
          { x: -1.3, y: 5.8, z: -0.8, r: 2.2, c: greens[2], sy: 0.85 },
          { x: 0.9, y: 6.8, z: -1.0, r: 2.0, c: greens[3], sy: 0.88 },
          { x: -0.95, y: 6.7, z: 1.0, r: 2.0, c: greens[4], sy: 0.86 },
          { x: 0.1, y: 7.5, z: 0.1, r: 1.9, c: greens[5], sy: 0.90 },
          { x: -0.6, y: 5.3, z: 1.45, r: 1.75, c: greens[1], sy: 0.84 }
        ];
        const leafParts = offsets.map((cl, i) => ({
          geo: makeOrganicCanopyGeo(cl.r, i * 1.7),
          pos: [cl.x, cl.y, cl.z],
          scale: [1.0, cl.sy, 1.0],
          color: cl.c
        }));
        if (withApples) {
          const apples = [
            [1.4, 4.9, 1.2], [-1.2, 4.8, 1.1], [0.9, 5.2, -1.4],
            [-1.5, 5.4, -0.6], [1.9, 5.6, -0.2], [0.2, 5.1, 1.8]
          ];
          apples.forEach(([ax, ay, az]) => {
            leafParts.push({
              geo: new THREE.SphereGeometry(0.28, 8, 8),
              pos: [ax, ay, az],
              color: 0xef4444,
              ao: false
            });
          });
        }
        return {
          trunk: mergeColoredGeometries(barkParts, 0.18),
          canopy: mergeColoredGeometries(leafParts, 0.28)
        };
      };

      const createPineProtos = (snowFrosted = false) => {
        const barkParts = [
          { geo: new THREE.CylinderGeometry(0.32, 0.65, 5.8, 10), pos: [0, 2.9, 0], color: 0x3b2412 },
          { geo: new THREE.CylinderGeometry(0.62, 0.72, 0.4, 10), pos: [0, 0.2, 0], color: 0x284e27 }
        ];
        const tiers = snowFrosted
          ? [
              { y: 4.8, r: 3.3, h: 3.8, c: 0x163d28 },
              { y: 6.5, r: 2.7, h: 3.3, c: 0x1e4f34 },
              { y: 8.0, r: 2.1, h: 2.8, c: 0x265e40 },
              { y: 9.2, r: 1.6, h: 2.4, c: 0xdbeeff },
              { y: 10.3, r: 1.05, h: 2.0, c: 0xf8fcff }
            ]
          : [
              { y: 4.8, r: 3.3, h: 3.8, c: 0x133824 },
              { y: 6.5, r: 2.7, h: 3.3, c: 0x1a462e },
              { y: 8.0, r: 2.1, h: 2.8, c: 0x215438 },
              { y: 9.2, r: 1.55, h: 2.4, c: 0x296845 },
              { y: 10.3, r: 1.05, h: 2.0, c: 0x347d54 }
            ];
        const leafParts = tiers.map(t => ({
          geo: new THREE.ConeGeometry(t.r, t.h, 14),
          pos: [0, t.y, 0],
          color: t.c
        }));
        return {
          trunk: mergeColoredGeometries(barkParts, 0.16),
          canopy: mergeColoredGeometries(leafParts, 0.26)
        };
      };

      const createSakuraProtos = () => {
        const barkParts = [
          { geo: new THREE.CylinderGeometry(0.38, 0.70, 5.2, 12), pos: [0, 2.5, 0], rot: [0, 0, 0.06], color: 0x3d2817 },
          { geo: new THREE.CylinderGeometry(0.18, 0.30, 2.6, 8), pos: [-0.55, 4.4, 0], rot: [0, 0, 0.58], color: 0x3d2817 },
          { geo: new THREE.CylinderGeometry(0.18, 0.30, 2.6, 8), pos: [0.55, 4.4, 0], rot: [0, 0, -0.58], color: 0x3d2817 },
          { geo: new THREE.CylinderGeometry(0.16, 0.25, 2.1, 8), pos: [0, 4.5, 0.52], rot: [0.55, 0, 0], color: 0x3d2817 }
        ];
        const pinks = [0xf472b6, 0xfbcfe8, 0xf9a8d4, 0xf43f5e];
        const leafParts = [
          { geo: makeOrganicCanopyGeo(2.3, 1.2), pos: [0, 6.2, 0], scale: [1.35, 0.92, 1.35], color: pinks[0] },
          { geo: makeOrganicCanopyGeo(1.75, 2.4), pos: [1.65, 5.7, 0.95], scale: [1.15, 0.88, 1.15], color: pinks[1] },
          { geo: makeOrganicCanopyGeo(1.75, 3.6), pos: [-1.55, 5.9, -0.85], scale: [1.2, 0.90, 1.2], color: pinks[2] },
          { geo: makeOrganicCanopyGeo(1.5, 4.8), pos: [0.25, 7.1, -0.4], scale: [1.1, 0.88, 1.1], color: pinks[3] }
        ];
        return {
          trunk: mergeColoredGeometries(barkParts, 0.18),
          canopy: mergeColoredGeometries(leafParts, 0.22)
        };
      };

      const createBirchProtos = () => {
        const barkParts = [{ geo: new THREE.CylinderGeometry(0.26, 0.42, 6.6, 12), pos: [0, 3.3, 0], color: 0xf1f5f9 }];
        for (let n = 0; n < 6; n++) {
          barkParts.push({
            geo: new THREE.BoxGeometry(0.14, 0.09, 0.58),
            pos: [0, 1.1 + n * 0.88, 0],
            rot: [0, n * 1.35, 0],
            color: 0x18181b,
            ao: false
          });
        }
        const leafParts = [
          { geo: makeOrganicCanopyGeo(2.1, 5.1), pos: [0, 6.4, 0], scale: [1.0, 1.32, 1.0], color: 0x6ab821 },
          { geo: makeOrganicCanopyGeo(1.6, 6.3), pos: [0.4, 7.7, 0.2], scale: [0.95, 1.15, 0.95], color: 0x8fd632 }
        ];
        return {
          trunk: mergeColoredGeometries(barkParts, 0.1),
          canopy: mergeColoredGeometries(leafParts, 0.22)
        };
      };

      const treeTypes = {
        oak: createOakProtos(false),
        apple: createOakProtos(true),
        pine: createPineProtos(this.currentLevel === 2),
        sakura: createSakuraProtos(),
        birch: createBirchProtos()
      };

      const placements = { oak: [], apple: [], pine: [], sakura: [], birch: [] };

      for (let z = 18; z < this.finishLineZ + 120; z += 11 + rng() * 6) {
        if (this.getCanyonFactor(z) > 0.05) continue;
        const nearCanyonMouth = this.isNearCanyonMouth(z);
        const trackH = this.getHillY(z);
        const cx = this.getCurveX(z);

        for (const side of [-1, 1]) {
          // Keep bridge vista corridor wide open near canyon entrances!
          const minOff = nearCanyonMouth ? 19.5 : 12.2;
          const layers = rng() > 0.35 ? [minOff + rng() * 14.0, 32.0 + rng() * 28.0] : [minOff + 2.0 + rng() * 20.0];
          for (const dist of layers) {
            const x = cx + side * dist;
            const y = this.getGroundY(x, z);
            if (y < trackH - 3.6 && this.isInLakeZone(z, side)) continue;

            let kind = 'oak';
            const pick = rng();
            if (biome.treeMix === 'pine_heavy') {
              kind = pick < 0.72 ? 'pine' : (pick < 0.88 ? 'birch' : 'oak');
            } else if (biome.treeMix === 'sakura_heavy') {
              kind = pick < 0.62 ? 'sakura' : (pick < 0.85 ? 'apple' : 'birch');
            } else {
              if (pick < 0.34) kind = 'oak';
              else if (pick < 0.56) kind = 'pine';
              else if (pick < 0.72) kind = 'apple';
              else if (pick < 0.86) kind = 'birch';
              else kind = 'sakura';
            }
            const s = 0.78 + rng() * 0.55;
            placements[kind].push({ x, y: y - 0.15, z, rotY: rng() * Math.PI * 2, scale: s });
          }
        }
      }

      const dummy = new THREE.Object3D();
      for (const [kind, list] of Object.entries(placements)) {
        if (list.length === 0) continue;
        const proto = treeTypes[kind];
        const tMesh = new THREE.InstancedMesh(proto.trunk, trunkMat, list.length);
        const cMesh = new THREE.InstancedMesh(proto.canopy, canopyMat, list.length);
        tMesh.castShadow = true;
        tMesh.receiveShadow = true;
        cMesh.castShadow = true;
        cMesh.receiveShadow = true;
        tMesh.frustumCulled = false;
        cMesh.frustumCulled = false;

        list.forEach((p, idx) => {
          dummy.position.set(p.x, p.y, p.z);
          dummy.rotation.set(0, p.rotY, 0);
          dummy.scale.set(p.scale, p.scale, p.scale);
          dummy.updateMatrix();
          tMesh.setMatrixAt(idx, dummy.matrix);
          cMesh.setMatrixAt(idx, dummy.matrix);
        });
        tMesh.instanceMatrix.needsUpdate = true;
        cMesh.instanceMatrix.needsUpdate = true;
        this.sceneryGroup.add(tMesh);
        this.sceneryGroup.add(cMesh);
      }

      // ----------------------------------------------------------------------
      // TRACKSIDE PROPS: Ancient Sheikah Ruin Pillars, Lanterns, Mossy Boulders, Shrooms & Berry Bushes!
      // ----------------------------------------------------------------------
      this.wildlifeActors.runes = [];

      // 1. Weathered Moss-Capped Boulders beside the track (flat-shaded granite + smooth moss cap!)
      const rockProto = mergeColoredGeometries([
        { geo: new THREE.IcosahedronGeometry(1.4, 2), pos: [0, 0.55, 0], scale: [1.15, 0.78, 1.1], color: 0x5c6773, flat: true },
        { geo: new THREE.CylinderGeometry(0.95, 1.08, 0.22, 10), pos: [0, 1.32, 0], color: this.currentLevel === 2 ? 0xeef6ff : 0x2e6128 }
      ], 0.16);
      const rockMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85, metalness: 0.05 });
      const rockList = [];
      for (let z = 30; z < this.finishLineZ; z += 18 + rng() * 14) {
        if (this.getCanyonFactor(z) > 0.25) continue;
        const side = rng() > 0.5 ? 1 : -1;
        const dist = 8.4 + rng() * 14.0;
        const x = this.getCurveX(z) + side * dist;
        const y = this.getGroundY(x, z);
        if (y < this.getHillY(z) - 3.6 && this.isInLakeZone(z, side)) continue;
        rockList.push({ x, y, z, s: 0.65 + rng() * 1.15, ry: rng() * Math.PI * 2 });
      }
      if (rockList.length > 0) {
        const rockInst = new THREE.InstancedMesh(rockProto, rockMat, rockList.length);
        rockInst.castShadow = true;
        rockInst.receiveShadow = true;
        rockInst.frustumCulled = false;
        rockList.forEach((p, idx) => {
          dummy.position.set(p.x, p.y - 0.1, p.z);
          dummy.rotation.set(0, p.ry, 0);
          dummy.scale.set(p.s, p.s * 0.85, p.s);
          dummy.updateMatrix();
          rockInst.setMatrixAt(idx, dummy.matrix);
        });
        rockInst.instanceMatrix.needsUpdate = true;
        this.sceneryGroup.add(rockInst);
      }

      // 2. Wild Berry Bushes & Forest Mushroom Clusters along shoulders
      const bushProto = mergeColoredGeometries([
        { geo: makeOrganicCanopyGeo(0.92, 3.2), pos: [0, 0.58, 0], scale: [1.2, 0.82, 1.2], color: 0x1b5e28 },
        { geo: new THREE.SphereGeometry(0.12, 6, 6), pos: [0.45, 0.72, 0.42], color: 0xef4444, ao: false },
        { geo: new THREE.SphereGeometry(0.11, 6, 6), pos: [-0.42, 0.82, 0.35], color: 0xef4444, ao: false },
        { geo: new THREE.SphereGeometry(0.12, 6, 6), pos: [0.15, 0.92, -0.45], color: 0xf43f5e, ao: false },
        { geo: new THREE.SphereGeometry(0.11, 6, 6), pos: [-0.25, 0.65, -0.4], color: 0xef4444, ao: false }
      ], 0.2);
      const bushMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8 });
      const bushList = [];
      for (let z = 22; z < this.finishLineZ; z += 14) {
        if (this.getCanyonFactor(z) > 0.25) continue;
        const side = (Math.floor(z) % 2 === 0) ? 1 : -1;
        const dist = 8.0 + rng() * 6.0;
        const x = this.getCurveX(z) + side * dist;
        const y = this.getGroundY(x, z);
        if (y < this.getHillY(z) - 3.6 && this.isInLakeZone(z, side)) continue;
        bushList.push({ x, y, z, s: 0.7 + rng() * 0.55, ry: rng() * Math.PI * 2 });
      }
      if (bushList.length > 0) {
        const bushInst = new THREE.InstancedMesh(bushProto, bushMat, bushList.length);
        bushInst.castShadow = true;
        bushInst.frustumCulled = false;
        bushList.forEach((p, idx) => {
          dummy.position.set(p.x, p.y - 0.05, p.z);
          dummy.rotation.set(0, p.ry, 0);
          dummy.scale.set(p.s, p.s, p.s);
          dummy.updateMatrix();
          bushInst.setMatrixAt(idx, dummy.matrix);
        });
        bushInst.instanceMatrix.needsUpdate = true;
        this.sceneryGroup.add(bushInst);
      }

      // 3. Ancient Sheikah Ruin Pillars with Glowing Cyan Rune Rings (from Zelda-Copy1/Foliage.ts)
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x64707a, roughness: 0.85 });
      const runeMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x00e5ff,
        emissiveIntensity: 1.6,
        roughness: 0.2
      });
      const pillarGeo = new THREE.CylinderGeometry(0.65, 0.85, 6.5, 8);
      const ringGeo = new THREE.TorusGeometry(0.82, 0.09, 6, 16);

      const ruinZones = [110, 215, 420, 560, 715, 920, 1080];
      for (const rz of ruinZones) {
        if (rz >= this.finishLineZ - 40 || this.getCanyonFactor(rz) > 0.1) continue;
        const cx = this.getCurveX(rz);
        for (const side of [-1, 1]) {
          if (rng() > 0.65 || this.isInLakeZone(rz, side)) continue;
          const rx = cx + side * (9.5 + rng() * 4.5);
          const ry = this.getGroundY(rx, rz);
          const p = new THREE.Mesh(pillarGeo, pillarMat);
          p.position.set(rx, ry + 3.0, rz);
          p.rotation.z = (rng() - 0.5) * 0.16;
          p.castShadow = true;
          p.receiveShadow = true;

          const runeRing = new THREE.Mesh(ringGeo, runeMat);
          runeRing.position.y = 1.2;
          runeRing.rotation.x = Math.PI / 2;
          p.add(runeRing);
          this.wildlifeActors.runes.push(runeRing);
          this.sceneryGroup.add(p);
        }
      }

      this.scene.add(this.sceneryGroup);
    }

    // ------------------------------------------------------------------------
    // BOTW WIND-SWAYING GRASS CARPET, WILDFLOWERS & AMBIENT PARTICLES
    // Ported directly from Zelda-Copy1/src/game/Foliage.ts (frustum-chunked!)
    // ------------------------------------------------------------------------
    buildFoliage() {
      if (this.foliageGroup) this.scene.remove(this.foliageGroup);
      this.foliageGroup = new THREE.Group();
      this.grassMaterials = [];
      this.flowerMaterials = [];

      const biome = this.getBiomeConfig(this.currentLevel);
      const rng = createSeededRng(909 + this.currentLevel * 37);

      // 1. Multi-Blade Fibonacci Grass Clump Geometry (from Zelda-Copy1/Foliage.ts)
      const bladesCount = this.isMobile ? 8 : 11;
      const vertsPerBlade = 5;
      const posList = [], uvList = [], indexList = [];
      const baseW = this.isMobile ? 0.16 : 0.13;
      const midW = this.isMobile ? 0.10 : 0.08;
      const baseH = 0.72;

      for (let b = 0; b < bladesCount; b++) {
        const phi = b * 2.39996;
        const dist = Math.sqrt((b + 0.5) / bladesCount) * 0.62;
        const ox = Math.cos(phi) * dist;
        const oz = Math.sin(phi) * dist;
        const ang = (b / bladesCount) * Math.PI * 2 + b * 1.7;
        const cosA = Math.cos(ang), sinA = Math.sin(ang);
        const h = baseH * (0.8 + ((b * 19) % 11) * 0.05);
        const bv = b * vertsPerBlade;

        const dirX = dist > 0.001 ? ox / dist : cosA;
        const dirZ = dist > 0.001 ? oz / dist : sinA;
        const bend = 0.07 + dist * 0.09;
        const bx = dirX * bend, bz = dirZ * bend;

        posList.push(
          ox - baseW * cosA, 0.0, oz - baseW * sinA,
          ox + baseW * cosA, 0.0, oz + baseW * sinA,
          ox + bx - midW * cosA, h * 0.5, oz + bz - midW * sinA,
          ox + bx + midW * cosA, h * 0.5, oz + bz + midW * sinA,
          ox + bx * 2.6, h, oz + bz * 2.6
        );
        uvList.push(0, 0, 1, 0, 0, 0.5, 1, 0.5, 0.5, 1);
        indexList.push(bv, bv + 1, bv + 2, bv + 1, bv + 3, bv + 2, bv + 2, bv + 3, bv + 4);
      }

      const bladeGeo = new THREE.BufferGeometry();
      bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(posList, 3));
      bladeGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvList, 2));
      bladeGeo.setIndex(indexList);

      const grassMat = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uBaseColor: { value: new THREE.Color(biome.grassBase) },
          uMidColor: { value: new THREE.Color(biome.grassMid) },
          uTipColor: { value: new THREE.Color(biome.grassTip) },
          uSunDir: { value: new THREE.Vector3(0.45, 0.8, 0.3).normalize() },
          uFogColor: { value: new THREE.Color(biome.fogColor) },
          uFogDensity: { value: biome.fogDensity }
        },
        vertexShader: `
          uniform float uTime;
          varying float vHeightNorm;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;

          void main() {
            vec3 pos = position;
            vec4 worldOrigin = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            float heightFactor = pos.y * pos.y * 1.45;

            float wave1 = sin(uTime * 2.4 + worldOrigin.x * 0.06 + worldOrigin.z * 0.045) * 0.24;
            float wave2 = cos(uTime * 3.2 - worldOrigin.x * 0.075 + worldOrigin.z * 0.06) * 0.12;
            float flutter = sin(uTime * 7.8 + worldOrigin.x * 0.8 + worldOrigin.z * 0.8) * 0.045;

            pos.x += (wave1 + flutter) * heightFactor;
            pos.z += (wave2 + flutter * 0.8) * heightFactor;

            vHeightNorm = clamp(pos.y / 0.72, 0.0, 1.0);

            vec4 instancePosition = modelMatrix * instanceMatrix * vec4(pos, 1.0);
            vWorldPosition = instancePosition.xyz;
            vWorldNormal = normalize(mat3(instanceMatrix) * vec3(0.0, 1.0, 0.0));
            gl_Position = projectionMatrix * viewMatrix * instancePosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uBaseColor;
          uniform vec3 uMidColor;
          uniform vec3 uTipColor;
          uniform vec3 uSunDir;
          uniform vec3 uFogColor;
          uniform float uFogDensity;
          varying float vHeightNorm;
          varying vec3 vWorldNormal;
          varying vec3 vWorldPosition;

          void main() {
            vec3 color = vHeightNorm < 0.45
              ? mix(uBaseColor, uMidColor, vHeightNorm / 0.45)
              : mix(uMidColor, uTipColor, (vHeightNorm - 0.45) / 0.55);

            // Subsurface scattering backlighting & sky sheen (BotW)
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            float backLight = max(0.0, dot(-viewDir, uSunDir));
            float sss = pow(backLight, 4.0) * vHeightNorm * 0.24;
            color += vec3(0.65, 0.88, 0.35) * sss;

            float fogDist = length(cameraPosition - vWorldPosition);
            float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * fogDist * fogDist);
            color = mix(color, uFogColor, clamp(fogFactor, 0.0, 1.0));

            gl_FragColor = vec4(color, 1.0);
          }
        `
      });
      this.grassMaterials.push(grassMat);

      // 2. Wildflower Cross-Plane ShaderMaterial with 5-Petal Alpha Cutout!
      const flowerGeo = new THREE.BufferGeometry();
      const fw = 0.52, fh = 0.72;
      flowerGeo.setAttribute('position', new THREE.Float32BufferAttribute([
        -fw * 0.5, 0, 0, fw * 0.5, 0, 0, -fw * 0.5, fh, 0, fw * 0.5, fh, 0,
        0, 0, -fw * 0.5, 0, 0, fw * 0.5, 0, fh, -fw * 0.5, 0, fh, fw * 0.5
      ], 3));
      flowerGeo.setAttribute('uv', new THREE.Float32BufferAttribute([
        0, 0, 1, 0, 0, 1, 1, 1,
        0, 0, 1, 0, 0, 1, 1, 1
      ], 2));
      flowerGeo.setIndex([0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6]);

      const flowerMat = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uFogColor: { value: new THREE.Color(biome.fogColor) },
          uFogDensity: { value: biome.fogDensity }
        },
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vWorldPosition;
          void main() {
            vUv = uv;
            vec3 pos = position;
            vec4 worldOrigin = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            float hf = pos.y * pos.y * 1.9;
            float wind = sin(uTime * 2.3 + worldOrigin.x * 0.06 + worldOrigin.z * 0.05) * 0.22;
            pos.x += wind * hf;
            pos.z += wind * 0.7 * hf;
            vec4 ip = modelMatrix * instanceMatrix * vec4(pos, 1.0);
            vWorldPosition = ip.xyz;
            gl_Position = projectionMatrix * viewMatrix * ip;
          }
        `,
        fragmentShader: `
          uniform vec3 uFogColor;
          uniform float uFogDensity;
          varying vec2 vUv;
          varying vec3 vWorldPosition;
          void main() {
            vec3 col;
            if (vUv.y < 0.42) {
              // Slender tapered green flower stem
              if (abs(vUv.x - 0.5) > 0.075 * (1.2 - vUv.y * 0.6)) discard;
              col = vec3(0.15, 0.48, 0.18);
            } else {
              // 5-Petal Floral Silhouette in Polar Coords
              vec2 p = vec2(vUv.x - 0.5, (vUv.y - 0.68) * 1.15);
              float r = length(p);
              float ang = atan(p.y, p.x);
              float petalBoundary = 0.22 + 0.14 * cos(ang * 5.0);
              if (r > petalBoundary) discard;

              float hash = fract(sin(dot(floor(vWorldPosition.xz * 2.0), vec2(12.9898, 78.233))) * 43758.5453);
              vec3 petalCol = hash < 0.30 ? vec3(0.96, 0.20, 0.22)
                : hash < 0.60 ? vec3(0.22, 0.70, 0.98)
                : hash < 0.82 ? vec3(0.98, 0.82, 0.16)
                : vec3(0.98, 0.98, 0.98);

              col = r < 0.09 ? vec3(1.0, 0.86, 0.15) : petalCol;
            }

            float fogDist = length(cameraPosition - vWorldPosition);
            float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * fogDist * fogDist);
            col = mix(col, uFogColor, clamp(fogFactor, 0.0, 1.0));
            gl_FragColor = vec4(col, 1.0);
          }
        `
      });
      this.flowerMaterials.push(flowerMat);

      // Partition track into 10 spatial Z-chunks (~130m each) with accurate bounding spheres
      const totalLen = this.finishLineZ + 120;
      const numChunks = 10;
      const chunkLen = totalLen / numChunks;
      const grassPerChunk = this.isMobile ? 1050 : 2100;
      const flowersPerChunk = this.isMobile ? 220 : 420;
      const dummy = new THREE.Object3D();

      for (let ch = 0; ch < numChunks; ch++) {
        const zStart = ch * chunkLen;
        const zEnd = zStart + chunkLen;
        const midZ = (zStart + zEnd) * 0.5;
        const midX = this.getCurveX(midZ);
        const midY = this.getHillY(midZ);

        // Grass Chunk InstancedMesh
        const chunkBladeGeo = bladeGeo.clone();
        chunkBladeGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(midX, midY, midZ), 135);
        const gMesh = new THREE.InstancedMesh(chunkBladeGeo, grassMat, grassPerChunk);
        gMesh.frustumCulled = true;

        let gPlaced = 0;
        for (let i = 0; i < grassPerChunk * 2 && gPlaced < grassPerChunk; i++) {
          const z = zStart + rng() * chunkLen;
          if (this.getCanyonFactor(z) > 0.25) continue;
          const side = rng() > 0.5 ? 1 : -1;
          // 55% lush thick curb-side borders (7.4..14m), 45% sweeping hillside carpet (14..42m)
          const latDist = rng() < 0.55 ? (7.45 + rng() * 6.5) : (14.0 + rng() * 28.0);
          const x = this.getCurveX(z) + side * latDist;
          const y = this.getGroundY(x, z);
          if (y < this.getHillY(z) - 3.6 && this.isInLakeZone(z, side)) continue;

          dummy.position.set(x, y - 0.04, z);
          dummy.rotation.set(0, rng() * Math.PI * 2, 0);
          const s = 0.85 + rng() * 0.55;
          dummy.scale.set(s, s * (0.9 + rng() * 0.45), s);
          dummy.updateMatrix();
          gMesh.setMatrixAt(gPlaced++, dummy.matrix);
        }
        gMesh.count = gPlaced;
        gMesh.instanceMatrix.needsUpdate = true;
        this.foliageGroup.add(gMesh);

        // Wildflower Chunk InstancedMesh
        const chunkFlGeo = flowerGeo.clone();
        chunkFlGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(midX, midY, midZ), 135);
        const fMesh = new THREE.InstancedMesh(chunkFlGeo, flowerMat, flowersPerChunk);
        fMesh.frustumCulled = true;

        let fPlaced = 0;
        for (let i = 0; i < flowersPerChunk * 2 && fPlaced < flowersPerChunk; i++) {
          const z = zStart + rng() * chunkLen;
          if (this.getCanyonFactor(z) > 0.25) continue;
          const side = rng() > 0.5 ? 1 : -1;
          const latDist = 7.55 + rng() * 14.0;
          const x = this.getCurveX(z) + side * latDist;
          const y = this.getGroundY(x, z);
          if (y < this.getHillY(z) - 3.6 && this.isInLakeZone(z, side)) continue;

          dummy.position.set(x, y - 0.02, z);
          dummy.rotation.set(0, rng() * Math.PI * 2, 0);
          const s = 0.85 + rng() * 0.55;
          dummy.scale.set(s, s, s);
          dummy.updateMatrix();
          fMesh.setMatrixAt(fPlaced++, dummy.matrix);
        }
        fMesh.count = fPlaced;
        fMesh.instanceMatrix.needsUpdate = true;
        this.foliageGroup.add(fMesh);
      }

      // 3. Ambient Floating Particles (Golden Pollen/Fireflies, Alpine Snowfall, or Sakura Petals)
      const pCount = this.isMobile ? 160 : 320;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      const pCol = new Float32Array(pCount * 3);
      const cTmp = new THREE.Color();

      for (let i = 0; i < pCount; i++) {
        pPos[i * 3] = (rng() - 0.5) * 70;
        pPos[i * 3 + 1] = 2 + rng() * 18;
        pPos[i * 3 + 2] = rng() * 160;
        if (this.currentLevel === 2) {
          cTmp.setHex(rng() > 0.4 ? 0xffffff : 0xd8f0ff);
        } else if (this.currentLevel === 3) {
          cTmp.setHex(rng() > 0.4 ? 0xfbcfe8 : 0xf472b6);
        } else if (this.currentLevel === 5) {
          cTmp.setHex(rng() > 0.4 ? 0xff7b29 : 0xfacc15); // volcano embers
        } else if (this.currentLevel === 8) {
          cTmp.setHex(rng() > 0.45 ? 0x38bdf8 : 0xc084fc); // aurora starlight
        } else {
          cTmp.setHSL(0.14 + rng() * 0.08, 0.95, 0.72); // golden firefly/sunmote
        }
        pCol[i * 3] = cTmp.r; pCol[i * 3 + 1] = cTmp.g; pCol[i * 3 + 2] = cTmp.b;
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

      const pTex = this.currentLevel === 2 ? this.textures.getSnowflakeTexture() : this.textures.getGlowParticleTexture();
      const pMat = new THREE.PointsMaterial({
        size: this.currentLevel === 2 ? 0.52 : 0.48,
        map: pTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: this.currentLevel === 3 ? THREE.NormalBlending : THREE.AdditiveBlending
      });
      this.ambientParticles = new THREE.Points(pGeo, pMat);
      this.ambientParticles.frustumCulled = false;
      this.foliageGroup.add(this.ambientParticles);

      this.scene.add(this.foliageGroup);
    }

    // ------------------------------------------------------------------------
    // LIVING WILDLIFE (Stags, Flapping Birds, Hopping Glowing Blupees from Zelda-Copy1)
    // ------------------------------------------------------------------------
    buildWildlife() {
      if (this.wildlifeGroup) this.scene.remove(this.wildlifeGroup);
      this.wildlifeGroup = new THREE.Group();
      this.wildlifeActors.birds = [];
      this.wildlifeActors.stags = [];
      this.wildlifeActors.blupees = [];

      const rng = createSeededRng(3131 + this.currentLevel);

      // 1. Flocks of Forest Birds soaring over hills & bridge gorges
      const birdMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75 });
      const wingMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });
      for (let i = 0; i < 18; i++) {
        const z = 45 + i * 62;
        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const bx = cx + (rng() - 0.5) * 38;
        const by = cy + 12 + rng() * 14;

        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 6), birdMat);
        body.rotation.x = Math.PI / 2;
        g.add(body);

        const wingGeo = new THREE.BoxGeometry(0.65, 0.04, 0.28);
        const wL = new THREE.Mesh(wingGeo, wingMat);
        wL.position.set(0.32, 0.04, 0);
        const wR = new THREE.Mesh(wingGeo, wingMat);
        wR.position.set(-0.32, 0.04, 0);
        g.add(wL); g.add(wR);

        g.position.set(bx, by, z);
        this.wildlifeGroup.add(g);
        this.wildlifeActors.birds.push({
          mesh: g, wL, wR,
          centerX: cx, baseY: by, baseZ: z,
          radius: 14 + rng() * 16, speed: 0.5 + rng() * 0.5, phase: rng() * Math.PI * 2
        });
      }

      // 2. Grazing Forest Stags with Antlers in roadside clearings
      const stagCoat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.72 });
      const antlerMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 });
      for (let z = 65; z < this.finishLineZ - 60; z += 130) {
        if (this.getCanyonFactor(z) > 0.2) continue;
        const side = rng() > 0.5 ? 1 : -1;
        const sx = this.getCurveX(z) + side * (10.5 + rng() * 6.0);
        const sy = this.getGroundY(sx, z);
        const sg = new THREE.Group();

        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.75, 1.55), stagCoat);
        torso.position.y = 1.25; torso.castShadow = true; sg.add(torso);
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.25, 0.85, 6), stagCoat);
        neck.position.set(0, 1.68, 0.65); neck.rotation.x = 0.42; sg.add(neck);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.26, 0.48), stagCoat);
        head.position.set(0, 2.05, 0.88); sg.add(head);
        for (const aSide of [-1, 1]) {
          const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.75, 5), antlerMat);
          ant.position.set(aSide * 0.20, 2.40, 0.86);
          ant.rotation.z = -aSide * 0.42;
          sg.add(ant);
        }
        for (const [lx, lz] of [[0.22, 0.5], [-0.22, 0.5], [0.22, -0.5], [-0.22, -0.5]]) {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.04, 1.15, 5), stagCoat);
          leg.position.set(lx, 0.58, lz); sg.add(leg);
        }

        sg.position.set(sx, sy, z);
        sg.rotation.y = rng() * Math.PI * 2;
        this.wildlifeGroup.add(sg);
        this.wildlifeActors.stags.push({ mesh: sg, head, phase: rng() * 10 });
      }

      // 3. Hopping Luminous Blue Blupees beside scenic clearings
      const blupeeMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 1.6,
        roughness: 0.25
      });
      for (let z = 95; z < this.finishLineZ - 80; z += 180) {
        if (this.getCanyonFactor(z) > 0.2) continue;
        const side = rng() > 0.5 ? -1 : 1;
        const bx = this.getCurveX(z) + side * (9.5 + rng() * 5.0);
        const by = this.getGroundY(bx, z);
        const bg = new THREE.Group();
        const bBody = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), blupeeMat);
        bBody.position.y = 0.42; bBody.scale.set(0.85, 1.0, 1.2); bg.add(bBody);
        const bHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), blupeeMat);
        bHead.position.set(0, 0.65, 0.35); bg.add(bHead);
        for (const es of [-1, 1]) {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.58, 6), blupeeMat);
          ear.position.set(es * 0.14, 0.98, 0.28);
          ear.rotation.set(-0.25, 0, es * 0.2);
          bg.add(ear);
        }
        bg.position.set(bx, by, z);
        bg.rotation.y = side > 0 ? -Math.PI * 0.5 : Math.PI * 0.5;
        this.wildlifeGroup.add(bg);
        this.wildlifeActors.blupees.push({ mesh: bg, baseY: by, phase: rng() * 6.28 });
      }

      this.scene.add(this.wildlifeGroup);
    }

    buildFinishGate() {
      if (this.finishGateGroup) this.scene.remove(this.finishGateGroup);
      this.finishGateGroup = new THREE.Group();

      const buildArchway = (z, titleText, bgHex) => {
        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const g = new THREE.Group();

        const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c3311, roughness: 0.78, map: this.textures.getBarkTexture() });
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.75 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.2 });

        // Stone Base Pedestals + Tall Timber Pillars
        for (const side of [-1, 1]) {
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 1.8, 8), stoneMat);
          base.position.set(cx + side * 7.6, cy + 0.9, z);
          base.castShadow = true;
          g.add(base);

          const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.95, 8.8, 0.95), woodMat);
          pillar.position.set(cx + side * 7.6, cy + 5.2, z);
          pillar.castShadow = true;
          g.add(pillar);

          // Golden Trophy Crown on top of pillars (from Zelda-Copy1/track_finish_gate)
          const trophy = new THREE.Mesh(new THREE.OctahedronGeometry(0.65), goldMat);
          trophy.position.set(cx + side * 7.6, cy + 10.3, z);
          g.add(trophy);
        }

        const bar = new THREE.Mesh(new THREE.BoxGeometry(16.6, 2.4, 0.95), woodMat);
        bar.position.set(cx, cy + 8.6, z);
        bar.castShadow = true;
        g.add(bar);

        const bannerCanvas = document.createElement('canvas');
        bannerCanvas.width = 1024; bannerCanvas.height = 256;
        const bctx = bannerCanvas.getContext('2d');
        bctx.fillStyle = bgHex;
        bctx.fillRect(0, 0, 1024, 256);

        const checkSize = 32;
        for (let x = 0; x < 1024; x += checkSize) {
          for (let row = 0; row < 2; row++) {
            bctx.fillStyle = ((x / checkSize + row) % 2 === 0) ? '#ffffff' : '#111111';
            bctx.fillRect(x, row * checkSize, checkSize, checkSize);
            bctx.fillRect(x, 256 - (2 - row) * checkSize, checkSize, checkSize);
          }
        }
        bctx.strokeStyle = '#ffd700';
        bctx.lineWidth = 8;
        bctx.strokeRect(8, 68, 1008, 120);

        bctx.font = '900 94px "Luckiest Guy", Impact, Arial Black, sans-serif';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.fillStyle = '#000000';
        bctx.fillText(titleText, 515, 131);
        bctx.fillStyle = '#ffea00';
        bctx.strokeStyle = '#1a1a1a';
        bctx.lineWidth = 14;
        bctx.strokeText(titleText, 512, 128);
        bctx.fillText(titleText, 512, 128);

        const bannerTex = new THREE.CanvasTexture(bannerCanvas);
        const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });

        const bannerPlaneFront = new THREE.Mesh(new THREE.PlaneGeometry(15.2, 2.3), bannerMat);
        bannerPlaneFront.position.set(cx, cy + 8.6, z - 0.50);
        bannerPlaneFront.rotation.y = Math.PI;
        g.add(bannerPlaneFront);

        const bannerPlaneBack = new THREE.Mesh(new THREE.PlaneGeometry(15.2, 2.3), bannerMat);
        bannerPlaneBack.position.set(cx, cy + 8.6, z + 0.50);
        g.add(bannerPlaneBack);

        this.finishGateGroup.add(g);
      };

      buildArchway(16, '★  FUN RUN  ★', '#15803d');
      buildArchway(this.finishLineZ, '★  FINISH  ★', '#c62828');
      this.scene.add(this.finishGateGroup);
    }

    // ------------------------------------------------------------------------
    // INTERACTIVE TRACK ELEMENTS
    // ------------------------------------------------------------------------
    spawnWorldElements() {
      this.clearWorldElements();
      // Screen Left (+4.5), Screen Center (0), Screen Right (-4.5)
      const lanes = [4.5, 0, -4.5];
      const spec = this.getTrackSpec();
      const s = spec.spawn;
      const rng = createSeededRng(5000 + this.currentLevel * 777);

      const pCrate = s.wCrate;
      const pRock = pCrate + s.wRock;
      const pBounce = pRock + s.wBounce;

      for (let z = 50; z < this.finishLineZ - 35; z += s.stepMin + rng() * s.stepVar) {
        const roll = rng();
        const laneX = lanes[Math.floor(rng() * lanes.length)];
        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const worldX = cx + laneX;

        if (roll < pCrate) {
          this.createCrate(worldX, cy + 1.6, z, laneX);
        } else if (roll < pRock) {
          this.createRock(worldX, cy + 0.7, z, laneX);
        } else if (roll < pBounce) {
          this.createBouncePad(worldX, cy + 0.1, z, laneX);
        } else {
          this.createSpeedPad(worldX, cy + 0.08, z, laneX);
        }
      }
    }

    // ------------------------------------------------------------------------
    // HIGH-POLISH 3D ITEM MODELS (Zelda & Fun Run authentic styling)
    // ------------------------------------------------------------------------
    createMysteryCrateMesh() {
      const group = new THREE.Group();

      if (!this._sharedCrateAssets) {
        const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#c62828';
        ctx.fillRect(0, 0, 256, 256);

        ctx.strokeStyle = '#8e0000';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(0, 85); ctx.lineTo(256, 85);
        ctx.moveTo(0, 170); ctx.lineTo(256, 170);
        ctx.stroke();

        ctx.fillStyle = '#ffb300';
        ctx.beginPath();
        ctx.moveTo(128, 28);
        ctx.lineTo(228, 128);
        ctx.lineTo(128, 228);
        ctx.lineTo(28, 128);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ff6f00';
        ctx.lineWidth = 6;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#212121';
        ctx.lineWidth = 10;
        ctx.font = '900 130px "Luckiest Guy", Impact, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText('?', 128, 134);
        ctx.fillText('?', 128, 134);

        ctx.fillStyle = '#ffd54f';
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 2;
        for (let [rx, ry] of [[18, 18], [238, 18], [18, 238], [238, 238]]) {
          ctx.beginPath();
          ctx.arc(rx, ry, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        const crateMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.58,
          metalness: 0.14
        });

        // Merge all 8 gold metallic corner brackets into ONE mesh
        const cornerParts = [];
        const cBox = new THREE.BoxGeometry(0.38, 0.38, 0.38);
        for (const cx of [-0.75, 0.75]) {
          for (const cy of [-0.75, 0.75]) {
            for (const cz of [-0.75, 0.75]) {
              cornerParts.push({ geo: cBox, pos: [cx, cy, cz], color: 0xffca28, ao: false, flat: true });
            }
          }
        }
        const cornerMerged = mergeColoredGeometries(cornerParts, 0.0);
        const cornerMat = new THREE.MeshStandardMaterial({
          vertexColors: true,
          metalness: 0.85,
          roughness: 0.25
        });

        const auraGeo = new THREE.RingGeometry(0.5, 1.05, 16);
        auraGeo.rotateX(-Math.PI / 2);
        const auraMat = new THREE.MeshBasicMaterial({
          color: 0xffd54f,
          transparent: true,
          opacity: 0.60,
          side: THREE.DoubleSide
        });

        this._sharedCrateAssets = { boxGeo, crateMat, cornerMerged, cornerMat, auraGeo, auraMat };
      }

      const a = this._sharedCrateAssets;
      const crateMesh = new THREE.Mesh(a.boxGeo, a.crateMat);
      crateMesh.castShadow = true;
      group.add(crateMesh);

      const cornersMesh = new THREE.Mesh(a.cornerMerged, a.cornerMat);
      group.add(cornersMesh);

      const aura = new THREE.Mesh(a.auraGeo, a.auraMat);
      aura.position.y = -1.1;
      group.add(aura);

      return group;
    }

    createSawbladeMesh() {
      const group = new THREE.Group();

      const shape = new THREE.Shape();
      const teeth = 10;
      const rOuter = 1.35;
      const rInner = 0.95;

      for (let i = 0; i < teeth; i++) {
        const a0 = (i / teeth) * Math.PI * 2;
        const a1 = a0 + (Math.PI * 2 / teeth) * 0.35;
        const a2 = a0 + (Math.PI * 2 / teeth) * 0.85;

        const x0 = Math.cos(a0) * rInner;
        const y0 = Math.sin(a0) * rInner;
        if (i === 0) shape.moveTo(x0, y0);
        else shape.lineTo(x0, y0);

        const x1 = Math.cos(a1) * rOuter;
        const y1 = Math.sin(a1) * rOuter;
        shape.lineTo(x1, y1);

        const x2 = Math.cos(a2) * rInner;
        const y2 = Math.sin(a2) * rInner;
        shape.lineTo(x2, y2);
      }
      shape.closePath();

      const hole = new THREE.Path();
      hole.absarc(0, 0, 0.35, 0, Math.PI * 2, true);
      shape.holes.push(hole);

      const bladeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.03,
        bevelThickness: 0.03
      });
      bladeGeo.center();

      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0xd6e0e6,
        metalness: 0.92,
        roughness: 0.18
      });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.castShadow = true;
      group.add(bladeMesh);

      // Red hazard/blood ring
      const ringGeo = new THREE.RingGeometry(0.40, 0.72, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xb71c1c, side: THREE.DoubleSide });
      const ringF = new THREE.Mesh(ringGeo, ringMat);
      ringF.position.z = 0.07;
      group.add(ringF);
      const ringB = new THREE.Mesh(ringGeo, ringMat);
      ringB.position.z = -0.07;
      group.add(ringB);

      // Center arbor bolt
      const boltGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.20, 12);
      boltGeo.rotateX(Math.PI / 2);
      const boltMat = new THREE.MeshStandardMaterial({ color: 0x455a64, metalness: 0.9, roughness: 0.2 });
      const bolt = new THREE.Mesh(boltGeo, boltMat);
      group.add(bolt);

      return group;
    }

    createBearTrapMesh() {
      const group = new THREE.Group();

      const baseFrameGeo = new THREE.TorusGeometry(0.95, 0.08, 6, 18);
      baseFrameGeo.rotateX(Math.PI / 2);
      baseFrameGeo.scale(1.2, 1.0, 0.9);
      const steelMat = new THREE.MeshStandardMaterial({
        color: 0x37474f,
        metalness: 0.85,
        roughness: 0.35
      });
      const baseFrame = new THREE.Mesh(baseFrameGeo, steelMat);
      baseFrame.position.y = 0.05;
      group.add(baseFrame);

      const triggerGeo = new THREE.CylinderGeometry(0.40, 0.42, 0.08, 14);
      const triggerMat = new THREE.MeshStandardMaterial({
        color: 0x546e7a,
        metalness: 0.75,
        roughness: 0.4
      });
      const trigger = new THREE.Mesh(triggerGeo, triggerMat);
      trigger.position.y = 0.08;
      group.add(trigger);

      // Left Jaw
      const jawLeft = new THREE.Group();
      const jawArcGeo = new THREE.TorusGeometry(0.88, 0.07, 4, 12, Math.PI);
      jawArcGeo.rotateX(Math.PI / 2);
      jawArcGeo.rotateY(Math.PI / 2);
      const arcMeshL = new THREE.Mesh(jawArcGeo, steelMat);
      jawLeft.add(arcMeshL);

      const toothGeo = new THREE.ConeGeometry(0.11, 0.36, 4);
      toothGeo.rotateX(Math.PI);
      const toothMat = new THREE.MeshStandardMaterial({
        color: 0xb0bec5,
        metalness: 0.9,
        roughness: 0.2
      });

      for (let i = 0; i < 5; i++) {
        const angle = ((i + 1) / 6) * Math.PI;
        const tooth = new THREE.Mesh(toothGeo, toothMat);
        tooth.position.set(-Math.cos(angle) * 0.88, 0.18, Math.sin(angle) * 0.88 - 0.44);
        tooth.rotation.x = -0.35;
        jawLeft.add(tooth);
      }
      jawLeft.position.set(-0.15, 0.08, 0);
      jawLeft.rotation.z = -0.45;
      group.add(jawLeft);
      group.jawLeft = jawLeft;

      // Right Jaw
      const jawRight = new THREE.Group();
      const arcMeshR = new THREE.Mesh(jawArcGeo, steelMat);
      arcMeshR.rotation.y = Math.PI;
      jawRight.add(arcMeshR);

      for (let i = 0; i < 5; i++) {
        const angle = ((i + 1) / 6) * Math.PI;
        const tooth = new THREE.Mesh(toothGeo, toothMat);
        tooth.position.set(Math.cos(angle) * 0.88, 0.18, Math.sin(angle) * 0.88 - 0.44);
        tooth.rotation.x = -0.35;
        jawRight.add(tooth);
      }
      jawRight.position.set(0.15, 0.08, 0);
      jawRight.rotation.z = 0.45;
      group.add(jawRight);
      group.jawRight = jawRight;

      return group;
    }

    createSpeedPadMesh() {
      const group = new THREE.Group();

      // Dark metallic base plate with cyan glowing side rails (from Zelda-Copy1/track_boost_pad)
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.7 });
      const glowRailMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 2.0,
        roughness: 0.2
      });

      const plate = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.08, 4.4), baseMat);
      plate.position.y = 0.04;
      plate.receiveShadow = true;
      group.add(plate);

      for (const side of [-1, 1]) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 4.3), glowRailMat);
        rail.position.set(side * 1.38, 0.06, 0);
        group.add(rail);
      }

      // Animated scrolling chevrons pointing STRICTLY FORWARD (+Z)
      const geo = new THREE.PlaneGeometry(2.5, 4.1);
      geo.rotateX(-Math.PI / 2);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 256, 256);

      // With rotateX(-PI/2), canvas TOP (y=0 -> v=1) is at -Z (camera), canvas BOTTOM (y=256 -> v=0) is at +Z (forward)!
      // Therefore arrows pointing toward yCenter + 32 point toward +Z (FORWARD)!
      for (let row = 0; row < 3; row++) {
        const yCenter = 45 + row * 80;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#ffea00';
        ctx.beginPath();
        ctx.moveTo(128, yCenter + 32);
        ctx.lineTo(230, yCenter - 22);
        ctx.lineTo(195, yCenter - 34);
        ctx.lineTo(128, yCenter + 2);
        ctx.lineTo(61, yCenter - 34);
        ctx.lineTo(26, yCenter - 22);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(128, yCenter + 24);
        ctx.lineTo(210, yCenter - 20);
        ctx.lineTo(195, yCenter - 28);
        ctx.lineTo(128, yCenter + 2);
        ctx.lineTo(61, yCenter - 28);
        ctx.lineTo(46, yCenter - 20);
        ctx.closePath();
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;

      const chevMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.96
      });
      const chevMesh = new THREE.Mesh(geo, chevMat);
      chevMesh.position.y = 0.095;
      group.add(chevMesh);
      group.tex = tex;
      return group;
    }

    createBouncePadMesh() {
      const group = new THREE.Group();

      const frameGeo = new THREE.CylinderGeometry(1.48, 1.56, 0.24, 24);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.85, roughness: 0.25 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.y = 0.12;
      frame.castShadow = true;
      group.add(frame);

      const trimGeo = new THREE.TorusGeometry(1.48, 0.08, 8, 24);
      trimGeo.rotateX(Math.PI / 2);
      const trim = new THREE.Mesh(trimGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.25 }));
      trim.position.y = 0.22;
      group.add(trim);

      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ec4899';
      ctx.beginPath(); ctx.arc(64, 64, 62, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(64, 64, 44, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ec4899';
      ctx.beginPath(); ctx.arc(64, 64, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ffea00';
      ctx.beginPath(); ctx.arc(64, 64, 12, 0, Math.PI * 2); ctx.fill();

      const tex = new THREE.CanvasTexture(canvas);
      const surfaceGeo = new THREE.CylinderGeometry(1.38, 1.38, 0.06, 24);
      const surfaceMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.35, metalness: 0.1 });
      const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
      surface.position.y = 0.24;
      group.add(surface);

      return group;
    }

    createRock(x, y, z, laneX) {
      const group = new THREE.Group();
      const rockMat = new THREE.MeshStandardMaterial({
        color: this.currentLevel === 2 ? 0x64748b : 0x566370,
        roughness: 0.82,
        metalness: 0.08
      });
      const mossMat = new THREE.MeshStandardMaterial({
        color: this.currentLevel === 2 ? 0xe0f2fe : 0x2f6829,
        roughness: 0.88
      });

      const mainGeo = new THREE.IcosahedronGeometry(1.22, 2);
      mainGeo.scale(1.22, 0.86, 1.15);
      const rock = new THREE.Mesh(mainGeo, rockMat);
      rock.castShadow = true;
      rock.receiveShadow = true;
      group.add(rock);

      // Secondary side crag for organic BotW boulder silhouette
      const subGeo = new THREE.IcosahedronGeometry(0.68, 1);
      subGeo.scale(1.1, 0.85, 1.0);
      const subRock = new THREE.Mesh(subGeo, rockMat);
      subRock.position.set(0.72, -0.18, 0.32);
      subRock.castShadow = true;
      group.add(subRock);

      // Moss / Snow cap on top
      const mossCap = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.94, 0.22, 12), mossMat);
      mossCap.position.y = 0.78;
      mossCap.castShadow = true;
      group.add(mossCap);

      group.position.set(x, y, z);
      group.rotation.set((Math.random() - 0.5) * 0.25, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.25);
      this.scene.add(group);
      this.rocks.push({ mesh: group, x, z, laneX, active: true });
    }

    createCrate(x, y, z, laneX) {
      const mesh = this.createMysteryCrateMesh();
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.crates.push({ mesh, x, z, laneX, baseY: y, active: true, respawnTimer: 0, popTimer: 0 });
    }

    createSpeedPad(x, y, z, laneX) {
      const mesh = this.createSpeedPadMesh();
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.speedPads.push({ mesh, x, z, laneX, active: true });
    }

    createBouncePad(x, y, z, laneX) {
      const mesh = this.createBouncePadMesh();
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.bouncePads.push({ mesh, x, z, laneX, active: true });
    }

    spawnSawblade(x, z, owner, direction = 'forward') {
      const mesh = this.createSawbladeMesh();
      const isBack = (direction === 'backward');
      const spawnZ = z + (isBack ? -2.4 : 2.2);
      const cy = this.getHillY(spawnZ) + 0.8;
      mesh.position.set(this.getCurveX(spawnZ) + x, cy, spawnZ);
      this.scene.add(mesh);
      this.projectiles.push({
        mesh,
        x,
        z: spawnZ,
        speed: isBack ? -42.0 : 46.0,
        owner,
        active: true
      });
    }

    spawnTrap(x, z, owner) {
      const mesh = this.createBearTrapMesh();
      const cy = this.getHillY(z) + 0.1;
      mesh.position.set(this.getCurveX(z) + x, cy, z);
      this.scene.add(mesh);
      this.traps.push({ mesh, x, z, active: true });
    }

    spawnThrownTrap(x, z, owner) {
      const mesh = this.createBearTrapMesh();
      const startY = this.getHillY(z) + 1.4;
      mesh.position.set(this.getCurveX(z) + x, startY, z + 2.0);
      this.scene.add(mesh);
      this.projectiles.push({
        mesh,
        x,
        z: z + 2.0,
        y: startY,
        vy: 8.0,
        speed: 52.0,
        owner,
        type: 'thrownTrap',
        active: true
      });
    }

    createPunchBoxMesh() {
      const group = new THREE.Group();

      // 1. Festive Surprise Box (Fun Run Punch-in-a-Box)
      const boxGeo = new THREE.BoxGeometry(1.3, 1.2, 1.3);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0xc2185b,
        roughness: 0.5,
        metalness: 0.15
      });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.y = 0.6;
      box.castShadow = true;
      group.add(box);

      // Gold Ribbon Stripes around box
      const ribMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3, metalness: 0.7 });
      const ribH = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.22, 1.32), ribMat);
      ribH.position.y = 0.6;
      group.add(ribH);

      const ribV = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.22, 1.32), ribMat);
      ribV.position.y = 0.6;
      group.add(ribV);

      // 2. Coiled Steel Spring
      const springGroup = new THREE.Group();
      const coilMat = new THREE.MeshStandardMaterial({ color: 0x90a4ae, metalness: 0.9, roughness: 0.2 });
      for (let s = 0; s < 5; s++) {
        const ringGeo = new THREE.TorusGeometry(0.22, 0.04, 6, 12);
        ringGeo.rotateX(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeo, coilMat);
        ring.position.y = 1.25 + s * 0.15;
        springGroup.add(ring);
      }
      group.add(springGroup);
      group.spring = springGroup;

      // 3. Giant Cartoon Boxing Glove
      const gloveGroup = new THREE.Group();
      const gloveMat = new THREE.MeshLambertMaterial({ color: 0xd50000 });
      const cuffMat = new THREE.MeshLambertMaterial({ color: 0xffffff });

      // Fist body
      const fistGeo = new THREE.SphereGeometry(0.48, 12, 10);
      fistGeo.scale(1.2, 0.95, 1.3);
      const fist = new THREE.Mesh(fistGeo, gloveMat);
      fist.castShadow = true;
      gloveGroup.add(fist);

      // Thumb
      const thumbGeo = new THREE.SphereGeometry(0.22, 8, 6);
      thumbGeo.scale(1.0, 0.7, 1.3);
      const thumb = new THREE.Mesh(thumbGeo, gloveMat);
      thumb.position.set(-0.35, 0.12, 0.2);
      thumb.rotation.y = -0.3;
      gloveGroup.add(thumb);

      // Wrist Cuff
      const cuffGeo = new THREE.CylinderGeometry(0.38, 0.40, 0.18, 12);
      const cuff = new THREE.Mesh(cuffGeo, cuffMat);
      cuff.position.set(0, -0.32, -0.15);
      gloveGroup.add(cuff);

      // Star on glove
      const starGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 5);
      starGeo.rotateX(Math.PI / 2);
      const star = new THREE.Mesh(starGeo, ribMat);
      star.position.set(0, 0.2, 0.58);
      gloveGroup.add(star);

      gloveGroup.position.set(0, 1.9, 0);
      group.add(gloveGroup);
      group.glove = gloveGroup;

      return group;
    }

    spawnPunchBox(x, z, owner) {
      const mesh = this.createPunchBoxMesh();
      const cy = this.getHillY(z) + 0.05;
      mesh.position.set(this.getCurveX(z) + x, cy, z);
      this.scene.add(mesh);
      this.punchBoxes.push({ mesh, x, z, active: true, punchTimer: 0 });
    }

    spawnThrownPunchBox(x, z, owner) {
      const mesh = this.createPunchBoxMesh();
      const startY = this.getHillY(z) + 1.6;
      mesh.position.set(this.getCurveX(z) + x, startY, z + 2.0);
      this.scene.add(mesh);
      this.projectiles.push({
        mesh,
        x,
        z: z + 2.0,
        y: startY,
        vy: 8.5,
        speed: 52.0,
        owner,
        type: 'thrownPunchBox',
        active: true
      });
    }

    spawnLightningBolt(targetRacer) {
      const group = new THREE.Group();
      const cx = this.getCurveX(targetRacer.z) + targetRacer.x;
      const groundY = this.getHillY(targetRacer.z);
      const topY = groundY + 46;

      // Multi-segment jagged 3D lightning bolt (white-hot core + electric cyan glow)
      const segments = 9;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = THREE.MathUtils.lerp(topY, groundY + 0.4, t);
        const jitter = (i === 0 || i === segments) ? 0 : (1.0 - Math.abs(t - 0.5)) * 2.6;
        pts.push(new THREE.Vector3(
          (Math.random() - 0.5) * jitter,
          y - groundY,
          (Math.random() - 0.5) * jitter * 0.6
        ));
      }

      const curve = new THREE.CatmullRomCurve3(pts);
      const coreGeo = new THREE.TubeGeometry(curve, 18, 0.22, 6, false);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1.0 });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      group.add(coreMesh);

      const glowGeo = new THREE.TubeGeometry(curve, 18, 0.62, 6, false);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      group.add(glowMesh);

      // Ground impact shockwave ring + electric flash sphere
      const ringGeo = new THREE.TorusGeometry(1.1, 0.22, 8, 24);
      ringGeo.rotateX(Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const shockRing = new THREE.Mesh(ringGeo, ringMat);
      shockRing.position.y = 0.25;
      group.add(shockRing);

      const flashLight = new THREE.PointLight(0x7dd3fc, 6.0, 28);
      flashLight.position.set(0, 3.5, 0);
      group.add(flashLight);

      group.position.set(cx, groundY, targetRacer.z);
      this.scene.add(group);
      this.particles.spawnSparks(cx, groundY + 1.2, targetRacer.z, 22);

      this.lightningEffects.push({
        group,
        coreMat,
        glowMat,
        shockRing,
        ringMat,
        flashLight,
        age: 0,
        maxAge: 0.68
      });
    }

    triggerLightning(attacker) {
      this.racers.forEach(r => {
        if (r !== attacker && !r.dead) {
          this.spawnLightningBolt(r);
          r.takeDamage('lightning');
        }
      });
      this.lightningFlashTimer = 0.38;
      this.cameraShake = 0.95;
    }

    clearWorldElements() {
      for (let r of this.rocks) this.scene.remove(r.mesh);
      for (let c of this.crates) this.scene.remove(c.mesh);
      for (let s of this.speedPads) this.scene.remove(s.mesh);
      for (let b of this.bouncePads) this.scene.remove(b.mesh);
      for (let p of this.projectiles) this.scene.remove(p.mesh);
      for (let t of this.traps) this.scene.remove(t.mesh);
      for (let pb of this.punchBoxes) this.scene.remove(pb.mesh);
      for (let lf of this.lightningEffects) this.scene.remove(lf.group);
      this.rocks = [];
      this.crates = [];
      this.speedPads = [];
      this.bouncePads = [];
      this.projectiles = [];
      this.traps = [];
      this.punchBoxes = [];
      this.lightningEffects = [];
      this.lightningFlashTimer = 0;
    }

    // ------------------------------------------------------------------------
    // UI & CONTROLS
    // ------------------------------------------------------------------------
    triggerBloodScreen() {
      if (!this.bloodOverlay) return;
      this.bloodOverlay.classList.remove('hidden');
      setTimeout(() => {
        if (this.bloodOverlay) this.bloodOverlay.classList.add('hidden');
      }, 1300);
    }

    hideWeaponButton() {
      if (this.weaponBtn) this.weaponBtn.style.display = 'none';
    }

    showWeaponButton(itemType) {
      if (!this.weaponBtn) return;
      this.weaponBtn.style.display = 'flex';
      const iconImg = document.getElementById('icon3d-powerup');
      if (iconImg) {
        if (itemType === 'blade') iconImg.src = 'assets/images/game/powerup/blade/icon.png';
        else if (itemType === 'trap') iconImg.src = 'assets/images/game/powerup/trap/icon.png';
        else if (itemType === 'punchBox') iconImg.src = 'assets/images/game/powerup/bounceTrap/icon.png';
        else if (itemType === 'lightning') iconImg.src = 'assets/images/game/powerup/lightning/icon.png';
        else if (itemType === 'shield') iconImg.src = 'assets/images/game/powerup/shield/icon.png';
        else if (itemType === 'speed') iconImg.src = 'assets/images/game/powerup/speed/icon.png';
      }
    }

    resize() {
      if (!this.renderer || !this.camera || !this.canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h, false);
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize());

      // Track key states for combos (e.g. Up + X for throwing forward)
      window.addEventListener('keyup', (e) => {
        this.keys[e.key] = false;
      });

      // Keyboard Controls (Left is Left, Right is Right!)
      window.addEventListener('keydown', (e) => {
        this.keys[e.key] = true;
        if (!this.isPlaying || !this.player) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          // Move to Screen Left (laneIndex 0 -> x = +4.5)
          this.player.laneIndex = Math.max(0, this.player.laneIndex - 1);
          this.player.targetX = (1 - this.player.laneIndex) * 4.5;
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          // Move to Screen Right (laneIndex 2 -> x = -4.5)
          this.player.laneIndex = Math.min(2, this.player.laneIndex + 1);
          this.player.targetX = (1 - this.player.laneIndex) * 4.5;
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          this.player.jump();
        } else if (e.key === 'x' || e.key === 'X' || e.key === 'Shift' || e.key === 'Enter') {
          if (this.player.currentWeapon) {
            const isForward = this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'];
            const isBackward = this.keys['ArrowDown'] || this.keys['s'] || this.keys['S'];
            this.player.usePowerup(isForward ? 'forward' : (isBackward ? 'backward' : 'default'));
          }
        }
      });

      // Touch & Swipe Controls (Left is Left, Right is Right!)
      let touchStartX = 0, touchStartY = 0;
      if (this.canvas) {
        this.canvas.addEventListener('touchstart', (e) => {
          sfx.init();
          if (!this.isPlaying || !this.player) return;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
          if (!this.isPlaying || !this.player) return;
          e.preventDefault();
          const diffX = e.touches[0].clientX - touchStartX;
          const diffY = e.touches[0].clientY - touchStartY;

          // Swipe Up -> Jump & Double Jump
          if (diffY < -32 && Math.abs(diffY) > Math.abs(diffX) * 0.6) {
            this.player.jump();
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
          }
          // Swipe Right -> Move to Screen Right
          else if (diffX > 35 && Math.abs(diffX) > Math.abs(diffY) * 0.6) {
            if (this.player.laneIndex < 2) {
              this.player.laneIndex++;
              this.player.targetX = (1 - this.player.laneIndex) * 4.5;
            }
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
          // Swipe Left -> Move to Screen Left
          else if (diffX < -35 && Math.abs(diffX) > Math.abs(diffY) * 0.6) {
            if (this.player.laneIndex > 0) {
              this.player.laneIndex--;
              this.player.targetX = (1 - this.player.laneIndex) * 4.5;
            }
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
        }, { passive: false });
      }

      // Wooden Jump Button
      if (this.jumpBtn) {
        const triggerJump = (e) => {
          if (e) { e.preventDefault(); e.stopPropagation(); }
          sfx.init();
          if (this.isPlaying && this.player) this.player.jump();
        };
        this.jumpBtn.addEventListener('click', triggerJump);
        this.jumpBtn.addEventListener('touchstart', triggerJump, { passive: false });
      }

      // Wooden Fire Action Button (Power-Up): Swipe UP = Forward, Swipe DOWN = Backward (incl. Sawblade!), Tap = Default
      if (this.weaponBtn) {
        let btnTouchStartY = 0;
        let swipeDir = 'default';

        this.weaponBtn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          e.stopPropagation();
          sfx.init();
          btnTouchStartY = e.touches[0].clientY;
          swipeDir = 'default';
        }, { passive: false });

        this.weaponBtn.addEventListener('touchmove', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const currentY = e.touches[0].clientY;
          const diffY = currentY - btnTouchStartY;
          if (diffY < -22) {
            swipeDir = 'forward';
            this.weaponBtn.style.transform = 'translateY(-14px) scale(1.12)';
          } else if (diffY > 22) {
            swipeDir = 'backward';
            this.weaponBtn.style.transform = 'translateY(14px) scale(1.12)';
          } else {
            swipeDir = 'default';
            this.weaponBtn.style.transform = 'translateY(0) scale(1.0)';
          }
        }, { passive: false });

        this.weaponBtn.addEventListener('touchend', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.weaponBtn.style.transform = 'translateY(0) scale(1.0)';
          if (!this.player || !this.player.currentWeapon) return;
          this.player.usePowerup(swipeDir);
        }, { passive: false });

        this.weaponBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (this.player && this.player.currentWeapon) {
            const forward = this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'];
            const backward = this.keys['ArrowDown'] || this.keys['s'] || this.keys['S'];
            this.player.usePowerup(forward ? 'forward' : (backward ? 'backward' : 'default'));
          }
        });
      }

      if (this.exitBtn) {
        this.exitBtn.addEventListener('click', () => this.stopAndReturnToMenu('levels'));
      }
      if (this.nextLevelBtn) {
        this.nextLevelBtn.addEventListener('click', () => {
          const nextLvl = this.currentLevel < 8 ? this.currentLevel + 1 : 1;
          window.dispatchEvent(new CustomEvent('funrun3d:levelchange', { detail: { level: nextLvl } }));
          this.startRace(this.controlMode, nextLvl);
        });
      }
      if (this.restartBtn) {
        this.restartBtn.addEventListener('click', () => this.startRace(this.controlMode, this.currentLevel));
      }
      if (this.levelsBtn) {
        this.levelsBtn.addEventListener('click', () => this.stopAndReturnToMenu('levels'));
      }
      if (this.menuBtn) {
        this.menuBtn.addEventListener('click', () => this.stopAndReturnToMenu('home'));
      }
    }

    // ------------------------------------------------------------------------
    // RACE LIFECYCLE
    // ------------------------------------------------------------------------
    buildWorldScene() {
      for (let r of this.racers) r.destroy();
      this.racers = [];
      this.particles.clear();
      this.hideWeaponButton();

      this.elapsedTime = 0;
      this.applyBiomeLighting();
      this.buildSkyAndMountains();
      this.buildTrackMesh();
      this.buildWater();
      this.buildBridgeDetails();
      this.buildSceneryTrees();
      this.buildFoliage();
      this.buildWildlife();
      this.buildFinishGate();
      this.spawnWorldElements();

      // Spawn 4 Fun Run Competitors
      this.player = new Racer3D(1, this.selectedAnimal || 'bear', true, 'Du', this);
      this.racers = [
        this.player,
        new Racer3D(0, 'fox', false, 'Fuchs', this),
        new Racer3D(2, 'beaver', false, 'Biber', this),
        new Racer3D(1, 'baldeagle', false, 'Adler', this)
      ];

      // Position racers cleanly on ground before race launch and point camera immediately behind player
      for (const r of this.racers) {
        const cx = this.getCurveX(r.z);
        const cy = this.getHillY(r.z);
        r.group.position.set(cx + r.x, cy, r.z);
        r.shadowMesh.position.set(cx + r.x, cy + 0.05, r.z);
      }

      const p = this.player;
      const camX = this.getCurveX(p.z) + p.x * 0.75;
      const camZ = p.z - 11.5;
      const camY = Math.max(this.getHillY(p.z) + 4.9, this.getHillY(camZ) + 3.2);
      this.camera.position.set(camX, camY, camZ);
      this.camera.lookAt(this.getCurveX(p.z) + p.x * 0.3, this.getHillY(p.z) + 1.8, p.z + 16.0);
      if (this.skyDome) this.skyDome.position.set(camX, camY, camZ);
      this.sunLight.position.set(camX + 26, camY + 42, camZ + 18);
      this.sunLight.target.position.set(camX, camY, camZ + 20);
      this.sunLight.target.updateMatrixWorld();
      this.renderer.render(this.scene, this.camera);
    }

    startRace(mode = 'touch', level = 1) {
      sfx.init();
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      this.controlMode = mode;
      this.currentLevel = level;
      this._hillY0 = undefined;
      this.finishLineZ = this.getTrackSpec(level).finishLineZ;
      this.isPlaying = false;

      // Expand container to 100vw x 100vh for true edge-to-edge 3D
      document.body.classList.add('mode-3d');

      if (this.levelSelectScreen) {
        this.levelSelectScreen.style.display = 'none';
        this.levelSelectScreen.classList.add('hidden');
      }
      if (this.resultsScreen) {
        this.resultsScreen.style.display = 'none';
        this.resultsScreen.classList.add('hidden');
      }
      if (this.uiOverlay) this.uiOverlay.classList.remove('hidden');

      this.canvas.classList.remove('hidden');
      this.resize();
      this.buildWorldScene();

      // Show Countdown (3 - 2 - 1 - GO!) with live scene visible behind it
      this.countdownDisplay.style.display = 'block';
      let count = 3;
      this.countdownDisplay.textContent = count;
      sfx.play('countdown');

      this.countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          this.countdownDisplay.textContent = count;
          sfx.play('countdown');
        } else if (count === 0) {
          this.countdownDisplay.textContent = 'LOS!';
          sfx.play('start');
        } else {
          clearInterval(this.countdownInterval);
          this.countdownInterval = null;
          this.countdownDisplay.style.display = 'none';
          this.launchLoop();
        }
      }, 750);
    }

    launchLoop() {
      this.raceStartTime = Date.now();
      this.lastTime = performance.now();
      this.isPlaying = true;
      requestAnimationFrame((t) => this.gameLoop(t));
    }

    checkCollisions() {
      for (let r of this.racers) {
        if (r.dead) continue;

        // 1. Rock Boulders
        for (let rock of this.rocks) {
          if (!rock.active) continue;
          const dz = Math.abs(r.z - rock.z);
          const dx = Math.abs(r.x - rock.laneX);
          if (dz < 1.3 && dx < 1.6) {
            if (r.jumpY < 1.3) {
              r.stumbleTimer = 0.75;
              r.speed *= 0.45;
              sfx.play('rock_hit');
              this.particles.spawnDust(r.x, this.getHillY(r.z) + 0.3, r.z, 8);
              if (r.isPlayer) this.cameraShake = 0.55;
            }
          }
        }

        // 2. Mystery Crates (Respawns after exactly 3.0 seconds!)
        for (let crate of this.crates) {
          if (!crate.active) continue;
          const dz = Math.abs(r.z - crate.z);
          const dx = Math.abs(r.x - crate.laneX);
          if (dz < 1.4 && dx < 1.6) {
            crate.active = false;
            crate.mesh.visible = false;
            crate.respawnTimer = 3.0; // 3 seconds respawn time!
            sfx.play('pickup');
            this.particles.spawnSparks(crate.x, crate.baseY, crate.z, 20);

            const weapons = ['blade', 'trap', 'punchBox', 'speed', 'shield', 'lightning'];
            r.currentWeapon = weapons[Math.floor(Math.random() * weapons.length)];
            if (r.isPlayer) this.showWeaponButton(r.currentWeapon);
          }
        }

        // 3. Speed Booster Pads
        for (let pad of this.speedPads) {
          const dz = Math.abs(r.z - pad.z);
          const dx = Math.abs(r.x - pad.laneX);
          if (dz < 1.6 && dx < 1.6 && r.jumpY < 0.6) {
            r.speedBoostTimer = 2.5;
            r.speed = r.baseSpeed * 1.55;
            sfx.play('speed_act');
          }
        }

        // 4. Bounce Trampolines
        for (let pad of this.bouncePads) {
          const dz = Math.abs(r.z - pad.z);
          const dx = Math.abs(r.x - pad.laneX);
          if (dz < 1.4 && dx < 1.5 && r.jumpY < 0.6) {
            r.vy = 26.0;
            r.isJumping = true;
            r.jumpCount = 1;
            r.isFlipping = true;
            r.flipAngle = 0;
            sfx.play('bounce');
            this.particles.spawnSparks(r.x, this.getHillY(r.z) + 0.5, r.z, 22);
          }
        }

        // 5. Placed Bear Traps (Violent snap animation)
        for (let trap of this.traps) {
          if (!trap.active) continue;
          const dz = Math.abs(r.z - trap.z);
          const dx = Math.abs(r.x - trap.x);
          if (dz < 1.2 && dx < 1.3 && r.jumpY < 0.5) {
            trap.active = false;
            // Snap jaws shut
            if (trap.mesh.jawLeft) trap.mesh.jawLeft.rotation.z = 0;
            if (trap.mesh.jawRight) trap.mesh.jawRight.rotation.z = 0;
            setTimeout(() => {
              this.scene.remove(trap.mesh);
            }, 650);
            r.takeDamage('trap');
          }
        }

        // 5b. Stationary Punch-in-a-Box (Spring punches victim violently)
        for (let pb of this.punchBoxes) {
          if (!pb.active) continue;
          const dz = Math.abs(r.z - pb.z);
          const dx = Math.abs(r.x - pb.x);
          if (dz < 1.3 && dx < 1.4 && r.jumpY < 0.6) {
            pb.active = false;
            // Pop glove forward on spring
            if (pb.mesh.spring) {
              pb.mesh.spring.scale.set(1.4, 2.8, 1.4);
              pb.mesh.spring.position.y += 0.35;
            }
            if (pb.mesh.glove) {
              pb.mesh.glove.position.y += 1.6;
              pb.mesh.glove.position.z += 0.8;
            }
            setTimeout(() => {
              this.scene.remove(pb.mesh);
            }, 750);
            r.takeDamage('punch');
          }
        }
      }

      // 6. Projectiles vs Racers
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        if (!p.active) continue;
        for (let r of this.racers) {
          if (r !== p.owner && !r.dead) {
            const dz = Math.abs(r.z - p.z);
            const dx = Math.abs(r.x - p.x);
            if (dz < 1.6 && dx < 1.5) {
              p.active = false;
              this.scene.remove(p.mesh);
              if (p.type === 'thrownTrap') {
                r.takeDamage('trap');
              } else if (p.type === 'thrownPunchBox') {
                r.takeDamage('punch');
              } else {
                r.takeDamage('blade');
              }
              break;
            }
          }
        }
      }
    }

    gameLoop(currentTime) {
      if (!this.isPlaying) return;
      requestAnimationFrame((t) => this.gameLoop(t));

      let dt = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      if (dt > 0.05) dt = 0.05;
      if (dt < 0) dt = 0;
      this.elapsedTime += dt;

      // Update Racers & Physics
      this.racers.forEach(r => r.update(dt));
      this.particles.update(dt);

      // Update Zelda Shaders (Sky wisps, BotW Wind Grass, Wildflowers, Flowing River Water)
      if (this.skyMaterial && this.skyMaterial.uniforms.uTime) {
        this.skyMaterial.uniforms.uTime.value = this.elapsedTime;
      }
      for (const gm of this.grassMaterials) {
        if (gm.uniforms.uTime) gm.uniforms.uTime.value = this.elapsedTime;
      }
      for (const fm of this.flowerMaterials) {
        if (fm.uniforms.uTime) fm.uniforms.uTime.value = this.elapsedTime;
      }
      for (const wm of this.waterMaterials) {
        if (wm.uniforms.uTime) wm.uniforms.uTime.value = this.elapsedTime;
      }

      // Drift Volumetric Clouds smoothly across the valley sky
      for (let c of this.clouds) {
        c.position.x += dt * 1.1;
      }

      // Animate Living Wildlife (Soaring Birds, Grazing Stags, Hopping Blupees, Sheikah Runes)
      const pZ = this.player ? this.player.z : 0;
      for (const b of this.wildlifeActors.birds) {
        if (Math.abs(b.baseZ - pZ) > 160) continue;
        const ang = this.elapsedTime * b.speed + b.phase;
        b.mesh.position.set(
          b.centerX + Math.cos(ang) * b.radius,
          b.baseY + Math.sin(ang * 2.0) * 1.8,
          b.baseZ + Math.sin(ang) * b.radius
        );
        b.mesh.rotation.y = -ang;
        const flap = Math.sin(this.elapsedTime * 11.0 + b.phase) * 0.55;
        b.wL.rotation.z = flap;
        b.wR.rotation.z = -flap;
      }
      for (const s of this.wildlifeActors.stags) {
        if (Math.abs(s.mesh.position.z - pZ) > 140) continue;
        s.head.rotation.x = Math.sin(this.elapsedTime * 1.6 + s.phase) * 0.18;
      }
      for (const bl of this.wildlifeActors.blupees) {
        if (Math.abs(bl.mesh.position.z - pZ) > 140) continue;
        bl.mesh.position.y = bl.baseY + Math.abs(Math.sin(this.elapsedTime * 4.5 + bl.phase)) * 0.65;
      }
      for (const rune of this.wildlifeActors.runes) {
        rune.rotation.z += dt * 1.2;
      }

      // Update Ambient Floating Particles (Golden Pollen/Fireflies, Snowfall, or Sakura Petals)
      if (this.ambientParticles && this.player) {
        const posAttr = this.ambientParticles.geometry.attributes.position;
        const playerZ = this.player.z;
        const isFall = (this.currentLevel === 2 || this.currentLevel === 3);
        for (let i = 0; i < posAttr.count; i++) {
          let x = posAttr.getX(i);
          let y = posAttr.getY(i);
          let z = posAttr.getZ(i);

          if (isFall) {
            y -= dt * (this.currentLevel === 2 ? 3.8 : 2.2);
            x += Math.sin(this.elapsedTime * 1.8 + i) * dt * 1.4;
          } else {
            y += Math.sin(this.elapsedTime * 2.2 + i) * dt * 0.7;
            x += Math.cos(this.elapsedTime * 1.4 + i) * dt * 0.5;
          }

          if (z < playerZ - 14 || z > playerZ + 125 || y < this.getHillY(playerZ) - 5) {
            const newZ = playerZ + 12 + Math.random() * 110;
            const cx = this.getCurveX(newZ);
            const cy = this.getHillY(newZ);
            x = cx + (Math.random() - 0.5) * 44;
            z = newZ;
            y = cy + (isFall ? (12 + Math.random() * 16) : (1.5 + Math.random() * 12));
          }
          posAttr.setXYZ(i, x, y, z);
        }
        posAttr.needsUpdate = true;
      }

      // Rotate Crates & Handle 3-Second Respawns with Pop Animation
      this.crates.forEach(c => {
        if (c.active) {
          c.mesh.rotation.y += dt * 2.5;
          c.mesh.rotation.z = Math.sin(currentTime * 0.003 + c.z) * 0.12;
          c.mesh.position.y = c.baseY + Math.sin(currentTime * 0.004 + c.z) * 0.35;
        } else if (c.respawnTimer > 0) {
          c.respawnTimer -= dt;
          if (c.respawnTimer <= 0) {
            c.active = true;
            c.mesh.visible = true;
            c.popTimer = 0.35;
            c.mesh.scale.set(0.15, 0.15, 0.15);
            this.particles.spawnSparks(c.x, c.baseY, c.z, 16);
          }
        }
        if (c.popTimer > 0) {
          c.popTimer -= dt;
          const prog = Math.max(0, 1.0 - c.popTimer / 0.35);
          const popScale = 1.0 + Math.sin(prog * Math.PI) * 0.35;
          c.mesh.scale.set(popScale, popScale, popScale);
        }
      });

      // Animate flowing speed pad chevrons strictly FORWARD (+Z)
      for (let pad of this.speedPads) {
        if (pad.mesh && pad.mesh.tex) {
          pad.mesh.tex.offset.y = (this.elapsedTime * 1.65) % 1.0;
        }
      }

      // Update Projectiles (Sawblades, thrown bear traps, thrown punchboxes)
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        if (p.type === 'thrownTrap' || p.type === 'thrownPunchBox') {
          p.z += p.speed * dt;
          p.vy -= 26.0 * dt;
          p.y += p.vy * dt;
          p.mesh.rotation.x += dt * 8.0;

          const groundH = this.getHillY(p.z) + (p.type === 'thrownTrap' ? 0.1 : 0.05);
          if (p.y <= groundH) {
            p.mesh.rotation.x = 0;
            p.mesh.position.set(this.getCurveX(p.z) + p.x, groundH, p.z);
            if (p.type === 'thrownTrap') {
              this.traps.push({ mesh: p.mesh, x: p.x, z: p.z, active: true });
            } else {
              this.punchBoxes.push({ mesh: p.mesh, x: p.x, z: p.z, active: true, punchTimer: 0 });
            }
            this.particles.spawnDust(this.getCurveX(p.z) + p.x, groundH + 0.3, p.z, 6);
            this.projectiles.splice(i, 1);
            continue;
          } else {
            p.mesh.position.set(this.getCurveX(p.z) + p.x, p.y, p.z);
          }
        } else {
          p.z += p.speed * dt;
          p.mesh.rotation.z += dt * (p.speed >= 0 ? 38 : -38);
          const cy = this.getHillY(p.z) + 0.8;
          p.mesh.position.set(this.getCurveX(p.z) + p.x, cy, p.z);
          if (Math.random() < 0.35) {
            this.particles.spawnSparks(this.getCurveX(p.z) + p.x, cy - 0.4, p.z, 2);
          }
        }

        if (p.z > this.finishLineZ + 50 || p.z < -20 || Math.abs(p.z - this.player.z) > 150) {
          this.scene.remove(p.mesh);
          this.projectiles.splice(i, 1);
        }
      }

      // Animate 3D Lightning Bolts, Shockwaves & Sky Flash
      if (this.lightningFlashTimer > 0) {
        this.lightningFlashTimer = Math.max(0, this.lightningFlashTimer - dt);
        if (this.ambientLight) {
          const pulse = Math.sin(this.lightningFlashTimer * 48) > 0 ? 1.0 : 0.45;
          this.ambientLight.intensity = 0.24 + (this.lightningFlashTimer / 0.38) * 1.45 * pulse;
        }
      } else if (this.ambientLight && this.ambientLight.intensity !== 0.24) {
        this.ambientLight.intensity = 0.24;
      }

      for (let i = this.lightningEffects.length - 1; i >= 0; i--) {
        const lf = this.lightningEffects[i];
        lf.age += dt;
        const progress = lf.age / lf.maxAge;
        if (progress >= 1.0) {
          this.scene.remove(lf.group);
          this.lightningEffects.splice(i, 1);
          continue;
        }
        const flicker = Math.sin(lf.age * 95) > -0.25 ? 1.0 : 0.25;
        const fade = Math.max(0, 1.0 - progress);
        lf.coreMat.opacity = fade * flicker;
        lf.glowMat.opacity = fade * 0.78 * flicker;
        lf.flashLight.intensity = fade * 8.0 * flicker;
        const ringScale = 1.0 + progress * 4.5;
        lf.shockRing.scale.set(ringScale, ringScale, ringScale);
        lf.ringMat.opacity = fade * 0.95;
      }

      this.checkCollisions();

      // Camera Follower (Silky smooth 3rd person tracking directly behind player with downhill anti-clipping)
      const p = this.player;
      const curveX = this.getCurveX(p.z);
      const groundY = this.getHillY(p.z);

      const targetCamX = curveX + p.x * 0.75;
      const targetCamZ = p.z - 11.5;

      const groundAtCam = this.getHillY(targetCamZ);
      let highestObstacleY = groundAtCam;
      for (let step = 0.25; step <= 0.75; step += 0.25) {
        const checkZ = targetCamZ + (p.z - targetCamZ) * step;
        const checkH = this.getHillY(checkZ);
        if (checkH > highestObstacleY) highestObstacleY = checkH;
      }

      let desiredCamY = groundY + 4.9 + p.jumpY * 0.35;
      if (desiredCamY < groundAtCam + 3.2) desiredCamY = groundAtCam + 3.2;
      if (desiredCamY < highestObstacleY + 2.8) desiredCamY = highestObstacleY + 2.8;

      const targetCamY = desiredCamY;

      this.camera.position.x += (targetCamX - this.camera.position.x) * 12.0 * dt;
      this.camera.position.y += (targetCamY - this.camera.position.y) * 10.0 * dt;
      this.camera.position.z = targetCamZ;

      const currentGroundBelowCam = this.getHillY(this.camera.position.z);
      if (this.camera.position.y < currentGroundBelowCam + 2.6) {
        this.camera.position.y = currentGroundBelowCam + 2.6;
      }

      if (this.cameraShake > 0) {
        this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
        this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
        this.cameraShake = Math.max(0, this.cameraShake - 2.5 * dt);
      }

      const lookAheadZ = p.z + 16.0;
      const lookX = this.getCurveX(p.z) + p.x * 0.3;
      const lookY = groundY + p.jumpY + 1.8;
      this.camera.lookAt(lookX, lookY, lookAheadZ);

      // SkyDome tracks camera position cleanly
      if (this.skyDome) {
        this.skyDome.position.set(targetCamX, targetCamY, targetCamZ);
      }

      // Sun Light & BotW Rim Light track player with updated target matrix!
      this.sunLight.position.set(targetCamX + 26, groundY + 42, p.z + 18);
      this.sunLight.target.position.set(curveX, groundY, p.z + 18);
      this.sunLight.target.updateMatrixWorld();

      if (this.rimLight) {
        this.rimLight.position.set(targetCamX - 22, groundY + 28, p.z - 14);
        this.rimLight.target.position.set(curveX, groundY, p.z + 18);
        this.rimLight.target.updateMatrixWorld();
      }

      // Render WebGL Scene
      this.renderer.render(this.scene, this.camera);

      // HUD Rank Updates
      const sorted = [...this.racers].sort((a, b) => b.z - a.z);
      const rank = sorted.indexOf(this.player) + 1;
      if (this.rankDisplay) {
        this.rankDisplay.textContent = rank + (rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th');
        this.rankDisplay.style.color = (rank === 1) ? '#ffea00' : (rank === 4 ? '#ff3b30' : '#ffffff');
      }

      // Mini-Map Updates
      const markerPlayer = document.getElementById('marker3d-player');
      const markerBot1 = document.getElementById('marker3d-bot1');
      const markerBot2 = document.getElementById('marker3d-bot2');
      const markerBot3 = document.getElementById('marker3d-bot3');
      if (markerPlayer && this.player) {
        markerPlayer.style.left = Math.min(100, Math.max(0, (this.player.z / this.finishLineZ) * 100)) + '%';
      }
      if (markerBot1 && this.racers[1]) {
        markerBot1.style.left = Math.min(100, Math.max(0, (this.racers[1].z / this.finishLineZ) * 100)) + '%';
      }
      if (markerBot2 && this.racers[2]) {
        markerBot2.style.left = Math.min(100, Math.max(0, (this.racers[2].z / this.finishLineZ) * 100)) + '%';
      }
      if (markerBot3 && this.racers[3]) {
        markerBot3.style.left = Math.min(100, Math.max(0, (this.racers[3].z / this.finishLineZ) * 100)) + '%';
      }

      // Check Race Finish
      if (this.player.z >= this.finishLineZ + 10) {
        this.handleFinish();
      }
    }

    handleFinish() {
      this.isPlaying = false;
      this.hideWeaponButton();
      const currentTotalTime = (Date.now() - this.raceStartTime) / 1000;
      this.racers.forEach(r => {
        if (r.finishTime === null) {
          r.finishTime = currentTotalTime + Math.max(0.05, (this.finishLineZ - r.z) / Math.max(r.speed, 12));
        }
      });

      const finalRanking = [...this.racers].sort((a, b) => a.finishTime - b.finishTime);
      const playerRank = finalRanking.findIndex(r => r.isPlayer) + 1;
      const bestTime = finalRanking[0] ? finalRanking[0].finishTime : currentTotalTime;
      const spec = this.getTrackSpec(this.currentLevel);

      const titleEl = document.getElementById('result3d-title');
      if (titleEl) {
        titleEl.textContent = playerRank === 1 ? '1. PLATZ! 🏆' : 'PLATZ ' + playerRank + ' 🏁';
        titleEl.style.color = playerRank === 1 ? '#ffea00' : '#ffffff';
      }

      const subtitleEl = document.getElementById('result3d-subtitle');
      if (subtitleEl) {
        subtitleEl.textContent = `LEVEL ${this.currentLevel} • ${(spec.name || 'POCKET RUN').toUpperCase()} — ZEITEN`;
      }

      if (this.nextLevelBtn) {
        const nextLvl = this.currentLevel < 8 ? this.currentLevel + 1 : 1;
        const nextSpec = this.getTrackSpec(nextLvl);
        this.nextLevelBtn.textContent = this.currentLevel < 8
          ? `▶ LEVEL ${nextLvl}: ${nextSpec.name.toUpperCase()}`
          : `▶ LEVEL 1: ${nextSpec.name.toUpperCase()}`;
      }

      const medals = ['🥇', '🥈', '🥉', '4.'];
      let lbHTML = '';
      finalRanking.forEach((r, idx) => {
        const rankClass = `rank-${idx + 1}`;
        const delta = idx === 0 ? '' : ` (+${(r.finishTime - bestTime).toFixed(2)}s)`;
        const displayName = r.isPlayer ? 'Du ★' : r.name;
        lbHTML += `
          <li class="leaderboard-item ${rankClass} ${r.isPlayer ? 'result-is-player' : ''}">
            <span>${medals[idx] || '#' + (idx + 1)} ${displayName}</span>
            <span class="result-time-val">${formatTime(r.finishTime)}<small>${delta}</small></span>
          </li>
        `;
      });
      if (this.resultsList) this.resultsList.innerHTML = lbHTML;
      if (this.resultsScreen) {
        this.resultsScreen.style.display = 'flex';
        this.resultsScreen.classList.remove('hidden');
      }
      sfx.play('start');
    }

    stopAndReturnToMenu(target = 'home') {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
      if (this.countdownDisplay) this.countdownDisplay.style.display = 'none';
      this.isPlaying = false;
      document.body.classList.remove('mode-3d');
      if (this.canvas) this.canvas.classList.add('hidden');
      if (this.uiOverlay) this.uiOverlay.classList.add('hidden');
      if (this.resultsScreen) {
        this.resultsScreen.style.display = 'none';
        this.resultsScreen.classList.add('hidden');
      }
      if (this.bloodOverlay) this.bloodOverlay.classList.add('hidden');

      const canvas2d = document.getElementById('gameCanvas');
      if (canvas2d) canvas2d.classList.remove('hidden');

      const mainMenuScreen = document.getElementById('main-menu-screen');
      if (target === 'levels' && this.levelSelectScreen) {
        if (mainMenuScreen) {
          mainMenuScreen.style.display = 'none';
          mainMenuScreen.classList.add('hidden');
        }
        this.levelSelectScreen.style.display = 'flex';
        this.levelSelectScreen.classList.remove('hidden');
      } else {
        if (this.levelSelectScreen) {
          this.levelSelectScreen.style.display = 'none';
          this.levelSelectScreen.classList.add('hidden');
        }
        if (mainMenuScreen) {
          mainMenuScreen.style.display = 'flex';
          mainMenuScreen.classList.remove('hidden');
        }
      }
      window.dispatchEvent(new CustomEvent('funrun3d:exit', { detail: { target } }));
    }

    setPlayerAnimal(animal) {
      this.selectedAnimal = animal;
      if (this.player) {
        this.player.animal = animal;
        this.player.buildAnimalModel();
      }
    }
  }

  // Global Engine Instance
  window.funRun3D = new FunRun3DEngine();
})();
