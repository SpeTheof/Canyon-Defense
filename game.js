// Canyon Defense - Main Game Engine
// Vibe Coded by Aura & Spe - Version 2.9
// UI Optimization: Streamlined options modal, removed duplicates, enhanced performance



// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas ? canvas.getContext('2d') : null;

    if (!canvas || !ctx) {
        console.error('Canvas not found!');
        return;
    }

    // Prevent arrow key scrolling
    window.addEventListener('keydown', function(e) {
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight', ' '].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

    // ==========================================
// GAME CONSOLE SYSTEM - New in v1.5
// ==========================================
const GameConsole = {
    maxEntries: 50,
    entries: [],
    
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        
        const entry = {
            message,
            type,
            timestamp,
            id: Date.now()
        };
        
        this.entries.unshift(entry);
        
        if (this.entries.length > this.maxEntries) {
            this.entries.pop();
        }
        
        this.render();
    },
    
    info(msg) { this.log(msg, 'info'); },
    warn(msg) { this.log(msg, 'warn'); },
    error(msg) { this.log(msg, 'error'); },
    success(msg) { this.log(msg, 'success'); },
    bonus(msg) { this.log(msg, 'bonus'); },
    
    clear() {
        this.entries = [];
        this.render();
    },
    
    render() {
        const consoleEl = document.getElementById('gameConsole');
        if (!consoleEl) return;
        
        consoleEl.innerHTML = this.entries.map(entry => `
            <div class="console-entry ${entry.type}">
                <span class="console-timestamp">[${entry.timestamp}]</span> ${entry.message}
            </div>
        `).join('');
        
        consoleEl.scrollTop = 0;
    }
};

// Console clear button
document.getElementById('consoleClear')?.addEventListener('click', () => {
    GameConsole.clear();
});

// ==========================================
// TEXTURE GENERATOR
// ==========================================
const TextureGenerator = {
    textures: {},
    
    generateTexture(type, color, size = GRID_SIZE) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        switch(type) {
            case 'grass':
                this.drawGrass(ctx, color, size);
                break;
            case 'rock':
                this.drawRock(ctx, color, size);
                break;
            case 'path':
                this.drawPath(ctx, color, size);
                break;
            case 'dirt':
                this.drawDirt(ctx, color, size);
                break;
        }
        
        return canvas;
    },
    
    drawGrass(ctx, baseColor, size) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = this.lightenColor(baseColor, 20);
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const bladeHeight = 3 + Math.random() * 4;
            const bladeWidth = 1 + Math.random() * 2;
            ctx.fillRect(x, y, bladeWidth, bladeHeight);
        }
        
        ctx.fillStyle = this.darkenColor(baseColor, 15);
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * (size - 6);
            const y = Math.random() * (size - 6);
            ctx.fillRect(x, y, 4 + Math.random() * 4, 4 + Math.random() * 4);
        }
    },
    
    drawRock(ctx, baseColor, size) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, size, size);
        
        const rockColors = [
            this.lightenColor(baseColor, 30),
            this.darkenColor(baseColor, 20),
            this.lightenColor(baseColor, 10)
        ];
        
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = rockColors[i % 3];
            const x = Math.random() * (size - 10);
            const y = Math.random() * (size - 8);
            const w = 6 + Math.random() * 8;
            const h = 4 + Math.random() * 6;
            
            ctx.beginPath();
            ctx.moveTo(x + w*0.2, y);
            ctx.lineTo(x + w*0.8, y);
            ctx.lineTo(x + w, y + h*0.4);
            ctx.lineTo(x + w*0.9, y + h);
            ctx.lineTo(x + w*0.1, y + h);
            ctx.lineTo(x, y + h*0.4);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.fillStyle = this.darkenColor(baseColor, 40);
        for (let i = 0; i < 6; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            ctx.fillRect(x, y, 2, 2);
        }
    },
    
    drawPath(ctx, baseColor, size) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = this.darkenColor(baseColor, 10);
        for (let i = 0; i < 8; i++) {
            const x = Math.random() * (size - 4);
            const y = Math.random() * (size - 4);
            ctx.fillRect(x, y, 3 + Math.random() * 3, 2 + Math.random() * 3);
        }
        
        ctx.fillStyle = this.lightenColor(baseColor, 15);
        for (let i = 0; i < 6; i++) {
            const x = Math.random() * (size - 3);
            const y = Math.random() * (size - 3);
            ctx.fillRect(x, y, 2, 2);
        }
        
        if (Math.random() > 0.7) {
            ctx.fillStyle = this.darkenColor(baseColor, 25);
            ctx.fillRect(4, 8, 3, size - 16);
            ctx.fillRect(size - 7, 8, 3, size - 16);
        }
    },
    
    drawDirt(ctx, baseColor, size) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, size, size);
        
        ctx.fillStyle = this.darkenColor(baseColor, 12);
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * (size - 4);
            const y = Math.random() * (size - 4);
            ctx.fillRect(x, y, 3, 3);
        }
        
        ctx.fillStyle = this.lightenColor(baseColor, 25);
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * (size - 3);
            const y = Math.random() * (size - 3);
            ctx.fillRect(x, y, 2, 2);
        }
    },
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },
    
    getTexture(type, color) {
        const key = type + '_' + color;
        if (!this.textures[key]) {
            this.textures[key] = this.generateTexture(type, color);
        }
        return this.textures[key];
    }
};

// ==========================================
// SOUND SYSTEM
// ==========================================
const SoundSystem = {
    audioContext: null,
    sounds: {},
    masterVolume: 0.7,
    musicVolume: 0.15,
    compressor: null,
    activeSounds: 0,
    maxConcurrentSounds: 12, // Increased for more action
    soundQueue: [],
    lastSoundTimes: {}, // Track timing per sound type
    
    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a compressor/limiter to prevent clipping
        this.compressor = this.audioContext.createDynamicsCompressor();
        this.compressor.threshold.value = -12; // Start compressing at -12dB
        this.compressor.knee.value = 0; // Hard limit
        this.compressor.ratio.value = 20; // 20:1 ratio (basically a limiter)
        this.compressor.attack.value = 0.001; // Fast attack
        this.compressor.release.value = 0.1; // Fast release
        
        this.compressor.connect(this.audioContext.destination);
    },
    
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },
    
    setMasterVolume(vol) {
        this.masterVolume = vol;
    },
    
    setMusicVolume(vol) {
        this.musicVolume = vol;
        const music = document.getElementById('gameMusic');
        if (music) music.volume = vol;
    },
    
    playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!this.audioContext) this.init();
        
        // Smart sound limiting based on game speed
        const speedMultiplier = gameState.gameSpeed || 1;
        const now = this.audioContext.currentTime;
        
        // Create sound key for timing control
        const soundKey = `${type}_${Math.round(frequency/100)*100}`;
        const lastTime = this.lastSoundTimes[soundKey] || 0;
        const minInterval = 0.05 / speedMultiplier; // Minimum time between same sounds
        
        // Skip if too many active sounds or same sound played too recently
        if (this.activeSounds >= this.maxConcurrentSounds || (now - lastTime) < minInterval) {
            return; // Skip this sound
        }
        
        this.activeSounds++;
        this.lastSoundTimes[soundKey] = now;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.compressor);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        // Keep volume punchy, don't scale down much
        const adjustedVolume = volume * Math.min(1, 1.2 / speedMultiplier); // Gentle scaling
        
        gainNode.gain.setValueAtTime(adjustedVolume * this.masterVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
        
        // Decrement active sounds counter
        setTimeout(() => {
            this.activeSounds--;
        }, duration * 1000);
    },
    
    playMissileSound() {
        if (!this.audioContext) this.init();
        this.resume();
        
        const speedMultiplier = gameState.gameSpeed || 1;
        const now = this.audioContext.currentTime;
        
        // Smart limiting for missiles
        if (this.activeSounds >= this.maxConcurrentSounds) return;
        
        this.activeSounds++;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.compressor);
        
        // Make missile sound faster and punchier at high speeds
        const speedFactor = Math.min(speedMultiplier, 3);
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08 / speedFactor);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.25 / speedFactor);
        osc.type = 'triangle';
        
        // Keep volume strong, slightly shorter duration at high speeds
        const duration = 0.25 / speedFactor;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4 * this.masterVolume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.1 * this.masterVolume, now + duration * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.start(now);
        osc.stop(now + duration);
        
        setTimeout(() => {
            this.activeSounds--;
        }, duration * 1000);
    },
    
    playHeavyWeaponSound() {
        if (!this.audioContext) this.init();
        this.resume();
        
        const speedMultiplier = gameState.gameSpeed || 1;
        const now = this.audioContext.currentTime;
        
        // Heavy sounds get priority but still limited
        if (this.activeSounds >= this.maxConcurrentSounds - 2) return;
        
        this.activeSounds++;
        
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.compressor);
        
        // Make heavy weapons more aggressive at high speeds
        const speedFactor = Math.min(speedMultiplier, 2);
        osc1.frequency.setValueAtTime(180, now);
        osc1.frequency.exponentialRampToValueAtTime(120, now + 0.1 / speedFactor);
        osc1.frequency.exponentialRampToValueAtTime(90, now + 0.25 / speedFactor);
        
        osc2.frequency.setValueAtTime(360, now);
        osc2.frequency.exponentialRampToValueAtTime(240, now + 0.1 / speedFactor);
        osc2.frequency.exponentialRampToValueAtTime(180, now + 0.25 / speedFactor);
        
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        
        // Keep heavy weapons punchy
        const duration = 0.4 / speedFactor;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.6 * this.masterVolume, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.4 * this.masterVolume, now + duration * 0.375);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc1.start(now);
        osc1.stop(now + duration);
        osc2.start(now);
        osc2.stop(now + duration);
        
        setTimeout(() => {
            this.activeSounds--;
        }, duration * 1000);
    },
    
    playExplosion() {
        if (!this.audioContext) this.init();
        
        // Limit concurrent sounds
        this.activeSounds++;
        if (this.activeSounds > this.maxConcurrentSounds) {
            this.activeSounds--;
            return;
        }
        
        // Adjust volume based on game speed
        const speedMultiplier = gameState.gameSpeed || 1;
        const volumeMultiplier = 1 / Math.sqrt(speedMultiplier);
        
        const now = this.audioContext.currentTime;
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.6 * volumeMultiplier * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.compressor); // Route through compressor
        
        noise.start();
        
        // Decrement active sounds counter
        setTimeout(() => {
            this.activeSounds--;
        }, 500);
        
        const rumble = this.audioContext.createOscillator();
        const rumbleGain = this.audioContext.createGain();
        rumble.connect(rumbleGain);
        rumbleGain.connect(this.audioContext.destination);
        
        rumble.frequency.setValueAtTime(60, now);
        rumble.frequency.exponentialRampToValueAtTime(30, now + 0.5);
        rumble.type = 'sawtooth';
        
        rumbleGain.gain.setValueAtTime(0.4, now);
        rumbleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        rumble.start(now);
        rumble.stop(now + 0.5);
    },
    
    playLaser() {
        if (!this.audioContext) this.init();
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
        osc.type = 'sawtooth';
        
        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    },
    
    playZap() {
        if (!this.audioContext) this.init();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                
                osc.frequency.setValueAtTime(2000 + Math.random() * 1000, this.audioContext.currentTime);
                osc.type = 'square';
                
                gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);
                
                osc.start();
                osc.stop(this.audioContext.currentTime + 0.05);
            }, i * 30);
        }
    },
    
    playBuild() {
        if (!this.audioContext) this.init();
        
        this.playTone(600, 0.1, 'sine', 0.2);
        setTimeout(() => this.playTone(800, 0.1, 'sine', 0.2), 50);
    },
    
    playCash() {
        if (!this.audioContext) this.init();
        
        this.playTone(1200, 0.05, 'sine', 0.15);
        setTimeout(() => this.playTone(1500, 0.1, 'sine', 0.15), 50);
    },
    
    playNuke() {
        if (!this.audioContext) this.init();
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 2);
        osc.type = 'sawtooth';
        
        gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 2);
    }
};

// ==========================================
// GAME STATE
// ==========================================
const gameState = {
    money: 500,
    lives: 10,
    wave: 1,
    score: 0,
    difficulty: 'easy',
    selectedMap: 0,
    isPlaying: false,
    isWaveActive: false,
    selectedTower: null,
    selectedTowerType: null,
    enemies: [],
    towers: [],
    projectiles: [],
    particles: [],
    waveCount: 30,
    waveEnemiesRemaining: 0,
    waveSpawnTimer: 0,
    waveSpawnDelay: 60,
    abilities: {
        nuke: { cooldown: 0, maxCooldown: 600 },
        freeze: { cooldown: 0, maxCooldown: 900 },
        wall: { cooldown: 0, maxCooldown: 300 }
    },
    unlockedTowers: ['missile', 'aa'],
    unlockProgress: {},
    autoWave: true,
    countdownTimer: 0,
    maxCountdown: 60,
    countdownActive: false,
    gameStartTime: 0,
    waveStartTime: 0,
    totalPausedTime: 0,
    firstWaveStarted: false,
    freezeActive: false,
    freezeTimer: 0,
    placingWall: false,
    walls: [], // v2.5: Defensive walls
    frame: 0,
    // v2.0: Tower Targeting & Stats
    targetingMode: 'first',
    // v2.0: Scrap Economy
    scrap: 0,
    permanentUpgrades: {
        reinforcedWalls: 0,
        bulkBuying: 0,
        scavenger: 0
    },
    // v2.5: FPS Tracking
    fpsLastTime: 0,
    fpsFrames: 0,
    // Background mode
    isInBackground: false,
    backgroundFrameCounter: 0,
    // Developer
    godMode: false,
    // v2.0: Screen shake
    screenShake: 0,
    // v2.0: Placement grid
    showPlacementGrid: false,
    // v2.5 NEW: Game Speed Control
    gameSpeed: 1, // 1x, 2x, 5x
    // v2.5 NEW: Hover tower for range display
    hoverTower: null,
    // v2.5 NEW: Context menu for tower management
    contextMenu: null,
    // v2.5 NEW: Pause state
    isPaused: false
};

// ==========================================
// MAP DEFINITIONS
// ==========================================
const GRID_SIZE = 30;
const COLS = 30;
const ROWS = 20;

const MAPS = [
    {
        name: 'Red Canyon',
        color: '#5D3A1A',
        pathColor: '#FF4500',
        path: [
            {x: 0, y: 3}, {x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3},
            {x: 5, y: 3}, {x: 5, y: 4}, {x: 5, y: 5},
            {x: 5, y: 6}, {x: 5, y: 7}, {x: 5, y: 8}, {x: 5, y: 9}, {x: 5, y: 10},
            {x: 6, y: 10}, {x: 7, y: 10}, {x: 8, y: 10},
            {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10}, {x: 13, y: 10}, {x: 14, y: 10},
            {x: 15, y: 10}, {x: 15, y: 9}, {x: 15, y: 8},
            {x: 15, y: 7}, {x: 15, y: 6}, {x: 15, y: 5}, {x: 15, y: 4},
            {x: 16, y: 4}, {x: 17, y: 4}, {x: 18, y: 4},
            {x: 19, y: 4}, {x: 20, y: 4}, {x: 21, y: 4}, {x: 22, y: 4}, {x: 23, y: 4},
            {x: 24, y: 4}, {x: 25, y: 4}, {x: 26, y: 4}, {x: 27, y: 4}, {x: 28, y: 4}, {x: 29, y: 4}
        ],
        start: {x: 0, y: 3},
        end: {x: 29, y: 4}
    },
    {
        name: 'Blue Gorge',
        color: '#4682B4',
        pathColor: '#87CEEB',
        path: [
            {x: 0, y: 5}, {x: 1, y: 5}, {x: 2, y: 5}, {x: 3, y: 5},
            {x: 4, y: 5}, {x: 5, y: 5}, {x: 6, y: 5}, {x: 7, y: 5},
            {x: 8, y: 5}, {x: 9, y: 5}, {x: 10, y: 5}, {x: 11, y: 5},
            {x: 12, y: 5}, {x: 13, y: 5}, {x: 14, y: 5}, {x: 15, y: 5},
            {x: 15, y: 6}, {x: 15, y: 7}, {x: 15, y: 8}, {x: 15, y: 9},
            {x: 15, y: 10}, {x: 15, y: 11}, {x: 15, y: 12}, {x: 15, y: 13},
            {x: 15, y: 14}, {x: 16, y: 14}, {x: 17, y: 14}, {x: 18, y: 14},
            {x: 19, y: 14}, {x: 20, y: 14}, {x: 21, y: 14}, {x: 22, y: 14},
            {x: 23, y: 14}, {x: 24, y: 14}, {x: 25, y: 14}, {x: 26, y: 14},
            {x: 27, y: 14}, {x: 28, y: 14}, {x: 29, y: 14}
        ],
        start: {x: 0, y: 5},
        end: {x: 29, y: 14}
    },
    {
        name: 'Green Valley',
        color: '#228B22',
        pathColor: '#90EE90',
        path: [
            {x: 0, y: 10}, {x: 1, y: 10}, {x: 2, y: 10}, {x: 3, y: 10},
            {x: 4, y: 10}, {x: 5, y: 10}, {x: 6, y: 9}, {x: 7, y: 8},
            {x: 8, y: 7}, {x: 9, y: 6}, {x: 10, y: 5}, {x: 11, y: 5},
            {x: 12, y: 5}, {x: 13, y: 5}, {x: 14, y: 6}, {x: 15, y: 7},
            {x: 16, y: 8}, {x: 17, y: 9}, {x: 18, y: 10}, {x: 19, y: 11},
            {x: 20, y: 12}, {x: 21, y: 13}, {x: 22, y: 14}, {x: 23, y: 14},
            {x: 24, y: 14}, {x: 25, y: 13}, {x: 26, y: 12}, {x: 27, y: 11},
            {x: 28, y: 10}, {x: 29, y: 10}
        ],
        start: {x: 0, y: 10},
        end: {x: 29, y: 10}
    }
];

