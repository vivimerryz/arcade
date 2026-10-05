(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const viewport = document.getElementById("gameViewport");
  const startOverlay = document.getElementById("startOverlay");
  const startButton = document.getElementById("startButton");
  const pauseBadge = document.getElementById("pauseBadge");
  const scoreLabel = document.getElementById("scoreLabel");
  const gamesPlayedLabel = document.getElementById("gamesPlayed");
  const bestScoreLabel = document.getElementById("bestScore");
  const titleLabel = document.getElementById("cabinetTitle");
  const gameLabel = document.getElementById("gameLabel");
  const gameTag = document.getElementById("gameTag");
  const objectiveLabel = document.getElementById("objectiveLabel");
  const livesLabel = document.getElementById("livesLabel");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayText = document.getElementById("overlayText");
  const tipText = document.getElementById("tipText");
  const pointsLabel = document.getElementById("pointsLabel");
  const shopPointsLabel = document.getElementById("shopPointsLabel");
  const shopModal = document.getElementById("shopModal");
  const shopStatus = document.getElementById("shopStatus");
  const vipBadge = document.getElementById("vipBadge");
  const dpadButtons = document.querySelectorAll("[data-key]");
  const W = canvas.width;
  const H = canvas.height;
  const colors = { ink: "#08090c", panel: "#11151e", paper: "#f4efdf", dim: "#8b93a5", yellow: "#ffd24d", coral: "#ff6b57", cyan: "#5de3d0", pink: "#ff8cd5", blue: "#7aa7ff", green: "#8fdc7d" };

  const games = [
    { id: "maze", number: "01", title: "Maze Munch", desc: "Dots, corners, close calls", category: "arcade", tag: "ARCADE / 01", objective: "OBJECTIVE: CLEAR THE GRID", tip: "Pro tip: dots in the corners are worth double.", help: "Eat every dot. Dodge the glitch ghosts. Arrow keys or WASD to move." },
    { id: "blocks", number: "02", title: "Block Party", desc: "Stack it. Spin it. Clear it.", category: "arcade", tag: "ARCADE / 02", objective: "OBJECTIVE: CLEAR LINES", tip: "Pro tip: a flat floor is your best friend.", help: "Stack the falling blocks and clear full rows. Arrow keys move; up rotates." },
    { id: "math", number: "03", title: "Number Pop", desc: "Quick math, big score", category: "brain", tag: "BRAIN / 03", objective: "OBJECTIVE: POP THE ANSWER", tip: "Pro tip: speed is worth more than perfection.", help: "Solve the equation before the timer empties. Use number keys or tap an answer." },
    { id: "word", number: "04", title: "Word Blitz", desc: "Type before it slips", category: "brain", tag: "BRAIN / 04", objective: "OBJECTIVE: TYPE THE WORD", tip: "Pro tip: short words build a combo fast.", help: "Type the word on screen, then press Enter. Every round gets a little quicker." },
    { id: "memory", number: "05", title: "Memory Grid", desc: "Find the matching pixels", category: "brain", tag: "BRAIN / 05", objective: "OBJECTIVE: MATCH ALL PAIRS", tip: "Pro tip: say the colors out loud in your head.", help: "Flip two tiles at a time and match the pairs. Click or use the number keys." },
    { id: "reflex", number: "06", title: "Reflex Rush", desc: "See it. Hit it. Repeat.", category: "skill", tag: "SKILL / 06", objective: "OBJECTIVE: HIT THE TARGET", tip: "Pro tip: the target telegraphs its next move.", help: "Click the lit target as fast as you can. The board gets busier every hit." },
    { id: "color", number: "07", title: "Color Code", desc: "Read the signal, not the word", category: "brain", tag: "BRAIN / 07", objective: "OBJECTIVE: MATCH THE INK", tip: "Pro tip: trust the color, ignore the word.", help: "Choose the button matching the ink color, not the word printed on it." },
    { id: "orbit", number: "08", title: "Orbit Dodger", desc: "Dodge pixels, collect stars", category: "skill", tag: "SKILL / 08", objective: "OBJECTIVE: SURVIVE 30 SEC", tip: "Pro tip: the edges are dangerous too.", help: "Move the ship with left and right. Collect stars and dodge the red pixels." },
    { id: "neon", number: "09", title: "Neon Run", desc: "Switch lanes, chase the glow", category: "skill", tag: "SKILL / 09", objective: "OBJECTIVE: OUTRUN THE GLITCH", tip: "Pro tip: glance ahead, then move early.", help: "Switch lanes to dodge glitch blocks and collect the cyan energy bursts. Left and right to move." },
    { id: "pixel-pong", number: "11", title: "Pixel Pong", desc: "Keep the spark alive", category: "arcade", tag: "ARCADE / 11", objective: "OBJECTIVE: HIT THE SPARK", tip: "Pro tip: rhythm beats panic.", help: "Click the moving spark to keep your combo alive and build a high score." },
    { id: "rocket-recall", number: "12", title: "Rocket Recall", desc: "React to the launch signal", category: "skill", tag: "SKILL / 12", objective: "OBJECTIVE: HIT THE SIGNAL", tip: "Pro tip: watch the center.", help: "Click the launch signal as it flashes around the screen." },
    { id: "word-worm", number: "13", title: "Word Worm", desc: "Catch the glowing letter", category: "brain", tag: "BRAIN / 13", objective: "OBJECTIVE: CATCH LETTERS", tip: "Pro tip: eyes first, hands second.", help: "Tap each glowing letter before the timer runs out." },
    { id: "color-catch", number: "15", title: "Color Catch", desc: "Catch the color pulse", category: "skill", tag: "SKILL / 15", objective: "OBJECTIVE: CATCH THE PULSE", tip: "Pro tip: bright means go.", help: "Click the bright color pulse as it appears." },
    { id: "star-stack", number: "16", title: "Star Stack", desc: "Collect the falling star", category: "arcade", tag: "ARCADE / 16", objective: "OBJECTIVE: CATCH STARS", tip: "Pro tip: stars never wait.", help: "Tap the falling star to stack points before it disappears." },
    { id: "circuit-switch", number: "17", title: "Circuit Switch", desc: "Light the right node", category: "brain", tag: "BRAIN / 17", objective: "OBJECTIVE: LIGHT THE NODE", tip: "Pro tip: patterns repeat.", help: "Click the live node as it switches around the circuit." },
    { id: "beat-tap", number: "18", title: "Beat Tap", desc: "Tap into the rhythm", category: "skill", tag: "SKILL / 18", objective: "OBJECTIVE: KEEP THE BEAT", tip: "Pro tip: find your tempo.", help: "Click the pulse in time and keep the beat going." },
    { id: "maze-flip", number: "19", title: "Maze Flip", desc: "Find the exit signal", category: "arcade", tag: "ARCADE / 19", objective: "OBJECTIVE: FIND THE EXIT", tip: "Pro tip: the path moves.", help: "Tap the exit signal before the maze flips again." },
    { id: "jelly-jump", number: "20", title: "Jelly Jump", desc: "Bounce over blocks, grab bubbles", category: "skill", tag: "SKILL / 20", objective: "OBJECTIVE: JUMP THE GLITCH", tip: "Pro tip: jump early, land happy.", help: "Press Up, Space, or the A button to jump over glitch blocks and collect bubbles." },
    { id: "sum-sprint", number: "21", title: "Sum Sprint", desc: "Catch the answer tile", category: "brain", tag: "BRAIN / 21", objective: "OBJECTIVE: CATCH THE SUM", tip: "Pro tip: quick math wins.", help: "Click the glowing answer tile before it moves away." },
    { id: "laser-lane", number: "22", title: "Laser Lane", desc: "Hit the open lane", category: "skill", tag: "SKILL / 22", objective: "OBJECTIVE: FIND OPEN SPACE", tip: "Pro tip: scan, then strike.", help: "Click the open lane as the laser grid shifts." },
    { id: "memory-rush", number: "23", title: "Memory Rush", desc: "Remember the flash", category: "brain", tag: "BRAIN / 23", objective: "OBJECTIVE: CATCH THE FLASH", tip: "Pro tip: focus on the glow.", help: "Click the tile that flashes bright before the next flash begins." },
    { id: "block-balance", number: "24", title: "Block Balance", desc: "Tap the stable block", category: "arcade", tag: "ARCADE / 24", objective: "OBJECTIVE: SAVE THE STACK", tip: "Pro tip: center is safety.", help: "Click the stable block to keep the tower balanced." },
    { id: "orbit-match", number: "25", title: "Orbit Match", desc: "Catch the matching planet", category: "skill", tag: "SKILL / 25", objective: "OBJECTIVE: CATCH THE ORBIT", tip: "Pro tip: follow the ring.", help: "Click the bright planet as it crosses your orbit." },
    { id: "bubble-burst", number: "27", title: "Bubble Burst", desc: "Pop the electric bubble", category: "arcade", tag: "ARCADE / 27", objective: "OBJECTIVE: POP THE BUBBLE", tip: "Pro tip: pop before it drifts.", help: "Pop the electric bubble before it floats off screen." },
    { id: "code-cracker", number: "28", title: "Code Cracker", desc: "Find the live code", category: "brain", tag: "BRAIN / 28", objective: "OBJECTIVE: CRACK THE CODE", tip: "Pro tip: the signal is honest.", help: "Click the live code marker as it appears in the grid." },
    { id: "switchback", number: "34", title: "Switchback", desc: "React to the lane flip", category: "skill", tag: "SKILL / 34", objective: "OBJECTIVE: FLIP THE SIGNAL", tip: "Pro tip: look for the edge.", help: "Click the signal when it flips to a new lane." },
    { id: "dot-collector", number: "36", title: "Dot Collector", desc: "Gather the glowing dot", category: "arcade", tag: "ARCADE / 36", objective: "OBJECTIVE: COLLECT THE DOT", tip: "Pro tip: keep moving your eyes.", help: "Click the glowing dot to keep your collection alive." },
    { id: "signal-scan", number: "37", title: "Signal Scan", desc: "Detect metal, dig up treasures", category: "skill", tag: "SKILL / 37", objective: "OBJECTIVE: UNEARTH ALL 21 ITEMS", tip: "Pro tip: dig when the signal is strongest.", help: "Sweep the metal detector over the box. Follow the stronger signal and faster beeps, then click to dig. Find all 21 buried items." },
    { id: "last-light", number: "49", title: "Last Light", desc: "Save the final glow", category: "arcade", tag: "ARCADE / 49", objective: "OBJECTIVE: SAVE THE LIGHT", tip: "Pro tip: the last one is fastest.", help: "Click the final glow and make the last light count." }
  ];

  games.forEach((game, index) => { game.number = String(index + 1).padStart(2, "0"); game.tag = game.tag.replace(/\d+$/, game.number); });
  const cabinetCount = document.querySelector(".cabinet-count");
  if (cabinetCount) cabinetCount.textContent = `${games.length} / ${games.length}`;

  const microModes = {
    "pixel-pong": "timing", "rocket-recall": "fishing", "word-worm": "typing", "color-catch": "paint", "star-stack": "catch", "circuit-switch": "rewire", "beat-tap": "drum", "maze-flip": "navigate", "sum-sprint": "typing", "laser-lane": "dodge", "memory-rush": "sequence", "block-balance": "stack", "orbit-match": "orbit", "bubble-burst": "shooter", "code-cracker": "sort", "switchback": "balance", "dot-collector": "gravity", "signal-scan": "scanner", "last-light": "defender"
  };

  const shopItems = [
    { id: "token-magnet", icon: "✦", name: "Token Magnet", price: 150, desc: "A shiny welcome for every round.", effect: "magnet" },
    { id: "turbo-laces", icon: "➜", name: "Turbo Laces", price: 200, desc: "Look fast even when you miss.", effect: "turbo" },
    { id: "sunset-cabinet", icon: "☼", name: "Sunset Cabinet", price: 250, desc: "Turn the cabinet coral and gold.", effect: "sunset" },
    { id: "scanline-skin", icon: "▤", name: "Scanline Skin", price: 300, desc: "Classic CRT texture unlocked.", effect: "scanline" },
    { id: "pixel-crown", icon: "♛", name: "Pixel Crown", price: 350, desc: "Put a tiny crown on your badge.", effect: "crown" },
    { id: "cherry-buttons", icon: "●", name: "Cherry Buttons", price: 400, desc: "Make the action buttons pop.", effect: "cherry" },
    { id: "chrome-cabinet", icon: "◇", name: "Chrome Cabinet", price: 450, desc: "Give the cabinet an electric trim.", effect: "chrome" },
    { id: "lucky-star", icon: "★", name: "Lucky Star", price: 500, desc: "A little extra shine by your name.", effect: "lucky" },
    { id: "bubble-text", icon: "○", name: "Bubble Text", price: 550, desc: "Round out the arcade attitude.", effect: "bubble" },
    { id: "hyper-grid", icon: "#", name: "Hyper Grid", price: 600, desc: "Make the playfield lines brighter.", effect: "grid" },
    { id: "midnight-mode", icon: "☾", name: "Midnight Mode", price: 650, desc: "A deeper backdrop for late runs.", effect: "midnight" },
    { id: "mint-mode", icon: "+", name: "Mint Mode", price: 700, desc: "Swap the power colors for mint.", effect: "mint" },
    { id: "coral-mode", icon: "◆", name: "Coral Mode", price: 750, desc: "Make the warm colors do the talking.", effect: "coral" },
    { id: "rainbow-spark", icon: "✺", name: "Rainbow Spark", price: 800, desc: "Bring a festival glow to the floor.", effect: "spark" },
    { id: "extra-heart", icon: "♥", name: "Extra Heart", price: 850, desc: "A little more courage for Maze Munch.", effect: "heart" },
    { id: "boss-badge", icon: "B", name: "Boss Badge", price: 900, desc: "Let the scoreboard know you mean it.", effect: "boss" },
    { id: "gold-label", icon: "G", name: "Gold Label", price: 1000, desc: "Add a gold edge to the marquee.", effect: "gold" },
    { id: "combo-counter", icon: "×", name: "Combo Counter", price: 1100, desc: "Make every streak feel official.", effect: "combo" },
    { id: "player-two", icon: "2P", name: "Player Two", price: 1250, desc: "Unlock a second-player signal.", effect: "p2" },
    { id: "side-quest", icon: "?", name: "Side Quest", price: 1600, desc: "Give every cabinet a bonus mission.", effect: "sidequest" },
    { id: "moon-boots", icon: "∿", name: "Moon Boots", price: 1700, desc: "Float into your next high score.", effect: "moon" },
    { id: "prism-visor", icon: "◈", name: "Prism Visor", price: 1800, desc: "See the whole arcade in color.", effect: "prism" },
    { id: "blossom-trail", icon: "✿", name: "Blossom Trail", price: 1900, desc: "Leave petals behind every play.", effect: "blossom" },
    { id: "arcade-jacket", icon: "J", name: "Arcade Jacket", price: 2000, desc: "Dress like the floor is yours.", effect: "jacket" },
    { id: "glitch-goggles", icon: "◎", name: "Glitch Goggles", price: 2100, desc: "Make weird look intentional.", effect: "goggles" },
    { id: "comet-decal", icon: "☄", name: "Comet Decal", price: 2250, desc: "Add a streak to the cabinet art.", effect: "comet" },
    { id: "power-up-patch", icon: "P", name: "Power-Up Patch", price: 2400, desc: "A badge for your favorite button.", effect: "patch" },
    { id: "high-score-frame", icon: "▣", name: "High Score Frame", price: 2550, desc: "Put your best runs on display.", effect: "frame" },
    { id: "rainbow-keys", icon: "⌘", name: "Rainbow Keys", price: 2700, desc: "Every control gets a little color.", effect: "keys" },
    { id: "pixel-petals", icon: "❀", name: "Pixel Petals", price: 2850, desc: "More blossom energy for the floor.", effect: "petals" },
    { id: "boss-music", icon: "♫", name: "Boss Music", price: 3000, desc: "Make every start feel legendary.", effect: "music" },
    { id: "lucky-lanes", icon: "⇄", name: "Lucky Lanes", price: 3200, desc: "A little luck for every dodge.", effect: "lanes" },
    { id: "crystal-screen", icon: "◇", name: "Crystal Screen", price: 3400, desc: "Make the playfield sparkle.", effect: "crystal" },
    { id: "starfield-skin", icon: "✦", name: "Starfield Skin", price: 3600, desc: "Take your cabinet into orbit.", effect: "starfield" },
    { id: "cherry-crown", icon: "♔", name: "Cherry Crown", price: 3800, desc: "A blossom-season upgrade.", effect: "cherrycrown" },
    { id: "neon-hoodie", icon: "N", name: "Neon Hoodie", price: 4000, desc: "Keep the glow close.", effect: "hoodie" },
    { id: "extra-continue", icon: "↻", name: "Extra Continue", price: 4200, desc: "One more try for the road.", effect: "continue" },
    { id: "turbo-timer", icon: "T", name: "Turbo Timer", price: 4400, desc: "Make every second count twice.", effect: "timer" },
    { id: "legend-tag", icon: "L", name: "Legend Tag", price: 4600, desc: "A title for the truly committed.", effect: "legend" },
    { id: "firefly-trail", icon: "·", name: "Firefly Trail", price: 4800, desc: "Add tiny lights to your route.", effect: "firefly" },
    { id: "galaxy-token", icon: "●", name: "Galaxy Token", price: 5000, desc: "A rare coin for a rare run.", effect: "galaxy" },
    { id: "arcade-aura", icon: "◌", name: "Arcade Aura", price: 5200, desc: "Bring the room's energy with you.", effect: "aura" },
    { id: "golden-joystick", icon: "Y", name: "Golden Joystick", price: 5400, desc: "The fanciest control on the floor.", effect: "joystick" },
    { id: "pink-power", icon: "P", name: "Pink Power", price: 5600, desc: "Turn every win a little sweeter.", effect: "pinkpower" },
    { id: "secret-stage", icon: "!", name: "Secret Stage", price: 5800, desc: "Unlock the mysterious cabinet sign.", effect: "secret" },
    { id: "champion-plate", icon: "C", name: "Champion Plate", price: 6000, desc: "A plaque for your pixel legacy.", effect: "champion" },
    { id: "cloud-save", icon: "⌁", name: "Cloud Save", price: 6200, desc: "Keep your progress feeling weightless.", effect: "cloud" },
    { id: "score-fireworks", icon: "✺", name: "Score Fireworks", price: 6500, desc: "Celebrate every personal best.", effect: "fireworks" },
    { id: "master-key", icon: "K", name: "Master Key", price: 7000, desc: "The final key to the arcade.", effect: "master" },
    { id: "pixel-vip", icon: "VIP", name: "Pixel VIP", price: 0, desc: "Includes every other shop item at once.", effect: "vip" }
  ];

  const vipBundlePrice = shopItems.filter((item) => item.id !== "pixel-vip").reduce((total, item) => total + item.price, 0);
  shopItems.find((item) => item.id === "pixel-vip").price = vipBundlePrice;
  shopItems.forEach((item) => { const power = window.ArcadePowerCatalog[item.effect]; item.desc = power.desc; item.boost = power.boost; item.group = power.group; if (power.name) item.name = power.name; });

  let currentGame = null;
  let ownerVerified = false;
  localStorage.removeItem("pixelPlayOwnerVerified");
  let points = Number(localStorage.getItem("pixelPlayPoints") || 0);
  let ownedShopItems = JSON.parse(localStorage.getItem("pixelPlayShopItems") || "[]");
  if (ownedShopItems.includes("pixel-vip")) { ownedShopItems = shopItems.map((item) => item.id); localStorage.setItem("pixelPlayShopItems", JSON.stringify(ownedShopItems)); }
  let equippedShopItems = JSON.parse(localStorage.getItem("pixelPlayEquippedItems") || "null") || [...ownedShopItems];
  equippedShopItems = equippedShopItems.filter((id) => ownedShopItems.includes(id));
  const equippedThemes = equippedShopItems.filter((id) => shopItems.find((item) => item.id === id)?.group === "theme");
  equippedShopItems = equippedShopItems.filter((id) => !equippedThemes.includes(id) || id === equippedThemes[equippedThemes.length - 1]);
  let gameRunning = false;
  let paused = false;
  let animationId = 0;
  let lastTime = 0;
  let score = 0;
  let gamesPlayed = Number(localStorage.getItem("pixelPlayGames") || 0);
  let bestScore = Number(localStorage.getItem("pixelPlayBest") || 0);
  let soundOn = false;
  let state = {};
  let audioContext;

  if (gamesPlayedLabel) gamesPlayedLabel.textContent = gamesPlayed;
  if (bestScoreLabel) bestScoreLabel.textContent = bestScore;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const choose = (items) => items[Math.floor(Math.random() * items.length)];
  const padScore = (n) => String(Math.max(0, Math.floor(n))).padStart(6, "0");
  const roundRect = (x, y, w, h, r, fill, stroke) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); } };
  function hasShopEffect(effect) { const item = shopItems.find((entry) => entry.effect === effect); return Boolean(item && equippedShopItems.includes(item.id)); }
  function roundReward() { return (50 * (hasShopEffect("magnet") ? 3 : 1) + (hasShopEffect("galaxy") ? 500 : 0)) * (hasShopEffect("vip") ? 2 : 1); }
  function earnPoints(amount) { addPoints(amount * (hasShopEffect("pinkpower") ? 2 : 1)); }
  const powers = window.createArcadePowers({ ctx, width: W, height: H, has: hasShopEffect,
    getState: () => state, getGame: () => currentGame, getScore: () => score,
    getRecord: () => bestScore, getPlayed: () => gamesPlayed, getTheme: () => document.body.dataset.arcadeTheme,
    isRunning: () => gameRunning, isPaused: () => paused, isOwner: () => ownerVerified, gainScore: (amount) => setScore(score + amount),
    earnPoints, tone, blockCollides: (...args) => collides(...args), resumeRound: () => {
      gameRunning = true; paused = false; pauseBadge.hidden = true; startOverlay.classList.add("is-hidden");
      document.getElementById("bonusStageButton").hidden = true; lastTime = performance.now();
      canvas.focus({ preventScroll: true });
      cancelAnimationFrame(animationId); animationId = requestAnimationFrame(loop);
    }
  });

  function setScore(next) {
    const gain = next - score;
    score = Math.max(0, Math.floor(gain > 0 ? score + gain * powers.multiplier() : next));
    scoreLabel.textContent = padScore(score);
    if (score > bestScore) { bestScore = score; if (bestScoreLabel) bestScoreLabel.textContent = score; localStorage.setItem("pixelPlayBest", bestScore); }
    if (gain > 0) powers.onScore();
  }

  function setPoints(next) { points = Number.isFinite(next) ? Math.max(0, Math.floor(next)) : points; pointsLabel.textContent = ownerVerified ? "∞" : points.toLocaleString(); shopPointsLabel.textContent = ownerVerified ? "∞" : points.toLocaleString(); localStorage.setItem("pixelPlayPoints", points); }
  function addPoints(amount) { setPoints(points + amount); }
  function saveShopItems() { localStorage.setItem("pixelPlayShopItems", JSON.stringify(ownedShopItems)); localStorage.setItem("pixelPlayEquippedItems", JSON.stringify(equippedShopItems)); }
  function applyShopEffects() {
    shopItems.forEach((item) => document.body.classList.toggle(`shop-${item.effect}`, equippedShopItems.includes(item.id)));
    const theme = shopItems.find((item) => item.group === "theme" && equippedShopItems.includes(item.id));
    document.body.dataset.arcadeTheme = theme ? theme.effect : "default";
    const palette = { default: ["#08090c", "#ffd24d", "#ff6b57", "#5de3d0"], sunset: ["#240f20", "#ffbe64", "#ff6cac", "#ffce80"],
      midnight: ["#070a17", "#e3ecff", "#98b4ff", "#8fdedd"], mint: ["#072820", "#c7ff82", "#75f7bb", "#ffcc75"],
      coral: ["#2a0816", "#ffe063", "#ff5974", "#fff1f7"], prism: ["#171320", "#ffd35c", "#ff8ccb", "#6ff5cc"],
      jacket: ["#210d17", "#fff2d8", "#ff5b68", "#ffffff"], starfield: ["#070919", "#fce069", "#b994ff", "#78cfff"],
      hoodie: ["#041b22", "#75edff", "#ff80b4", "#9fffbb"], galaxy: ["#0f0920", "#fbe273", "#af95ff", "#68f9d7"] }[document.body.dataset.arcadeTheme];
    [colors.ink, colors.yellow, colors.coral, colors.cyan] = palette;
    ["--ink", "--yellow", "--coral", "--cyan"].forEach((property, index) => document.body.style.setProperty(property, palette[index]));
    vipBadge.hidden = !hasShopEffect("vip");
    document.querySelector(".shop-copy").textContent = `ROUND REWARD: ${roundReward() * (hasShopEffect("pinkpower") ? 2 : 1)} PTS. Owned powers can be equipped or switched off. Choose one world theme at a time.`;
    const active = shopItems.filter((item) => equippedShopItems.includes(item.id));
    document.getElementById("shopActiveEffects").textContent = active.length ? `${active.length} EQUIPPED  |  ${powers.multiplier()}X SCORE  |  ${active.filter((item) => item.group === "theme").map((item) => item.name.toUpperCase()).join("") || "CLASSIC WORLD"}` : "NO ACTIVE UPGRADES";
    powers.renderControls(); powers.refresh();
  }
  function renderShop() {
    document.getElementById("shopItems").innerHTML = shopItems.map((item) => {
      const owned = ownedShopItems.includes(item.id), equipped = equippedShopItems.includes(item.id);
      return `<button class="shop-item${owned ? " is-owned" : ""}${equipped ? " is-equipped" : ""}" type="button" data-shop-item="${item.id}" ${owned ? `aria-pressed="${equipped}"` : ""}><span class="shop-item-icon">${item.icon}</span><span><strong>${item.name}</strong><em>${item.boost}</em><small>${item.desc}</small></span><span class="shop-price">${owned ? equipped ? "ON" : "OFF" : `${item.price.toLocaleString()} PTS`}</span></button>`;
    }).join(""); shopPointsLabel.textContent = ownerVerified ? "∞" : points.toLocaleString();
  }
  let shopWasPaused = true;
  function openShop() { shopWasPaused = paused || !gameRunning; if (gameRunning && !paused) togglePause(); shopModal.hidden = false; renderShop(); document.getElementById("shopClose").focus(); }
  function closeShop() { shopModal.hidden = true; if (gameRunning && !shopWasPaused && paused) togglePause(); document.getElementById("shopToggle").focus(); }
  function equipItem(item) {
    if (item.group) equippedShopItems = equippedShopItems.filter((id) => shopItems.find((other) => other.id === id)?.group !== item.group);
    if (!equippedShopItems.includes(item.id)) equippedShopItems.push(item.id);
    powers.equipped(item.effect);
  }
  function buyShopItem(id) {
    const item = shopItems.find((entry) => entry.id === id); if (!item) return;
    if (ownedShopItems.includes(id)) {
      if (equippedShopItems.includes(id)) equippedShopItems = equippedShopItems.filter((entry) => entry !== id); else equipItem(item);
    } else {
      if (!ownerVerified && points < item.price) { shopStatus.textContent = `YOU NEED ${(item.price - points).toLocaleString()} MORE PTS FOR ${item.name.toUpperCase()}.`; tone(150, .1, "sawtooth"); return; }
      if (!ownerVerified) setPoints(points - item.price);
      if (id === "pixel-vip") { ownedShopItems = shopItems.map((entry) => entry.id); shopItems.forEach(equipItem); }
      else { ownedShopItems.push(id); equipItem(item); }
    }
    saveShopItems(); applyShopEffects(); renderShop(); drawCurrent();
    const equipped = equippedShopItems.includes(id);
    shopStatus.textContent = `${item.name.toUpperCase()} ${equipped ? `ON: ${item.desc}` : "SWITCHED OFF"}`;
    powers.toast(`${item.name.toUpperCase()} ${equipped ? item.boost : "OFF"}`);
    tone(650, .08);
  }

  function tone(freq = 440, duration = .06, type = "square") {
    if (!soundOn) return;
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type; oscillator.frequency.value = freq; gain.gain.setValueAtTime(.035, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
    oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + duration);
  }

  function drawBase(title, subtitle = "") {
    ctx.fillStyle = colors.ink; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(93,227,208,.07)"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.font = "10px Courier New"; ctx.fillStyle = colors.dim; ctx.fillText(title, 18, 22); if (subtitle) { ctx.textAlign = "right"; ctx.fillText(subtitle, W - 18, 22); ctx.textAlign = "left"; }
  }

  function drawOverlayMessage(title, message) {
    ctx.fillStyle = "rgba(8,9,12,.82)"; ctx.fillRect(0, 0, W, H); ctx.textAlign = "center"; ctx.fillStyle = colors.yellow; ctx.font = "bold 28px Courier New"; ctx.fillText(title, W / 2, H / 2 - 16); ctx.fillStyle = colors.paper; ctx.font = "12px Courier New"; ctx.fillText(message, W / 2, H / 2 + 14); ctx.textAlign = "left";
  }

  function showOverlay(game, title = game.title, message = game.help) {
    overlayTitle.textContent = title.toUpperCase(); overlayText.textContent = message; startButton.innerHTML = `<span>▶</span> ${gameRunning ? "PLAY AGAIN" : "START GAME"}`; startOverlay.classList.remove("is-hidden");
  }

  function endGame(message = "NICE RUN. HIT PLAY AGAIN TO GO AGAIN.") {
    if (!gameRunning) return;
    const crash = /CAUGHT|SPLAT|LOST|BASE HIT|TIPPED|TOPPED|WOBBLED|GHOSTS WIN/.test(message);
    if (crash && powers.revive()) return;
    powers.finish();
    gameRunning = false; paused = false; pauseBadge.hidden = true; cancelAnimationFrame(animationId); drawCurrent(); drawOverlayMessage("ROUND COMPLETE", message); const game = games.find((item) => item.id === currentGame); showOverlay(game, "Round complete", message); gamesPlayed += 1; if (gamesPlayedLabel) gamesPlayedLabel.textContent = gamesPlayed; localStorage.setItem("pixelPlayGames", gamesPlayed); tone(220, .13); setTimeout(() => tone(330, .16), 90);
    document.getElementById("bonusStageButton").hidden = !powers.canBonus();
    powers.refresh();
  }

  function beginGame() {
    gameRunning = true; paused = false; pauseBadge.hidden = true; startOverlay.classList.add("is-hidden"); document.getElementById("bonusStageButton").hidden = true;
    state = {}; setScore(0); initializeGame(currentGame); powers.reset(); earnPoints(roundReward());
    canvas.focus({ preventScroll: true });
    lastTime = performance.now(); cancelAnimationFrame(animationId); animationId = requestAnimationFrame(loop); tone(520, .08);
  }
