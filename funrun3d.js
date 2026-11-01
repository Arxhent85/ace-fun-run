// ============================================================================
// FUN RUN 3D / POCKET RUN - THREE.JS WEBGL RACING ENGINE
// True 3D Smooth Mesh World, Dynamic Camera, Physics, Sound & Fun Run Combat
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

    spawnSparks(x, y, z, count = 16, colorHex = 0xffea00) {
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
        p.vy -= 22 * dt; // gravity
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
  // 3. 3D RACER CHARACTER (Fun Run Animals: Bear, Fox, Beaver, Eagle)
  // --------------------------------------------------------------------------
  class Racer3D {
    constructor(laneIndex, animal, isPlayer, name, engine) {
      this.laneIndex = laneIndex; // 0: Left (-4.6), 1: Center (0), 2: Right (+4.6)
      this.x = (laneIndex - 1) * 4.6;
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
      const shadowGeo = new THREE.CircleGeometry(0.7, 16);
      shadowGeo.rotateX(-Math.PI / 2);
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38 });
      this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      this.engine.scene.add(this.shadowMesh);

      // DU / Indicator Badge
      if (this.isPlayer) {
        this.badgeSprite = this.createBadgeSprite('DU');
        this.badgeSprite.position.y = 2.4;
        this.group.add(this.badgeSprite);
      }
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
      sprite.scale.set(1.8, 0.9, 1);
      return sprite;
    }

    buildAnimalModel() {
      // Clear any existing children
      while (this.group.children.length > 0) {
        this.group.remove(this.group.children[0]);
      }

      let mainColor = 0x8d5524, bellyColor = 0xc68642, darkColor = 0x5c3311;
      if (this.animal === 'fox') {
        mainColor = 0xff6b35; bellyColor = 0xffffff; darkColor = 0x222222;
      } else if (this.animal === 'beaver') {
        mainColor = 0x9a5c37; bellyColor = 0xdfa06e; darkColor = 0x422413;
      } else if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        mainColor = 0x4a3b32; bellyColor = 0xffffff; darkColor = 0xffb703;
      }

      this.bodyMat = new THREE.MeshLambertMaterial({ color: mainColor });
      this.bellyMat = new THREE.MeshLambertMaterial({ color: bellyColor });
      this.darkMat = new THREE.MeshLambertMaterial({ color: darkColor });

      // Torso
      const torsoGeo = new THREE.SphereGeometry(0.72, 14, 12);
      torsoGeo.scale(1.0, 1.25, 0.92);
      this.torsoMesh = new THREE.Mesh(torsoGeo, this.bodyMat);
      this.torsoMesh.position.y = 0.9;
      this.torsoMesh.castShadow = true;
      this.group.add(this.torsoMesh);

      // Belly Patch
      const bellyGeo = new THREE.SphereGeometry(0.55, 12, 10);
      bellyGeo.scale(0.85, 0.95, 0.35);
      const bellyMesh = new THREE.Mesh(bellyGeo, this.bellyMat);
      bellyMesh.position.set(0, 0.85, 0.6);
      this.group.add(bellyMesh);

      // Head
      const headGeo = new THREE.SphereGeometry(0.56, 14, 12);
      this.headMesh = new THREE.Mesh(headGeo, this.bodyMat);
      this.headMesh.position.set(0, 1.7, 0.1);
      this.headMesh.castShadow = true;
      this.group.add(this.headMesh);

      // Snout / Beak
      if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        const beakGeo = new THREE.ConeGeometry(0.22, 0.45, 6);
        beakGeo.rotateX(Math.PI / 2);
        const beak = new THREE.Mesh(beakGeo, this.darkMat);
        beak.position.set(0, 1.62, 0.65);
        this.group.add(beak);
      } else {
        const snoutGeo = new THREE.SphereGeometry(0.3, 10, 8);
        snoutGeo.scale(1.0, 0.75, 0.8);
        const snout = new THREE.Mesh(snoutGeo, this.bellyMat);
        snout.position.set(0, 1.6, 0.52);
        this.group.add(snout);

        const noseGeo = new THREE.SphereGeometry(0.1, 6, 6);
        const nose = new THREE.Mesh(noseGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
        nose.position.set(0, 1.68, 0.76);
        this.group.add(nose);
      }

      // Ears
      if (this.animal === 'bear') {
        const earGeo = new THREE.SphereGeometry(0.22, 10, 8);
        const earL = new THREE.Mesh(earGeo, this.darkMat);
        earL.position.set(-0.45, 2.15, 0.05);
        const earR = new THREE.Mesh(earGeo, this.darkMat);
        earR.position.set(0.45, 2.15, 0.05);
        this.group.add(earL);
        this.group.add(earR);
      } else if (this.animal === 'fox') {
        const earGeo = new THREE.ConeGeometry(0.22, 0.55, 6);
        const earL = new THREE.Mesh(earGeo, this.bodyMat);
        earL.position.set(-0.35, 2.25, 0.05);
        earL.rotation.z = 0.2;
        const earR = new THREE.Mesh(earGeo, this.bodyMat);
        earR.position.set(0.35, 2.25, 0.05);
        earR.rotation.z = -0.2;
        this.group.add(earL);
        this.group.add(earR);
      } else if (this.animal === 'beaver') {
        const tailGeo = new THREE.BoxGeometry(0.55, 0.12, 0.85);
        const tail = new THREE.Mesh(tailGeo, this.darkMat);
        tail.position.set(0, 0.55, -0.65);
        tail.rotation.x = -0.3;
        this.group.add(tail);
      }

      // Running Paws / Feet
      const pawGeo = new THREE.SphereGeometry(0.24, 8, 8);
      pawGeo.scale(1.0, 0.6, 1.3);
      this.pawL = new THREE.Mesh(pawGeo, this.darkMat);
      this.pawR = new THREE.Mesh(pawGeo, this.darkMat);
      this.pawL.position.set(-0.36, 0.15, 0.1);
      this.pawR.position.set(0.36, 0.15, -0.1);
      this.group.add(this.pawL);
      this.group.add(this.pawR);

      // Shield Bubble Aura (hidden until active)
      const shieldGeo = new THREE.SphereGeometry(1.4, 16, 12);
      const shieldMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      });
      this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      this.shieldMesh.position.y = 1.1;
      this.shieldMesh.visible = false;
      this.group.add(this.shieldMesh);
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
        // Double jump in mid-air with 360° flip & golden sparks!
        this.vy = 13.8;
        this.jumpCount = 2;
        this.isFlipping = true;
        this.flipAngle = 0.05;
        if (this.isPlayer) sfx.play('double_jump');
        this.engine.particles.spawnSparks(this.x, this.engine.getHillY(this.z) + this.jumpY + 0.5, this.z, 20);
      }
    }

    usePowerup() {
      if (!this.currentWeapon || this.dead) return;
      const wp = this.currentWeapon;
      this.currentWeapon = null;
      if (this.isPlayer) this.engine.hideWeaponButton();

      if (wp === 'blade') {
        sfx.play('blade_act');
        this.engine.spawnSawblade(this.x, this.z, this);
      } else if (wp === 'trap') {
        sfx.play('trap_act');
        this.engine.spawnTrap(this.x, this.z - 3.0, this);
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
        this.vy -= 34.0 * dt; // Gravity
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
          const lanes = [-4.6, 0, 4.6];
          this.targetX = lanes[Math.floor(Math.random() * lanes.length)];
          this.aiTimer = 1.2 + Math.random() * 2.0;
        }

        // Random weapon usage
        if (this.currentWeapon && Math.random() < 0.03) {
          this.usePowerup();
        }

        // Avoid boulders
        for (let r of this.engine.rocks) {
          if (r.active && r.z > this.z && (r.z - this.z) < 14.0 && Math.abs(r.x - this.x) < 2.0) {
            if (Math.random() < 0.75) {
              this.jump();
            } else {
              const openLanes = [-4.6, 0, 4.6].filter(l => Math.abs(l - r.x) > 2.0);
              if (openLanes.length > 0) this.targetX = openLanes[0];
            }
          }
        }
      }

      // Synchronize 3D Object Hierarchy
      const trackCurveX = this.engine.getCurveX(this.z);
      const groundY = this.engine.getHillY(this.z);
      const finalX = trackCurveX + this.x;
      const finalY = groundY + this.jumpY;

      this.group.position.set(finalX, finalY, this.z);

      // Tilting & Somersault Rotation
      const laneTilt = (this.targetX - this.x) * -0.06;
      if (this.isFlipping) {
        this.group.rotation.set(this.flipAngle, 0, laneTilt);
      } else {
        this.group.rotation.set(0, 0, laneTilt);
      }

      // Animated Paws (Running swing cycle)
      if (!this.isJumping && this.speed > 2.0) {
        const runCycle = this.z * 1.5;
        this.pawL.position.z = Math.sin(runCycle) * 0.35;
        this.pawR.position.z = Math.sin(runCycle + Math.PI) * 0.35;
      } else {
        this.pawL.position.z = 0;
        this.pawR.position.z = 0;
      }

      // Contact Shadow directly on the ground
      this.shadowMesh.position.set(finalX, groundY + 0.05, this.z);
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
      this.raceStartTime = 0;
      this.controlMode = 'touch';
      this.currentLevel = 1;
      this.selectedAnimal = 'bear';

      this.finishLineZ = 1200; // ~55 second race at speed 22 m/s
      this.cameraShake = 0;

      this.player = null;
      this.racers = [];
      this.rocks = [];
      this.crates = [];
      this.speedPads = [];
      this.bouncePads = [];
      this.projectiles = [];
      this.traps = [];
      this.particles = null;

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

      this.initThree();
      this.initEvents();
    }

    initThree() {
      if (!this.canvas) return;

      const w = window.innerWidth;
      const h = window.innerHeight;

      // WebGL Renderer with Antialiasing
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // 3D Scene with Sunset Valley Atmosphere
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xff8c42);
      this.scene.fog = new THREE.FogExp2(0xff9944, 0.0022);

      // Perspective Camera (Subway Surfers & Fun Run tight follower)
      this.camera = new THREE.PerspectiveCamera(54, w / h, 0.5, 450);

      // Lighting (Warm Sun & Rich Meadow Ambient)
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
      this.scene.add(this.ambientLight);

      this.hemiLight = new THREE.HemisphereLight(0xffe2b8, 0x3d7028, 0.65);
      this.scene.add(this.hemiLight);

      this.dirLight = new THREE.DirectionalLight(0xfffaed, 1.25);
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.camera.near = 1.0;
      this.dirLight.shadow.camera.far = 160;
      this.dirLight.shadow.camera.left = -28;
      this.dirLight.shadow.camera.right = 28;
      this.dirLight.shadow.camera.top = 28;
      this.dirLight.shadow.camera.bottom = -28;
      this.scene.add(this.dirLight);
      this.scene.add(this.dirLight.target);

      this.particles = new ParticleSystem3D(this.scene);
    }

    // ------------------------------------------------------------------------
    // TRACK MATHEMATICS (Smooth continuous curves, rolling hills, bridges)
    // ------------------------------------------------------------------------
    getCurveX(z) {
      return Math.sin(z * 0.012) * 16.0 + Math.sin(z * 0.005) * 10.0;
    }

    isBridge(z) {
      return (z >= 240 && z <= 390) || (z >= 740 && z <= 890);
    }

    getHillY(z) {
      // Silky smooth rolling hills that crest and slope naturally
      let h = Math.sin(z * 0.016) * 4.8 + Math.sin(z * 0.006) * 7.2;
      if (this.isBridge(z)) {
        // High arched suspension bridge over deep gorge
        let start = (z < 500) ? 240 : 740;
        let span = 150;
        let t = (z - start) / span;
        h += Math.sin(t * Math.PI) * 5.0;
      }
      return h;
    }

    getGroundY(x, z) {
      const cx = this.getCurveX(z);
      const distFromCenter = Math.abs(x - cx);
      const trackH = this.getHillY(z);
      if (this.isBridge(z)) {
        if (distFromCenter <= 7.2) return trackH;
        return trackH - 24.0; // Abyss below bridge
      }
      const outerSlope = Math.max(0, distFromCenter - 7.0) * -0.06;
      const hillWave = Math.sin(x * 0.03 + z * 0.01) * 1.5;
      return trackH + outerSlope + hillWave;
    }

    // ------------------------------------------------------------------------
    // WORLD & GEOMETRY GENERATION
    // ------------------------------------------------------------------------
    buildTrackMesh() {
      // Remove old track mesh if present
      if (this.trackMesh) this.scene.remove(this.trackMesh);

      const segStep = 3.0;
      const segCount = Math.ceil((this.finishLineZ + 150) / segStep);

      // Width profiles: 12 vertices per cross-section
      // [-45, -14, -8.5, -7.5, -7.0, -2.3, 0, +2.3, +7.0, +7.5, +8.5, +14, +45]
      const lateralOffsets = [-45, -15, -8.5, -7.5, -7.0, -2.3, 0, 2.3, 7.0, 7.5, 8.5, 15, 45];
      const pointsPerSeg = lateralOffsets.length;

      const positions = [];
      const normals = [];
      const colors = [];
      const indices = [];

      for (let i = 0; i <= segCount; i++) {
        const z = i * segStep;
        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const onBridge = this.isBridge(z);

        // Track normal vector (perpendicular to curvature)
        const dx = this.getCurveX(z + 0.5) - this.getCurveX(z - 0.5);
        const len = Math.sqrt(dx * dx + 1);
        const nx = 1 / len;
        const nz = -dx / len;

        const isEvenSeg = (i % 2 === 0);

        for (let j = 0; j < pointsPerSeg; j++) {
          const w = lateralOffsets[j];
          const vx = cx + nx * w;
          const vz = z + nz * w;
          let vy = cy;

          // Color selection
          let r = 0.24, g = 0.65, b = 0.22; // Lush green meadow

          if (Math.abs(w) > 14) {
            // Far outer rolling terrain
            vy = this.getGroundY(vx, vz);
            r = 0.12; g = 0.38; b = 0.12;
          } else if (Math.abs(w) > 7.5) {
            // Earthy curb embankment slope
            vy = onBridge ? (cy - 12.0) : (cy - 0.45);
            r = 0.38; g = 0.24; b = 0.13; // Brown rock/soil
          } else if (Math.abs(w) > 7.0) {
            // Top green grass lip on curb
            vy = cy + 0.15;
            r = 0.42; g = 0.78; b = 0.28;
          } else {
            // Running Track (Green meadow mowing stripes or wooden bridge planks)
            if (onBridge) {
              r = isEvenSeg ? 0.55 : 0.45;
              g = isEvenSeg ? 0.33 : 0.27;
              b = isEvenSeg ? 0.16 : 0.13;
            } else {
              r = isEvenSeg ? 0.27 : 0.23;
              g = isEvenSeg ? 0.67 : 0.60;
              b = isEvenSeg ? 0.24 : 0.21;
            }
          }

          positions.push(vx, vy, vz);
          normals.push(0, 1, 0);
          colors.push(r, g, b);
        }
      }

      // Generate Quad Face Indices
      for (let i = 0; i < segCount; i++) {
        const row1 = i * pointsPerSeg;
        const row2 = (i + 1) * pointsPerSeg;
        for (let j = 0; j < pointsPerSeg - 1; j++) {
          const a = row1 + j;
          const b = row2 + j;
          const c = row2 + j + 1;
          const d = row1 + j + 1;
          indices.push(a, b, d);
          indices.push(b, c, d);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.82,
        metalness: 0.08,
        flatShading: false
      });

      this.trackMesh = new THREE.Mesh(geo, mat);
      this.trackMesh.receiveShadow = true;
      this.scene.add(this.trackMesh);
    }

    buildBridgeDetails() {
      this.bridgeGroup = new THREE.Group();
      const intervals = [[240, 390], [740, 890]];

      const postGeo = new THREE.CylinderGeometry(0.18, 0.2, 2.2, 6);
      const postMat = new THREE.MeshLambertMaterial({ color: 0x5c3311 });
      const ropeMat = new THREE.MeshLambertMaterial({ color: 0xd4a373 });
      const pierGeo = new THREE.BoxGeometry(0.8, 25, 0.8);
      const pierMat = new THREE.MeshLambertMaterial({ color: 0x3d2212 });

      for (const [startZ, endZ] of intervals) {
        for (let z = startZ; z <= endZ; z += 6.0) {
          const cx = this.getCurveX(z);
          const cy = this.getHillY(z);

          // Left Post
          const pL = new THREE.Mesh(postGeo, postMat);
          pL.position.set(cx - 7.2, cy + 1.1, z);
          this.bridgeGroup.add(pL);

          // Right Post
          const pR = new THREE.Mesh(postGeo, postMat);
          pR.position.set(cx + 7.2, cy + 1.1, z);
          this.bridgeGroup.add(pR);

          // Deep Piers into gorge
          if ((z - startZ) % 18 === 0) {
            const pierL = new THREE.Mesh(pierGeo, pierMat);
            pierL.position.set(cx - 7.2, cy - 12.5, z);
            this.bridgeGroup.add(pierL);

            const pierR = new THREE.Mesh(pierGeo, pierMat);
            pierR.position.set(cx + 7.2, cy - 12.5, z);
            this.bridgeGroup.add(pierR);
          }
        }
      }

      this.scene.add(this.bridgeGroup);
    }

    buildSceneryTrees() {
      this.sceneryGroup = new THREE.Group();

      const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, 3.8, 6);
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3e2311 });
      const foliageGeo = new THREE.DodecahedronGeometry(2.0, 0);
      const fMat1 = new THREE.MeshLambertMaterial({ color: 0x1f4e1f });
      const fMat2 = new THREE.MeshLambertMaterial({ color: 0x2b6e2b });

      for (let z = 30; z < this.finishLineZ + 80; z += 18 + Math.random() * 12) {
        if (this.isBridge(z)) continue; // Never on bridges!

        for (let side of [-1, 1]) {
          const dist = 13.0 + Math.random() * 20.0;
          const x = this.getCurveX(z) + side * dist;
          const y = this.getGroundY(x, z);

          const tree = new THREE.Group();
          tree.position.set(x, y, z);

          const trunk = new THREE.Mesh(trunkGeo, trunkMat);
          trunk.position.y = 1.9;
          trunk.castShadow = true;
          tree.add(trunk);

          const fol1 = new THREE.Mesh(foliageGeo, fMat1);
          fol1.position.set(0, 4.2, 0);
          fol1.scale.set(1.1, 1.2, 1.1);
          fol1.castShadow = true;
          tree.add(fol1);

          const fol2 = new THREE.Mesh(foliageGeo, fMat2);
          fol2.position.set((Math.random() - 0.5) * 0.8, 5.4, (Math.random() - 0.5) * 0.8);
          fol2.scale.set(0.9, 0.9, 0.9);
          fol2.castShadow = true;
          tree.add(fol2);

          this.sceneryGroup.add(tree);
        }
      }

      this.scene.add(this.sceneryGroup);
    }

    buildFinishGate() {
      this.finishGateGroup = new THREE.Group();
      const z = this.finishLineZ;
      const cx = this.getCurveX(z);
      const cy = this.getHillY(z);

      const pillarGeo = new THREE.BoxGeometry(0.9, 9.0, 0.9);
      const woodMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
      const pL = new THREE.Mesh(pillarGeo, woodMat);
      pL.position.set(cx - 7.5, cy + 4.5, z);
      const pR = new THREE.Mesh(pillarGeo, woodMat);
      pR.position.set(cx + 7.5, cy + 4.5, z);
      this.finishGateGroup.add(pL);
      this.finishGateGroup.add(pR);

      // Top Crossbar
      const barGeo = new THREE.BoxGeometry(16.5, 2.2, 0.8);
      const bar = new THREE.Mesh(barGeo, new THREE.MeshLambertMaterial({ color: 0xffd166 }));
      bar.position.set(cx, cy + 8.2, z);
      this.finishGateGroup.add(bar);

      // Checkered Canvas Banner
      const bannerCanvas = document.createElement('canvas');
      bannerCanvas.width = 512;
      bannerCanvas.height = 128;
      const bctx = bannerCanvas.getContext('2d');
      bctx.fillStyle = '#ffd166';
      bctx.fillRect(0, 0, 512, 128);
      bctx.fillStyle = '#111111';
      bctx.font = '900 80px "Luckiest Guy", Impact, Arial';
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      bctx.fillText('FINISH', 256, 64);
      const bannerTex = new THREE.CanvasTexture(bannerCanvas);
      const bannerPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(14, 2.0),
        new THREE.MeshBasicMaterial({ map: bannerTex })
      );
      bannerPlane.position.set(cx, cy + 8.2, z + 0.42);
      this.finishGateGroup.add(bannerPlane);

      this.scene.add(this.finishGateGroup);
    }

    // ------------------------------------------------------------------------
    // INTERACTIVE TRACK ELEMENTS (Boulders, Crates, Speed Pads, Bounce Pads)
    // ------------------------------------------------------------------------
    spawnWorldElements() {
      this.clearWorldElements();
      const lanes = [-4.6, 0, 4.6];

      // Procedural distribution along the track
      for (let z = 50; z < this.finishLineZ - 30; z += 24 + Math.random() * 12) {
        const rand = Math.random();
        const laneX = lanes[Math.floor(Math.random() * lanes.length)];
        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const worldX = cx + laneX;

        if (rand > 0.65) {
          // Mystery Powerup Crate
          this.createCrate(worldX, cy + 1.6, z, laneX);
        } else if (rand > 0.36) {
          // Rock Boulder (Jump over it or change lanes!)
          this.createRock(worldX, cy + 0.7, z, laneX);
        } else if (rand > 0.20) {
          // Bounce Trampoline
          this.createBouncePad(worldX, cy + 0.1, z, laneX);
        } else {
          // Speed Booster Strip
          this.createSpeedPad(worldX, cy + 0.08, z, laneX);
        }
      }
    }

    createRock(x, y, z, laneX) {
      const geo = new THREE.DodecahedronGeometry(1.15, 0);
      geo.scale(1.2, 0.9, 1.1);
      const mat = new THREE.MeshStandardMaterial({ color: 0x546e7a, roughness: 0.9, metalness: 0.1 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      mesh.castShadow = true;
      this.scene.add(mesh);
      this.rocks.push({ mesh, x, z, laneX, active: true });
    }

    createCrate(x, y, z, laneX) {
      const boxGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4);
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const c = canvas.getContext('2d');
      c.fillStyle = '#8d5524';
      c.fillRect(0, 0, 128, 128);
      c.strokeStyle = '#ffd166';
      c.lineWidth = 10;
      c.strokeRect(5, 5, 118, 118);
      c.fillStyle = '#ffffff';
      c.font = '900 80px "Luckiest Guy", Impact';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('?', 64, 64);
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshLambertMaterial({ map: tex });
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.crates.push({ mesh, x, z, baseY: y, active: true, respawnTimer: 0 });
    }

    createSpeedPad(x, y, z, laneX) {
      const geo = new THREE.PlaneGeometry(2.4, 3.5);
      geo.rotateX(-Math.PI / 2);
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const c = canvas.getContext('2d');
      c.fillStyle = '#ffea00';
      c.beginPath();
      c.moveTo(64, 10);
      c.lineTo(110, 70);
      c.lineTo(84, 70);
      c.lineTo(84, 120);
      c.lineTo(44, 120);
      c.lineTo(44, 70);
      c.lineTo(18, 70);
      c.closePath();
      c.fill();
      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.speedPads.push({ mesh, x, z, active: true });
    }

    createBouncePad(x, y, z, laneX) {
      const geo = new THREE.CylinderGeometry(1.2, 1.3, 0.22, 16);
      const mat = new THREE.MeshStandardMaterial({ color: 0xff007f, roughness: 0.3 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.bouncePads.push({ mesh, x, z, active: true });
    }

    spawnSawblade(x, z, owner) {
      const geo = new THREE.CylinderGeometry(1.3, 1.3, 0.15, 12);
      geo.rotateX(Math.PI / 2);
      const mat = new THREE.MeshStandardMaterial({ color: 0xb0bec5, metalness: 0.8, roughness: 0.2 });
      const mesh = new THREE.Mesh(geo, mat);
      const cy = this.getHillY(z) + 0.8;
      mesh.position.set(this.getCurveX(z) + x, cy, z + 2.0);
      this.scene.add(mesh);
      this.projectiles.push({ mesh, x, z: z + 2.0, speed: 44.0, owner, active: true });
    }

    spawnTrap(x, z, owner) {
      const geo = new THREE.BoxGeometry(1.6, 0.18, 1.6);
      const mat = new THREE.MeshStandardMaterial({ color: 0x37474f, metalness: 0.7, roughness: 0.3 });
      const mesh = new THREE.Mesh(geo, mat);
      const cy = this.getHillY(z) + 0.1;
      mesh.position.set(this.getCurveX(z) + x, cy, z);
      this.scene.add(mesh);
      this.traps.push({ mesh, x, z, active: true });
    }

    triggerLightning(attacker) {
      this.racers.forEach(r => {
        if (r !== attacker && !r.dead) {
          r.takeDamage('lightning');
        }
      });
      // Camera shake
      this.cameraShake = 0.8;
    }

    clearWorldElements() {
      for (let r of this.rocks) this.scene.remove(r.mesh);
      for (let c of this.crates) this.scene.remove(c.mesh);
      for (let s of this.speedPads) this.scene.remove(s.mesh);
      for (let b of this.bouncePads) this.scene.remove(b.mesh);
      for (let p of this.projectiles) this.scene.remove(p.mesh);
      for (let t of this.traps) this.scene.remove(t.mesh);
      this.rocks = [];
      this.crates = [];
      this.speedPads = [];
      this.bouncePads = [];
      this.projectiles = [];
      this.traps = [];
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

      // Keyboard Controls
      window.addEventListener('keydown', (e) => {
        if (!this.isPlaying || !this.player) return;
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          this.player.laneIndex = Math.max(0, this.player.laneIndex - 1);
          this.player.targetX = (this.player.laneIndex - 1) * 4.6;
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          this.player.laneIndex = Math.min(2, this.player.laneIndex + 1);
          this.player.targetX = (this.player.laneIndex - 1) * 4.6;
        } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
          this.player.jump();
        } else if (e.key === 'x' || e.key === 'X' || e.key === 'Shift' || e.key === 'Enter') {
          if (this.player.currentWeapon) this.player.usePowerup();
        }
      });

      // Touch & Swipe Controls
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
          // Swipe Right -> Change lane to the right
          else if (diffX > 35 && Math.abs(diffX) > Math.abs(diffY) * 0.6) {
            if (this.player.laneIndex < 2) {
              this.player.laneIndex++;
              this.player.targetX = (this.player.laneIndex - 1) * 4.6;
            }
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
          // Swipe Left -> Change lane to the left
          else if (diffX < -35 && Math.abs(diffX) > Math.abs(diffY) * 0.6) {
            if (this.player.laneIndex > 0) {
              this.player.laneIndex--;
              this.player.targetX = (this.player.laneIndex - 1) * 4.6;
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

      // Wooden Fire Action Button (Power-Up)
      if (this.weaponBtn) {
        this.weaponBtn.addEventListener('click', () => {
          if (this.player) this.player.usePowerup();
        });
        this.weaponBtn.addEventListener('touchstart', (e) => {
          e.stopPropagation();
          if (this.player) this.player.usePowerup();
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

    // ------------------------------------------------------------------------
    // RACE LIFECYCLE
    // ------------------------------------------------------------------------
    startRace(mode = 'touch', level = 1) {
      sfx.init();
      this.controlMode = mode;
      this.currentLevel = level;

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

      const timer = setInterval(() => {
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
      // Clear previous racers
      for (let r of this.racers) r.destroy();
      this.racers = [];
      this.particles.clear();
      this.hideWeaponButton();

      // Build 3D World Geometry
      this.buildTrackMesh();
      this.buildBridgeDetails();
      this.buildSceneryTrees();
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
              // Stumble & speed penalty
              r.stumbleTimer = 0.75;
              r.speed *= 0.45;
              sfx.play('rock_hit');
              this.particles.spawnDust(r.x, this.getHillY(r.z) + 0.3, r.z, 8);
              if (r.isPlayer) this.cameraShake = 0.55;
            }
          }
        }

        // 2. Mystery Crates
        for (let crate of this.crates) {
          if (!crate.active) continue;
          const dz = Math.abs(r.z - crate.z);
          const dx = Math.abs(r.x - (crate.x - this.getCurveX(crate.z)));
          if (dz < 1.4 && dx < 1.6) {
            crate.active = false;
            crate.mesh.visible = false;
            crate.respawnTimer = 5.0;
            sfx.play('pickup');

            const weapons = ['blade', 'trap', 'speed', 'shield', 'lightning'];
            r.currentWeapon = weapons[Math.floor(Math.random() * weapons.length)];
            if (r.isPlayer) this.showWeaponButton(r.currentWeapon);
          }
        }

        // 3. Speed Booster Pads
        for (let pad of this.speedPads) {
          const dz = Math.abs(r.z - pad.z);
          const dx = Math.abs(r.x - (pad.x - this.getCurveX(pad.z)));
          if (dz < 1.5 && dx < 1.5 && r.jumpY < 0.6) {
            r.speedBoostTimer = 2.5;
            r.speed = r.baseSpeed * 1.55;
            sfx.play('speed_act');
          }
        }

        // 4. Bounce Trampolines
        for (let pad of this.bouncePads) {
          const dz = Math.abs(r.z - pad.z);
          const dx = Math.abs(r.x - (pad.x - this.getCurveX(pad.z)));
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

        // 5. Placed Bear Traps
        for (let trap of this.traps) {
          if (!trap.active) continue;
          const dz = Math.abs(r.z - trap.z);
          const dx = Math.abs(r.x - trap.x);
          if (dz < 1.2 && dx < 1.3 && r.jumpY < 0.5) {
            trap.active = false;
            this.scene.remove(trap.mesh);
            r.takeDamage('trap');
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
            if (dz < 1.5 && dx < 1.5) {
              p.active = false;
              this.scene.remove(p.mesh);
              r.takeDamage('blade');
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

      // Update Racers & Physics
      this.racers.forEach(r => r.update(dt));
      this.particles.update(dt);

      // Rotate Crates & Handle Respawns
      this.crates.forEach(c => {
        if (c.active) {
          c.mesh.rotation.y += dt * 2.2;
          c.mesh.position.y = c.baseY + Math.sin(currentTime * 0.004 + c.z) * 0.2;
        } else if (c.respawnTimer > 0) {
          c.respawnTimer -= dt;
          if (c.respawnTimer <= 0) {
            c.active = true;
            c.mesh.visible = true;
          }
        }
      });

      // Update Projectiles
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.z += p.speed * dt;
        p.mesh.rotation.z += dt * 22;
        const cy = this.getHillY(p.z) + 0.8;
        p.mesh.position.set(this.getCurveX(p.z) + p.x, cy, p.z);
        if (p.z > this.finishLineZ + 50 || p.z - this.player.z > 150) {
          this.scene.remove(p.mesh);
          this.projectiles.splice(i, 1);
        }
      }

      this.checkCollisions();

      // Camera Follower (Silky smooth 3rd person tracking directly behind player)
      const p = this.player;
      const curveX = this.getCurveX(p.z);
      const groundY = this.getHillY(p.z);

      const targetCamX = curveX + p.x * 0.75;
      const targetCamY = groundY + 4.6 + p.jumpY * 0.35;
      const targetCamZ = p.z - 11.5;

      this.camera.position.x += (targetCamX - this.camera.position.x) * 12.0 * dt;
      this.camera.position.y += (targetCamY - this.camera.position.y) * 10.0 * dt;
      this.camera.position.z = targetCamZ;

      if (this.cameraShake > 0) {
        this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
        this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
        this.cameraShake = Math.max(0, this.cameraShake - 2.5 * dt);
      }

      const lookAheadZ = p.z + 14.0;
      const lookX = this.getCurveX(lookAheadZ) + p.x * 0.25;
      const lookY = this.getHillY(lookAheadZ) + 2.0;
      this.camera.lookAt(lookX, lookY, lookAheadZ);

      // Sun Light Target Tracking Player
      this.dirLight.position.set(targetCamX + 22, targetCamY + 35, targetCamZ + 15);
      this.dirLight.target.position.set(targetCamX, targetCamY, targetCamZ + 20);

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
          r.finishTime = currentTotalTime + (this.finishLineZ - r.z) / Math.max(r.speed, 5);
        }
      });

      const finalRanking = [...this.racers].sort((a, b) => a.finishTime - b.finishTime);
      const playerRank = finalRanking.findIndex(r => r.isPlayer) + 1;

      const titleEl = document.getElementById('result3d-title');
      if (titleEl) {
        titleEl.textContent = playerRank === 1 ? '1. PLATZ! 🏆' : 'PLATZ ' + playerRank + ' 🏁';
        titleEl.style.color = playerRank === 1 ? '#ffea00' : '#ffffff';
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
        this.player.buildAnimalModel();
      }
    }
  }

  // Global Engine Instance
  window.funRun3D = new FunRun3DEngine();
})();