// ==========================================
// TOWER DEFINITIONS - Updated v1.5
// ==========================================
const TOWERS = {
    missile: {
        name: 'Missile',
        icon: '🚀',
        cost: 50,
        damage: 25,
        range: 120,
        fireRate: 40,
        color: '#ff6b35',
        type: 'ground',
        description: 'Basic ground defense'
    },
    aa: {
        name: 'AA Gun',
        icon: '🎯',
        cost: 75,
        damage: 20,
        range: 140,
        fireRate: 15,
        color: '#4a90e2',
        type: 'air',
        description: 'Anti-air defense'
    },
    cannon: {
        name: 'Cannon',
        icon: '💣',
        cost: 150,
        damage: 60,
        range: 100,
        fireRate: 60,
        color: '#8b4513',
        type: 'ground',
        unlockRequirement: { towersBuilt: 5 },
        description: 'Heavy ground damage'
    },
    tesla: {
        name: 'Tesla',
        icon: '⚡',
        cost: 200,
        damage: 15,
        range: 130,
        fireRate: 10,
        color: '#00ffff',
        type: 'both',
        chain: 3,
        unlockRequirement: { moneyEarned: 1000 },
        description: 'Chain lightning'
    },
    laser: {
        name: 'Laser',
        icon: '🔴',
        cost: 300,
        damage: 5,
        range: 160,
        fireRate: 3,
        color: '#ff0000',
        type: 'both',
        unlockRequirement: { score: 5000 },
        description: 'Rapid fire beam'
    },
    gauss: {
        name: 'Gauss',
        icon: '🔫',
        cost: 500,
        damage: 200,
        range: 200,
        fireRate: 90,
        color: '#9400d3',
        type: 'ground',
        unlockRequirement: { wavesCompleted: 10 },
        description: 'Ultimate ground weapon'
    },
    goo: {
        name: 'Goo Gun',
        icon: '🟢',
        cost: 100,
        damage: 5,
        range: 110,
        fireRate: 45,
        color: '#32cd32',
        type: 'ground',
        slow: 0.5,
        unlockRequirement: { enemiesKilled: 50 },
        description: 'Slows enemies'
    },
    // SPECIAL TOWERS - Now in bottom toolbar
    multishot: {
        name: 'Multi-Shot',
        icon: '💥',
        cost: 250,
        damage: 30,
        range: 130,
        fireRate: 50,
        color: '#ffa500',
        type: 'ground',
        shots: 3,
        unlockRequirement: { towersBuilt: 15 },
        description: 'Fires 3 projectiles',
        category: 'special'
    },
    recycler: {
        name: 'Recycler',
        icon: '♻️',
        cost: 400,
        range: 0,
        color: '#00ff00',
        type: 'building',
        income: 10,
        unlockRequirement: { moneyEarned: 2000 },
        description: 'Generates income',
        category: 'special'
    },
    radar: {
        name: 'Radar',
        icon: '📡',
        cost: 350,
        range: 0,
        color: '#ffff00',
        type: 'building',
        buff: { range: 1.3, damage: 1.2 },
        unlockRequirement: { score: 4000 },
        description: 'Buffs nearby towers',
        category: 'special'
    },
    nukesilo: {
        name: 'Nuke Silo',
        icon: '☢️',
        cost: 1000,
        range: 0,
        color: '#ff0000',
        type: 'building',
        ability: 'nuke',
        unlockRequirement: { wavesCompleted: 10 },
        description: 'Nuclear strikes',
        category: 'special'
    }
};

// ==========================================
// ENEMY TYPES
// ==========================================
const ENEMIES = {
    scout: {
        name: 'Scout',
        health: 30,
        speed: 2,
        reward: 10,
        color: '#ffff00',
        type: 'ground'
    },
    tank: {
        name: 'Tank',
        health: 100,
        speed: 0.8,
        reward: 25,
        color: '#8b0000',
        type: 'ground'
    },
    speedy: {
        name: 'Speedster',
        health: 20,
        speed: 3.5,
        reward: 15,
        color: '#00ffff',
        type: 'ground'
    },
    drone: {
        name: 'Drone',
        health: 40,
        speed: 1.5,
        reward: 20,
        color: '#ff69b4',
        type: 'air'
    },
    heavy: {
        name: 'Heavy Tank',
        health: 300,
        speed: 0.5,
        reward: 50,
        color: '#4a0080',
        type: 'ground'
    },
    repair: {
        name: 'Repair Bot',
        health: 80,
        speed: 1,
        reward: 30,
        color: '#00ff00',
        type: 'ground',
        regen: 2
    },
    shield: {
        name: 'Shield Unit',
        health: 150,
        speed: 1,
        reward: 35,
        color: '#4169e1',
        type: 'ground',
        shield: 100
    },
    bomber: {
        name: 'Bomber',
        health: 60,
        speed: 1.2,
        reward: 25,
        color: '#ff4500',
        type: 'air'
    },
    // v2.0: Boss enemies
    boss: {
        name: 'Canyon Titan',
        health: 2000,
        speed: 0.4,
        reward: 200,
        color: '#ff00ff',
        type: 'ground',
        isBoss: true,
        aura: 'heal' // Heals nearby enemies
    },
    finalBoss: {
        name: 'Canyon Colossus',
        health: 10000,
        speed: 0.2,
        reward: 1000,
        color: '#ff0000',
        type: 'ground',
        isBoss: true,
        isFinalBoss: true,
        aura: 'shield', // Shields nearby enemies
        size: 2 // 2x2 grid size
    }
};

// ==========================================
// WAVE GENERATION
// ==========================================
function generateWaves(difficulty) {
    const waveCount = difficulty === 'easy' ? 30 : difficulty === 'normal' ? 40 : 50;
    const waves = [];
    
    for (let i = 1; i <= waveCount; i++) {
        const wave = {
            enemies: [],
            interval: Math.max(15, 40 - i * 0.8), // v2.5: Tighter spawns
            airWave: i % 5 === 0
        };
        
        // v2.0: Boss every 10th wave
        if (i % 10 === 0 && i > 0) {
            wave.isBossWave = true;
            if (i === 50) {
                wave.enemies.push({ type: 'finalBoss', count: 1 });
            } else {
                wave.enemies.push({ type: 'boss', count: 1 });
            }
        }
        
        if (i <= 5) {
            wave.enemies.push({ type: 'scout', count: 5 + i * 2 });
        }
        else if (i <= 10) {
            wave.enemies.push({ type: 'scout', count: 10 + i });
            wave.enemies.push({ type: 'tank', count: Math.floor(i / 2) });
        }
        else if (i <= 20) {
            wave.enemies.push({ type: 'scout', count: 15 });
            wave.enemies.push({ type: 'tank', count: 5 + Math.floor(i / 3) });
            wave.enemies.push({ type: 'speedy', count: Math.floor(i / 2) });
            if (i % 3 === 0) wave.enemies.push({ type: 'drone', count: 3 + Math.floor(i / 5) });
        }
        else if (i <= 30) {
            wave.enemies.push({ type: 'tank', count: 10 });
            wave.enemies.push({ type: 'heavy', count: Math.floor((i - 20) / 2) });
            wave.enemies.push({ type: 'speedy', count: 8 });
            wave.enemies.push({ type: 'repair', count: Math.floor(i / 10) });
            if (wave.airWave) wave.enemies.push({ type: 'bomber', count: 5 + Math.floor(i / 5) });
        }
        else {
            wave.enemies.push({ type: 'heavy', count: 5 + Math.floor((i - 30) / 2) });
            wave.enemies.push({ type: 'shield', count: 3 + Math.floor((i - 30) / 3) });
            wave.enemies.push({ type: 'repair', count: 4 });
            wave.enemies.push({ type: 'tank', count: 15 });
            if (wave.airWave) wave.enemies.push({ type: 'bomber', count: 10 });
        }
        
        waves.push(wave);
    }
    
    return waves;
}

// ==========================================
// CLASSES
// ==========================================
class Enemy {
    constructor(type, path) {
        const template = ENEMIES[type];
        this.type = type;
        this.path = path;
        this.pathIndex = 0;
        this.x = path[0].x * GRID_SIZE + GRID_SIZE / 2;
        this.y = path[0].y * GRID_SIZE + GRID_SIZE / 2;
        this.maxHealth = template.health * (1 + (gameState.wave - 1) * 0.15); // v2.5: Increased HP scaling
        this.health = this.maxHealth;
        this.speed = template.speed;
        this.baseSpeed = template.speed;
        this.reward = template.reward;
        this.color = template.color;
        this.enemyType = template.type;
        this.regen = template.regen || 0;
        this.shield = template.shield || 0;
        this.maxShield = this.shield;
        this.slowTimer = 0;
        this.frozen = false;
        this.angle = 0;
        
        // v2.0: Boss properties
        this.isBoss = template.isBoss || false;
        this.isFinalBoss = template.isFinalBoss || false;
        this.aura = template.aura || null;
    }
    
    update() {
        if (this.frozen) return;

        if (this.slowTimer > 0) {
            this.slowTimer--;
            if (this.slowTimer === 0) this.speed = this.baseSpeed;
        }

        if (this.regen > 0 && this.health < this.maxHealth) {
            this.health = Math.min(this.maxHealth, this.health + this.regen / 60);
        }

        // v2.0: Boss aura effects
        if (this.isBoss && this.aura) {
            this.applyAura();
        }

        // v2.5: Check for walls and attack them
        if (this.pathIndex < this.path.length - 1) {
            const nextCell = this.path[this.pathIndex + 1];
            const wall = gameState.walls.find(w => w.gridX === nextCell.x && w.gridY === nextCell.y);

            if (wall) {
                // Attack the wall!
                const dist = Math.hypot(wall.x - this.x, wall.y - this.y);
                if (dist < 20) {
                    // Damage wall
                    wall.health -= 2; // Damage per frame

                    // Wall destroyed?
                    if (wall.health <= 0) {
                        gameState.walls = gameState.walls.filter(w => w !== wall);
                        GameConsole.warn('🧱 Wall destroyed!');

                        // Create debris particles
                        for (let i = 0; i < 8; i++) {
                            gameState.particles.push(new Particle(
                                wall.x + (Math.random() - 0.5) * 20,
                                wall.y + (Math.random() - 0.5) * 20,
                                '#8b4513'
                            ));
                        }
                    }
                    return false; // Don't move while attacking wall
                }
            }

            const target = this.path[this.pathIndex + 1];
            const tx = target.x * GRID_SIZE + GRID_SIZE / 2;
            const ty = target.y * GRID_SIZE + GRID_SIZE / 2;

            const dx = tx - this.x;
            const dy = ty - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                this.pathIndex++;
            } else {
                this.angle = Math.atan2(dy, dx);
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
            }
        } else {
            return true;
        }

