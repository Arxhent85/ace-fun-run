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
      const shadowGeo = new THREE.CircleGeometry(0.75, 16);
      shadowGeo.rotateX(-Math.PI / 2);
      const shadowMat = new THREE.MeshBasicMaterial({ color: 0x0a1f0a, transparent: true, opacity: 0.42 });
      this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      this.engine.scene.add(this.shadowMesh);

      // DU / Indicator Badge
      if (this.isPlayer) {
        this.badgeSprite = this.createBadgeSprite('DU');
        this.badgeSprite.position.y = 2.6;
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
      sprite.scale.set(1.9, 0.95, 1);
      return sprite;
    }

    buildAnimalModel() {
      while (this.group.children.length > 0) {
        this.group.remove(this.group.children[0]);
      }

      let mainColor = 0x8d5524, bellyColor = 0xf5d6ba, darkColor = 0x542e11, earInnerColor = 0xffa8b8;
      if (this.animal === 'fox') {
        mainColor = 0xff6b35; bellyColor = 0xffffff; darkColor = 0x222222; earInnerColor = 0xffc4aa;
      } else if (this.animal === 'beaver') {
        mainColor = 0x8a4b27; bellyColor = 0xdfa06e; darkColor = 0x3d1f0e; earInnerColor = 0xdfa06e;
      } else if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        mainColor = 0x3d3027; bellyColor = 0xffffff; darkColor = 0xffb703; earInnerColor = 0xffb703;
      }

      this.bodyMat = new THREE.MeshLambertMaterial({ color: mainColor });
      this.bellyMat = new THREE.MeshLambertMaterial({ color: bellyColor });
      this.darkMat = new THREE.MeshLambertMaterial({ color: darkColor });
      this.innerEarMat = new THREE.MeshLambertMaterial({ color: earInnerColor });
      this.eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.eyePupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      this.shoeMat = new THREE.MeshLambertMaterial({ color: 0xd32f2f }); // Red running sneakers
      this.soleMat = new THREE.MeshLambertMaterial({ color: 0xffffff });

      // 1. Torso
      const torsoGeo = new THREE.SphereGeometry(0.72, 16, 14);
      torsoGeo.scale(1.0, 1.25, 0.95);
      this.torsoMesh = new THREE.Mesh(torsoGeo, this.bodyMat);
      this.torsoMesh.position.y = 0.92;
      this.torsoMesh.castShadow = true;
      this.group.add(this.torsoMesh);

      // Creamy Belly Wrap
      const bellyGeo = new THREE.SphereGeometry(0.56, 14, 12);
      bellyGeo.scale(0.85, 0.96, 0.38);
      const bellyMesh = new THREE.Mesh(bellyGeo, this.bellyMat);
      bellyMesh.position.set(0, 0.88, 0.62);
      this.group.add(bellyMesh);

      // Racing Harness / Collar with Gold Star
      const collarGeo = new THREE.TorusGeometry(0.68, 0.08, 8, 16);
      collarGeo.rotateX(Math.PI / 2);
      const collar = new THREE.Mesh(collarGeo, new THREE.MeshLambertMaterial({ color: 0x1976d2 }));
      collar.position.set(0, 1.35, 0.1);
      this.group.add(collar);

      const starGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 5);
      starGeo.rotateX(Math.PI / 2);
      const star = new THREE.Mesh(starGeo, new THREE.MeshLambertMaterial({ color: 0xffd700 }));
      star.position.set(0, 1.35, 0.78);
      this.group.add(star);

      // 2. Head
      const headGeo = new THREE.SphereGeometry(0.58, 16, 14);
      this.headMesh = new THREE.Mesh(headGeo, this.bodyMat);
      this.headMesh.position.set(0, 1.76, 0.1);
      this.headMesh.castShadow = true;
      this.group.add(this.headMesh);

      // Big Cute Cartoon Eyes
      const eyeGeo = new THREE.SphereGeometry(0.14, 10, 8);
      eyeGeo.scale(0.9, 1.15, 0.5);
      const pupilGeo = new THREE.SphereGeometry(0.08, 8, 6);
      pupilGeo.scale(0.9, 1.0, 0.4);

      for (let eyeSide of [-1, 1]) {
        const eyeWhite = new THREE.Mesh(eyeGeo, this.eyeWhiteMat);
        eyeWhite.position.set(eyeSide * 0.24, 1.86, 0.54);
        eyeWhite.rotation.y = eyeSide * 0.15;
        this.group.add(eyeWhite);

        const eyePupil = new THREE.Mesh(pupilGeo, this.eyePupilMat);
        eyePupil.position.set(eyeSide * 0.24, 1.86, 0.59);
        this.group.add(eyePupil);

        // White catchlight dot
        const catchlightGeo = new THREE.SphereGeometry(0.03, 6, 4);
        const catchlight = new THREE.Mesh(catchlightGeo, this.eyeWhiteMat);
        catchlight.position.set(eyeSide * 0.22, 1.9, 0.62);
        this.group.add(catchlight);
      }

      // Snout / Muzzle
      if (this.animal === 'baldeagle' || this.animal === 'eagle') {
        const beakGeo = new THREE.ConeGeometry(0.24, 0.55, 8);
        beakGeo.rotateX(Math.PI / 2);
        const beak = new THREE.Mesh(beakGeo, this.darkMat);
        beak.position.set(0, 1.66, 0.68);
        this.group.add(beak);
      } else {
        const snoutGeo = new THREE.SphereGeometry(0.32, 12, 10);
        snoutGeo.scale(1.0, 0.75, 0.85);
        const snout = new THREE.Mesh(snoutGeo, this.bellyMat);
        snout.position.set(0, 1.62, 0.55);
        this.group.add(snout);

        const noseGeo = new THREE.SphereGeometry(0.11, 8, 6);
        const nose = new THREE.Mesh(noseGeo, new THREE.MeshBasicMaterial({ color: 0x111111 }));
        nose.position.set(0, 1.71, 0.82);
        this.group.add(nose);
      }

      // Ears (with pink inner-ear detail!)
      if (this.animal === 'bear') {
        for (let side of [-1, 1]) {
          const earOuter = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), this.darkMat);
          earOuter.position.set(side * 0.46, 2.22, 0.05);
          const earInner = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), this.innerEarMat);
          earInner.position.set(side * 0.46, 2.22, 0.14);
          this.group.add(earOuter);
          this.group.add(earInner);
        }
      } else if (this.animal === 'fox') {
        for (let side of [-1, 1]) {
          const earOuter = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.62, 6), this.bodyMat);
          earOuter.position.set(side * 0.36, 2.32, 0.05);
          earOuter.rotation.z = -side * 0.22;
          const earTip = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.26, 6), this.darkMat);
          earTip.position.set(side * 0.42, 2.52, 0.05);
          earTip.rotation.z = -side * 0.22;
          this.group.add(earOuter);
          this.group.add(earTip);
        }
      } else if (this.animal === 'beaver') {
        // Flat waffle beaver tail
        const tailGeo = new THREE.BoxGeometry(0.65, 0.12, 1.05);
        const tail = new THREE.Mesh(tailGeo, this.darkMat);
        tail.position.set(0, 0.55, -0.75);
        tail.rotation.x = -0.32;
        this.group.add(tail);
      }

      // Little Bobtail (for Bear & Fox)
      if (this.animal === 'bear') {
        const bobtail = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), this.darkMat);
        bobtail.position.set(0, 0.65, -0.72);
        this.group.add(bobtail);
      } else if (this.animal === 'fox') {
        const bushyTail = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.1, 8), this.bodyMat);
        bushyTail.position.set(0, 0.75, -0.9);
        bushyTail.rotation.x = -0.85;
        this.group.add(bushyTail);
      }

      // 3. Articulated Arms / Paws
      const armGeo = new THREE.SphereGeometry(0.2, 8, 8);
      armGeo.scale(0.8, 1.3, 0.8);
      this.armL = new THREE.Mesh(armGeo, this.bodyMat);
      this.armR = new THREE.Mesh(armGeo, this.bodyMat);
      this.armL.position.set(0.72, 1.05, 0.1);
      this.armR.position.set(-0.72, 1.05, 0.1);
      this.group.add(this.armL);
      this.group.add(this.armR);

      // 4. Running Sneakers / Feet
      const footGroupL = new THREE.Group();
      const footGroupR = new THREE.Group();

      const sneakerGeo = new THREE.BoxGeometry(0.36, 0.24, 0.58);
      const soleGeo = new THREE.BoxGeometry(0.40, 0.08, 0.62);

      const snkL = new THREE.Mesh(sneakerGeo, this.shoeMat);
      snkL.position.y = 0.16;
      const soleL = new THREE.Mesh(soleGeo, this.soleMat);
      soleL.position.y = 0.04;
      footGroupL.add(snkL); footGroupL.add(soleL);

      const snkR = new THREE.Mesh(sneakerGeo, this.shoeMat);
      snkR.position.y = 0.16;
      const soleR = new THREE.Mesh(soleGeo, this.soleMat);
      soleR.position.y = 0.04;
      footGroupR.add(snkR); footGroupR.add(soleR);

      this.footL = footGroupL;
      this.footR = footGroupR;
      this.footL.position.set(0.36, 0, 0);
      this.footR.position.set(-0.36, 0, 0);
      this.group.add(this.footL);
      this.group.add(this.footR);

      // Shield Bubble Aura
      const shieldGeo = new THREE.SphereGeometry(1.45, 16, 12);
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
        // Double jump in mid-air with 360° somersault flip & golden sparks!
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

        if (this.currentWeapon && Math.random() < 0.03) {
          this.usePowerup();
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

      // Animated Running Limbs (Arms pump, sneakers step)
      if (!this.isJumping && this.speed > 2.0) {
        const runCycle = this.z * 1.6;
        // Paws swing opposite
        this.footL.position.z = Math.sin(runCycle) * 0.38;
        this.footR.position.z = Math.sin(runCycle + Math.PI) * 0.38;
        this.footL.position.y = Math.max(0, -Math.sin(runCycle)) * 0.22;
        this.footR.position.y = Math.max(0, -Math.sin(runCycle + Math.PI)) * 0.22;

        this.armL.position.z = -Math.sin(runCycle) * 0.32;
        this.armR.position.z = Math.sin(runCycle) * 0.32;

        // Running body bobbing
        this.torsoMesh.position.y = 0.92 + Math.abs(Math.sin(runCycle)) * 0.08;
        this.headMesh.position.y = 1.76 + Math.abs(Math.sin(runCycle)) * 0.08;
      } else {
        this.footL.position.set(0.36, 0, 0);
        this.footR.position.set(-0.36, 0, 0);
        this.armL.position.z = 0;
        this.armR.position.z = 0;
        this.torsoMesh.position.y = 0.92;
        this.headMesh.position.y = 1.76;
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
      this.clouds = [];
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

      // WebGL Renderer with High Quality & Soft Shadows
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(w, h, false);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // 3D Scene with Rich Sunset Sky
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xff8038);
      this.scene.fog = new THREE.FogExp2(0xff9944, 0.0020);

      // Perspective Camera (Behind-the-Back Follower with deep view distance)
      this.camera = new THREE.PerspectiveCamera(54, w / h, 0.5, 600);

      // Lighting Setup (Sun, Sky Ambient, Hemisphere Ground Fill, BotW Rim Light)
      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
      this.scene.add(this.ambientLight);

      this.hemiLight = new THREE.HemisphereLight(0xffe4b5, 0x2e6b27, 0.75);
      this.scene.add(this.hemiLight);

      this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.35);
      this.sunLight.castShadow = true;
      this.sunLight.shadow.mapSize.width = 1024;
      this.sunLight.shadow.mapSize.height = 1024;
      this.sunLight.shadow.camera.near = 1.0;
      this.sunLight.shadow.camera.far = 180;
      this.sunLight.shadow.camera.left = -30;
      this.sunLight.shadow.camera.right = 30;
      this.sunLight.shadow.camera.top = 30;
      this.sunLight.shadow.camera.bottom = -30;
      this.scene.add(this.sunLight);
      this.scene.add(this.sunLight.target);

      // BotW-style rim light for crisp player & foliage silhouettes
      this.rimLight = new THREE.DirectionalLight(0xffdfba, 0.45);
      this.rimLight.castShadow = false;
      this.scene.add(this.rimLight);
      this.scene.add(this.rimLight.target);

      this.particles = new ParticleSystem3D(this.scene);
    }

    // ------------------------------------------------------------------------
    // TRACK MATHEMATICS (Continuous curves, dramatic Fun Run roller-coaster hills & bridges)
    // ------------------------------------------------------------------------
    getCurveX(z) {
      return Math.sin(z * 0.012) * 16.0 + Math.sin(z * 0.005) * 10.0;
    }

    isBridge(z) {
      return (z >= 240 && z <= 390) || (z >= 740 && z <= 890);
    }

    getRawHillY(z) {
      // Fun Run Dramatic Elevations:
      // 1. Broad rolling mountain terrain waves
      let h = Math.sin(z * 0.014) * 12.0;
      // 2. High roller-coaster climbs and sudden thrilling drop-offs
      h += Math.sin(z * 0.030 + 0.9) * 8.5;
      // 3. Fast Fun Run moguls / camel-humps (exciting jumping opportunities!)
      h += Math.cos(z * 0.065) * 3.8;

      // 4. Dramatic High Suspension Bridges spanning deep chasms
      if (this.isBridge(z)) {
        let start = (z < 500) ? 240 : 740;
        let span = 150;
        let t = (z - start) / span;
        // Arching high bridge across the chasm
        h += Math.sin(t * Math.PI) * 10.0;
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
      if (this.isBridge(z)) {
        if (distFromCenter <= 7.3) return trackH;
        // Deep canyon chasm under bridge
        return trackH - 34.0;
      }
      const outerSlope = Math.max(0, distFromCenter - 7.0) * -0.07;
      const hillWave = Math.sin(x * 0.035 + z * 0.015) * 2.2;
      return trackH + outerSlope + hillWave;
    }

    // ------------------------------------------------------------------------
    // ENVIRONMENT & SCENERY (Procedural Sky Dome, Snow-capped Mountains, Clouds, Track, Foliage)
    // ------------------------------------------------------------------------
    buildSkyAndMountains() {
      if (this.skyGroup) this.scene.remove(this.skyGroup);
      this.skyGroup = new THREE.Group();

      // 1. Procedural Sky Dome Shader (Zelda BotW / Fun Run sunset palette)
      if (this.skyDome) this.scene.remove(this.skyDome);
      const skyGeo = new THREE.SphereGeometry(450, 32, 16);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uTopColor: { value: new THREE.Color('#311b4d') },      // Twilight deep purple
          uHorizonColor: { value: new THREE.Color('#ff7026') },  // Vibrant sunset orange
          uBottomColor: { value: new THREE.Color('#223f14') },   // Earthy base green
          uSunPos: { value: new THREE.Vector3(120, 140, 240).normalize() },
          uSunColor: { value: new THREE.Color('#fff4b0') }
        },
        vertexShader: `
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform vec3 uTopColor;
          uniform vec3 uHorizonColor;
          uniform vec3 uBottomColor;
          uniform vec3 uSunPos;
          uniform vec3 uSunColor;
          varying vec3 vWorldPos;
          void main() {
            vec3 dir = normalize(vWorldPos);
            float h = dir.y;
            vec3 col;
            if (h > 0.0) {
              col = mix(uHorizonColor, uTopColor, pow(h, 0.62));
            } else {
              col = mix(uHorizonColor, uBottomColor, pow(clamp(-h * 4.0, 0.0, 1.0), 0.75));
            }
            // Sun disc & luminous corona
            float sunDot = max(0.0, dot(dir, normalize(uSunPos)));
            float sunDisc = step(0.9984, sunDot);
            float sunGlow = pow(sunDot, 14.0) * 0.7 + pow(sunDot, 4.0) * 0.28;
            col += uSunColor * (sunDisc * 1.8 + sunGlow);
            gl_FragColor = vec4(col, 1.0);
          }
        `
      });
      this.skyDome = new THREE.Mesh(skyGeo, skyMat);
      this.scene.add(this.skyDome);

      // 2. Snow-capped Alpine Mountains (from Fun Run menu art & Zelda)
      const mountainBodyGeo = new THREE.ConeGeometry(42, 62, 5);
      const mountainSnowGeo = new THREE.ConeGeometry(18, 25, 5);
      const mountainMat1 = new THREE.MeshLambertMaterial({ color: 0x274354 }); // Slate mountain rock
      const mountainMat2 = new THREE.MeshLambertMaterial({ color: 0x1b431e }); // Alpine evergreen rock
      const snowMat = new THREE.MeshLambertMaterial({ color: 0xffffff }); // Crisp white snow cap

      for (let z = 50; z < this.finishLineZ + 180; z += 75) {
        const cx = this.getCurveX(z);
        for (let side of [-1, 1]) {
          const mGroup = new THREE.Group();
          const baseMat = Math.random() > 0.4 ? mountainMat1 : mountainMat2;
          const body = new THREE.Mesh(mountainBodyGeo, baseMat);
          body.position.y = 31;
          mGroup.add(body);

          const snow = new THREE.Mesh(mountainSnowGeo, snowMat);
          snow.position.y = 51;
          mGroup.add(snow);

          const scale = 1.0 + Math.random() * 0.75;
          mGroup.scale.set(scale, scale * (0.8 + Math.random() * 0.5), scale);
          const xDist = side * (130 + Math.random() * 50);
          mGroup.position.set(cx + xDist, 8 + Math.random() * 15, z);
          this.skyGroup.add(mGroup);
        }
      }

      // 3. Volumetric Cartoon Drifting Clouds
      this.clouds = [];
      const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.90 });
      const cloudSphere = new THREE.SphereGeometry(6, 8, 8);

      for (let z = 20; z < this.finishLineZ + 120; z += 60) {
        const cloud = new THREE.Group();
        const baseCx = this.getCurveX(z);
        cloud.position.set(baseCx + (Math.random() - 0.5) * 90, 46 + Math.random() * 16, z);

        for (let c = 0; c < 6; c++) {
          const puff = new THREE.Mesh(cloudSphere, cloudMat);
          puff.position.set(
            (c - 2.5) * 4.2 + (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2.8,
            (Math.random() - 0.5) * 4
          );
          puff.scale.setScalar(0.75 + Math.random() * 0.55);
          cloud.add(puff);
        }

        this.skyGroup.add(cloud);
        this.clouds.push(cloud);
      }

      this.scene.add(this.skyGroup);
    }

    buildTrackMesh() {
      if (this.trackMesh) this.scene.remove(this.trackMesh);

      const segStep = 2.5; // Fine resolution for silky smooth slopes
      const segCount = Math.ceil((this.finishLineZ + 150) / segStep);

      // Width profile: 15 vertices per cross-section
      const lateralOffsets = [-55, -20, -9.5, -7.8, -7.0, -4.7, -2.3, 0, 2.3, 4.7, 7.0, 7.8, 9.5, 20, 55];
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

          let r = 0.28, g = 0.72, b = 0.25;

          if (Math.abs(w) > 18) {
            // Far outer rolling terrain (Zelda BotW deep meadow green)
            vy = this.getGroundY(vx, vz);
            r = 0.16; g = 0.46; b = 0.16;
          } else if (Math.abs(w) > 8.5) {
            // Earthy curb slope (warm soil)
            vy = onBridge ? (cy - 16.0) : (cy - 0.55);
            r = 0.42; g = 0.26; b = 0.14;
          } else if (Math.abs(w) > 7.0) {
            // Raised curb border
            vy = cy + 0.22;
            if (!onBridge) {
              // Alternating Red & White race kerb blocks!
              const isRedKerb = (Math.floor(i / 2) % 2 === 0);
              r = isRedKerb ? 0.90 : 0.95;
              g = isRedKerb ? 0.14 : 0.95;
              b = isRedKerb ? 0.14 : 0.95;
            } else {
              // Bridge wooden curb beam
              r = 0.48; g = 0.28; b = 0.14;
            }
          } else {
            // Running Track Surface
            if (onBridge) {
              // Wooden Suspension Bridge Planks
              r = isEvenSeg ? 0.56 : 0.46;
              g = isEvenSeg ? 0.34 : 0.28;
              b = isEvenSeg ? 0.18 : 0.14;
            } else {
              // Vibrant Green Mowing Stripes (Zelda BotW vibrant green)
              r = isEvenSeg ? 0.28 : 0.34;
              g = isEvenSeg ? 0.72 : 0.80;
              b = isEvenSeg ? 0.25 : 0.30;
            }
          }

          positions.push(vx, vy, vz);
          normals.push(0, 1, 0);
          colors.push(r, g, b);
        }
      }

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
        roughness: 0.80,
        metalness: 0.08
      });

      this.trackMesh = new THREE.Mesh(geo, mat);
      this.trackMesh.receiveShadow = true;
      this.scene.add(this.trackMesh);
    }

    buildBridgeDetails() {
      if (this.bridgeGroup) this.scene.remove(this.bridgeGroup);
      this.bridgeGroup = new THREE.Group();
      const intervals = [[240, 390], [740, 890]];

      const postGeo = new THREE.CylinderGeometry(0.20, 0.22, 2.4, 7);
      const postMat = new THREE.MeshLambertMaterial({ color: 0x543015 });
      const pierGeo = new THREE.BoxGeometry(0.9, 36, 0.9);
      const pierMat = new THREE.MeshLambertMaterial({ color: 0x381f0d });
      const ropeMat = new THREE.MeshLambertMaterial({ color: 0xd7a15c });

      for (const [startZ, endZ] of intervals) {
        let prevPL = null;
        let prevPR = null;

        for (let z = startZ; z <= endZ; z += 5.0) {
          const cx = this.getCurveX(z);
          const cy = this.getHillY(z);

          const pL = new THREE.Mesh(postGeo, postMat);
          pL.position.set(cx - 7.3, cy + 1.2, z);
          this.bridgeGroup.add(pL);

          const pR = new THREE.Mesh(postGeo, postMat);
          pR.position.set(cx + 7.3, cy + 1.2, z);
          this.bridgeGroup.add(pR);

          // Rope segment between posts
          if (prevPL) {
            const ropeGeo = new THREE.CylinderGeometry(0.06, 0.06, 5.2, 5);
            ropeGeo.rotateX(Math.PI / 2);
            const rL = new THREE.Mesh(ropeGeo, ropeMat);
            rL.position.set(cx - 7.3, cy + 2.1, z - 2.5);
            this.bridgeGroup.add(rL);

            const rR = new THREE.Mesh(ropeGeo, ropeMat);
            rR.position.set(cx + 7.3, cy + 2.1, z - 2.5);
            this.bridgeGroup.add(rR);
          }
          prevPL = pL;
          prevPR = pR;

          // Pier pillars descending into the canyon
          if ((z - startZ) % 15 === 0) {
            const pierL = new THREE.Mesh(pierGeo, pierMat);
            pierL.position.set(cx - 7.3, cy - 18.0, z);
            this.bridgeGroup.add(pierL);

            const pierR = new THREE.Mesh(pierGeo, pierMat);
            pierR.position.set(cx + 7.3, cy - 18.0, z);
            this.bridgeGroup.add(pierR);
          }
        }
      }

      this.scene.add(this.bridgeGroup);
    }

    buildSceneryTrees() {
      if (this.sceneryGroup) this.scene.remove(this.sceneryGroup);
      this.sceneryGroup = new THREE.Group();

      const trunkGeo = new THREE.CylinderGeometry(0.35, 0.6, 4.0, 7);
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3e2311 });
      const foliageGeo = new THREE.DodecahedronGeometry(2.1, 1);
      const fMat1 = new THREE.MeshLambertMaterial({ color: 0x1f4e1f });
      const fMat2 = new THREE.MeshLambertMaterial({ color: 0x2d732d });
      const fMat3 = new THREE.MeshLambertMaterial({ color: 0x388e3c });

      for (let z = 25; z < this.finishLineZ + 80; z += 16 + Math.random() * 10) {
        if (this.isBridge(z)) continue;

        for (let side of [-1, 1]) {
          const dist = 12.5 + Math.random() * 22.0;
          const x = this.getCurveX(z) + side * dist;
          const y = this.getGroundY(x, z);

          const tree = new THREE.Group();
          tree.position.set(x, y, z);

          const trunk = new THREE.Mesh(trunkGeo, trunkMat);
          trunk.position.y = 2.0;
          trunk.castShadow = true;
          tree.add(trunk);

          // 3-tiered lush foliage
          const fol1 = new THREE.Mesh(foliageGeo, fMat1);
          fol1.position.set(0, 4.2, 0);
          fol1.scale.set(1.2, 1.1, 1.2);
          fol1.castShadow = true;
          tree.add(fol1);

          const fol2 = new THREE.Mesh(foliageGeo, fMat2);
          fol2.position.set((Math.random() - 0.5) * 0.6, 5.5, (Math.random() - 0.5) * 0.6);
          fol2.scale.set(1.0, 1.0, 1.0);
          fol2.castShadow = true;
          tree.add(fol2);

          const fol3 = new THREE.Mesh(foliageGeo, fMat3);
          fol3.position.set(0, 6.6, 0);
          fol3.scale.set(0.75, 0.85, 0.75);
          fol3.castShadow = true;
          tree.add(fol3);

          this.sceneryGroup.add(tree);
        }
      }

      this.scene.add(this.sceneryGroup);
    }

    buildFoliage() {
      if (this.foliageGroup) this.scene.remove(this.foliageGroup);
      this.foliageGroup = new THREE.Group();

      // 1. Instanced 3D Grass Tufts (Zelda BotW Meadow Style)
      // Low-poly 3-blade clump geometry
      const bladeGeo = new THREE.BufferGeometry();
      const pos = [];
      const col = [];
      const indices = [];

      const bladeAngles = [-0.35, 0.05, 0.42];
      const bladeHeights = [0.65, 0.85, 0.70];
      const bladeWidths = [0.12, 0.14, 0.12];

      bladeAngles.forEach((ang, idx) => {
        const h = bladeHeights[idx];
        const w = bladeWidths[idx];
        const sinA = Math.sin(ang);
        const cosA = Math.cos(ang);
        const bendX = sinA * 0.28;
        const bendZ = (idx === 1 ? 0.12 : -0.08);

        const baseV = idx * 3;
        // Bottom left, bottom right, top tip
        pos.push(
          -cosA * w * 0.5, 0, -sinA * w * 0.5,
          cosA * w * 0.5, 0, sinA * w * 0.5,
          bendX, h, bendZ
        );

        // Gradient coloring: deep root green to sunlit tip
        col.push(
          0.16, 0.48, 0.14,
          0.16, 0.48, 0.14,
          0.44, 0.84, 0.26
        );

        indices.push(baseV, baseV + 1, baseV + 2);
        indices.push(baseV + 1, baseV, baseV + 2);
      });

      bladeGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      bladeGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      bladeGeo.setIndex(indices);
      bladeGeo.computeVertexNormals();

      const grassMat = new THREE.MeshLambertMaterial({
        vertexColors: true,
        side: THREE.DoubleSide
      });

      const grassCount = 1400;
      const grassMesh = new THREE.InstancedMesh(bladeGeo, grassMat, grassCount);
      grassMesh.castShadow = false;
      grassMesh.receiveShadow = true;

      const dummy = new THREE.Object3D();
      let grassIdx = 0;

      for (let i = 0; i < grassCount; i++) {
        const z = 15 + (i / grassCount) * (this.finishLineZ + 60);
        if (this.isBridge(z)) continue;

        const side = (i % 2 === 0) ? -1 : 1;
        const lateralDist = side * (8.2 + (Math.sin(i * 13.7) * 0.5 + 0.5) * 6.5);
        const cx = this.getCurveX(z);
        const x = cx + lateralDist;
        const y = this.getGroundY(x, z);

        dummy.position.set(x, y, z);
        dummy.rotation.y = (i * 2.39996) % (Math.PI * 2);
        const s = 0.8 + ((i * 17) % 11) * 0.05;
        dummy.scale.set(s, s * (0.85 + Math.random() * 0.3), s);
        dummy.updateMatrix();

        grassMesh.setMatrixAt(grassIdx++, dummy.matrix);
      }
      grassMesh.count = grassIdx;
      grassMesh.instanceMatrix.needsUpdate = true;
      this.foliageGroup.add(grassMesh);

      // 2. Instanced Colorful Wildflowers
      const flowerCount = 300;
      const flowerGeo = new THREE.DodecahedronGeometry(0.18, 0);
      const flowerMat = new THREE.MeshLambertMaterial();
      const flowerMesh = new THREE.InstancedMesh(flowerGeo, flowerMat, flowerCount);

      const flowerPalette = [
        new THREE.Color(0xff1744), // Poppy Red
        new THREE.Color(0xffea00), // Buttercup Yellow
        new THREE.Color(0x2979ff), // Sky Blue
        new THREE.Color(0xffffff), // Daisy White
        new THREE.Color(0xff4081)  // Hot Pink
      ];

      let fIdx = 0;
      for (let i = 0; i < flowerCount; i++) {
        const z = 20 + (i / flowerCount) * (this.finishLineZ + 50);
        if (this.isBridge(z)) continue;

        const side = (i % 2 === 0) ? -1 : 1;
        const lateralDist = side * (8.0 + (Math.sin(i * 7.9) * 0.5 + 0.5) * 4.5);
        const cx = this.getCurveX(z);
        const x = cx + lateralDist;
        const y = this.getGroundY(x, z) + 0.32;

        dummy.position.set(x, y, z);
        dummy.rotation.set(Math.random() * 0.3, Math.random() * Math.PI, 0);
        const s = 0.9 + Math.random() * 0.5;
        dummy.scale.set(s, s, s);
        dummy.updateMatrix();

        flowerMesh.setMatrixAt(fIdx, dummy.matrix);
        flowerMesh.setColorAt(fIdx, flowerPalette[i % flowerPalette.length]);
        fIdx++;
      }
      flowerMesh.count = fIdx;
      flowerMesh.instanceMatrix.needsUpdate = true;
      if (flowerMesh.instanceColor) flowerMesh.instanceColor.needsUpdate = true;
      this.foliageGroup.add(flowerMesh);

      this.scene.add(this.foliageGroup);
    }

    buildFinishGate() {
      if (this.finishGateGroup) this.scene.remove(this.finishGateGroup);
      this.finishGateGroup = new THREE.Group();
      const z = this.finishLineZ;
      const cx = this.getCurveX(z);
      const cy = this.getHillY(z);

      const pillarGeo = new THREE.BoxGeometry(0.9, 9.5, 0.9);
      const woodMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
      const pL = new THREE.Mesh(pillarGeo, woodMat);
      pL.position.set(cx - 7.5, cy + 4.75, z);
      const pR = new THREE.Mesh(pillarGeo, woodMat);
      pR.position.set(cx + 7.5, cy + 4.75, z);
      this.finishGateGroup.add(pL);
      this.finishGateGroup.add(pR);

      // Top Crossbar
      const barGeo = new THREE.BoxGeometry(16.5, 2.4, 0.9);
      const bar = new THREE.Mesh(barGeo, new THREE.MeshLambertMaterial({ color: 0xffd166 }));
      bar.position.set(cx, cy + 8.5, z);
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
        new THREE.PlaneGeometry(14, 2.2),
        new THREE.MeshBasicMaterial({ map: bannerTex })
      );
      bannerPlane.position.set(cx, cy + 8.5, z + 0.48);
      this.finishGateGroup.add(bannerPlane);

      this.scene.add(this.finishGateGroup);
    }

    // ------------------------------------------------------------------------
    // INTERACTIVE TRACK ELEMENTS
    // ------------------------------------------------------------------------
    spawnWorldElements() {
      this.clearWorldElements();
      // Screen Left (+4.5), Screen Center (0), Screen Right (-4.5)
      const lanes = [4.5, 0, -4.5];

      for (let z = 50; z < this.finishLineZ - 30; z += 24 + Math.random() * 12) {
        const rand = Math.random();
        const laneX = lanes[Math.floor(Math.random() * lanes.length)];
        const cx = this.getCurveX(z);
        const cy = this.getHillY(z);
        const worldX = cx + laneX;

        if (rand > 0.65) {
          this.createCrate(worldX, cy + 1.6, z, laneX);
        } else if (rand > 0.36) {
          this.createRock(worldX, cy + 0.7, z, laneX);
        } else if (rand > 0.20) {
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

      // 1. Main Crate Body
      const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      // Red wooden planks (Fun Run mystery box)
      ctx.fillStyle = '#c62828';
      ctx.fillRect(0, 0, 256, 256);

      // Plank grooves
      ctx.strokeStyle = '#8e0000';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 85); ctx.lineTo(256, 85);
      ctx.moveTo(0, 170); ctx.lineTo(256, 170);
      ctx.stroke();

      // Yellow diamond
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

      // Bold white '?' with drop shadow
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 10;
      ctx.font = '900 130px "Luckiest Guy", Impact, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText('?', 128, 134);
      ctx.fillText('?', 128, 134);

      // Corner rivets
      ctx.fillStyle = '#ffd54f';
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2;
      const rivets = [[18, 18], [238, 18], [18, 238], [238, 238]];
      for (let [rx, ry] of rivets) {
        ctx.beginPath();
        ctx.arc(rx, ry, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      const texture = new THREE.CanvasTexture(canvas);
      const crateMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.60,
        metalness: 0.15
      });
      const crateMesh = new THREE.Mesh(boxGeo, crateMat);
      crateMesh.castShadow = true;
      group.add(crateMesh);

      // 2. Gold metallic corner brackets on all 8 corners
      const cornerMat = new THREE.MeshStandardMaterial({
        color: 0xffca28,
        metalness: 0.85,
        roughness: 0.25
      });
      const cornerGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
      for (let cx of [-0.75, 0.75]) {
        for (let cy of [-0.75, 0.75]) {
          for (let cz of [-0.75, 0.75]) {
            const cMesh = new THREE.Mesh(cornerGeo, cornerMat);
            cMesh.position.set(cx, cy, cz);
            group.add(cMesh);
          }
        }
      }

      // 3. Floating glowing aura ring underneath
      const auraGeo = new THREE.RingGeometry(0.5, 1.05, 16);
      auraGeo.rotateX(-Math.PI / 2);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0xffd54f,
        transparent: true,
        opacity: 0.60,
        side: THREE.DoubleSide
      });
      const aura = new THREE.Mesh(auraGeo, auraMat);
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
      const geo = new THREE.PlaneGeometry(2.8, 4.2);
      geo.rotateX(-Math.PI / 2);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, 256, 256);

      for (let row = 0; row < 3; row++) {
        const yCenter = 45 + row * 80;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#ffea00';
        ctx.beginPath();
        ctx.moveTo(128, yCenter - 30);
        ctx.lineTo(230, yCenter + 25);
        ctx.lineTo(195, yCenter + 35);
        ctx.lineTo(128, yCenter + 0);
        ctx.lineTo(61, yCenter + 35);
        ctx.lineTo(26, yCenter + 25);
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(128, yCenter - 22);
        ctx.lineTo(210, yCenter + 22);
        ctx.lineTo(195, yCenter + 28);
        ctx.lineTo(128, yCenter + 0);
        ctx.lineTo(61, yCenter + 28);
        ctx.lineTo(46, yCenter + 22);
        ctx.closePath();
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;

      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.tex = tex;
      return mesh;
    }

    createBouncePadMesh() {
      const group = new THREE.Group();

      const frameGeo = new THREE.CylinderGeometry(1.45, 1.5, 0.2, 20);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x424242, metalness: 0.8, roughness: 0.3 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.y = 0.1;
      group.add(frame);

      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(64, 64, 62, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(64, 64, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(64, 64, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(64, 64, 12, 0, Math.PI * 2);
      ctx.fill();

      const tex = new THREE.CanvasTexture(canvas);
      const surfaceGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.05, 20);
      const surfaceMat = new THREE.MeshBasicMaterial({ map: tex });
      const surface = new THREE.Mesh(surfaceGeo, surfaceMat);
      surface.position.y = 0.22;
      group.add(surface);

      return group;
    }

    createRock(x, y, z, laneX) {
      const group = new THREE.Group();
      const geo = new THREE.DodecahedronGeometry(1.25, 1);
      geo.scale(1.2, 0.85, 1.1);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x455a64,
        roughness: 0.85,
        metalness: 0.15,
        flatShading: true
      });
      const rock = new THREE.Mesh(geo, mat);
      rock.castShadow = true;
      group.add(rock);

      // Stylized moss top cap
      const mossGeo = new THREE.SphereGeometry(0.85, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.45);
      const mossMat = new THREE.MeshLambertMaterial({ color: 0x33691e });
      const moss = new THREE.Mesh(mossGeo, mossMat);
      moss.position.y = 0.5;
      moss.scale.set(1.1, 0.6, 1.0);
      group.add(moss);

      group.position.set(x, y, z);
      group.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
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

    spawnSawblade(x, z, owner) {
      const mesh = this.createSawbladeMesh();
      const cy = this.getHillY(z) + 0.8;
      mesh.position.set(this.getCurveX(z) + x, cy, z + 2.0);
      this.scene.add(mesh);
      this.projectiles.push({ mesh, x, z: z + 2.0, speed: 44.0, owner, active: true });
    }

    spawnTrap(x, z, owner) {
      const mesh = this.createBearTrapMesh();
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
      this.cameraShake = 0.8;
    }

    clearWorldElements() {
      for (let r of this.rocks) this.scene.remove(r.mesh);
      for (let c of this.crates) this.scene.remove(c.mesh);
      for (let s of this.speedPads) this.scene.remove(s.mesh);
      for (let b of this.bouncePads) this.scene.remove(b.mesh);
      for (let p of this.projectiles) this.scene.remove(p.mesh);
      for (let t of this.traps) this.scene.remove(t.mesh);
      if (this.foliageGroup) this.scene.remove(this.foliageGroup);
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

      // Keyboard Controls (Left is Left, Right is Right!)
      window.addEventListener('keydown', (e) => {
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
          if (this.player.currentWeapon) this.player.usePowerup();
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

      // Expand container to 100vw x 100vh for true edge-to-edge 3D
      document.body.classList.add('mode-3d');

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
      for (let r of this.racers) r.destroy();
      this.racers = [];
      this.particles.clear();
      this.hideWeaponButton();

      // Build 3D World Geometry & Environment
      this.buildSkyAndMountains();
      this.buildTrackMesh();
      this.buildBridgeDetails();
      this.buildSceneryTrees();
      this.buildFoliage();
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

            const weapons = ['blade', 'trap', 'speed', 'shield', 'lightning'];
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

      // Rotate Clouds gently
      for (let c of this.clouds) {
        c.position.x += dt * 0.8;
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

      // Animate flowing speed pad chevrons
      for (let pad of this.speedPads) {
        if (pad.mesh && pad.mesh.tex) {
          pad.mesh.tex.offset.y = -(currentTime * 0.0028) % 1.0;
        }
      }

      // Update Projectiles (Sawblades spin at 35 rad/s and spray sparks)
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        p.z += p.speed * dt;
        p.mesh.rotation.z += dt * 35;
        const cy = this.getHillY(p.z) + 0.8;
        p.mesh.position.set(this.getCurveX(p.z) + p.x, cy, p.z);
        if (Math.random() < 0.35) {
          this.particles.spawnSparks(this.getCurveX(p.z) + p.x, cy - 0.4, p.z, 2);
        }
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
      const targetCamY = groundY + 4.8 + p.jumpY * 0.35;
      const targetCamZ = p.z - 11.5;

      this.camera.position.x += (targetCamX - this.camera.position.x) * 12.0 * dt;
      this.camera.position.y += (targetCamY - this.camera.position.y) * 10.0 * dt;
      this.camera.position.z = targetCamZ;

      if (this.cameraShake > 0) {
        this.camera.position.x += (Math.random() - 0.5) * this.cameraShake;
        this.camera.position.y += (Math.random() - 0.5) * this.cameraShake;
        this.cameraShake = Math.max(0, this.cameraShake - 2.5 * dt);
      }

      // Pitch camera to anticipate upcoming hills and drops
      const lookAheadZ = p.z + 18.0;
      const lookX = this.getCurveX(lookAheadZ) + p.x * 0.25;
      const lookY = this.getHillY(lookAheadZ) + 2.5;
      this.camera.lookAt(lookX, lookY, lookAheadZ);

      // SkyDome tracks camera position so it never clips or drifts away
      if (this.skyDome) {
        this.skyDome.position.set(targetCamX, targetCamY, targetCamZ);
      }

      // Sun Light & BotW Rim Light Target Tracking Player
      this.sunLight.position.set(targetCamX + 24, targetCamY + 38, targetCamZ + 16);
      this.sunLight.target.position.set(targetCamX, targetCamY, targetCamZ + 20);

      if (this.rimLight) {
        this.rimLight.position.set(targetCamX - 22, targetCamY + 28, targetCamZ - 14);
        this.rimLight.target.position.set(targetCamX, targetCamY, targetCamZ + 20);
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
      document.body.classList.remove('mode-3d');
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
