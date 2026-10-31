// ACE FUN RUN - Browser Edition Game Engine
// Reverse-engineered Solar2D / Corona SDK Physics & Sprites from ACE FUN RUN.apk

(async function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const gameContainer = document.getElementById('game-container');

  // Virtual Game Resolution (Logical canvas size)
  const VIEW_W = 960;
  const VIEW_H = 540;

  // High-DPI Crisp Resolution Scaling
  function updateCanvasResolution() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(VIEW_W * dpr);
    canvas.height = Math.round(VIEW_H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  updateCanvasResolution();
  window.addEventListener('resize', updateCanvasResolution);
  window.addEventListener('orientationchange', updateCanvasResolution);

  // DOM Elements - Menus & Modals
  const mainMenuScreen = document.getElementById('main-menu-screen');
  const mainPlayBtn = document.getElementById('main-play-btn');
  const menuSettingsBtn = document.getElementById('menu-settings-btn');
  const menuRankingBtn = document.getElementById('menu-ranking-btn');
  const menuTutorialBtn = document.getElementById('menu-tutorial-btn');
  const menuCharacterBtn = document.getElementById('menu-character-btn');

  const modeSelectScreen = document.getElementById('mode-select-screen');
  const modePracticeBtn = document.getElementById('mode-practice-btn');
  const modeQuickplayBtn = document.getElementById('mode-quickplay-btn');
  const modeFriendsBtn = document.getElementById('mode-friends-btn');
  const modeHomeBtn = document.getElementById('mode-home-btn');

  const powerupsGuideModal = document.getElementById('powerups-guide-modal');
  const guideCloseBtn = document.getElementById('guide-close-btn');

  const characterModal = document.getElementById('character-modal');
  const charCloseBtn = document.getElementById('char-close-btn');
  const charConfirmBtn = document.getElementById('char-confirm-btn');
  const charChoices = document.querySelectorAll('.char-choice');

  const settingsModal = document.getElementById('settings-modal');
  const settingsCloseBtn = document.getElementById('settings-close-btn');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const settingsFullscreenBtn = document.getElementById('settings-fullscreen-btn');

  const rankingModal = document.getElementById('ranking-modal');
  const rankingCloseBtn = document.getElementById('ranking-close-btn');

  // DOM Elements - In-Game HUD
  const uiOverlay = document.getElementById('ui-overlay');
  const hudExitBtn = document.getElementById('hud-exit-btn');
  const rankDisplay = document.getElementById('rank-display');
  const speedDisplay = document.getElementById('speed-display');
  const powerupBtn = document.getElementById('powerup-btn');
  const powerupIcon = document.getElementById('powerup-icon');
  const powerupLabel = document.getElementById('powerup-label');
  const jumpBtn = document.getElementById('jump-btn');
  const countdownDisplay = document.getElementById('countdown-display');
  const resultsScreen = document.getElementById('results-screen');
  const resultsList = document.getElementById('results-list');
  const restartBtn = document.getElementById('restart-btn');
  const resultsMenuBtn = document.getElementById('results-menu-btn');
  const bloodOverlay = document.getElementById('blood-overlay');
  const markerPlayer = document.getElementById('marker-player');
  const markerBot1 = document.getElementById('marker-bot1');
  const markerBot2 = document.getElementById('marker-bot2');
  const markerBot3 = document.getElementById('marker-bot3');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  // Enforce Clean Initial Screen Visibility
  if (resultsScreen) {
    resultsScreen.style.display = 'none';
    resultsScreen.classList.add('hidden');
  }
  if (uiOverlay) {
    uiOverlay.style.display = 'none';
    uiOverlay.classList.add('hidden');
  }
  if (modeSelectScreen) {
    modeSelectScreen.style.display = 'none';
    modeSelectScreen.classList.add('hidden');
  }
  if (mainMenuScreen) {
    mainMenuScreen.style.display = 'flex';
    mainMenuScreen.classList.remove('hidden');
  }

  // Game Constants from Solar2D player.lu & gamePlay.lu
  const TILE_W = 80;
  const TILE_H = 50;
  const GRAVITY = 980;
  const DEFAULT_TOP_SPEED = 350;
  const ACCELERATE_X = 260;
  const JUMP_FORCE = -530;
  const RESPAWN_DELAY = 2.2;

  // Selected Player Character
  let selectedAnimal = 'bear';

  // Sound Engine (Web Audio API)
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.buffers = {};
      this.soundFiles = {
        jump: 'assets/sound/sfx_jump.wav',
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
        countdown: 'assets/sound/sfx_countdown.wav',
        start: 'assets/sound/sfx_start.wav',
        coins: 'assets/sound/sfx_coins.wav',
        bounce: 'assets/sound/sfx_bounce_activate.wav',
        bounce_act: 'assets/sound/sfx_bounce_activate.wav',
        bounce_hit: 'assets/sound/sfx_bounce_hit.wav',
        armor_act: 'assets/sound/sfx_armor_activate.wav',
        magnet_act: 'assets/sound/sfx_magnet_activate.wav',
        laser: 'assets/sound/sfx_laser.wav'
      };
    }

    init() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.loadAll();
      } else if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    async loadAll() {
      for (const [key, url] of Object.entries(this.soundFiles)) {
        try {
          const resp = await fetch(url);
          const arrayBuf = await resp.arrayBuffer();
          this.buffers[key] = await this.ctx.decodeAudioData(arrayBuf);
        } catch (e) {
          console.warn('Sound load failed:', key, e);
        }
      }
    }

    play(name) {
      if (!this.enabled || !this.ctx || !this.buffers[name]) return;
      try {
        const src = this.ctx.createBufferSource();
        src.buffer = this.buffers[name];
        src.connect(this.ctx.destination);
        src.start(0);
      } catch (e) {}
    }
  }

  const sounds = new SoundManager();

  // Asset Image Cache
  const images = {};
  function loadImage(src) {
    if (images[src]) return images[src];
    const img = new Image();
    img.src = src;
    images[src] = img;
    return img;
  }

  // Preload Backgrounds & Tiles
  loadImage('assets/images/map/background/forest/bkg_day.png');
  loadImage('assets/images/map/background/forest/bkg_mountains.png');
  loadImage('assets/images/map/element/forest/crate.png');
  loadImage('assets/images/map/element/forest/Goal.png');

  // Preload Power-Up graphics
  loadImage('assets/images/game/powerup/blade/blade.png');
  loadImage('assets/images/game/powerup/blade/blade_blood.png');
  loadImage('assets/images/game/powerup/trap/sprite.png');
  loadImage('assets/images/game/powerup/lightning/lightningBoltSprite.png');
  loadImage('assets/images/game/powerup/lightning/cloudTop.png');
  loadImage('assets/images/game/powerup/lightning/cloudBottom.png');
  loadImage('assets/images/game/powerup/shield/sprite.png');
  loadImage('assets/images/game/powerup/blade/icon.png');
  loadImage('assets/images/game/powerup/trap/icon.png');
  loadImage('assets/images/game/powerup/lightning/icon.png');
  loadImage('assets/images/game/powerup/speed/icon.png');
  loadImage('assets/images/game/powerup/shield/icon.png');
  loadImage('assets/images/game/powerup/armor/icon.png');
  loadImage('assets/images/game/powerup/jump/icon.png');
  loadImage('assets/images/game/powerup/magnet/icon.png');
  loadImage('assets/images/game/powerup/bounceTrap/icon.png');
  loadImage('assets/images/game/powerup/bounceTrap/sprite.png');
  loadImage('assets/images/map/element/forest/Jump1.png');

  // Decompiled 12-frame spring boxing glove punch animation from bounceTrapSprite.lu
  const BOUNCE_TRAP_FRAMES = [
    { tx: 112, ty: 226, tw: 53, th: 54, cx: 64, cy: 26, cw: 53, ch: 54 }, // Frame 0: closed present box
    { tx: 2, ty: 170, tw: 71, th: 54, cx: 46, cy: 26, cw: 71, ch: 54 },   // Frame 1: box begins opening
    { tx: 115, ty: 114, tw: 87, th: 54, cx: 30, cy: 26, cw: 87, ch: 54 },  // Frame 2: spring emerges
    { tx: 2, ty: 114, tw: 111, th: 54, cx: 6, cy: 26, cw: 111, ch: 54 },   // Frame 3: glove springs out
    { tx: 121, ty: 2, tw: 117, th: 54, cx: 0, cy: 26, cw: 117, ch: 54 },    // Frame 4: FULL PUNCH!
    { tx: 2, ty: 2, tw: 117, th: 54, cx: 0, cy: 26, cw: 117, ch: 54 },      // Frame 5: peak extension
    { tx: 119, ty: 58, tw: 115, th: 54, cx: 2, cy: 26, cw: 115, ch: 54 },   // Frame 6: rebound
    { tx: 2, ty: 58, tw: 115, th: 54, cx: 2, cy: 26, cw: 115, ch: 54 },     // Frame 7: recoil
    { tx: 75, ty: 170, tw: 65, th: 54, cx: 52, cy: 26, cw: 65, ch: 54 },   // Frame 8: spring retracts
    { tx: 142, ty: 170, tw: 59, th: 54, cx: 58, cy: 26, cw: 59, ch: 54 },  // Frame 9: glove returning
    { tx: 57, ty: 226, tw: 53, th: 54, cx: 64, cy: 26, cw: 53, ch: 54 },   // Frame 10: closing lid
    { tx: 2, ty: 226, tw: 53, th: 54, cx: 64, cy: 26, cw: 53, ch: 54 }     // Frame 11: closed
  ];
  loadImage('assets/images/game/powerup/ninja/icon.png');

  // Preload Avatar Multi-Layer Sprites
  const ALL_ANIMALS = ['bear', 'fox', 'beaver', 'baldeagle'];
  for (const a of ALL_ANIMALS) {
    loadImage(`assets/images/game/avatar/${a}BodySprite.png`);
    loadImage(`assets/images/game/accessory/hat/${a}/${a}HeadSprite.png`);
    loadImage(`assets/images/game/accessory/boots/${a}Feet.png`);
  }

  // Load Map, Avatar Sprites & Box2D Tile Shapes JSON
  let mapData = null;
  let avatarSprites = null;
  let tileShapes = null;
  try {
    const [mResp, aResp, sResp] = await Promise.all([
      fetch('sunset_valley.json'),
      fetch('avatar_sprites.json'),
      fetch('tile_shapes.json')
    ]);
    mapData = await mResp.json();
    avatarSprites = await aResp.json();
    tileShapes = await sResp.json();
  } catch (err) {
    console.error('Failed to load JSON data:', err);
  }

  const GOAL_X = 23635;
  const WORLD_WIDTH = mapData ? mapData.cols * TILE_W : 24720;
  const WORLD_HEIGHT = mapData ? mapData.rows * TILE_H : 900;

  // 10 Authentic Powerup definitions matching the tutorial guide
  const POWERUPS = [
    { id: 1, name: 'Sawblade', icon: 'assets/images/game/powerup/blade/icon.png', sfx: 'blade_act' },
    { id: 2, name: 'Bear Trap', icon: 'assets/images/game/powerup/trap/icon.png', sfx: 'trap_act' },
    { id: 3, name: 'Lightning', icon: 'assets/images/game/powerup/lightning/icon.png', sfx: 'lightning_act' },
    { id: 4, name: 'Speed Boost', icon: 'assets/images/game/powerup/speed/icon.png', sfx: 'speed_act' },
    { id: 5, name: 'Shield', icon: 'assets/images/game/powerup/shield/icon.png', sfx: 'shield_act' },
    { id: 6, name: 'Heart Armor', icon: 'assets/images/game/powerup/armor/icon.png', sfx: 'armor_act' },
    { id: 7, name: 'Rocket Jump', icon: 'assets/images/game/powerup/jump/icon.png', sfx: 'jump' },
    { id: 8, name: 'Magnet', icon: 'assets/images/game/powerup/magnet/icon.png', sfx: 'magnet_act' },
    { id: 9, name: 'Punch-in-Box', icon: 'assets/images/game/powerup/bounceTrap/icon.png', sfx: 'bounce_act' },
    { id: 10, name: 'Katana Slash', icon: 'assets/images/game/powerup/ninja/icon.png', sfx: 'laser' }
  ];

  // Particle System
  const particles = [];
  function spawnBlood(x, y, count = 35) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y: y - 10,
        vx: (Math.random() - 0.5) * 450,
        vy: (Math.random() - 0.8) * 480,
        size: Math.random() * 6 + 3,
        color: Math.random() > 0.3 ? '#cc0000' : '#880000',
        life: 1.0,
        decay: Math.random() * 0.7 + 0.6
      });
    }
  }

  function spawnSpeedFlame(x, y) {
    for (let i = 0; i < 4; i++) {
      particles.push({
        x: x - 14,
        y: y - 14 + (Math.random() - 0.5) * 10,
        vx: -(Math.random() * 220 + 120),
        vy: (Math.random() - 0.5) * 50,
        size: Math.random() * 7 + 4,
        color: i % 2 === 0 ? '#ffea00' : '#ff3d00',
        life: 0.35,
        decay: 2.2
      });
    }
  }

  function spawnSparks(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y: y - 15,
        vx: (Math.random() - 0.5) * 400,
        vy: (Math.random() - 0.5) * 400,
        size: Math.random() * 5 + 2,
        color: Math.random() > 0.5 ? '#00e5ff' : '#ffffff',
        life: 0.45,
        decay: 2.0
      });
    }
  }

  // Active World Entities
  let activePowerupItems = [];
  let crates = [];

  // Global Storm Effect for Lightning
  let stormEffect = {
    active: false,
    timer: 0,
    strikeTimer: 0,
    targets: []
  };

  // Fullscreen Blood Flash Timer
  let bloodFlashTimer = 0;

  // Initialize Crates from mapData
  if (mapData) {
    for (let r = 0; r < mapData.rows; r++) {
      for (let c = 0; c < mapData.cols; c++) {
        let cell = mapData.grid[r][c];
        let tileIds = Array.isArray(cell) ? cell : [cell];
        for (let tid of tileIds) {
          const tname = mapData.tileNames[tid - 1];
          if (tname === 'powerUp') {
            crates.push({
              x: c * TILE_W + TILE_W / 2,
              y: r * TILE_H + TILE_H / 2,
              collected: false,
              respawnTimer: 0
            });
          }
        }
      }
    }
  }

  // Solid Tile Filter: Ignore decorative background trees, bushes, vegetation & structures
  function isSolidTile(tname) {
    if (!tname || tname === 'powerUp' || tname === 'Goal' || tname === 'null') return false;
    if (tname.startsWith('veg') || tname.startsWith('Rveg') ||
        tname.startsWith('tre') || tname.startsWith('Rtre') ||
        tname.startsWith('busk') || tname.startsWith('Rbusk') ||
        tname.startsWith('3H1') || tname.startsWith('R3H1')) {
      return false;
    }
    return true;
  }

  // Exact Box2D Polygon Surface Calculation from APK fixtures
  function getSurfaceYFromPolygon(poly, localX80) {
    let minY = null;
    const numPts = poly.length / 2;
    for (let i = 0; i < numPts; i++) {
      const x1 = poly[i * 2];
      const y1 = poly[i * 2 + 1];
      const nextIdx = (i + 1) % numPts;
      const x2 = poly[nextIdx * 2];
      const y2 = poly[nextIdx * 2 + 1];

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);

      if (localX80 >= minX - 0.001 && localX80 <= maxX + 0.001 && Math.abs(x2 - x1) > 0.001) {
        const t = (localX80 - x1) / (x2 - x1);
        const y = y1 + t * (y2 - y1);
        if (minY === null || y < minY) minY = y;
      }
    }
    return minY;
  }

  function isPointSolid(worldX, worldY) {
    if (!mapData || !tileShapes) return false;
    const col = Math.floor(worldX / TILE_W);
    const row = Math.floor(worldY / TILE_H);
    if (col < 0 || col >= mapData.cols || row < 0 || row >= mapData.rows) return false;
    const cell = mapData.grid[row][col];
    if (!cell || cell === 1) return false;
    const tileIds = Array.isArray(cell) ? cell : [cell];
    const localX80 = (worldX % TILE_W) - 40;
    const localY50 = (worldY % TILE_H) - 25;
    for (const tid of tileIds) {
      let tname = mapData.tileNames[tid - 1];
      if (!isSolidTile(tname)) continue;
      if (tname === '1Av') tname = '1Av1';
      if (tname === '0Av') tname = '0Av1';
      if (tname === '0Dv') tname = '0Dv1';
      if (tname === '0Fv') tname = '0Fv1';
      if (tname === '0Bv') tname = '0Bv1';
      if (tname === 'R0Dv') tname = 'R0Dv1';
      const polys = tileShapes[tname] || (tname.startsWith('R') ? tileShapes[tname.slice(1)] : null);
      if (!polys) return true;
      for (const poly of polys) {
        let testPoly = poly;
        if (tname.startsWith('R') && !tileShapes[tname]) {
          testPoly = [];
          for (let i = 0; i < poly.length; i += 2) testPoly.push(-poly[i], poly[i + 1]);
        }
        let inside = true;
        const numPts = testPoly.length / 2;
        for (let i = 0; i < numPts; i++) {
          const x1 = testPoly[i * 2], y1 = testPoly[i * 2 + 1];
          const nextIdx = (i + 1) % numPts;
          const x2 = testPoly[nextIdx * 2], y2 = testPoly[nextIdx * 2 + 1];
          const cross = (x2 - x1) * (localY50 - y1) - (y2 - y1) * (localX80 - x1);
          if (cross < -0.001) { inside = false; break; }
        }
        if (inside) return true;
      }
    }
    return false;
  }

  function getSurfacesAt(worldX) {
    if (!mapData || !tileShapes) return [350];
    const col = Math.floor(worldX / TILE_W);
    const localX80 = (worldX % TILE_W) - 40;
    if (col < 0 || col >= mapData.cols) return [];

    const surfaces = [];
    for (let r = 0; r < mapData.rows; r++) {
      const cell = mapData.grid[r][col];
      if (!cell || cell === 1) continue;
      const tileIds = Array.isArray(cell) ? cell : [cell];
      for (const tid of tileIds) {
        let tname = mapData.tileNames[tid - 1];
        if (!isSolidTile(tname)) continue;
        if (tname === '1Av') tname = '1Av1';
        if (tname === '0Av') tname = '0Av1';
        if (tname === '0Dv') tname = '0Dv1';
        if (tname === '0Fv') tname = '0Fv1';
        if (tname === '0Bv') tname = '0Bv1';
        if (tname === 'R0Dv') tname = 'R0Dv1';

        const polys = tileShapes[tname] || (tname.startsWith('R') ? tileShapes[tname.slice(1)] : null);
        if (!polys) continue;
        const tileCenterY = r * TILE_H + 25;
        for (const poly of polys) {
          let testPoly = poly;
          if (tname.startsWith('R') && !tileShapes[tname]) {
            testPoly = [];
            for (let i = 0; i < poly.length; i += 2) testPoly.push(-poly[i], poly[i + 1]);
          }
          const py = getSurfaceYFromPolygon(testPoly, localX80);
          if (py !== null) {
            surfaces.push(tileCenterY + py);
          }
        }
      }
    }
    return surfaces.filter(s => !isPointSolid(worldX, s - 6)).sort((a, b) => a - b);
  }

  const bouncePads = [
    { x: 173 * 80 + 40, y: 500, radius: 55, force: -900, boostVx: 400, animTimer: 0 },
    { x: 224 * 80 + 40, y: 700, radius: 60, force: -1220, boostVx: 480, animTimer: 0 }
  ];

  // Authentic terrain height supporting runner's feet
  function getGroundUnder(worldX, currentFeetY = 350) {
    const surfs = getSurfacesAt(worldX);
    if (surfs.length === 0) return null;

    // 1. Connected slope (running up to 52px step up for 1-tile ledges, down to 55px slope down)
    let best = null;
    let minDiff = Infinity;
    for (const s of surfs) {
      const diff = s - currentFeetY;
      if (diff >= -52 && diff <= 55) {
        if (Math.abs(diff) < minDiff) {
          minDiff = Math.abs(diff);
          best = s;
        }
      }
    }
    if (best !== null) return best;

    // 2. Nearest solid surface below current feet
    for (const s of surfs) {
      if (s >= currentFeetY - 15) {
        return s;
      }
    }

    return surfs[surfs.length - 1];
  }

  function getTileInfoAt(worldX, worldY) {
    if (!mapData) return {};
    const col = Math.floor(worldX / TILE_W);
    const row = Math.floor(worldY / TILE_H);
    if (col < 0 || col >= mapData.cols || row < 0 || row >= mapData.rows) return {};

    const cell = mapData.grid[row][col];
    const tid = Array.isArray(cell) ? cell[0] : cell;
    const tname = mapData.tileNames[tid - 1] || '';

    return {
      name: tname,
      bounce: tname.includes('gele') || tname.includes('Jump'),
      boost: tname.includes('is') || tname.includes('Slide')
    };
  }

  // Draw Avatar Layer from Sprite Sheet
  function drawAvatarLayer(ctx, img, frames, frameIdx, originX, originY) {
    if (!img || !img.complete || !frames || frames.length === 0) return;
    const f = frames[frameIdx % frames.length];
    const { texture, color } = f;
    const dx = color.x - originX;
    const dy = color.y - originY;
    ctx.drawImage(img, texture.x, texture.y, texture.w, texture.h, dx, dy, color.w, color.h);
  }

  // Character definitions with Multi-Layer Avatar Sprites
  class Character {
    constructor(id, name, isPlayer, animal, startX, startY) {
      this.id = id;
      this.name = name;
      this.isPlayer = isPlayer;
      this.animal = animal;

      this.bodyImg = loadImage(`assets/images/game/avatar/${animal}BodySprite.png`);
      this.headImg = loadImage(`assets/images/game/accessory/hat/${animal}/${animal}HeadSprite.png`);
      this.feetImg = loadImage(`assets/images/game/accessory/boots/${animal}Feet.png`);

      this.x = startX;
      this.y = startY;
      this.vx = 0;
      this.vy = 0;
      this.onGround = true;
      this.coyoteTimer = 0.15;
      this.jumpBuffer = 0;
      this.dead = false;
      this.deathTimer = 0;
      this.invulnerableTimer = 0;
      this.shield = false;
      this.shieldTimer = 0;
      this.hasArmor = false;
      this.speedBoostTimer = 0;
      this.powerup = null;

      // Roulette Rolling State
      this.rouletteTimer = 0;
      this.rouletteTick = 0;
      this.rouletteCandidate = null;

      this.animFrame = 0;
      this.animTime = 0;
      this.finished = false;
      this.finishTime = 0;
      this.botJumpCooldown = 0;
      this.rank = 1;

      // Safe Respawn Anchor
      this.safeX = startX;
      this.safeY = startY;
    }

    setAnimal(newAnimal) {
      this.animal = newAnimal;
      this.bodyImg = loadImage(`assets/images/game/avatar/${newAnimal}BodySprite.png`);
      this.headImg = loadImage(`assets/images/game/accessory/hat/${newAnimal}/${newAnimal}HeadSprite.png`);
      this.feetImg = loadImage(`assets/images/game/accessory/boots/${newAnimal}Feet.png`);
    }

    jump() {
      if (this.dead) return false;
      if (this.onGround || this.coyoteTimer > 0) {
        this.vy = JUMP_FORCE;
        this.onGround = false;
        this.coyoteTimer = 0;
        this.jumpBuffer = 0;
        if (this.isPlayer) sounds.play('jump');
        return true;
      }
      this.jumpBuffer = 0.18;
      return false;
    }

    usePowerUp(racers) {
      if (this.dead || !this.powerup || this.rouletteTimer > 0) return;
      const p = this.powerup;
      this.powerup = null;

      if (this.isPlayer) {
        sounds.play(p.sfx);
        updatePowerupHUD(null);
      }

      if (p.id === 1) { // Sawblade
        activePowerupItems.push({
          type: 'blade',
          ownerId: this.id,
          x: this.x + 28,
          y: this.y - 12,
          vx: 650,
          rotation: 0,
          hit: false,
          life: 6.0
        });
      } else if (p.id === 2) { // Bear Trap
        activePowerupItems.push({
          type: 'trap',
          ownerId: this.id,
          x: this.x - 28,
          y: this.y,
          snapped: false,
          snapTimer: 0,
          life: 20.0
        });
      } else if (p.id === 3) { // Lightning Storm
        const opponentsAhead = racers.filter(r => r.id !== this.id && !r.dead && r.x > this.x - 100);
        const targets = opponentsAhead.length > 0 ? opponentsAhead : racers.filter(r => r.id !== this.id && !r.dead);
        stormEffect.active = true;
        stormEffect.timer = 1.6;
        stormEffect.strikeTimer = 0.45;
        stormEffect.targets = targets;
      } else if (p.id === 4) { // Speed Boost (Paw)
        this.speedBoostTimer = 3.5;
      } else if (p.id === 5) { // Shield (Invincible for 6 sec)
        this.shield = true;
        this.shieldTimer = 6.0;
      } else if (p.id === 6) { // Heart Armor (Absorbs one hit)
        this.hasArmor = true;
        spawnSparks(this.x, this.y - 20, 20);
      } else if (p.id === 7) { // Rocket Jump (Jump high)
        this.vy = -820;
        this.onGround = false;
        this.coyoteTimer = 0;
        sounds.play('jump');
        for (let i = 0; i < 14; i++) {
          particles.push({
            x: this.x + (Math.random() - 0.5) * 16,
            y: this.y + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 100,
            vy: Math.random() * 80 + 40,
            size: Math.random() * 5 + 4,
            color: '#ffffff',
            life: 1.0,
            decay: 2.5
          });
        }
      } else if (p.id === 8) { // Magnet (Pull opponent ahead)
        const opponentsAhead = racers.filter(r => r.id !== this.id && !r.dead && r.x > this.x).sort((a, b) => a.x - b.x);
        if (opponentsAhead.length > 0) {
          const target = opponentsAhead[0];
          target.vx = Math.max(60, target.vx * 0.4);
          target.x = Math.max(this.x + 35, target.x - 220);
          spawnSparks(target.x, target.y - 20, 22);
          this.vx = Math.min(DEFAULT_TOP_SPEED * 1.45, this.vx + 140);
        }
      } else if (p.id === 9) { // Punch-in-a-Box (Bounce Trap)
        activePowerupItems.push({
          type: 'bounceTrap',
          ownerId: this.id,
          x: this.x - 28,
          y: this.y,
          triggered: false,
          triggerTimer: 0,
          animFrame: 0,
          life: 25.0
        });
      } else if (p.id === 10) { // Katana Slash (Target Leader)
        const leader = racers.filter(r => r.id !== this.id && !r.dead).sort((a, b) => b.x - a.x)[0];
        if (leader) {
          sounds.play('laser');
          spawnSparks(leader.x, leader.y - 20, 30);
          leader.hit('ninja');
        }
      }
    }

    hit(cause = 'generic') {
      if (this.dead || this.invulnerableTimer > 0) return;
      if (this.shield) {
        this.shield = false;
        sounds.play('shield_act');
        spawnSparks(this.x, this.y - 15, 20);
        return;
      }
      if (this.hasArmor) {
        this.hasArmor = false;
        sounds.play('shield_act');
        spawnSparks(this.x, this.y - 15, 25);
        return;
      }

      this.dead = true;
      this.deathTimer = RESPAWN_DELAY;
      this.speedBoostTimer = 0;
      sounds.play('blood');
      spawnBlood(this.x, this.y, 40);

      if (this.isPlayer) {
        bloodFlashTimer = 1.5;
        if (bloodOverlay) bloodOverlay.classList.remove('hidden');
      }
    }

    update(dt, racers) {
      if (this.invulnerableTimer > 0) {
        this.invulnerableTimer -= dt;
      }
      if (this.shield && this.shieldTimer > 0) {
        this.shieldTimer -= dt;
        if (this.shieldTimer <= 0) {
          this.shield = false;
        }
      }

      // Handle Death & Respawn
      if (this.dead) {
        this.deathTimer -= dt;
        if (this.deathTimer <= 0) {
          this.dead = false;
          this.x = Math.max(80, this.safeX - 35);
          this.y = this.safeY;
          this.vx = DEFAULT_TOP_SPEED * 0.45;
          this.vy = 0;
          this.invulnerableTimer = 1.5;
        }
        return;
      }

      // Handle Crate Roulette Roll
      if (this.rouletteTimer > 0) {
        this.rouletteTimer -= dt;
        this.rouletteTick -= dt;
        if (this.rouletteTick <= 0) {
          this.rouletteTick = 0.06;
          this.rouletteCandidate = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
          if (this.isPlayer) {
            powerupIcon.src = this.rouletteCandidate.icon;
          }
        }
        if (this.rouletteTimer <= 0) {
          this.powerup = this.rouletteCandidate;
          if (this.isPlayer) {
            updatePowerupHUD(this.powerup);
          }
        }
      }

      // Jump Buffer
      if (this.jumpBuffer > 0) {
        this.jumpBuffer -= dt;
        if (this.onGround) {
          this.jump();
          this.jumpBuffer = 0;
        }
      }
      if (this.coyoteTimer > 0) {
        this.coyoteTimer -= dt;
      }

      // Horizontal Acceleration & Speed Boost
      let targetSpeed = DEFAULT_TOP_SPEED;
      if (this.speedBoostTimer > 0) {
        this.speedBoostTimer -= dt;
        targetSpeed *= 1.65;
        spawnSpeedFlame(this.x, this.y);
      }

      if (this.vx < targetSpeed) {
        this.vx = Math.min(targetSpeed, this.vx + ACCELERATE_X * dt * 2.8);
      } else if (this.vx > targetSpeed) {
        this.vx = Math.max(targetSpeed, this.vx - ACCELERATE_X * dt * 1.5);
      }

      // Check bounce pads
      for (const bp of bouncePads) {
        if (Math.abs(this.x - bp.x) < bp.radius && Math.abs(this.y - bp.y) < 38) {
          this.vy = bp.force;
          if (bp.boostVx) this.vx = Math.max(this.vx, bp.boostVx);
          this.onGround = false;
          this.coyoteTimer = 0;
          bp.animTimer = 0.35;
          sounds.play('jump');
          spawnSparks(bp.x, bp.y - 10, 20);
        }
      }

      // Bot AI
      if (!this.isPlayer) {
        this.botAI(dt, racers);
      }

      // Horizontal movement & wall check
      const nextX = this.x + this.vx * dt;
      // Step up check: only stop forward motion if both chest & head hit a wall higher than climbable 50px step
      const wallAhead = isPointSolid(nextX + 12, this.y - 30) && isPointSolid(nextX + 12, this.y - 45);
      if (wallAhead) {
        this.vx = 0;
      } else {
        this.x = nextX;
      }

      if (this.onGround) {
        const gY = getGroundUnder(this.x, this.y);
        if (gY !== null && gY >= this.y - 52 && gY <= this.y + 55) {
          this.y = gY;
          this.vy = 0;
          this.safeX = this.x;
          this.safeY = this.y;
        } else {
          this.onGround = false;
          this.vy = 0;
        }
      } else {
        this.vy += GRAVITY * dt;
        if (this.vy > 950) this.vy = 950;
        const prevY = this.y;
        const nextY = this.y + this.vy * dt;
        const surfs = getSurfacesAt(this.x);
        let landed = false;
        if (this.vy >= 0) {
          for (const s of surfs) {
            if (s >= prevY - 14 && s <= nextY + 10) {
              this.y = s;
              this.vy = 0;
              this.onGround = true;
              this.coyoteTimer = 0.15;
              this.safeX = this.x;
              this.safeY = this.y;
              landed = true;
              break;
            }
          }
        }
        if (!landed) {
          this.y = nextY;
        }
      }

      // Pit Fall Check (Below bottom track level)
      if (this.y > 850) {
        this.hit('pit');
        return;
      }

      // Collect Crates
      for (const c of crates) {
        if (!c.collected && Math.hypot(this.x - c.x, (this.y - 25) - c.y) < 48) {
          c.collected = true;
          c.respawnTimer = 6.0;
          spawnSparks(c.x, c.y, 20);
          if (!this.powerup && this.rouletteTimer <= 0) {
            this.rouletteTimer = 0.8;
            this.rouletteTick = 0.05;
            if (this.isPlayer) {
              sounds.play('pickup');
              powerupBtn.classList.add('rolling');
              powerupBtn.classList.remove('ready');
            }
          }
        }
      }

      // Finish Line Detection
      if (!this.finished && this.x >= GOAL_X) {
        this.finished = true;
        this.finishTime = performance.now();
        if (this.isPlayer) {
          sounds.play('coins');
          setTimeout(() => showResults(racers), 1000);
        }
      }

      // Animation Cycle
      if (this.onGround) {
        this.animTime += dt * (this.vx / 42);
        this.animFrame = Math.floor(this.animTime) % 7;
      } else {
        this.animFrame = 3; // jump frame
      }
    }

    botAI(dt, racers) {
      this.botJumpCooldown -= dt;
      if (this.botJumpCooldown <= 0 && this.onGround) {
        const isObstacleAhead = (isPointSolid(this.x + 35, this.y - 25) && isPointSolid(this.x + 35, this.y - 42));
        const surfsAhead = getSurfacesAt(this.x + 40);
        const isStepUpAhead = surfsAhead.some(s => s >= this.y - 65 && s < this.y - 10);
        if (isObstacleAhead || isStepUpAhead || this.vx < 110) {
          this.jump();
          this.botJumpCooldown = 0.45 + Math.random() * 0.3;
        }
      }

      if (this.powerup && Math.random() < 0.03) {
        this.usePowerUp(racers);
      }
    }

    draw(ctx, cameraX, cameraY) {
      if (this.dead) return;

      const renderX = this.x - cameraX;
      const renderY = this.y - cameraY;

      ctx.save();
      ctx.translate(renderX, renderY);

      // Invulnerability Blinking
      if (this.invulnerableTimer > 0 && Math.floor(performance.now() / 80) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Scale & Origin: Authentic Corona SDK composite alignment
      // Ground level is at y = 100 in 200x200 sprite space
      const anim = avatarSprites && avatarSprites[this.animal];
      if (anim) {
        const frameIdx = this.onGround ? (this.animFrame % 7) : 3;
        const scale = 0.28;
        ctx.scale(scale, scale);

        // 1. Draw Feet (bottom running layer: originY = 100 puts feet bottom on the ground)
        drawAvatarLayer(ctx, this.feetImg, anim.Feet, frameIdx, 100, 100);
        // 2. Draw Body (middle torso layer: originY = 100 reveals full belly, arms and body)
        drawAvatarLayer(ctx, this.bodyImg, anim.BodySprite, frameIdx, 100, 100);
        // 3. Draw Head (top face layer: originY = 150 sits chin right above chest)
        drawAvatarLayer(ctx, this.headImg, anim.HeadSprite, frameIdx, 100, 150);
      } else {
        // Fallback procedural avatar
        ctx.fillStyle = this.isPlayer ? '#ff9900' : '#4488ff';
        ctx.beginPath();
        ctx.arc(0, -22, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw Full-Sized Rotating Shield Bubble (enclosing the character)
      if (this.shield) {
        const shieldImg = images['assets/images/game/powerup/shield/sprite.png'];
        if (shieldImg && shieldImg.complete) {
          const sFrames = [272, 182, 92, 2];
          const sIdx = Math.floor(performance.now() * 0.012) % 4;
          const sy = sFrames[sIdx];
          ctx.save();
          ctx.fillStyle = 'rgba(0, 229, 255, 0.22)';
          ctx.beginPath();
          ctx.arc(renderX, renderY - 24, 34, 0, Math.PI * 2);
          ctx.fill();

          ctx.drawImage(shieldImg, 2, sy, 88, 88, renderX - 36, renderY - 60, 72, 72);
          ctx.restore();
        }
      }

      // Draw Floating Heart Armor
      if (this.hasArmor) {
        const heartImg = images['assets/images/game/powerup/armor/icon.png'];
        if (heartImg && heartImg.complete) {
          const hoverY = Math.sin(performance.now() * 0.007) * 4;
          ctx.drawImage(heartImg, renderX - 14, renderY - 68 + hoverY, 28, 28);
        }
      }

      // Floating Player Arrow Marker (matching Image 2)
      if (this.isPlayer) {
        ctx.save();
        ctx.translate(renderX, renderY - 55);
        ctx.fillStyle = '#00e676';
        ctx.strokeStyle = '#003300';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-7, -10);
        ctx.lineTo(7, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Player Name Tag
      ctx.save();
      ctx.translate(renderX, renderY - 62);
      ctx.font = "bold 13px 'Luckiest Guy', sans-serif";
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText(this.name, 0, 0);
      ctx.fillText(this.name, 0, 0);
      ctx.restore();
    }
  }

  function updatePowerupHUD(powerup) {
    if (powerup) {
      powerupIcon.src = powerup.icon;
      powerupBtn.classList.remove('rolling');
      powerupBtn.classList.add('ready');
      powerupLabel.textContent = '[X]';
    } else {
      powerupIcon.src = 'assets/images/transparent.png';
      powerupBtn.classList.remove('rolling');
      powerupBtn.classList.remove('ready');
      powerupLabel.textContent = '';
    }
  }

  // 4 Racers initialized directly on the grass running track (feet at 350)
  let racers = [
    new Character(1, 'You', true, selectedAnimal, 140, 350),
    new Character(2, 'Eagle', false, 'baldeagle', 100, 350),
    new Character(3, 'Beaver', false, 'beaver', 60, 350),
    new Character(4, 'Fox', false, 'fox', 20, 350)
  ];

  let player = racers[0];

  // Game States: 'main_menu', 'mode_select', 'countdown', 'racing', 'ended'
  let gameState = 'main_menu';
  let countdownTimer = 3.0;

  let cameraX = 0;
  let cameraY = 0;

  // Fullscreen Management
  function toggleFullscreen() {
    sounds.init();
    const container = document.getElementById('game-container') || document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  function updateFullscreenUI() {
    const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
    if (fullscreenBtn) {
      const text = fullscreenBtn.querySelector('.hud-text');
      if (text) text.textContent = isFs ? 'Fenster' : 'Vollbild';
    }
    if (settingsFullscreenBtn) {
      settingsFullscreenBtn.textContent = isFs ? 'FENSTER' : 'VOLLBILD';
    }
  }

  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });
  if (settingsFullscreenBtn) settingsFullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });

  // Sound Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      sounds.enabled = !sounds.enabled;
      soundToggleBtn.textContent = sounds.enabled ? 'AN' : 'AUS';
    });
  }

  // Game Selection Modal (Pocket Run vs Classic)
  const gameSelectScreen = document.getElementById('game-select-screen');
  const optPocketBtn = document.getElementById('opt-pocket-btn');
  const optClassicBtn = document.getElementById('opt-classic-btn');
  const gameSelectBackBtn = document.getElementById('game-select-back-btn');

  // Navigation: Main Menu -> Click PLAY -> Choose Pocket Run or Classic
  mainPlayBtn.addEventListener('click', () => {
    sounds.init();
    sounds.play('jump');
    mainMenuScreen.style.display = 'none';
    mainMenuScreen.classList.add('hidden');
    if (gameSelectScreen) {
      gameSelectScreen.style.display = 'flex';
      gameSelectScreen.classList.remove('hidden');
    } else {
      modeSelectScreen.style.display = 'flex';
      modeSelectScreen.classList.remove('hidden');
    }
    gameState = 'game_select';
  });

  // 1. Choose Classic (2D Original)
  if (optClassicBtn) {
    optClassicBtn.addEventListener('click', () => {
      sounds.play('jump');
      if (gameSelectScreen) {
        gameSelectScreen.style.display = 'none';
        gameSelectScreen.classList.add('hidden');
      }
      modeSelectScreen.style.display = 'flex';
      modeSelectScreen.classList.remove('hidden');
      gameState = 'mode_select';
    });
  }

  // 2. Choose Pocket Run (3D Edition)
  if (optPocketBtn) {
    optPocketBtn.addEventListener('click', () => {
      sounds.play('jump');
      if (gameSelectScreen) {
        gameSelectScreen.style.display = 'none';
        gameSelectScreen.classList.add('hidden');
      }
      if (levelSelect3dScreen) {
        levelSelect3dScreen.style.display = 'flex';
        levelSelect3dScreen.classList.remove('hidden');
      }
    });
  }

  // Back from Game Select to Main Menu
  if (gameSelectBackBtn) {
    gameSelectBackBtn.addEventListener('click', () => {
      sounds.play('jump');
      if (gameSelectScreen) {
        gameSelectScreen.style.display = 'none';
        gameSelectScreen.classList.add('hidden');
      }
      mainMenuScreen.style.display = 'flex';
      mainMenuScreen.classList.remove('hidden');
      gameState = 'main_menu';
    });
  }

  modeHomeBtn.addEventListener('click', () => {
    sounds.play('jump');
    modeSelectScreen.style.display = 'none';
    modeSelectScreen.classList.add('hidden');
    mainMenuScreen.style.display = 'flex';
    mainMenuScreen.classList.remove('hidden');
    gameState = 'main_menu';
  });

  function startRaceFlow() {
    sounds.init();
    mainMenuScreen.style.display = 'none';
    mainMenuScreen.classList.add('hidden');
    modeSelectScreen.style.display = 'none';
    modeSelectScreen.classList.add('hidden');
    resultsScreen.style.display = 'none';
    resultsScreen.classList.add('hidden');
    uiOverlay.style.display = 'flex';
    uiOverlay.classList.remove('hidden');
    resetRace();
    startCountdown();
  }

  modePracticeBtn.addEventListener('click', startRaceFlow);
  modeQuickplayBtn.addEventListener('click', startRaceFlow);
  modeFriendsBtn.addEventListener('click', startRaceFlow);

  // 3D POCKET RACER MODE INTEGRATION
  const top3dBtn = document.getElementById('top-3d-btn');
  const main3dBtn = document.getElementById('main-3d-btn');
  const mode3dSignpost = document.getElementById('mode-3d-signpost');
  const levelSelect3dScreen = document.getElementById('levelselect3d-screen');
  const btn3dStartTouch = document.getElementById('btn3d-start-touch');
  const btn3dCancel = document.getElementById('btn3d-cancel');
  const btn3dFullscreen = document.getElementById('btn3d-fullscreen');

  let selectedLevel3d = 1;

  function open3dLevelSelect() {
    sounds.init();
    sounds.play('jump');
    mainMenuScreen.style.display = 'none';
    mainMenuScreen.classList.add('hidden');
    modeSelectScreen.style.display = 'none';
    modeSelectScreen.classList.add('hidden');
    if (levelSelect3dScreen) {
      levelSelect3dScreen.style.display = 'flex';
      levelSelect3dScreen.classList.remove('hidden');
    }
  }

  if (top3dBtn) top3dBtn.addEventListener('click', open3dLevelSelect);
  if (main3dBtn) main3dBtn.addEventListener('click', open3dLevelSelect);
  if (mode3dSignpost) mode3dSignpost.addEventListener('click', open3dLevelSelect);

  const lvlCards = [
    document.getElementById('card3d-lvl1'),
    document.getElementById('card3d-lvl2'),
    document.getElementById('card3d-lvl3')
  ];
  lvlCards.forEach((card, idx) => {
    if (card) {
      card.addEventListener('click', () => {
        sounds.play('jump');
        lvlCards.forEach(c => c && c.classList.remove('selected'));
        card.classList.add('selected');
        selectedLevel3d = idx + 1;
      });
    }
  });

  if (btn3dStartTouch) {
    btn3dStartTouch.addEventListener('click', () => {
      sounds.init();
      sounds.play('start');
      if (levelSelect3dScreen) {
        levelSelect3dScreen.style.display = 'none';
        levelSelect3dScreen.classList.add('hidden');
      }
      canvas.classList.add('hidden');
      gameState = 'racing_3d';
      if (window.funRun3D) {
        window.funRun3D.setPlayerAnimal(selectedAnimal);
        window.funRun3D.startRace('touch', selectedLevel3d);
      }
    });
  }

  if (btn3dCancel) {
    btn3dCancel.addEventListener('click', () => {
      sounds.play('jump');
      if (levelSelect3dScreen) {
        levelSelect3dScreen.style.display = 'none';
        levelSelect3dScreen.classList.add('hidden');
      }
      mainMenuScreen.style.display = 'flex';
      mainMenuScreen.classList.remove('hidden');
      gameState = 'main_menu';
    });
  }

  if (btn3dFullscreen) {
    btn3dFullscreen.addEventListener('click', toggleFullscreen);
  }

  // In-game Exit Button (returns to main menu)
  hudExitBtn.addEventListener('click', () => {
    sounds.play('jump');
    gameState = 'main_menu';
    uiOverlay.style.display = 'none';
    uiOverlay.classList.add('hidden');
    resultsScreen.style.display = 'none';
    resultsScreen.classList.add('hidden');
    modeSelectScreen.style.display = 'none';
    modeSelectScreen.classList.add('hidden');
    mainMenuScreen.style.display = 'flex';
    mainMenuScreen.classList.remove('hidden');
    resetRace();
  });

  resultsMenuBtn.addEventListener('click', () => {
    sounds.play('jump');
    resultsScreen.style.display = 'none';
    resultsScreen.classList.add('hidden');
    uiOverlay.style.display = 'none';
    uiOverlay.classList.add('hidden');
    modeSelectScreen.style.display = 'none';
    modeSelectScreen.classList.add('hidden');
    mainMenuScreen.style.display = 'flex';
    mainMenuScreen.classList.remove('hidden');
    gameState = 'main_menu';
  });

  // Modals Management
  function closeGuideModal() {
    sounds.play('jump');
    powerupsGuideModal.style.display = 'none';
    powerupsGuideModal.classList.add('hidden');
  }

  menuTutorialBtn.addEventListener('click', () => {
    sounds.play('jump');
    powerupsGuideModal.style.display = 'flex';
    powerupsGuideModal.classList.remove('hidden');
  });
  guideCloseBtn.addEventListener('click', closeGuideModal);
  const guideBottomCloseBtn = document.getElementById('guide-bottom-close-btn');
  if (guideBottomCloseBtn) guideBottomCloseBtn.addEventListener('click', closeGuideModal);
  powerupsGuideModal.addEventListener('click', (e) => {
    if (e.target === powerupsGuideModal || e.target.closest('.guide-back-btn') || e.target.closest('.modal-close-btn')) {
      closeGuideModal();
    }
  });

  menuSettingsBtn.addEventListener('click', () => {
    sounds.play('jump');
    settingsModal.style.display = 'flex';
    settingsModal.classList.remove('hidden');
  });
  function closeSettingsModal() {
    settingsModal.style.display = 'none';
    settingsModal.classList.add('hidden');
  }
  settingsCloseBtn.addEventListener('click', closeSettingsModal);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettingsModal();
  });

  menuRankingBtn.addEventListener('click', () => {
    sounds.play('jump');
    rankingModal.style.display = 'flex';
    rankingModal.classList.remove('hidden');
  });
  function closeRankingModal() {
    rankingModal.style.display = 'none';
    rankingModal.classList.add('hidden');
  }
  rankingCloseBtn.addEventListener('click', closeRankingModal);
  rankingModal.addEventListener('click', (e) => {
    if (e.target === rankingModal) closeRankingModal();
  });

  menuCharacterBtn.addEventListener('click', () => {
    sounds.play('jump');
    characterModal.style.display = 'flex';
    characterModal.classList.remove('hidden');
  });
  charCloseBtn.addEventListener('click', () => {
    characterModal.style.display = 'none';
    characterModal.classList.add('hidden');
  });
  characterModal.addEventListener('click', (e) => {
    if (e.target === characterModal) {
      characterModal.style.display = 'none';
      characterModal.classList.add('hidden');
    }
  });

  charChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      charChoices.forEach(c => c.classList.remove('selected'));
      choice.classList.add('selected');
      selectedAnimal = choice.getAttribute('data-animal');
      player.setAnimal(selectedAnimal);
      if (window.funRun3D) window.funRun3D.setPlayerAnimal(selectedAnimal);
    });
  });

  charConfirmBtn.addEventListener('click', () => {
    characterModal.style.display = 'none';
    characterModal.classList.add('hidden');
  });

  // Action Inputs: Jump & Power-up
  function doJump() {
    sounds.init();
    if (gameState !== 'racing') return;
    player.jump();
    jumpBtn.classList.add('active');
    setTimeout(() => jumpBtn.classList.remove('active'), 120);
  }

  function doPowerup() {
    sounds.init();
    if (gameState !== 'racing') return;
    player.usePowerUp(racers);
    powerupBtn.classList.add('active');
    setTimeout(() => powerupBtn.classList.remove('active'), 120);
  }

  // Keyboard Listeners
  window.addEventListener('keydown', (e) => {
    sounds.init();
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      doJump();
    } else if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyE') {
      e.preventDefault();
      doPowerup();
    } else if (e.code === 'KeyF') {
      toggleFullscreen();
    }
  });

  // Touch / Pointer Listeners
  jumpBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); doJump(); });
  jumpBtn.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); doJump(); }, { passive: false });

  powerupBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); doPowerup(); });
  powerupBtn.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); doPowerup(); }, { passive: false });

  // Full Screen Tap Controls: Right half = jump, Left half = powerup
  gameContainer.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.top-bar') || e.target.closest('.modal-dialog') || e.target.closest('.menu-screen') || e.target.closest('.wood-action-btn')) return;
    sounds.init();
    if (gameState !== 'racing') return;
    const rect = gameContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width * 0.45) {
      doJump();
    } else {
      doPowerup();
    }
  });

  restartBtn.addEventListener('click', () => {
    sounds.init();
    resultsScreen.style.display = 'none';
    resultsScreen.classList.add('hidden');
    uiOverlay.style.display = 'flex';
    uiOverlay.classList.remove('hidden');
    resetRace();
    startCountdown();
  });

  function resetRace() {
    racers = [
      new Character(1, 'You', true, selectedAnimal, 140, 350),
      new Character(2, 'Eagle', false, 'baldeagle', 100, 350),
      new Character(3, 'Beaver', false, 'beaver', 60, 350),
      new Character(4, 'Fox', false, 'fox', 20, 350)
    ];
    player = racers[0];
    activePowerupItems = [];
    particles.length = 0;
    stormEffect.active = false;
    bloodFlashTimer = 0;
    if (bloodOverlay) bloodOverlay.classList.add('hidden');
    crates.forEach(c => c.collected = false);
    updatePowerupHUD(null);
  }

  function startCountdown() {
    gameState = 'countdown';
    countdownTimer = 3.0;
    countdownDisplay.classList.add('show');
    sounds.play('countdown');
  }

  function showResults(allRacers) {
    gameState = 'ended';
    const sorted = allRacers.slice().sort((a, b) => b.x - a.x);
    resultsList.innerHTML = '';

    sorted.forEach((r, idx) => {
      const li = document.createElement('li');
      li.className = `leaderboard-item rank-${idx + 1}`;
      li.innerHTML = `<span>#${idx + 1} ${r.name}</span><span>${(r.x / 100).toFixed(0)}m</span>`;
      resultsList.appendChild(li);
    });

    resultsScreen.style.display = 'flex';
    resultsScreen.classList.remove('hidden');
  }

  // Main Game Loop
  let lastTime = performance.now();

  function gameLoop(time) {
    const dt = Math.min((time - lastTime) / 1000, 0.05);
    lastTime = time;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
  }

  function update(dt) {
    // Blood Overlay Fade
    if (bloodFlashTimer > 0) {
      bloodFlashTimer -= dt;
      if (bloodFlashTimer <= 0 && bloodOverlay) {
        bloodOverlay.classList.add('hidden');
      }
    }

    if (gameState === 'countdown') {
      countdownTimer -= dt;
      if (countdownTimer > 2) {
        countdownDisplay.textContent = '3';
      } else if (countdownTimer > 1) {
        countdownDisplay.textContent = '2';
      } else if (countdownTimer > 0) {
        countdownDisplay.textContent = '1';
      } else {
        countdownDisplay.textContent = 'GO!';
        sounds.play('start');
        gameState = 'racing';
        setTimeout(() => countdownDisplay.classList.remove('show'), 600);
      }
      return;
    }

    if (gameState !== 'racing') return;

    // Update Storm Effect (Lightning)
    if (stormEffect.active) {
      stormEffect.timer -= dt;
      if (stormEffect.strikeTimer > 0) {
        stormEffect.strikeTimer -= dt;
        if (stormEffect.strikeTimer <= 0) {
          sounds.play('lightning_hit');
          for (const target of stormEffect.targets) {
            spawnSparks(target.x, target.y - 15, 30);
            target.hit('lightning');
          }
        }
      }
      if (stormEffect.timer <= 0) {
        stormEffect.active = false;
      }
    }

    // Update Racers
    for (const r of racers) {
      r.update(dt, racers);
    }

    // Update Projectiles & Traps
    for (let i = activePowerupItems.length - 1; i >= 0; i--) {
      const item = activePowerupItems[i];
      item.life -= dt;
      if (item.life <= 0) {
        activePowerupItems.splice(i, 1);
        continue;
      }

      if (item.type === 'blade') {
        const nextBladeX = item.x + item.vx * dt;
        const checkWallX = nextBladeX + (item.vx > 0 ? 16 : -16);
        // Bounce off solid stone obstacles or cliff walls!
        if (isPointSolid(checkWallX, item.y) || isPointSolid(checkWallX, item.y - 14)) {
          item.vx = -item.vx * 0.95;
          sounds.play('blade_hit');
          spawnSparks(checkWallX, item.y - 6, 16);
        } else {
          item.x = nextBladeX;
        }

        const gY = getGroundUnder(item.x, item.y + 10);
        if (gY !== null) {
          item.y = gY - 14;
        }
        item.rotation += item.vx * 0.04 * dt;

        for (const r of racers) {
          if (r.id !== item.ownerId && !r.dead && Math.hypot(r.x - item.x, (r.y - 18) - item.y) < 32) {
            sounds.play('blade_hit');
            item.hit = true;
            r.hit('blade');
          }
        }
      } else if (item.type === 'trap') {
        const gY = getGroundUnder(item.x, item.y + 10);
        if (gY !== null) {
          item.y = gY;
        }

        if (item.snapped) {
          item.snapTimer -= dt;
          if (item.snapTimer <= 0) {
            activePowerupItems.splice(i, 1);
            continue;
          }
        } else {
          for (const r of racers) {
            if (!r.dead && Math.hypot(r.x - item.x, r.y - item.y) < 28) {
              item.snapped = true;
              item.snapTimer = 1.2;
              sounds.play('trap_hit');
              r.hit('trap');
              break;
            }
          }
        }
      } else if (item.type === 'bounceTrap') {
        const gY = getGroundUnder(item.x, item.y + 10);
        if (gY !== null) item.y = gY;

        if (item.triggered) {
          item.triggerTimer -= dt;
          // Progress through 12-frame spring boxing glove punch animation
          item.animFrame = Math.min(11, Math.floor((0.9 - item.triggerTimer) * 13));
          if (item.triggerTimer <= 0) {
            activePowerupItems.splice(i, 1);
            continue;
          }
        } else {
          for (const r of racers) {
            if (!r.dead && Math.hypot(r.x - item.x, r.y - item.y) < 32) {
              item.triggered = true;
              item.triggerTimer = 0.9;
              item.animFrame = 1;
              sounds.play('bounce_hit');
              r.vy = -750;
              r.vx = -180;
              r.onGround = false;
              spawnSparks(r.x, r.y - 15, 25);
              break;
            }
          }
        }
      }
    }

    // Update Crates Respawn
    for (const c of crates) {
      if (c.collected) {
        c.respawnTimer -= dt;
        if (c.respawnTimer <= 0) c.collected = false;
      }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += GRAVITY * 0.5 * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Smooth Camera Following Player
    const targetCamX = player.x - 300;
    const targetCamY = player.y - 320;
    cameraX += (targetCamX - cameraX) * 0.12;
    cameraY += (targetCamY - cameraY) * 0.12;

    cameraX = Math.max(0, Math.min(WORLD_WIDTH - 960, cameraX));
    cameraY = Math.max(0, Math.min(WORLD_HEIGHT - 540, cameraY));

    // Update HUD: Rank, Speed & Progress Track
    const sorted = racers.slice().sort((a, b) => b.x - a.x);
    const myRank = sorted.findIndex(r => r.isPlayer) + 1;
    const suffixes = ['th', 'st', 'nd', 'rd', 'th'];
    rankDisplay.textContent = myRank + (suffixes[myRank] || 'th');
    speedDisplay.textContent = Math.round(player.vx * 0.16) + ' km/h';

    // Update Marker dots
    const markers = [markerPlayer, markerBot1, markerBot2, markerBot3];
    racers.forEach((r, idx) => {
      const pct = Math.min(100, Math.max(0, (r.x / GOAL_X) * 100));
      if (markers[idx]) markers[idx].style.left = pct + '%';
    });
  }

  function render() {
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    // 1. Sunny Day Sky Background (matching Image 2)
    const skyImg = images['assets/images/map/background/forest/bkg_day.png'];
    if (skyImg && skyImg.complete) {
      ctx.drawImage(skyImg, 0, 0, VIEW_W, VIEW_H);
    } else {
      ctx.fillStyle = '#64b5f6';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

    // Storm Overlay (Lightning activate)
    if (stormEffect.active) {
      ctx.fillStyle = 'rgba(15, 20, 50, 0.65)';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      // Storm clouds swooping across top
      const cTop = images['assets/images/game/powerup/lightning/cloudTop.png'];
      const cBot = images['assets/images/game/powerup/lightning/cloudBottom.png'];
      if (cTop && cTop.complete) {
        ctx.drawImage(cTop, 0, 0, VIEW_W, 90);
      }
      if (cBot && cBot.complete) {
        ctx.drawImage(cBot, 0, 30, VIEW_W, 90);
      }
    }

    // 2. Parallax Mountain Range (moves smoothly at 0.18x speed)
    const mountainImg = images['assets/images/map/background/forest/bkg_mountains.png'];
    if (mountainImg && mountainImg.complete) {
      const mOffset = -(cameraX * 0.18) % 1050;
      ctx.drawImage(mountainImg, mOffset, 120, 1050, 375);
      ctx.drawImage(mountainImg, mOffset + 1050, 120, 1050, 375);
    }

    // 3. Render World Tiles (within camera viewport)
    if (mapData) {
      const startCol = Math.max(0, Math.floor(cameraX / TILE_W));
      const endCol = Math.min(mapData.cols, Math.ceil((cameraX + VIEW_W) / TILE_W) + 1);
      const dirtImg = loadImage('assets/images/map/element/forest/1B.png');
      const maxScreenRow = Math.ceil((cameraY + VIEW_H) / TILE_H) + 2;

      for (let c = startCol; c < endCol; c++) {
        let lowestSolidRow = -1;
        for (let r = 0; r < mapData.rows; r++) {
          const cell = mapData.grid[r][c];
          if (!cell || cell === 1) continue;

          const tileIds = Array.isArray(cell) ? cell : [cell];
          const tx = c * TILE_W - cameraX;
          const ty = r * TILE_H - cameraY;

          for (const tid of tileIds) {
            let tname = mapData.tileNames[tid - 1];
            // Skip powerUp markers and dummy null tiles - no ugly green boxes!
            if (!tname || tname === 'powerUp' || tname === 'null') continue;

            if (isSolidTile(tname)) {
              if (r > lowestSolidRow) lowestSolidRow = r;
            }

            let drawName = tname;
            if (drawName.startsWith('R')) drawName = drawName.slice(1);
            if (drawName === '1Av') drawName = '1Av1';
            if (drawName === '0Av') drawName = '0Av1';
            if (drawName === '0Dv') drawName = '0Dv1';
            if (drawName === '0Fv') drawName = '0Fv1';
            if (drawName === '0Bv') drawName = '0Bv1';
            let tileImgSrc = `assets/images/map/element/forest/${drawName}.png`;

            const timg = loadImage(tileImgSrc);
            if (timg.complete && timg.naturalWidth > 0) {
              ctx.save();
              if (tname.startsWith('R')) {
                ctx.translate(tx + TILE_W, ty);
                ctx.scale(-1, 1);
                ctx.drawImage(timg, 0, 0, TILE_W, TILE_H);
              } else {
                ctx.drawImage(timg, tx, ty, TILE_W, TILE_H);
              }
              ctx.restore();
            }
          }
        }

        // Fill downward dirt so background mountain/sky never shows underneath ground
        if (lowestSolidRow !== -1 && dirtImg && dirtImg.complete) {
          const tx = c * TILE_W - cameraX;
          for (let fillR = lowestSolidRow + 1; fillR < maxScreenRow; fillR++) {
            const ty = fillR * TILE_H - cameraY;
            ctx.drawImage(dirtImg, tx, ty, TILE_W, TILE_H);
          }
        }
      }

      // Render Bounce Pads / Springboards
      const jumpPadImg = images['assets/images/map/element/forest/Jump1.png'];
      for (const bp of bouncePads) {
        if (bp.animTimer > 0) bp.animTimer -= 0.016;
        const bx = bp.x - cameraX;
        const by = bp.y - cameraY;
        if (bx > -100 && bx < VIEW_W + 100) {
          if (jumpPadImg && jumpPadImg.complete && jumpPadImg.naturalWidth > 0) {
            if (bp.animTimer > 0) {
              // Compressed trampoline spring on impact
              ctx.drawImage(jumpPadImg, bx - 40, by - 36, 80, 36);
              ctx.save();
              ctx.fillStyle = 'rgba(255, 230, 0, 0.35)';
              ctx.beginPath();
              ctx.ellipse(bx, by - 8, 36, 12, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            } else {
              // Resting uncompressed springboard placed cleanly on ground
              ctx.drawImage(jumpPadImg, bx - 40, by - 48, 80, 50);
            }
          } else {
            ctx.fillStyle = '#ff9800';
            ctx.fillRect(bx - 30, by - 16, 60, 16);
          }
        }
      }
    }

    // 4. Render Powerup Crates with floating bob & halo
    const crateImg = images['assets/images/map/element/forest/crate.png'];
    const time = performance.now();
    for (const c of crates) {
      if (c.collected) continue;
      const cx = c.x - cameraX;
      const cy = c.y - cameraY + Math.sin(time * 0.005 + c.x) * 4;
      if (cx > -80 && cx < VIEW_W + 80) {
        // Golden glowing halo
        ctx.fillStyle = 'rgba(255, 215, 0, 0.28)';
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI * 2);
        ctx.fill();

        if (crateImg && crateImg.complete && crateImg.naturalWidth > 0) {
          ctx.drawImage(crateImg, cx - 36, cy - 23, 72, 46);
        } else {
          ctx.fillStyle = '#ffbb00';
          ctx.fillRect(cx - 25, cy - 18, 50, 36);
        }
      }
    }

    // 5. Render Active Powerup Traps & Sawblades on Track
    for (const item of activePowerupItems) {
      const ix = item.x - cameraX;
      const iy = item.y - cameraY;
      if (item.type === 'blade') {
        const bImg = item.hit
          ? images['assets/images/game/powerup/blade/blade_blood.png']
          : images['assets/images/game/powerup/blade/blade.png'];
        ctx.save();
        ctx.translate(ix, iy);
        ctx.rotate(item.rotation);
        if (bImg && bImg.complete) {
          ctx.drawImage(bImg, -20, -20, 40, 40);
        } else {
          ctx.fillStyle = '#e0e0e0';
          ctx.beginPath();
          ctx.arc(0, 0, 18, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (item.type === 'trap') {
        const trImg = images['assets/images/game/powerup/trap/sprite.png'];
        if (trImg && trImg.complete) {
          if (!item.snapped) {
            // Frame 1: Open Jaws (74x18 at {x:2, y:50})
            ctx.drawImage(trImg, 2, 50, 74, 18, ix - 21, iy - 14, 42, 18);
          } else {
            // Frame 4: Snapped Jaws (20x38 at {x:78, y:46})
            ctx.drawImage(trImg, 78, 46, 20, 38, ix - 10, iy - 30, 20, 36);
          }
        } else {
          ctx.fillStyle = '#555';
          ctx.fillRect(ix - 15, iy - 8, 30, 14);
        }
      } else if (item.type === 'bounceTrap') {
        const btImg = images['assets/images/game/powerup/bounceTrap/sprite.png'];
        if (btImg && btImg.complete) {
          const f = BOUNCE_TRAP_FRAMES[item.animFrame || 0] || BOUNCE_TRAP_FRAMES[0];
          // Authentic Punch-in-a-Box spring boxing glove animation
          const scale = 0.5;
          const dw = f.tw * scale;
          const dh = f.th * scale;
          const dx = ix + (f.cx - 85) * scale;
          const dy = iy - 28 + (f.cy - 26) * scale;
          ctx.drawImage(btImg, f.tx, f.ty, f.tw, f.th, dx, dy, dw, dh);
        } else {
          const iconImg = images['assets/images/game/powerup/bounceTrap/icon.png'];
          if (iconImg && iconImg.complete) {
            ctx.drawImage(iconImg, ix - 16, iy - 26, 32, 28);
          }
        }
      }
    }

    // 6. Lightning Strike Bolts (from Sky to Target Heads)
    if (stormEffect.active && stormEffect.strikeTimer <= 0) {
      const boltImg = images['assets/images/game/powerup/lightning/lightningBoltSprite.png'];
      for (const target of stormEffect.targets) {
        const tx = target.x - cameraX;
        const ty = target.y - cameraY;
        if (boltImg && boltImg.complete) {
          ctx.drawImage(boltImg, 2, 2, 240, 368, tx - 32, 0, 64, ty);
        } else {
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(tx, 0);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }
      }
    }

    // 7. Render Finish Line Flag
    const goalImg = images['assets/images/map/element/forest/Goal.png'];
    const gx = GOAL_X - cameraX;
    const gy = (getGroundUnder(GOAL_X, 350) || 350) - cameraY - 140;
    if (gx > -100 && gx < VIEW_W + 100) {
      if (goalImg && goalImg.complete) {
        ctx.drawImage(goalImg, gx, gy, 120, 160);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(gx, gy, 15, 140);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(gx + 15, gy, 60, 40);
      }
    }

    // 8. Render Racers (All 4 with multi-layer sprites directly ON grass)
    for (const r of racers) {
      r.draw(ctx, cameraX, cameraY);
    }

    // 9. Render Particles
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x - cameraX, p.y - cameraY, Math.max(1, p.size * p.life), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Start Animation Loop
  requestAnimationFrame(gameLoop);
})();