        return false;
    }
    
    draw() {
        // v2.0: Boss aura visual
        if (this.isBoss) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 100, 0, Math.PI * 2);
            ctx.fillStyle = this.aura === 'heal' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(65, 105, 225, 0.1)';
            ctx.fill();
            ctx.strokeStyle = this.aura === 'heal' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(65, 105, 225, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        if (this.shield > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.isBoss ? 24 : 12, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(65, 105, 225, ${this.shield / this.maxShield})`;
            ctx.lineWidth = 3;
            ctx.stroke();
        }
        
        ctx.fillStyle = this.color;
        // v2.0: Bosses are bigger
        const size = this.isFinalBoss ? 30 : (this.isBoss ? 20 : 8);
        ctx.fillRect(this.x - size, this.y - size, size * 2, size * 2);
        
        if (this.enemyType === 'air') {
            ctx.fillStyle = '#fff';
            ctx.fillRect(this.x - size/2, this.y - size/2, size, size);
        }
        
        // v2.0: Boss health bar is bigger
        const barWidth = this.isBoss ? 40 : 20;
        const barHeight = this.isBoss ? 8 : 4;
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - barWidth/2, this.y - (this.isBoss ? 35 : 15), barWidth, barHeight);
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x - barWidth/2, this.y - (this.isBoss ? 35 : 15), barWidth * (this.health / this.maxHealth), barHeight);
        
        // v2.0: Boss name label
        if (this.isBoss) {
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ENEMIES[this.type].name, this.x, this.y - (this.isFinalBoss ? 45 : 25));
        }
        
        if (this.frozen) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - size - 2, this.y - size - 2, size * 2 + 4, size * 2 + 4);
        }
    }
    
    takeDamage(damage) {
        if (this.shield > 0) {
            this.shield -= damage;
            if (this.shield < 0) {
                this.health += this.shield;
                this.shield = 0;
            }
        } else {
            this.health -= damage;
        }
        
        for (let i = 0; i < 3; i++) {
            gameState.particles.push(new Particle(this.x, this.y, this.color));
        }
    }
    
    applySlow(factor, duration) {
        this.speed = this.baseSpeed * factor;
        this.slowTimer = duration;
    }
    
    // v2.0: Boss aura effect
    applyAura() {
        const auraRange = 100;
        for (const enemy of gameState.enemies) {
            if (enemy === this) continue;
            const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (dist < auraRange) {
                if (this.aura === 'heal' && enemy.health < enemy.maxHealth) {
                    enemy.health = Math.min(enemy.maxHealth, enemy.health + 0.5);
                } else if (this.aura === 'shield' && !enemy.shield) {
                    enemy.shield = 50;
                    enemy.maxShield = 50;
                }
            }
        }
    }
}

class Tower {
    constructor(type, gridX, gridY) {
        const template = TOWERS[type];
        this.type = type;
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * GRID_SIZE + GRID_SIZE / 2;
        this.y = gridY * GRID_SIZE + GRID_SIZE / 2;
        this.baseDamage = template.damage || 0;
        this.damage = this.baseDamage;
        this.baseRange = template.range;
        this.range = this.baseRange;
        this.baseFireRate = template.fireRate || 60;
        this.fireRate = this.baseFireRate;
        this.cooldown = 0;
        this.color = template.color;
        this.towerType = template.type;
        this.angle = 0;
        this.target = null;
        
        this.chain = template.chain || 0;
        this.shots = template.shots || 1;
        this.slow = template.slow || 0;
        this.income = template.income || 0;
        this.buff = template.buff || null;
        
        // v2.0: Tower stats & targeting
        this.targetingPriority = 'first';
        this.kills = 0;
        this.damageDealt = 0;
        this.killTypes = {}; // Track kills by enemy type
        
        // v2.5: Level system (max 3 levels)
        this.level = 1;
        this.maxLevel = 3;
        this.totalInvested = getTowerCost(type); // Track total gold spent
    }
    
    // v2.5: Upgrade tower to next level
    upgrade() {
        if (this.level >= this.maxLevel) return false;

        const baseCost = TOWERS[this.type].cost;
        // Level 2: 75% of base cost | Level 3: 200% of base cost (expensive!)
        const upgradeCost = this.level === 1 ? Math.floor(baseCost * 0.75) : Math.floor(baseCost * 2);

        if (gameState.money >= upgradeCost) {
            gameState.money -= upgradeCost;
            this.totalInvested += upgradeCost;
            this.level++;

            // Apply upgrade bonuses (balanced)
            if (this.level === 2) {
                // Level 2: +40% Damage, +20% Range, +20% Fire Rate
                this.damage = this.baseDamage * 1.4;
                this.range = this.baseRange * 1.2;
                this.fireRate = Math.floor(this.baseFireRate * 0.8);
            } else if (this.level === 3) {
                // Level 3: +75% Damage (1.75x), +35% Range, +40% Fire Rate
                this.damage = this.baseDamage * 1.75;
                this.range = this.baseRange * 1.35;
                this.fireRate = Math.floor(this.baseFireRate * 0.6);
            }

            updateUI();
            return true;
        }
        return false;
    }

    // v2.5: Get upgrade cost
    getUpgradeCost() {
        if (this.level >= this.maxLevel) return 0;
        const baseCost = TOWERS[this.type].cost;
        return this.level === 1 ? Math.floor(baseCost * 0.75) : Math.floor(baseCost * 2);
    }
    
    // v2.5: Get sell value (70% of total invested)
    getSellValue() {
        return Math.floor(this.totalInvested * 0.7);
    }
    
    update() {
        if (this.income > 0 && gameState.frame % 60 === 0) {
            gameState.money += this.income;
            updateUI();
        }
        
        if (this.buff) {
            gameState.towers.forEach(tower => {
                if (tower !== this) {
                    const dist = Math.hypot(tower.x - this.x, tower.y - this.y);
                    if (dist < 150) {
                        tower.range = tower.range * this.buff.range;
                        tower.damage = tower.damage * this.buff.damage;
                    }
                }
            });
        }
        
        if (this.cooldown > 0) this.cooldown--;
        
        if (!this.target || this.target.health <= 0 || !this.isInRange(this.target)) {
            this.target = this.findTarget();
        }
        
        if (this.target) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            this.angle = Math.atan2(dy, dx);
            
            if (this.cooldown <= 0) {
                this.fire();
                this.cooldown = this.fireRate;
            }
        }
    }
    
    findTarget() {
        let validTargets = [];
        
        // Filter valid targets
        for (const enemy of gameState.enemies) {
            if (this.canTarget(enemy) && this.isInRange(enemy)) {
                validTargets.push(enemy);
            }
        }
        
        if (validTargets.length === 0) return null;
        
        // Apply targeting priority
        switch(this.targetingPriority) {
            case 'first':
                // Target closest to base (furthest along path)
                return validTargets.reduce((furthest, enemy) => 
                    enemy.pathIndex > furthest.pathIndex ? enemy : furthest
                );
            case 'last':
                // Target closest to start (least along path)
                return validTargets.reduce((closest, enemy) => 
                    enemy.pathIndex < closest.pathIndex ? enemy : closest
                );
            case 'strongest':
                // Target highest health
                return validTargets.reduce((strongest, enemy) => 
                    enemy.health > strongest.health ? enemy : strongest
                );
            case 'weakest':
                // Target lowest health
                return validTargets.reduce((weakest, enemy) => 
                    enemy.health < weakest.health ? enemy : weakest
                );
            default:
                // Fallback to first enemy
                return validTargets[0];
        }
    }
    
    canTarget(enemy) {
        if (this.towerType === 'both') return true;
        if (this.towerType === 'air') return enemy.enemyType === 'air';
        if (this.towerType === 'ground') return enemy.enemyType === 'ground';
        return false;
    }
    
    isInRange(enemy) {
        const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
        return dist < this.range;
    }
    
    fire() {
        switch(this.type) {
            case 'missile':
            case 'aa':
            case 'multishot':
                SoundSystem.playMissileSound();
                break;
            case 'cannon':
            case 'gauss':
                SoundSystem.playHeavyWeaponSound();
                // v2.0: Screen shake for Gauss
                if (this.type === 'gauss') {
                    gameState.screenShake = 300; // 300ms shake
                }
                break;
            case 'tesla':
                SoundSystem.playZap();
                break;
            case 'laser':
                SoundSystem.playLaser();
                break;
        }
        
        // v2.0: Muzzle flash effect
        for (let i = 0; i < 8; i++) {
            const flashX = this.x + Math.cos(this.angle) * 15;
            const flashY = this.y + Math.sin(this.angle) * 15;
            gameState.particles.push(new MuzzleFlash(flashX, flashY, this.color, this.angle));
        }
        
        if (this.shots > 1) {
            for (let i = 0; i < this.shots; i++) {
                const offset = (i - (this.shots - 1) / 2) * 0.3;
                const proj = new Projectile(
                    this.x, this.y, this.target, this.damage, this.color, this.type, this
                );
                proj.angleOffset = offset;
                gameState.projectiles.push(proj);
            }
        } else {
            const projectile = new Projectile(
                this.x, this.y, this.target, this.damage, this.color, this.type, this
            );
            
            if (this.chain > 0) {
                projectile.chain = this.chain;
                projectile.chainRange = 100;
            }
            
            gameState.projectiles.push(projectile);
        }
        
        if (this.slow > 0 && this.target) {
            this.target.applySlow(this.slow, 120);
        }
    }
    
    draw() {
        // v2.5: Sharp targeting box when selected
        if (gameState.selectedTower === this) {
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - 14, this.y - 14, 28, 28);
            
            // Range circle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 107, 53, 0.15)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 107, 53, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // v2.5: Hover range display (dashed neon line)
        if (gameState.hoverTower === this && gameState.selectedTower !== this) {
            ctx.beginPath();
            ctx.setLineDash([5, 5]);
            ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // v2.5: Sharp square base plate
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(-13, -13, 26, 26);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-13, -13, 26, 26);
        
        // v2.5: Rotating turret head
        ctx.rotate(this.angle);
        
        // Draw turret based on type
        ctx.fillStyle = this.color;
        if (this.type === 'missile') {
            // Launcher box
            ctx.fillRect(-6, -6, 12, 12);
            ctx.fillStyle = '#ff6b35';
            ctx.fillRect(0, -3, 12, 6);
        } else if (this.type === 'aa') {
            // Dual barrel
            ctx.fillRect(-4, -6, 8, 12);
            ctx.fillStyle = '#4a90e2';
            ctx.fillRect(0, -5, 14, 3);
            ctx.fillRect(0, 2, 14, 3);
        } else if (this.type === 'tesla') {
            // Tesla coil
            ctx.fillRect(-3, -3, 6, 6);
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-8, 0);
            ctx.lineTo(8, 0);
            ctx.moveTo(0, -8);
            ctx.lineTo(0, 8);
            ctx.stroke();
        } else if (this.type === 'laser') {
            // Laser emitter
            ctx.fillRect(-4, -4, 8, 8);
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(0, -2, 16, 4);
        } else if (this.type === 'cannon' || this.type === 'gauss') {
            // Heavy cannon
            ctx.fillRect(-6, -5, 12, 10);
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(0, -3, 14, 6);
        } else {
            ctx.fillRect(-6, -5, 12, 10);
            ctx.fillRect(0, -2, 12, 4);
        }
        
        ctx.restore();
        
        // v2.5: Level chevrons (^) - sharp corners
        if (this.level > 1) {
            ctx.fillStyle = this.level === 3 ? '#ffd700' : '#00ff88';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            const chevrons = '^'.repeat(this.level - 1);
            ctx.fillText(chevrons, this.x, this.y - 16);
        }
        
        // v2.5: Building indicator
        if (this.towerType === 'building') {
            ctx.fillStyle = '#0f0';
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(TOWERS[this.type].icon, this.x, this.y + 4);
        }
    }
}

class Projectile {
    constructor(x, y, target, damage, color, type, sourceTower = null) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.color = color;
        this.type = type;
        this.speed = 8;
        this.angleOffset = 0;
        this.chain = 0;
        this.chainRange = 0;
        this.hitTargets = [];
        this.sourceTower = sourceTower; // v2.0: Track source tower for stats
        
        const dx = target.x - x;
        const dy = target.y - y;
        this.angle = Math.atan2(dy, dx) + this.angleOffset;
    }
    
    update() {
        // Only home slightly toward target - don't snap instantly
        if (this.target && this.target.health > 0) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const targetAngle = Math.atan2(dy, dx);
            
            // Smooth homing - interpolate between current angle and target angle
            let angleDiff = targetAngle - this.angle;
            // Normalize angle difference to -PI to PI
            while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
            while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
            
            // Apply small turn rate (0.1 radians per frame max) + offset
            this.angle += Math.max(-0.15, Math.min(0.15, angleDiff * 0.1)) + this.angleOffset;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        for (const enemy of gameState.enemies) {
            if (this.hitTargets.includes(enemy)) continue;
            
            const dist = Math.hypot(enemy.x - this.x, enemy.y - this.y);
            if (dist < 15) {
                const damageDealt = Math.min(this.damage, enemy.health);
                enemy.takeDamage(this.damage);
                this.hitTargets.push(enemy);
                
                // v2.0: Track tower stats
                if (this.sourceTower) {
                    this.sourceTower.damageDealt += damageDealt;
                    if (enemy.health <= 0) {
                        this.sourceTower.kills++;
                        // Track enemy type kills
                        const enemyType = enemy.type;
                        this.sourceTower.killTypes[enemyType] = (this.sourceTower.killTypes[enemyType] || 0) + 1;
                    }
                }
                
                // v2.0: Impact effect
                for (let i = 0; i < 5; i++) {
                    gameState.particles.push(new ImpactParticle(this.x, this.y, this.color));
                }
                
                if (this.chain > 0 && this.hitTargets.length <= this.chain) {
                    let nextTarget = null;
                    let closestDist = this.chainRange;
                    
                    for (const e of gameState.enemies) {
                        if (this.hitTargets.includes(e)) continue;
                        const d = Math.hypot(e.x - this.x, e.y - this.y);
                        if (d < closestDist) {
                            closestDist = d;
                            nextTarget = e;
                        }
                    }
                    
                    if (nextTarget) {
                        this.target = nextTarget;
                        const dx = nextTarget.x - this.x;
                        const dy = nextTarget.y - this.y;
                        this.angle = Math.atan2(dy, dx);
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            return true;
        }
        
        return false;
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 30;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.size *= 0.95;
        return this.life <= 0;
    }

    draw() {
        ctx.globalAlpha = this.life / 30;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// v2.0: Muzzle flash particle
class MuzzleFlash {
    constructor(x, y, color, angle) {
        this.x = x;
        this.y = y;
        this.life = 10;
        this.maxLife = 10;
        this.color = color;
        this.angle = angle;
        this.speed = 3 + Math.random() * 2;
        this.size = 3 + Math.random() * 4;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life--;
        this.size *= 0.9;
        return this.life <= 0;
    }

    draw() {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// v2.0: Impact particle
class ImpactParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 20;
        this.maxLife = 20;
        this.color = color;
        this.size = 2 + Math.random() * 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.life--;
        this.size *= 0.9;
        return this.life <= 0;
    }

    draw() {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// v2.5: Defensive Wall class
class Wall {
    constructor(gridX, gridY) {
        this.gridX = gridX;
        this.gridY = gridY;
        this.x = gridX * GRID_SIZE + GRID_SIZE / 2;
        this.y = gridY * GRID_SIZE + GRID_SIZE / 2;
        this.maxHealth = 200;
        this.health = this.maxHealth;
    }

    draw() {
        // Wall health determines opacity
        const healthPercent = this.health / this.maxHealth;

        // Draw wall base
        ctx.fillStyle = `rgba(139, 69, 19, ${0.4 + healthPercent * 0.6})`;
        ctx.fillRect(this.x - 14, this.y - 14, 28, 28);

        // Draw wall border
        ctx.strokeStyle = `rgba(255, 215, 0, ${healthPercent})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - 14, this.y - 14, 28, 28);

        // Draw X pattern
        ctx.strokeStyle = `rgba(100, 50, 0, ${healthPercent})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - 10, this.y - 10);
        ctx.lineTo(this.x + 10, this.y + 10);
        ctx.moveTo(this.x + 10, this.y - 10);
        ctx.lineTo(this.x - 10, this.y + 10);
        ctx.stroke();

        // Draw health bar
        if (this.health < this.maxHealth) {
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x - 12, this.y - 20, 24, 4);
            ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
            ctx.fillRect(this.x - 12, this.y - 20, 24 * healthPercent, 4);
        }
    }
}

// v2.5: Procedural explosion effect
function createExplosion(x, y, radius) {
    const colors = ['#ff6b35', '#ff0000', '#ffffff', '#ffaa00'];
    
    // Create expanding rings
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const ring = new ExplosionRing(x, y, radius * (0.5 + i * 0.3), colors[i % colors.length]);
            gameState.particles.push(ring);
        }, i * 50);
    }
    
    // Create particle burst
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i;
        const speed = 3 + Math.random() * 4;
        const particle = new ExplosionParticle(
            x, y, 
            Math.cos(angle) * speed, 
            Math.sin(angle) * speed,
            colors[Math.floor(Math.random() * colors.length)]
        );
        gameState.particles.push(particle);
    }
}

class ExplosionRing {
    constructor(x, y, maxRadius, color) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.maxRadius = maxRadius;
        this.life = 30;
        this.maxLife = 30;
        this.color = color;
        this.lineWidth = 3;
    }
    
    update() {
        this.radius += (this.maxRadius - this.radius) * 0.1;
        this.life--;
        this.lineWidth *= 0.95;
        return this.life <= 0;
    }
    
    draw() {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
}

class ExplosionParticle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = 25;
        this.maxLife = 25;
        this.color = color;
        this.size = 4;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.92;
        this.vy *= 0.92;
        this.life--;
        this.size *= 0.94;
        return this.life <= 0;
    }
    
    draw() {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

// v2.5: Floating text for bonuses
class FloatingText {
    constructor(x, y, text, color) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.life = 40;
        this.maxLife = 40;
        this.vy = -1;
    }
    
    update() {
        this.y += this.vy;
        this.life--;
        return this.life <= 0;
    }
    
    draw() {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}

// ==========================================
// INPUT HANDLING
// ==========================================
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // v2.5: Hover detection for tower range display
    if (gameState.isPlaying) {
        const gridX = Math.floor(mouseX / GRID_SIZE);
        const gridY = Math.floor(mouseY / GRID_SIZE);
        const hoverTower = gameState.towers.find(t => t.gridX === gridX && t.gridY === gridY);
        gameState.hoverTower = hoverTower || null;
    }
});

canvas.addEventListener('click', (e) => {
    if (!gameState.isPlaying) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gridX = Math.floor(x / GRID_SIZE);
    const gridY = Math.floor(y / GRID_SIZE);

    // v2.5: Handle wall placement
    if (gameState.placingWall) {
        const map = MAPS[gameState.selectedMap];
        const isPath = map.path.some(p => p.x === gridX && p.y === gridY);

        // Check if wall already exists here
        const wallExists = gameState.walls.some(w => w.gridX === gridX && w.gridY === gridY);

        if (isPath && !wallExists) {
            // Create wall
            gameState.walls.push(new Wall(gridX, gridY));
            gameState.abilities.wall.cooldown = gameState.abilities.wall.maxCooldown;
            gameState.placingWall = false;
            GameConsole.success('🧱 Wall placed! Enemies must destroy it!');
            return;
        } else if (wallExists) {
            GameConsole.warn('Wall already exists here!');
            gameState.placingWall = false;
            return;
        } else {
            GameConsole.warn('Can only place walls on the path!');
            return;
        }
    }

    // v2.5: Check if clicking on existing tower - show context menu
    const clickedTower = gameState.towers.find(t => t.gridX === gridX && t.gridY === gridY);

    // If clicking on the same tower, deselect it
    if (clickedTower && gameState.selectedTower === clickedTower) {
        hideTowerControls();
        return;
    }

    if (clickedTower) {
        gameState.selectedTower = clickedTower;
        gameState.selectedTowerType = clickedTower.type; // Also select the tower type in panel
        updateTowerPanel();
        updateSpecialTowersPanel();
        updateTowerInfoPanel();
        showTowerControls(clickedTower); // Show upgrade/sell controls in sidebar
        return;
    }

    // Place new tower first
    if (gameState.selectedTowerType && canPlaceTower(gridX, gridY)) {
        placeTower(gameState.selectedTowerType, gridX, gridY);
        // Keep selected tower type for multi-building!
        // Don't call hideTowerControls() here
        updateTowerPanel(); // Update panel to show new availability
    } else if (gameState.selectedTowerType) {
        GameConsole.error('Cannot place tower here!');
    } else {
        // Only deselect if we're not trying to place a tower
        hideTowerControls();
    }
});

// v2.5: Disable right-click context menu on canvas
canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// v2.5: Tower Context Menu System
function showTowerContextMenu(tower, x, y) {
    hideTowerContextMenu();

    // Adjust position to keep menu on screen
    let menuX = x + 20;
    let menuY = y - 50;
    if (menuX + 170 > window.innerWidth) menuX = x - 180;
    if (menuY + 200 > window.innerHeight) menuY = window.innerHeight - 220;
    if (menuY < 10) menuY = 10;

    const menu = document.createElement('div');
    menu.id = 'towerContextMenu';
    menu.style.cssText = `
        position: fixed;
        left: ${menuX}px;
        top: ${menuY}px;
        background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
        border: 2px solid #00ff88;
        border-radius: 0;
        padding: 12px;
        z-index: 100000;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        min-width: 160px;
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.3), 0 4px 10px rgba(0, 0, 0, 0.5);
    `;

    const upgradeCost = tower.getUpgradeCost();
    const sellValue = tower.getSellValue();
    const canUpgrade = tower.level < tower.maxLevel && gameState.money >= upgradeCost;

    // Calculate shots per second
    const shotsPerSecond = (tower.fireRate > 0) ? (60 / tower.fireRate).toFixed(2) : 'N/A';
    // Calculate range in blocks (each block = 30px)
    const rangeInBlocks = (tower.range / 30).toFixed(1);

    // Get next level stats preview
    let nextLevelStats = '';
    if (tower.level === 1) {
        nextLevelStats = `Lvl 2: ${Math.floor(tower.baseDamage * 1.4)} DMG, ${(tower.baseRange * 1.2 / 30).toFixed(1)} blk, ${(60 / Math.floor(tower.baseFireRate * 0.8)).toFixed(1)}/s`;
    } else if (tower.level === 2) {
        nextLevelStats = `Lvl 3: ${Math.floor(tower.baseDamage * 1.75)} DMG, ${(tower.baseRange * 1.35 / 30).toFixed(1)} blk, ${(60 / Math.floor(tower.baseFireRate * 0.6)).toFixed(1)}/s`;
    }

    menu.innerHTML = `
        <div style="color: #00ff88; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 8px; font-size: 14px;">
            ${TOWERS[tower.type].name} <span style="color: #ffd700;">Lv${tower.level}</span>
        </div>
        <div style="margin-bottom: 4px; color: #aaa; font-size: 11px;">
            <span style="color: #ff6b35;">💥</span> DMG: <span style="color: #fff;">${Math.floor(tower.damage)}</span>
        </div>
        <div style="margin-bottom: 4px; color: #aaa; font-size: 11px;">
            <span style="color: #00ffff;">📏</span> Range: <span style="color: #fff;">${rangeInBlocks} blk</span>
        </div>
        <div style="margin-bottom: 4px; color: #aaa; font-size: 11px;">
            <span style="color: #00ff00;">⚡</span> Speed: <span style="color: #fff;">${shotsPerSecond}/s</span>
        </div>
        <div style="margin-bottom: 10px; color: #666; font-size: 10px;">
            <span style="color: #ff69b4;">🎯</span> Kills: <span style="color: #aaa;">${tower.kills}</span>
        </div>

        ${tower.level < tower.maxLevel ? `
            <div style="margin-bottom: 6px; padding: 6px; background: rgba(255, 215, 0, 0.08); border: 1px solid rgba(255, 215, 0, 0.3); font-size: 9px; color: #ffd700; line-height: 1.4;">
                UPGRADE BONUS:<br>${nextLevelStats}
            </div>
            <button id="ctxUpgrade" style="
                width: 100%;
                padding: 10px;
                margin-bottom: 6px;
                background: ${canUpgrade ? 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)' : '#333'};
                color: ${canUpgrade ? '#000' : '#666'};
                border: none;
                cursor: ${canUpgrade ? 'pointer' : 'not-allowed'};
                font-weight: bold;
                font-size: 11px;
                text-transform: uppercase;
            " ${!canUpgrade ? 'disabled' : ''}>
                🆙 UPGRADE $${upgradeCost}
            </button>
        ` : '<div style="color: #ffd700; margin-bottom: 6px; font-size: 11px; text-align: center; padding: 6px; background: rgba(255, 215, 0, 0.1); border: 1px solid #ffd700;">★★★ MAX LEVEL ★★★</div>'}

        <button id="ctxSell" style="
            width: 100%;
            padding: 10px;
            background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        ">
            💰 SELL $${sellValue}
        </button>

        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #333; color: #666; font-size: 9px; text-align: center;">
            Target: <span style="color: #00ff88;">${tower.targetingPriority.toUpperCase()}</span>
        </div>

        <div style="margin-top: 6px; color: #444; font-size: 9px; text-align: center;">
            Click elsewhere to close
        </div>
    `;

    document.body.appendChild(menu);
    gameState.contextMenu = menu;

    // Add event listeners with proper closure
    setTimeout(() => {
        const upgradeBtn = document.getElementById('ctxUpgrade');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (tower.upgrade()) {
                    GameConsole.success(`🆙 ${TOWERS[tower.type].name} upgraded to Level ${tower.level}!`);
                    hideTowerContextMenu();
                    updateUI();
                    updateTowerInfoPanel();
                }
            });
        }



        const sellBtn = document.getElementById('ctxSell');
        if (sellBtn) {
            sellBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sellTower(tower);
                hideTowerContextMenu();
            });
        }
    }, 10);
}

function showTowerControls(tower) {
    const towerInfoPanel = document.getElementById('towerInfoPanel');
    if (!towerInfoPanel) return;
    
    const upgradeCost = tower.getUpgradeCost();
    const sellValue = tower.getSellValue();
    const canUpgrade = tower.level < tower.maxLevel && gameState.money >= upgradeCost;
    const shotsPerSecond = (tower.fireRate > 0) ? (60 / tower.fireRate).toFixed(2) : 'N/A';
    const rangeInBlocks = (tower.range / 30).toFixed(1);
    
    // Get next level stats preview
    let nextLevelStats = '';
    if (tower.level === 1) {
        nextLevelStats = `Lvl 2: ${Math.floor(tower.baseDamage * 1.4)} DMG, ${(tower.baseRange * 1.2 / 30).toFixed(1)} blk, ${(60 / Math.floor(tower.baseFireRate * 0.8)).toFixed(1)}/s`;
    } else if (tower.level === 2) {
        nextLevelStats = `Lvl 3: ${Math.floor(tower.baseDamage * 1.8)} DMG, ${(tower.baseRange * 1.3 / 30).toFixed(1)} blk, ${(60 / Math.floor(tower.baseFireRate * 0.6)).toFixed(1)}/s`;
    }
    
    // Smart positioning near the selected tower
    const canvas = document.getElementById('gameCanvas');
    const canvasRect = canvas.getBoundingClientRect();
    
    // Calculate position relative to canvas
    let panelX = tower.x + 20; // Offset right from tower
    let panelY = tower.y - 100; // Offset up from tower
    
    // Adjust if panel would go outside canvas bounds (panel is now 240px wide)
    if (panelX + 240 > 900) panelX = tower.x - 250; // Show on left side
    if (panelY < 0) panelY = tower.y + 20; // Show below tower
    if (panelY + 280 > 600) panelY = 600 - 280; // Keep within canvas bottom
    
    towerInfoPanel.style.left = panelX + 'px';
    towerInfoPanel.style.top = panelY + 'px';
    
    towerInfoPanel.innerHTML = `
        <div style="color: #00ff88; font-weight: bold; font-size: 13px; text-align: center; margin-bottom: 6px; border-bottom: 1px solid #00ff88; padding-bottom: 3px;">
            ${TOWERS[tower.type].icon} ${TOWERS[tower.type].name} L${tower.level}
        </div>
        
        <!-- Compact stats row -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 2px; margin-bottom: 6px; font-size: 9px;">
            <div style="text-align: center; background: rgba(0,255,136,0.1); padding: 2px;">
                <div style="color: #ffd700; font-weight: bold;">${tower.level}/3</div>
                <div style="color: #666;">LVL</div>
            </div>
            <div style="text-align: center; background: rgba(255,107,53,0.1); padding: 2px;">
                <div style="color: #fff; font-weight: bold;">${Math.floor(tower.damage)}</div>
                <div style="color: #666;">DMG</div>
            </div>
            <div style="text-align: center; background: rgba(0,255,255,0.1); padding: 2px;">
                <div style="color: #fff; font-weight: bold;">${rangeInBlocks}</div>
                <div style="color: #666;">RNG</div>
            </div>
            <div style="text-align: center; background: rgba(0,255,0,0.1); padding: 2px;">
                <div style="color: #fff; font-weight: bold;">${shotsPerSecond}</div>
                <div style="color: #666;">SPD</div>
            </div>
            <div style="text-align: center; background: rgba(255,0,255,0.1); padding: 2px;">
                <div style="color: #ff00ff; font-weight: bold;">${calculateDPS(tower)}</div>
                <div style="color: #666;">DPS</div>
            </div>
        </div>
        
        ${canUpgrade ? `
        <!-- Upgrade preview -->
        <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid #ffd700; padding: 3px; margin-bottom: 6px; font-size: 9px; text-align: center;">
            <div style="color: #ffd700; font-weight: bold;">NEXT: ${nextLevelStats}</div>
        </div>
        ` : ''}
        
        <!-- Action buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <button id="towerUpgradeBtn" style="
                padding: 6px;
                background: ${canUpgrade ? 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)' : 'linear-gradient(135deg, #666 0%, #444 100%)'};
                color: ${canUpgrade ? '#000' : '#666'};
                border: none;
                cursor: ${canUpgrade ? 'pointer' : 'not-allowed'};
                font-weight: bold;
                font-size: 10px;
                text-transform: uppercase;
            " ${!canUpgrade ? 'disabled' : ''}>
                🆙 ${canUpgrade ? `$${upgradeCost}` : 'MAX'}
            </button>
            
            <button id="towerSellBtn" style="
                padding: 6px;
                background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
                color: white;
                border: none;
                cursor: pointer;
                font-weight: bold;
                font-size: 10px;
                text-transform: uppercase;
            ">
                💰 $${sellValue}
            </button>
        </div>
        
        <!-- Targeting priority selector -->
        <div style="background: rgba(255,255,255,0.05); border: 1px solid #666; padding: 4px; margin-bottom: 6px; font-size: 8px;">
            <div style="color: #aaa; margin-bottom: 2px; text-align: center;">TARGET PRIORITY</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px;">
                <select id="towerTargetMode" style="
                    width: 100%;
                    background: #1a1a1a;
                    color: #00ff88;
                    border: 1px solid #00ff88;
                    font-size: 8px;
                    padding: 2px;
                    cursor: pointer;
                " onchange="changeTowerTargeting('${tower.type}', this.value)">
                    <option value="first" ${tower.targetingPriority === 'first' ? 'selected' : ''}>🎯 First (Front)</option>
                    <option value="last" ${tower.targetingPriority === 'last' ? 'selected' : ''}>🔙 Last (Back)</option>
                    <option value="strongest" ${tower.targetingPriority === 'strongest' ? 'selected' : ''}>💪 Strongest</option>
                    <option value="weakest" ${tower.targetingPriority === 'weakest' ? 'selected' : ''}>🔪 Weakest</option>
                    <option value="closest" ${tower.targetingPriority === 'closest' ? 'selected' : ''}>📍 Closest</option>
                </select>
            </div>
        </div>
        
        ${tower.kills > 0 ? `
        <!-- Kill counter and effectiveness -->
        <div style="background: rgba(255,255,255,0.05); border: 1px solid #444; padding: 3px; margin-top: 4px; font-size: 8px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                <div style="text-align: center;">
                    <div style="color: #ffd700; font-weight: bold;">${tower.kills}</div>
                    <div style="color: #666;">TOTAL</div>
                </div>
                <div style="text-align: center;">
                    <div style="color: #00ff88; font-weight: bold;">${getFavoriteTarget(tower)}</div>
                    <div style="color: #666;">TOP TARGET</div>
                </div>
            </div>
        </div>
        ` : ''}
    `;
    
    // Show the panel
    towerInfoPanel.style.display = 'block';
    
    // Add event listeners
    setTimeout(() => {
        const upgradeBtn = document.getElementById('towerUpgradeBtn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                if (tower.upgrade()) {
                    GameConsole.success(`🆙 ${TOWERS[tower.type].name} upgraded to Level ${tower.level}!`);
                    showTowerControls(tower); // Refresh the panel
                    updateUI();
                }
            });
        }
        
        const sellBtn = document.getElementById('towerSellBtn');
        if (sellBtn) {
            sellBtn.addEventListener('click', () => {
                sellTower(tower);
            });
        }
        

    }, 10);
}

function hideTowerControls() {
    const towerInfoPanel = document.getElementById('towerInfoPanel');
    if (towerInfoPanel) {
        towerInfoPanel.style.display = 'none';
    }
    gameState.selectedTower = null;
    gameState.selectedTowerType = null;
    updateTowerPanel();
    updateSpecialTowersPanel();
}

function hideTowerContextMenu() {
    if (gameState.contextMenu) {
        gameState.contextMenu.remove();
        gameState.contextMenu = null;
    }
}

function changeTowerTargeting(towerType, newMode) {
    // Find all towers of this type and update their targeting
    const towersOfType = gameState.towers.filter(tower => tower.type === towerType);
    towersOfType.forEach(tower => {
        tower.targetingPriority = newMode;
    });
    GameConsole.info(`🎯 ${TOWERS[towerType].name} targeting set to: ${newMode.toUpperCase()}`);
}

// Add DPS calculation function
function calculateDPS(tower) {
    if (tower.fireRate <= 0) return 0;
    return (tower.damage * 60 / tower.fireRate).toFixed(2);
}

// Get tower's favorite enemy type
function getFavoriteTarget(tower) {
    let maxKills = 0;
    let favoriteType = 'None';
    
    for (const [enemyType, kills] of Object.entries(tower.killTypes)) {
        if (kills > maxKills) {
            maxKills = kills;
            favoriteType = ENEMIES[enemyType].name;
        }
    }
    
    return favoriteType;
}



// v2.5: Game Speed Control
function setGameSpeed(speed) {
    gameState.gameSpeed = speed;
    
    // Update UI buttons
    ['speed1x', 'speed2x', 'speed5x'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            const btnSpeed = parseInt(id.replace('speed', '').replace('x', ''));
            if (btnSpeed === speed) {
                btn.style.background = '#ff6b35';
                btn.style.color = '#000';
                btn.style.boxShadow = '0 0 10px #ff6b35';
            } else {
                btn.style.background = '#1a1a1a';
                btn.style.color = '#666';
                btn.style.boxShadow = 'none';
            }
        }
    });
    
    GameConsole.info(`⚡ Game speed set to ${speed}x`);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameState.isPlaying && !gameState.isWaveActive) {
        startWave();
    }
    
    // v2.5: Tower keyboard shortcuts
    if (gameState.isPlaying && gameState.selectedTower) {
        const tower = gameState.selectedTower;
        const key = e.key.toLowerCase();
        
        // U = Upgrade
        if (key === 'u' && tower.level < tower.maxLevel) {
            const upgradeCost = tower.getUpgradeCost();
            if (gameState.money >= upgradeCost && tower.upgrade()) {
                GameConsole.success(`🆙 ${TOWERS[tower.type].name} upgraded to Level ${tower.level}!`);
                updateUI();
                updateTowerInfoPanel();
            }
        }
        
        // S = Sell
        if (key === 's') {
            sellTower(tower);
        }
    }
    
    // P = Pause (simple toggle)
    if (e.key.toLowerCase() === 'p' && gameState.isPlaying) {
        togglePause();
    }
    
    // ESC = Deselect tower
    if (e.key === 'Escape' && gameState.isPlaying && gameState.selectedTower) {
        hideTowerControls();
        GameConsole.info('🎯 Tower deselected');
    }
});

// ==========================================
// GAME LOGIC
// ==========================================
function canPlaceTower(gridX, gridY) {
    if (gridX < 0 || gridX >= COLS || gridY < 0 || gridY >= ROWS) return false;
    
    const map = MAPS[gameState.selectedMap];
    for (const pathCell of map.path) {
        if (pathCell.x === gridX && pathCell.y === gridY) return false;
    }
    
    if (gameState.towers.some(t => t.gridX === gridX && t.gridY === gridY)) return false;
    
    return true;
}

// v2.0: Get tower cost with bulk buying discount
function getTowerCost(type) {
    const baseCost = TOWERS[type].cost;
    const discount = gameState.permanentUpgrades.bulkBuying * 0.02; // 2% per rank
    return Math.floor(baseCost * (1 - discount));
}

function placeTower(type, gridX, gridY) {
    const tower = TOWERS[type];
    const cost = getTowerCost(type);
    if (gameState.money >= cost) {
        gameState.money -= cost;
        const newTower = new Tower(type, gridX, gridY);
        gameState.towers.push(newTower);
        gameState.selectedTower = newTower;

        SoundSystem.playBuild();

        updateUnlockProgress('towersBuilt', 1);
        checkUnlocks();

        updateUI();
        updateTowerPanel();
        updateSpecialTowersPanel();

        GameConsole.success(`Built ${tower.name} for $${cost}`);

        for (let i = 0; i < 5; i++) {
            gameState.particles.push(new Particle(
                gridX * GRID_SIZE + GRID_SIZE / 2,
                gridY * GRID_SIZE + GRID_SIZE / 2,
                '#00ff00'
            ));
        }
    } else {
        GameConsole.error(`Not enough money! Need $${cost}`);
    }
}

function sellTower(tower) {
    // v2.5: Sell returns 70% of TOTAL invested (base cost + all upgrades)
    const refund = tower.getSellValue();
    gameState.money += refund;
    gameState.towers = gameState.towers.filter(t => t !== tower);
    gameState.selectedTower = null;

    SoundSystem.playCash();
    GameConsole.info(`Sold ${TOWERS[tower.type].name} for $${refund}`);

    updateUI();
    updateTowerPanel();
    updateSpecialTowersPanel();
}

// ==========================================
// COUNTDOWN & WAVE SYSTEM
// ==========================================
function startCountdown() {
    if (gameState.difficulty === 'easy') {
        gameState.maxCountdown = 60;
    } else if (gameState.difficulty === 'normal') {
        gameState.maxCountdown = 30;
    } else {
        gameState.maxCountdown = 15;
    }
    
    gameState.countdownTimer = gameState.maxCountdown;
    gameState.countdownActive = true;
    updateCountdownDisplay();
}

function updateCountdownDisplay() {
    const countdownEl = document.getElementById('countdown');
    const waveBtn = document.getElementById('waveBtn');
    const waveCountdownEl = document.getElementById('waveCountdown');
    
    if (waveCountdownEl) {
        waveCountdownEl.textContent = gameState.countdownActive ? gameState.countdownTimer + 's' : '--';
        if (gameState.countdownTimer <= 5 && gameState.countdownTimer > 0) {
            waveCountdownEl.classList.add('urgent');
        } else {
            waveCountdownEl.classList.remove('urgent');
        }
    }
    
    if (countdownEl) {
        if (gameState.autoWave) {
            countdownEl.textContent = 'AUTO';
            countdownEl.style.color = '#00ff00';
            countdownEl.classList.remove('urgent');
        } else {
            countdownEl.textContent = gameState.countdownTimer + 's';
            countdownEl.style.color = '#ff6b35';
            
            if (gameState.countdownTimer <= 5 && gameState.countdownTimer > 0) {
                countdownEl.classList.add('urgent');
            } else {
                countdownEl.classList.remove('urgent');
            }
        }
    }
    
    if (waveBtn) {
        if (gameState.isWaveActive) {
            waveBtn.disabled = true;
            waveBtn.textContent = 'IN PROGRESS';
        } else if (gameState.autoWave) {
            waveBtn.disabled = false;
            waveBtn.textContent = 'AUTO ON';
        } else {
            waveBtn.disabled = false;
            waveBtn.textContent = 'START WAVE';
        }
    }
}

function startWave() {
    if (gameState.isWaveActive) return;
    
    gameState.isWaveActive = true;
    
    // NEW: First wave starts the game timer
    if (!gameState.firstWaveStarted) {
        gameState.firstWaveStarted = true;
        gameState.gameStartTime = Date.now();
        GameConsole.success('🎮 Game started! Timer is now running.');
    }
    
    const wave = gameState.waves[gameState.wave - 1];
    gameState.waveEnemiesRemaining = wave.enemies.reduce((sum, e) => sum + e.count, 0);
    gameState.currentWaveEnemies = [...wave.enemies];
    
    const music = document.getElementById('gameMusic');
    if (music && music.paused) {
        music.play().catch(e => console.log('Music play failed:', e));
    }
    
    gameState.waveStartTime = Date.now();
    
    GameConsole.info(`⚔️ Wave ${gameState.wave} started! ${gameState.waveEnemiesRemaining} enemies incoming.`);
    
    updateWaveInfo();
    updateCountdownDisplay();
}

function stopMusic() {
    const music = document.getElementById('gameMusic');
    if (music && !music.paused) {
        music.pause();
    }
}

function spawnEnemy() {
    if (!gameState.isWaveActive || gameState.waveEnemiesRemaining <= 0) return;
    
    gameState.waveSpawnTimer++;
    if (gameState.waveSpawnTimer < gameState.waves[gameState.wave - 1].interval) return;
    
    gameState.waveSpawnTimer = 0;
    
    for (const enemyGroup of gameState.currentWaveEnemies) {
        if (enemyGroup.count > 0) {
            const map = MAPS[gameState.selectedMap];
            gameState.enemies.push(new Enemy(enemyGroup.type, map.path));
            enemyGroup.count--;
            gameState.waveEnemiesRemaining--;
            break;
        }
    }
}

// ==========================================
// UPDATE FUNCTIONS
// ==========================================
function update() {
    if (!gameState.isPlaying) return;
    
    gameState.frame++;
    
    if (gameState.isWaveActive) {
        spawnEnemy();
    }
    
    // Update enemies
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        
        if (gameState.freezeActive) {
            enemy.frozen = true;
        } else {
            enemy.frozen = false;
        }
        
        const reachedEnd = enemy.update();
        
        if (reachedEnd) {
            gameState.lives--;
            gameState.enemies.splice(i, 1);
            GameConsole.error(`💔 Enemy reached base! Lives: ${gameState.lives}`);
            updateUI();
            
            if (gameState.lives <= 0) {
                gameOver();
            }
        } else if (enemy.health <= 0) {
            // v2.5: Speed kill bonus - if enemy dies before 50% of path
            const pathPercent = enemy.pathIndex / (enemy.path.length - 1);
            let bonusGold = 0;
            if (pathPercent < 0.5) {
                bonusGold = Math.floor(enemy.reward * 0.25);
                // Float text effect
                gameState.particles.push(new FloatingText(enemy.x, enemy.y, `+$${bonusGold}`, '#ffd700'));
            }
            
            gameState.money += enemy.reward + bonusGold;
            gameState.score += enemy.reward * 10;
            updateUnlockProgress('enemiesKilled', 1);
            updateUnlockProgress('moneyEarned', enemy.reward);
            
            // v2.0: Scavenger upgrade bonus
            if (gameState.permanentUpgrades.scavenger > 0) {
                gameState.money += gameState.permanentUpgrades.scavenger;
            }
            
            // v2.5: Procedural explosion
            createExplosion(enemy.x, enemy.y, enemy.isBoss ? 30 : 15);
            
            SoundSystem.playExplosion();
            
            gameState.enemies.splice(i, 1);
            updateUI();
            checkUnlocks();
        }
    }
    
    // Update towers
    gameState.towers.forEach(tower => tower.update());
    
    // Update projectiles
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
        if (gameState.projectiles[i].update()) {
            gameState.projectiles.splice(i, 1);
        }
    }
    
    // Update particles
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        if (gameState.particles[i].update()) {
            gameState.particles.splice(i, 1);
        }
    }
    
    // Check wave complete
    if (gameState.isWaveActive && gameState.waveEnemiesRemaining === 0 && gameState.enemies.length === 0) {
        gameState.isWaveActive = false;
        gameState.wave++;
        updateUnlockProgress('wavesCompleted', 1);
        
        // v2.0: Earn scrap for completing wave
        gameState.scrap++;
        GameConsole.bonus(`🔧 +1 Scrap earned! (Total: ${gameState.scrap})`);
        saveScrapData();
        
        if (gameState.wave > gameState.waveCount) {
            victory();
        } else {
            GameConsole.success(`✅ Wave ${gameState.wave - 1} complete!`);
            updateUI();
            updateWaveInfo();
            checkUnlocks();
            
            if (gameState.autoWave) {
                gameState.countdownActive = false;
                updateCountdownDisplay();
                setTimeout(() => {
                    if (!gameState.isWaveActive && gameState.isPlaying) {
                        startWave();
                    }
                }, 1500);
            } else {
                startCountdown();
            }
        }
    }
    
    // Update countdown - AUTO-WAVE MODE: Auto-start after 30 seconds!
    if (gameState.countdownActive && !gameState.isWaveActive) {
        if (gameState.frame % 60 === 0) {
            gameState.countdownTimer--;
            updateCountdownDisplay();
            
            const timeElapsed = gameState.maxCountdown - gameState.countdownTimer;
            
            // AUTO-WAVE: Start after 30 seconds of build time
            if (gameState.autoWave && timeElapsed >= 30) {
                GameConsole.info('⏰ Auto-wave starting after 30s build time!');
                gameState.countdownActive = false;
                startWave();
            }
            // Normal countdown reached zero
            else if (gameState.countdownTimer <= 0) {
                gameState.countdownActive = false;
                startWave();
            }
        }
    }
    
    // Update abilities cooldown
    Object.keys(gameState.abilities).forEach(key => {
        if (gameState.abilities[key].cooldown > 0) {
            gameState.abilities[key].cooldown--;
            
            const cooldownText = document.getElementById(key + 'CooldownText');
            if (cooldownText) {
                const seconds = Math.ceil(gameState.abilities[key].cooldown / 60);
                cooldownText.textContent = seconds > 0 ? seconds + 's' : '';
            }
            
            const cooldownOverlay = document.getElementById(key + 'Cooldown');
            if (cooldownOverlay) {
                const maxCooldown = gameState.abilities[key].maxCooldown;
                const currentCooldown = gameState.abilities[key].cooldown;
                const percentage = (currentCooldown / maxCooldown) * 100;
                cooldownOverlay.style.height = percentage + '%';
            }
            
            const btn = document.getElementById(key + 'Btn');
            if (btn) {
                if (gameState.abilities[key].cooldown > 0) {
                    btn.classList.add('cooldown');
                } else {
                    btn.classList.remove('cooldown');
                }
            }
        }
    });
    
    // Update freeze
    if (gameState.freezeTimer > 0) {
        gameState.freezeTimer--;
        if (gameState.freezeTimer <= 0) {
            gameState.freezeActive = false;
        }
    }
    
    // Update displays every second
    if (gameState.frame % 60 === 0) {
        updateTimeDisplays();
    }
}

// ==========================================
// DRAW FUNCTIONS
// ==========================================
function draw() {
    // v2.0: Screen shake effect
    let shakeX = 0;
    let shakeY = 0;
    if (gameState.screenShake > 0) {
        shakeX = (Math.random() - 0.5) * 8;
        shakeY = (Math.random() - 0.5) * 8;
        gameState.screenShake -= 16; // Decrease by 16ms per frame (60fps)
        if (gameState.screenShake < 0) gameState.screenShake = 0;
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!gameState.isPlaying) {
        ctx.fillStyle = '#666';
        ctx.font = '24px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('Select options and click Start Game', canvas.width/2, canvas.height/2);
        ctx.restore();
        return;
    }

    const map = MAPS[gameState.selectedMap];
    
    // Draw ground
    const groundTexture = TextureGenerator.getTexture('rock', map.color);
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            ctx.drawImage(groundTexture, x * GRID_SIZE, y * GRID_SIZE);
        }
    }
    
    // Draw path
    const pathTexture = TextureGenerator.getTexture('path', map.pathColor);
    for (const cell of map.path) {
        ctx.drawImage(pathTexture, cell.x * GRID_SIZE, cell.y * GRID_SIZE);
    }

    // v2.0: Placement Grid (when placing towers) - respects settings
    if (gameState.isPlaying && gameState.selectedTowerType && gameSettings.grid) {
        ctx.lineWidth = 1;
        for (let x = 0; x < COLS; x++) {
            for (let y = 0; y < ROWS; y++) {
                const canPlace = canPlaceTower(x, y);
                ctx.strokeStyle = canPlace ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 0, 0, 0.3)';
                ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }

    // Draw start and end bases
    const startX = map.start.x * GRID_SIZE + GRID_SIZE/2;
    const startY = map.start.y * GRID_SIZE + GRID_SIZE/2;
    const endX = map.end.x * GRID_SIZE + GRID_SIZE/2;
    const endY = map.end.y * GRID_SIZE + GRID_SIZE/2;
    
    // Start base
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(startX, startY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('▶', startX, startY);
    
    // End base
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(endX, endY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(endX, endY, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(endX - 8, endY);
    ctx.lineTo(endX + 8, endY);
    ctx.moveTo(endX, endY - 8);
    ctx.lineTo(endX, endY + 8);
    ctx.stroke();
    
    // Draw towers
    gameState.towers.forEach(tower => tower.draw());

    // v2.5: Draw walls
    gameState.walls.forEach(wall => wall.draw());

    // Draw enemies
    gameState.enemies.forEach(enemy => enemy.draw());
    
    // Draw projectiles
    gameState.projectiles.forEach(proj => proj.draw());
    
    // Draw particles
    gameState.particles.forEach(particle => particle.draw());
    
    // Draw placement preview
    if (gameState.isPlaying && gameState.selectedTowerType) {
        const gridX = Math.floor(mouseX / GRID_SIZE);
        const gridY = Math.floor(mouseY / GRID_SIZE);
        
        if (canPlaceTower(gridX, gridY)) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        } else {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        }
        
        ctx.fillRect(gridX * GRID_SIZE, gridY * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        
        const tower = TOWERS[gameState.selectedTowerType];
        if (tower.range > 0) {
            ctx.beginPath();
            ctx.arc(
                gridX * GRID_SIZE + GRID_SIZE / 2,
                gridY * GRID_SIZE + GRID_SIZE / 2,
                tower.range,
                0, Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255, 107, 53, 0.2)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 107, 53, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
    
    // Draw wave progress
    if (gameState.isWaveActive) {
        ctx.fillStyle = '#fff';
        ctx.font = '16px Courier New';
        ctx.textAlign = 'left';
        const wave = gameState.waves[gameState.wave - 1];
        const total = wave.enemies.reduce((sum, e) => sum + e.count, 0);
        const spawned = total - gameState.waveEnemiesRemaining;
        ctx.fillText(`Wave Progress: ${spawned}/${total}`, 10, 30);
    }

    ctx.restore();
}

function updateFPS() {
    if (!gameState.fpsLastTime) {
        gameState.fpsLastTime = performance.now();
        gameState.fpsFrames = 0;
        return;
    }
    
    gameState.fpsFrames++;
    const now = performance.now();
    const elapsed = now - gameState.fpsLastTime;
    
    if (elapsed >= 1000) { // Update every second
        const fps = Math.round((gameState.fpsFrames * 1000) / elapsed);
        const fpsElement = document.getElementById('fpsValue');
        if (fpsElement) {
            fpsElement.textContent = fps;
        }
        gameState.fpsLastTime = now;
        gameState.fpsFrames = 0;
    }
}

function drawMapPreview(canvasId, mapIndex) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const map = MAPS[mapIndex];
    if (!map) return;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 160, 100);
    
    // Draw grid pattern (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= 30; x++) {
        const scaledX = (x / 30) * 160;
        ctx.beginPath();
        ctx.moveTo(scaledX, 0);
        ctx.lineTo(scaledX, 100);
        ctx.stroke();
    }
    for (let y = 0; y <= 15; y++) {
        const scaledY = (y / 15) * 100;
        ctx.beginPath();
        ctx.moveTo(0, scaledY);
        ctx.lineTo(160, scaledY);
        ctx.stroke();
    }
    
    // Draw path
    ctx.strokeStyle = map.pathColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    map.path.forEach((point, index) => {
        const scaledX = (point.x / 30) * 160;
        const scaledY = (point.y / 15) * 100;
        
        if (index === 0) {
            ctx.moveTo(scaledX, scaledY);
        } else {
            ctx.lineTo(scaledX, scaledY);
        }
    });
    ctx.stroke();
    
    // Draw start point
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    const startX = (map.start.x / 30) * 160;
    const startY = (map.start.y / 15) * 100;
    ctx.arc(startX, startY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw end point
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    const endX = (map.end.x / 30) * 160;
    const endY = (map.end.y / 15) * 100;
    ctx.arc(endX, endY, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add map name label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(map.name, 80, 95);
}

function gameLoop() {
    // v2.5: FPS counter
    updateFPS();

    // v2.5: Pause handling
    if (gameState.isPaused) {
        // Still draw but don't update
        draw();
        // Draw pause overlay
        drawPauseOverlay();
        requestAnimationFrame(gameLoop);
        return;
    }

    // v2.5: Speed control - update multiple times per frame
    const updatesPerFrame = gameState.gameSpeed;
    for (let i = 0; i < updatesPerFrame; i++) {
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

function drawPauseOverlay() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = '#888';
    ctx.font = '18px Courier New';
    ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 50);
}

function togglePause() {
    if (!gameState.isPlaying) return;

    gameState.isPaused = !gameState.isPaused;

    if (gameState.isPaused) {
        GameConsole.info('⏸️ Game paused');
    } else {
        GameConsole.info('▶️ Game resumed');
    }
}

// ==========================================
// UI FUNCTIONS
// ==========================================
function updateUI() {
    document.getElementById('money').textContent = gameState.money.toLocaleString();
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('wave').textContent = `${gameState.wave}/${gameState.waveCount}`;
    document.getElementById('score').textContent = gameState.score.toLocaleString();
}

function updateWaveInfo() {
    if (gameState.wave > gameState.waveCount) return;
    
    const wave = gameState.waves[gameState.wave - 1];
    const hasAir = wave.enemies.some(e => ENEMIES[e.type].type === 'air');
    const hasGround = wave.enemies.some(e => ENEMIES[e.type].type === 'ground');
    
    let typeText = '';
    if (hasAir && hasGround) typeText = 'Mixed Units';
    else if (hasAir) typeText = 'Air Units';
    else typeText = 'Ground Units';
    
    document.getElementById('nextWaveType').textContent = typeText;
}

function updateTimeDisplays() {
    // Game time - only if first wave started
    const timePlayedEl = document.getElementById('timePlayed');
    if (timePlayedEl) {
        if (gameState.firstWaveStarted && gameState.gameStartTime) {
            const totalSeconds = Math.floor((Date.now() - gameState.gameStartTime) / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            timePlayedEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timePlayedEl.textContent = '--:--';
        }
    }
    
    // Wave time
    const waveTimeEl = document.getElementById('waveTime');
    if (waveTimeEl) {
        if (gameState.isWaveActive && gameState.waveStartTime) {
            const waveSeconds = Math.floor((Date.now() - gameState.waveStartTime) / 1000);
            const minutes = Math.floor(waveSeconds / 60);
            const seconds = waveSeconds % 60;
            waveTimeEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            waveTimeEl.textContent = '--:--';
        }
    }
    
    // Next spawn - fixed calculation
    const nextSpawnEl = document.getElementById('nextSpawn');
    if (nextSpawnEl) {
        if (gameState.isWaveActive && gameState.waveEnemiesRemaining > 0) {
            const spawnDelay = gameState.waves[gameState.wave - 1].interval;
            const currentDelay = gameState.waveSpawnTimer;
            // Convert frames to seconds (60fps) and round properly
            const remainingFrames = spawnDelay - currentDelay;
            const remainingSeconds = Math.max(0, Math.round(remainingFrames / 60));
            nextSpawnEl.textContent = remainingSeconds > 0 ? remainingSeconds + 's' : 'NOW';
        } else if (gameState.countdownActive && !gameState.autoWave) {
            nextSpawnEl.textContent = gameState.countdownTimer + 's';
        } else if (gameState.autoWave) {
            nextSpawnEl.textContent = 'AUTO';
        } else {
            nextSpawnEl.textContent = '--';
        }
    }
    
    // Update skip bonus display
    const skipBonusEl = document.getElementById('skipBonusAmount');
    const skipBonusInfoEl = document.getElementById('skipBonus');
    const timeElapsed = gameState.maxCountdown - gameState.countdownTimer;
    
    if (skipBonusEl && gameState.countdownActive && !gameState.isWaveActive) {
        const percentRemaining = gameState.countdownTimer / gameState.maxCountdown;
        let bonusText = '';
        let bonusColor = '#ffd700';
        
        // MAX BONUS: First 30 seconds
        if (timeElapsed <= 30) {
            const maxBonus = gameState.difficulty === 'hard' ? 1000 : 
                            gameState.difficulty === 'normal' ? 800 : 500;
            bonusText = `+${maxBonus} MAX!`;
            bonusColor = '#00ff00';
        } else if (percentRemaining >= 0.5) {
            const partialBonus = Math.floor((gameState.difficulty === 'hard' ? 1000 : 
                                            gameState.difficulty === 'normal' ? 800 : 500) * percentRemaining);
            bonusText = `+${partialBonus}`;
            bonusColor = '#ffaa00';
        } else if (percentRemaining > 0) {
            bonusText = `+${gameState.countdownTimer * 10}`;
            bonusColor = '#ff6b35';
        } else {
            bonusText = 'NONE';
            bonusColor = '#666';
        }
        
        skipBonusEl.textContent = bonusText;
        skipBonusEl.style.color = bonusColor;
    } else if (skipBonusEl) {
        skipBonusEl.textContent = gameState.isWaveActive ? 'ACTIVE' : 'WAIT';
        skipBonusEl.style.color = '#666';
    }
    
    if (skipBonusInfoEl && gameState.countdownActive) {
        // Show MAX BONUS for first 30 seconds
        if (timeElapsed <= 30) {
            skipBonusInfoEl.textContent = '⭐ MAX BONUS (30s)';
            skipBonusInfoEl.style.color = '#00ff00';
        } else if (gameState.countdownTimer / gameState.maxCountdown >= 0.5) {
            skipBonusInfoEl.textContent = '💰 Good Bonus';
            skipBonusInfoEl.style.color = '#ffaa00';
        } else {
            skipBonusInfoEl.textContent = 'Skip: +pts';
            skipBonusInfoEl.style.color = '#888';
        }
    }
}

function updateTowerPanel() {
    const panel = document.getElementById('towerPanel');
    panel.innerHTML = '<h3>Combat Towers</h3>';
    
    // Only show regular towers (not special)
    Object.keys(TOWERS).forEach(key => {
        const tower = TOWERS[key];
        
        // Skip special towers
        if (tower.category === 'special') return;
        
        const btn = document.createElement('div');
        btn.className = 'tower-btn';
        
        if (!gameState.unlockedTowers.includes(key)) {
            btn.classList.add('locked');
            btn.title = 'Locked - Complete objectives to unlock';
        }
        
        if (gameState.selectedTowerType === key) {
            btn.classList.add('selected');
        }
        
        btn.innerHTML = `
            <div class="tower-icon">${tower.icon}</div>
            <div class="tower-info">
                <div class="tower-name">${tower.name}</div>
                <div class="tower-type">${tower.type}</div>
            </div>
            <div class="tower-cost">$${tower.cost}</div>
        `;
        
        btn.addEventListener('click', () => {
            if (gameState.unlockedTowers.includes(key)) {
                gameState.selectedTowerType = key;
                gameState.selectedTower = null;
                updateTowerPanel();
                updateSpecialTowersPanel();
                GameConsole.info(`Selected ${tower.name}`);
            } else {
                GameConsole.warn(`${tower.name} is locked!`);
            }
        });
        
        panel.appendChild(btn);
    });
}

// NEW: Special towers panel (bottom toolbar)
function updateSpecialTowersPanel() {
    const container = document.getElementById('specialTowersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Show only special towers
    const specialTowerKeys = Object.keys(TOWERS).filter(key => TOWERS[key].category === 'special');
    
    specialTowerKeys.forEach(key => {
        const tower = TOWERS[key];
        const btn = document.createElement('div');
        btn.className = 'special-tower-btn';
        
        if (!gameState.unlockedTowers.includes(key)) {
            btn.classList.add('locked');
            btn.title = `Locked: ${getUnlockRequirement(key)}`;
        }
        
        if (gameState.selectedTowerType === key) {
            btn.classList.add('selected');
        }
        
        btn.innerHTML = `
            <div class="special-tower-icon">${tower.icon}</div>
            <div class="special-tower-name">${tower.name}</div>
            <div class="special-tower-cost">$${tower.cost}</div>
        `;
        
        btn.addEventListener('click', () => {
            if (gameState.unlockedTowers.includes(key)) {
                gameState.selectedTowerType = key;
                gameState.selectedTower = null;
                updateTowerPanel();
                updateSpecialTowersPanel();
                GameConsole.info(`Selected ${tower.name}`);
            } else {
                GameConsole.warn(`${tower.name} is locked! ${getUnlockRequirement(key)}`);
            }
        });
        
        container.appendChild(btn);
    });
}

function getUnlockRequirement(towerKey) {
    const tower = TOWERS[towerKey];
    if (!tower.unlockRequirement) return '';
    
    const reqs = [];
    for (const [key, value] of Object.entries(tower.unlockRequirement)) {
        reqs.push(`${value} ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    }
    return `Requires: ${reqs.join(', ')}`;
}

