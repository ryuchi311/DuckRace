// ============================================================================
// ULTIMATE CHARACTER DUCK RACE — CHAMPIONSHIP BROADCAST ENGINE (engine.js)
// ============================================================================

(function () {
    // -------------------------------------------------------------
    // 1. CUSTOM SVG COSTUME & PROP GENERATOR FOR ALL 24 ARCHETYPES
    // -------------------------------------------------------------
    function getArchetypeKey(duck) {
        if (!duck) return 'priest';
        if (duck.archetypeId) return duck.archetypeId;
        const rawId = String(duck.id || '');
        if (!rawId.startsWith('duck_')) return rawId;
        const num = parseInt(rawId.replace('duck_', ''), 10) || 1;
        const keys = [
            'priest', 'gunslinger', 'saiyan', 'crypto', 'ninja', 'viking',
            'gamer', 'pirate', 'wizard', 'chef', 'knight', 'astronaut',
            'punk', 'detective', 'dj', 'pharaoh', 'samurai', 'vampire',
            'mecha', 'king', 'alchemist', 'luchador', 'fairy', 'diver'
        ];
        return keys[(num - 1) % keys.length];
    }

    function getArchetypeHatAndProps(key) {
        switch (key) {
            case 'priest':
                return {
                    hat: `<ellipse cx="52" cy="12" rx="13" ry="3.5" fill="none" stroke="#fde047" stroke-width="2.5"/>
                          <path d="M41 24 L52 13 L63 24 Z" fill="#ffffff" stroke="#eab308" stroke-width="1.8"/>
                          <path d="M52 16 L52 22 M49 19 L55 19" stroke="#eab308" stroke-width="1.8" stroke-linecap="round"/>`,
                    prop: `<path d="M46 49 L52 60 L58 49" fill="none" stroke="#fef08a" stroke-width="2.5"/>`
                };
            case 'gunslinger':
                return {
                    hat: `<ellipse cx="52" cy="23" rx="20" ry="4.5" fill="#78350f" stroke="#451a03" stroke-width="1.8"/>
                          <path d="M41 23 Q44 10 52 13 Q60 10 63 23 Z" fill="#92400e" stroke="#451a03" stroke-width="1.8"/>
                          <rect x="42" y="19" width="20" height="3" fill="#f59e0b"/>`,
                    prop: `<path d="M42 46 Q52 54 62 46 L56 58 L48 58 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="1.5"/>`
                };
            case 'saiyan':
                return {
                    hat: `<path d="M36 26 L26 14 L42 18 L38 5 L51 15 L58 3 L60 16 L72 9 L64 23 Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.8"/>`,
                    prop: `<path d="M26 48 Q46 44 58 58 L32 64 Z" fill="#ea580c" stroke="#9a3412" stroke-width="1.5"/>`
                };
            case 'crypto':
                return {
                    hat: `<rect x="40" y="14" width="24" height="8" rx="2" fill="#1e293b" stroke="#fbbf24" stroke-width="1.5"/>
                          <text x="52" y="20.5" font-size="7" font-weight="bold" fill="#fbbf24" text-anchor="middle">₿</text>`,
                    prop: `<rect x="48" y="30" width="18" height="6" rx="1" fill="#ef4444" stroke="#ffffff" stroke-width="1"/>
                           <line x1="66" y1="33" x2="88" y2="29" stroke="#ef4444" stroke-width="2.5"/>
                           <path d="M48 49 L52 62 L56 49 Z" fill="#ef4444"/>`
                };
            case 'ninja':
                return {
                    hat: `<path d="M38 24 Q52 20 66 24 L66 31 Q52 28 38 31 Z" fill="#0f172a"/>
                          <path d="M38 27 L22 22 M38 29 L24 30" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>`,
                    prop: `<rect x="49" y="30" width="15" height="5" rx="2" fill="#22d3ee"/>
                           <line x1="22" y1="62" x2="42" y2="38" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>`
                };
            case 'viking':
                return {
                    hat: `<path d="M38 24 Q30 12 25 16 Q32 24 40 24" fill="#fef3c7" stroke="#78350f" stroke-width="1.8"/>
                          <path d="M66 24 Q74 12 79 16 Q72 24 64 24" fill="#fef3c7" stroke="#78350f" stroke-width="1.8"/>
                          <path d="M39 25 Q52 12 65 25 Z" fill="#64748b" stroke="#334155" stroke-width="1.8"/>`,
                    prop: `<path d="M52 44 Q62 56 50 62 Q44 56 48 44" fill="#b45309"/>`
                };
            case 'gamer':
                return {
                    hat: `<path d="M40 36 A14 14 0 0 1 64 36" fill="none" stroke="#a855f7" stroke-width="3.5"/>
                          <rect x="46" y="29" width="8" height="11" rx="4" fill="#1e293b" stroke="#22d3ee" stroke-width="1.8"/>`,
                    prop: `<rect x="52" y="30" width="14" height="5" rx="2" fill="#ec4899" opacity="0.85"/>`
                };
            case 'pirate':
                return {
                    hat: `<path d="M32 24 Q52 8 72 24 L64 26 Q52 22 40 26 Z" fill="#1e293b" stroke="#fbbf24" stroke-width="1.8"/>
                          <circle cx="52" cy="19" r="2.5" fill="#ffffff"/>`,
                    prop: `<circle cx="57" cy="34" r="3.8" fill="#0f172a"/>
                           <line x1="44" y1="28" x2="64" y2="38" stroke="#0f172a" stroke-width="1.8"/>`
                };
            case 'wizard':
                return {
                    hat: `<ellipse cx="52" cy="23" rx="19" ry="4" fill="#4c1d95" stroke="#c084fc" stroke-width="1.5"/>
                          <path d="M40 23 L50 3 L68 6 L63 23 Z" fill="#5b21b6" stroke="#c084fc" stroke-width="1.5"/>
                          <text x="53" y="19" font-size="8" fill="#fde047" text-anchor="middle">★</text>`,
                    prop: `<path d="M54 44 Q58 58 50 64" fill="none" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round"/>`
                };
            case 'chef':
                return {
                    hat: `<path d="M42 24 L42 15 Q36 9 45 8 Q52 4 59 8 Q68 9 62 15 L62 24 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.8"/>`,
                    prop: `<path d="M46 47 L58 47 L52 56 Z" fill="#ef4444"/>`
                };
            case 'knight':
                return {
                    hat: `<path d="M46 14 Q56 4 68 12 Q58 16 52 20 Z" fill="#ef4444"/>
                          <path d="M38 26 Q52 14 66 26 L64 38 L40 38 Z" fill="#cbd5e1" stroke="#475569" stroke-width="1.8"/>
                          <line x1="48" y1="31" x2="62" y2="31" stroke="#0f172a" stroke-width="2.5"/>`,
                    prop: `<ellipse cx="42" cy="58" rx="9" ry="11" fill="#3b82f6" stroke="#fde047" stroke-width="2"/>`
                };
            case 'astronaut':
                return {
                    hat: `<circle cx="52" cy="34" r="18" fill="rgba(56, 189, 248, 0.25)" stroke="#f8fafc" stroke-width="2.5"/>
                          <path d="M44 23 Q54 20 62 26" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>`,
                    prop: `<rect x="20" y="42" width="10" height="18" rx="3" fill="#94a3b8" stroke="#334155" stroke-width="1.5"/>`
                };
            case 'punk':
                return {
                    hat: `<path d="M40 24 L36 8 L46 18 L50 4 L56 17 L64 7 L62 24 Z" fill="#ec4899" stroke="#be185d" stroke-width="1.5"/>`,
                    prop: `<rect x="42" y="46" width="18" height="4" rx="1" fill="#18181b" stroke="#fde047" stroke-width="1"/>`
                };
            case 'detective':
                return {
                    hat: `<ellipse cx="52" cy="23" rx="18" ry="3.5" fill="#92400e" stroke="#451a03" stroke-width="1.5"/>
                          <path d="M40 23 Q52 10 64 23 Z" fill="#b45309" stroke="#451a03" stroke-width="1.5"/>`,
                    prop: `<path d="M64 41 Q72 48 76 42" fill="none" stroke="#451a03" stroke-width="2.5" stroke-linecap="round"/>
                           <circle cx="76" cy="41" r="2.5" fill="#78350f"/>`
                };
            case 'dj':
                return {
                    hat: `<path d="M40 36 A14 14 0 0 1 64 36" fill="none" stroke="#10b981" stroke-width="3.5"/>
                          <circle cx="50" cy="36" r="5" fill="#064e3b" stroke="#34d399" stroke-width="1.8"/>`,
                    prop: `<rect x="50" y="30" width="16" height="6" rx="1" fill="#10b981" stroke="#ffffff" stroke-width="1.2"/>`
                };
            case 'pharaoh':
                return {
                    hat: `<path d="M36 22 L66 22 L70 44 L32 44 Z" fill="#1d4ed8" stroke="#facc15" stroke-width="2"/>
                          <circle cx="56" cy="19" r="3" fill="#facc15"/>`,
                    prop: `<ellipse cx="50" cy="50" rx="12" ry="4" fill="#facc15" stroke="#b45309" stroke-width="1.2"/>`
                };
            case 'samurai':
                return {
                    hat: `<path d="M34 25 L52 14 L70 25 Z" fill="#991b1b" stroke="#fca5a5" stroke-width="1.8"/>
                          <path d="M46 18 L40 8 M58 18 L64 8" stroke="#facc15" stroke-width="2.5" stroke-linecap="round"/>`,
                    prop: `<line x1="18" y1="60" x2="44" y2="38" stroke="#f8fafc" stroke-width="2.5"/>`
                };
            case 'vampire':
                return {
                    hat: `<path d="M22 36 L38 24 L38 56 Z" fill="#991b1b" stroke="#0f172a" stroke-width="1.8"/>`,
                    prop: `<polygon points="65,41 67,46 69,41" fill="#ffffff"/>`
                };
            case 'mecha':
                return {
                    hat: `<line x1="52" y1="22" x2="52" y2="11" stroke="#22d3ee" stroke-width="2.5"/>
                          <circle cx="52" cy="10" r="3" fill="#ef4444"/>`,
                    prop: `<rect x="50" y="30" width="15" height="5" rx="1" fill="#22d3ee"/>
                           <circle cx="20" cy="56" r="5" fill="#38bdf8"/>`
                };
            case 'king':
                return {
                    hat: `<polygon points="40,24 40,12 46,18 52,10 58,18 64,12 64,24" fill="#facc15" stroke="#b45309" stroke-width="1.8"/>
                          <circle cx="52" cy="16" r="2" fill="#ef4444"/>`,
                    prop: `<path d="M20 46 Q32 42 36 66 L16 64 Z" fill="#dc2626" stroke="#ffffff" stroke-width="2"/>`
                };
            case 'alchemist':
                return {
                    hat: `<rect x="44" y="20" width="18" height="6" rx="3" fill="#475569" stroke="#4ade80" stroke-width="1.5"/>
                          <circle cx="50" cy="23" r="2.5" fill="#4ade80"/>
                          <circle cx="57" cy="23" r="2.5" fill="#4ade80"/>`,
                    prop: `<circle cx="44" cy="58" r="6" fill="#4ade80" stroke="#ffffff" stroke-width="1.5"/>`
                };
            case 'luchador':
                return {
                    hat: `<path d="M40 24 Q52 16 64 24 L62 42 L42 42 Z" fill="#ea580c" stroke="#fde047" stroke-width="1.5"/>`,
                    prop: `<ellipse cx="46" cy="64" rx="14" ry="4" fill="#facc15" stroke="#b45309" stroke-width="1.5"/>`
                };
            case 'fairy':
                return {
                    hat: `<polygon points="46,23 50,14 54,20 58,14 60,23" fill="#f472b6" stroke="#fbcfe8" stroke-width="1.5"/>`,
                    prop: `<ellipse cx="28" cy="44" rx="10" ry="6" transform="rotate(-25 28 44)" fill="rgba(244, 114, 182, 0.65)" stroke="#fbcfe8" stroke-width="1.5"/>`
                };
            case 'diver':
            default:
                return {
                    hat: `<path d="M38 38 L38 16 L43 16" fill="none" stroke="#2dd4bf" stroke-width="3.5" stroke-linecap="round"/>`,
                    prop: `<rect x="48" y="29" width="14" height="8" rx="2" fill="rgba(45, 212, 191, 0.45)" stroke="#0f172a" stroke-width="1.8"/>`
                };
        }
    }

    window.generateCustomDuckSVG = function (duck) {
        const cBody = duck.bodyColor || '#fde047';
        const cWing = duck.wingColor || '#eab308';
        const aura = duck.auraColor || '#fde047';
        const uid = String(duck.id || 'd').replace(/[^a-zA-Z0-9]/g, '_');
        const key = getArchetypeKey(duck);
        const { hat, prop } = getArchetypeHatAndProps(key);

        // Derive goofy randomized facial variations based on duck ID
        const seed = String(duck.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const eyeStyle = seed % 4; // 0: Big Goofy Eyes, 1: Winking, 2: Crossed/Derp Eyes, 3: Sunglasses/Intense
        const hasBlush = (seed % 2 === 0);

        let eyeMarkup = '';
        if (eyeStyle === 0) {
            // Big Cartoon Googly Eyes!
            eyeMarkup = `
                <circle cx="56" cy="33" r="5" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
                <circle cx="58" cy="34" r="2.2" fill="#0f172a"/>
                <circle cx="59" cy="33" r="0.9" fill="#ffffff"/>
            `;
        } else if (eyeStyle === 1) {
            // Cheeky Winking Eye
            eyeMarkup = `
                <path d="M53 34 Q57 30 61 34" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
            `;
        } else if (eyeStyle === 2) {
            // Hilarious Derp / Dizzy Eyes!
            eyeMarkup = `
                <circle cx="56" cy="33" r="4.2" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
                <circle cx="54.8" cy="32" r="2" fill="#0f172a"/>
                <circle cx="55.2" cy="31.5" r="0.8" fill="#ffffff"/>
            `;
        } else {
            // Classic cute cartoon eye
            eyeMarkup = `
                <circle cx="57" cy="33" r="3.2" fill="#0f172a"/>
                <circle cx="58.2" cy="31.8" r="1.3" fill="#ffffff"/>
            `;
        }

        return `<svg width="240" height="220" viewBox="0 0 96 88" xmlns="http://www.w3.org/2000/svg" class="w-full h-full overflow-visible">
            <defs>
                <radialGradient id="aura_${uid}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="${aura}" stop-opacity="0.55"/>
                    <stop offset="100%" stop-color="${aura}" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="body_${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="${cBody}"/>
                    <stop offset="100%" stop-color="${cWing}"/>
                </linearGradient>
            </defs>
            <!-- Aura Glow -->
            <circle cx="48" cy="48" r="40" fill="url(#aura_${uid})"/>
            <!-- Water Ripple Ring -->
            <ellipse cx="46" cy="74" rx="29" ry="6.5" fill="rgba(56, 189, 248, 0.28)" stroke="rgba(125, 211, 252, 0.6)" stroke-width="1.5"/>
            <!-- Duck Body -->
            <path d="M20 56 Q13 44 22 47 Q28 50 36 48 Q64 46 66 62 Q68 74 44 74 Q22 74 20 56 Z" fill="url(#body_${uid})" stroke="#0f172a" stroke-width="2.4" stroke-linejoin="round"/>
            <!-- Duck Head -->
            <circle cx="52" cy="35" r="14.5" fill="${cBody}" stroke="#0f172a" stroke-width="2.4"/>
            <!-- Cheek Blush -->
            ${hasBlush ? `<ellipse cx="53" cy="40" rx="3.5" ry="2" fill="#fb7185" opacity="0.6"/>` : ''}
            <!-- Eyes -->
            ${eyeMarkup}
            <!-- Goofy Smile Beak -->
            <path d="M63 32 Q80 32 78 39.5 Q75 44 63 41.5 Z" fill="#f97316" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
            <path d="M63 37 Q70 38.5 76 37" fill="none" stroke="#ea580c" stroke-width="1.5"/>
            <!-- Flapping Wing -->
            <path d="M31 55 Q46 49 53 60 Q44 69 29 63 Z" fill="${cWing}" stroke="#0f172a" stroke-width="2" stroke-linejoin="round"/>
            <!-- Archetype Prop / Costume -->
            ${prop}
            <!-- Archetype Hat / Headgear -->
            ${hat}
        </svg>`;
    };

    // -------------------------------------------------------------
    // 2. ARENA WATER THEMES & DIFFICULTY MODES (Easy / Normal / Hard / Chaos)
    // -------------------------------------------------------------
    const TRACK_THEMES = {
        rapids: {
            name: '🏞️ River Rapids',
            shortName: '🏞️ Rapids',
            waterLeft: '#0369a1',
            waterCenter: '#0284c7',
            waterRight: '#0369a1',
            bankOuter: '#14532d',
            bankInner: '#166534',
            curbA: '#10b981',
            curbB: '#f8fafc',
            rippleColor: 'rgba(186, 230, 253, 0.25)',
            foamColor: 'rgba(255, 255, 255, 0.45)',
            gridLines: false
        },
        river: {
            name: '🏞️ River Rapids',
            shortName: '🏞️ Rapids',
            waterLeft: '#0369a1',
            waterCenter: '#0284c7',
            waterRight: '#0369a1',
            bankOuter: '#14532d',
            bankInner: '#166534',
            curbA: '#10b981',
            curbB: '#f8fafc',
            rippleColor: 'rgba(186, 230, 253, 0.25)',
            foamColor: 'rgba(255, 255, 255, 0.45)',
            gridLines: false
        },
        ocean: {
            name: '🏝️ Tropical Beach Ocean',
            shortName: '🏝️ Ocean',
            waterLeft: '#0d9488',
            waterCenter: '#14b8a6',
            waterRight: '#0d9488',
            bankOuter: '#d97706',
            bankInner: '#fde047',
            curbA: '#38bdf8',
            curbB: '#ffffff',
            rippleColor: 'rgba(255, 255, 255, 0.35)',
            foamColor: 'rgba(255, 255, 255, 0.6)',
            gridLines: false
        },
        cyber: {
            name: '⚡ Neon Cyber Stream',
            shortName: '⚡ Cyber',
            waterLeft: '#1e1b4b',
            waterCenter: '#312e81',
            waterRight: '#1e1b4b',
            bankOuter: '#09090b',
            bankInner: '#18181b',
            curbA: '#ec4899',
            curbB: '#22d3ee',
            rippleColor: 'rgba(34, 211, 238, 0.35)',
            foamColor: 'rgba(236, 72, 153, 0.5)',
            gridLines: true
        },
        lava: {
            name: '🌋 Lava Castle Moat',
            shortName: '🌋 Lava',
            waterLeft: '#7f1d1d',
            waterCenter: '#dc2626',
            waterRight: '#7f1d1d',
            bankOuter: '#1c1917',
            bankInner: '#292524',
            curbA: '#f97316',
            curbB: '#facc15',
            rippleColor: 'rgba(253, 224, 71, 0.35)',
            foamColor: 'rgba(251, 146, 60, 0.55)',
            gridLines: false
        }
    };

    // Obstacle difficulty settings configuration
    const OBSTACLE_DIFFICULTIES = {
        easy: {
            key: 'easy',
            name: '🟢 Easy Obstacles',
            label: '🟢 Easy',
            waveStepX: 250,
            minSlots: 2,
            maxSlots: 3,
            driftScale: 0.75,
            hazardPenaltyScale: 0.85
        },
        normal: {
            key: 'normal',
            name: '🔵 Normal Obstacles',
            label: '🔵 Normal',
            waveStepX: 180,
            minSlots: 3,
            maxSlots: 4,
            driftScale: 1.0,
            hazardPenaltyScale: 1.0
        },
        hard: {
            key: 'hard',
            name: '🟠 Hard Obstacles',
            label: '🟠 Hard',
            waveStepX: 135,
            minSlots: 3,
            maxSlots: 4,
            driftScale: 1.45,
            hazardPenaltyScale: 1.15
        },
        chaos: {
            key: 'chaos',
            name: '🔴 Chaos Obstacles',
            label: '🔴 Chaos',
            waveStepX: 95,
            minSlots: 4,
            maxSlots: 5,
            driftScale: 2.0,
            hazardPenaltyScale: 1.3
        }
    };

    let currentThemeKey = 'rapids';
    let currentTheme = TRACK_THEMES.rapids;
    let currentDifficultyKey = 'normal';
    let currentDifficulty = OBSTACLE_DIFFICULTIES.normal;

    // -------------------------------------------------------------
    // 3. RACE CONFIGURATION & HORIZONTAL WORLD COORDINATES
    // -------------------------------------------------------------
    window.raceConfig = {
        durationSeconds: 20,
        trackLength: 4800, // Horizontal distance X from start to finish
        trackWidth: 520,   // Vertical river channel height Y
        startX: 160
    };

    window.raceState = 'idle'; // 'idle' | 'countdown' | 'racing' | 'finished'
    window.activeRacers = [];
    window.raceStartTime = 0;
    window.raceElapsed = 0;
    window.finishOrder = [];
    window.trackObstacles = [];
    window.wakeParticles = [];
    window.sceneryProps = [];
    window.lastFrameTime = performance.now();

    // Camera & Pan/Zoom State
    window.activeCameraMode = 'leader';
    window.targetDuckId = 'auto_leader';
    window.camera = {
        x: 400,
        y: 260,
        zoom: 1.0,
        userZoom: 1.0,
        panOffsetX: 0,
        panOffsetY: 0,
        orbitAngle: 0
    };

    window.autoDirectorActive = false;
    let autoDirectorTimer = 0;
    let autoDirectorInterval = 4.2;
    let showBroadcastHUD = true;

    // Confetti System
    let confettiParticles = [];
    let confettiAnimId = null;

    // Sprite Image Cache
    const spriteCache = new Map();

    // -------------------------------------------------------------
    // 4. SPRITE PRELOADER & HIGH-CRAFT ROSTER CARDS
    // -------------------------------------------------------------
    window.preloadDuckSprites = function () {
        // Override global generateDuckSVG with our rich custom version
        window.generateDuckSVG = window.generateCustomDuckSVG;

        if (!window.rosterState || !window.rosterState.length) {
            if (typeof window.initBaseRoster === 'function') {
                window.initBaseRoster(24);
            }
        }
        if (!window.rosterState) return;

        window.rosterState.forEach(duck => {
            const svgStr = window.generateCustomDuckSVG(duck);
            duck.svgMarkup = svgStr;
            const img = new Image();
            img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
            duck.spriteImg = img;
            spriteCache.set(duck.id, img);
        });

        // Pre-seed idle ducks on track so track looks alive right away
        if (window.activeRacers.length === 0) {
            setupIdleStartingLineup();
        }
    };

    window.renderRosterCards = function () {
        const grid = document.getElementById('duckRosterGrid');
        const badge = document.getElementById('activeCountBadge');
        if (!window.rosterState) return;

        const enabledCount = window.rosterState.filter(d => d.enabled).length;
        if (badge) badge.textContent = `${enabledCount} RACERS`;

        if (!grid) return;

        grid.innerHTML = window.rosterState.map((duck, idx) => {
            const aura = duck.auraColor || '#f59e0b';
            return `
                <div class="relative group bg-slate-900/95 border-2 ${duck.enabled ? 'border-slate-800 hover:border-amber-400/80 shadow-lg' : 'border-slate-900 opacity-45'} rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5"
                     style="${duck.enabled ? `box-shadow: 0 4px 20px -4px ${aura}22;` : ''}">
                    
                    <!-- Top Header Row -->
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 min-w-0">
                            <span class="text-[11px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">#${idx + 1}</span>
                            <span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full truncate"
                                  style="background: ${aura}25; color: ${aura}; border: 1px solid ${aura}50;">
                                ${duck.title || 'Champion'}
                            </span>
                        </div>
                        <input type="checkbox" ${duck.enabled ? 'checked' : ''} onchange="toggleDuckEnabled('${duck.id}', this.checked)"
                               class="w-4 h-4 accent-amber-400 rounded cursor-pointer shrink-0" title="Enable/Disable Racer">
                    </div>

                    <!-- Center Duck Avatar & Desc -->
                    <div class="flex items-center gap-3 my-2.5">
                        <div class="w-16 h-16 shrink-0 rounded-2xl bg-slate-950/90 border border-slate-800/80 p-1 flex items-center justify-center group-hover:scale-105 transition-transform animate-bob"
                             onclick="previewDuckQuack('${duck.id}')" title="Click to hear Quack!">
                            ${duck.svgMarkup}
                        </div>
                        <div class="flex-1 min-w-0">
                            <input type="text" value="${duck.customName || duck.defaultName}"
                                   onchange="updateDuckCustomName('${duck.id}', this.value)"
                                   class="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-white focus:outline-none truncate mb-1"
                                   placeholder="Duck Name...">
                            <div class="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
                                <span class="truncate">✨ ${duck.desc || 'Custom Gear'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Battle Cry Footer -->
                    <div class="bg-slate-950/80 border border-slate-800/70 rounded-xl px-2.5 py-1 flex items-center justify-between gap-2">
                        <span class="text-[10px] text-slate-400 font-semibold uppercase">Cry:</span>
                        <span class="text-[10px] font-bold text-amber-300 truncate italic">"${duck.battleCry || 'QUACK!'}"</span>
                    </div>
                </div>
            `;
        }).join('');

        updateTargetSelectorOptions();
    };

    window.previewDuckQuack = function (id) {
        const d = window.rosterState.find(x => x.id === id);
        if (d && typeof window.playQuack === 'function') {
            window.playQuack(d.quackPitch || 520);
        }
    };

    window.toggleDuckEnabled = function (id, enabled) {
        const d = window.rosterState.find(x => x.id === id);
        if (d) {
            d.enabled = enabled;
            if (typeof window.saveRosterToLocalStorage === 'function') window.saveRosterToLocalStorage();
            renderRosterCards();
            if (window.raceState === 'idle') setupIdleStartingLineup();
        }
    };

    window.updateDuckCustomName = function (id, name) {
        const d = window.rosterState.find(x => x.id === id);
        if (d) {
            d.customName = name.trim() || d.defaultName;
            if (typeof window.saveRosterToLocalStorage === 'function') window.saveRosterToLocalStorage();
            updateTargetSelectorOptions();
            if (window.raceState === 'idle') setupIdleStartingLineup();
        }
    };

    // -------------------------------------------------------------
    // 5. SETUP CONTROLS, BULK PARSER & LIVE ROSTER FILTER
    // -------------------------------------------------------------
    window.parseBulkNamesList = function (text) {
        if (!text) return [];
        // Split by newlines, commas, or semicolons so user can paste CSV, Excel, or line-by-line!
        return text
            .split(/[\r\n,;]+/)
            .map(l => l.trim().replace(/^[\d\.\-\)\s]+/, '')) // strip leading numbers like "1. ", "2) "
            .filter(Boolean);
    };

    window.updateBulkCountPreview = function () {
        const textarea = document.getElementById('bulkNamesInput');
        const pill = document.getElementById('bulkCountPill');
        if (!textarea || !pill) return;
        const names = window.parseBulkNamesList(textarea.value);
        pill.textContent = names.length === 1 ? '1 name detected' : `${names.length} names detected`;
        if (names.length > 0) {
            pill.className = 'text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 animate-pulse';
        } else {
            pill.className = 'text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
        }
    };

    window.clearBulkInput = function () {
        const textarea = document.getElementById('bulkNamesInput');
        if (textarea) textarea.value = '';
        window.updateBulkCountPreview();
    };

    window.loadSampleBulkList = function (count = 25) {
        const samplePool = [
            'Speedy Gonzales', 'Quack Sparrow', 'Daffy Rocket', 'Donald Turbo', 'Feather Fury',
            'Sir Quacksalot', 'Mallard Boss', 'Splash King', 'Nitro Drake', 'Waddle Champion',
            'Golden Beak', 'Lightning Bill', 'Cyber Duck', 'Captain Splash', 'Pond Destroyer',
            'Aqua Rider', 'Turbo Waddler', 'Pixel Quack', 'Sonic Beak', 'Omega Duck',
            'Blaze Web', 'Glitch Feather', 'Vortex Drake', 'Rocket Mallard', 'Apex Predator',
            'Boba Web', 'Chewbacca Drake', 'Han Quacko', 'Darth Waddle', 'Luke Skyquacker',
            'Master Yoda Duck', 'Princess Beak', 'Obi-Wan Quacknobi', 'R2-Duck2', 'C-3P-Quack',
            'Iron Duck', 'Captain Quamerica', 'Thor Odinson Duck', 'Hulk Smash Duck', 'Black Widow Drake',
            'Hawkeye Quack', 'Spider-Duck', 'Doctor Strange Beak', 'Wanda Maximoff Duck', 'Black Panther Drake',
            'Ant-Duck', 'Groot Mallard', 'Rocket Raccoon Duck', 'Star-Lord Drake', 'Thanos Snap Duck',
            'Batman Duck', 'Superman Drake', 'Wonder Waddle', 'Flash Quack', 'Aquaman Drake',
            'Joker Quack', 'Harley Quinn Duck', 'Robin Redbeak', 'Cyborg Drake', 'Green Lantern Duck',
            'Mario Mallard', 'Luigi Drake', 'Bowser Quack', 'Yoshi Web', 'Toadstool Duck',
            'Donkey Quack', 'Link Drake', 'Zelda Feather', 'Samus Aran Duck', 'Kirby Pato',
            'Fox McCloud Duck', 'Falco Lombardi Drake', 'Pikachu Duck', 'Charizard Quack', 'Mewtwo Drake',
            'Sonic Hedgehog Duck', 'Tails Prower Drake', 'Knuckles Quack', 'Shadow Web', 'Eggman Drake',
            'Crash Bandicoot Duck', 'Spyro Dragon Drake', 'Master Chief Duck', 'Kratos War Drake', 'Geralt of Rivia Duck',
            'Arthur Morgan Drake', 'John Marston Quack', 'Solid Snake Duck', 'Gordon Freeman Drake', 'Doom Slayer Quack',
            'Neon Rider', 'Quantum Drake', 'Galaxy Quack', 'Cosmic Waddle', 'Starlight Feather',
            'Thunder Beak', 'Inferno Drake', 'Glacier Quack', 'Shadow Waddle', 'Zeus Thunder Drake'
        ];
        const textarea = document.getElementById('bulkNamesInput');
        if (textarea) {
            textarea.value = samplePool.slice(0, count).join('\n');
            window.updateBulkCountPreview();
            setCommentary(`📋 Loaded sample list of ${count} popular racer names into bulk editor!`);
        }
    };

    window.filterRosterGrid = function (query) {
        const q = (query || '').toLowerCase().trim();
        const cards = document.querySelectorAll('#duckRosterGrid > div');
        let visibleCount = 0;
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            const match = !q || text.includes(q);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });
        const countTxt = document.getElementById('rosterVisibleCountText');
        if (countTxt) {
            countTxt.textContent = q ? `Found ${visibleCount} matching duck(s)` : `Showing all ${cards.length} racers`;
        }
    };

    window.showOnlyActiveRoster = function (onlyActive = true) {
        const cards = document.querySelectorAll('#duckRosterGrid > div');
        let visibleCount = 0;
        cards.forEach(card => {
            const chk = card.querySelector('input[type="checkbox"]');
            const match = !onlyActive || (chk && chk.checked);
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });
        const countTxt = document.getElementById('rosterVisibleCountText');
        if (countTxt) {
            countTxt.textContent = onlyActive ? `Showing ${visibleCount} active starting racers` : `Showing all racers`;
        }
    };
    window.setDurationPreset = function (sec) {
        window.raceConfig.durationSeconds = sec;
        [10, 20, 40].forEach(s => {
            const btn = document.getElementById('durBtn' + s);
            if (btn) {
                if (s === sec) {
                    btn.className = 'dur-btn bg-amber-500/20 border-2 border-amber-400 text-amber-300 rounded-xl py-2 text-xs font-bold transition';
                } else {
                    btn.className = 'dur-btn bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl py-2 text-xs font-bold transition text-slate-200';
                }
            }
        });
        const inp = document.getElementById('customDurationInput');
        if (inp) inp.value = sec;
    };

    window.onCustomDurationChange = function (val) {
        const num = Math.max(5, Math.min(180, parseInt(val, 10) || 20));
        window.raceConfig.durationSeconds = num;
        [10, 20, 40].forEach(s => {
            const btn = document.getElementById('durBtn' + s);
            if (btn) {
                if (s === num) {
                    btn.className = 'dur-btn bg-amber-500/20 border-2 border-amber-400 text-amber-300 rounded-xl py-2 text-xs font-bold transition';
                } else {
                    btn.className = 'dur-btn bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl py-2 text-xs font-bold transition text-slate-200';
                }
            }
        });
    };

    window.changeTheme = function (themeKey) {
        if (TRACK_THEMES[themeKey]) {
            currentThemeKey = themeKey;
            currentTheme = TRACK_THEMES[themeKey];
            const lbl = document.getElementById('hudThemeLabel');
            if (lbl) lbl.textContent = currentTheme.shortName || currentTheme.name;
            // Sync any map/theme dropdowns on the page
            document.querySelectorAll('.theme-select-sync').forEach(sel => {
                if (sel.value !== themeKey) sel.value = themeKey;
            });
            setCommentary(`🗺️ Map changed to ${currentTheme.name}!`);
        }
    };

    window.changeObstacleDifficulty = function (diffKey) {
        const key = String(diffKey || 'normal').toLowerCase();
        if (OBSTACLE_DIFFICULTIES[key]) {
            currentDifficultyKey = key;
            currentDifficulty = OBSTACLE_DIFFICULTIES[key];
            // Sync any difficulty dropdowns/buttons on the page
            document.querySelectorAll('.difficulty-select-sync').forEach(sel => {
                if (sel.value !== key) sel.value = key;
            });
            ['easy', 'normal', 'hard', 'chaos'].forEach(k => {
                const btn = document.getElementById('diffBtn_' + k);
                if (btn) {
                    if (k === key) {
                        btn.className = 'diff-btn bg-amber-500/20 border-2 border-amber-400 text-amber-300 rounded-xl py-1.5 text-xs font-black transition shadow-sm';
                    } else {
                        btn.className = 'diff-btn bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl py-1.5 text-xs font-bold transition';
                    }
                }
            });
            const hudDiff = document.getElementById('hudDifficultyBadge');
            if (hudDiff) hudDiff.textContent = currentDifficulty.label;
            // Regenerate track obstacles when idle so the new layout is immediately visible
            if (window.raceState === 'idle') {
                spawnTrackEnvironment();
            }
            setCommentary(`⚡ Track obstacle difficulty set to ${currentDifficulty.name}! Spawning new hazards & boosts.`);
        }
    };
    window.setObstacleDifficulty = window.changeObstacleDifficulty;

    window.applyBulkNames = function (replaceAndMatch) {
        const textarea = document.getElementById('bulkNamesInput');
        if (!textarea) return;
        const lines = typeof window.parseBulkNamesList === 'function'
            ? window.parseBulkNamesList(textarea.value)
            : textarea.value.split(/[\r\n,;]+/).map(l => l.trim()).filter(Boolean);
        if (!lines.length) return;

        if (lines.length > window.rosterState.length && typeof window.initBaseRoster === 'function') {
            window.initBaseRoster(Math.min(100, Math.max(24, lines.length)));
            window.preloadDuckSprites();
        }

        lines.forEach((name, idx) => {
            if (idx < window.rosterState.length) {
                window.rosterState[idx].customName = name;
                window.rosterState[idx].enabled = true;
            }
        });

        if (replaceAndMatch) {
            for (let i = lines.length; i < window.rosterState.length; i++) {
                window.rosterState[i].enabled = false;
            }
        }

        if (typeof window.saveRosterToLocalStorage === 'function') window.saveRosterToLocalStorage();
        renderRosterCards();
        if (window.raceState === 'idle') setupIdleStartingLineup();
        if (typeof window.playBoostChime === 'function') window.playBoostChime();
        setCommentary(`📋 Assigned ${lines.length} participant names to the Championship Fleet!`);
    };

    window.selectAllDucks = function (selectAll) {
        window.rosterState.forEach(d => { d.enabled = selectAll; });
        if (typeof window.saveRosterToLocalStorage === 'function') window.saveRosterToLocalStorage();
        renderRosterCards();
        if (window.raceState === 'idle') setupIdleStartingLineup();
    };

    window.selectRandomParty = function (count = 25) {
        if (window.rosterState.length < count && typeof window.initBaseRoster === 'function') {
            window.initBaseRoster(Math.max(count, 100));
            window.preloadDuckSprites();
        }
        window.rosterState.forEach(d => { d.enabled = false; });
        const shuffled = [...window.rosterState].sort(() => 0.5 - Math.random());
        shuffled.slice(0, count).forEach(d => { d.enabled = true; });
        if (typeof window.saveRosterToLocalStorage === 'function') window.saveRosterToLocalStorage();
        renderRosterCards();
        if (window.raceState === 'idle') setupIdleStartingLineup();
        setCommentary(`🎲 Selected a random party of ${count} ducks!`);
    };

    window.resetDefaultNames = function () {
        if (typeof window.initBaseRoster === 'function') {
            window.initBaseRoster(100);
            window.preloadDuckSprites();
        }
        if (typeof window.saveRosterToLocalStorage === 'function') window.saveRosterToLocalStorage();
        renderRosterCards();
        if (window.raceState === 'idle') setupIdleStartingLineup();
        setCommentary(`↺ Reset all 100 Championship Ducks to default names.`);
    };

    // -------------------------------------------------------------
    // 6. VIEW NAVIGATION & RACE INITIALIZATION
    // -------------------------------------------------------------
    window.toggleSetupRaceView = function () {
        const setupSec = document.getElementById('setupSection');
        const raceSec = document.getElementById('raceSection');
        const viewIcon = document.getElementById('toggleViewIcon');
        const viewText = document.getElementById('toggleViewText');

        if (setupSec.classList.contains('hidden')) {
            setupSec.classList.remove('hidden');
            raceSec.classList.add('hidden');
            raceSec.classList.remove('flex');
            if (viewIcon) viewIcon.textContent = '🏁';
            if (viewText) viewText.textContent = 'Track';
        } else {
            setupSec.classList.add('hidden');
            raceSec.classList.remove('hidden');
            raceSec.classList.add('flex');
            if (viewIcon) viewIcon.textContent = '✏️';
            if (viewText) viewText.textContent = 'Roster';
            resizeCanvas();
            if (window.raceState === 'idle') setupIdleStartingLineup();
        }
    };

    window.showSetupView = function () {
        const setupSec = document.getElementById('setupSection');
        const raceSec = document.getElementById('raceSection');
        const viewIcon = document.getElementById('toggleViewIcon');
        const viewText = document.getElementById('toggleViewText');

        setupSec.classList.remove('hidden');
        raceSec.classList.add('hidden');
        raceSec.classList.remove('flex');
        if (viewIcon) viewIcon.textContent = '🏁';
        if (viewText) viewText.textContent = 'Track';
    };

    window.startRaceFromAnywhere = function () {
        const setupSec = document.getElementById('setupSection');
        const raceSec = document.getElementById('raceSection');
        const viewIcon = document.getElementById('toggleViewIcon');
        const viewText = document.getElementById('toggleViewText');

        setupSec.classList.add('hidden');
        raceSec.classList.remove('hidden');
        raceSec.classList.add('flex');
        if (viewIcon) viewIcon.textContent = '✏️';
        if (viewText) viewText.textContent = 'Roster';

        resizeCanvas();
        startRace();
    };

    function setupIdleStartingLineup() {
        const racers = (window.rosterState || []).filter(d => d.enabled);
        // When in Host IRL Waiting Mode, keep the track completely empty if 0 IRL players have joined so far!
        const list = window.irlWaitingMode
            ? racers
            : (racers.length > 0 ? racers : (window.rosterState || []).slice(0, 8));
        const count = list.length;

        if (count === 0) {
            window.activeRacers = [];
            spawnTrackEnvironment();
            window.camera.x = window.raceConfig.startX + 220;
            window.camera.y = window.raceConfig.trackWidth / 2;
            updateRaceHUD();
            return;
        }

        const topMargin = 55;
        const bottomMargin = 55;
        const usableHeight = window.raceConfig.trackWidth - topMargin - bottomMargin;
        const lanesY = count > 30 ? Math.min(20, Math.ceil(count / 5)) : count;
        const spacingY = lanesY > 1 ? usableHeight / (lanesY - 1) : usableHeight / 2;

        window.activeRacers = list.map((duck, i) => {
            const laneIndex = count > 30 ? (i % lanesY) : i;
            const laneY = count === 1
                ? (window.raceConfig.trackWidth / 2)
                : topMargin + laneIndex * spacingY + ((Math.floor(i / lanesY) % 2) * (spacingY * 0.35));
            const column = count > 30 ? Math.floor(i / lanesY) : (i % 3);
            const startXPos = window.raceConfig.startX - (column * 28);
            return createRacerInstance(duck, i, startXPos, laneY);
        });

        spawnTrackEnvironment();
        window.camera.x = window.raceConfig.startX + 220;
        window.camera.y = window.raceConfig.trackWidth / 2;
        updateRaceHUD();
    }
    window.setupIdleStartingLineup = setupIdleStartingLineup;

    function createRacerInstance(duck, index, startX, laneY) {
        const dist = window.raceConfig.trackLength - window.raceConfig.startX;
        // Equal base speed for all racers so every duck has a 100% fair chance; dynamic surging + random track obstacles decide the winner!
        const baseSpd = dist / Math.max(5, window.raceConfig.durationSeconds);
        const topMargin = 52;
        const bottomMargin = 52;
        return {
            id: duck.id,
            title: duck.title || 'Champion',
            customName: duck.customName || duck.defaultName,
            battleCry: duck.battleCry || 'QUACK!',
            quackPitch: duck.quackPitch || 520,
            auraColor: duck.auraColor || '#fde047',
            x: startX,
            y: laneY,
            baseY: laneY,
            targetY: topMargin + Math.random() * (window.raceConfig.trackWidth - topMargin - bottomMargin),
            laneChangeTimer: 0.8 + Math.random() * 1.4,
            baseSpeed: baseSpd * (0.985 + Math.random() * 0.03),
            currentSpeed: baseSpd,
            currentSpeedMultiplier: 1.0,
            surgePhase: Math.random() * Math.PI * 2,
            surgeFreq: 1.5 + Math.random() * 1.5,
            wobblePhase: Math.random() * Math.PI * 2,
            wobbleSpeed: 4.5 + Math.random() * 2.5,
            progress: 0,
            finished: false,
            finishTime: 0,
            statusEffect: 'normal', // 'normal' | 'dash' | 'bread' | 'whirlpool' | 'spinout' | 'rocket'
            stateTimer: 0,
            spinAngle: 0,
            speechText: '',
            speechTimer: 0,
            rank: index + 1,
            duckData: duck
        };
    }

    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    window.startRace = function () {
        if (!window.rosterState || !window.rosterState.length) {
            window.preloadDuckSprites();
        }

        let enabledDucks = window.rosterState.filter(d => d.enabled);
        if (enabledDucks.length === 0) {
            if (window.irlWaitingMode) {
                setCommentary(`⏳ Waiting for IRL participants to scan the QR Code and join before starting!`);
                if (typeof window.playQuack === 'function') window.playQuack(440, true, 'surprised');
                return;
            }
            window.rosterState.slice(0, 12).forEach(d => { d.enabled = true; });
            enabledDucks = window.rosterState.filter(d => d.enabled);
            renderRosterCards();
        }

        // Hide IRL Waiting Overlay when race begins
        const irlOverlay = document.getElementById('irlTrackWaitingOverlay');
        if (irlOverlay) irlOverlay.classList.add('hidden');
        const camTel = document.getElementById('cameraTelemetryOverlay');
        if (camTel) camTel.classList.remove('hidden');

        const count = enabledDucks.length;
        window.finishOrder = [];
        window.raceElapsed = 0;
        window.wakeParticles = [];
        stopConfetti();
        closeWinnerModal();

        // Shuffle starting lane assignments every race so no roster slot has a positional bias,
        // and place all racers on the exact same fair starting line X!
        const shuffledDucks = shuffleArray(enabledDucks);
        const topMargin = 55;
        const bottomMargin = 55;
        const usableHeight = window.raceConfig.trackWidth - topMargin - bottomMargin;
        const lanesY = count > 30 ? Math.min(20, Math.ceil(count / 5)) : count;
        const spacingY = lanesY > 1 ? usableHeight / (lanesY - 1) : usableHeight / 2;

        window.activeRacers = shuffledDucks.map((duck, i) => {
            const laneIndex = count > 30 ? (i % lanesY) : i;
            const laneY = count === 1
                ? (window.raceConfig.trackWidth / 2)
                : topMargin + laneIndex * spacingY + ((Math.floor(i / lanesY) % 2) * (spacingY * 0.25));
            const startXPos = window.raceConfig.startX + (Math.random() * 4 - 2);
            return createRacerInstance(duck, i, startXPos, laneY);
        });

        spawnTrackEnvironment();

        // Reset camera to Starting Gate
        window.camera.x = window.raceConfig.startX + 180;
        window.camera.y = window.raceConfig.trackWidth / 2;
        window.camera.panOffsetX = 0;
        window.camera.panOffsetY = 0;

        const slowMo = document.getElementById('slowMoBadge');
        if (slowMo) slowMo.classList.add('hidden');

        window.raceState = 'countdown';
        if (typeof window.stopMusic === 'function') window.stopMusic();
        triggerCountdown();
    };

    function createRandomObstacle(xPos, yPos, forceCategory) {
        const diff = currentDifficulty?.key || 'normal';
        const driftScale = currentDifficulty?.driftScale || 1.0;
        const rand = Math.random();
        let type = 'boost';

        if (forceCategory === 'boost') {
            if (diff === 'chaos') {
                type = rand < 0.45 ? 'spring' : (rand < 0.80 ? 'boost' : 'bread');
            } else if (diff === 'easy') {
                type = rand < 0.45 ? 'bread' : (rand < 0.85 ? 'boost' : 'spring');
            } else {
                type = rand < 0.48 ? 'boost' : (rand < 0.82 ? 'bread' : 'spring');
            }
        } else if (forceCategory === 'hazard') {
            if (diff === 'easy') {
                type = rand < 0.72 ? 'banana' : 'whirlpool';
            } else if (diff === 'hard' || diff === 'chaos') {
                type = rand < 0.40 ? 'banana' : 'whirlpool';
            } else {
                type = rand < 0.52 ? 'banana' : 'whirlpool';
            }
        } else {
            // Wildcard ('any') distribution tailored by map difficulty
            if (diff === 'easy') {
                if (rand < 0.36) type = 'boost';
                else if (rand < 0.68) type = 'bread';
                else if (rand < 0.82) type = 'spring';
                else if (rand < 0.93) type = 'banana';
                else type = 'whirlpool';
            } else if (diff === 'hard') {
                if (rand < 0.16) type = 'boost';
                else if (rand < 0.28) type = 'bread';
                else if (rand < 0.40) type = 'spring';
                else if (rand < 0.68) type = 'banana';
                else type = 'whirlpool';
            } else if (diff === 'chaos') {
                if (rand < 0.22) type = 'spring';
                else if (rand < 0.36) type = 'boost';
                else if (rand < 0.66) type = 'banana';
                else type = 'whirlpool';
            } else {
                if (rand < 0.24) type = 'boost';
                else if (rand < 0.46) type = 'bread';
                else if (rand < 0.68) type = 'banana';
                else if (rand < 0.88) type = 'whirlpool';
                else type = 'spring';
            }
        }

        const meta = {
            boost:     { radius: 25, icon: '🪶' },
            bread:     { radius: 22, icon: '🍞' },
            banana:    { radius: 23, icon: '🍌' },
            whirlpool: { radius: diff === 'chaos' ? 33 : 30, icon: '🌀' },
            spring:    { radius: 25, icon: '🚀' }
        }[type];

        // Vertical drift across the river scaled by map difficulty so no single Y lane is permanently safe or permanently boosted!
        const driftAmp = (16 + Math.random() * 26) * Math.min(1.45, Math.max(0.75, driftScale * 0.85));
        const driftSpeed = (0.7 + Math.random() * 1.1) * driftScale * (Math.random() < 0.5 ? 1 : -1);

        return {
            type,
            x: xPos,
            y: yPos,
            baseY: yPos,
            driftAmp,
            driftSpeed,
            radius: meta.radius,
            icon: meta.icon,
            phase: Math.random() * Math.PI * 2
        };
    }

    function spawnTrackEnvironment() {
        window.trackObstacles = [];
        window.sceneryProps = [];
        const startX = window.raceConfig.startX + 290;
        const endX = window.raceConfig.trackLength - 240;
        const widthY = window.raceConfig.trackWidth;
        const topPad = 56;
        const usableH = widthY - topPad * 2;

        const diff = currentDifficulty?.key || 'normal';
        const stepX = currentDifficulty?.waveStepX || 180;
        const minSlots = currentDifficulty?.minSlots || 3;
        const maxSlots = currentDifficulty?.maxSlots || 4;

        // Stratified Multi-Slot Wave Spawning scaled by Map Difficulty (Easy / Normal / Hard / Chaos):
        // Divides the channel height into equal vertical bands per wave and shuffles boost/hazard categories
        // across the bands so every lane experiences equal density & fairness while matching the map's difficulty!
        for (let x = startX; x < endX; x += stepX) {
            const slotsInWave = minSlots + (Math.random() < 0.5 ? (maxSlots - minSlots) : 0);
            const bandH = usableH / slotsInWave;

            let basePool;
            if (diff === 'easy') {
                basePool = ['boost', 'boost', 'hazard', 'any', 'boost'];
            } else if (diff === 'hard') {
                basePool = ['hazard', 'hazard', 'boost', 'any', 'hazard'];
            } else if (diff === 'chaos') {
                basePool = ['hazard', 'hazard', 'boost', 'any', 'any'];
            } else {
                basePool = ['boost', 'hazard', 'any', 'any', 'boost'];
            }
            const waveCategories = shuffleArray(basePool.slice(0, slotsInWave));

            for (let s = 0; s < slotsInWave; s++) {
                const bandTop = topPad + s * bandH;
                const yPos = bandTop + (0.18 + Math.random() * 0.64) * bandH;
                const jitterRange = Math.min(85, stepX * 0.48);
                const xPos = x + (Math.random() * jitterRange - jitterRange / 2);
                window.trackObstacles.push(createRandomObstacle(xPos, yPos, waveCategories[s]));
            }
        }

        // Spawn decorative shore trees / rocks / neon pylons along top & bottom banks
        for (let x = -200; x < window.raceConfig.trackLength + 600; x += 130) {
            window.sceneryProps.push({
                x: x + (Math.random() * 50 - 25),
                y: -38 - Math.random() * 45,
                scale: 0.8 + Math.random() * 0.5,
                variant: Math.floor(Math.random() * 3)
            });
            window.sceneryProps.push({
                x: x + (Math.random() * 50 - 25),
                y: widthY + 38 + Math.random() * 45,
                scale: 0.8 + Math.random() * 0.5,
                variant: Math.floor(Math.random() * 3)
            });
        }
    }

    function triggerCountdown() {
        const overlay = document.getElementById('countdownOverlay');
        const txt = document.getElementById('countdownText');
        if (!overlay || !txt) return;

        overlay.classList.remove('hidden');
        let count = 3;
        txt.textContent = count;
        if (typeof window.playCountdownBeep === 'function') window.playCountdownBeep(false);

        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                txt.textContent = count;
                if (typeof window.playCountdownBeep === 'function') window.playCountdownBeep(false);
            } else if (count === 0) {
                txt.textContent = 'QUACK GO!';
                if (typeof window.playCountdownBeep === 'function') window.playCountdownBeep(true);
            } else {
                clearInterval(timer);
                overlay.classList.add('hidden');
                window.raceState = 'racing';
                window.raceStartTime = performance.now();
                if (typeof window.startMusic === 'function') window.startMusic('race');
                setCommentary(`🏁 GATES DROP! ${window.activeRacers.length} Championship Ducks surge into ${currentTheme.name}!`);
            }
        }, 750);
    }

    // -------------------------------------------------------------
    // 7. CHAOS SURGE & INTERACTIVE CHEERING
    // -------------------------------------------------------------
    window.triggerManualChaos = function () {
        if (window.raceState !== 'racing') {
            setCommentary(`⚡ Start a race first to unleash a Quack Surge!`);
            return;
        }

        const leader = getLeaderRacer();
        const refX = leader ? leader.x : 600;
        const topPad = 58;
        const usableH = window.raceConfig.trackWidth - topPad * 2;
        const bandH = usableH / 4;
        const waveCats = shuffleArray(['boost', 'hazard', 'any', 'any']);

        // Spawn a fair 4-band wave of randomized boosts & hazards ahead of the pack
        for (let s = 0; s < 4; s++) {
            const yPos = topPad + s * bandH + (0.2 + Math.random() * 0.6) * bandH;
            const xPos = refX + 190 + Math.random() * 480;
            window.trackObstacles.push(createRandomObstacle(xPos, yPos, waveCats[s]));
        }

        // Give 4 random ducks a dramatic nitro burst
        const candidates = window.activeRacers.filter(r => !r.finished);
        const picked = shuffleArray(candidates).slice(0, Math.min(4, candidates.length));
        picked.forEach(r => {
            r.statusEffect = 'dash';
            r.stateTimer = 1.6;
            r.currentSpeedMultiplier = 1.48;
            r.speechText = r.battleCry || 'QUACK SURGE! ⚡';
            r.speechTimer = 2.0;
        });

        if (typeof window.playBoostChime === 'function') window.playBoostChime();
        setCommentary(`⚡ QUACK SURGE UNLEASHED! Random Obstacle Wave dropped & ${picked.map(p => p.customName).slice(0, 2).join(', ')} ignited!`);
    };

    // -------------------------------------------------------------
    // 8. CAMERA SYSTEM (10 BROADCAST ANGLES + AUTO-DIRECTOR)
    // -------------------------------------------------------------
    const CAM_LABELS = {
        leader: 'CAM 1 • LEADER PAN',
        gopro: 'CAM 2 • DUCK-EYE 3D POV',
        drone3d: 'CAM 3 • 3D SKY-DRONE',
        chase3d: 'CAM 4 • 3D KART CHASE',
        heli: 'CAM 5 • HELI SWOOP ORBIT',
        underdog: 'CAM 6 • UNDERDOG CAM',
        brawl: 'CAM 7 • PACK BRAWL',
        finish: 'CAM 8 • FINISH BOOTH',
        split: 'CAM 9 • TRIPLE SPLIT-SCREEN',
        blimp: 'CAM 0 • STADIUM BLIMP MAP'
    };

    window.setCameraMode = function (mode, userTriggered = false) {
        window.activeCameraMode = mode;
        window.camera.panOffsetX = 0;
        window.camera.panOffsetY = 0;

        Object.keys(CAM_LABELS).forEach(m => {
            const btn = document.getElementById('camBtn_' + m);
            if (btn) {
                if (m === mode) {
                    btn.classList.add('cam-pill-active');
                } else {
                    btn.classList.remove('cam-pill-active');
                }
            }
        });

        const badge = document.getElementById('camBadgeTitle');
        if (badge) badge.textContent = CAM_LABELS[mode] || `CAM • ${mode.toUpperCase()}`;

        if (userTriggered) {
            triggerTvCutFlash();
        }
        updateCameraTelemetry();
    };

    window.toggleAutoDirector = function () {
        window.autoDirectorActive = !window.autoDirectorActive;
        const dot = document.getElementById('autoDirectorDot');
        const status = document.getElementById('autoDirectorStatus');
        const cutBadge = document.getElementById('directorCutBadge');

        if (dot) dot.className = window.autoDirectorActive ? 'w-2 h-2 rounded-full bg-emerald-400 animate-ping' : 'w-2 h-2 rounded-full bg-rose-400';
        if (status) status.textContent = window.autoDirectorActive ? 'ON' : 'OFF';
        if (cutBadge) cutBadge.classList.toggle('hidden', !window.autoDirectorActive);

        setCommentary(window.autoDirectorActive
            ? `🎬 AI Auto-Director enabled! Automatically cutting between live TV camera angles.`
            : `🎬 AI Auto-Director disabled. Manual camera control active.`);
    };

    function triggerTvCutFlash() {
        const flash = document.getElementById('tvCutFlash');
        if (!flash) return;
        flash.classList.remove('hidden', 'animate-tv-cut');
        void flash.offsetWidth;
        flash.classList.add('animate-tv-cut');
        setTimeout(() => { flash.classList.add('hidden'); }, 280);
    }

    window.setCameraZoom = function (val) {
        window.camera.userZoom = parseFloat(val) || 1.0;
        updateCameraTelemetry();
    };

    window.resetCameraPanZoom = function () {
        window.camera.userZoom = 1.0;
        window.camera.panOffsetX = 0;
        window.camera.panOffsetY = 0;
        const slider = document.getElementById('camZoomSlider');
        if (slider) slider.value = 1.0;
        updateCameraTelemetry();
    };

    window.toggleBroadcastHUD = function () {
        showBroadcastHUD = !showBroadcastHUD;
        const tel = document.getElementById('cameraTelemetryOverlay');
        const lb = document.getElementById('liveLeaderboardList')?.parentElement;
        if (tel) tel.style.display = showBroadcastHUD ? '' : 'none';
        if (lb) lb.style.display = showBroadcastHUD ? '' : 'none';
    };

    function updateCameraTelemetry() {
        const sub = document.getElementById('camSubTelemetry');
        if (!sub) return;
        const targetRacer = getTargetRacer();
        const targetName = window.targetDuckId === 'auto_leader'
            ? `1st (${targetRacer ? targetRacer.customName : 'Leader'})`
            : (targetRacer ? targetRacer.customName : 'Target');
        sub.innerHTML = `<span class="truncate max-w-[130px]">🎯 ${targetName}</span><span>FOV: ${window.camera.userZoom.toFixed(2)}x</span>`;
    }

    function updateTargetSelectorOptions() {
        const sel = document.getElementById('targetDuckSelect');
        if (!sel || !window.rosterState) return;
        const prev = sel.value || 'auto_leader';
        const enabled = window.rosterState.filter(d => d.enabled);
        sel.innerHTML = `<option value="auto_leader">👑 Auto: 1st Place Leader</option>` +
            enabled.map(d => `<option value="${d.id}">🦆 ${d.customName || d.defaultName}</option>`).join('');
        sel.value = enabled.some(d => d.id === prev) ? prev : 'auto_leader';
    }

    window.selectTargetDuckById = function (duckId) {
        window.targetDuckId = duckId || 'auto_leader';
        const sel = document.getElementById('targetDuckSelect');
        if (sel) sel.value = window.targetDuckId;
        updateCameraTelemetry();
    };

    window.cycleTargetDuck = function (dir) {
        const list = window.activeRacers.length ? window.activeRacers : (window.rosterState || []).filter(d => d.enabled);
        if (!list.length) return;

        if (window.targetDuckId === 'auto_leader') {
            window.targetDuckId = dir > 0 ? list[0].id : list[list.length - 1].id;
        } else {
            const idx = list.findIndex(d => d.id === window.targetDuckId);
            const next = idx + dir;
            if (idx === -1 || next < 0 || next >= list.length) {
                window.targetDuckId = 'auto_leader';
            } else {
                window.targetDuckId = list[next].id;
            }
        }
        const sel = document.getElementById('targetDuckSelect');
        if (sel) sel.value = window.targetDuckId;
        updateCameraTelemetry();
    };

    function getLeaderRacer() {
        if (!window.activeRacers || !window.activeRacers.length) return null;
        return window.activeRacers.reduce((best, r) => (r.x > best.x ? r : best), window.activeRacers[0]);
    }

    function getUnderdogRacer() {
        if (!window.activeRacers || !window.activeRacers.length) return null;
        return window.activeRacers.reduce((worst, r) => (r.x < worst.x ? r : worst), window.activeRacers[0]);
    }

    function getTargetRacer() {
        if (!window.activeRacers || !window.activeRacers.length) return null;
        if (window.targetDuckId === 'auto_leader') return getLeaderRacer();
        return window.activeRacers.find(r => r.id === window.targetDuckId) || getLeaderRacer();
    }

    window.setCommentary = function (msg) {
        const ticker = document.getElementById('commentaryTicker');
        if (ticker) ticker.textContent = msg;
    };

    // -------------------------------------------------------------
    // 9. PHYSICS UPDATE & PHOTO-FINISH ENGINE
    // -------------------------------------------------------------
    window.mainAnimationLoop = function (timestamp) {
        const rawDt = Math.min((timestamp - window.lastFrameTime) / 1000, 0.08);
        window.lastFrameTime = timestamp;

        if (window.raceState === 'racing') {
            updateRacePhysics(rawDt);
        } else if (window.activeRacers && window.activeRacers.length > 0) {
            window.activeRacers.forEach(r => {
                if (r.speechTimer > 0) {
                    r.speechTimer -= rawDt;
                    if (r.speechTimer <= 0) r.speechText = '';
                }
                if (r.stateTimer > 0) {
                    r.stateTimer -= rawDt;
                    if (r.stateTimer <= 0) r.statusEffect = 'normal';
                }
            });
        }

        updateCamera(rawDt);
        renderArenaCanvas();

        requestAnimationFrame(window.mainAnimationLoop);
    };

    function updateRacePhysics(rawDt) {
        const leader = getLeaderRacer();
        const finishX = window.raceConfig.trackLength;

        // Photo-Finish Slow-Mo when leader is within 92% to 100% and hasn't finished yet
        const isPhotoFinishZone = leader && !leader.finished && leader.x >= finishX * 0.91;
        const slowMoBadge = document.getElementById('slowMoBadge');
        if (slowMoBadge) slowMoBadge.classList.toggle('hidden', !isPhotoFinishZone);

        const timeScale = isPhotoFinishZone ? 0.52 : 1.0;
        const dt = rawDt * timeScale;
        window.raceElapsed += rawDt;

        // Auto-Director camera cuts
        if (window.autoDirectorActive) {
            autoDirectorTimer += rawDt;
            if (isPhotoFinishZone && window.activeCameraMode !== 'finish') {
                setCameraMode('finish', true);
            } else if (autoDirectorTimer >= autoDirectorInterval) {
                autoDirectorTimer = 0;
                autoDirectorInterval = 3.6 + Math.random() * 2.5;
                const modes = ['leader', 'drone3d', 'chase3d', 'gopro', 'brawl', 'heli', 'split'];
                const pick = modes[Math.floor(Math.random() * modes.length)];
                setCameraMode(pick, true);
            }
        }

        // Update Drifting Track Obstacles so no single Y lane is permanently safe or permanently boosted
        const obsMinY = 50;
        const obsMaxY = window.raceConfig.trackWidth - 50;
        window.trackObstacles.forEach(obs => {
            if (obs.driftAmp && obs.baseY !== undefined) {
                obs.phase += (obs.driftSpeed || 1.0) * dt;
                obs.y = Math.max(obsMinY, Math.min(obsMaxY, obs.baseY + Math.sin(obs.phase) * obs.driftAmp));
            }
        });

        // Update Racers
        const sortedByX = [...window.activeRacers].sort((a, b) => b.x - a.x);
        const leadX = sortedByX[0]?.x || 0;
        const tailX = sortedByX[sortedByX.length - 1]?.x || 0;
        const packSpread = Math.max(1, leadX - tailX);

        window.activeRacers.forEach(r => {
            if (r.finished) return;

            // Natural oscillating stamina wave + slight rubber-banding for exciting pack brawls
            r.surgePhase += r.surgeFreq * dt;
            r.wobblePhase += r.wobbleSpeed * dt;

            const behindRatio = (leadX - r.x) / Math.max(400, packSpread);
            const catchupBonus = 1.0 + behindRatio * 0.14;
            const waveFactor = 1.0 + Math.sin(r.surgePhase) * 0.16;

            if (r.stateTimer > 0) {
                r.stateTimer -= rawDt;
                if (r.statusEffect === 'whirlpool' || r.statusEffect === 'spinout') {
                    r.spinAngle += 15 * rawDt;
                }
                if (r.stateTimer <= 0) {
                    r.statusEffect = 'normal';
                    r.currentSpeedMultiplier = 1.0;
                    r.spinAngle = 0;
                }
            }

            if (r.speechTimer > 0) {
                r.speechTimer -= rawDt;
                if (r.speechTimer <= 0) r.speechText = '';
            }

            // Spontaneous random quack burst
            if (r.statusEffect === 'normal' && Math.random() < 0.0025) {
                r.statusEffect = 'dash';
                r.stateTimer = 0.9;
                r.currentSpeedMultiplier = 1.32;
                r.speechText = r.battleCry;
                r.speechTimer = 1.4;
            }

            const speedX = r.baseSpeed * waveFactor * catchupBonus * r.currentSpeedMultiplier;
            r.currentSpeed = speedX;
            r.x += speedX * dt;

            // Dynamic random lane changing + natural vertical weaving so every duck explores the river fairly
            r.laneChangeTimer = (r.laneChangeTimer || 1.2) - dt;
            if (r.laneChangeTimer <= 0) {
                r.laneChangeTimer = 0.9 + Math.random() * 1.6;
                const shift = (Math.random() - 0.5) * 150;
                r.targetY = Math.max(52, Math.min(window.raceConfig.trackWidth - 52, r.y + shift));
            }
            const steerY = ((r.targetY ?? r.y) - r.y) * 1.6 * dt;
            const weaveY = Math.sin(r.wobblePhase * 0.65) * 20 * dt;
            r.y = Math.max(48, Math.min(window.raceConfig.trackWidth - 48, r.y + steerY + weaveY));

            // Spawn water wake foam particles
            if (Math.random() < 0.45) {
                window.wakeParticles.push({
                    x: r.x - 22,
                    y: r.y + (Math.random() * 14 - 7),
                    vx: -30 - Math.random() * 25,
                    vy: (Math.random() - 0.5) * 14,
                    radius: 3 + Math.random() * 4,
                    alpha: 0.65,
                    color: r.statusEffect === 'dash' ? r.auraColor : '#ffffff'
                });
            }

            // Check obstacle collisions (each racer tracks its own triggered obstacles so it never retriggers on every frame)
            if (!r.hitObstacles) r.hitObstacles = new Set();
            window.trackObstacles.forEach((obs, obsIdx) => {
                if (r.hitObstacles.has(obsIdx)) return;
                const dx = r.x - obs.x;
                const dy = r.y - obs.y;
                if (dx * dx + dy * dy < (obs.radius + 18) ** 2) {
                    r.hitObstacles.add(obsIdx);
                    triggerObstacleHit(r, obs);
                }
            });

            r.progress = Math.max(0, Math.min(1, (r.x - window.raceConfig.startX) / (finishX - window.raceConfig.startX)));

            if (r.x >= finishX && !r.finished) {
                r.finished = true;
                r.x = finishX + (window.finishOrder.length * 4);
                r.finishTime = window.raceElapsed;
                window.finishOrder.push(r);

                if (window.finishOrder.length === 1) {
                    r.speechText = 'CHAMPION! 👑';
                    r.speechTimer = 4.0;
                    setCommentary(`🏆 PHOTO FINISH! ${r.customName} (${r.title}) wins the Championship in ${r.finishTime.toFixed(2)}s!`);
                    if (typeof window.playVictoryFanfare === 'function') window.playVictoryFanfare();
                    if (typeof window.playQuack === 'function') window.playQuack(r.quackPitch, true, 'victory');
                } else if (window.finishOrder.length <= 3) {
                    if (typeof window.playQuack === 'function') window.playQuack(r.quackPitch, false, 'happy');
                }
            }
        });

        // Update Wake Particles
        for (let i = window.wakeParticles.length - 1; i >= 0; i--) {
            const p = window.wakeParticles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.alpha -= 0.9 * dt;
            if (p.alpha <= 0) window.wakeParticles.splice(i, 1);
        }

        // Recompute Live Ranks (Finished ducks keep their finish order, racing ducks sorted by X)
        const prevLeaderId = window.currentLeaderId;
        const racingDucks = window.activeRacers.filter(r => !r.finished).sort((a, b) => b.x - a.x);
        window.finishOrder.forEach((r, idx) => { r.rank = idx + 1; });
        racingDucks.forEach((r, idx) => { r.rank = window.finishOrder.length + idx + 1; });

        const newLeader = window.finishOrder[0] || racingDucks[0];
        if (newLeader && prevLeaderId && newLeader.id !== prevLeaderId && window.finishOrder.length === 0) {
            if (typeof window.playLeadChangeDing === 'function') window.playLeadChangeDing();
            if (typeof window.playQuack === 'function') window.playQuack(newLeader.quackPitch, true, 'excited');
            setCommentary(`👑 LEAD CHANGE! ${newLeader.customName} overtakes for 1st Place!`);
        }
        if (newLeader) window.currentLeaderId = newLeader.id;

        updateRaceHUD();

        // Check Race Completion (either all ducks finished, or 1st place finished + 3.5s grace period)
        const allDone = window.activeRacers.every(r => r.finished);
        const firstFinishTime = window.finishOrder[0]?.finishTime || 0;
        const graceExpired = window.finishOrder.length > 0 && (window.raceElapsed - firstFinishTime > 3.2);

        if (allDone || graceExpired) {
            // Auto-finish remaining ducks based on current distance
            racingDucks.forEach((r, idx) => {
                r.finished = true;
                const estExtra = ((finishX - r.x) / Math.max(80, r.baseSpeed)) + (idx * 0.04);
                r.finishTime = window.raceElapsed + Math.max(0.05, estExtra);
                window.finishOrder.push(r);
                r.rank = window.finishOrder.length;
            });
            window.raceState = 'finished';
            if (slowMoBadge) slowMoBadge.classList.add('hidden');
            if (typeof window.stopMusic === 'function') window.stopMusic();
            setTimeout(() => { showWinnerPodium(); }, 450);
        }
    }

    function triggerObstacleHit(racer, obs) {
        const penaltyScale = currentTheme?.hazardPenaltyScale || 1.0;
        if (obs.type === 'boost') {
            racer.statusEffect = 'dash';
            racer.stateTimer = 1.25;
            racer.currentSpeedMultiplier = 1.42;
            racer.speechText = 'NITRO BLAST! 🪶';
            racer.speechTimer = 1.5;
            if (typeof window.playBoostChime === 'function') window.playBoostChime();
            if (typeof window.playQuack === 'function') window.playQuack(racer.quackPitch, true, 'excited');
            setCommentary(`🪶 ${racer.customName} ignited Feather Nitro!`);
        } else if (obs.type === 'bread') {
            racer.statusEffect = 'dash';
            racer.stateTimer = 0.95;
            racer.currentSpeedMultiplier = 1.28;
            racer.speechText = 'NOM NOM! 🍞';
            racer.speechTimer = 1.3;
            if (typeof window.playBreadPop === 'function') window.playBreadPop();
            if (typeof window.playQuack === 'function') window.playQuack(racer.quackPitch, false, 'happy');
        } else if (obs.type === 'banana') {
            // Hilarious Banana Slip & 360 Spinout!
            racer.statusEffect = 'spinout';
            racer.stateTimer = 0.92 * penaltyScale;
            racer.currentSpeedMultiplier = Math.max(0.36, 0.48 / penaltyScale);
            racer.spinAngle = Math.PI * 4;
            const funnyBananaLines = ['WHOOPS! 🍌', 'SLIPPED! 🍌', 'MY DIGNITY! 🍌', 'WHEEEEE! 🍌'];
            racer.speechText = funnyBananaLines[Math.floor(Math.random() * funnyBananaLines.length)];
            racer.speechTimer = 1.6;
            if (typeof window.playWhirlpoolSound === 'function') window.playWhirlpoolSound();
            if (typeof window.playQuack === 'function') window.playQuack(racer.quackPitch, true, 'dizzy');
            setCommentary(`🍌 HILARIOUS SLIP! ${racer.customName} stepped on a banana peel and did a 720° spin!`);
        } else if (obs.type === 'spring') {
            // Super Rocket Launch Pad!
            racer.statusEffect = 'rocket';
            racer.stateTimer = 1.15;
            racer.currentSpeedMultiplier = currentDifficulty?.key === 'chaos' ? 1.72 : 1.62;
            racer.speechText = 'BLAST OFF! 🚀';
            racer.speechTimer = 1.8;
            if (typeof window.playBoostChime === 'function') window.playBoostChime(true);
            if (typeof window.playQuack === 'function') window.playQuack(racer.quackPitch * 1.3, true, 'excited');
            setCommentary(`🚀 ROCKET LAUNCH! ${racer.customName} hit a super springpad and flew past the fleet!`);
        } else if (obs.type === 'whirlpool') {
            racer.statusEffect = 'whirlpool';
            racer.stateTimer = 0.92 * penaltyScale;
            racer.currentSpeedMultiplier = Math.max(0.42, 0.54 / penaltyScale);
            const dizzyLines = ['DIZZY! 🌀', 'I WANNA GET OFF! 🌀', 'MY HEAD! 🌀', 'BLUBLUBLUB! 🌀'];
            racer.speechText = dizzyLines[Math.floor(Math.random() * dizzyLines.length)];
            racer.speechTimer = 1.4;
            if (typeof window.playWhirlpoolSound === 'function') window.playWhirlpoolSound();
            if (typeof window.playQuack === 'function') window.playQuack(racer.quackPitch, true, 'dizzy');
            setCommentary(`🌀 ${racer.customName} got trapped in the dizzy whirlpool!`);
        }
        // Gently nudge obstacle vertically after hit so trailing ducks in the exact same lane get a fresh trajectory
        if (obs.baseY !== undefined) {
            obs.baseY = Math.max(55, Math.min(window.raceConfig.trackWidth - 55, obs.baseY + (Math.random() - 0.5) * 70));
        }
    }

    function updateRaceHUD() {
        const timerEl = document.getElementById('hudTimer');
        if (timerEl) timerEl.textContent = `${window.raceElapsed.toFixed(1)}s`;

        const leader = getLeaderRacer();
        if (leader) {
            const pct = Math.min(100, Math.max(0, Math.floor(leader.progress * 100)));
            const progTxt = document.getElementById('hudProgressText');
            const progBar = document.getElementById('hudProgressBar');
            if (progTxt) progTxt.textContent = `Leader (${leader.customName}): ${pct}%`;
            if (progBar) progBar.style.width = `${pct}%`;
        }

        const lbList = document.getElementById('liveLeaderboardList');
        if (lbList) {
            if (window.activeRacers.length === 0) {
                lbList.innerHTML = `<div class="text-[11px] text-slate-400 italic py-2 text-center">📡 Track Empty — Waiting for QR Joins...</div>`;
                const progTxt = document.getElementById('hudProgressText');
                const progBar = document.getElementById('hudProgressBar');
                if (progTxt) progTxt.textContent = `Waiting for Players...`;
                if (progBar) progBar.style.width = `0%`;
            } else {
                const top5 = [...window.activeRacers].sort((a, b) => a.rank - b.rank).slice(0, 5);
                lbList.innerHTML = top5.map((r, i) => {
                    const isSelected = window.targetDuckId === r.id;
                    const badgeColors = [
                        'bg-amber-400 text-slate-950',
                        'bg-slate-300 text-slate-950',
                        'bg-amber-700 text-white',
                        'bg-slate-800 text-slate-300',
                        'bg-slate-800 text-slate-400'
                    ];
                    return `
                        <div onclick="selectTargetDuckById('${r.id}')"
                             class="cursor-pointer flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl border transition ${
                                 isSelected ? 'bg-amber-500/20 border-amber-400' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                             }">
                            <div class="flex items-center gap-2 min-w-0">
                                <span class="w-5 h-5 rounded-md font-mono text-[10px] font-black flex items-center justify-center shrink-0 ${badgeColors[i]}">
                                    ${i + 1}
                                </span>
                                <span class="font-bold text-slate-100 truncate">${r.customName}</span>
                            </div>
                            <span class="font-mono text-[10px] font-bold shrink-0 ${r.finished ? 'text-emerald-400' : 'text-cyan-300'}">
                                ${r.finished ? r.finishTime.toFixed(2) + 's' : Math.floor(r.progress * 100) + '%'}
                            </span>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    // -------------------------------------------------------------
    // 10. CAMERA TRACKING & INTERACTIVE CANVAS PAN/ZOOM
    // -------------------------------------------------------------
    function updateCamera(dt) {
        const target = getTargetRacer() || { x: 300, y: window.raceConfig.trackWidth / 2 };
        window.camera.orbitAngle += dt * 0.85;

        let desiredX = target.x + 90;
        let desiredY = target.y;
        let baseZoom = 1.0;

        switch (window.activeCameraMode) {
            case 'leader':
                desiredX = target.x + 110;
                desiredY = window.raceConfig.trackWidth / 2 + (target.y - window.raceConfig.trackWidth / 2) * 0.35;
                baseZoom = 0.95;
                break;
            case 'gopro':
                desiredX = target.x + 170;
                desiredY = target.y;
                baseZoom = 1.65;
                break;
            case 'drone3d':
                desiredX = target.x + 70;
                desiredY = target.y;
                baseZoom = 1.15;
                break;
            case 'chase3d':
                desiredX = target.x + 130;
                desiredY = target.y;
                baseZoom = 1.35;
                break;
            case 'heli':
                desiredX = target.x + Math.cos(window.camera.orbitAngle) * 140;
                desiredY = target.y + Math.sin(window.camera.orbitAngle) * 65;
                baseZoom = 0.92 + Math.sin(window.camera.orbitAngle * 1.5) * 0.12;
                break;
            case 'underdog': {
                const last = getUnderdogRacer() || target;
                desiredX = last.x + 100;
                desiredY = last.y;
                baseZoom = 1.18;
                break;
            }
            case 'brawl': {
                const sorted = [...window.activeRacers].sort((a, b) => b.x - a.x);
                const mid = sorted[Math.floor(sorted.length / 2)] || target;
                desiredX = mid.x + 40;
                desiredY = window.raceConfig.trackWidth / 2;
                baseZoom = 1.05;
                break;
            }
            case 'finish':
                desiredX = window.raceConfig.trackLength - 140;
                desiredY = window.raceConfig.trackWidth / 2;
                baseZoom = 1.0;
                break;
            case 'blimp':
                desiredX = window.raceConfig.trackLength / 2;
                desiredY = window.raceConfig.trackWidth / 2;
                baseZoom = 0.24;
                break;
            case 'split':
            default:
                desiredX = target.x + 80;
                desiredY = window.raceConfig.trackWidth / 2;
                baseZoom = 0.95;
                break;
        }

        const isMobilePortrait = window.innerWidth < 640;
        const mobileScale = isMobilePortrait ? 0.72 : 1.0;
        const finalZoom = baseZoom * mobileScale * window.camera.userZoom;
        const lerp = Math.min(1.0, dt * 6.5);

        window.camera.x += (desiredX + window.camera.panOffsetX - window.camera.x) * lerp;
        window.camera.y += (desiredY + window.camera.panOffsetY - window.camera.y) * lerp;
        window.camera.zoom += (finalZoom - window.camera.zoom) * lerp;
    }

    // -------------------------------------------------------------
    // 11. MULTI-CAMERA CANVAS RENDERING (2D, 3D TILT, SPLIT-SCREEN)
    // -------------------------------------------------------------
    function renderArenaCanvas() {
        const canvas = document.getElementById('raceCanvas');
        if (!canvas) return;

        // Auto-sync canvas pixel buffer to display size every frame so it is NEVER blurry!
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        if (rect.width > 0 && rect.height > 0) {
            const targetW = Math.round(rect.width * dpr);
            const targetH = Math.round(rect.height * dpr);
            if (canvas.width !== targetW || canvas.height !== targetH) {
                canvas.width = targetW;
                canvas.height = targetH;
            }
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const cw = canvas.width / dpr;
        const ch = canvas.height / dpr;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, cw, ch);

        if (window.activeCameraMode === 'split' && window.activeRacers.length >= 2) {
            renderTripleSplitScreen(ctx, cw, ch);
        } else {
            renderCameraViewport(ctx, 0, 0, cw, ch, window.camera.x, window.camera.y, window.camera.zoom, window.activeCameraMode);
        }

        ctx.restore();
    }

    function renderTripleSplitScreen(ctx, cw, ch) {
        const sorted = [...window.activeRacers].sort((a, b) => a.rank - b.rank);
        const leader = sorted[0] || { x: 400, y: 260 };
        const mid = sorted[Math.floor(sorted.length / 2)] || leader;
        const underdog = sorted[sorted.length - 1] || leader;

        const isVerticalSplit = cw < 640;
        const panelW = isVerticalSplit ? cw : cw / 3;
        const panelH = isVerticalSplit ? ch / 3 : ch;
        const splitZoomScale = isVerticalSplit ? 0.75 : 1.0;

        const configs = [
            { x: 0, y: 0, w: panelW, h: panelH, camX: leader.x + 60, camY: leader.y, zoom: 1.05 * splitZoomScale, label: '👑 1ST PLACE LEADER', color: '#facc15' },
            { x: isVerticalSplit ? 0 : panelW, y: isVerticalSplit ? panelH : 0, w: panelW, h: panelH, camX: mid.x + 40, camY: mid.y, zoom: 1.0 * splitZoomScale, label: '💥 MID-PACK BRAWL', color: '#38bdf8' },
            { x: isVerticalSplit ? 0 : panelW * 2, y: isVerticalSplit ? panelH * 2 : 0, w: panelW, h: panelH, camX: underdog.x + 60, camY: underdog.y, zoom: 1.05 * splitZoomScale, label: '🔥 UNDERDOG CAM', color: '#f43f5e' }
        ];

        configs.forEach((cfg, idx) => {
            ctx.save();
            ctx.beginPath();
            ctx.rect(cfg.x, cfg.y, cfg.w, cfg.h);
            ctx.clip();

            renderCameraViewport(ctx, cfg.x, cfg.y, cfg.w, cfg.h, cfg.camX, cfg.camY, cfg.zoom * window.camera.userZoom, 'leader');

            // Split Panel Header Pill
            const pillY = isVerticalSplit ? cfg.y + 8 : 68;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            ctx.beginPath();
            ctx.roundRect(cfg.x + 12, pillY, 155, 24, 6);
            ctx.fill();
            ctx.strokeStyle = cfg.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = cfg.color;
            ctx.font = '800 10px Inter, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(cfg.label, cfg.x + 20, pillY + 16);

            ctx.restore();

            if (idx > 0) {
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 5;
                ctx.beginPath();
                if (isVerticalSplit) {
                    ctx.moveTo(0, cfg.y);
                    ctx.lineTo(cw, cfg.y);
                } else {
                    ctx.moveTo(cfg.x, 0);
                    ctx.lineTo(cfg.x, ch);
                }
                ctx.stroke();

                ctx.strokeStyle = '#f59e0b';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        });
    }

    function renderCameraViewport(ctx, vx, vy, vw, vh, camX, camY, zoom, mode) {
        ctx.save();
        ctx.translate(vx + vw / 2, vy + vh / 2);

        // Pseudo-3D Perspective Transformations for 3D camera modes
        if (mode === 'drone3d') {
            ctx.scale(1.0, 0.76);
            ctx.rotate(-0.08);
        } else if (mode === 'chase3d') {
            ctx.scale(1.12, 0.72);
        } else if (mode === 'gopro') {
            ctx.scale(1.22, 0.86);
        }

        ctx.scale(zoom, zoom);
        ctx.translate(-camX, -camY);

        drawWorldTrack(ctx, camX, vw / zoom);
        ctx.restore();

        // GoPro Action-Cam Vignette Overlay
        if (mode === 'gopro') {
            const rad = ctx.createRadialGradient(vx + vw / 2, vy + vh / 2, vh * 0.25, vx + vw / 2, vy + vh / 2, vw * 0.65);
            rad.addColorStop(0, 'rgba(0,0,0,0)');
            rad.addColorStop(1, 'rgba(2, 6, 23, 0.65)');
            ctx.fillStyle = rad;
            ctx.fillRect(vx, vy, vw, vh);

            // REC indicator
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(vx + vw / 2 - 42, vy + 26, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('GOPRO HERO • DUCK POV', vx + vw / 2 - 30, vy + 30);
        }
    }

    function drawWorldTrack(ctx, camX, viewSpanW) {
        const trackLen = window.raceConfig.trackLength;
        const trackH = window.raceConfig.trackWidth;
        const startX = window.raceConfig.startX;
        const now = performance.now();

        const minVisX = Math.max(-800, camX - viewSpanW * 0.9);
        const maxVisX = Math.min(trackLen + 1000, camX + viewSpanW * 0.9);

        // 1. Outer Stadium Terrain / Banks
        ctx.fillStyle = currentTheme.bankOuter;
        ctx.fillRect(minVisX - 400, -600, (maxVisX - minVisX) + 800, trackH + 1200);

        // Inner Grass / Shore Bank
        ctx.fillStyle = currentTheme.bankInner;
        ctx.fillRect(-400, -45, trackLen + 1000, trackH + 90);

        // 2. River Channel Water Gradient
        const waterGrad = ctx.createLinearGradient(0, 0, 0, trackH);
        waterGrad.addColorStop(0, currentTheme.waterLeft);
        waterGrad.addColorStop(0.5, currentTheme.waterCenter);
        waterGrad.addColorStop(1, currentTheme.waterRight);
        ctx.fillStyle = waterGrad;
        ctx.fillRect(-400, 0, trackLen + 1000, trackH);

        // Optional Synthwave Grid for Cyber Theme
        if (currentTheme.gridLines) {
            ctx.strokeStyle = 'rgba(236, 72, 153, 0.18)';
            ctx.lineWidth = 1.5;
            for (let gx = Math.floor(minVisX / 100) * 100; gx < maxVisX; gx += 100) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, trackH);
                ctx.stroke();
            }
            for (let gy = 0; gy <= trackH; gy += 65) {
                ctx.beginPath();
                ctx.moveTo(minVisX, gy);
                ctx.lineTo(maxVisX, gy);
                ctx.stroke();
            }
        }

        // 3. Animated Flowing Water Currents & Foam Streaks
        ctx.strokeStyle = currentTheme.rippleColor;
        ctx.lineWidth = 2.5;
        const flowOffset = (now * 0.11) % 160;
        for (let x = Math.floor((minVisX - 160) / 160) * 160; x < maxVisX + 160; x += 160) {
            const drawX = x + flowOffset;
            for (let lane = 1; lane <= 6; lane++) {
                const y = (trackH / 7) * lane;
                ctx.beginPath();
                ctx.moveTo(drawX, y);
                ctx.quadraticCurveTo(drawX + 35, y - 8, drawX + 70, y);
                ctx.quadraticCurveTo(drawX + 105, y + 8, drawX + 140, y);
                ctx.stroke();
            }
        }

        // 4. Stadium Curbs & Distance Markers (Every 500m)
        const curbW = 40;
        for (let cx = -200; cx < trackLen + 600; cx += curbW) {
            if (cx + curbW < minVisX || cx > maxVisX) continue;
            const isEven = Math.floor(cx / curbW) % 2 === 0;
            ctx.fillStyle = isEven ? currentTheme.curbA : currentTheme.curbB;
            ctx.fillRect(cx, -12, curbW, 12);
            ctx.fillRect(cx, trackH, curbW, 12);
        }

        // Distance Markers on Water & Banks
        for (let mx = startX + 500; mx < trackLen; mx += 500) {
            if (mx < minVisX - 100 || mx > maxVisX + 100) continue;
            const pct = Math.round(((mx - startX) / (trackLen - startX)) * 100);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.setLineDash([8, 8]);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(mx, 0);
            ctx.lineTo(mx, trackH);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
            ctx.beginPath();
            ctx.roundRect(mx - 28, -36, 56, 20, 5);
            ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${pct}%`, mx, -22);
        }

        // 5. Shore Scenery Props (Trees, Rocks, Lamps)
        window.sceneryProps.forEach(prop => {
            if (prop.x < minVisX - 80 || prop.x > maxVisX + 80) return;
            ctx.save();
            ctx.translate(prop.x, prop.y);
            ctx.scale(prop.scale, prop.scale);

            if (currentThemeKey === 'cyber') {
                ctx.fillStyle = prop.variant === 0 ? '#ec4899' : '#22d3ee';
                ctx.beginPath();
                ctx.arc(0, 0, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (currentThemeKey === 'lava') {
                ctx.fillStyle = '#44403c';
                ctx.beginPath();
                ctx.moveTo(-18, 12);
                ctx.lineTo(0, -18);
                ctx.lineTo(18, 12);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#f97316';
                ctx.beginPath();
                ctx.arc(0, -4, 5, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Lush Tree / Bush cluster
                ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                ctx.beginPath();
                ctx.arc(4, 5, 18, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = prop.variant === 0 ? '#15803d' : '#16a34a';
                ctx.beginPath();
                ctx.arc(0, 0, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#4ade80';
                ctx.beginPath();
                ctx.arc(-5, -5, 8, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });

        // 6. Start Line Gate
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(startX, 0, 10, trackH);
        for (let y = 0; y < trackH; y += 20) {
            ctx.fillStyle = (Math.floor(y / 20) % 2 === 0) ? '#0f172a' : '#fde047';
            ctx.fillRect(startX, y, 10, 20);
        }

        // Empty Track Waiting Banner on Water (When in IRL Waiting Mode and 0 or more players are waiting)
        if (window.irlWaitingMode && window.raceState === 'idle') {
            ctx.save();
            const bannerX = startX + 195;
            const bannerY = trackH / 2;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
            ctx.strokeStyle = 'rgba(217, 70, 239, 0.75)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.roundRect(bannerX - 165, bannerY - 42, 330, 84, 16);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#f0abfc';
            ctx.font = '900 14px Fredoka, Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📡 WAITING FOR IRL QR PARTICIPANTS', bannerX, bannerY - 12);

            ctx.fillStyle = '#fde047';
            ctx.font = '800 12px Inter, sans-serif';
            const joinedCount = window.activeRacers.length;
            ctx.fillText(
                joinedCount === 0
                    ? 'Track Empty • Scan QR Code to Spawn Your Duck!'
                    : `${joinedCount} Player(s) Ready at Starting Gate • Waiting for Host Start!`,
                bannerX,
                bannerY + 10
            );

            ctx.fillStyle = '#94a3b8';
            ctx.font = '600 10px monospace';
            ctx.fillText('Host: Click "🚀 START IRL RACE NOW" when everyone is in!', bannerX, bannerY + 28);
            ctx.restore();
        }

        // 7. Grand Checkered Finish Line Banner
        const finishX = trackLen;
        const sq = 16;
        for (let row = 0; row < trackH / sq; row++) {
            for (let col = 0; col < 3; col++) {
                ctx.fillStyle = (row + col) % 2 === 0 ? '#ffffff' : '#0f172a';
                ctx.fillRect(finishX + col * sq, row * sq, sq, sq);
            }
        }
        // Finish Arch Pillars
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.roundRect(finishX - 8, -32, 64, 24, 6);
        ctx.roundRect(finishX - 8, trackH + 8, 64, 24, 6);
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.font = '900 11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏁 FINISH', finishX + 24, -16);
        ctx.fillText('🏁 FINISH', finishX + 24, trackH + 24);

        // 8. Track Obstacles & Power-Ups
        window.trackObstacles.forEach(obs => {
            if (obs.x < minVisX - 60 || obs.x > maxVisX + 60) return;
            ctx.save();
            ctx.translate(obs.x, obs.y);
            const pulse = 1 + Math.sin(now * 0.006 + obs.phase) * 0.1;
            ctx.scale(pulse, pulse);

            if (obs.type === 'boost') {
                ctx.fillStyle = 'rgba(250, 204, 21, 0.28)';
                ctx.beginPath();
                ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fde047';
                ctx.lineWidth = 2.2;
                ctx.stroke();
            } else if (obs.type === 'bread') {
                ctx.fillStyle = 'rgba(249, 115, 22, 0.25)';
                ctx.beginPath();
                ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fb923c';
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (obs.type === 'banana') {
                ctx.fillStyle = 'rgba(234, 179, 8, 0.24)';
                ctx.beginPath();
                ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            } else if (obs.type === 'spring') {
                ctx.fillStyle = 'rgba(244, 63, 94, 0.28)';
                ctx.beginPath();
                ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#fb7185';
                ctx.lineWidth = 2.2;
                ctx.stroke();
            } else if (obs.type === 'whirlpool') {
                ctx.rotate(now * 0.004);
                ctx.fillStyle = 'rgba(34, 211, 238, 0.25)';
                ctx.beginPath();
                ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#22d3ee';
                ctx.lineWidth = 2.5;
                ctx.setLineDash([10, 6]);
                ctx.stroke();
                ctx.setLineDash([]);
            }

            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(obs.icon, 0, 1);
            ctx.restore();
        });

        // 9. Wake Foam Particles
        window.wakeParticles.forEach(p => {
            if (p.x < minVisX || p.x > maxVisX) return;
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // 10. Draw Racers (Sorted by Y for proper depth overlapping)
        const depthSorted = [...window.activeRacers].sort((a, b) => a.y - b.y);
        depthSorted.forEach(r => {
            if (r.x < minVisX - 100 || r.x > maxVisX + 100) return;
            drawRacerOnTrack(ctx, r, now);
        });
    }

    function drawRacerOnTrack(ctx, r, now) {
        ctx.save();
        const bobY = Math.sin(now * 0.008 + r.wobblePhase) * 3.2;
        const pitchAngle = Math.sin(now * 0.007 + r.wobblePhase) * 0.05 + (r.statusEffect === 'dash' ? -0.08 : 0) + r.spinAngle;

        ctx.translate(r.x, r.y + bobY);

        // V-Wake Water Trail behind Duck
        ctx.strokeStyle = r.statusEffect === 'dash' ? r.auraColor : 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = r.statusEffect === 'dash' ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(-14, -4);
        ctx.lineTo(-42, -16);
        ctx.moveTo(-14, 4);
        ctx.lineTo(-42, 16);
        ctx.stroke();

        // Highlight Ring if Targeted or 1st Place
        const isTarget = window.targetDuckId === r.id;
        if (r.rank === 1 || isTarget) {
            ctx.strokeStyle = r.rank === 1 ? '#facc15' : '#22d3ee';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.ellipse(0, 14, 28, 10, 0, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Dash / Rocket Nitro Flame Aura
        if (r.statusEffect === 'dash' || r.statusEffect === 'rocket') {
            ctx.fillStyle = r.statusEffect === 'rocket' ? '#f43f5e' : (r.auraColor || '#facc15');
            ctx.globalAlpha = 0.45;
            ctx.beginPath();
            ctx.arc(-8, 0, r.statusEffect === 'rocket' ? 40 : 32, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }

        // Spinout dizziness stars ⭐
        if (r.statusEffect === 'spinout' || r.statusEffect === 'whirlpool') {
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('💫', 0, -32);
        }

        // Draw Duck Sprite Facing Right (+X)
        ctx.save();
        ctx.rotate(pitchAngle);
        const sprite = r.duckData?.spriteImg || spriteCache.get(r.id);
        const size = 60;
        if (sprite && sprite.complete && sprite.naturalWidth > 0) {
            ctx.drawImage(sprite, -size / 2, -size / 2 - 4, size, size);
        } else {
            ctx.fillStyle = r.duckData?.bodyColor || '#fde047';
            ctx.beginPath();
            ctx.arc(0, 0, 18, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Crown above 1st Place Leader
        if (r.rank === 1) {
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👑', 2, -34);
        }

        // Crisp Nameplate Badge Below Duck (Hide name tags when packed with >40 ducks unless 1st place, hovered or targeted)
        const totalCount = window.activeRacers ? window.activeRacers.length : 0;
        const showBadge = totalCount <= 35 || r.rank === 1 || isTarget;

        if (showBadge) {
            const label = `#${r.rank} ${r.customName}`;
            ctx.font = '700 10.5px Inter, sans-serif';
            const tw = ctx.measureText(label).width;
            const pillW = tw + 14;
            const pillH = 18;

            ctx.fillStyle = r.rank === 1 ? 'rgba(234, 179, 8, 0.95)' : 'rgba(15, 23, 42, 0.88)';
            ctx.beginPath();
            ctx.roundRect(-pillW / 2, 22, pillW, pillH, 6);
            ctx.fill();

            ctx.strokeStyle = r.rank === 1 ? '#fef08a' : 'rgba(148, 163, 184, 0.4)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.fillStyle = r.rank === 1 ? '#09090b' : '#f8fafc';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, 0, 31);
        }

        // Battle Cry Speech Bubble Above Duck
        if (r.speechText) {
            ctx.font = '800 10px Inter, sans-serif';
            const sw = ctx.measureText(r.speechText).width;
            const bw = sw + 16;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(-bw / 2, -56, bw, 20, 8);
            ctx.fill();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.8;
            ctx.stroke();

            ctx.fillStyle = '#0f172a';
            ctx.fillText(r.speechText, 0, -46);
        }

        ctx.restore();
    }

    // -------------------------------------------------------------
    // 12. WINNER PODIUM, FULL STANDINGS & CONFETTI CELEBRATION
    // -------------------------------------------------------------
    window.closeWinnerModal = function () {
        const m = document.getElementById('winnerModal');
        if (m) m.classList.add('hidden');
        stopConfetti();
        if (typeof window.startMusic === 'function') window.startMusic('lobby');
    };

    window.closeModalAndEdit = function () {
        closeWinnerModal();
        showSetupView();
    };

    window.raceAgainSameRoster = function () {
        closeWinnerModal();
        startRace();
    };

    window.removeWinnerAndRaceAgain = function () {
        if (window.finishOrder.length > 0) {
            const winner = window.finishOrder[0];
            const d = window.rosterState.find(x => x.id === winner.id);
            if (d) d.enabled = false;
            renderRosterCards();
        }
        closeWinnerModal();
        startRace();
    };

    function getCurrentResultStandings() {
        if (window.finishOrder && window.finishOrder.length > 0) {
            const finishedIds = new Set(window.finishOrder.map(r => r.id));
            const remaining = (window.activeRacers || [])
                .filter(r => !finishedIds.has(r.id))
                .sort((a, b) => b.x - a.x);
            return [...window.finishOrder, ...remaining];
        }
        if (window.activeRacers && window.activeRacers.length > 0) {
            return [...window.activeRacers].sort((a, b) => (a.rank || 999) - (b.rank || 999) || b.x - a.x);
        }
        return [];
    }

    function triggerFileDownload(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
    }

    window.exportRaceResults = function (format = 'csv') {
        const list = getCurrentResultStandings();
        if (!list.length) {
            setCommentary(`⚠️ No race results available to export yet!`);
            return;
        }

        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
        const mapName = currentTheme?.name || 'River Rapids';
        const diffMode = (currentDifficulty?.key || 'normal').toUpperCase();

        if (format === 'csv') {
            const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
            const headers = ['Rank', 'Medal', 'Participant Name', 'Character Title', 'Finish Time (s)', 'Progress (%)', 'Map', 'Difficulty'];
            const rows = list.map((r, idx) => {
                const rank = idx + 1;
                const medal = idx === 0 ? '1st (Gold)' : idx === 1 ? '2nd (Silver)' : idx === 2 ? '3rd (Bronze)' : `#${rank}`;
                const timeStr = r.finishTime ? r.finishTime.toFixed(2) : (window.raceElapsed ? window.raceElapsed.toFixed(2) : '0.00');
                const progStr = r.finished ? '100' : Math.min(100, Math.max(0, Math.round((r.progress || 0) * 100)));
                return [
                    rank,
                    escapeCsv(medal),
                    escapeCsv(r.customName || ''),
                    escapeCsv(r.title || ''),
                    timeStr,
                    progStr,
                    escapeCsv(mapName),
                    escapeCsv(diffMode)
                ].join(',');
            });
            // Prepend UTF-8 BOM (\uFEFF) so Excel opens emojis & international names cleanly
            const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
            triggerFileDownload(`duck-race-results_${stamp}.csv`, csvContent, 'text/csv;charset=utf-8;');
            if (typeof window.playBoostChime === 'function') window.playBoostChime();
            setCommentary(`📥 Exported ${list.length} race standings to CSV (duck-race-results_${stamp}.csv)!`);
        } else if (format === 'txt') {
            const lines = [
                `====================================================`,
                `🏆 CHAMPIONSHIP DUCK RACE - OFFICIAL RESULTS LIST`,
                `====================================================`,
                `Date: ${now.toLocaleString()}`,
                `Map:  ${mapName} [${diffMode} MODE]`,
                `Total Racers: ${list.length}`,
                `----------------------------------------------------`,
                ...list.map((r, idx) => {
                    const medal = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `#${String(idx + 1).padStart(2, ' ')}`;
                    const timeStr = r.finishTime ? `${r.finishTime.toFixed(2)}s` : `${Math.round((r.progress || 0) * 100)}%`;
                    return `${medal.padEnd(7, ' ')} | ${r.customName} (${r.title}) — ${timeStr}`;
                }),
                `====================================================`
            ];
            triggerFileDownload(`duck-race-results_${stamp}.txt`, lines.join('\r\n'), 'text/plain;charset=utf-8;');
            if (typeof window.playBoostChime === 'function') window.playBoostChime();
            setCommentary(`📄 Exported ${list.length} race standings to Text file!`);
        } else if (format === 'copy') {
            const lines = [
                `🏆 Duck Race Results (${mapName} • ${diffMode})`,
                ...list.map((r, idx) => {
                    const medal = idx === 0 ? '🥇 1.' : idx === 1 ? '🥈 2.' : idx === 2 ? '🥉 3.' : `${idx + 1}.`;
                    const timeStr = r.finishTime ? `${r.finishTime.toFixed(2)}s` : `${Math.round((r.progress || 0) * 100)}%`;
                    return `${medal} ${r.customName} (${r.title}) - ${timeStr}`;
                })
            ];
            const text = lines.join('\n');
            const copyBtn = document.getElementById('copyResultsBtn');
            const flashCopied = () => {
                if (copyBtn) {
                    const orig = copyBtn.innerHTML;
                    copyBtn.innerHTML = `<span>✅</span> <span>Copied!</span>`;
                    setTimeout(() => { copyBtn.innerHTML = orig; }, 1800);
                }
                if (typeof window.playBoostChime === 'function') window.playBoostChime();
                setCommentary(`📋 Copied ${list.length} race results to clipboard!`);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(flashCopied).catch(() => {
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                    flashCopied();
                });
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                flashCopied();
            }
        }
    };
    window.openWinnerModal = function () {
        const list = getCurrentResultStandings();
        if (!list.length) return;
        showWinnerPodium();
    };

    function showWinnerPodium() {
        const modal = document.getElementById('winnerModal');
        const podiumContainer = document.getElementById('podiumContainer');
        const fullStandingsTable = document.getElementById('fullStandingsTable');
        const summary = document.getElementById('modalRaceSummary');
        const badge = document.getElementById('totalFinishersBadge');

        if (!modal) return;

        const standings = getCurrentResultStandings();
        const first = standings[0];
        const second = standings[1];
        const third = standings[2];

        if (badge) badge.textContent = `${standings.length} Racers`;
        if (summary && first) {
            const firstTimeStr = first.finishTime ? `${first.finishTime.toFixed(2)}s` : `${Math.round((first.progress || 0) * 100)}%`;
            summary.textContent = `🏆 ${first.customName} (${first.title}) takes the Championship Crown in ${firstTimeStr}!`;
        }

        // Visual Podium Order: 2nd (Silver Left), 1st (Gold Center Tall), 3rd (Bronze Right)
        const podiumSlots = [
            { racer: second, place: '2ND PLACE', medal: '🥈', heightClass: 'sm:h-56', border: 'border-slate-400/60', bg: 'from-slate-800/90 to-slate-900', text: 'text-slate-200' },
            { racer: first,  place: '1ST CHAMPION', medal: '👑', heightClass: 'sm:h-64 podium-glow', border: 'border-amber-400', bg: 'from-amber-500/25 via-slate-900 to-slate-900', text: 'text-amber-300' },
            { racer: third,  place: '3RD PLACE', medal: '🥉', heightClass: 'sm:h-52', border: 'border-amber-700/70', bg: 'from-amber-950/40 to-slate-900', text: 'text-amber-500' }
        ].filter(s => s.racer);

        if (podiumContainer) {
            podiumContainer.innerHTML = podiumSlots.map(slot => {
                const r = slot.racer;
                const timeBadge = r.finishTime ? `⏱️ ${r.finishTime.toFixed(2)}s` : `📍 ${Math.round((r.progress || 0) * 100)}%`;
                return `
                    <div class="bg-gradient-to-b ${slot.bg} border-2 ${slot.border} ${slot.heightClass} rounded-2xl p-4 flex flex-col items-center justify-between shadow-2xl">
                        <span class="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950/80 ${slot.text} border border-slate-700">
                            ${slot.medal} ${slot.place}
                        </span>
                        <div class="w-24 h-24 my-1 animate-bob">
                            ${r.duckData?.svgMarkup || ''}
                        </div>
                        <div class="text-center w-full">
                            <div class="font-display text-base font-bold text-white truncate">${r.customName}</div>
                            <div class="text-[11px] font-semibold text-slate-400 truncate">${r.title}</div>
                            <div class="mt-1 font-mono text-xs font-extrabold text-cyan-300 bg-slate-950/80 rounded-lg py-0.5 px-2 inline-block">
                                ${timeBadge}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (fullStandingsTable) {
            fullStandingsTable.innerHTML = standings.map((r, idx) => {
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                const timeBadge = r.finishTime ? `${r.finishTime.toFixed(2)}s` : `${Math.round((r.progress || 0) * 100)}%`;
                return `
                    <div class="flex items-center justify-between px-4 py-2.5 hover:bg-slate-900/60 transition text-xs">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="font-mono font-extrabold w-8 text-amber-400">${medal}</span>
                            <div class="w-8 h-8 shrink-0">${r.duckData?.svgMarkup || ''}</div>
                            <div class="truncate">
                                <span class="font-bold text-slate-100">${r.customName}</span>
                                <span class="text-[10px] text-slate-400 ml-1.5">(${r.title})</span>
                            </div>
                        </div>
                        <span class="font-mono font-bold text-cyan-300 shrink-0">${timeBadge}</span>
                    </div>
                `;
            }).join('');
        }

        modal.classList.remove('hidden');
        startConfetti();
    }

    function startConfetti() {
        const c = document.getElementById('confettiCanvas');
        if (!c) return;
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        const ctx = c.getContext('2d');
        const colors = ['#facc15', '#38bdf8', '#f43f5e', '#4ade80', '#a855f7', '#fb923c'];

        confettiParticles = Array.from({ length: 110 }, () => ({
            x: Math.random() * c.width,
            y: Math.random() * c.height - c.height,
            w: 6 + Math.random() * 6,
            h: 8 + Math.random() * 8,
            vx: (Math.random() - 0.5) * 3,
            vy: 2.5 + Math.random() * 4,
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.15,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));

        function loopConfetti() {
            ctx.clearRect(0, 0, c.width, c.height);
            confettiParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.rot += p.vRot;
                if (p.y > c.height + 20) {
                    p.y = -20;
                    p.x = Math.random() * c.width;
                }
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            confettiAnimId = requestAnimationFrame(loopConfetti);
        }
        stopConfetti();
        confettiAnimId = requestAnimationFrame(loopConfetti);
    }

    function stopConfetti() {
        if (confettiAnimId) {
            cancelAnimationFrame(confettiAnimId);
            confettiAnimId = null;
        }
    }

    // -------------------------------------------------------------
    // 13. CANVAS INTERACTION (CLICK/TAP DUCK TO CHEER, DRAG/TOUCH PAN, PINCH/WHEEL ZOOM)
    // -------------------------------------------------------------
    function resizeCanvas() {
        const canvas = document.getElementById('raceCanvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
    }
    window.resizeCanvas = resizeCanvas;

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 150));

    window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('raceCanvas');
        if (!canvas) return;

        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let movedDist = 0;
        let initialPinchDist = null;
        let initialPinchZoom = 1.0;

        // Mouse Events
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            movedDist = 0;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            movedDist += Math.abs(dx) + Math.abs(dy);
            dragStartX = e.clientX;
            dragStartY = e.clientY;

            window.camera.panOffsetX -= dx / window.camera.zoom;
            window.camera.panOffsetY -= dy / window.camera.zoom;
        });

        window.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            if (movedDist < 8) {
                handleCanvasClick(e.clientX, e.clientY, canvas);
            }
        });

        // Touch Events for Mobile (1-finger pan, tap to cheer/target duck, 2-finger pinch zoom)
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                dragStartX = e.touches[0].clientX;
                dragStartY = e.touches[0].clientY;
                movedDist = 0;
                initialPinchDist = null;
            } else if (e.touches.length === 2) {
                isDragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                initialPinchDist = Math.hypot(dx, dy);
                initialPinchZoom = window.camera.userZoom || 1.0;
            }
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging) {
                e.preventDefault();
                const cx = e.touches[0].clientX;
                const cy = e.touches[0].clientY;
                const dx = cx - dragStartX;
                const dy = cy - dragStartY;
                movedDist += Math.abs(dx) + Math.abs(dy);
                dragStartX = cx;
                dragStartY = cy;

                window.camera.panOffsetX -= dx / window.camera.zoom;
                window.camera.panOffsetY -= dy / window.camera.zoom;
            } else if (e.touches.length === 2 && initialPinchDist) {
                e.preventDefault();
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                const scale = dist / Math.max(10, initialPinchDist);
                const nextZoom = Math.max(0.55, Math.min(1.85, initialPinchZoom * scale));
                window.setCameraZoom(nextZoom);
                const slider = document.getElementById('camZoomSlider');
                if (slider) slider.value = nextZoom;
            }
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
            if (isDragging && e.changedTouches.length === 1 && movedDist < 12) {
                const t = e.changedTouches[0];
                handleCanvasClick(t.clientX, t.clientY, canvas);
            }
            if (e.touches.length === 0) {
                isDragging = false;
                initialPinchDist = null;
            }
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY < 0 ? 0.08 : -0.08;
            const nextZoom = Math.max(0.55, Math.min(1.85, window.camera.userZoom + delta));
            window.setCameraZoom(nextZoom);
            const slider = document.getElementById('camZoomSlider');
            if (slider) slider.value = nextZoom;
        }, { passive: false });
    });

    function handleCanvasClick(clientX, clientY, canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const clickY = clientY - rect.top;

        const worldX = window.camera.x + (clickX - rect.width / 2) / window.camera.zoom;
        const worldY = window.camera.y + (clickY - rect.height / 2) / window.camera.zoom;

        // Check if user clicked/tapped on a duck
        let clickedDuck = null;
        let minDist = 48;
        window.activeRacers.forEach(r => {
            const dist = Math.hypot(r.x - worldX, r.y - worldY);
            if (dist < minDist) {
                minDist = dist;
                clickedDuck = r;
            }
        });

        if (clickedDuck) {
            window.selectTargetDuckById(clickedDuck.id);
            clickedDuck.speechText = clickedDuck.battleCry || 'LETS GO! 🔥';
            clickedDuck.speechTimer = 1.8;
            if (window.raceState === 'racing' && !clickedDuck.finished) {
                clickedDuck.statusEffect = 'dash';
                clickedDuck.stateTimer = 0.85;
                clickedDuck.currentSpeedMultiplier = 1.3;
            }
            if (typeof window.playQuack === 'function') window.playQuack(clickedDuck.quackPitch, true, 'excited');
            setCommentary(`📣 Crowd cheers for ${clickedDuck.customName}! Camera locked & morale boosted!`);
        }
    }

    // Keyboard Shortcuts (1-9, 0, A, C, [, ], Space)
    window.addEventListener('keydown', (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
        const k = e.key;
        if (k === '1') setCameraMode('leader', true);
        else if (k === '2') setCameraMode('gopro', true);
        else if (k === '3') setCameraMode('drone3d', true);
        else if (k === '4') setCameraMode('chase3d', true);
        else if (k === '5') setCameraMode('heli', true);
        else if (k === '6') setCameraMode('underdog', true);
        else if (k === '7') setCameraMode('brawl', true);
        else if (k === '8') setCameraMode('finish', true);
        else if (k === '9') setCameraMode('split', true);
        else if (k === '0') setCameraMode('blimp', true);
        else if (k === 'a' || k === 'A') toggleAutoDirector();
        else if (k === 'c' || k === 'C') toggleBroadcastHUD();
        else if (k === '[') cycleTargetDuck(-1);
        else if (k === ']') cycleTargetDuck(1);
        else if (k === ' ') {
            e.preventDefault();
            triggerManualChaos();
        }
    });
})();