function resetProgress() { if (!window.confirm("Reset all points, shop items, high scores, and arcade progress?")) return; cancelAnimationFrame(animationId); gameRunning = false; paused = false; pauseBadge.hidden = true; ["pixelPlayPoints", "pixelPlayShopItems", "pixelPlayEquippedItems", "pixelPlayBest", "pixelPlayGames", "pixelPlayOwnerVerified"].forEach((key) => localStorage.removeItem(key)); points = 0; bestScore = 0; gamesPlayed = 0; ownedShopItems = []; equippedShopItems = []; ownerVerified = false; document.body.classList.remove("is-owner"); document.getElementById("ownerButton").textContent = "OWNER"; setPoints(0); if (bestScoreLabel) bestScoreLabel.textContent = "0"; if (gamesPlayedLabel) gamesPlayedLabel.textContent = "0"; setScore(0); powers.reset(); applyShopEffects(); renderShop(); shopStatus.textContent = "ARCADE PROGRESS RESET. READY WHEN YOU ARE."; initializeGame(currentGame); drawCurrent(); showOverlay(games.find((item) => item.id === currentGame)); document.getElementById("bonusStageButton").hidden = true; tone(260, .08); }

  function loop(time) {
    if (!gameRunning) return; const dt = Math.min(50, time - lastTime); lastTime = time;
    if (!paused) {
      powers.update(dt);
      if (powers.isBonus()) { if (powers.bonusFinished()) endGame("BONUS STAGE COMPLETE. YOUR TOKENS ARE SAVED."); }
      else updateGame(dt * powers.motion());
      drawCurrent();
    }
    if (gameRunning) animationId = requestAnimationFrame(loop);
  }

  function initializeGame(id) {
    if (id === "maze") initMaze(); if (id === "blocks") initBlocks(); if (id === "math") initMath(); if (id === "word") initWord(); if (id === "memory") initMemory(); if (id === "reflex") initReflex(); if (id === "color") initColor(); if (id === "orbit") initOrbit(); if (id === "neon") initNeon(); if (id === "jelly-jump") initJelly(); if (!["maze", "blocks", "math", "word", "memory", "reflex", "color", "orbit", "neon", "jelly-jump"].includes(id)) initMicro();
  }
  function updateGame(dt) {
    if ((ownerVerified || hasShopEffect("timer")) && Number.isFinite(state.time)) state.time += dt * 2 / 3;
    if (currentGame === "maze") updateMaze(dt); if (currentGame === "blocks") updateBlocks(dt); if (currentGame === "math") updateMath(dt); if (currentGame === "word") updateWord(dt); if (currentGame === "memory") updateMemory(dt); if (currentGame === "reflex") updateReflex(dt); if (currentGame === "color") updateColor(dt); if (currentGame === "orbit") updateOrbit(dt); if (currentGame === "neon") updateNeon(dt); if (currentGame === "jelly-jump") updateJelly(dt); if (state.mode === "micro") updateMicro(dt);
  }
  function drawCurrent() {
    ctx.save(); ctx.setLineDash([]); ctx.lineWidth = 1; ctx.globalAlpha = 1; ctx.textAlign = "left";
    if (powers.isBonus()) { drawBase("SECRET BONUS STAGE", "GOLD RUSH"); powers.draw(); ctx.restore(); return; }
    if (currentGame === "maze") drawMaze(); if (currentGame === "blocks") drawBlocks(); if (currentGame === "math") drawMath(); if (currentGame === "word") drawWord(); if (currentGame === "memory") drawMemory(); if (currentGame === "reflex") drawReflex(); if (currentGame === "color") drawColor(); if (currentGame === "orbit") drawOrbit(); if (currentGame === "neon") drawNeon(); if (currentGame === "jelly-jump") drawJelly(); if (state.mode === "micro") drawMicro();
    powers.drawHints(); powers.draw(); ctx.restore();
  }

  // Maze Munch: a compact grid chaser with a deliberately forgiving collision model.
  const mazeMap = ["####################", "#........##........#", "#.####.#.##.#.####.#", "#.#....#....#....#.#", "#.#.##.######.##.#.#", "#..................#", "#.###.###..###.###.#", "#.....#......#.....#", "#####.#.####.#.#####", "#.....#..##..#.....#", "#.###.###..###.###.#", "#..................#", "#.#.##.######.##.#.#", "#.#....#....#....#.#", "#.####.#.##.#.####.#", "#........##........#", "####################"];
  function initMaze() { state = { map: mazeMap.map((row) => row.split("")), cols: 20, rows: 17, cell: 20, player: { x: 1, y: 1, dir: { x: 1, y: 0 }, next: { x: 1, y: 0 } }, ghosts: [{ x: 18, y: 1, color: colors.coral, dir: { x: -1, y: 0 } }, { x: 18, y: 15, color: colors.pink, dir: { x: 0, y: -1 } }], dots: [], lives: hasShopEffect("heart") ? 9 : 3, tick: 0, moveTimer: 0 }; for (let y = 0; y < state.rows; y++) for (let x = 0; x < state.cols; x++) if (state.map[y][x] === ".") state.dots.push(`${x},${y}`); livesLabel.textContent = `${state.lives} LIVES`; }
  function mazeOpen(x, y) { return state.map[y]?.[x] !== "#"; }
  function moveMazeActor(actor, dir) { const nx = actor.x + dir.x; const ny = actor.y + dir.y; if (mazeOpen(nx, ny)) { actor.x = nx; actor.y = ny; actor.dir = dir; return true; } return false; }
  function updateMaze(dt) {
    state.moveTimer += dt / powers.motion() * powers.movement(); state.tick += dt;
    const p = state.player;
    if (state.moveTimer >= 220) {
      state.moveTimer -= 220; if (!moveMazeActor(p, p.next)) moveMazeActor(p, p.dir);
      const index = state.dots.indexOf(`${p.x},${p.y}`);
      if (index >= 0) { state.dots.splice(index, 1); setScore(score + ((p.x === 1 || p.x === 18) && (p.y === 1 || p.y === 15) ? 20 : 10)); tone(620, .035); }
    }
    if (state.tick >= 220) {
      state.tick -= 220;
      state.ghosts.forEach((ghost) => {
        const options = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }].filter((dir) => mazeOpen(ghost.x + dir.x, ghost.y + dir.y));
        const toward = [...options].sort((a, b) => Math.abs(ghost.x + a.x - p.x) + Math.abs(ghost.y + a.y - p.y) - Math.abs(ghost.x + b.x - p.x) - Math.abs(ghost.y + b.y - p.y));
        ghost.dir = Math.random() < .7 ? toward[0] : choose(options); moveMazeActor(ghost, ghost.dir);
      });
    }
    state.ghosts.forEach((ghost) => {
      if (ghost.x !== p.x || ghost.y !== p.y) return;
      if (powers.protect()) { ghost.x = 18; ghost.y = 15; return; }
      state.lives--; livesLabel.textContent = `${Math.max(0, state.lives)} LIVES`; tone(120, .2, "sawtooth");
      if (state.lives <= 0) endGame(`FINAL SCORE ${padScore(score)}. THE GHOSTS WIN THIS ROUND.`);
      else { p.x = 1; p.y = 1; }
    });
    if (!state.dots.length) endGame(`GRID CLEARED. YOU SCORED ${padScore(score)}.`);
  }
  function drawMaze() { drawBase("MAZE MUNCH", `${state.dots?.length || 0} DOTS LEFT`); if (!state.map) return; const ox = (W - state.cols * state.cell) / 2; const oy = (H - state.rows * state.cell) / 2 + 8; state.map.forEach((row, y) => row.forEach((cell, x) => { if (cell === "#") { ctx.fillStyle = "#182331"; ctx.fillRect(ox + x * state.cell + 1, oy + y * state.cell + 1, state.cell - 2, state.cell - 2); ctx.strokeStyle = "rgba(93,227,208,.28)"; ctx.strokeRect(ox + x * state.cell + 3, oy + y * state.cell + 3, state.cell - 6, state.cell - 6); } })); ctx.fillStyle = colors.yellow; state.dots.forEach((dot) => { const [x, y] = dot.split(",").map(Number); ctx.fillRect(ox + x * state.cell + 8, oy + y * state.cell + 8, 4, 4); }); const p = state.player; ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(ox + p.x * state.cell + 10, oy + p.y * state.cell + 10, 7, 0.25, Math.PI * 2 - .25); ctx.lineTo(ox + p.x * state.cell + 10, oy + p.y * state.cell + 10); ctx.fill(); state.ghosts?.forEach((g) => { ctx.fillStyle = g.color; ctx.beginPath(); ctx.arc(ox + g.x * state.cell + 10, oy + g.y * state.cell + 9, 7, Math.PI, 0); ctx.lineTo(ox + g.x * state.cell + 17, oy + g.y * state.cell + 17); ctx.lineTo(ox + g.x * state.cell + 13, oy + g.y * state.cell + 14); ctx.lineTo(ox + g.x * state.cell + 9, oy + g.y * state.cell + 17); ctx.lineTo(ox + g.x * state.cell + 5, oy + g.y * state.cell + 14); ctx.lineTo(ox + g.x * state.cell + 3, oy + g.y * state.cell + 17); ctx.closePath(); ctx.fill(); ctx.fillStyle = colors.paper; ctx.fillRect(ox + g.x * state.cell + 6, oy + g.y * state.cell + 7, 3, 3); ctx.fillRect(ox + g.x * state.cell + 12, oy + g.y * state.cell + 7, 3, 3); }); }

  // Block Party: a clean falling-block stacker with seven familiar piece shapes.
  const tetrominoes = [{ shape: [[1, 1, 1, 1]], color: colors.cyan }, { shape: [[1, 1], [1, 1]], color: colors.yellow }, { shape: [[0, 1, 0], [1, 1, 1]], color: colors.pink }, { shape: [[1, 0, 0], [1, 1, 1]], color: colors.coral }, { shape: [[0, 0, 1], [1, 1, 1]], color: colors.blue }, { shape: [[0, 1, 1], [1, 1, 0]], color: colors.green }];
  function initBlocks() { state = { cols: 10, rows: 18, cell: 19, board: Array.from({ length: 18 }, () => Array(10).fill(null)), piece: null, drop: 0, speed: 550, lines: 0 }; spawnBlock(); livesLabel.textContent = "LEVEL 01"; }
  function spawnBlock() { const source = choose(tetrominoes); state.piece = { shape: source.shape.map((row) => [...row]), color: source.color, x: 3, y: 0 }; if (collides(state.piece)) { if (powers.protect()) state.board = Array.from({ length: state.rows }, () => Array(state.cols).fill(null)); else endGame(`STACK TOPPED OUT. ${state.lines} LINES CLEARED.`); } }
  function collides(piece, dx = 0, dy = 0, shape = piece.shape) { return shape.some((row, y) => row.some((value, x) => value && (piece.x + x + dx < 0 || piece.x + x + dx >= state.cols || piece.y + y + dy >= state.rows || (state.board[piece.y + y + dy] && state.board[piece.y + y + dy][piece.x + x + dx])))); }
  function rotatePiece() { const old = state.piece.shape; const rotated = old[0].map((_, index) => old.map((row) => row[index]).reverse()); if (!collides(state.piece, 0, 0, rotated)) state.piece.shape = rotated; }
  function lockPiece() { state.piece.shape.forEach((row, y) => row.forEach((value, x) => { if (value) state.board[state.piece.y + y][state.piece.x + x] = state.piece.color; })); let cleared = 0; state.board = state.board.filter((row) => { if (row.every(Boolean)) { cleared++; return false; } return true; }); while (state.board.length < state.rows) state.board.unshift(Array(state.cols).fill(null)); if (cleared) { state.lines += cleared; setScore(score + [0, 100, 300, 600, 1000][cleared]); state.speed = Math.max(120, 550 - state.lines * 18); tone(300 + cleared * 120, .12); } spawnBlock(); }
  function updateBlocks(dt) { state.drop += dt; if (state.drop > state.speed) { state.drop = 0; if (!collides(state.piece, 0, 1)) state.piece.y++; else lockPiece(); } }
  function drawBlocks() { drawBase("BLOCK PARTY", `${state.lines || 0} LINES`); const cell = state.cell; const ox = (W - state.cols * cell) / 2; const oy = 34; ctx.strokeStyle = "rgba(93,227,208,.14)"; for (let y = 0; y < state.rows; y++) for (let x = 0; x < state.cols; x++) { ctx.strokeRect(ox + x * cell, oy + y * cell, cell, cell); const value = state.board?.[y]?.[x]; if (value) drawBlockCell(ox + x * cell, oy + y * cell, cell, value); } if (state.piece) state.piece.shape.forEach((row, y) => row.forEach((value, x) => value && drawBlockCell(ox + (state.piece.x + x) * cell, oy + (state.piece.y + y) * cell, cell, state.piece.color))); }
  function drawBlockCell(x, y, cell, color) { ctx.fillStyle = color; ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4); ctx.fillStyle = "rgba(255,255,255,.27)"; ctx.fillRect(x + 4, y + 4, cell - 9, 3); ctx.fillStyle = "rgba(8,9,12,.2)"; ctx.fillRect(x + 4, y + cell - 7, cell - 8, 3); }

  // The remaining cabinets are bite-sized learning loops.
  function initMath() { state = { question: null, options: [], time: 7000, total: 0, streak: 0 }; nextMath(); }
  function nextMath() { const op = choose(["+", "−", "×"]); const a = random(2, 14); const b = random(2, 12); const answer = op === "+" ? a + b : op === "−" ? a - b : a * b; state.question = { text: `${a} ${op} ${b} = ?`, answer }; state.options = [answer, answer + random(1, 4), answer - random(1, 4), answer + random(-7, 7)].filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 4); while (state.options.length < 4) state.options.push(answer + state.options.length + 2); state.options.sort(() => Math.random() - .5); state.time = 7000; }
  function updateMath(dt) { state.time -= dt; if (state.time <= 0) { state.streak = 0; nextMath(); tone(130, .12, "sawtooth"); } }
  function drawMath() { drawBase("NUMBER POP", `STREAK ${state.streak || 0}`); ctx.textAlign = "center"; ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("SOLVE THE SIGNAL", W / 2, 84); ctx.fillStyle = colors.yellow; ctx.font = "bold 47px Courier New"; ctx.fillText(state.question?.text || "", W / 2, 152); ctx.fillStyle = colors.coral; ctx.fillRect(130, 184, (W - 260) * clamp(state.time / 7000, 0, 1), 4); state.options?.forEach((option, i) => { const x = 90 + i * 120; roundRect(x, 228, 94, 55, 2, i === state.focus ? colors.cyan : colors.panel, colors.cyan); ctx.fillStyle = i === state.focus ? colors.ink : colors.paper; ctx.font = "bold 22px Courier New"; ctx.fillText(`${i + 1}: ${option}`, x + 47, 262); }); ctx.textAlign = "left"; }
  function answerMath(index) { if (!state.options || index < 0 || index > 3) return; if (state.options[index] === state.question.answer) { state.streak++; setScore(score + 100 + state.streak * 10); tone(700 + state.streak * 30, .06); } else { state.streak = 0; tone(160, .1, "sawtooth"); } nextMath(); }

  const wordBank = ["SPARK", "PIXEL", "JUMP", "LEARN", "COMBO", "LASER", "QUEST", "SCORE", "BRAIN", "LEVEL", "FOCUS", "SWITCH"];
  function initWord() { state = { word: choose(wordBank), typed: "", time: 7000, streak: 0 }; }
  function updateWord(dt) { state.time -= dt; if (state.time <= 0) { state.word = choose(wordBank); state.typed = ""; state.time = Math.max(3500, 7000 - state.streak * 220); state.streak = 0; } }
  function drawWord() { drawBase("WORD BLITZ", `COMBO ${state.streak || 0}`); ctx.textAlign = "center"; ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("TYPE THIS WORD + ENTER", W / 2, 88); ctx.fillStyle = colors.yellow; ctx.font = "bold 50px Courier New"; ctx.fillText(state.word || "", W / 2, 158); roundRect(150, 195, 340, 54, 2, colors.panel, colors.cyan); ctx.fillStyle = colors.cyan; ctx.font = "bold 22px Courier New"; ctx.fillText(state.typed || "_", W / 2, 230); ctx.fillStyle = colors.coral; ctx.fillRect(150, 272, 340 * clamp(state.time / 7000, 0, 1), 4); ctx.fillStyle = colors.dim; ctx.font = "10px Courier New"; ctx.fillText("TYPE ON YOUR KEYBOARD", W / 2, 310); ctx.textAlign = "left"; }
  function submitWord() { if (state.typed.toUpperCase() === state.word) { state.streak++; setScore(score + 120 + state.streak * 15); tone(640 + state.streak * 35, .07); } else { state.streak = 0; tone(150, .1, "sawtooth"); } state.word = choose(wordBank); state.typed = ""; state.time = Math.max(3500, 7000 - state.streak * 220); }

  function initMemory() { const colorset = [colors.coral, colors.cyan, colors.yellow, colors.pink, colors.blue, colors.green]; const deck = [...colorset, ...colorset].sort(() => Math.random() - .5); state = { deck, flipped: [], matched: [], moves: 0 }; }
  function updateMemory() { if (state.flipped.length === 2) { const [a, b] = state.flipped; if (state.deck[a] === state.deck[b]) { state.matched.push(a, b); state.flipped = []; setScore(score + 100); tone(720, .08); if (state.matched.length === state.deck.length) endGame(`ALL MATCHES FOUND IN ${state.moves} MOVES.`); } else if (!state.hideAt) state.hideAt = performance.now() + 650; } if (state.hideAt && performance.now() > state.hideAt) { state.flipped = []; state.hideAt = null; } }
  function drawMemory() { drawBase("MEMORY GRID", `${state.moves || 0} MOVES`); const size = 54; const gap = 12; const ox = (W - 4 * size - 3 * gap) / 2; const oy = 47; state.deck?.forEach((color, i) => { const x = i % 4; const y = Math.floor(i / 4); const visible = ownerVerified || hasShopEffect("goggles") || state.flipped.includes(i) || state.matched.includes(i); roundRect(ox + x * (size + gap), oy + y * (size + gap), size, size, 3, visible ? color : colors.panel, visible ? color : colors.cyan); if (!visible) { ctx.fillStyle = colors.dim; ctx.font = "16px Courier New"; ctx.textAlign = "center"; ctx.fillText("+", ox + x * (size + gap) + size / 2, oy + y * (size + gap) + 34); } }); ctx.textAlign = "left"; }
  function clickMemory(index) { if (state.flipped.includes(index) || state.matched.includes(index) || state.flipped.length === 2 || index < 0 || index > 11) return; state.flipped.push(index); state.moves++; tone(380 + state.flipped.length * 80, .05); }

  function initReflex() { state = { target: { x: 200, y: 160, size: 25 }, time: 30000, hits: 0, lastMove: 0 }; moveTarget(); }
  function moveTarget() { state.target.x = random(60, W - 60); state.target.y = random(70, H - 60); state.target.size = Math.max(14, 27 - Math.floor(state.hits / 4)) * powers.targetSize(); }
  function updateReflex(dt) { state.time -= dt; state.lastMove += dt; if (state.lastMove > 950 - state.hits * 18) { moveTarget(); state.lastMove = 0; } if (state.time <= 0) endGame(`YOU HIT ${state.hits} TARGETS. REFLEXES: ONLINE.`); }
  function drawReflex() { drawBase("REFLEX RUSH", `${Math.ceil(Math.max(0, state.time || 0) / 1000)} SEC`); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("CLICK THE LIT TARGET", 18, 47); if (state.target) { ctx.strokeStyle = colors.coral; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(state.target.x, state.target.y, state.target.size + 10, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(state.target.x, state.target.y, state.target.size, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.ink; ctx.beginPath(); ctx.arc(state.target.x, state.target.y, 4, 0, Math.PI * 2); ctx.fill(); } }
  function clickReflex(x, y) { if (!state.target) return; if (Math.hypot(x - state.target.x, y - state.target.y) < state.target.size + 12) { state.hits++; setScore(score + 50 + Math.max(0, 30 - Math.floor(state.lastMove / 30))); tone(500 + state.hits * 12, .04); moveTarget(); state.lastMove = 0; } }

  function initColor() { state = { answer: null, word: "", options: [], time: 4500, streak: 0 }; nextColor(); }
  function nextColor() { const palette = [{ name: "CORAL", color: colors.coral }, { name: "CYAN", color: colors.cyan }, { name: "YELLOW", color: colors.yellow }, { name: "PINK", color: colors.pink }, { name: "BLUE", color: colors.blue }]; state.answer = choose(palette); state.word = choose(palette).name; state.options = [...palette].sort(() => Math.random() - .5); state.time = Math.max(2200, 4500 - state.streak * 120); }
  function updateColor(dt) { state.time -= dt; if (state.time <= 0) { state.streak = 0; nextColor(); } }
  function drawColor() { drawBase("COLOR CODE", `STREAK ${state.streak || 0}`); ctx.textAlign = "center"; ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("CLICK THE INK COLOR", W / 2, 78); ctx.fillStyle = state.answer?.color || colors.yellow; ctx.font = "bold 47px Courier New"; ctx.fillText(state.word || "", W / 2, 151); state.options?.forEach((option, i) => { const x = 78 + i * 102; ctx.fillStyle = option.color; ctx.fillRect(x, 211, 67, 43); ctx.fillStyle = colors.paper; ctx.font = "9px Courier New"; ctx.fillText(`${i + 1}`, x + 33, 280); }); ctx.fillStyle = colors.coral; ctx.fillRect(130, 307, 380 * clamp(state.time / 4500, 0, 1), 4); ctx.textAlign = "left"; }
  function answerColor(index) { const option = state.options?.[index]; if (!option) return; if (option.name === state.answer.name) { state.streak++; setScore(score + 90 + state.streak * 10); tone(650, .06); } else { state.streak = 0; tone(150, .1, "sawtooth"); } nextColor(); }

  function initOrbit() { state = { shipX: W / 2, stars: [], hazards: [], time: 30000, spawn: 0, hits: 0 }; for (let i = 0; i < 4; i++) state.stars.push({ x: random(35, W - 35), y: random(55, H - 25) }); }
  function updateOrbit(dt) { state.time -= dt; state.spawn += dt; if (state.spawn > 850) { state.hazards.push({ x: random(25, W - 25), y: -15, speed: random(70, 140) }); state.spawn = 0; } state.stars.forEach((star) => { star.y += dt * .035; if (star.y > H + 15) { star.y = 35; star.x = random(35, W - 35); } if (Math.hypot(star.x - state.shipX, star.y - (H - 45)) < 22) { setScore(score + 80); star.y = 35; star.x = random(35, W - 35); tone(720, .06); } }); state.hazards.forEach((hazard) => hazard.y += hazard.speed * dt / 1000); state.hazards = state.hazards.filter((hazard) => { const hit = Math.hypot(hazard.x - state.shipX, hazard.y - (H - 45)) < 18; if (hit) { if (!powers.protect()) state.hits++; tone(120, .12, "sawtooth"); } return hazard.y < H + 20 && !hit; }); if (state.time <= 0) endGame(`ORBIT COMPLETE. ${state.hits ? `${state.hits} CLOSE CALLS` : "CLEAN FLIGHT"}.`); }
  function drawOrbit() { drawBase("ORBIT DODGER", `${Math.ceil(Math.max(0, state.time || 0) / 1000)} SEC`); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("ARROW KEYS / A-D TO STEER", 18, 47); state.stars?.forEach((star) => { ctx.fillStyle = colors.yellow; ctx.font = "22px serif"; ctx.fillText("✦", star.x - 7, star.y + 7); }); state.hazards?.forEach((hazard) => { ctx.fillStyle = colors.coral; ctx.fillRect(hazard.x - 5, hazard.y - 10, 10, 20); ctx.fillRect(hazard.x - 10, hazard.y - 5, 20, 10); }); const y = H - 45; ctx.fillStyle = colors.cyan; ctx.beginPath(); ctx.moveTo(state.shipX, y - 15); ctx.lineTo(state.shipX - 13, y + 12); ctx.lineTo(state.shipX, y + 7); ctx.lineTo(state.shipX + 13, y + 12); ctx.closePath(); ctx.fill(); }

  function initNeon() { state = { lane: 1, lanes: 3, time: 30000, distance: 0, spawn: 0, items: [], speed: 150, energy: 0, hitFlash: 0 }; livesLabel.textContent = "RUN 01"; }
  function updateNeon(dt) { state.time -= dt; state.distance += dt * .04; state.spawn += dt; state.hitFlash = Math.max(0, state.hitFlash - dt); if (state.spawn > Math.max(260, 680 - state.distance * .08)) { state.items.push({ lane: random(0, 2), y: -30, type: Math.random() < .32 ? "energy" : "glitch", size: Math.random() < .32 ? 12 : 18 }); state.spawn = 0; state.speed = Math.min(285, 150 + state.distance * .12); } state.items.forEach((item) => { item.y += state.speed * dt / 1000 * (item.type === "energy" ? 1.05 : 1); }); state.items = state.items.filter((item) => { if (item.lane === state.lane && Math.abs(item.y - (H - 55)) < 20) { if (item.type === "energy") { state.energy++; setScore(score + 70); tone(720 + state.energy * 10, .06); return false; } state.hitFlash = 240; if (!powers.protect()) endGame(`THE GLITCH CAUGHT YOU. ${state.energy} ENERGY BURSTS COLLECTED.`); return false; } return item.y < H + 35; }); if (state.time <= 0 && gameRunning) endGame(`NEON RUN COMPLETE. ${state.energy} ENERGY BURSTS COLLECTED.`); }
  function drawNeon() { drawBase("NEON RUN", `${Math.ceil(Math.max(0, state.time || 0) / 1000)} SEC`); const left = 155; const laneWidth = 110; const roadWidth = laneWidth * 3; ctx.fillStyle = "#101b27"; ctx.fillRect(left, 30, roadWidth, H - 30); ctx.strokeStyle = "rgba(93,227,208,.28)"; ctx.lineWidth = 2; ctx.strokeRect(left, 30, roadWidth, H - 30); for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.setLineDash([16, 15]); ctx.lineDashOffset = -(state.distance % 31); ctx.moveTo(left + i * laneWidth, 32); ctx.lineTo(left + i * laneWidth, H); ctx.stroke(); } ctx.setLineDash([]); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("LEFT / RIGHT TO SWITCH LANES", 18, 47); ctx.fillStyle = colors.cyan; ctx.font = "10px Courier New"; ctx.fillText(`ENERGY ${String(state.energy || 0).padStart(2, "0")}`, W - 110, 47); state.items?.forEach((item) => { const x = left + item.lane * laneWidth + laneWidth / 2; if (item.type === "energy") { ctx.fillStyle = colors.cyan; ctx.beginPath(); ctx.moveTo(x, item.y - 13); ctx.lineTo(x + 11, item.y); ctx.lineTo(x, item.y + 13); ctx.lineTo(x - 11, item.y); ctx.closePath(); ctx.fill(); ctx.fillStyle = colors.paper; ctx.fillRect(x - 2, item.y - 5, 4, 10); } else { ctx.fillStyle = colors.coral; ctx.fillRect(x - 14, item.y - 14, 28, 28); ctx.fillStyle = colors.yellow; ctx.fillRect(x - 8, item.y - 8, 16, 3); ctx.fillStyle = colors.ink; ctx.fillRect(x - 9, item.y + 5, 18, 4); } }); const playerX = left + state.lane * laneWidth + laneWidth / 2; const playerY = H - 55; ctx.fillStyle = state.hitFlash ? colors.paper : colors.yellow; ctx.beginPath(); ctx.moveTo(playerX, playerY - 20); ctx.lineTo(playerX + 18, playerY + 15); ctx.lineTo(playerX, playerY + 9); ctx.lineTo(playerX - 18, playerY + 15); ctx.closePath(); ctx.fill(); ctx.fillStyle = colors.cyan; ctx.fillRect(playerX - 5, playerY - 5, 10, 9); }

  function initJelly() { state = { mode: "jelly", time: 30000, ground: H - 50, y: H - 50, vy: 0, spawn: 0, bubbleSpawn: 500, speed: 170, distance: 0, obstacles: [], bubbles: [], jumps: 0, airJumps: 0 }; livesLabel.textContent = "RUN 01"; }
  function jumpJelly() { if (!gameRunning || paused || state.mode !== "jelly" || powers.isBonus() || (state.y < state.ground - 2 && (!hasShopEffect("moon") || state.airJumps >= 2))) return; state.vy = -680; state.airJumps++; state.jumps++; tone(500 + state.jumps * 8, .06); }
  function updateJelly(dt) { const seconds = dt / 1000; state.time -= dt; state.distance += state.speed * seconds; state.speed = Math.min(300, 170 + state.distance * .018); state.vy += 980 * seconds; state.y += state.vy * seconds; if (state.y > state.ground) { state.y = state.ground; state.vy = 0; state.airJumps = 0; } if (state.y < 62) { state.y = 62; state.vy = 0; } state.spawn += dt; state.bubbleSpawn += dt; if (state.spawn > Math.max(520, 1050 - state.distance * .55)) { state.obstacles.push({ x: W + 20, width: random(24, 43), height: random(28, 58), scored: false }); state.spawn = 0; } if (state.bubbleSpawn > 850) { state.bubbles.push({ x: W + 20, y: random(110, state.ground - 45), collected: false }); state.bubbleSpawn = 0; } state.obstacles.forEach((obstacle) => { obstacle.x -= state.speed * seconds; if (!obstacle.scored && obstacle.x + obstacle.width < 95) { obstacle.scored = true; setScore(score + 20); } }); state.bubbles.forEach((bubble) => { bubble.x -= state.speed * seconds; }); const playerLeft = 86, playerRight = 124, playerTop = state.y - 31, playerBottom = state.y; state.obstacles = state.obstacles.filter((obstacle) => { const hit = obstacle.x < playerRight && obstacle.x + obstacle.width > playerLeft && state.ground - obstacle.height < playerBottom && state.ground - obstacle.height < playerBottom && state.ground > playerTop; if (hit) { if (!powers.protect()) endGame(`SPLAT. YOU JUMPED ${state.jumps} TIMES.`); return false; } return obstacle.x > -50; }); state.bubbles = state.bubbles.filter((bubble) => { if (Math.hypot(bubble.x - 105, bubble.y - (state.y - 16)) < 28) { setScore(score + 60); tone(760, .06); return false; } return bubble.x > -30; }); if (state.time <= 0 && gameRunning) endGame(`JELLY RUN COMPLETE. ${score} POINTS ON THE BOUNCE.`); }
  function drawJelly() { drawBase("JELLY JUMP", `${Math.ceil(Math.max(0, state.time || 0) / 1000)} SEC`); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("UP / SPACE / A TO JUMP", 18, 47); ctx.fillStyle = "#192333"; ctx.fillRect(0, state.ground + 2, W, H - state.ground); ctx.strokeStyle = "rgba(93,227,208,.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, state.ground + 2); ctx.lineTo(W, state.ground + 2); ctx.stroke(); ctx.strokeStyle = "rgba(255,210,77,.3)"; ctx.setLineDash([22, 18]); ctx.lineDashOffset = -(state.distance % 40); ctx.beginPath(); ctx.moveTo(0, state.ground + 22); ctx.lineTo(W, state.ground + 22); ctx.stroke(); ctx.setLineDash([]); state.bubbles?.forEach((bubble) => { ctx.strokeStyle = colors.cyan; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bubble.x, bubble.y, 10, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = "rgba(93,227,208,.35)"; ctx.fill(); }); state.obstacles?.forEach((obstacle) => { ctx.fillStyle = colors.coral; ctx.fillRect(obstacle.x, state.ground - obstacle.height, obstacle.width, obstacle.height); ctx.fillStyle = colors.yellow; ctx.fillRect(obstacle.x + 5, state.ground - obstacle.height + 6, obstacle.width - 10, 4); }); roundRect(92, state.y - 31, 30, 31, 9, colors.pink); ctx.fillStyle = colors.ink; ctx.fillRect(100, state.y - 21, 4, 5); ctx.fillRect(111, state.y - 21, 4, 5); ctx.fillStyle = colors.paper; ctx.fillRect(101, state.y - 11, 13, 3); }

  function initMicro() { const variant = microModes[currentGame] || "target"; state = { mode: "micro", variant, time: 25000, combo: 0, hits: 0, misses: 0, target: { x: 0, y: 0 }, playerX: W / 2, lane: 1, ground: H - 55 }; if (variant === "target") placeMicroTarget(); if (variant === "timing") { state.bar = 0; state.barDir = 1; } if (variant === "typing") { state.prompt = choose(["PIXEL", "JUMP", "LASER", "COMBO", "GLOW", "PLAY"]); state.typed = ""; state.time = 18000; } if (variant === "sequence") { state.tiles = 4; buildSequence(); } if (variant === "catch") { state.falling = []; state.spawn = 0; state.speed = 130; } if (variant === "dodge") { state.hazards = []; state.spawn = 0; state.speed = 180; } if (variant === "stack") { state.stack = [{ x: W / 2 - 70, y: H - 48, width: 140 }]; state.block = { x: 40, y: H - 80, width: 105 }; state.blockDir = 1; state.blockSpeed = 240; } if (variant === "navigate") { state.gridCols = 7; state.gridRows = 4; state.cursor = { x: 0, y: 0 }; state.exit = { x: 6, y: 3 }; } if (variant === "orbit") { state.angle = 0; state.targetAngle = Math.PI / 2; state.spin = 1.7; } if (variant === "fishing") { state.bobberY = 185; state.bobberDir = 1; state.bobberSpeed = .28; } if (variant === "paint") { state.paintColors = [colors.coral, colors.cyan, colors.yellow, colors.pink, colors.blue, colors.green, "#f7a35c", "#b18cff", "#f3f0e8"]; state.paintGoal = random(0, 8); } if (variant === "rewire") { state.nodes = Array.from({ length: 5 }, (_, index) => ({ x: 120 + index * 100, y: 190 + (index % 2 ? -45 : 45) })); state.liveNode = random(0, 4); } if (variant === "drum") { state.beat = 0; state.beatDir = 1; } if (variant === "shooter") { placeMicroTarget(); state.shots = 0; } if (variant === "sort") { state.sortColors = [colors.coral, colors.cyan, colors.yellow, colors.pink]; state.sortGoal = random(0, 3); } if (variant === "balance") { state.balance = 0; state.balanceVelocity = .12; } if (variant === "gravity") { state.ball = { x: 110, y: 105, vx: 0, vy: 0 }; state.gravityStar = { x: random(160, W - 35), y: random(75, H - 65) }; } if (variant === "scanner") initScanner(); if (variant === "defender") { state.shipX = W / 2; state.enemies = []; state.spawn = 0; state.shots = []; } livesLabel.textContent = variant === "scanner" ? `0/${scannerItems.length} FOUND` : variant === "typing" ? "TYPE" : "READY"; }
  function placeMicroTarget() { const palette = [colors.yellow, colors.cyan, colors.coral, colors.pink]; state.target = { x: random(55, W - 55), y: random(78, H - 45), size: random(15, 25) * powers.targetSize(), color: choose(palette), shape: random(0, 2) }; }
  function buildSequence() { const count = currentGame === "memory-rush" ? 6 : 4; state.sequence = Array.from({ length: count }, () => random(0, count - 1)); state.sequenceIndex = 0; state.sequenceShowing = true; state.sequenceTimer = 0; }
  function updateMicro(dt) { const seconds = dt / 1000; state.time -= dt; if (state.variant === "target") { state.relocate = (state.relocate || 0) + dt; if (state.relocate > Math.max(360, 850 - state.combo * 18)) { state.relocate = 0; state.misses++; state.combo = 0; placeMicroTarget(); } } if (state.variant === "timing") { state.bar += state.barDir * dt * .38; if (state.bar > 360 || state.bar < 0) state.barDir *= -1; } if (state.variant === "drum") { state.beat += state.beatDir * dt * .004; if (state.beat > 1 || state.beat < 0) state.beatDir *= -1; } if (state.variant === "sequence" && state.sequenceShowing) { state.sequenceTimer += dt; if (state.sequenceTimer > state.sequence.length * 520 + 650) { state.sequenceShowing = false; state.sequenceIndex = 0; } } if (state.variant === "catch") updateCatchMicro(seconds); if (state.variant === "dodge") updateDodgeMicro(seconds); if (state.variant === "stack") { state.block.x += state.blockDir * state.blockSpeed * seconds; if (state.block.x < 25 || state.block.x + state.block.width > W - 25) state.blockDir *= -1; } if (state.variant === "navigate" || state.variant === "orbit") state.angle = (state.angle || 0) + state.spin * seconds; if (state.variant === "fishing") updateFishingMicro(dt); if (state.variant === "shooter") updateShooterMicro(dt); if (state.variant === "defender") updateDefenderMicro(seconds); if (state.variant === "balance") updateBalanceMicro(seconds); if (state.variant === "gravity") updateGravityMicro(seconds); if (state.variant === "scanner") updateScannerMicro(dt); if (state.time <= 0) endGame(state.variant === "scanner" ? `SEARCH OVER. ${state.hits} OF ${state.scanObjects.length} OBJECTS FOUND.` : `RUN COMPLETE. ${state.hits} HITS, ${state.combo} COMBO.`); }
  function updateCatchMicro(seconds) { state.spawn += seconds * 1000; if (state.spawn > Math.max(420, 900 - state.hits * 12)) { state.falling.push({ x: random(35, W - 35), y: -20, size: random(10, 17), color: choose([colors.yellow, colors.cyan, colors.pink]) }); state.spawn = 0; } state.falling.forEach((item) => { item.y += state.speed * seconds; }); state.falling = state.falling.filter((item) => { if (item.y > state.ground - 20) { if (Math.abs(item.x - state.playerX) < 42) { state.hits++; setScore(score + 35 + state.hits * 3); tone(650, .05); } else state.misses++; return false; } return true; }); }
  function updateDodgeMicro(seconds) { state.spawn += seconds * 1000; if (state.spawn > Math.max(360, 820 - state.hits * 10)) { state.hazards.push({ lane: random(0, 2), y: -22, size: random(14, 24) }); state.spawn = 0; } state.hazards.forEach((hazard) => { hazard.y += state.speed * seconds; }); state.hazards = state.hazards.filter((hazard) => { if (hazard.y > H - 72) { if (hazard.lane === state.lane) { if (!powers.protect()) endGame(`SIGNAL LOST. YOU DODGED ${state.hits} HAZARDS.`); return false; } state.hits++; setScore(score + 20); return false; } return true; }); }
  function updateFishingMicro(dt) { state.bobberY += state.bobberDir * state.bobberSpeed * dt; if (state.bobberY > 255 || state.bobberY < 125) state.bobberDir *= -1; }
  function updateShooterMicro(dt) { state.relocate = (state.relocate || 0) + dt; if (state.relocate > Math.max(420, 1100 - state.hits * 18)) { state.relocate = 0; state.misses++; placeMicroTarget(); } }
  function updateDefenderMicro(seconds) { state.spawn += seconds * 1000; if (state.spawn > Math.max(360, 900 - state.hits * 10)) { state.enemies.push({ x: random(35, W - 35), y: -20, size: random(12, 20) }); state.spawn = 0; } state.enemies.forEach((enemy) => { enemy.y += (90 + state.hits * 2) * seconds; }); state.shots.forEach((shot) => { shot.y -= 330 * seconds; }); state.enemies = state.enemies.filter((enemy) => { const hit = state.shots.some((shot) => Math.hypot(shot.x - enemy.x, shot.y - enemy.y) < enemy.size + 8); if (hit) { state.hits++; setScore(score + 45); tone(600, .04); state.shots = state.shots.filter((shot) => Math.hypot(shot.x - enemy.x, shot.y - enemy.y) >= enemy.size + 8); return false; } if (enemy.y > H - 40) { if (!powers.protect()) endGame(`BASE HIT. YOU DEFENDED ${state.hits} WAVES.`); return false; } return true; }); state.shots = state.shots.filter((shot) => shot.y > 40); }
  function updateBalanceMicro(seconds) { state.balance += state.balanceVelocity * seconds; state.balanceVelocity += (Math.random() - .5) * .045; state.balanceVelocity = clamp(state.balanceVelocity, -.3, .3); if (Math.abs(state.balance) > 1.05) { if (powers.protect()) { state.balance = 0; state.balanceVelocity = 0; } else endGame(`TIPPED OVER. YOU HELD BALANCE FOR ${state.hits} HITS.`); } }
  function updateGravityMicro(seconds) { const ball = state.ball; ball.vy += 200 * seconds; ball.x += ball.vx * seconds; ball.y += ball.vy * seconds; if (ball.x < 24 || ball.x > W - 24) ball.vx *= -.8; if (ball.y < 65 || ball.y > H - 35) { ball.y = clamp(ball.y, 65, H - 35); ball.vy *= -.75; } if (Math.hypot(ball.x - state.gravityStar.x, ball.y - state.gravityStar.y) < 24) { state.hits++; setScore(score + 70); tone(720, .05); state.gravityStar = { x: random(45, W - 45), y: random(75, H - 65) }; } }
  const scannerItems = [
    { name: "KEY", color: "#ffe56f", pixels: ["01110000", "11011000", "10001000", "11011000", "01110000", "00010000", "00011100", "00010100"] },
    { name: "STAR", color: "#ffade9", pixels: ["00010000", "00111000", "11111110", "01111100", "00111000", "01101100", "11000110", "00000000"] },
    { name: "GEM", color: "#84ffeb", pixels: ["00111100", "01221110", "11111111", "01111110", "00111100", "00011000", "00011000", "00000000"] },
    { name: "COIN", color: "#ffbf87", pixels: ["00111100", "01122110", "11211211", "11211211", "11211211", "01122110", "00111100", "00000000"] },
    { name: "BATTERY", color: "#c4ff9b", pixels: ["00011000", "00111100", "01111110", "01222210", "01111110", "01222210", "01111110", "01111110"] },
    { name: "HEART", color: "#ff9da5", pixels: ["01100110", "11111111", "12111111", "11111111", "01111110", "00111100", "00011000", "00000000"] },
    { name: "POTION", color: "#a1d5ff", pixels: ["00022000", "00011000", "00100100", "01000010", "01111110", "01211110", "01111110", "00111100"] },
    { name: "CROWN", color: "#ffe56f", pixels: ["00000000", "10011001", "11011011", "11111111", "11122111", "01111110", "01111110", "00000000"] },
    { name: "BOLT", color: "#fbff9c", pixels: ["00011100", "00111000", "01110000", "11111110", "00011100", "00111000", "01100000", "01000000"] },
    { name: "FLOWER", color: "#ffade9", accent: "#c4ff9b", pixels: ["00011000", "01111110", "01122110", "00011000", "00030000", "00333000", "00033000", "00030000"] },
    { name: "MUSHROOM", color: "#ffa497", pixels: ["00111100", "01122110", "12111121", "11111111", "00022000", "00022000", "00222200", "00000000"] },
    { name: "APPLE", color: "#ff96ad", accent: "#c4ff9b", pixels: ["00033000", "00030000", "01101100", "11111110", "12111110", "11111110", "01111100", "00101000"] },
    { name: "PLANET", color: "#d5c3ff", accent: "#ffe56f", pixels: ["00011000", "00111100", "03111130", "33111333", "33311330", "03111100", "00111100", "00011000"] },
    { name: "GIFT", color: "#bbd5ff", accent: "#ffade9", pixels: ["00300300", "00033000", "11133111", "11133111", "33333333", "11133111", "11133111", "11133111"] },
    { name: "CHERRIES", color: "#ff97b2", accent: "#c4ff9b", pixels: ["00033000", "00300300", "03000300", "03000300", "11101110", "12101210", "11101110", "00000000"] },
    { name: "MOON", color: "#eaf6ff", pixels: ["00011100", "00111000", "01110000", "11100000", "11100000", "01110001", "00111110", "00011100"] },
    { name: "SUN", color: "#ffe56f", pixels: ["00010000", "01000100", "00111000", "11121110", "00111000", "01000100", "00010000", "00000000"] },
    { name: "LOCK", color: "#ffdfa0", pixels: ["00111100", "01000010", "01000010", "11111111", "11122111", "11122111", "11111111", "00000000"] },
    { name: "ANCHOR", color: "#adffff", pixels: ["00011000", "00100100", "00011000", "01111110", "00011000", "10011001", "11011011", "01111110"] },
    { name: "NOTE", color: "#ffc6ef", pixels: ["00111110", "00111110", "00100010", "00100010", "00100010", "11101110", "11101110", "00000000"] },
    { name: "ROCKET", color: "#eefbff", accent: "#ffb48a", pixels: ["00011000", "00111100", "00122100", "00122100", "01111110", "11111111", "00033000", "00333300"] }
  ];
  function initScanner() {
    state.searchBox = { x: 36, y: 138, width: W - 72, height: H - 178 };
    const slots = scannerItems.map((_, index) => index);
    for (let i = slots.length - 1; i > 0; i--) { const j = random(0, i); [slots[i], slots[j]] = [slots[j], slots[i]]; }
    state.scanObjects = scannerItems.map((item, index) => {
      const slot = slots[index];
      const box = state.searchBox;
      return { ...item, x: box.x + (slot % 7 + .5) * box.width / 7 + random(-12, 12),
        y: box.y + (Math.floor(slot / 7) + .5) * box.height / 3 + random(-12, 12), found: false };
    });
    state.time = state.scanObjects.length * 5000 + 15000;
    state.scanner = { x: state.scanObjects[0].x + 25, y: state.scanObjects[0].y + 25, active: true };
    state.foundFlash = 0; state.lastFound = ""; state.scanNotice = "";
    state.detectorPulse = 0; state.beepTimer = 0;
  }
  function scannerRadius() { return 110 * powers.targetSize() * (hasShopEffect("goggles") ? 1.5 : 1); }
  function detectorReading() {
    if (!state.scanner?.active) return { strength: 0, distance: Infinity, object: null };
    let object = null, distance = Infinity;
    state.scanObjects.forEach((item) => {
      const next = Math.hypot(item.x - state.scanner.x, item.y - state.scanner.y);
      if (!item.found && next < distance) { object = item; distance = next; }
    });
    const range = scannerRadius(), digRange = 28 * powers.targetSize();
    const strength = object ? Math.round(clamp((range - distance) / (range - digRange), 0, 1) * 100) : 0;
    return { strength, distance, object };
  }
  function moveScanner(x, y) {
    if (state.variant !== "scanner" || !state.searchBox || !gameRunning || paused || powers.isBonus()) return;
    const box = state.searchBox;
    state.scanner.active = x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
    state.scanner.x = clamp(x, box.x, box.x + box.width);
    state.scanner.y = clamp(y, box.y, box.y + box.height);
  }
  function updateScannerMicro(dt) {
    state.foundFlash = Math.max(0, state.foundFlash - dt);
    state.detectorPulse = Math.max(0, state.detectorPulse - dt);
    const { strength } = detectorReading();
    if (!strength) { state.beepTimer = 0; return; }
    state.beepTimer += dt;
    if (state.beepTimer >= 850 - strength * 7) {
      state.beepTimer = 0; state.detectorPulse = 240;
      tone(220 + strength * 5, .055, "sine");
    }
  }
  function hitTiming() { if (state.variant !== "timing") return; if (Math.abs(state.bar - 180) < 52 * powers.tolerance()) { state.hits++; state.combo++; setScore(score + 55 + state.combo * 8); tone(700, .06); } else { state.combo = 0; tone(150, .06, "sawtooth"); } state.bar = 0; }
  function setTypingPrompt() { state.typingConfigured = true; state.typed = ""; if (currentGame === "sum-sprint") { const a = random(2, 12), b = random(2, 12); state.prompt = `${a} + ${b} = ?`; state.answer = String(a + b); } else if (currentGame === "quick-count") { state.prompt = String(random(5, 14)); state.answer = state.prompt; } else if (currentGame === "number-nudge") { const base = random(20, 70); state.prompt = `${base}, ${base + 5}, ?`; state.answer = String(base + 10); } else if (currentGame === "letter-loop") { state.prompt = choose(["ABCD", "WXYZ", "PLAY", "JUMP"]); state.answer = state.prompt; } else { state.prompt = choose(["PIXEL", "JUMP", "LASER", "COMBO", "GLOW", "PLAY"]); state.answer = state.prompt; } }
  function submitMicroTyping() { if (state.variant !== "typing") return; if (state.typed === state.answer) { state.hits++; state.combo++; setScore(score + 80 + state.combo * 12); tone(680, .06); setTypingPrompt(); } else { state.combo = 0; tone(150, .06, "sawtooth"); } }
  function selectSequence(index) { if (state.variant !== "sequence" || state.sequenceShowing) return; if (index === state.sequence[state.sequenceIndex]) { state.sequenceIndex++; state.combo++; tone(600 + state.sequenceIndex * 30, .05); if (state.sequenceIndex >= state.sequence.length) { state.hits++; setScore(score + 120 + state.combo * 10); buildSequence(); } } else { state.combo = 0; state.sequenceIndex = 0; tone(140, .08, "sawtooth"); } }
  function dropStack() { if (state.variant !== "stack") return; const top = state.stack[state.stack.length - 1]; const overlap = Math.min(state.block.x + state.block.width, top.x + top.width) - Math.max(state.block.x, top.x); if (overlap <= 0) { if (powers.protect()) { state.block.x = top.x; return; } endGame(`STACK WOBBLED. YOU PLACED ${state.hits} BLOCKS.`); return; } const newBlock = { x: Math.max(state.block.x, top.x), y: top.y - 32, width: overlap }; state.stack.push(newBlock); state.hits++; setScore(score + 60 + state.hits * 10); tone(420 + state.hits * 15, .05); state.block = { x: 35, y: newBlock.y - 32, width: Math.max(34, overlap) }; state.blockDir = 1; if (state.block.y < 55) endGame(`STACK COMPLETE. ${state.hits} BLOCKS TALL.`); }
  function moveNavigate(dx, dy) { if (state.variant !== "navigate") return; state.cursor.x = clamp(state.cursor.x + dx, 0, state.gridCols - 1); state.cursor.y = clamp(state.cursor.y + dy, 0, state.gridRows - 1); if (state.cursor.x === state.exit.x && state.cursor.y === state.exit.y) { state.hits++; setScore(score + 150); endGame("EXIT FOUND. NAVIGATION COMPLETE."); } }
  function hitOrbit() { if (state.variant !== "orbit") return; const diff = Math.abs(Math.atan2(Math.sin(state.angle - state.targetAngle), Math.cos(state.angle - state.targetAngle))); if (diff < .34 * powers.tolerance()) { state.hits++; setScore(score + 75 + state.hits * 10); state.targetAngle += Math.PI / 2; tone(720, .06); } else { state.combo = 0; tone(140, .06, "sawtooth"); } }
  function hitFishing() { if (state.variant !== "fishing") return; if (Math.abs(state.bobberY - 190) < 25 * powers.tolerance()) { state.hits++; state.combo++; setScore(score + 70 + state.combo * 8); state.bobberY = 145; tone(720, .06); } else { state.combo = 0; tone(140, .06, "sawtooth"); } }
  function paintPick(index) { if (state.variant !== "paint") return; if (index === state.paintGoal) { state.hits++; state.combo++; setScore(score + 65 + state.combo * 8); state.paintGoal = random(0, 8); tone(620, .05); } else { state.combo = 0; tone(140, .06, "sawtooth"); } }
  function rewirePick(index) { if (state.variant !== "rewire") return; if (index === state.liveNode) { state.hits++; state.combo++; setScore(score + 70 + state.combo * 8); state.liveNode = random(0, 4); tone(680, .05); } else { state.combo = 0; tone(140, .06, "sawtooth"); } }
  function hitDrum() { if (state.variant !== "drum") return; if (Math.abs(state.beat - .5) < .15 * powers.tolerance()) { state.hits++; state.combo++; setScore(score + 60 + state.combo * 7); tone(480, .05); } else { state.combo = 0; tone(140, .06, "sawtooth"); } state.beat = 0; }
  function hitShooter(x, y) { if (state.variant !== "shooter") return; const target = state.target; if (Math.hypot(x - target.x, y - target.y) <= target.size + 17) { state.hits++; state.combo++; setScore(score + 45 + state.combo * 6); state.shots++; placeMicroTarget(); state.relocate = 0; tone(760, .04); } else { state.combo = 0; tone(140, .05, "sawtooth"); } }
  function sortPick(index) { if (state.variant !== "sort") return; if (index === state.sortGoal) { state.hits++; state.combo++; setScore(score + 70 + state.combo * 7); state.sortGoal = random(0, 3); tone(620, .05); } else { state.combo = 0; tone(140, .06, "sawtooth"); } }
  function balanceControl(direction) { if (state.variant !== "balance") return; state.balance += direction * .18; state.balanceVelocity += direction * .12; if (Math.abs(state.balance) < .18) { state.hits++; setScore(score + 15); } }
  function gravityControl(dx, dy) { if (state.variant !== "gravity") return; state.ball.vx += dx * 75; state.ball.vy += dy * (hasShopEffect("moon") ? 180 : 55) * powers.movement(); state.ball.vx += dx * 75 * (powers.movement() - 1); }
  function hitScanner(x = state.scanner?.x, y = state.scanner?.y) {
    if (state.variant !== "scanner" || !gameRunning || paused || powers.isBonus()) return;
    if (!state.scanner.active) return;
    const box = state.searchBox;
    if (x < box.x || x > box.x + box.width || y < box.y || y > box.y + box.height) return;
    const digRange = 28 * powers.targetSize();
    let object = null, closest = Infinity;
    state.scanObjects.forEach((item) => {
      const distance = Math.hypot(item.x - x, item.y - y);
      if (!item.found && distance <= digRange && distance < closest && Math.hypot(item.x - state.scanner.x, item.y - state.scanner.y) <= digRange) {
        object = item; closest = distance;
      }
    });
    if (!object) {
      state.misses++; state.combo = 0; state.scanNotice = "NO METAL HERE"; state.foundFlash = 1100;
      tone(140, .04, "sawtooth"); return;
    }
    object.found = true; state.hits++; state.combo++;
    state.lastFound = object.name; state.scanNotice = `${object.name} FOUND!`; state.foundFlash = 1600;
    state.detectorPulse = 0; state.beepTimer = 0;
    setScore(score + 100 + state.combo * 20); tone(580 + state.hits * 80, .08);
    livesLabel.textContent = `${state.hits}/${state.scanObjects.length} FOUND`;
    if (state.hits === state.scanObjects.length) {
      setScore(score + Math.ceil(state.time / 1000) * 10);
      endGame(`BOX CLEARED! ALL ${state.scanObjects.length} OBJECTS FOUND.`);
    }
  }
  function fireDefender() { if (state.variant !== "defender") return; state.shots.push({ x: state.shipX, y: H - 55 }); tone(520, .035); }
  function drawMicro() { if (state.variant === "typing" && !state.typingConfigured) setTypingPrompt(); if (state.variant === "target") return drawTargetMicro(); if (state.variant === "timing") return drawTimingMicro(); if (state.variant === "typing") return drawTypingMicro(); if (state.variant === "sequence") return drawSequenceMicro(); if (state.variant === "catch") return drawCatchMicro(); if (state.variant === "dodge") return drawDodgeMicro(); if (state.variant === "stack") return drawStackMicro(); if (state.variant === "navigate") return drawNavigateMicro(); if (state.variant === "orbit") return drawOrbitMicro(); if (state.variant === "fishing") return drawFishingMicro(); if (state.variant === "paint") return drawPaintMicro(); if (state.variant === "rewire") return drawRewireMicro(); if (state.variant === "drum") return drawDrumMicro(); if (state.variant === "shooter") return drawShooterMicro(); if (state.variant === "sort") return drawSortMicro(); if (state.variant === "balance") return drawBalanceMicro(); if (state.variant === "gravity") return drawGravityMicro(); if (state.variant === "scanner") return drawScannerMicro(); if (state.variant === "defender") return drawDefenderMicro(); }
  function microHeader(instruction) { const game = games.find((item) => item.id === currentGame); drawBase(game?.title.toUpperCase() || "MICRO ARCADE", `${Math.ceil(Math.max(0, state.time || 0) / 1000)} SEC`); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText(instruction, 18, 47); ctx.fillStyle = colors.cyan; ctx.textAlign = "right"; ctx.fillText(`COMBO ${state.combo || 0}`, W - 18, 47); ctx.textAlign = "left"; }
  function drawTargetMicro() { microHeader("CLICK THE BRIGHT TARGET"); const target = state.target; ctx.globalAlpha = .25; ctx.fillStyle = target.color; ctx.beginPath(); ctx.arc(target.x, target.y, target.size + 13 + Math.sin(performance.now() / 140) * 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = target.color; if (target.shape === 0) { ctx.beginPath(); ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2); ctx.fill(); } else if (target.shape === 1) ctx.fillRect(target.x - target.size, target.y - target.size, target.size * 2, target.size * 2); else { ctx.beginPath(); ctx.moveTo(target.x, target.y - target.size); ctx.lineTo(target.x + target.size, target.y); ctx.lineTo(target.x, target.y + target.size); ctx.lineTo(target.x - target.size, target.y); ctx.closePath(); ctx.fill(); } ctx.fillStyle = colors.ink; ctx.beginPath(); ctx.arc(target.x, target.y, 4, 0, Math.PI * 2); ctx.fill(); }
  function drawTimingMicro() { microHeader("PRESS SPACE WHEN THE MARKER HITS THE ZONE"); const x = 120, y = 180, width = 400; ctx.fillStyle = colors.panel; ctx.fillRect(x, y, width, 34); ctx.fillStyle = colors.green; ctx.fillRect(x + 180 - 52 * powers.tolerance(), y, 104 * powers.tolerance(), 34); ctx.fillStyle = colors.yellow; ctx.fillRect(x + state.bar, y - 8, 7, 50); ctx.fillStyle = colors.paper; ctx.font = "12px Courier New"; ctx.textAlign = "center"; ctx.fillText("PERFECT ZONE", W / 2, 255); ctx.textAlign = "left"; }
  function drawTypingMicro() { if (currentGame === "word-worm") return drawWordWormMicro(); if (currentGame === "sum-sprint") return drawSumSprintMicro(); if (currentGame === "letter-loop") return drawLetterLoopMicro(); if (currentGame === "quick-count") return drawQuickCountMicro(); if (currentGame === "number-nudge") return drawNumberNudgeMicro(); microHeader("TYPE THE SIGNAL + ENTER"); ctx.textAlign = "center"; ctx.fillStyle = colors.yellow; ctx.font = "bold 48px Courier New"; ctx.fillText(state.prompt, W / 2, 150); roundRect(145, 190, 350, 56, 3, colors.panel, colors.cyan); ctx.fillStyle = colors.cyan; ctx.font = "bold 24px Courier New"; ctx.fillText(state.typed || "_", W / 2, 226); ctx.textAlign = "left"; }
  function drawWordWormMicro() { microHeader("FEED THE WORM: TYPE THE WORD"); ctx.strokeStyle = colors.green; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(80, 250); ctx.lineTo(170, 220); ctx.lineTo(260, 245); ctx.lineTo(350, 195); ctx.lineTo(440, 225); ctx.stroke(); ctx.fillStyle = colors.pink; ctx.beginPath(); ctx.arc(470, 225, 23, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.ink; ctx.fillRect(461, 216, 5, 5); ctx.fillRect(474, 216, 5, 5); ctx.fillStyle = colors.yellow; ctx.font = "bold 32px Courier New"; ctx.textAlign = "center"; ctx.fillText(state.prompt, W / 2, 120); ctx.fillStyle = colors.cyan; ctx.font = "bold 20px Courier New"; ctx.fillText(state.typed || "_", W / 2, 165); ctx.textAlign = "left"; }
  function drawSumSprintMicro() { microHeader("TYPE THE ANSWER + ENTER"); ctx.textAlign = "center"; ctx.fillStyle = colors.yellow; ctx.font = "bold 46px Courier New"; ctx.fillText(state.prompt, W / 2, 150); ctx.fillStyle = colors.coral; ctx.font = "12px Courier New"; ctx.fillText("MENTAL MATH SPEEDRUN", W / 2, 92); roundRect(190, 190, 260, 56, 3, colors.panel, colors.cyan); ctx.fillStyle = colors.cyan; ctx.font = "bold 25px Courier New"; ctx.fillText(state.typed || "_", W / 2, 227); ctx.textAlign = "left"; }
  function drawLetterLoopMicro() { microHeader("TYPE THE LETTER LOOP + ENTER"); ctx.strokeStyle = colors.pink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W / 2, 165, 76, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = colors.yellow; ctx.font = "bold 40px Courier New"; ctx.textAlign = "center"; ctx.fillText(state.prompt, W / 2, 178); ctx.fillStyle = colors.cyan; ctx.font = "bold 21px Courier New"; ctx.fillText(state.typed || "_", W / 2, 280); ctx.textAlign = "left"; }
  function drawQuickCountMicro() { microHeader("COUNT THE DOTS + TYPE THE NUMBER"); const count = Number(state.prompt) || 0; ctx.fillStyle = colors.paper; ctx.font = "11px Courier New"; ctx.fillText("HOW MANY PIXELS?", 18, 88); for (let i = 0; i < count; i++) { ctx.fillStyle = colors.cyan; ctx.fillRect(160 + (i % 6) * 48, 120 + Math.floor(i / 6) * 48, 16, 16); } roundRect(190, 260, 260, 50, 3, colors.panel, colors.yellow); ctx.fillStyle = colors.yellow; ctx.font = "bold 24px Courier New"; ctx.textAlign = "center"; ctx.fillText(state.typed || "_", W / 2, 293); ctx.textAlign = "left"; }
  function drawNumberNudgeMicro() { microHeader("NUDGE THE NUMBER + ENTER"); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("TYPE THE NEXT NUMBER IN THE SEQUENCE", 18, 90); ctx.fillStyle = colors.yellow; ctx.font = "bold 46px Courier New"; ctx.textAlign = "center"; ctx.fillText(state.prompt, W / 2, 160); ctx.strokeStyle = colors.coral; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(150, 220); ctx.lineTo(490, 220); ctx.stroke(); ctx.fillStyle = colors.cyan; ctx.font = "bold 24px Courier New"; ctx.fillText(state.typed || "_", W / 2, 280); ctx.textAlign = "left"; }
  function drawSequenceMicro() { if (currentGame === "memory-rush") return drawMemoryRushMicro(); if (currentGame === "pattern-pulse") return drawPatternPulseMicro(); microHeader(state.sequenceShowing ? "MEMORIZE THE FLASH" : "REPEAT THE SIGNAL: 1 - 4"); const size = 70, gap = 22, ox = (W - size * 2 - gap) / 2, oy = 100; for (let i = 0; i < 4; i++) { const x = ox + (i % 2) * (size + gap), y = oy + Math.floor(i / 2) * (size + gap); const flashing = state.sequenceShowing && state.sequence[Math.floor(state.sequenceTimer / 520)] === i; roundRect(x, y, size, size, 4, flashing ? colors.yellow : colors.panel, colors.cyan); ctx.fillStyle = flashing ? colors.ink : colors.dim; ctx.font = "18px Courier New"; ctx.textAlign = "center"; ctx.fillText(String(i + 1), x + size / 2, y + 43); } ctx.textAlign = "left"; }
  function drawMemoryRushMicro() { microHeader(state.sequenceShowing ? "MEMORIZE THE FLASHING CARD" : "CLICK THE CARDS IN ORDER"); const size = 62, gap = 15, ox = (W - size * 3 - gap * 2) / 2, oy = 105; for (let i = 0; i < 6; i++) { const x = ox + (i % 3) * (size + gap), y = oy + Math.floor(i / 3) * (size + gap); const flashing = state.sequenceShowing && state.sequence[Math.floor(state.sequenceTimer / 520)] === i; roundRect(x, y, size, size, 12, flashing ? colors.pink : colors.panel, colors.cyan); ctx.fillStyle = flashing ? colors.ink : colors.dim; ctx.font = "14px Courier New"; ctx.textAlign = "center"; ctx.fillText(String(i + 1), x + size / 2, y + 37); } ctx.textAlign = "left"; }
  function drawPatternPulseMicro() { microHeader(state.sequenceShowing ? "WATCH THE PULSE TRAVEL" : "REPEAT THE PULSE: 1 - 4"); for (let i = 0; i < 4; i++) { const x = 125 + i * 130, active = state.sequenceShowing && state.sequence[Math.floor(state.sequenceTimer / 520)] === i; ctx.fillStyle = active ? colors.yellow : colors.panel; ctx.beginPath(); ctx.arc(x, 175, active ? 32 : 22, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = colors.cyan; ctx.stroke(); ctx.fillStyle = colors.paper; ctx.font = "12px Courier New"; ctx.textAlign = "center"; ctx.fillText(`P${i + 1}`, x, 230); } ctx.textAlign = "left"; }
  function drawCatchMicro() { if (currentGame === "star-stack") return drawStarStackMicro(); if (currentGame === "comet-catch") return drawCometCatchMicro(); if (currentGame === "dot-collector") return drawDotCollectorMicro(); if (currentGame === "coin-chase") return drawCoinChaseMicro(); microHeader("MOVE LEFT / RIGHT TO CATCH THE FALLING LIGHTS"); ctx.fillStyle = "#121d2b"; ctx.fillRect(0, state.ground, W, H - state.ground); state.falling.forEach((item) => { ctx.fillStyle = item.color; ctx.beginPath(); ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = colors.yellow; ctx.fillRect(state.playerX - 34, state.ground - 10, 68, 10); ctx.fillStyle = colors.coral; ctx.fillRect(state.playerX - 24, state.ground - 22, 48, 12); }
  function drawStarStackMicro() { microHeader("CATCH THE STARS TO BUILD A STACK"); ctx.fillStyle = "#11182a"; ctx.fillRect(0, 60, W, H - 60); state.falling.forEach((item) => { ctx.fillStyle = colors.yellow; ctx.font = "24px serif"; ctx.fillText("★", item.x - 10, item.y + 8); }); ctx.fillStyle = colors.cyan; for (let i = 0; i < Math.min(7, state.hits); i++) ctx.fillRect(state.playerX - 30 + i * 10, state.ground - 35 - i * 5, 8, 8); ctx.fillStyle = colors.paper; ctx.fillRect(state.playerX - 36, state.ground - 8, 72, 8); }
  function drawCometCatchMicro() { microHeader("CATCH THE COMET TAIL"); ctx.fillStyle = "#151326"; ctx.fillRect(0, 60, W, H - 60); state.falling.forEach((item) => { ctx.strokeStyle = colors.pink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(item.x - 35, item.y - 18); ctx.lineTo(item.x, item.y); ctx.stroke(); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(item.x, item.y, item.size + 2, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = colors.cyan; ctx.beginPath(); ctx.arc(state.playerX, state.ground - 18, 22, Math.PI, 0); ctx.fill(); ctx.fillStyle = colors.coral; ctx.fillRect(state.playerX - 34, state.ground - 6, 68, 6); }
  function drawDotCollectorMicro() { microHeader("COLLECT DOTS ACROSS THE FIELD"); ctx.strokeStyle = "rgba(93,227,208,.2)"; for (let x = 60; x < W; x += 70) { ctx.beginPath(); ctx.moveTo(x, 70); ctx.lineTo(x, state.ground - 20); ctx.stroke(); } for (let y = 90; y < state.ground; y += 62) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 40, y); ctx.stroke(); } state.falling.forEach((item) => { ctx.fillStyle = colors.cyan; ctx.fillRect(item.x - 5, item.y - 5, 10, 10); }); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(state.playerX, state.ground - 18, 16, 0, Math.PI * 2); ctx.fill(); }
  function drawCoinChaseMicro() { microHeader("CHASE THE GOLD COINS"); ctx.fillStyle = "#242014"; ctx.fillRect(0, 60, W, H - 60); state.falling.forEach((item) => { ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(item.x, item.y, item.size + 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.ink; ctx.font = "bold 14px Courier New"; ctx.textAlign = "center"; ctx.fillText("$", item.x, item.y + 5); }); ctx.fillStyle = colors.coral; ctx.fillRect(state.playerX - 28, state.ground - 20, 56, 18); ctx.fillStyle = colors.cyan; ctx.fillRect(state.playerX - 22, state.ground - 17, 44, 4); ctx.textAlign = "left"; }
  function drawDodgeMicro() { if (currentGame === "star-runner") return drawStarRunnerMicro(); if (currentGame === "bright-side") return drawBrightSideMicro(); if (currentGame === "drift-drive") return drawDriftDriveMicro(); microHeader("LEFT / RIGHT TO DODGE THE SIGNALS"); const left = 160, width = 320, lane = width / 3; ctx.fillStyle = "#101b27"; ctx.fillRect(left, 58, width, H - 58); ctx.strokeStyle = "rgba(93,227,208,.3)"; for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(left + lane * i, 60); ctx.lineTo(left + lane * i, H); ctx.stroke(); } state.hazards.forEach((hazard) => { ctx.fillStyle = colors.coral; ctx.fillRect(left + hazard.lane * lane + lane / 2 - hazard.size / 2, hazard.y, hazard.size, hazard.size); }); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.moveTo(left + state.lane * lane + lane / 2, H - 40); ctx.lineTo(left + state.lane * lane + lane / 2 - 16, H - 15); ctx.lineTo(left + state.lane * lane + lane / 2 + 16, H - 15); ctx.closePath(); ctx.fill(); }
  function drawStarRunnerMicro() { microHeader("RUN BETWEEN THE STAR LANES"); ctx.fillStyle = "#101022"; ctx.fillRect(0, 58, W, H - 58); for (let i = 0; i < 24; i++) { ctx.fillStyle = i % 3 === 0 ? colors.yellow : colors.paper; ctx.fillRect((i * 83) % W, 76 + ((i * 41) % 180), 3, 3); } state.hazards.forEach((hazard) => { ctx.fillStyle = colors.pink; ctx.beginPath(); ctx.arc(160 + hazard.lane * 107 + 53, hazard.y, hazard.size / 2, 0, Math.PI * 2); ctx.fill(); }); ctx.fillStyle = colors.cyan; ctx.fillRect(155 + state.lane * 107, H - 42, 45, 10); }
  function drawBrightSideMicro() { microHeader("STAY ON THE BRIGHT SIDE"); ctx.fillStyle = colors.ink; ctx.fillRect(0, 58, W, H - 58); ctx.fillStyle = colors.yellow; ctx.fillRect(state.lane === 0 ? 0 : W / 2, 58, W / 2, H - 58); state.hazards.forEach((hazard) => { ctx.fillStyle = colors.coral; ctx.fillRect(hazard.lane === 0 ? 100 : W - 125, hazard.y, hazard.size, hazard.size); }); ctx.fillStyle = colors.cyan; ctx.beginPath(); ctx.arc(state.lane === 0 ? 115 : W - 115, H - 42, 15, 0, Math.PI * 2); ctx.fill(); }
  function drawDriftDriveMicro() { microHeader("DRIFT THROUGH THE CURVES"); ctx.fillStyle = "#12151d"; ctx.fillRect(0, 58, W, H - 58); ctx.strokeStyle = colors.yellow; ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(100, H); ctx.quadraticCurveTo(W / 2, 210, W - 100, 58); ctx.stroke(); ctx.strokeStyle = colors.ink; ctx.lineWidth = 13; ctx.beginPath(); ctx.moveTo(100, H); ctx.quadraticCurveTo(W / 2, 210, W - 100, 58); ctx.stroke(); state.hazards.forEach((hazard) => { ctx.fillStyle = colors.coral; ctx.fillRect(180 + hazard.lane * 100, hazard.y, hazard.size, hazard.size); }); ctx.fillStyle = colors.cyan; ctx.fillRect(95 + state.lane * 105, H - 50, 28, 14); }
  function drawStackMicro() { microHeader("PRESS SPACE TO DROP THE MOVING BLOCK"); state.stack.forEach((block, index) => { ctx.fillStyle = index % 2 ? colors.cyan : colors.coral; ctx.fillRect(block.x, block.y, block.width, 32); }); ctx.fillStyle = colors.yellow; ctx.fillRect(state.block.x, state.block.y, state.block.width, 32); }
  function drawNavigateMicro() { if (currentGame === "pixel-pilot") return drawPixelPilotMicro(); microHeader("USE ARROWS TO REACH THE EXIT"); const size = 45, gap = 7, ox = (W - state.gridCols * (size + gap)) / 2, oy = 85; for (let y = 0; y < state.gridRows; y++) for (let x = 0; x < state.gridCols; x++) { const isCursor = state.cursor.x === x && state.cursor.y === y; const isExit = state.exit.x === x && state.exit.y === y; roundRect(ox + x * (size + gap), oy + y * (size + gap), size, size, 2, isCursor ? colors.yellow : isExit ? colors.cyan : colors.panel, colors.cyan); if (isExit) { ctx.fillStyle = colors.ink; ctx.font = "14px Courier New"; ctx.textAlign = "center"; ctx.fillText("EXIT", ox + x * (size + gap) + size / 2, oy + y * (size + gap) + 29); } } ctx.textAlign = "left"; }
  function drawPixelPilotMicro() { microHeader("GUIDE THE BEACON TO THE LANDING PAD"); ctx.fillStyle = "#101a2a"; ctx.fillRect(0, 58, W, H - 58); ctx.strokeStyle = "rgba(93,227,208,.3)"; ctx.setLineDash([8, 12]); ctx.beginPath(); ctx.moveTo(88, 70); ctx.lineTo(88, 285); ctx.lineTo(500, 285); ctx.stroke(); ctx.setLineDash([]); const size = 42, gap = 8, ox = 90, oy = 92; for (let y = 0; y < state.gridRows; y++) for (let x = 0; x < state.gridCols; x++) { const isCursor = state.cursor.x === x && state.cursor.y === y; const isExit = state.exit.x === x && state.exit.y === y; if (isCursor || isExit) { ctx.fillStyle = isCursor ? colors.yellow : colors.coral; ctx.beginPath(); ctx.arc(ox + x * (size + gap), oy + y * (size + gap), isExit ? 18 : 13, 0, Math.PI * 2); ctx.fill(); } } ctx.fillStyle = colors.cyan; ctx.font = "bold 18px Courier New"; ctx.fillText("LAND", 455, 292); }
  function drawOrbitMicro() { if (currentGame === "pair-pilot") return drawPairPilotMicro(); microHeader("PRESS SPACE WHEN THE ORBIT HITS THE MARK"); const cx = W / 2, cy = 180, radius = 72; ctx.strokeStyle = colors.cyan; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = colors.coral; ctx.beginPath(); ctx.arc(cx + Math.cos(state.targetAngle) * radius, cy + Math.sin(state.targetAngle) * radius, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(cx + Math.cos(state.angle) * radius, cy + Math.sin(state.angle) * radius, 15, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("HIT THE RED MARKER", 18, 47); }
  function drawPairPilotMicro() { microHeader("PRESS SPACE WHEN THE PAIR MEETS"); const cx = W / 2, cy = 178, radius = 94; ctx.strokeStyle = "rgba(93,227,208,.3)"; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke(); const a = state.angle, b = state.targetAngle; ctx.fillStyle = colors.pink; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, 17, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(cx + Math.cos(b) * radius, cy + Math.sin(b) * radius, 11, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.paper; ctx.font = "11px Courier New"; ctx.fillText("PILOT THE MATCH", 18, 47); }
  function drawFishingMicro() { microHeader("PRESS SPACE WHEN THE BOBBER DIPS"); ctx.fillStyle = "#112334"; ctx.fillRect(0, 90, W, H - 90); ctx.strokeStyle = colors.cyan; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(140, 70); ctx.lineTo(140, state.bobberY - 10); ctx.lineTo(220, state.bobberY); ctx.stroke(); ctx.fillStyle = colors.coral; ctx.beginPath(); ctx.arc(220, state.bobberY, 10, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.yellow; ctx.fillRect(0, 290, W, 4); ctx.fillStyle = colors.cyan; ctx.font = "11px Courier New"; ctx.fillText("WAIT FOR THE RIPPLE", 18, 47); }
  function drawPaintMicro() { if (currentGame === "flip-finder") return drawFlipFinderMicro(); microHeader("PAINT THE TARGET SWATCH"); const x0 = 112, y0 = 85, size = 66, gap = 16; ctx.fillStyle = state.paintColors[state.paintGoal]; ctx.fillRect(W / 2 - 30, 45, 60, 18); ctx.fillStyle = colors.paper; ctx.font = "11px Courier New"; ctx.textAlign = "center"; ctx.fillText("TARGET", W / 2, 80); for (let i = 0; i < 9; i++) { const x = x0 + (i % 3) * (size + gap), y = y0 + Math.floor(i / 3) * (size + gap); ctx.fillStyle = state.paintColors[i]; ctx.fillRect(x, y, size, size); ctx.fillStyle = colors.ink; ctx.font = "12px Courier New"; ctx.fillText(String(i + 1), x + size / 2, y + size / 2 + 5); } ctx.textAlign = "left"; }
  function drawFlipFinderMicro() { microHeader("FIND THE TILE THAT FLIPS"); const pulse = Math.floor(performance.now() / 360) % 2; for (let i = 0; i < 9; i++) { const x = 112 + (i % 3) * 82, y = 85 + Math.floor(i / 3) * 82, isGoal = i === state.paintGoal, flipped = isGoal && pulse === 1; roundRect(x, y, 66, 66, 8, flipped ? colors.yellow : colors.panel, isGoal ? colors.coral : colors.cyan); ctx.fillStyle = flipped ? colors.ink : colors.dim; ctx.font = "bold 18px Courier New"; ctx.textAlign = "center"; ctx.fillText(flipped ? "!" : String(i + 1), x + 33, y + 40); } ctx.textAlign = "left"; }
  function drawRewireMicro() { if (currentGame === "echo-tiles") return drawEchoTilesMicro(); microHeader("CLICK THE LIVE NODE TO REWIRE THE CIRCUIT"); ctx.strokeStyle = "rgba(93,227,208,.35)"; ctx.lineWidth = 2; ctx.beginPath(); state.nodes.forEach((node, index) => { if (index === 0) ctx.moveTo(node.x, node.y); else ctx.lineTo(node.x, node.y); }); ctx.stroke(); state.nodes.forEach((node, index) => { ctx.fillStyle = index === state.liveNode ? colors.yellow : colors.panel; ctx.beginPath(); ctx.arc(node.x, node.y, index === state.liveNode ? 18 : 13, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = colors.cyan; ctx.stroke(); ctx.fillStyle = colors.ink; ctx.font = "11px Courier New"; ctx.textAlign = "center"; ctx.fillText(String(index + 1), node.x, node.y + 4); }); ctx.textAlign = "left"; }
  function drawEchoTilesMicro() { microHeader("REPEAT THE ECHOING TILE"); for (let i = 0; i < 5; i++) { const x = 90 + i * 95, y = 145 + Math.sin(performance.now() / 420 + i) * 28, live = i === state.liveNode; ctx.fillStyle = live ? colors.pink : colors.panel; ctx.beginPath(); ctx.arc(x, y, live ? 26 : 18, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.paper; ctx.font = "bold 14px Courier New"; ctx.textAlign = "center"; ctx.fillText(`E${i + 1}`, x, y + 5); } ctx.textAlign = "left"; }
  function drawDrumMicro() { if (currentGame === "rhythm-reactor") return drawRhythmReactorMicro(); microHeader("PRESS SPACE ON THE BEAT"); const cx = W / 2, cy = 178, pulse = 38 + state.beat * 38; ctx.strokeStyle = colors.cyan; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, pulse, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = colors.coral; ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.paper; ctx.font = "bold 14px Courier New"; ctx.textAlign = "center"; ctx.fillText("BEAT", cx, cy + 5); for (let i = 0; i < 4; i++) { ctx.fillStyle = i === Math.floor(state.beat * 4) ? colors.yellow : colors.panel; ctx.fillRect(150 + i * 90, 260, 60, 30); } ctx.textAlign = "left"; }
  function drawRhythmReactorMicro() { microHeader("CHARGE THE REACTOR ON THE BEAT"); const cx = W / 2, cy = 175, pulse = 48 + state.beat * 42; ctx.fillStyle = "#171322"; ctx.fillRect(0, 60, W, H - 60); ctx.strokeStyle = colors.coral; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, pulse, 0, Math.PI * 2); ctx.stroke(); ctx.strokeStyle = colors.yellow; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 70 - state.beat * 25, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = colors.cyan; ctx.beginPath(); ctx.arc(cx, cy, 25, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.ink; ctx.font = "bold 11px Courier New"; ctx.textAlign = "center"; ctx.fillText("CORE", cx, cy + 4); ctx.textAlign = "left"; }
  function drawShooterMicro() { if (currentGame === "neon-ninja") return drawNeonNinjaMicro(); if (currentGame === "laser-pop") return drawLaserPopMicro(); microHeader("AIM + CLICK THE TARGET"); const target = state.target; ctx.strokeStyle = colors.cyan; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(target.x - target.size - 10, target.y); ctx.lineTo(target.x + target.size + 10, target.y); ctx.moveTo(target.x, target.y - target.size - 10); ctx.lineTo(target.x, target.y + target.size + 10); ctx.stroke(); ctx.strokeStyle = colors.coral; ctx.beginPath(); ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(target.x, target.y, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText(`SHOTS ${state.shots || 0}`, 18, H - 20); }
  function drawNeonNinjaMicro() { microHeader("SLICE THE GLOWING MARK"); ctx.fillStyle = "#151022"; ctx.fillRect(0, 58, W, H - 58); ctx.strokeStyle = colors.pink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(100, 275); ctx.lineTo(500, 85); ctx.stroke(); const target = state.target; ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.moveTo(target.x, target.y - target.size); ctx.lineTo(target.x + target.size, target.y); ctx.lineTo(target.x, target.y + target.size); ctx.lineTo(target.x - target.size, target.y); ctx.closePath(); ctx.fill(); ctx.fillStyle = colors.cyan; ctx.font = "11px Courier New"; ctx.fillText(`STRIKES ${state.hits || 0}`, 18, H - 20); }
  function drawLaserPopMicro() { microHeader("POP THE LASER FLARE"); const target = state.target; ctx.fillStyle = "#111c25"; ctx.fillRect(0, 58, W, H - 58); for (let i = 0; i < 5; i++) { ctx.strokeStyle = i % 2 ? colors.cyan : colors.coral; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(70 + i * 110, 70); ctx.lineTo(180 + i * 75, 285); ctx.stroke(); } ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(target.x, target.y, target.size + 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.ink; ctx.beginPath(); ctx.arc(target.x, target.y, 5, 0, Math.PI * 2); ctx.fill(); }
  function drawSortMicro() { if (currentGame === "word-grid") return drawWordGridMicro(); microHeader("SORT THE CALLED COLOR"); const color = state.sortColors[state.sortGoal]; ctx.fillStyle = color; ctx.fillRect(W / 2 - 28, 52, 56, 20); ctx.fillStyle = colors.paper; ctx.font = "11px Courier New"; ctx.textAlign = "center"; ctx.fillText("SORT THIS", W / 2, 42); for (let i = 0; i < 4; i++) { ctx.fillStyle = state.sortColors[i]; ctx.fillRect(100 + i * 115, 150, 75, 75); ctx.fillStyle = colors.ink; ctx.font = "bold 16px Courier New"; ctx.fillText(String(i + 1), 137 + i * 115, 195); } ctx.textAlign = "left"; }
  function drawWordGridMicro() { microHeader("FIND THE LETTER TILE"); const letters = ["A", "R", "C", "D"]; const goal = letters[state.sortGoal]; ctx.fillStyle = colors.yellow; ctx.font = "bold 30px Courier New"; ctx.textAlign = "center"; ctx.fillText(goal, W / 2, 68); for (let i = 0; i < 4; i++) { const x = 115 + i * 105; ctx.fillStyle = state.sortColors[i]; ctx.fillRect(x, 145, 70, 70); ctx.fillStyle = colors.ink; ctx.font = "bold 28px Courier New"; ctx.fillText(letters[i], x + 35, 190); } ctx.textAlign = "left"; }
  function drawBalanceMicro() { microHeader("USE LEFT / RIGHT TO STAY BALANCED"); const x = W / 2 + state.balance * 170; ctx.fillStyle = colors.panel; ctx.fillRect(110, 176, 420, 22); ctx.fillStyle = colors.green; ctx.fillRect(280, 176, 80, 22); ctx.fillStyle = colors.yellow; ctx.fillRect(x - 8, 160, 16, 54); ctx.strokeStyle = colors.coral; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(110, 220); ctx.lineTo(530, 220); ctx.stroke(); ctx.fillStyle = colors.dim; ctx.font = "11px Courier New"; ctx.fillText("KEEP THE MARK IN THE GREEN ZONE", 18, 47); }
  function drawGravityMicro() { if (currentGame === "dot-collector") return drawDotCollectorGravityMicro(); microHeader("USE ARROWS TO MOVE THE GRAVITY BALL"); ctx.strokeStyle = "rgba(93,227,208,.3)"; ctx.strokeRect(28, 65, W - 56, H - 100); ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(state.gravityStar.x, state.gravityStar.y, 12, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.pink; ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, 15, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.ink; ctx.beginPath(); ctx.arc(state.ball.x - 5, state.ball.y - 3, 3, 0, Math.PI * 2); ctx.arc(state.ball.x + 5, state.ball.y - 3, 3, 0, Math.PI * 2); ctx.fill(); }
  function drawDotCollectorGravityMicro() { microHeader("COLLECT THE DOTS WITH MOMENTUM"); ctx.fillStyle = "#101922"; ctx.fillRect(0, 58, W, H - 58); for (let i = 0; i < 18; i++) { const x = 48 + ((i * 79) % 500), y = 82 + ((i * 43) % 195); ctx.fillStyle = i % 3 === 0 ? colors.pink : colors.cyan; ctx.fillRect(x, y, 7, 7); } ctx.fillStyle = colors.yellow; ctx.beginPath(); ctx.arc(state.ball.x, state.ball.y, 16, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = colors.paper; ctx.font = "11px Courier New"; ctx.fillText(`DOTS ${state.hits || 0}`, 18, H - 20); }
  function drawScannerItem(item, x, y, pixel = 3) {
    item.pixels.forEach((row, r) => [...row].forEach((value, c) => {
      if (value === "0") return;
      ctx.fillStyle = value === "2" ? "#ffffff" : value === "3" ? item.accent : item.color;
      ctx.fillRect(x + (c - 4) * pixel, y + (r - 4) * pixel, pixel, pixel);
    }));
  }
  function drawScannerMicro() {
    microHeader(`${state.hits}/${state.scanObjects.length} OBJECTS FOUND`);
    state.scanObjects.forEach((item, index) => {
      const width = (W - 72) / 7, x = 36 + index % 7 * width, y = 70 + Math.floor(index / 7) * 24;
      ctx.globalAlpha = item.found ? .4 : 1;
      drawScannerItem(item, x + 8, y, 1.75);
      ctx.fillStyle = item.found ? colors.green : colors.paper; ctx.font = "9px Courier New";
      ctx.fillText(item.name, x + 19, y + 4);
      if (item.found) { ctx.strokeStyle = colors.green; ctx.beginPath(); ctx.moveTo(x + 19, y + 7); ctx.lineTo(x + width - 6, y + 7); ctx.stroke(); }
    });
    ctx.globalAlpha = 1;
    const box = state.searchBox, beam = state.scanner, reading = detectorReading();
    const signalColor = reading.strength >= 80 ? colors.green : reading.strength >= 40 ? colors.yellow : colors.coral;
    ctx.fillStyle = "#111c24"; ctx.fillRect(box.x, box.y, box.width, box.height);
    ctx.strokeStyle = "#5de3d0"; ctx.lineWidth = 2; ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.save(); ctx.beginPath(); ctx.rect(box.x + 1, box.y + 1, box.width - 2, box.height - 2); ctx.clip();
    ctx.fillStyle = "#293842";
    for (let x = box.x + 16; x < box.x + box.width; x += 26) for (let y = box.y + 16; y < box.y + box.height; y += 26) ctx.fillRect(x, y, 2, 2);
    // Buried items are never drawn, even with upgrades. Only dug-up treasures are visible.
    state.scanObjects.filter((item) => item.found).forEach((item) => {
      ctx.strokeStyle = "#718985"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(item.x, item.y, 21, 0, Math.PI * 2); ctx.stroke();
      drawScannerItem(item, item.x, item.y);
    });
    if (beam.active) {
      ctx.strokeStyle = "#99a6ad"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(beam.x, beam.y); ctx.lineTo(beam.x + 30, beam.y - 45); ctx.stroke();
      ctx.strokeStyle = signalColor; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(beam.x, beam.y, 20, 12, -.3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(beam.x, beam.y, 13, 7, -.3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = colors.panel; ctx.fillRect(beam.x + 19, beam.y - 53, 25, 16);
      ctx.fillStyle = signalColor; ctx.fillRect(beam.x + 24, beam.y - 49, 15, 8);
      if (state.detectorPulse > 0) {
        ctx.globalAlpha = state.detectorPulse / 240; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(beam.x, beam.y, 24 + (240 - state.detectorPulse) / 12, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore(); ctx.font = "bold 11px Courier New"; ctx.fillStyle = state.foundFlash > 0 ? colors.yellow : colors.paper;
    ctx.fillText(state.foundFlash > 0 ? state.scanNotice : "METAL DETECTOR", 36, H - 17);
    const segments = 16, filled = Math.ceil(reading.strength * segments / 100);
    for (let i = 0; i < segments; i++) {
      ctx.fillStyle = i < filled ? signalColor : "#28343f";
      ctx.fillRect(170 + i * 23, H - 30, 18, 15);
    }
    ctx.textAlign = "right"; ctx.fillStyle = signalColor; ctx.font = "bold 16px Courier New";
    ctx.fillText(`${reading.strength}%`, W - 36, H - 17); ctx.textAlign = "left";
  }
  function drawDefenderMicro() { microHeader("MOVE + PRESS SPACE TO FIRE"); ctx.fillStyle = "#101b27"; ctx.fillRect(0, 55, W, H - 55); state.enemies.forEach((enemy) => { ctx.fillStyle = colors.coral; ctx.fillRect(enemy.x - enemy.size, enemy.y - enemy.size, enemy.size * 2, enemy.size * 2); }); state.shots.forEach((shot) => { ctx.fillStyle = colors.yellow; ctx.fillRect(shot.x - 2, shot.y - 10, 4, 10); }); ctx.fillStyle = colors.cyan; ctx.beginPath(); ctx.moveTo(state.shipX, H - 62); ctx.lineTo(state.shipX - 17, H - 35); ctx.lineTo(state.shipX + 17, H - 35); ctx.closePath(); ctx.fill(); }
  function clickMicro(x, y) { if (state.variant === "target") { const target = state.target; if (Math.hypot(x - target.x, y - target.y) <= target.size + 16) { state.hits++; state.combo++; setScore(score + 25 + state.combo * 5); tone(540 + state.combo * 20, .045); placeMicroTarget(); state.relocate = 0; } else { state.combo = 0; tone(150, .05, "sawtooth"); } } else if (state.variant === "timing") hitTiming(); else if (state.variant === "typing") submitMicroTyping(); else if (state.variant === "sequence") { const size = currentGame === "memory-rush" ? 62 : 70, gap = currentGame === "memory-rush" ? 15 : 22, cols = currentGame === "memory-rush" ? 3 : 2, ox = (W - size * cols - gap * (cols - 1)) / 2, oy = currentGame === "memory-rush" ? 105 : 100; const col = Math.floor((x - ox) / (size + gap)); const row = Math.floor((y - oy) / (size + gap)); if (col >= 0 && col < cols && row >= 0 && row < 2) selectSequence(row * cols + col); } else if (state.variant === "catch") state.playerX = clamp(x, 35, W - 35); else if (state.variant === "dodge") state.lane = clamp(Math.floor((x - 160) / (320 / 3)), 0, 2); else if (state.variant === "stack") dropStack(); else if (state.variant === "navigate") { const size = 45, gap = 7, ox = (W - state.gridCols * (size + gap)) / 2, oy = 85; moveNavigate(Math.sign(x - (ox + state.cursor.x * (size + gap) + size / 2)), Math.sign(y - (oy + state.cursor.y * (size + gap) + size / 2))); } else if (state.variant === "orbit") hitOrbit(); else if (state.variant === "fishing") hitFishing(); else if (state.variant === "paint") { const col = Math.floor((x - 112) / 82), row = Math.floor((y - 85) / 82); if (col >= 0 && col < 3 && row >= 0 && row < 3) paintPick(row * 3 + col); } else if (state.variant === "rewire") { let nearest = 0, distance = Infinity; state.nodes.forEach((node, index) => { const nextDistance = Math.hypot(x - node.x, y - node.y); if (nextDistance < distance) { distance = nextDistance; nearest = index; } }); if (distance < 35) rewirePick(nearest); } else if (state.variant === "drum") hitDrum(); else if (state.variant === "shooter") hitShooter(x, y); else if (state.variant === "sort") { const index = Math.floor((x - 100) / 115); if (index >= 0 && index < 4) sortPick(index); } else if (state.variant === "scanner") hitScanner(x, y); else if (state.variant === "defender") { if (x > 5 && x < W - 5) state.shipX = clamp(x, 30, W - 30); fireDefender(); } }

  function canvasPosition(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * W / rect.width, y: (event.clientY - rect.top) * H / rect.height }; }
  const ownerModal = document.getElementById("ownerModal");
  const ownerButton = document.getElementById("ownerButton");
  let ownerWasPaused = true;
  function applyOwnerMode() {
    ownerButton.textContent = ownerVerified ? "OWNER ✓" : "OWNER";
    document.body.classList.toggle("is-owner", ownerVerified);
    setPoints(points); applyShopEffects(); renderShop(); powers.refresh();
  }
  function openOwner() {
    if (!shopModal.hidden) closeShop();
    ownerWasPaused = paused || !gameRunning;
    if (gameRunning && !paused) togglePause();
    ownerModal.hidden = false;
    document.getElementById("ownerForm").hidden = ownerVerified;
    document.getElementById("ownerResult").textContent = ownerVerified ? "Congrats! We verified you're the owner. Unlimited points and easy mode are active." : "";
    (ownerVerified ? document.getElementById("ownerClose") : document.getElementById("ownerName")).focus();
  }
  function closeOwner() {
    ownerModal.hidden = true;
    if (gameRunning && !ownerWasPaused && paused) togglePause();
    ownerButton.focus();
  }
  ownerButton.addEventListener("click", openOwner);
  document.getElementById("ownerClose").addEventListener("click", closeOwner);
  document.querySelector("[data-close-owner]").addEventListener("click", closeOwner);
  document.getElementById("ownerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = new FormData(event.currentTarget);
    const correct = Object.entries({ name: "felicia", color: "pink", secondColor: "purple", thirdColor: "blue", gender: "girl" })
      .every(([key, value]) => String(answers.get(key) || "").trim().toLowerCase() === value);
    if (!correct) { document.getElementById("ownerResult").textContent = "Those answers don't match. Try again."; return; }
    ownerVerified = true;
    event.currentTarget.hidden = true;
    document.getElementById("ownerResult").innerHTML = "<strong>Congrats! We verified you're the owner.</strong><span>Unlimited points and easy mode are now active.</span>";
    applyOwnerMode(); powers.toast("OWNER VERIFIED: UNLIMITED POINTS + EASY MODE");
    document.getElementById("ownerClose").focus(); drawCurrent();
  });
  document.addEventListener("keydown", (event) => {
    const modal = !ownerModal.hidden ? ownerModal : !shopModal.hidden ? shopModal : null;
    if (!modal) return;
    if (event.key === "Escape") { event.preventDefault(); if (modal === ownerModal) closeOwner(); else closeShop(); }
    if (event.key === "Tab") {
      const controls = [...modal.querySelectorAll("button, input, [tabindex='0']")].filter((control) => !control.disabled && control.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.getElementById("exportProfile").addEventListener("click", () => {
    if (!hasShopEffect("cloud")) return;
    const profile = { format: "pixel-play-save", version: 1, points, bestScore, gamesPlayed, ownedShopItems, equippedShopItems };
    const url = URL.createObjectURL(new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" }));
    const download = document.createElement("a"); download.href = url; download.download = "pixel-play-save.json";
    document.body.append(download); download.click(); download.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    shopStatus.textContent = "YOUR COMPLETE ARCADE SAVE HAS BEEN DOWNLOADED.";
  });
  document.getElementById("importProfile").addEventListener("change", async (event) => {
    if (!hasShopEffect("cloud") || !event.target.files[0]) return;
    try {
      const file = event.target.files[0]; if (file.size > 100000) throw new Error("Save is too large.");
      const saved = JSON.parse(await file.text());
      if (saved.format !== "pixel-play-save" || saved.version !== 1 || ![saved.points, saved.bestScore, saved.gamesPlayed].every((n) => Number.isSafeInteger(n) && n >= 0) || !Array.isArray(saved.ownedShopItems) || !Array.isArray(saved.equippedShopItems)) throw new Error("Choose a valid Pixel Play save.");
      const ids = new Set(shopItems.map((item) => item.id));
      ownedShopItems = [...new Set(saved.ownedShopItems.filter((id) => ids.has(id)))];
      if (ownedShopItems.includes("pixel-vip")) ownedShopItems = shopItems.map((item) => item.id);
      equippedShopItems = [];
      saved.equippedShopItems.filter((id) => ownedShopItems.includes(id)).forEach((id) => {
        const item = shopItems.find((entry) => entry.id === id);
        if (item.group) equippedShopItems = equippedShopItems.filter((other) => shopItems.find((entry) => entry.id === other)?.group !== item.group);
        if (!equippedShopItems.includes(id)) equippedShopItems.push(id);
      });
      bestScore = saved.bestScore; gamesPlayed = saved.gamesPlayed; setPoints(saved.points); saveShopItems();
      localStorage.setItem("pixelPlayBest", bestScore); localStorage.setItem("pixelPlayGames", gamesPlayed);
      cancelAnimationFrame(animationId); gameRunning = false; paused = false; pauseBadge.hidden = true;
      initializeGame(currentGame); setScore(0); powers.reset(); applyShopEffects(); renderShop(); drawCurrent(); showOverlay(games.find((game) => game.id === currentGame));
      shopStatus.textContent = "SAVE RESTORED. POINTS, PURCHASES, AND RECORDS ARE BACK.";
    } catch (error) { shopStatus.textContent = error.message; }
    event.target.value = "";
  });
  canvas.addEventListener("pointermove", (event) => { const p = canvasPosition(event); powers.pointer(p.x, p.y); moveScanner(p.x, p.y); });
  canvas.addEventListener("pointerleave", () => { if (state.variant === "scanner" && !paused) state.scanner.active = false; });
  canvas.addEventListener("pointerdown", (event) => { if (state.variant === "scanner") { const p = canvasPosition(event); moveScanner(p.x, p.y); } });
  canvas.addEventListener("click", (event) => { const p = canvasPosition(event); if (powers.collectAt(p.x, p.y)) event.stopImmediatePropagation(); });
  document.getElementById("bonusStageButton").addEventListener("click", () => { if (powers.canBonus()) powers.startBonus(); });
  function handleKey(event) {
    if (!shopModal.hidden || !ownerModal.hidden || event.target?.isContentEditable || event.target?.matches("input, textarea, select")) return;
    const key = event.key, lower = key.toLowerCase();
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(key)) {
      event.preventDefault();
      event.stopPropagation?.();
    }
    if (lower === "p" && currentGame !== "word" && state.variant !== "typing") togglePause();
    if (!gameRunning || paused || powers.isBonus()) return;
    if (currentGame === "maze") {
      const dirs = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] };
      const dir = dirs[key] || dirs[lower]; if (dir) state.player.next = { x: dir[0], y: dir[1] };
    }
    if (currentGame === "blocks") {
      if ((key === "ArrowLeft" || lower === "a") && !collides(state.piece, -1, 0)) state.piece.x--;
      if ((key === "ArrowRight" || lower === "d") && !collides(state.piece, 1, 0)) state.piece.x++;
      if ((key === "ArrowDown" || lower === "s") && !collides(state.piece, 0, 1)) state.piece.y++;
      if (key === "ArrowUp" || lower === "w") rotatePiece();
      if (key === " ") { while (!collides(state.piece, 0, 1)) state.piece.y++; lockPiece(); }
    }
    if (currentGame === "math" && /^[1-4]$/.test(key)) answerMath(Number(key) - 1);
    if (currentGame === "word") {
      if (key === "Enter") submitWord();
      else if (key === "Backspace") state.typed = state.typed.slice(0, -1);
      else if (/^[a-zA-Z]$/.test(key) && state.typed.length < 12) state.typed += key.toUpperCase();
    }
    if (currentGame === "color" && /^[1-5]$/.test(key)) answerColor(Number(key) - 1);
    const left = key === "ArrowLeft" || lower === "a", right = key === "ArrowRight" || lower === "d";
    if (currentGame === "orbit" && (left || right)) state.shipX = clamp(state.shipX + (left ? -22 : 22) * powers.steering(), 24, W - 24);
    if (currentGame === "neon" && (left || right)) state.lane = clamp(state.lane + (left ? -1 : 1), 0, 2);
    if (currentGame === "jelly-jump" && !event.repeat && (key === "ArrowUp" || lower === "w" || key === " ")) jumpJelly();
    if (state.mode === "micro") {
      if (state.variant === "typing") {
        if (key === "Enter") submitMicroTyping();
        else if (key === "Backspace") state.typed = state.typed.slice(0, -1);
        else if (/^[a-zA-Z0-9-]$/.test(key) && state.typed.length < 16) state.typed += key.toUpperCase();
      } else if (key === " " || key === "Enter") {
        if (["timing", "stack", "orbit", "fishing", "drum"].includes(state.variant)) clickMicro(0, 0);
        if (state.variant === "scanner") hitScanner();
        if (state.variant === "defender") fireDefender();
      }
      if (state.variant === "scanner") {
        const dx = left ? -24 : right ? 24 : 0, dy = key === "ArrowUp" ? -24 : key === "ArrowDown" ? 24 : 0;
        if (dx || dy) moveScanner(state.scanner.x + dx, state.scanner.y + dy);
      }
      if (state.variant === "sequence" && /^[1-6]$/.test(key)) selectSequence(Number(key) - 1);
      if (state.variant === "catch" && (left || right)) state.playerX = clamp(state.playerX + (left ? -46 : 46) * powers.steering(), 35, W - 35);
      if (state.variant === "dodge" && (left || right)) state.lane = clamp(state.lane + (left ? -1 : 1), 0, 2);
      if (state.variant === "navigate") {
        if (left) moveNavigate(-1, 0); if (right) moveNavigate(1, 0);
        if (key === "ArrowUp" || lower === "w") moveNavigate(0, -1);
        if (key === "ArrowDown" || lower === "s") moveNavigate(0, 1);
      }
      if (state.variant === "paint" && /^[1-9]$/.test(key)) paintPick(Number(key) - 1);
      if (state.variant === "rewire" && /^[1-5]$/.test(key)) rewirePick(Number(key) - 1);
      if (state.variant === "sort" && /^[1-4]$/.test(key)) sortPick(Number(key) - 1);
      if (state.variant === "balance" && (left || right)) balanceControl(left ? -1 : 1);
      if (state.variant === "gravity") {
        if (left) gravityControl(-1, 0); if (right) gravityControl(1, 0);
        if (key === "ArrowUp" || lower === "w") gravityControl(0, -1);
        if (key === "ArrowDown" || lower === "s") gravityControl(0, 1);
      }
      if (state.variant === "defender" && (left || right)) state.shipX = clamp(state.shipX + (left ? -25 : 25) * powers.movement(), 24, W - 24);
    }
  }
  function togglePause() { if (!gameRunning) return; paused = !paused; pauseBadge.hidden = !paused; if (!paused) lastTime = performance.now(); }
  function selectGame(id) { if (id === currentGame && !startOverlay.classList.contains("is-hidden")) return; cancelAnimationFrame(animationId); gameRunning = false; paused = false; currentGame = id; canvas.classList.toggle("is-search-game", id === "signal-scan"); const game = games.find((item) => item.id === id); titleLabel.textContent = game.title; gameLabel.textContent = game.title.toUpperCase(); gameTag.textContent = game.tag; objectiveLabel.textContent = game.objective; tipText.textContent = game.tip; livesLabel.textContent = id === "maze" ? "♥ ♥ ♥" : id === "blocks" ? "LEVEL 01" : "READY"; canvas.setAttribute("aria-label", `${game.title} game canvas`); showOverlay(game); initializeGame(id); powers.reset(); document.getElementById("bonusStageButton").hidden = true; drawCurrent(); document.querySelectorAll(".game-card").forEach((card) => card.classList.toggle("is-selected", card.dataset.game === id)); }

  function applyFilter(filter) { document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("is-active", item.dataset.filter === filter)); document.querySelectorAll(".game-card").forEach((card) => { const isFilteredOut = filter !== "all" && card.dataset.category !== filter; card.hidden = isFilteredOut; card.classList.toggle("is-filtered-out", isFilteredOut); }); }
  function buildCards() { const wrap = document.getElementById("gameCards"); wrap.innerHTML = games.map((game) => `<button class="game-card${game.id === currentGame ? " is-selected" : ""}" type="button" data-game="${game.id}" data-category="${game.category}"><span class="game-number">${game.number}</span><span><h3>${game.title}</h3><p>${game.desc}</p></span><span class="game-meta"><i class="mini-signal"></i>${game.category}</span></button>`).join(""); wrap.addEventListener("click", (event) => { const card = event.target.closest(".game-card"); if (card && !card.hidden) { selectGame(card.dataset.game); document.getElementById("cabinet").scrollIntoView({ behavior: "smooth", block: "center" }); } }); }
  document.querySelector(".filter-row").addEventListener("click", (event) => { const button = event.target.closest(".filter-button"); if (button) applyFilter(button.dataset.filter); });
  startButton.addEventListener("click", beginGame); document.getElementById("resetButton").addEventListener("click", resetProgress); document.getElementById("pauseButton").addEventListener("click", togglePause); document.getElementById("actionButton").addEventListener("click", () => { if (!gameRunning) beginGame(); else if (paused || powers.isBonus()) return; else if (currentGame === "math") answerMath(state.focus ?? 0); else if (currentGame === "word") submitWord(); else if (currentGame === "blocks") { while (!collides(state.piece, 0, 1)) state.piece.y++; lockPiece(); } else if (state.variant === "scanner") hitScanner(); else if (state.mode === "micro") clickMicro(state.target.x, state.target.y); });
  dpadButtons.forEach((button) => button.addEventListener("click", () => { handleKey({ key: button.dataset.key, preventDefault() {} }); }));
  canvas.addEventListener("click", (event) => { if (!gameRunning || paused) return; const point = canvasPosition(event); if (currentGame === "reflex") clickReflex(point.x, point.y); if (currentGame === "memory") { const size = 54, gap = 12, ox = (W - 4 * size - 3 * gap) / 2, oy = 47; const col = Math.floor((point.x - ox) / (size + gap)); const row = Math.floor((point.y - oy) / (size + gap)); if (col >= 0 && col < 4 && row >= 0 && row < 3) clickMemory(row * 4 + col); } if (currentGame === "math") { const i = Math.floor((point.x - 90) / 120); answerMath(i); } if (currentGame === "color") { const i = Math.floor((point.x - 78) / 102); answerColor(i); } if (state.mode === "micro") clickMicro(point.x, point.y); });
  window.addEventListener("keydown", handleKey, { capture: true, passive: false }); document.getElementById("soundToggle").addEventListener("click", (event) => { soundOn = !soundOn; event.currentTarget.setAttribute("aria-pressed", String(soundOn)); event.currentTarget.querySelector(".sound-copy").textContent = soundOn ? "SOUND ON" : "SOUND OFF"; if (soundOn) tone(620, .08); });
  document.getElementById("shopToggle").addEventListener("click", openShop); document.getElementById("shopClose").addEventListener("click", closeShop); document.querySelector("[data-close-shop]").addEventListener("click", closeShop); document.getElementById("shopItems").addEventListener("click", (event) => { const item = event.target.closest("[data-shop-item]"); if (item) buyShopItem(item.dataset.shopItem); }); document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !shopModal.hidden) closeShop(); });
  canvas.addEventListener("click", () => { if (currentGame === "jelly-jump") jumpJelly(); });
  canvas.addEventListener("pointerdown", () => canvas.focus({ preventScroll: true }));
  document.getElementById("actionButton").addEventListener("click", () => { if (currentGame === "jelly-jump") jumpJelly(); });
  setInterval(() => { document.getElementById("clockLabel").textContent = new Date().toLocaleTimeString([], { hour12: false }); }, 1000);
  saveShopItems(); applyOwnerMode(); buildCards(); applyFilter("all"); selectGame("maze");
})();