// v2.0: Tower Info Panel - Shows when tower is selected
function updateTowerInfoPanel() {
    const infoPanel = document.getElementById('towerInfoPanel');
    if (!infoPanel) return;
    
    if (gameState.selectedTower) {
        const tower = gameState.selectedTower;
        const template = TOWERS[tower.type];
        infoPanel.innerHTML = `
            <h3 style="color: #ff6b35; margin-bottom: 10px; font-size: 14px;">📊 ${template.name} Stats</h3>
            <div style="font-size: 11px; color: #ccc; line-height: 1.6;">
                <div style="margin-bottom: 5px;"><strong style="color: #00ff88;">Level:</strong> ${tower.level}</div>
                <div style="margin-bottom: 5px;"><strong style="color: #ffd700;">Kills:</strong> ${tower.kills}</div>
                <div style="margin-bottom: 5px;"><strong style="color: #ff6b35;">Damage Dealt:</strong> ${Math.floor(tower.damageDealt)}</div>
                <div style="margin-bottom: 5px;"><strong style="color: #00ffff;">Targeting:</strong> ${tower.targetingPriority.toUpperCase()}</div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #333; font-size: 9px; color: #888;">
                    Click tower to change targeting
                </div>
            </div>
        `;
        infoPanel.style.display = 'block';
    } else {
        infoPanel.innerHTML = `
            <h3 style="color: #666; margin-bottom: 10px; font-size: 14px;">📊 Tower Info</h3>
            <div style="font-size: 11px; color: #666; text-align: center; padding: 20px 0;">
                Select a tower to view stats
            </div>
        `;
    }
}

