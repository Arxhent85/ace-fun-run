// ACE FUN RUN - Browser Edition Game Engine
// Grounded in decompiled Solar2D/Corona Lua code from ACE FUN RUN.apk

(async function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  // DOM HUD Elements
  const rankDisplay = document.getElementById('rank-display');
  const speedDisplay = document.getElementById('speed-display');
  const powerupBtn = document.getElementById('powerup-btn');
  const powerupIcon = document.getElementById('powerup-icon');
  const powerupLabel = document.getElementById('powerup-label');
  const jumpBtn = document.getElementById('jump-btn');
  const countdownDisplay = document.getElementById('countdown-display');
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const resultsScreen = document.getElementById('results-screen');
  const resultsList = document.getElementById('results-list');
  const restartBtn = document.getElementById('restart-btn');
  const markerPlayer = document.getElementById('marker-player');
  const markerBot1 = document.getElementById('marker-bot1');
  const markerBot2 = document.getElementById('marker-bot2');
  const markerBot3 = document.getElementById('marker-bot3');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const menuFullscreenBtn = document.getElementById('menu-fullscreen-btn');

  // Game Constants from player.lu & gamePlay.lu
  const TILE_W = 80;
  const TILE_H = 50;
  const GRAVITY = 980;
  const DEFAULT_TOP_SPEED = 350;
  const ACCELERATE_X = 250;
  const JUMP_FORCE = -520;
  const RESPAWN_DELAY = 2.5;

  // Sound Engine (Web Audio API)
  class SoundManager {
    constructor() {
      this.ctx = null;
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
        shield_act: 'assets/sound/sfx_armor_activate.wav',
        blood: 'assets/sound/sfx_blood.wav',
        countdown: 'assets/sound/sfx_countdown.wav',
        start: 'assets/sound/sfx_start.wav',
        coins: 'assets/sound/sfx_coins.wav',
        bounce: 'assets/sound/sfx_bounce_activate.wav'
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
      if (!this.ctx || !this.buffers[name]) return;
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

  // Preload essential graphics
  loadImage('assets/images/map/background/forest/bkg_sundown.png');
  loadImage('assets/images/map/background/forest/bkg_mountains.png');
  loadImage('assets/images/map/background/forest/cloud1.png');
  loadImage('assets/images/map/element/forest/crate.png');
  loadImage('assets/images/map/element/forest/Goal.png');
  loadImage('assets/images/game/avatar/bearBodySprite.png');
  loadImage('assets/images/game/avatar/baldeagleBodySprite.png');
  loadImage('assets/images/game/avatar/beaverBodySprite.png');
  loadImage('assets/images/game/avatar/foxBodySprite.png');
  loadImage('assets/images/game/powerup/blade/blade.png');
  loadImage('assets/images/game/powerup/trap/sprite.png');
  loadImage('assets/images/game/powerup/trap/icon.png');
  loadImage('assets/images/game/powerup/blade/icon.png');
  loadImage('assets/images/game/powerup/lightning/icon.png');
  loadImage('assets/images/game/powerup/speed/icon.png');
  loadImage('assets/images/game/powerup/shield/icon.png');

  // Load Map JSON
  let mapData = null;
  try {
    const resp = await fetch('sunset_valley.json');
    mapData = await resp.json();
  } catch (err) {
    console.error('Failed to load map data:', err);
  }

  const GOAL_X = 23635; // Extracted Goal Position
  const WORLD_WIDTH = mapData ? mapData.cols * TILE_W : 24720;
  const WORLD_HEIGHT = mapData ? mapData.rows * TILE_H : 900;

  // Powerup definitions
  const POWERUPS = [
    { id: 1, name: 'Sawblade', icon: 'assets/images/game/powerup/blade/icon.png', sfx: 'blade_act' },
    { id: 2, name: 'Bear Trap', icon: 'assets/images/game/powerup/trap/icon.png', sfx: 'trap_act' },
    { id: 3, name: 'Lightning', icon: 'assets/images/game/powerup/lightning/icon.png', sfx: 'lightning_act' },
    { id: 4, name: 'Rocket Speed', icon: 'assets/images/game/powerup/speed/icon.png', sfx: 'speed_act' },
    { id: 5, name: 'Shield', icon: 'assets/images/game/powerup/shield/icon.png', sfx: 'shield_act' }
  ];

  // Particle System (Blood & Boost effects)
  const particles = [];
  function spawnBlood(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 400,
        vy: (Math.random() - 0.8) * 450,
        size: Math.random() * 6 + 3,
        color: '#cc0000',
        life: 1.0,
        decay: Math.random() * 0.8 + 0.6
      });
    }
  }

  function spawnSpeedPuff(x, y) {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: x - 15, y: y + 20,
        vx: (Math.random() - 1.2) * 150,
        vy: (Math.random() - 0.5) * 60,
        size: Math.random() * 8 + 4,
        color: 'rgba(255, 180, 0, 0.8)',
        life: 0.4,
        decay: 1.5
      });
    }
  }

  // Active World Entities (Sawblades, Traps, Crates)
  let activePowerupItems = [];
  let crates = [];

  // Parse Crates from Map Data
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

  // Character definitions
  class Character {
    constructor(id, name, isPlayer, spriteSrc, startX, startY) {
      this.id = id;
      this.name = name;
      this.isPlayer = isPlayer;
      this.sprite = loadImage(spriteSrc);
      this.x = startX;
      this.y = startY;
      this.vx = 0;
      this.vy = 0;
      this.width = 44;
      this.height = 50;
      this.onGround = false;
      this.dead = false;
      this.deathTimer = 0;
      this.shield = false;
      this.speedBoostTimer = 0;
      this.powerup = null; // currently held powerup
      this.animFrame = 0;
      this.animTime = 0;
      this.finished = false;
      this.finishTime = 0;
      this.botJumpCooldown = 0;
      this.rank = 1;
    }

    jump() {
      if (this.dead || !this.onGround) return false;
      this.vy = JUMP_FORCE;
      this.onGround = false;
      if (this.isPlayer) sounds.play('jump');
      return true;
    }

    usePowerUp(racers) {
      if (this.dead || !this.powerup) return;
      const p = this.powerup;
      this.powerup = null;
      if (this.isPlayer) {
        sounds.play(p.sfx);
        updatePowerupHUD(null);
      }

      if (p.id === 1) { // Sawblade rolls forward along ground
        activePowerupItems.push({
          type: 'blade',
          ownerId: this.id,
          x: this.x + 35,
          y: this.y + 10,
          vx: 650,
          vy: 0,
          life: 5.0
        });
      } else if (p.id === 2) { // Bear Trap dropped behind
        activePowerupItems.push({
          type: 'trap',
          ownerId: this.id,
          x: this.x - 40,
          y: this.y + 15,
          active: true,
          life: 15.0
        });
      } else if (p.id === 3) { // Lightning hits 1st place
        sounds.play('lightning_hit');
        const leader = racers.slice().sort((a, b) => b.x - a.x)[0];
        if (leader && leader.id !== this.id) {
          leader.hit('lightning');
        }
      } else if (p.id === 4) { // Rocket Speed
        this.speedBoostTimer = 2.8;
      } else if (p.id === 5) { // Shield
        this.shield = true;
      }
    }

    hit(cause = 'generic') {
      if (this.dead) return;
      if (this.shield) {
        this.shield = false;
        sounds.play('shield_act');
        return;
      }
      this.dead = true;
      this.deathTimer = RESPAWN_DELAY;
      this.speedBoostTimer = 0;
      sounds.play('blood');
      spawnBlood(this.x, this.y, 35);
    }

    update(dt, racers) {
      if (this.dead) {
        this.deathTimer -= dt;
        if (this.deathTimer <= 0) {
          this.dead = false;
          this.vy = 0;
          this.vx = DEFAULT_TOP_SPEED * 0.5;
        }
        return;
      }

      // Speed calculation
      let targetSpeed = DEFAULT_TOP_SPEED;
      if (this.speedBoostTimer > 0) {
        this.speedBoostTimer -= dt;
        targetSpeed = 620;
        spawnSpeedPuff(this.x, this.y);
      }

      // Acceleration
      if (this.vx < targetSpeed) {
        this.vx = Math.min(targetSpeed, this.vx + ACCELERATE_X * dt);
      } else if (this.vx > targetSpeed) {
        this.vx = Math.max(targetSpeed, this.vx - ACCELERATE_X * dt);
      }

      // Gravity
      this.vy += GRAVITY * dt;

      // Integrate
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      // Bot AI Decision Making
      if (!this.isPlayer && !this.finished) {
        this.botAI(dt, racers);
      }

      // World Ground & Tile Collision
      this.checkCollisions();

      // Check Crates
      if (!this.powerup) {
        for (const c of crates) {
          if (!c.collected && Math.hypot(this.x - c.x, this.y - c.y) < 40) {
            c.collected = true;
            c.respawnTimer = 10.0;
            const chosen = POWERUPS[Math.floor(Math.random() * POWERUPS.length)];
            this.powerup = chosen;
            if (this.isPlayer) {
              sounds.play('pickup');
              updatePowerupHUD(chosen);
            }
            break;
          }
        }
      }

      // Check Finish Line
      if (!this.finished && this.x >= GOAL_X) {
        this.finished = true;
        this.finishTime = performance.now();
        if (this.isPlayer) {
          sounds.play('coins');
          showResults(racers);
        }
      }

      // Animation
      if (this.onGround) {
        this.animTime += dt * (this.vx / 80);
        this.animFrame = Math.floor(this.animTime) % 6;
      } else {
        this.animFrame = 3; // jump frame
      }
    }

    botAI(dt, racers) {
      this.botJumpCooldown -= dt;
      // Raycast / lookahead for gaps or obstacles
      const aheadX = this.x + 90;
      const groundAhead = getGroundYAt(aheadX);
      const groundCurrent = getGroundYAt(this.x);

      // Jump if obstacle ahead (ground rises sharply) or approaching a pit/drop
      if (this.botJumpCooldown <= 0 && this.onGround) {
        if (groundAhead < groundCurrent - 25 || groundAhead > groundCurrent + 100) {
          this.jump();
          this.botJumpCooldown = Math.random() * 0.6 + 0.5;
        }
      }

      // Use powerups smartly
      if (this.powerup && Math.random() < 0.02) {
        this.usePowerUp(racers);
      }
    }

    checkCollisions() {
      // Find ground Y under character
      const groundY = getGroundYAt(this.x);
      const playerBottom = this.y + this.height / 2;

      // Check for jelly trampoline or boost pad underfoot
      const tileInfo = getTileInfoAt(this.x, playerBottom);
      if (tileInfo.bounce) {
        this.vy = -780;
        this.onGround = false;
        sounds.play('bounce');
        return;
      }
      if (tileInfo.boost) {
        this.vx = 650;
      }

      if (playerBottom >= groundY && this.vy >= 0) {
        this.y = groundY - this.height / 2;
        this.vy = 0;
        this.onGround = true;
      } else {
        this.onGround = false;
      }

      // Fall off map check
      if (this.y > WORLD_HEIGHT + 100) {
        this.hit('pit');
        this.y = groundY - 100;
      }
    }

    draw(ctx, cameraX, cameraY) {
      if (this.dead) return; // Ghost / dead invisible while respawning

      const renderX = this.x - cameraX;
      const renderY = this.y - cameraY;

      // Draw Bear / Avatar Sprite
      const spriteW = 66;
      const spriteH = 70;
      const sx = 2;
      const sy = 2 + (this.animFrame % 3) * 72; // frame strip lookup

      ctx.save();
      ctx.translate(renderX, renderY);

      // Draw Shield Aura if active
      if (this.shield) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Character Body
      if (this.sprite.complete && this.sprite.naturalWidth > 0) {
        ctx.drawImage(this.sprite, sx, sy, spriteW, spriteH, -spriteW / 2, -spriteH / 2, spriteW, spriteH);
      } else {
        // Fallback procedural avatar
        ctx.fillStyle = this.isPlayer ? '#ff9900' : '#4488ff';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Player Name Tag
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(this.name, 0, -32);

      ctx.restore();
    }
  }

  // Terrain Query Engine using parsed tiles
  function getGroundYAt(worldX) {
    if (!mapData) return 450;
    const col = Math.floor(worldX / TILE_W);
    if (col < 0 || col >= mapData.cols) return WORLD_HEIGHT - 50;

    // Scan from bottom row upward to find top ground tile
    for (let r = 0; r < mapData.rows; r++) {
      const cell = mapData.grid[r][col];
      const tid = Array.isArray(cell) ? cell[0] : cell;
      if (tid && tid !== 1) { // 1 is empty air
        const tname = mapData.tileNames[tid - 1];
        const tileTop = r * TILE_H;

        // Check for slopes
        if (tname && (tname.includes('1C1') || tname.includes('1D1') || tname.includes('1E1'))) {
          const localX = (worldX % TILE_W) / TILE_W;
          return tileTop + (1 - localX) * TILE_H;
        } else if (tname && tname.startsWith('R1C1')) {
          const localX = (worldX % TILE_W) / TILE_W;
          return tileTop + localX * TILE_H;
        }
        return tileTop;
      }
    }
    return WORLD_HEIGHT - 50;
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
      boost: tname.includes('is')
    };
  }

  function updatePowerupHUD(powerup) {
    if (powerup) {
      powerupIcon.src = powerup.icon;
      powerupBtn.classList.add('ready');
      powerupLabel.textContent = '[X]';
    } else {
      powerupIcon.src = 'assets/images/transparent.png';
      powerupBtn.classList.remove('ready');
      powerupLabel.textContent = '';
    }
  }

  // 4 Racers
  let racers = [
    new Character(1, 'You (Bear)', true, 'assets/images/game/avatar/bearBodySprite.png', 120, 300),
    new Character(2, 'Eagle (Bot)', false, 'assets/images/game/avatar/baldeagleBodySprite.png', 80, 300),
    new Character(3, 'Beaver (Bot)', false, 'assets/images/game/avatar/beaverBodySprite.png', 50, 300),
    new Character(4, 'Fox (Bot)', false, 'assets/images/game/avatar/foxBodySprite.png', 20, 300)
  ];

  const player = racers[0];

  // Game States: 'lobby', 'countdown', 'racing', 'ended'
  let gameState = 'lobby';
  let countdownTimer = 3.0;

  // Camera coordinates
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
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
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
      const icon = fullscreenBtn.querySelector('.hud-icon');
      const text = fullscreenBtn.querySelector('.hud-text');
      if (icon) icon.textContent = isFs ? '🗗' : '⛶';
      if (text) text.textContent = isFs ? 'Fenster' : 'Vollbild';
    }
    if (menuFullscreenBtn) {
      menuFullscreenBtn.textContent = isFs ? '🗗 VOLLBILD BEENDEN' : '⛶ VOLLBILD AN/AUS';
    }
  }

  document.addEventListener('fullscreenchange', updateFullscreenUI);
  document.addEventListener('webkitfullscreenchange', updateFullscreenUI);

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });
  if (menuFullscreenBtn) menuFullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });

  // Keyboard Listeners
  window.addEventListener('keydown', (e) => {
    sounds.init();
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      player.jump();
      jumpBtn.classList.add('active');
    } else if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      e.preventDefault();
      player.usePowerUp(racers);
      powerupBtn.classList.add('active');
    } else if (e.code === 'KeyF') {
      toggleFullscreen();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jumpBtn.classList.remove('active');
    if (e.code === 'KeyX' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') powerupBtn.classList.remove('active');
  });

  // Touch & Pointer UI Listeners
  jumpBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    sounds.init();
    player.jump();
    jumpBtn.classList.add('active');
  });
  jumpBtn.addEventListener('pointerup', () => jumpBtn.classList.remove('active'));

  powerupBtn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    sounds.init();
    player.usePowerUp(racers);
    powerupBtn.classList.add('active');
  });
  powerupBtn.addEventListener('pointerup', () => powerupBtn.classList.remove('active'));

  // Mobile / Tablet Canvas Direct Tap Support (Right side = Jump, Left side = Powerup)
  canvas.addEventListener('pointerdown', (e) => {
    sounds.init();
    if (gameState !== 'racing') return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width * 0.45) {
      player.jump();
      jumpBtn.classList.add('active');
      setTimeout(() => jumpBtn.classList.remove('active'), 120);
    } else {
      player.usePowerUp(racers);
      powerupBtn.classList.add('active');
      setTimeout(() => powerupBtn.classList.remove('active'), 120);
    }
  });

  startBtn.addEventListener('click', () => {
    sounds.init();
    startScreen.classList.add('hidden');
    startCountdown();
  });

  restartBtn.addEventListener('click', () => {
    sounds.init();
    resultsScreen.classList.add('hidden');
    resetRace();
    startCountdown();
  });

  function resetRace() {
    racers = [
      new Character(1, 'You (Bear)', true, 'assets/images/game/avatar/bearBodySprite.png', 120, 300),
      new Character(2, 'Eagle (Bot)', false, 'assets/images/game/avatar/baldeagleBodySprite.png', 80, 300),
      new Character(3, 'Beaver (Bot)', false, 'assets/images/game/avatar/beaverBodySprite.png', 50, 300),
      new Character(4, 'Fox (Bot)', false, 'assets/images/game/avatar/foxBodySprite.png', 20, 300)
    ];
    activePowerupItems = [];
    particles.length = 0;
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
        item.x += item.vx * dt;
        item.y = getGroundYAt(item.x) - 15;

        // Check collision with runners
        for (const r of racers) {
          if (r.id !== item.ownerId && !r.dead && Math.hypot(r.x - item.x, r.y - item.y) < 35) {
            sounds.play('blade_hit');
            r.hit('blade');
          }
        }
      } else if (item.type === 'trap') {
        item.y = getGroundYAt(item.x) - 10;
        for (const r of racers) {
          if (!r.dead && Math.hypot(r.x - item.x, r.y - item.y) < 30) {
            sounds.play('trap_hit');
            r.hit('trap');
            activePowerupItems.splice(i, 1);
            break;
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
    cameraX += (targetCamX - cameraX) * 0.1;
    cameraY += (targetCamY - cameraY) * 0.1;

    cameraX = Math.max(0, Math.min(WORLD_WIDTH - 960, cameraX));
    cameraY = Math.max(0, Math.min(WORLD_HEIGHT - 540, cameraY));

    // Update HUD: Rank, Speed & Progress Track
    const sorted = racers.slice().sort((a, b) => b.x - a.x);
    const myRank = sorted.findIndex(r => r.isPlayer) + 1;
    const suffixes = ['th', 'st', 'nd', 'rd', 'th'];
    rankDisplay.textContent = myRank + (suffixes[myRank] || 'th');
    speedDisplay.textContent = Math.round(player.vx * 0.15) + ' km/h';

    // Update Marker dots
    const markers = [markerPlayer, markerBot1, markerBot2, markerBot3];
    racers.forEach((r, idx) => {
      const pct = Math.min(100, Math.max(0, (r.x / GOAL_X) * 100));
      if (markers[idx]) markers[idx].style.left = pct + '%';
    });
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Parallax Sundown Background
    const skyImg = images['assets/images/map/background/forest/bkg_sundown.png'];
    if (skyImg && skyImg.complete) {
      ctx.drawImage(skyImg, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#ff7733';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Parallax Mountain Range (moves at 0.18x speed)
    const mountainImg = images['assets/images/map/background/forest/bkg_mountains.png'];
    if (mountainImg && mountainImg.complete) {
      const mOffset = -(cameraX * 0.18) % 1050;
      ctx.drawImage(mountainImg, mOffset, 120, 1050, 375);
      ctx.drawImage(mountainImg, mOffset + 1050, 120, 1050, 375);
    }

    // 3. Render World Tiles (within camera viewport)
    if (mapData) {
      const startCol = Math.max(0, Math.floor(cameraX / TILE_W));
      const endCol = Math.min(mapData.cols, Math.ceil((cameraX + canvas.width) / TILE_W) + 1);

      for (let r = 0; r < mapData.rows; r++) {
        for (let c = startCol; c < endCol; c++) {
          const cell = mapData.grid[r][c];
          if (!cell || cell === 1) continue;

          const tileIds = Array.isArray(cell) ? cell : [cell];
          const tx = c * TILE_W - cameraX;
          const ty = r * TILE_H - cameraY;

          for (const tid of tileIds) {
            let tname = mapData.tileNames[tid - 1];
            if (!tname || tname === 'powerUp') continue;

            if (tname === '1Av') tname = '1Av1';
            let tileImgSrc = `assets/images/map/element/forest/${tname}.png`;
            if (tname.startsWith('R')) {
              tileImgSrc = `assets/images/map/element/forest/${tname.slice(1)}.png`;
            }

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
            } else {
              // Procedural tile fallback
              ctx.fillStyle = '#4a7c28';
              ctx.fillRect(tx, ty, TILE_W, TILE_H);
            }
          }
        }
      }
    }

    // 4. Render Powerup Crates
    const crateImg = images['assets/images/map/element/forest/crate.png'];
    for (const c of crates) {
      if (c.collected) continue;
      const cx = c.x - cameraX;
      const cy = c.y - cameraY;
      if (cx > -50 && cx < canvas.width + 50) {
        if (crateImg && crateImg.complete) {
          ctx.drawImage(crateImg, cx - 25, cy - 25, 50, 50);
        } else {
          ctx.fillStyle = '#ffbb00';
          ctx.fillRect(cx - 20, cy - 20, 40, 40);
        }
      }
    }

    // 5. Render Active Powerup Traps & Sawblades
    for (const item of activePowerupItems) {
      const ix = item.x - cameraX;
      const iy = item.y - cameraY;
      if (item.type === 'blade') {
        const bImg = images['assets/images/game/powerup/blade/blade.png'];
        ctx.save();
        ctx.translate(ix, iy);
        ctx.rotate(performance.now() * 0.02);
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
          ctx.drawImage(trImg, ix - 20, iy - 15, 40, 30);
        } else {
          ctx.fillStyle = '#555';
          ctx.fillRect(ix - 15, iy - 8, 30, 16);
        }
      }
    }

    // 6. Render Finish Line Flag
    const goalImg = images['assets/images/map/element/forest/Goal.png'];
    const gx = GOAL_X - cameraX;
    const gy = getGroundYAt(GOAL_X) - cameraY - 140;
    if (gx > -100 && gx < canvas.width + 100) {
      if (goalImg && goalImg.complete) {
        ctx.drawImage(goalImg, gx, gy, 120, 160);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(gx, gy, 15, 140);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(gx + 15, gy, 60, 40);
      }
    }

    // 7. Render Racers
    for (const r of racers) {
      r.draw(ctx, cameraX, cameraY);
    }

    // 8. Render Blood and Boost Particles
    for (const p of particles) {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x - cameraX, p.y - cameraY, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Start Animation Loop
  requestAnimationFrame(gameLoop);
})();
