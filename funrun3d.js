// ============================================================================
// FUN RUN 3D - Pocket Edition Engine
// A high-speed 2.5D/3D behind-the-back runner combining Ace Fun Run mechanics
// with Pocket Champs style 3D perspective, authentic sounds, sawblades & traps.
// ============================================================================

(function () {
  'use strict';

  // Sound Engine using authentic Fun Run audio files with procedural synthesis fallback
  class FunRun3DSound {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.buffers = {};
      this.soundUrls = {
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
        } catch (e) {
          // Fallback to procedural sounds will be used
        }
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

  // Color helper for 3D gradient shading
  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16), G = parseInt(color.substring(3,5),16), B = parseInt(color.substring(5,7),16);
    R = Math.min(255, Math.max(0, parseInt(R * (100 + percent) / 100)));
    G = Math.min(255, Math.max(0, parseInt(G * (100 + percent) / 100)));
    B = Math.min(255, Math.max(0, parseInt(B * (100 + percent) / 100)));
    let RR = (R.toString(16).length === 1) ? '0' + R.toString(16) : R.toString(16);
    let GG = (G.toString(16).length === 1) ? '0' + G.toString(16) : G.toString(16);
    let BB = (B.toString(16).length === 1) ? '0' + B.toString(16) : B.toString(16);
    return '#' + RR + GG + BB;
  }

  function formatTime(totalSeconds) {
    let m = Math.floor(totalSeconds / 60);
    let s = Math.floor(totalSeconds % 60);
    let ms = Math.floor((totalSeconds % 1) * 100);
    return (m > 0 ? m + ':' : '') + (s < 10 && m > 0 ? '0' : '') + s + '.' + (ms < 10 ? '0' : '') + ms + 's';
  }

  // Particle System (Blood splatters, sparks, feathers, speed flames)
  class ParticleSystem {
    constructor() {
      this.particles = [];
    }

    spawn(x, y, z, vx, vy, vz, color, size, life, shape = 'circle') {
      this.particles.push({ x, y, z, vx, vy, vz, color, size, maxLife: life, life, shape });
    }

    spawnBlood(x, y, z, count = 28) {
      for (let i = 0; i < count; i++) {
        this.spawn(
          x + (Math.random() - 0.5) * 40, y + 25 + Math.random() * 25, z,
          (Math.random() - 0.5) * 380, Math.random() * 320 + 80, (Math.random() - 0.5) * 280,
          Math.random() > 0.3 ? '#cc0000' : '#880000', Math.random() * 9 + 4, 0.65, 'blood'
        );
      }
    }

    spawnSparks(x, y, z, count = 16, color = '#ffbb00') {
      for (let i = 0; i < count; i++) {
        this.spawn(
          x, y + 20, z,
          (Math.random() - 0.5) * 420, Math.random() * 380 + 100, (Math.random() - 0.5) * 400,
          color, Math.random() * 6 + 3, 0.45, 'spark'
        );
      }
    }

    spawnDust(x, y, z) {
      for (let i = 0; i < 4; i++) {
        this.spawn(
          x + (Math.random() - 0.5) * 40, y + 5, z - 20,
          (Math.random() - 0.5) * 60, Math.random() * 40 + 20, -Math.random() * 100,
          'rgba(220, 220, 220, 0.55)', Math.random() * 8 + 5, 0.35, 'circle'
        );
      }
    }

    spawnSpeedFlames(x, y, z) {
      for (let i = 0; i < 3; i++) {
        this.spawn(
          x + (Math.random() - 0.5) * 30, y + 20, z - 40,
          (Math.random() - 0.5) * 50, Math.random() * 40 + 10, -Math.random() * 180 - 100,
          i % 2 === 0 ? '#ffea00' : '#ff3d00', Math.random() * 10 + 6, 0.28, 'circle'
        );
      }
    }

    update(dt) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.vy -= 420 * dt;
      }
    }

    draw(ctx, projectFn) {
      for (let p of this.particles) {
        let proj = projectFn(p.x, p.y, p.z);
        if (!proj) continue;
        let alpha = p.life / p.maxLife;
        let r = p.size * proj.scale;
        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (p.shape === 'blood') {
          ctx.ellipse(proj.x, proj.y, Math.max(2, r * 1.3), Math.max(1, r * 0.8), (p.life * 5) % Math.PI, 0, Math.PI * 2);
        } else {
          ctx.arc(proj.x, proj.y, Math.max(1, r), 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      }
    }
  }

  // Level Theme Definitions (Sunset Valley, Slush Cave, Sugar Slope)
  const THEMES = {
    1: { // Sunset Valley (Wald & Sägewerk)
      name: 'Sunset Valley',
      icon: '🌲',
      skyTop: '#ff7744',
      skyBot: '#ffd166',
      bgHill: '#244222',
      roadDark: '#5c3a21',
      roadLight: '#73492c',
      roadMDark: '#73492c',
      roadMLight: '#5c3a21',
      wallDark: '#382213',
      wallLight: '#4d2e1a',
      wallTopDark: '#2e5728',
      wallTopLight: '#3f7336',
      outDark: '#1a3318',
      outLight: '#244521',
      treeTrunk: '#3e2311',
      treeL1: '#1f4e1f',
      treeL2: '#2b6e2b'
    },
    2: { // Slush Cave / Snowset (Schnee & Eishöhle)
      name: 'Snowset Peaks',
      icon: '❄️',
      skyTop: '#2b5876',
      skyBot: '#8cd5f5',
      bgHill: '#4e7d9c',
      roadDark: '#d9f0ff',
      roadLight: '#ffffff',
      roadMDark: '#ffffff',
      roadMLight: '#d9f0ff',
      wallDark: '#5aa3d6',
      wallLight: '#7bbce8',
      wallTopDark: '#99d2f7',
      wallTopLight: '#bde2fa',
      outDark: '#a8d5f2',
      outLight: '#cce8f9',
      treeTrunk: '#3d2b1f',
      treeL1: '#d7ecf8',
      treeL2: '#ffffff'
    },
    3: { // Sugar Slope (Bunte Süßigkeiten-Welt)
      name: 'Sugar Slope',
      icon: '🍭',
      skyTop: '#f77062',
      skyBot: '#fe5196',
      bgHill: '#701a55',
      roadDark: '#5e2750',
      roadLight: '#7a3369',
      roadMDark: '#8c3b78',
      roadMLight: '#5e2750',
      wallDark: '#f72585',
      wallLight: '#ff4d94',
      wallTopDark: '#7209b7',
      wallTopLight: '#9d4edd',
      outDark: '#4a0e4e',
      outLight: '#5c1362',
      treeTrunk: '#f1c0e8',
      treeL1: '#cfbaf0',
      treeL2: '#90dbf4'
    }
  };

  // Fun Run 3D Racer Class
  class Racer3D {
    constructor(x, animal, isPlayer, name) {
      this.x = x;
      this.z = isPlayer ? 100 : 200 + Math.random() * 200;
      this.animal = animal || 'bear';
      this.isPlayer = isPlayer;
      this.name = name;

      this.baseSpeed = isPlayer ? 760 : 720 + Math.random() * 65;
      this.speed = this.baseSpeed;
      this.size = 52;
      this.baseY = 0;
      this.vy = 0;
      this.isJumping = false;
      this.targetX = x;
      this.aiTimer = 0;

      // Fun Run Combat State
      this.currentWeapon = null;
      this.shieldTimer = 0;
      this.speedBoostTimer = 0;
      this.stunTimer = 0;
      this.isShocked = false;
      this.dead = false;
      this.respawnTimer = 0;

      this.lean = 0;
      this.finishTime = null;

      // Color Palette based on Animal
      this.setupPalette();
    }

    setupPalette() {
      if (this.animal === 'bear') {
        this.mainColor = '#8d5524';
        this.bellyColor = '#c68642';
        this.darkColor = '#5c3311';
        this.earColor = '#5c3311';
      } else if (this.animal === 'fox') {
        this.mainColor = '#ff6b35';
        this.bellyColor = '#ffffff';
        this.darkColor = '#bf4315';
        this.earColor = '#222222';
      } else if (this.animal === 'beaver') {
        this.mainColor = '#9a5c37';
        this.bellyColor = '#dfa06e';
        this.darkColor = '#61361c';
        this.earColor = '#422413';
      } else if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        this.mainColor = '#4a3b32';
        this.bellyColor = '#ffffff';
        this.darkColor = '#2e241e';
        this.earColor = '#ffaa00'; // Beak
      } else {
        this.mainColor = '#43aa8b';
        this.bellyColor = '#90be6d';
        this.darkColor = '#277da1';
        this.earColor = '#f9c74f';
      }
    }

    jump(engine) {
      if (!this.isJumping && this.stunTimer <= 0 && !this.dead) {
        this.vy = 720;
        this.isJumping = true;
        if (this.isPlayer) sfx.play('jump');
        engine.particles.spawnDust(this.x, engine.getHillY(this.z), this.z);
      }
    }

    usePowerup(engine) {
      if (!this.currentWeapon || this.dead) return;

      const wp = this.currentWeapon;
      this.currentWeapon = null;
      if (this.isPlayer) engine.hideWeaponButton();

      if (wp === 'blade') {
        sfx.play('blade_act');
        // Spawn rolling sawblade heading forward
        let target = null;
        let minDist = Infinity;
        engine.racers.forEach(r => {
          if (r !== this && r.z > this.z && (r.z - this.z) < minDist) {
            minDist = r.z - this.z;
            target = r;
          }
        });
        engine.projectiles.push(new SawbladeProjectile(this.x, engine.getHillY(this.z) + 25, this.z + 50, target, this));
      } else if (wp === 'trap') {
        sfx.play('trap_act');
        // Drop bear trap behind
        engine.hazards.push({
          x: this.x,
          z: this.z - 120,
          type: 'trap',
          active: true,
          owner: this,
          timer: 0
        });
      } else if (wp === 'lightning') {
        sfx.play('lightning_act');
        engine.globalFlashAlpha = 1.0;
        engine.cameraShake = 16;
        engine.racers.forEach(r => {
          if (r !== this && r.z > this.z) {
            r.stunTimer = 1.8;
            r.isShocked = true;
            engine.particles.spawnSparks(r.x, engine.getHillY(r.z) + 35, r.z, 20, '#00ffff');
          }
        });
      } else if (wp === 'shield') {
        sfx.play('shield_act');
        this.shieldTimer = 4.5;
      } else if (wp === 'speed') {
        sfx.play('speed_act');
        this.speedBoostTimer = 3.2;
        this.speed = this.baseSpeed * 1.55;
      }
    }

    takeDamage(engine, reason = 'blade') {
      if (this.shieldTimer > 0) {
        // Shield absorbs the blow!
        this.shieldTimer = 0;
        sfx.play('shield_act');
        engine.particles.spawnSparks(this.x, engine.getHillY(this.z) + 30, this.z, 20, '#00e5ff');
        return;
      }

      this.dead = true;
      this.respawnTimer = 1.6;
      this.speed = 0;
      this.currentWeapon = null;

      if (reason === 'blade') {
        sfx.play('blade_hit');
        sfx.play('blood');
        engine.particles.spawnBlood(this.x, engine.getHillY(this.z) + 30, this.z, 35);
        if (this.isPlayer) {
          engine.triggerBloodScreen();
          engine.cameraShake = 22;
        }
      } else if (reason === 'trap') {
        sfx.play('trap_hit');
        sfx.play('blood');
        engine.particles.spawnBlood(this.x, engine.getHillY(this.z) + 20, this.z, 25);
        if (this.isPlayer) {
          engine.triggerBloodScreen();
          engine.cameraShake = 18;
        }
      }
    }

    update(dt, engine) {
      // Dead & Respawn handling
      if (this.dead) {
        this.respawnTimer -= dt;
        if (this.respawnTimer <= 0) {
          this.dead = false;
          this.speed = this.baseSpeed * 0.7;
          this.baseY = 160; // Parachute drop-in
          this.vy = -120;
          this.isJumping = true;
          this.shieldTimer = 1.8; // Brief spawn invulnerability
          sfx.play('jump');
        }
        return;
      }

      // Timers
      if (this.shieldTimer > 0) this.shieldTimer -= dt;
      if (this.speedBoostTimer > 0) {
        this.speedBoostTimer -= dt;
        engine.particles.spawnSpeedFlames(this.x, engine.getHillY(this.z) + this.baseY, this.z);
      } else if (this.stunTimer > 0) {
        this.stunTimer -= dt;
        this.speed = 0;
        if (this.stunTimer <= 0) this.isShocked = false;
      } else {
        this.speed += (this.baseSpeed - this.speed) * 3.5 * dt;
      }

      this.z += this.speed * dt;
      if (this.z >= engine.finishLineZ && this.finishTime === null) {
        this.finishTime = (Date.now() - engine.raceStartTime) / 1000;
      }

      // Jump Physics
      if (this.isJumping) {
        this.baseY += this.vy * dt;
        this.vy -= 1850 * dt;
        if (this.baseY <= 0) {
          this.baseY = 0;
          this.isJumping = false;
          this.vy = 0;
          engine.particles.spawnDust(this.x, engine.getHillY(this.z), this.z);
        }
      }

      let oldX = this.x;
      // AI Logic
      if (!this.isPlayer) {
        this.aiTimer -= dt;
        if (this.aiTimer <= 0) {
          const lanes = [-350, 0, 350];
          this.targetX = lanes[Math.floor(Math.random() * lanes.length)];
          this.aiTimer = 1.0 + Math.random() * 1.8;
        }
        this.x += (this.targetX - this.x) * 4.0 * dt;

        // Use Powerup randomly
        if (this.currentWeapon && Math.random() < 0.04) {
          this.usePowerup(engine);
        }

        // Avoid or jump over hazards
        engine.hazards.forEach(h => {
          if (h.active && h.z > this.z && (h.z - this.z) < 360 && Math.abs(h.x - this.x) < 140) {
            if (Math.random() < 0.82) this.jump(engine);
          }
        });
      } else {
        this.x += (engine.targetX - this.x) * 9.5 * dt;
      }
      this.lean = (this.x - oldX) * 0.12;
    }

    draw(ctx, engine) {
      if (this.dead) return;

      let hillY = engine.getHillY(this.z);
      let runCycle = this.z * 0.04;
      let waddleY = (!this.isJumping && this.speed > 80) ? Math.abs(Math.sin(runCycle)) * 9 : 0;
      let finalY = hillY + this.baseY + waddleY;

      let p = engine.project(this.x, finalY, this.z);
      if (!p) return;

      let r = this.size * p.scale;

      // Realistic 3D Ground Shadow
      let shadowP = engine.project(this.x, hillY, this.z);
      if (shadowP) {
        let shadowSize = r * (1 - (this.baseY / 800));
        if (shadowSize > 0) {
          ctx.fillStyle = 'rgba(0,0,0,0.36)';
          ctx.beginPath();
          ctx.ellipse(shadowP.x, shadowP.y + r * 0.72, shadowSize * 1.1, shadowSize * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.save();
      ctx.translate(p.x, p.y);

      if (this.isShocked) {
        ctx.rotate((Math.random() - 0.5) * 0.35);
      } else if (this.stunTimer > 0) {
        ctx.rotate((this.stunTimer * 14) % (Math.PI * 2));
      } else {
        ctx.rotate(this.lean);
      }

      // Draw Fun Run 3D Animal Body
      this.drawAnimalModel(ctx, r, p.scale, runCycle);

      // Shield Aura
      if (this.shieldTimer > 0) {
        ctx.save();
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 4 * p.scale;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, -r * 0.2, r * 1.25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // "YOU" Indicator Badge over player
      if (this.isPlayer) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 ' + Math.max(14, 30 * p.scale) + 'px "Luckiest Guy", Impact, Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 6;
        ctx.fillText('DU', p.x, p.y - r - (32 * p.scale));
        ctx.beginPath();
        ctx.moveTo(p.x - 7 * p.scale, p.y - r - 22 * p.scale);
        ctx.lineTo(p.x + 7 * p.scale, p.y - r - 22 * p.scale);
        ctx.lineTo(p.x, p.y - r - 12 * p.scale);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    drawAnimalModel(ctx, r, scale, runCycle) {
      let grad = ctx.createRadialGradient(-r * 0.25, -r * 0.35, r * 0.05, 0, 0, r * 1.2);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, this.mainColor);
      grad.addColorStop(1, this.darkColor);

      ctx.lineWidth = 2.5 * scale;
      ctx.strokeStyle = '#222';

      // 1. Ears (Rendered on top/back)
      if (this.animal === 'bear') {
        // Round Bear Ears
        ctx.fillStyle = this.earColor;
        ctx.beginPath(); ctx.arc(-r * 0.55, -r * 0.85, r * 0.28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.85, r * 0.28, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = this.bellyColor;
        ctx.beginPath(); ctx.arc(-r * 0.55, -r * 0.85, r * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.85, r * 0.14, 0, Math.PI * 2); ctx.fill();
      } else if (this.animal === 'fox') {
        // Pointy Fox Ears with dark tips
        ctx.fillStyle = this.mainColor;
        ctx.beginPath();
        ctx.moveTo(-r * 0.7, -r * 0.5); ctx.lineTo(-r * 0.5, -r * 1.25); ctx.lineTo(-r * 0.2, -r * 0.7);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(r * 0.7, -r * 0.5); ctx.lineTo(r * 0.5, -r * 1.25); ctx.lineTo(r * 0.2, -r * 0.7);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = this.earColor;
        ctx.beginPath();
        ctx.moveTo(-r * 0.58, -r * 0.9); ctx.lineTo(-r * 0.5, -r * 1.25); ctx.lineTo(-r * 0.35, -r * 0.95);
        ctx.closePath(); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(r * 0.58, -r * 0.9); ctx.lineTo(r * 0.5, -r * 1.25); ctx.lineTo(r * 0.35, -r * 0.95);
        ctx.closePath(); ctx.fill();
      } else if (this.animal === 'beaver') {
        // Beaver flat waffle tail in background
        ctx.fillStyle = '#422413';
        ctx.beginPath();
        ctx.ellipse(0, r * 0.75, r * 0.38, r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
      } else if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        // Wings that flap
        let wingFlap = this.isJumping ? Math.sin(Date.now() * 0.04) * 0.9 : Math.sin(runCycle) * 0.3;
        ctx.fillStyle = this.mainColor;
        ctx.save();
        ctx.translate(-r * 0.65, -r * 0.1);
        ctx.rotate(0.3 + wingFlap);
        ctx.beginPath(); ctx.ellipse(-r * 0.25, 0, r * 0.45, r * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.translate(r * 0.65, -r * 0.1);
        ctx.rotate(-0.3 - wingFlap);
        ctx.beginPath(); ctx.ellipse(r * 0.25, 0, r * 0.45, r * 0.22, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.restore();
      }

      // 2. Running Feet / Paws
      let footL_Y = r * 0.62;
      let footR_Y = r * 0.62;
      if (!this.isJumping && this.speed > 50) {
        footL_Y -= Math.max(0, Math.sin(runCycle)) * r * 0.55;
        footR_Y -= Math.max(0, Math.sin(runCycle + Math.PI)) * r * 0.55;
      }
      ctx.fillStyle = this.darkColor;
      ctx.beginPath(); ctx.ellipse(-r * 0.38, footL_Y, r * 0.24, r * 0.16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(r * 0.38, footR_Y, r * 0.24, r * 0.16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // 3. Rounded 3D Torso
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, -r * 0.3, r * 0.65, Math.PI, 0);
      ctx.bezierCurveTo(r * 0.9, r * 0.2, r * 0.8, r * 0.8, 0, r * 0.8);
      ctx.bezierCurveTo(-r * 0.8, r * 0.8, -r * 0.9, r * 0.2, -r * 0.65, -r * 0.3);
      ctx.fill(); ctx.stroke();

      // 4. Belly Patch
      ctx.fillStyle = this.bellyColor;
      ctx.beginPath();
      ctx.ellipse(0, r * 0.35, r * 0.42, r * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // 5. Head / Face & Snout (Viewed slightly from behind/angle)
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, -r * 0.45, r * 0.52, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Muzzle / Beak
      if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        // Eagle Beak
        ctx.fillStyle = '#ffb703';
        ctx.beginPath();
        ctx.moveTo(-r * 0.15, -r * 0.4); ctx.lineTo(r * 0.15, -r * 0.4); ctx.lineTo(0, -r * 0.15);
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        ctx.fillStyle = this.bellyColor;
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.35, r * 0.28, r * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Nose button
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.42, r * 0.1, r * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Sawblade Projectile (rolls forward, cuts through opponents)
  class SawbladeProjectile {
    constructor(x, y, z, target, owner) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.target = target;
      this.owner = owner;
      this.speed = 1850;
      this.active = true;
      this.angle = 0;
    }

    update(dt) {
      this.z += this.speed * dt;
      this.angle += dt * 25;
      if (this.target) {
        this.x += (this.target.x - this.x) * 5.5 * dt;
      }
    }

    draw(ctx, engine) {
      let hillY = engine.getHillY(this.z);
      let p = engine.project(this.x, hillY + 28, this.z);
      if (!p) return;

      let r = 38 * p.scale;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(this.angle);

      // Rotating Metallic Sawblade with Sharp Teeth
      ctx.fillStyle = '#c5cdd8';
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();

      // Saw Teeth
      ctx.fillStyle = '#7a889b';
      for (let i = 0; i < 12; i++) {
        let a = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a + 0.15) * (r * 1.35), Math.sin(a + 0.15) * (r * 1.35));
        ctx.lineTo(Math.cos(a + 0.3) * r, Math.sin(a + 0.3) * r);
        ctx.fill();
      }

      // Center Nut & Blood Stain
      ctx.fillStyle = '#e63946';
      ctx.beginPath(); ctx.arc(r * 0.2, 0, r * 0.35, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#222';
      ctx.beginPath(); ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
    }
  }

  // Finish Line Gate
  class FinishGate3D {
    constructor(z) { this.z = z; }
    draw(ctx, engine) {
      let hillY = engine.getHillY(this.z);
      let rw = engine.roadWidth;
      let pL = engine.project(-rw / 2 - 120, hillY, this.z);
      let pR = engine.project(rw / 2 + 120, hillY, this.z);
      let pTopL = engine.project(-rw / 2 - 120, hillY + 850, this.z);
      let pTopR = engine.project(rw / 2 + 120, hillY + 850, this.z);
      if (!pL || !pR || !pTopL || !pTopR) return;

      let pw = 110 * pL.scale;
      // Wooden Pillars
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(pL.x - pw / 2, pTopL.y, pw, pL.y - pTopL.y);
      ctx.fillRect(pR.x - pw / 2, pTopR.y, pw, pR.y - pTopR.y);

      // Top Banner
      let bh = 260 * pTopL.scale;
      ctx.fillStyle = '#ffd166';
      ctx.fillRect(pTopL.x - pw / 2, pTopL.y, (pTopR.x - pTopL.x) + pw, bh);

      // Checkered Border
      ctx.fillStyle = '#222';
      ctx.font = '900 ' + (150 * pTopL.scale) + 'px "Luckiest Guy", Impact, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FINISH', (pTopL.x + pTopR.x) / 2, pTopL.y + bh / 2);
    }
  }

  // Decorative Trees / Scenery
  class Tree3D {
    constructor(z, side, engine) {
      this.z = z;
      this.x = side === 'left'
        ? -engine.roadWidth / 2 - 220 - Math.random() * 260
        : engine.roadWidth / 2 + 220 + Math.random() * 260;
      this.size = 380 + Math.random() * 220;
    }

    draw(ctx, engine) {
      let hillY = engine.getHillY(this.z);
      let p = engine.project(this.x, hillY + 50, this.z);
      if (!p) return;

      let t = THEMES[engine.currentLevel];
      let scale = p.scale;
      let w = this.size * 0.16 * scale;
      let h = this.size * scale;

      ctx.fillStyle = t.treeTrunk;
      ctx.fillRect(p.x - w / 2, p.y - h, w, h);

      ctx.fillStyle = t.treeL1;
      ctx.beginPath(); ctx.arc(p.x, p.y - h + w, this.size * 0.42 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = t.treeL2;
      ctx.beginPath(); ctx.arc(p.x - w * 2, p.y - h + w * 2, this.size * 0.32 * scale, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(p.x + w * 2, p.y - h + w * 2, this.size * 0.32 * scale, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ============================================================================
  // FUN RUN 3D ENGINE CORE
  // ============================================================================
  class FunRun3DEngine {
    constructor() {
      this.canvas = document.getElementById('gameCanvas3d');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

      this.isPlaying = false;
      this.lastTime = 0;
      this.raceStartTime = 0;
      this.controlMode = 'touch'; // 'touch' or 'camera'
      this.currentLevel = 1;
      this.selectedAnimal = 'bear';

      // 2.5D Camera & Road Parameters
      this.cameraZ = 0;
      this.cameraX = 0;
      this.currentCameraY = 350;
      this.cameraHeight = 350;
      this.focalLength = 320;
      this.drawDistance = 46;
      this.segmentLength = 120;
      this.roadWidth = 1000;
      this.finishLineZ = 75000;

      this.globalFlashAlpha = 0;
      this.cameraShake = 0;
      this.targetX = 0;
      this.laneIndex = 1; // 0: Left (-350), 1: Center (0), 2: Right (350)

      this.player = null;
      this.racers = [];
      this.hazards = [];
      this.projectiles = [];
      this.scenery = [];
      this.particles = new ParticleSystem();

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
      this.restartBtn = document.getElementById('btn3d-restart');
      this.menuBtn = document.getElementById('btn3d-menu');
      this.levelSelectScreen = document.getElementById('levelselect3d-screen');

      // Camera AI Tracking state
      this.poseEngine = null;
      this.activeVideoStream = null;
      this.wakeLockSentinel = null;
      this.smoothedNoseX = 0.5;

      this.initEvents();
    }

    getCurve(z) {
      return Math.sin(z * 0.0004) * 620 + Math.sin(z * 0.0002) * 320;
    }

    getHillY(z) {
      if (this.currentLevel === 2) {
        return Math.sin(z * 0.005) * 80 - z * 0.085; // Permanent downhill slope
      }
      return Math.sin(z * 0.005) * 85;
    }

    project(worldX, worldY, worldZ) {
      let dz = worldZ - this.cameraZ;
      if (dz < 1) return null;
      let scale = this.focalLength / dz;
      let realX = worldX + this.getCurve(worldZ);

      let shakeX = (Math.random() - 0.5) * this.cameraShake;
      let shakeY = (Math.random() - 0.5) * this.cameraShake;

      let screenX = (this.width / 2) + ((realX - this.cameraX + shakeX) * scale);
      let screenY = (this.height / 2) + ((this.currentCameraY - worldY + shakeY) * scale) + (this.height * 0.05);
      return { x: screenX, y: screenY, scale };
    }

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
        else if (itemType === 'lightning') iconImg.src = 'assets/images/game/powerup/lightning/icon.png';
        else if (itemType === 'shield') iconImg.src = 'assets/images/game/powerup/shield/icon.png';
        else if (itemType === 'speed') iconImg.src = 'assets/images/game/powerup/speed/icon.png';
      }
    }

    resize() {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      this.width = rect.width || window.innerWidth;
      this.height = rect.height || window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }

    initEvents() {
      window.addEventListener('resize', () => this.resize());

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (!this.isPlaying || !this.player) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          this.laneIndex = Math.max(0, this.laneIndex - 1);
          this.targetX = (this.laneIndex - 1) * 350;
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          this.laneIndex = Math.min(2, this.laneIndex + 1);
          this.targetX = (this.laneIndex - 1) * 350;
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          this.player.jump(this);
        } else if (e.key === 'x' || e.key === 'X' || e.key === 'Shift' || e.key === 'Enter') {
          if (this.player.currentWeapon) this.player.usePowerup(this);
        }
      });

      // Touch & Swipe on Canvas
      let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
      if (this.canvas) {
        this.canvas.addEventListener('touchstart', (e) => {
          sfx.init();
          if (!this.isPlaying || !this.player) return;
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
          if (!this.isPlaying || !this.player) return;
          e.preventDefault();
          let diffX = e.touches[0].clientX - touchStartX;
          if (diffX > 40 && this.laneIndex < 2) {
            this.laneIndex++;
            this.targetX = (this.laneIndex - 1) * 350;
            touchStartX = e.touches[0].clientX;
          } else if (diffX < -40 && this.laneIndex > 0) {
            this.laneIndex--;
            this.targetX = (this.laneIndex - 1) * 350;
            touchStartX = e.touches[0].clientX;
          }
        }, { passive: false });

        this.canvas.addEventListener('touchend', (e) => {
          if (!this.isPlaying || !this.player) return;
          let dx = e.changedTouches[0].clientX - touchStartX;
          let dy = e.changedTouches[0].clientY - touchStartY;
          let dur = Date.now() - touchStartTime;
          if (Math.abs(dx) < 25 && Math.abs(dy) < 25 && dur < 250) {
            this.player.jump(this);
          }
        });
      }

      // Wooden HUD Action Buttons
      if (this.jumpBtn) {
        this.jumpBtn.addEventListener('click', () => {
          if (this.player) this.player.jump(this);
        });
        this.jumpBtn.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          if (this.player) this.player.jump(this);
        }, { passive: false });
      }

      if (this.weaponBtn) {
        this.weaponBtn.addEventListener('click', () => {
          if (this.player) this.player.usePowerup(this);
        });
        this.weaponBtn.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          if (this.player) this.player.usePowerup(this);
        }, { passive: false });
      }

      if (this.exitBtn) {
        this.exitBtn.addEventListener('click', () => this.stopAndReturnToMenu());
      }
      if (this.restartBtn) {
        this.restartBtn.addEventListener('click', () => this.startRace(this.controlMode, this.currentLevel));
      }
      if (this.menuBtn) {
        this.menuBtn.addEventListener('click', () => this.stopAndReturnToMenu());
      }
    }

    createWorld() {
      this.hazards = [];
      this.scenery = [];
      const lanes = [-350, 0, 350];

      // Procedural Generation of Sawblades, Traps, Bounce Pads, Speed Pads & Crates
      for (let z = 900; z < this.finishLineZ - 1000; z += 480) {
        let rand = Math.random();
        let x = lanes[Math.floor(Math.random() * lanes.length)];

        if (rand > 0.8) {
          // Powerup Mystery Crate
          this.hazards.push({ x, z, type: 'crate', active: true, respawnTimer: 0 });
        } else if (rand > 0.6) {
          // Rotating Sawblade (Pendular across lanes)
          this.hazards.push({
            x, z,
            type: 'sawblade',
            active: true,
            origX: x,
            angle: 0,
            speed: (Math.random() > 0.5 ? 1 : -1) * (200 + Math.random() * 150)
          });
        } else if (rand > 0.42) {
          // Bear Trap
          this.hazards.push({ x, z, type: 'trap', active: true, snapped: false });
        } else if (rand > 0.28) {
          // Bounce Trampoline Pad
          this.hazards.push({ x, z, type: 'bounce', active: true });
        } else {
          // Speed Booster Strip
          this.hazards.push({ x, z, type: 'speed_pad', active: true });
        }

        // Add side trees / forest structures
        if (Math.random() > 0.2) this.scenery.push(new Tree3D(z, 'left', this));
        if (Math.random() > 0.2) this.scenery.push(new Tree3D(z, 'right', this));
      }
    }

    startRace(mode = 'touch', level = 1) {
      sfx.init();
      this.controlMode = mode;
      this.currentLevel = level;

      // Hide all other menus
      if (this.levelSelectScreen) this.levelSelectScreen.classList.add('hidden');
      if (this.resultsScreen) this.resultsScreen.classList.add('hidden');
      if (this.uiOverlay) this.uiOverlay.classList.remove('hidden');

      this.canvas.classList.remove('hidden');
      this.resize();

      // Show Countdown (3 - 2 - 1 - GO!)
      this.countdownDisplay.style.display = 'block';
      let count = 3;
      this.countdownDisplay.textContent = count;
      sfx.play('countdown');

      let timer = setInterval(() => {
        count--;
        if (count > 0) {
          this.countdownDisplay.textContent = count;
          sfx.play('countdown');
        } else if (count === 0) {
          this.countdownDisplay.textContent = 'LOS!';
          sfx.play('start');
        } else {
          clearInterval(timer);
          this.countdownDisplay.style.display = 'none';
          this.launchLoop();
        }
      }, 750);
    }

    launchLoop() {
      this.cameraZ = 0;
      this.cameraX = 0;
      this.targetX = 0;
      this.laneIndex = 1;
      this.projectiles = [];
      this.globalFlashAlpha = 0;
      this.cameraShake = 0;
      this.hideWeaponButton();

      // Setup 4 Fun Run Competitors
      this.player = new Racer3D(0, this.selectedAnimal || 'bear', true, 'Du');
      this.racers = [
        this.player,
        new Racer3D(-350, 'fox', false, 'Fuchs'),
        new Racer3D(350, 'beaver', false, 'Biber'),
        new Racer3D(0, 'baldeagle', false, 'Adler')
      ];

      this.createWorld();

      this.raceStartTime = Date.now();
      this.lastTime = performance.now();
      this.isPlaying = true;

      requestAnimationFrame((t) => this.gameLoop(t));
    }

    checkCollisions() {
      // 1. Racer vs Hazards
      this.racers.forEach(r => {
        if (r.dead) return;

        this.hazards.forEach(h => {
          if (!h.active) return;

          let dz = Math.abs(r.z - h.z);
          let dx = Math.abs(r.x - h.x);

          if (dz < 65) {
            // Sawblade Hit
            if (h.type === 'sawblade' && dx < 80 && r.baseY < 65) {
              r.takeDamage(this, 'blade');
            }
            // Bear Trap Hit
            else if (h.type === 'trap' && dx < 75 && r.baseY < 35) {
              h.active = false;
              r.takeDamage(this, 'trap');
            }
            // Bounce Pad Hit (super jump over saws)
            else if (h.type === 'bounce' && dx < 80 && r.baseY < 40) {
              r.vy = 980;
              r.isJumping = true;
              sfx.play('bounce');
              this.particles.spawnSparks(r.x, this.getHillY(r.z) + 10, r.z, 20, '#00e5ff');
            }
            // Speed Booster Pad
            else if (h.type === 'speed_pad' && dx < 80 && r.baseY < 35) {
              r.speedBoostTimer = 2.4;
              r.speed = r.baseSpeed * 1.5;
              sfx.play('speed_act');
            }
            // Mystery Powerup Crate
            else if (h.type === 'crate' && dx < 80) {
              h.active = false;
              h.respawnTimer = 4.5;
              sfx.play('pickup');

              const items = ['blade', 'trap', 'lightning', 'shield', 'speed'];
              r.currentWeapon = items[Math.floor(Math.random() * items.length)];

              if (r.isPlayer) {
                this.showWeaponButton(r.currentWeapon);
              }
            }
          }
        });
      });

      // 2. Projectiles vs Racers
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        let proj = this.projectiles[i];
        if (!proj.active) continue;

        this.racers.forEach(r => {
          if (r !== proj.owner && !r.dead && Math.abs(proj.z - r.z) < 80 && Math.abs(proj.x - r.x) < 80) {
            proj.active = false;
            r.takeDamage(this, 'blade');
          }
        });

        if (!proj.active) this.projectiles.splice(i, 1);
      }
    }

    drawBackground() {
      let t = THEMES[this.currentLevel];
      let grad = this.ctx.createLinearGradient(0, 0, 0, this.height / 2 + 100);
      grad.addColorStop(0, t.skyTop);
      grad.addColorStop(1, t.skyBot);
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Distant Hills
      let bgShift = (this.cameraX * 0.1) % (this.width * 2);
      this.ctx.fillStyle = t.bgHill;
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.height / 2 + 80);
      for (let i = -50; i <= this.width + 50; i += 100) {
        this.ctx.lineTo(i, this.height / 2 + Math.sin((i + bgShift) * 0.01) * 50 + 20);
      }
      this.ctx.lineTo(this.width, this.height);
      this.ctx.lineTo(0, this.height);
      this.ctx.fill();
    }

    gameLoop(currentTime) {
      if (!this.isPlaying) return;
      requestAnimationFrame((t) => this.gameLoop(t));

      let dt = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      if (dt > 0.05) dt = 0.05;
      if (dt < 0) dt = 0;

      // Update Logic
      this.racers.forEach(r => r.update(dt, this));
      this.projectiles.forEach(p => p.update(dt));
      this.particles.update(dt);

      // Sawblade oscillation
      this.hazards.forEach(h => {
        if (h.type === 'sawblade') {
          h.x += h.speed * dt;
          if (h.x > 380) { h.x = 380; h.speed = -Math.abs(h.speed); }
          if (h.x < -380) { h.x = -380; h.speed = Math.abs(h.speed); }
          h.angle += dt * 18;
        } else if (!h.active && h.type === 'crate' && h.respawnTimer > 0) {
          h.respawnTimer -= dt;
          if (h.respawnTimer <= 0) h.active = true;
        }
      });

      this.checkCollisions();

      // Camera Shake decay
      if (this.cameraShake > 0) this.cameraShake = Math.max(0, this.cameraShake - 42 * dt);

      // Camera Follow Player
      this.cameraZ = this.player.z - 490;
      let targetCamX = this.getCurve(this.player.z) + this.player.x * 0.85;
      this.cameraX += (targetCamX - this.cameraX) * 6 * dt;
      this.currentCameraY = this.getHillY(this.player.z) + this.cameraHeight;

      // Render World
      this.drawBackground();

      let t = THEMES[this.currentLevel];
      let startSeg = Math.floor(this.cameraZ / this.segmentLength);

      for (let i = startSeg + this.drawDistance; i > startSeg; i--) {
        let z1 = i * this.segmentLength;
        let z2 = (i + 1) * this.segmentLength;
        let y1 = this.getHillY(z1);
        let y2 = this.getHillY(z2);

        let p1L = this.project(-this.roadWidth / 2, y1, z1);
        let p1R = this.project(this.roadWidth / 2, y1, z1);
        let p2L = this.project(-this.roadWidth / 2, y2, z2);
        let p2R = this.project(this.roadWidth / 2, y2, z2);
        let w1L = this.project(-this.roadWidth / 2, y1 + 180, z1);
        let w1R = this.project(this.roadWidth / 2, y1 + 180, z1);
        let w2L = this.project(-this.roadWidth / 2, y2 + 180, z2);
        let w2R = this.project(this.roadWidth / 2, y2 + 180, z2);
        let out1L = this.project(-this.roadWidth * 3, y1 + 130, z1);
        let out1R = this.project(this.roadWidth * 3, y1 + 130, z1);
        let out2L = this.project(-this.roadWidth * 3, y2 + 130, z2);
        let out2R = this.project(this.roadWidth * 3, y2 + 130, z2);

        if (p1L && p1R && p2L && p2R && w1L && w1R && w2L && w2R) {
          let isDark = (i % 2 === 0);

          // Outer Grass/Scenery
          this.ctx.fillStyle = isDark ? t.outDark : t.outLight;
          if (out1L && out2L) {
            this.ctx.beginPath();
            this.ctx.moveTo(out1L.x, out1L.y); this.ctx.lineTo(w1L.x, w1L.y);
            this.ctx.lineTo(w2L.x, w2L.y); this.ctx.lineTo(out2L.x, out2L.y);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.moveTo(w1R.x, w1R.y); this.ctx.lineTo(out1R.x, out1R.y);
            this.ctx.lineTo(out2R.x, out2R.y); this.ctx.lineTo(w2R.x, w2R.y);
            this.ctx.fill();
          }

          // Side Barriers / Curbs
          this.ctx.fillStyle = isDark ? t.wallDark : t.wallLight;
          this.ctx.beginPath();
          this.ctx.moveTo(p1L.x, p1L.y); this.ctx.lineTo(w1L.x, w1L.y);
          this.ctx.lineTo(w2L.x, w2L.y); this.ctx.lineTo(p2L.x, p2L.y);
          this.ctx.fill();
          this.ctx.fillStyle = isDark ? t.wallTopDark : t.wallTopLight;
          this.ctx.beginPath();
          this.ctx.moveTo(p1R.x, p1R.y); this.ctx.lineTo(w1R.x, w1R.y);
          this.ctx.lineTo(w2R.x, w2R.y); this.ctx.lineTo(p2R.x, p2R.y);
          this.ctx.fill();

          // Main Track Road
          this.ctx.fillStyle = isDark ? t.roadDark : t.roadLight;
          this.ctx.beginPath();
          this.ctx.moveTo(p1L.x, p1L.y); this.ctx.lineTo(p1R.x, p1R.y);
          this.ctx.lineTo(p2R.x, p2R.y); this.ctx.lineTo(p2L.x, p2L.y);
          this.ctx.fill();

          // Lane Markings
          let p1M1 = this.project(-this.roadWidth / 6, y1, z1);
          let p1M2 = this.project(this.roadWidth / 6, y1, z1);
          let p2M1 = this.project(-this.roadWidth / 6, y2, z2);
          let p2M2 = this.project(this.roadWidth / 6, y2, z2);
          if (p1M1 && p1M2 && p2M1 && p2M2) {
            this.ctx.fillStyle = isDark ? t.roadMDark : t.roadMLight;
            this.ctx.beginPath();
            this.ctx.moveTo(p1L.x, p1L.y); this.ctx.lineTo(p1M1.x, p1M1.y);
            this.ctx.lineTo(p2M1.x, p2M1.y); this.ctx.lineTo(p2L.x, p2L.y);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.moveTo(p1M2.x, p1M2.y); this.ctx.lineTo(p1R.x, p1R.y);
            this.ctx.lineTo(p2R.x, p2R.y); this.ctx.lineTo(p2M2.x, p2M2.y);
            this.ctx.fill();
          }
        }
      }

      // Collect & Depth Sort Drawables (Z-Sorting)
      let drawables = [];
      let finishGate = new FinishGate3D(this.finishLineZ);
      drawables.push({ type: 'gate', obj: finishGate, z: this.finishLineZ });

      this.racers.forEach(r => drawables.push({ type: 'racer', obj: r, z: r.z }));
      this.projectiles.forEach(p => drawables.push({ type: 'proj', obj: p, z: p.z }));
      this.scenery.forEach(tr => {
        if (tr.z > this.cameraZ && tr.z < this.cameraZ + this.drawDistance * this.segmentLength) {
          drawables.push({ type: 'tree', obj: tr, z: tr.z });
        }
      });
      this.hazards.forEach(h => {
        if (h.active && h.z > this.cameraZ && h.z < this.cameraZ + this.drawDistance * this.segmentLength) {
          drawables.push({ type: 'hazard', obj: h, z: h.z });
        }
      });

      drawables.sort((a, b) => b.z - a.z);

      drawables.forEach(d => {
        if (d.type === 'racer') d.obj.draw(this.ctx, this);
        else if (d.type === 'proj') d.obj.draw(this.ctx, this);
        else if (d.type === 'gate') d.obj.draw(this.ctx, this);
        else if (d.type === 'tree') d.obj.draw(this.ctx, this);
        else if (d.type === 'hazard') {
          let h = d.obj;
          let hillY = this.getHillY(h.z);

          if (h.type === 'sawblade') {
            let p = this.project(h.x, hillY + 32, h.z);
            if (p) {
              let r = 42 * p.scale;
              this.ctx.save();
              this.ctx.translate(p.x, p.y);
              this.ctx.rotate(h.angle);

              // Circular Saw Blade
              this.ctx.fillStyle = '#b0bec5';
              this.ctx.beginPath(); this.ctx.arc(0, 0, r, 0, Math.PI * 2); this.ctx.fill();

              // Teeth
              this.ctx.fillStyle = '#546e7a';
              for (let i = 0; i < 10; i++) {
                let a = (i / 10) * Math.PI * 2;
                this.ctx.beginPath();
                this.ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
                this.ctx.lineTo(Math.cos(a + 0.16) * (r * 1.3), Math.sin(a + 0.16) * (r * 1.3));
                this.ctx.lineTo(Math.cos(a + 0.32) * r, Math.sin(a + 0.32) * r);
                this.ctx.fill();
              }
              // Center Bolt
              this.ctx.fillStyle = '#e53935';
              this.ctx.beginPath(); this.ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2); this.ctx.fill();
              this.ctx.restore();
            }
          } else if (h.type === 'trap') {
            let p = this.project(h.x, hillY + 12, h.z);
            if (p) {
              let r = 35 * p.scale;
              this.ctx.fillStyle = '#37474f';
              this.ctx.beginPath();
              this.ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
              this.ctx.fill();
              // Serrated Steel Teeth
              this.ctx.fillStyle = '#eceff1';
              for (let i = -r * 0.8; i <= r * 0.8; i += 12 * p.scale) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.x + i, p.y - 4 * p.scale);
                this.ctx.lineTo(p.x + i + 6 * p.scale, p.y - 18 * p.scale);
                this.ctx.lineTo(p.x + i + 12 * p.scale, p.y - 4 * p.scale);
                this.ctx.fill();
              }
            }
          } else if (h.type === 'bounce') {
            let p = this.project(h.x, hillY + 10, h.z);
            if (p) {
              let r = 36 * p.scale;
              this.ctx.fillStyle = '#ff007f';
              this.ctx.beginPath();
              this.ctx.ellipse(p.x, p.y, r, r * 0.45, 0, 0, Math.PI * 2);
              this.ctx.fill();
              this.ctx.fillStyle = '#ffffff';
              this.ctx.beginPath();
              this.ctx.ellipse(p.x, p.y, r * 0.6, r * 0.25, 0, 0, Math.PI * 2);
              this.ctx.fill();
            }
          } else if (h.type === 'speed_pad') {
            let p = this.project(h.x, hillY + 6, h.z);
            if (p) {
              let w = 70 * p.scale;
              let hg = 35 * p.scale;
              this.ctx.fillStyle = '#ffea00';
              this.ctx.beginPath();
              this.ctx.moveTo(p.x - w / 2, p.y + hg / 2);
              this.ctx.lineTo(p.x, p.y - hg / 2);
              this.ctx.lineTo(p.x + w / 2, p.y + hg / 2);
              this.ctx.fill();
            }
          } else if (h.type === 'crate') {
            let hoverY = hillY + 40 + Math.sin(Date.now() * 0.005 + h.z) * 14;
            let p = this.project(h.x, hoverY, h.z);
            if (p) {
              let r = 38 * p.scale;
              this.ctx.fillStyle = '#8d5524';
              this.ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
              this.ctx.strokeStyle = '#ffd166';
              this.ctx.lineWidth = 4 * p.scale;
              this.ctx.strokeRect(p.x - r, p.y - r, r * 2, r * 2);
              this.ctx.fillStyle = '#ffffff';
              this.ctx.font = '900 ' + (44 * p.scale) + 'px "Luckiest Guy", Impact';
              this.ctx.textAlign = 'center';
              this.ctx.textBaseline = 'middle';
              this.ctx.fillText('?', p.x, p.y);
            }
          }
        }
      });

      // Particles
      this.particles.draw(this.ctx, (x, y, z) => this.project(x, y, z));

      // Global Whiteout Flash (Lightning)
      if (this.globalFlashAlpha > 0) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${this.globalFlashAlpha})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.globalFlashAlpha -= dt * 2.8;
      }

      // HUD Rank Updates
      let sorted = [...this.racers].sort((a, b) => b.z - a.z);
      let rank = sorted.indexOf(this.player) + 1;
      if (this.rankDisplay) {
        this.rankDisplay.textContent = rank + (rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th');
        this.rankDisplay.style.color = (rank === 1) ? '#ffea00' : (rank === 4 ? '#ff3b30' : '#ffffff');
      }

      // Mini-Map Track Updates
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

      // Finish Line Trigger
      if (this.player.z >= this.finishLineZ + 350) {
        this.handleFinish();
      }
    }

    handleFinish() {
      this.isPlaying = false;
      this.hideWeaponButton();

      let currentTotalTime = (Date.now() - this.raceStartTime) / 1000;
      this.racers.forEach(r => {
        if (r.finishTime === null) {
          r.finishTime = currentTotalTime + ((this.finishLineZ - r.z) / Math.max(r.speed, 50));
        }
      });

      let finalRanking = [...this.racers].sort((a, b) => a.finishTime - b.finishTime);
      let playerRank = finalRanking.findIndex(r => r.isPlayer) + 1;

      const titleEl = document.getElementById('result3d-title');
      if (titleEl) {
        titleEl.textContent = (playerRank === 1) ? '1. PLATZ! 🏆' : 'PLATZ ' + playerRank + ' 🏁';
        titleEl.style.color = (playerRank === 1) ? '#ffea00' : '#ffffff';
      }

      let lbHTML = '';
      finalRanking.forEach((r, idx) => {
        lbHTML += `
          <li class="leaderboard-item ${r.isPlayer ? 'rank-1' : ''}" style="display:flex; justify-content:space-between; padding:8px 12px; margin-bottom:6px; background:rgba(0,0,0,0.5); border-radius:8px;">
            <span style="color:#ffea00; font-weight:bold;">#${idx + 1} ${r.name}</span>
            <span style="color:#ffffff; font-family:monospace;">${formatTime(r.finishTime)}</span>
          </li>
        `;
      });

      if (this.resultsList) this.resultsList.innerHTML = lbHTML;
      if (this.resultsScreen) this.resultsScreen.classList.remove('hidden');
      sfx.play('start');
    }

    stopAndReturnToMenu() {
      this.isPlaying = false;
      if (this.activeVideoStream) {
        this.activeVideoStream.getTracks().forEach(t => t.stop());
        this.activeVideoStream = null;
      }
      if (this.wakeLockSentinel) {
        this.wakeLockSentinel.release().catch(() => {});
        this.wakeLockSentinel = null;
      }

      // Hide 3D Canvas & UI
      if (this.canvas) this.canvas.classList.add('hidden');
      if (this.uiOverlay) this.uiOverlay.classList.add('hidden');
      if (this.resultsScreen) this.resultsScreen.classList.add('hidden');
      if (this.levelSelectScreen) this.levelSelectScreen.classList.add('hidden');
      if (this.bloodOverlay) this.bloodOverlay.classList.add('hidden');
      const gameSelectScreen = document.getElementById('game-select-screen');
      if (gameSelectScreen) {
        gameSelectScreen.style.display = 'none';
        gameSelectScreen.classList.add('hidden');
      }

      // Restore 2D Main Menu
      const mainMenuScreen = document.getElementById('main-menu-screen');
      if (mainMenuScreen) {
        mainMenuScreen.style.display = 'flex';
        mainMenuScreen.classList.remove('hidden');
      }
      const canvas2d = document.getElementById('gameCanvas');
      if (canvas2d) canvas2d.classList.remove('hidden');
    }

    setPlayerAnimal(animal) {
      this.selectedAnimal = animal;
      if (this.player) {
        this.player.animal = animal;
        this.player.setupPalette();
      }
    }
  }

  // Export Global Instance
  window.funRun3D = new FunRun3DEngine();

})();