function checkUnlocks() {
    Object.keys(TOWERS).forEach(key => {
        if (gameState.unlockedTowers.includes(key)) return;
        
        const tower = TOWERS[key];
        if (!tower.unlockRequirement) {
            gameState.unlockedTowers.push(key);
            GameConsole.success(`🔓 Unlocked: ${tower.name}!`);
            return;
        }
        
        let unlocked = true;
        for (const [req, value] of Object.entries(tower.unlockRequirement)) {
            if ((gameState.unlockProgress[req] || 0) < value) {
                unlocked = false;
                break;
            }
        }
        
        if (unlocked) {
            gameState.unlockedTowers.push(key);
            GameConsole.success(`🔓 Unlocked: ${tower.name}!`);
        }
    });
    
    updateTowerPanel();
    updateSpecialTowersPanel();
}

function updateUnlockProgress(key, value) {
    gameState.unlockProgress[key] = (gameState.unlockProgress[key] || 0) + value;
}

function showNotification(text) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = text;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.remove();
    }, 2000);
}

// ==========================================
// LEADERBOARD SYSTEM
// ==========================================
const Leaderboard = {
    key: 'canyonDefense_leaderboard',
    
    getScores() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    },
    
    addScore(score, wave, difficulty) {
        const scores = this.getScores();
        const entry = {
            score: score,
            wave: wave,
            difficulty: difficulty,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        };
        
        scores.push(entry);
        scores.sort((a, b) => b.score - a.score);
        scores.splice(10);
        
        localStorage.setItem(this.key, JSON.stringify(scores));
    },
    
    display() {
        const scores = this.getScores();
        const listEl = document.getElementById('leaderboardList');
        
        if (scores.length === 0) {
            listEl.innerHTML = '<p style="color: #888; padding: 20px;">No high scores yet! Be the first!</p>';
        } else {
            let html = '<table style="width: 100%; color: white; border-collapse: collapse;">';
            html += '<tr style="background: rgba(255, 107, 53, 0.3);"><th style="padding: 10px;">Rank</th><th style="padding: 10px;">Score</th><th style="padding: 10px;">Wave</th><th style="padding: 10px;">Difficulty</th><th style="padding: 10px;">Date</th></tr>';
            
            scores.forEach((entry, index) => {
                const rank = index + 1;
                const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
                const difficultyColor = entry.difficulty === 'easy' ? '#4caf50' : entry.difficulty === 'normal' ? '#ff9800' : '#f44336';
                
                html += `<tr style="background: ${index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent'};">`;
                html += `<td style="padding: 10px; font-size: 20px;">${rankEmoji}</td>`;
                html += `<td style="padding: 10px; color: #ffd700; font-weight: bold;">${entry.score.toLocaleString()}</td>`;
                html += `<td style="padding: 10px;">${entry.wave}</td>`;
                html += `<td style="padding: 10px; color: ${difficultyColor}; text-transform: uppercase;">${entry.difficulty}</td>`;
                html += `<td style="padding: 10px; color: #888; font-size: 12px;">${entry.date}</td>`;
                html += '</tr>';
            });
            
            html += '</table>';
            listEl.innerHTML = html;
        }
        
        document.getElementById('leaderboardModal').style.display = 'flex';
    }
};

// ==========================================
// GAME OVER / VICTORY
// ==========================================
function gameOver() {
    gameState.isPlaying = false;
    
    Leaderboard.addScore(gameState.score, gameState.wave - 1, gameState.difficulty);
    
    const menu = document.getElementById('menu');
    menu.style.display = 'block';
    menu.innerHTML = `
        <h1 class="menu-title" style="color: #ff0000;">GAME OVER</h1>
        <p style="margin: 20px 0; font-size: 24px;">Final Score: ${gameState.score.toLocaleString()}</p>
        <p style="margin: 10px 0; color: #888;">Waves Survived: ${gameState.wave - 1}</p>
        <button class="menu-btn" onclick="location.reload()">Play Again</button>
        <button class="menu-btn" onclick="Leaderboard.display()" style="margin-top: 10px; background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);">🏆 View Leaderboard</button>
    `;
    
    GameConsole.error('💀 GAME OVER! Final Score: ' + gameState.score.toLocaleString());
}

function victory() {
    gameState.isPlaying = false;
    
    Leaderboard.addScore(gameState.score, gameState.wave, gameState.difficulty);
    
    const menu = document.getElementById('menu');
    menu.style.display = 'block';
    menu.innerHTML = `
        <h1 class="menu-title" style="color: #00ff00;">VICTORY!</h1>
        <p style="margin: 20px 0; font-size: 24px;">Final Score: ${gameState.score.toLocaleString()}</p>
        <p style="margin: 10px 0; color: #888;">All Waves Complete!</p>
        <button class="menu-btn" onclick="location.reload()">Play Again</button>
        <button class="menu-btn" onclick="Leaderboard.display()" style="margin-top: 10px; background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);">🏆 View Leaderboard</button>
    `;
    
    GameConsole.success('🏆 VICTORY! All waves completed!');
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Abilities
document.getElementById('nukeBtn').addEventListener('click', () => {
    if (gameState.abilities.nuke.cooldown > 0) return;

    SoundSystem.playNuke();

    // v2.0: Screen shake for nuke
    gameState.screenShake = 500; // 500ms heavy shake

    gameState.enemies.forEach(enemy => {
        enemy.takeDamage(500);
    });

    for (let i = 0; i < 50; i++) {
        gameState.particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            '#ff0000'
        ));
    }

    gameState.abilities.nuke.cooldown = gameState.abilities.nuke.maxCooldown;
    GameConsole.bonus('☢️ NUCLEAR STRIKE ACTIVATED!');
});

document.getElementById('freezeBtn').addEventListener('click', () => {
    if (gameState.abilities.freeze.cooldown > 0) return;
    
    gameState.freezeActive = true;
    gameState.freezeTimer = 180;
    gameState.abilities.freeze.cooldown = gameState.abilities.freeze.maxCooldown;
    GameConsole.bonus('❄️ TIME FROZEN!');
});

document.getElementById('wallBtn').addEventListener('click', () => {
    if (gameState.abilities.wall.cooldown > 0) return;
    
    gameState.placingWall = true;
    GameConsole.info('🧱 Click on the path to build a wall');
});

// Menu
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        gameState.difficulty = btn.dataset.diff;
        gameState.waveCount = gameState.difficulty === 'easy' ? 30 : 
                             gameState.difficulty === 'normal' ? 40 : 50;
    });
});

document.querySelectorAll('.map-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.map-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        gameState.selectedMap = parseInt(option.dataset.map);
    });
});

// Start Game
document.getElementById('startBtn').addEventListener('click', () => {
    
    
    SoundSystem.init();
    SoundSystem.resume();
    
    const menu = document.getElementById('menu');
    const gameArea = document.getElementById('gameArea');
    const topToolbar = document.getElementById('topToolbar');
    const leftSidebar = document.getElementById('leftSidebar');
    const towerPanel = document.getElementById('towerPanel');
    const bottomToolbar = document.getElementById('bottomToolbar');
    
    if (menu) menu.style.display = 'none';
    if (gameArea) gameArea.style.display = 'flex';
    if (topToolbar) topToolbar.style.display = 'flex';
    if (leftSidebar) leftSidebar.style.display = 'flex';
    if (towerPanel) towerPanel.style.display = 'flex';
    if (bottomToolbar) bottomToolbar.style.display = 'flex';
    
    // Reset game state
    gameState.money = 500;
    gameState.lives = 10;
    gameState.wave = 1;
    gameState.score = 0;
    gameState.enemies = [];
    gameState.towers = [];
    gameState.walls = []; // v2.5: Clear walls
    gameState.projectiles = [];
    gameState.particles = [];
    gameState.isPlaying = true;
    gameState.isWaveActive = false;
    gameState.firstWaveStarted = false;
    gameState.unlockedTowers = ['missile', 'aa'];
    gameState.unlockProgress = {};
    gameState.waves = generateWaves(gameState.difficulty);
    gameState.frame = 0;
    
    Object.keys(gameState.abilities).forEach(key => {
        gameState.abilities[key].cooldown = 0;
    });
    
    const music = document.getElementById('gameMusic');
    music.volume = 0.15;
    
    updateUI();
    updateTowerPanel();
    updateSpecialTowersPanel();
    updateWaveInfo();
    
    startCountdown();
    
    // Show startup messages
    GameConsole.success('🎮 Game started! Build your defenses...');
    GameConsole.info('⏱️ Timer will start when first wave begins');
});

// Wave button
document.getElementById('waveBtn').addEventListener('click', () => {
    if (!gameState.isWaveActive) {
        gameState.countdownActive = false;
        
// Skip Wave Bonus System - 30 SECONDS MAX BONUS!
        if (gameState.countdownTimer > 0) {
            let skipBonus = 0;
            const percentRemaining = gameState.countdownTimer / gameState.maxCountdown;
            const timeElapsed = gameState.maxCountdown - gameState.countdownTimer;
            
            // MAX BONUS: First 30 seconds to build! Plenty of time!
            if (timeElapsed <= 30) {
                skipBonus = gameState.difficulty === 'hard' ? 1000 : 
                           gameState.difficulty === 'normal' ? 800 : 500;
                GameConsole.bonus(`🏆 MAX SKIP BONUS: +${skipBonus} PTS!`);
            }
            // Good bonus (50%+ remaining after 30s)
            else if (percentRemaining >= 0.5) {
                skipBonus = Math.floor((gameState.difficulty === 'hard' ? 1000 : 
                                       gameState.difficulty === 'normal' ? 800 : 500) * percentRemaining);
                GameConsole.bonus(`⚡ Skip Bonus: +${skipBonus} pts!`);
            }
            // Small bonus (<50% remaining)
            else {
                skipBonus = gameState.countdownTimer * 10;
                if (skipBonus > 0) {
                    GameConsole.bonus(`💨 Speed Bonus: +${skipBonus} pts`);
                }
            }
            
            gameState.score += skipBonus;
        }
        
        startWave();
        updateCountdownDisplay();
        updateUI();
    }
});

// Auto-wave toggle
document.getElementById('autoWaveCheck').addEventListener('change', (e) => {
    gameState.autoWave = e.target.checked;
    GameConsole.info(gameState.autoWave ? '🔄 Auto-Wave Enabled' : '🔄 Auto-Wave Disabled');
    
    if (gameState.autoWave && !gameState.isWaveActive && gameState.countdownActive) {
        gameState.countdownActive = false;
        updateCountdownDisplay();
        setTimeout(() => {
            if (!gameState.isWaveActive && gameState.isPlaying) {
                startWave();
            }
        }, 1000);
    }
    
    updateCountdownDisplay();
});

// Volume controls
function saveAudioSettings() {
    const musicVol = document.getElementById('musicVolume').value;
    const sfxVol = document.getElementById('sfxVolume').value;
    localStorage.setItem('canyonDefense_audio', JSON.stringify({
        music: musicVol,
        sfx: sfxVol
    }));
}

function loadAudioSettings() {
    const saved = localStorage.getItem('canyonDefense_audio');
    if (saved) {
        const settings = JSON.parse(saved);
        document.getElementById('optionsMusicVolume').value = settings.music;
        document.getElementById('optionsMusicVolumeValue').textContent = settings.music + '%';
        document.getElementById('optionsSfxVolume').value = settings.sfx;
        document.getElementById('optionsSfxVolumeValue').textContent = settings.sfx + '%';
        SoundSystem.setMusicVolume(settings.music / 100);
        SoundSystem.setMasterVolume(settings.sfx / 100);
    }
}



// v2.5: Game Settings
const gameSettings = {
    autoWave: true,
    particles: true,
    grid: true,
    fps: true,
    waveAlerts: true,
    skipBonuses: true
};

function saveGameSettings() {
    localStorage.setItem('canyonDefense_settings', JSON.stringify(gameSettings));
}

function loadGameSettings() {
    const saved = localStorage.getItem('canyonDefense_settings');
    if (saved) {
        const settings = JSON.parse(saved);
        Object.assign(gameSettings, settings);
    }
    applySettingsToUI();
}

function loadScrapData() {
    const saved = localStorage.getItem('canyonDefense_scrap');
    if (saved) {
        gameState.scrap = parseInt(saved) || 0;
    }

    const savedUpgrades = localStorage.getItem('canyonDefense_permanentUpgrades');
    if (savedUpgrades) {
        const upgrades = JSON.parse(savedUpgrades);
        Object.assign(gameState.permanentUpgrades, upgrades);
    }
}

function saveScrapData() {
    localStorage.setItem('canyonDefense_scrap', gameState.scrap.toString());
    localStorage.setItem('canyonDefense_permanentUpgrades', JSON.stringify(gameState.permanentUpgrades));
}

function applySettingsToUI() {
    const autoWaveToggle = document.getElementById('autoWaveToggle');
    if (autoWaveToggle) autoWaveToggle.checked = gameSettings.autoWave;
    
    const fpsDisplay = document.getElementById('fpsDisplay');
    if (fpsDisplay) {
        fpsDisplay.style.display = gameSettings.fps ? 'flex' : 'none';
    }
}

function updateSessionStats() {
    const statsContainer = document.getElementById('sessionStats');
    const gameSessionStats = document.getElementById('gameSessionStats');
    
    // Only update if session stats container is visible (game is being played)
    if (!statsContainer || !gameSessionStats || gameSessionStats.style.display === 'none') return;
    
    const playTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
    const minutes = Math.floor(playTime / 60);
    const seconds = playTime % 60;
    
    statsContainer.innerHTML = `
        <div class="stat-row"><span>Kills:</span> <span>${sessionStats.kills}</span></div>
        <div class="stat-row"><span>Gold:</span> <span>$${sessionStats.gold}</span></div>
        <div class="stat-row"><span>Time:</span> <span>${minutes}:${seconds.toString().padStart(2, '0')}</span></div>
    `;
}

function getTowerStats(tower) {
    const baseStats = Tower.getBaseStats(tower.type);
    
    return {
        damage: Math.round(baseStats.damage * (tower.level === 1 ? 1 : tower.level === 2 ? 1.4 : 1.75)),
        range: Math.round(baseStats.range * (tower.level === 1 ? 1 : tower.level === 2 ? 1.2 : 1.35)),
        fireRate: (baseStats.fireRate * (tower.level === 1 ? 1 : tower.level === 2 ? 1.2 : 1.4)).toFixed(2)
    };
}

function showContextMenu(tower, x, y) {
    hideContextMenu();
    
    const menu = document.createElement('div');
    menu.id = 'towerContextMenu';
    menu.className = 'context-menu';
    
    const stats = getTowerStats(tower);
    const upgradeCost = Math.round(Tower.getCost(tower.type) * (tower.level === 1 ? 0.75 : tower.level === 2 ? 2 : 999));
    const sellValue = Math.round(Tower.getCost(tower.type) * (tower.level === 1 ? 0.5 : tower.level === 2 ? 0.75 : 1));
    
    let html = `
        <div class="context-header">${tower.type.toUpperCase()} TOWER <span class="level-badge">LVL ${tower.level}</span></div>
        <div class="context-stats">
            <div class="stat-row"><span>DMG:</span> <span>${stats.damage}</span></div>
            <div class="stat-row"><span>RNG:</span> <span>${stats.range}m</span></div>
            <div class="stat-row"><span>SPD:</span> <span>${stats.fireRate}/s</span></div>
            <div class="stat-row"><span>Kills:</span> <span>${tower.kills || 0}</span></div>
        </div>
    `;
    
    if (tower.level < 3) {
        html += `<button id="upgradeBtn" class="context-btn upgrade">UPGRADE $${upgradeCost}</button>`;
    } else {
        html += `<button id="upgradeBtn" class="context-btn upgrade maxed">MAX LEVEL</button>`;
    }
    
    html += `<button id="sellBtn" class="context-btn sell">SELL $${sellValue}</button>`;
    html += `<button id="contextClose" class="context-close">X</button>`;
    
    menu.innerHTML = html;
    document.body.appendChild(menu);
    
    const closeBtn = document.getElementById('contextClose');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideContextMenu);
    }
    
    const upgradeBtn = document.getElementById('upgradeBtn');
    if (upgradeBtn && tower.level < 3) {
        upgradeBtn.addEventListener('click', () => {
            if (gameState.money >= upgradeCost) {
                gameState.money -= upgradeCost;
                tower.level++;
                tower.damage = Math.round(tower.damage * 1.4);
                tower.range = Math.round(tower.range * 1.2);
                tower.fireRate = tower.fireRate * 1.2;
                hideContextMenu();
                updateUI();
                GameConsole.success(`${tower.type.toUpperCase()} upgraded to level ${tower.level}!`);
            } else {
                GameConsole.warn('Not enough gold!');
            }
        });
    }
    
    const sellBtn = document.getElementById('sellBtn');
    if (sellBtn) {
        sellBtn.addEventListener('click', () => {
            gameState.money += sellValue;
            const index = gameState.towers.indexOf(tower);
            if (index > -1) {
                gameState.towers.splice(index, 1);
            }
            hideContextMenu();
            updateUI();
            GameConsole.info(`${tower.type.toUpperCase()} sold for $${sellValue}`);
        });
    }
    
    requestAnimationFrame(() => {
        const rect = menu.getBoundingClientRect();
        let left = x;
        let top = y;
        
        if (left + rect.width > window.innerWidth) {
            left = window.innerWidth - rect.width - 10;
        }
        if (top + rect.height > window.innerHeight) {
            top = window.innerHeight - rect.height - 10;
        }
        if (left < 10) left = 10;
        if (top < 10) top = 10;
        
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
    });
}

function hideContextMenu() {
    const menu = document.getElementById('towerContextMenu');
    if (menu) {
        menu.remove();
    }
}

// v2.5: Options Modal - Settings Toggles
function syncSettingsToOptions() {
    const optionsAutoWave = document.getElementById('optionsAutoWave');
    const optionsParticles = document.getElementById('optionsParticles');
    const optionsGrid = document.getElementById('optionsGrid');
    const optionsFPS = document.getElementById('optionsFPS');
    const optionsWaveAlerts = document.getElementById('optionsWaveAlerts');
    const optionsSkipBonuses = document.getElementById('optionsSkipBonuses');
    
    if (optionsAutoWave) optionsAutoWave.checked = gameSettings.autoWave;
    if (optionsParticles) optionsParticles.checked = gameSettings.particles;
    if (optionsGrid) optionsGrid.checked = gameSettings.grid;
    if (optionsFPS) optionsFPS.checked = gameSettings.fps;
    if (optionsWaveAlerts) optionsWaveAlerts.checked = gameSettings.waveAlerts;
    if (optionsSkipBonuses) optionsSkipBonuses.checked = gameSettings.skipBonuses;
}



    // Pause Button (was Menu Button)
    const pauseBtn = document.getElementById('pauseBtn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            if (gameState.isPlaying) {
                const optionsModal = document.getElementById('optionsModal');
                if (optionsModal) {
                    syncSettingsToOptions();
                    updateSessionStats();
                    // Show game-specific elements
                    const gameSessionStats = document.getElementById('gameSessionStats');
                    const leaveGameBtn = document.getElementById('leaveGameBtn');
                    if (gameSessionStats) gameSessionStats.style.display = 'block';
                    if (leaveGameBtn) leaveGameBtn.style.display = 'block';
                    optionsModal.style.display = 'flex';
                    gameState.isPaused = true;
                    GameConsole.info('⚙️ Options menu opened');
                }
            }
        });
    }

    // Warning Modal
    const confirmMenuBtn = document.getElementById('confirmMenuBtn');
    if (confirmMenuBtn) {
        confirmMenuBtn.addEventListener('click', function() {
            const warningModal = document.getElementById('warningModal');
            if (warningModal) warningModal.style.display = 'none';
            location.reload();
        });
    }

    const cancelMenuBtn = document.getElementById('cancelMenuBtn');
    if (cancelMenuBtn) {
        cancelMenuBtn.addEventListener('click', function() {
            const warningModal = document.getElementById('warningModal');
            if (warningModal) warningModal.style.display = 'none';
        });
    }

    // Leaderboard
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', function() {
            Leaderboard.display();
        });
    }

    const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
    if (closeLeaderboardBtn) {
        closeLeaderboardBtn.addEventListener('click', function() {
            const modal = document.getElementById('leaderboardModal');
            if (modal) modal.style.display = 'none';
        });
    }

    // How to Play
    const howToPlayBtn = document.getElementById('howToPlayBtn');
    if (howToPlayBtn) {
        howToPlayBtn.addEventListener('click', function() {
            const modal = document.getElementById('howToPlayModal');
            if (modal) modal.style.display = 'flex';
        });
    }

    const closeHowToPlayBtn = document.getElementById('closeHowToPlayBtn');
    if (closeHowToPlayBtn) {
        closeHowToPlayBtn.addEventListener('click', function() {
            const modal = document.getElementById('howToPlayModal');
            if (modal) modal.style.display = 'none';
        });
    }

    const howToPlayModal = document.getElementById('howToPlayModal');
    if (howToPlayModal) {
        howToPlayModal.addEventListener('click', function(e) {
            if (e.target.id === 'howToPlayModal') {
                howToPlayModal.style.display = 'none';
            }
        });
    }

    // Research Lab Functions
    function updateResearchLabUI() {
        const scrapDisplay = document.getElementById('scrapDisplay');
        if (scrapDisplay) scrapDisplay.textContent = gameState.scrap;

        const reinforcedWallsRank = document.getElementById('reinforcedWallsRank');
        if (reinforcedWallsRank) reinforcedWallsRank.textContent = gameState.permanentUpgrades.reinforcedWalls;

        const bulkBuyingRank = document.getElementById('bulkBuyingRank');
        if (bulkBuyingRank) bulkBuyingRank.textContent = gameState.permanentUpgrades.bulkBuying;

        const scavengerRank = document.getElementById('scavengerRank');
        if (scavengerRank) scavengerRank.textContent = gameState.permanentUpgrades.scavenger;

        // Update button states
        const buyReinforcedWalls = document.getElementById('buyReinforcedWalls');
        if (buyReinforcedWalls) {
            const canAfford = gameState.scrap >= 5 && gameState.permanentUpgrades.reinforcedWalls < 10;
            buyReinforcedWalls.disabled = !canAfford;
            buyReinforcedWalls.textContent = canAfford ? 'Upgrade (5 Scrap)' : 
                (gameState.permanentUpgrades.reinforcedWalls >= 10 ? 'MAX LEVEL' : 'Need 5 Scrap');
        }

        const buyBulkBuying = document.getElementById('buyBulkBuying');
        if (buyBulkBuying) {
            const canAfford = gameState.scrap >= 5 && gameState.permanentUpgrades.bulkBuying < 10;
            buyBulkBuying.disabled = !canAfford;
            buyBulkBuying.textContent = canAfford ? 'Upgrade (5 Scrap)' : 
                (gameState.permanentUpgrades.bulkBuying >= 10 ? 'MAX LEVEL' : 'Need 5 Scrap');
        }

        const buyScavenger = document.getElementById('buyScavenger');
        if (buyScavenger) {
            const canAfford = gameState.scrap >= 5 && gameState.permanentUpgrades.scavenger < 10;
            buyScavenger.disabled = !canAfford;
            buyScavenger.textContent = canAfford ? 'Upgrade (5 Scrap)' : 
                (gameState.permanentUpgrades.scavenger >= 10 ? 'MAX LEVEL' : 'Need 5 Scrap');
        }
    }

    function buyUpgrade(type, cost) {
        if (gameState.scrap < cost) {
            GameConsole.error(`Not enough scrap! Need ${cost} scrap.`);
            return;
        }

        if (gameState.permanentUpgrades[type] >= 10) {
            GameConsole.warn('This upgrade is already at max level!');
            return;
        }

        gameState.scrap -= cost;
        gameState.permanentUpgrades[type]++;
        
        // Save the updated scrap and upgrades
        localStorage.setItem('canyonDefense_scrap', gameState.scrap.toString());
        localStorage.setItem('canyonDefense_permanentUpgrades', JSON.stringify(gameState.permanentUpgrades));
        
        // Apply the upgrade effects
        switch(type) {
            case 'reinforcedWalls':
                gameState.lives += 1; // +1 life per rank
                GameConsole.success(`🛡️ Reinforced Walls upgraded to rank ${gameState.permanentUpgrades[type]}! +1 Life`);
                break;
            case 'bulkBuying':
                GameConsole.success(`💰 Bulk Buying upgraded to rank ${gameState.permanentUpgrades[type]}! Tower costs reduced`);
                break;
            case 'scavenger':
                GameConsole.success(`🦅 Scavenger upgraded to rank ${gameState.permanentUpgrades[type]}! +1 Gold per kill`);
                break;
        }
        
        updateResearchLabUI();
        updateUI();
    }

    // Research Lab
    const researchLabBtn = document.getElementById('researchLabBtn');
    if (researchLabBtn) {
        researchLabBtn.addEventListener('click', function() {
            const modal = document.getElementById('researchLabModal');
            if (modal) {
                modal.style.display = 'flex';
                updateResearchLabUI();
            }
        });
    }

    const closeResearchLabBtn = document.getElementById('closeResearchLabBtn');
    if (closeResearchLabBtn) {
        closeResearchLabBtn.addEventListener('click', function() {
            const modal = document.getElementById('researchLabModal');
            if (modal) modal.style.display = 'none';
        });
    }

    const researchLabModal = document.getElementById('researchLabModal');
    if (researchLabModal) {
        researchLabModal.addEventListener('click', function(e) {
            if (e.target.id === 'researchLabModal') {
                researchLabModal.style.display = 'none';
            }
        });
    }

    // Research Lab upgrade buttons
    const buyReinforcedWalls = document.getElementById('buyReinforcedWalls');
    if (buyReinforcedWalls) {
        buyReinforcedWalls.addEventListener('click', function() {
            buyUpgrade('reinforcedWalls', 5);
        });
    }

    const buyBulkBuying = document.getElementById('buyBulkBuying');
    if (buyBulkBuying) {
        buyBulkBuying.addEventListener('click', function() {
            buyUpgrade('bulkBuying', 5);
        });
    }

    const buyScavenger = document.getElementById('buyScavenger');
    if (buyScavenger) {
        buyScavenger.addEventListener('click', function() {
            buyUpgrade('scavenger', 5);
        });
    }

    // Options Modal
    const optionsBtn = document.getElementById('optionsBtn');
    if (optionsBtn) {
        optionsBtn.addEventListener('click', function() {
            applySettingsToUI();
            updateSessionStats();
            // Hide game-specific elements for main menu
            const gameSessionStats = document.getElementById('gameSessionStats');
            const leaveGameBtn = document.getElementById('leaveGameBtn');
            if (gameSessionStats) gameSessionStats.style.display = 'none';
            if (leaveGameBtn) leaveGameBtn.style.display = 'none';
            const modal = document.getElementById('optionsModal');
            if (modal) modal.style.display = 'flex';
        });
    }

    const closeOptionsBtn = document.getElementById('closeOptionsBtn');
    if (closeOptionsBtn) {
        closeOptionsBtn.addEventListener('click', function() {
            const modal = document.getElementById('optionsModal');
            if (modal) {
                modal.style.display = 'none';
                gameState.isPaused = false;
                GameConsole.info('▶️ Game resumed from options');
            }
        });
    }

    const leaveGameBtn = document.getElementById('leaveGameBtn');
    if (leaveGameBtn) {
        leaveGameBtn.addEventListener('click', function() {
            const modal = document.getElementById('optionsModal');
            if (modal) modal.style.display = 'none';
            
            const warningModal = document.getElementById('warningModal');
            if (warningModal) warningModal.style.display = 'flex';
        });
    }

    const optionsModal = document.getElementById('optionsModal');
    if (optionsModal) {
        optionsModal.addEventListener('click', function(e) {
            if (e.target.id === 'optionsModal') {
                optionsModal.style.display = 'none';
                gameState.isPaused = false;
                GameConsole.info('▶️ Game resumed from options');
            }
        });
    }

    // Volume Sliders
    const musicSlider = document.getElementById('musicVolume');
    if (musicSlider) {
        musicSlider.addEventListener('input', function(e) {
            const vol = e.target.value / 100;
            SoundSystem.setMusicVolume(vol);
            const volValue = document.getElementById('musicVolumeValue');
            if (volValue) volValue.textContent = e.target.value + '%';
            saveAudioSettings();
        });
    }

    const sfxSlider = document.getElementById('sfxVolume');
    if (sfxSlider) {
        sfxSlider.addEventListener('input', function(e) {
            const vol = e.target.value / 100;
            SoundSystem.setMasterVolume(vol);
            const volValue = document.getElementById('sfxVolumeValue');
            if (volValue) volValue.textContent = e.target.value + '%';
            saveAudioSettings();
        });
    }







    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === '1') setGameSpeed(1);
        if (e.key === '2') setGameSpeed(2);
        if (e.key === '3') setGameSpeed(5);
        // P key is now handled in the main keyboard handler above
    });



    // Load settings
    loadGameSettings();
    loadScrapData();

    // Start game loop
    gameLoop();





    document.getElementById('leaderboardBtn').addEventListener('click', () => {
        Leaderboard.display();
    });

    document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
        document.getElementById('leaderboardModal').style.display = 'none';
    });

    document.getElementById('howToPlayBtn').addEventListener('click', () => {
        document.getElementById('howToPlayModal').style.display = 'flex';
    });

    document.getElementById('closeHowToPlayBtn').addEventListener('click', () => {
        document.getElementById('howToPlayModal').style.display = 'none';
    });

    document.getElementById('howToPlayModal').addEventListener('click', (e) => {
        if (e.target.id === 'howToPlayModal') {
            document.getElementById('howToPlayModal').style.display = 'none';
        }
    });



    // Options modal volume sliders
    const optionsMusicSlider = document.getElementById('optionsMusicVolume');
    if (optionsMusicSlider) {
        optionsMusicSlider.addEventListener('input', (e) => {
            const vol = e.target.value / 100;
            SoundSystem.setMusicVolume(vol);
            const volValue = document.getElementById('optionsMusicVolumeValue');
            if (volValue) volValue.textContent = e.target.value + '%';
            const mainMusicSlider = document.getElementById('musicVolume');
            if (mainMusicSlider) {
                mainMusicSlider.value = e.target.value;
                const mainVolValue = document.getElementById('musicVolumeValue');
                if (mainVolValue) mainVolValue.textContent = e.target.value + '%';
            }
            saveAudioSettings();
        });
    }

    const optionsSfxSlider = document.getElementById('optionsSfxVolume');
    if (optionsSfxSlider) {
        optionsSfxSlider.addEventListener('input', (e) => {
            const vol = e.target.value / 100;
            SoundSystem.setMasterVolume(vol);
            const volValue = document.getElementById('optionsSfxVolumeValue');
            if (volValue) volValue.textContent = e.target.value + '%';
            const mainSfxSlider = document.getElementById('sfxVolume');
            if (mainSfxSlider) {
                mainSfxSlider.value = e.target.value;
                const mainVolValue = document.getElementById('sfxVolumeValue');
                if (mainVolValue) mainVolValue.textContent = e.target.value + '%';
            }
            saveAudioSettings();
        });
    }

    // Options modal game settings toggles
    const optionsAutoWave = document.getElementById('optionsAutoWave');
    if (optionsAutoWave) {
        optionsAutoWave.addEventListener('change', (e) => {
            gameSettings.autoWave = e.target.checked;
            gameState.autoWave = gameSettings.autoWave;
            saveGameSettings();
        });
    }

    const optionsParticles = document.getElementById('optionsParticles');
    if (optionsParticles) {
        optionsParticles.addEventListener('change', (e) => {
            gameSettings.particles = e.target.checked;
            saveGameSettings();
        });
    }

    const optionsGrid = document.getElementById('optionsGrid');
    if (optionsGrid) {
        optionsGrid.addEventListener('change', (e) => {
            gameSettings.grid = e.target.checked;
            saveGameSettings();
        });
    }

    const optionsFPS = document.getElementById('optionsFPS');
    if (optionsFPS) {
        optionsFPS.addEventListener('change', (e) => {
            gameSettings.fps = e.target.checked;
            const fpsDisplay = document.getElementById('fpsDisplay');
            if (fpsDisplay) {
                fpsDisplay.style.display = gameSettings.fps ? 'flex' : 'none';
            }
            saveGameSettings();
        });
    }

    const optionsWaveAlerts = document.getElementById('optionsWaveAlerts');
    if (optionsWaveAlerts) {
        optionsWaveAlerts.addEventListener('change', (e) => {
            gameSettings.waveAlerts = e.target.checked;
            saveGameSettings();
        });
    }

    const optionsSkipBonuses = document.getElementById('optionsSkipBonuses');
    if (optionsSkipBonuses) {
        optionsSkipBonuses.addEventListener('change', (e) => {
            gameSettings.skipBonuses = e.target.checked;
            saveGameSettings();
        });
    }

    // Reset settings
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            if (confirm('Reset all settings to default?')) {
                localStorage.removeItem('canyonDefense_settings');
                gameSettings.autoWave = true;
                gameSettings.particles = true;
                gameSettings.grid = true;
                gameSettings.fps = false;
                gameSettings.waveAlerts = true;
                gameSettings.skipBonuses = true;
                applySettingsToUI();
                saveGameSettings();
                GameConsole.info('Settings reset to default');
            }
        });
    }

    // Clear save data
    const clearSaveBtn = document.getElementById('clearSaveBtn');
    if (clearSaveBtn) {
        clearSaveBtn.addEventListener('click', () => {
            if (confirm('Clear ALL save data?')) {
                localStorage.removeItem('canyonDefense_scrap');
                localStorage.removeItem('canyonDefense_leaderboard');
                sessionStats = { kills: 0, gold: 0, startTime: Date.now() };
                GameConsole.info('Save data cleared');
            }
        });
    }

    // Export/Import save data
    const exportSaveBtn = document.getElementById('exportSaveBtn');
    if (exportSaveBtn) {
        exportSaveBtn.addEventListener('click', () => {
            const saveData = {
                scrap: localStorage.getItem('canyonDefense_scrap'),
                leaderboard: localStorage.getItem('canyonDefense_leaderboard'),
                settings: localStorage.getItem('canyonDefense_settings'),
                exportDate: new Date().toISOString()
            };
            const blob = new Blob([JSON.stringify(saveData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'canyon-defense-save.json';
            a.click();
            URL.revokeObjectURL(url);
            GameConsole.success('Save data exported');
        });
    }

    // Developer Menu
    const devMenuBtn = document.getElementById('devMenuBtn');
    if (devMenuBtn) {
        devMenuBtn.addEventListener('click', function() {
            const modal = document.getElementById('devMenuModal');
            if (modal) modal.style.display = 'flex';
        });
    }

    // Developer menu functions (global scope for onclick handlers)
    window.closeDevMenu = function() {
        const modal = document.getElementById('devMenuModal');
        if (modal) modal.style.display = 'none';
    };

    // Developer modal click outside to close
    const devMenuModal = document.getElementById('devMenuModal');
    if (devMenuModal) {
        devMenuModal.addEventListener('click', function(e) {
            if (e.target.id === 'devMenuModal') {
                devMenuModal.style.display = 'none';
            }
        });
    }

    window.devAddGold = function(amount) {
        gameState.money += amount;
        updateUI();
        GameConsole.success(`💰 +${amount} Gold added by developer`);
    };

    window.devAddScrap = function(amount) {
        gameState.scrap += amount;
        localStorage.setItem('canyonDefense_scrap', gameState.scrap.toString());
        GameConsole.success(`🔧 +${amount} Scrap added by developer`);
    };

    window.devAddLives = function(amount) {
        gameState.lives += amount;
        updateUI();
        GameConsole.success(`❤️ +${amount} Lives added by developer`);
    };

    window.devAddScore = function(amount) {
        gameState.score += amount;
        updateUI();
        GameConsole.success(`🏆 +${amount} Score added by developer`);
    };

    window.devCompleteWave = function() {
        if (gameState.enemies.length > 0) {
            gameState.enemies = [];
            gameState.waveEnemiesRemaining = 0;
        }
        if (gameState.isWaveActive) {
            gameState.isWaveActive = false;
            gameState.wave++;
            gameState.scrap++;
            localStorage.setItem('canyonDefense_scrap', gameState.scrap.toString());
            GameConsole.success(`🌊 Wave completed! Now at wave ${gameState.wave}`);
        }
        updateUI();
        updateWaveInfo();
    };

    window.devSkipToWave = function(waveNum) {
        gameState.wave = waveNum;
        gameState.isWaveActive = false;
        gameState.enemies = [];
        gameState.waveEnemiesRemaining = 0;
        GameConsole.success(`⚡ Skipped to wave ${waveNum}`);
        updateUI();
        updateWaveInfo();
    };

    window.devSpawnEnemies = function(count) {
        for (let i = 0; i < count; i++) {
            const map = MAPS[gameState.selectedMap];
            const enemy = {
                x: map.start.x * 30,
                y: map.start.y * 30,
                hp: 100,
                maxHp: 100,
                speed: 1,
                reward: 10,
                pathIndex: 0,
                type: 'basic'
            };
            gameState.enemies.push(enemy);
        }
        GameConsole.success(`👾 Spawned ${count} enemies`);
    };

    window.devUnlockAllTowers = function() {
        const allTowerTypes = ['missile', 'aa', 'cannon', 'tesla', 'laser', 'gauss', 'goo', 'multishot', 'recycler', 'radar', 'nuke'];
        gameState.unlockedTowers = allTowerTypes;
        updateTowerPanel();
        updateSpecialTowersPanel();
        GameConsole.success('🏗️ All towers unlocked!');
    };

    window.devMaxUpgrades = function() {
        gameState.towers.forEach(tower => {
            tower.level = 3;
        });
        GameConsole.success('⬆️ All towers max upgraded!');
    };

    window.devUpgradeSelected = function() {
        if (gameState.selectedTower) {
            if (gameState.selectedTower.level < 3) {
                gameState.selectedTower.level++;
                GameConsole.success(`⬆️ Selected tower upgraded to level ${gameState.selectedTower.level}`);
            } else {
                GameConsole.warn('Selected tower is already max level');
            }
        } else {
            GameConsole.warn('No tower selected');
        }
    };

    window.devRemoveAllTowers = function() {
        const count = gameState.towers.length;
        gameState.towers = [];
        gameState.selectedTower = null;
        updateTowerPanel();
        GameConsole.success(`🗑️ Removed ${count} towers`);
    };

    window.devResetCooldowns = function() {
        Object.keys(gameState.abilities).forEach(key => {
            gameState.abilities[key].cooldown = 0;
        });
        GameConsole.success('⚡ All ability cooldowns reset');
    };

    window.devTriggerNuke = function() {
        // Spawn explosion effect for each enemy
        gameState.enemies.forEach(enemy => {
            createExplosion(enemy.x, enemy.y, 50);
        });
        gameState.enemies = [];
        GameConsole.success('☢️ Nuke triggered!');
    };

    window.devTriggerFreeze = function() {
        gameState.freezeActive = true;
        gameState.freezeTimer = 1000; // Long freeze
        GameConsole.success('❄️ Freeze triggered!');
    };

    window.devKillAllEnemies = function() {
        const count = gameState.enemies.length;
        gameState.enemies.forEach(enemy => {
            gameState.money += enemy.reward;
            createExplosion(enemy.x, enemy.y, 30);
        });
        gameState.enemies = [];
        updateUI();
        GameConsole.success(`💀 Killed ${count} enemies, earned ${count * 10} gold`);
    };

    window.devTogglePause = function() {
        togglePause();
        GameConsole.info(`⏸️ Pause ${gameState.isPaused ? 'activated' : 'deactivated'}`);
    };

    window.devSetSpeed = function(speed) {
        setGameSpeed(speed);
        GameConsole.info(`⚡ Game speed set to ${speed}x`);
    };

    window.devToggleGodMode = function() {
        gameState.godMode = !gameState.godMode;
        if (gameState.godMode) {
            gameState.lives = 999999;
            GameConsole.success('🛡️ GOD MODE ACTIVATED');
        } else {
            gameState.lives = 10;
            GameConsole.info('🛡️ God mode deactivated');
        }
        updateUI();
    };

    window.devVictory = function() {
        victory();
    };

    window.devMaxPermanentUpgrades = function() {
        gameState.permanentUpgrades.reinforcedWalls = 10;
        gameState.permanentUpgrades.bulkBuying = 10;
        gameState.permanentUpgrades.scavenger = 10;
        localStorage.setItem('canyonDefense_permanentUpgrades', JSON.stringify(gameState.permanentUpgrades));
        gameState.lives += 10; // Apply reinforced walls bonus
        updateUI();
        GameConsole.success('🎯 All permanent upgrades maxed!');
    };

    window.devResetProgress = function() {
        if (confirm('Reset ALL game progress?')) {
            localStorage.clear();
            gameState.scrap = 0;
            gameState.permanentUpgrades = {
                reinforcedWalls: 0,
                bulkBuying: 0,
                scavenger: 0
            };
            GameConsole.warn('🔄 All progress reset');
        }
    };

    window.devSaveGame = function() {
        localStorage.setItem('canyonDefense_scrap', gameState.scrap.toString());
        localStorage.setItem('canyonDefense_permanentUpgrades', JSON.stringify(gameState.permanentUpgrades));
        saveGameSettings();
        GameConsole.success('💾 Game saved');
    };

    window.devClearAllData = function() {
        if (confirm('CLEAR ALL LOCAL STORAGE DATA? This cannot be undone!')) {
            localStorage.clear();
            location.reload();
        }
    };

    // Prevent auto-pause when tab loses focus
    document.addEventListener('visibilitychange', function() {
        // Don't auto-pause when tab becomes hidden
        // This allows the game to continue running in background
    });

    // Prevent browser from throttling when tab is in background
    document.addEventListener('blur', function() {
        // Keep game running when window loses focus
        return false;
    });

    // Keyboard shortcut for dev menu (Ctrl+Shift+D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            const modal = document.getElementById('devMenuModal');
            if (modal) {
                modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
            }
        }
        // ESC to close dev menu
        if (e.key === 'Escape') {
            const modal = document.getElementById('devMenuModal');
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        }
    });

    // Speed control event listeners
    const speed1x = document.getElementById('speed1x');
    const speed2x = document.getElementById('speed2x');
    const speed5x = document.getElementById('speed5x');
    
    if (speed1x) speed1x.addEventListener('click', () => setGameSpeed(1));
    if (speed2x) speed2x.addEventListener('click', () => setGameSpeed(2));
    if (speed5x) speed5x.addEventListener('click', () => setGameSpeed(5));

    // Initialize everything
    loadGameSettings();
    loadScrapData();

    // Draw map previews
    drawMapPreview('map0preview', 0);
    drawMapPreview('map1preview', 1);
    drawMapPreview('map2preview', 2);


});
