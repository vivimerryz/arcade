(() => {
  "use strict";

  const catalog = {
    magnet: { desc: "Triple round rewards. Pull every bonus token toward you.", boost: "3X REWARDS" },
    turbo: { desc: "Double movement and unleash a neon speed trail.", boost: "2X MOVEMENT" },
    sunset: { desc: "Turn the whole arcade into a pink sunset with a giant setting sun.", boost: "SUNSET WORLD", group: "theme" },
    scanline: { desc: "Transform the screen into an animated retro CRT with scanlines.", boost: "CRT SCREEN" },
    crown: { desc: "Wear a golden crown and start every round with 1,000 score.", boost: "+1,000 START" },
    cherry: { desc: "Unlock Cherry Bomb: wipe out hazards every 10 seconds.", boost: "BOMB POWER" },
    chrome: { desc: "A silver cabinet and five shields against collisions per round.", boost: "5 SHIELDS" },
    lucky: { desc: "Every fifth scoring move drops a 200-point lucky token.", boost: "LUCKY JACKPOTS" },
    bubble: { desc: "Double target sizes in Reflex Rush and Bubble Burst, plus Signal Scan detection and digging range.", boost: "GIANT TARGETS" },
    grid: { desc: "Reveal a route through Maze Munch and a landing guide in Block Party.", boost: "ROUTE VISION" },
    midnight: { desc: "A moonlit world plus enemies and hazards moving at half speed.", boost: "50% SLOW MOTION", group: "theme" },
    mint: { desc: "A bright mint world. Regenerate a shield every 10 seconds.", boost: "SHIELD REGEN", group: "theme" },
    coral: { desc: "A scarlet world. Each shielded collision awards 500 score.", boost: "COUNTERATTACK", group: "theme" },
    spark: { desc: "Rainbow explosions on every scoring move and a rainbow player trail.", boost: "RAINBOW BURSTS" },
    heart: { desc: "Nine Maze Munch lives. Three extra shields in other games.", boost: "9 LIVES" },
    boss: { desc: "Boss mode: hazards move twice as fast and add +2 to your score multiplier.", boost: "BOSS MODE" },
    gold: { desc: "A gold score banner. Finish a round with score to earn 300 extra points.", boost: "+300 FINISH" },
    combo: { desc: "Each five scoring moves adds +1 multiplier, up to +5 per round.", boost: "COMBO MULTIPLIER" },
    p2: { desc: "A drone collects bonus tokens and fires extra shots in Last Light.", boost: "DRONE COMPANION" },
    sidequest: { desc: "Collect five bonus tokens in a round to earn a 500-point quest reward.", boost: "500-POINT QUEST" },
    moon: { desc: "Double-jump in Jelly Jump. Fly upward in Dot Collector with stronger thrust.", boost: "DOUBLE JUMP" },
    prism: { desc: "A multicolor prism world and timing windows twice as forgiving.", boost: "PRISM PRECISION", group: "theme" },
    blossom: { desc: "A sweeping pink petal trail follows your player through every game.", boost: "PETAL TRAIL" },
    jacket: { desc: "A striped red racing cabinet with three extra shields per round.", boost: "ARMORED CABINET", group: "theme" },
    goggles: { desc: "Boost metal-detector range by 50%. Reveal Memory Grid cards, correct quiz answers, and sequence steps.", boost: "ANSWER VISION" },
    comet: { desc: "A comet crosses the screen every eight seconds and grants 500 score.", boost: "COMET SHOWERS" },
    patch: { desc: "Unlock Supercharge: +8 score multiplier for five seconds, every 15 seconds.", boost: "SUPERCHARGE" },
    frame: { desc: "A large live record board tracks your best score, round score, and games played.", boost: "LIVE RECORD BOARD" },
    keys: { desc: "Multicolor controls and double the tolerance for timing games.", boost: "PERFECT TIMING" },
    petals: { desc: "A screen-wide petal shower restores two shields every 15 seconds.", boost: "PETAL HEALING" },
    music: { desc: "An original looping boss soundtrack plays during rounds when sound is on.", boost: "BOSS SOUNDTRACK" },
    lanes: { desc: "Auto-clear nearby hazards in Neon Run and Laser Lane every four seconds.", boost: "SAFE LANES" },
    crystal: { desc: "Crystal target rings and bonus tokens worth three times their normal value.", boost: "3X BONUS TOKENS" },
    starfield: { desc: "A moving space world with twice as many collectible bonus tokens.", boost: "SPACE WORLD", group: "theme" },
    cherrycrown: { desc: "A giant cherry crown plus a 1,000-score blossom storm every 20 seconds.", boost: "CHERRY STORMS" },
    hoodie: { desc: "An electric blue world and 12 seconds of invincibility at round start.", boost: "12-SECOND SHIELD", group: "theme" },
    continue: { desc: "Three automatic revives per round. Keep your score when you crash.", boost: "3 REVIVES" },
    timer: { desc: "Round clocks drain three times slower while gameplay keeps moving normally.", boost: "3X ROUND TIME" },
    legend: { desc: "A giant legend banner and +4 added to your score multiplier.", boost: "+4 MULTIPLIER" },
    firefly: { desc: "A swarm follows your player and draws bright danger rings around hazards.", boost: "FIREFLY SWARM" },
    galaxy: { desc: "An animated galaxy world and 500 extra points each round.", boost: "+500 PER ROUND", group: "theme" },
    aura: { desc: "A huge player forcefield grants five seconds of immunity every 15 seconds.", boost: "FORCEFIELD" },
    joystick: { desc: "Triple left/right steering distance in Orbit Dodger and Star Stack.", boost: "3X STEERING" },
    pinkpower: { desc: "Double all points earned from rounds, bonus tokens, and quests.", boost: "2X EARNED POINTS" },
    secret: { desc: "Unlock a 20-second bonus stage after any scored round. Collect gold tokens.", boost: "BONUS STAGE" },
    champion: { desc: "A champion scoreboard and +2 added to your score multiplier.", boost: "+2 MULTIPLIER" },
    cloud: { desc: "Download and restore your entire profile using the new Save Vault controls.", boost: "SAVE VAULT", name: "Save Vault" },
    fireworks: { desc: "Huge animated firework displays whenever your score beats the previous record.", boost: "RECORD FIREWORKS" },
    master: { desc: "+9 score multiplier. Unlock three screen-clearing Master Blasts per round.", boost: "MASTER BLAST" },
    vip: { desc: "Own every item, equip all compatible powers, and double round rewards.", boost: "ALL 50 ITEMS" }
  };

  window.ArcadePowerCatalog = catalog;
  window.createArcadePowers = (api) => {
    const { ctx, width: W, height: H, has, getState, getGame, gainScore, earnPoints } = api;
    let round;
    let particles = [];
    let tokens = [];
    let cursor = { x: W / 2, y: H / 2 };
    let noticeTimer = 0;
    const notice = document.getElementById("upgradeNotice");
    const stats = document.getElementById("powerStats");
    const powerButtons = document.getElementById("powerButtons");
    const recordBoard = document.getElementById("recordBoard");
    const palettes = {
      sunset: ["#260f2a", "#ff75b5", "#ffc857"], midnight: ["#080b18", "#a2bfff", "#e3edff"],
      mint: ["#083025", "#8bffca", "#ffde5d"], coral: ["#350e1a", "#ff586c", "#ffe36d"],
      prism: ["#211b29", "#ffa6cb", "#7ef2d7"], jacket: ["#2b1520", "#ff5b68", "#ffffff"],
      starfield: ["#090b20", "#91b6ff", "#fcdf65"], hoodie: ["#071c28", "#57dcff", "#ff7faa"],
      galaxy: ["#100d27", "#ad92ff", "#64f8d5"]
    };

    const multiplier = () => 1 + (has("boss") ? 2 : 0) + (has("legend") ? 4 : 0) +
      (has("champion") ? 2 : 0) + (has("master") ? 9 : 0) +
      (has("combo") && round ? Math.min(5, Math.floor(round.actions / 5)) : 0) +
      (round && round.charge > 0 ? 8 : 0);
    function toast(message) {
      notice.textContent = message;
      notice.hidden = false;
      noticeTimer = 6500;
    }
    function burst(x, y, count = 50, color = "#ffd24d", type = "spark") {
      const budget = Math.min(count, Math.max(0, 240 - particles.length));
      for (let i = 0; i < budget; i++) particles.push({ x, y, vx: (Math.random() - .5) * 240,
        vy: (Math.random() - .7) * 230, life: 1.7, maxLife: 1.7, color, type });
    }
    function reset() {
      round = { elapsed: 0, actions: 0, collected: 0, questDone: false, shields: 0,
        invincible: 0, revives: 0, blasts: 3, charge: 0, cooldowns: {}, clocks: {},
        oldRecord: api.getRecord(), inBonus: false, bonusUsed: false, finished: false };
      particles = []; tokens = [];
      round.shields = (has("chrome") ? 5 : 0) + (has("heart") ? 3 : 0) + (has("jacket") ? 3 : 0);
      round.invincible = has("hoodie") ? 12000 : 0;
      round.revives = has("continue") ? 3 : 0;
      if (has("crown") && api.isRunning()) gainScore(1000);
      renderControls();
      refresh();
    }
    function spawnToken(kind = "normal") {
      if (tokens.length >= 12) return;
      tokens.push({ x: 45 + Math.random() * (W - 90), y: 75 + Math.random() * (H - 150),
        age: 0, value: kind === "lucky" ? 200 : round.inBonus ? 50 : 25, kind });
    }
    function collect(index) {
      const token = tokens.splice(index, 1)[0];
      if (!token) return false;
      earnPoints(token.value * (has("crystal") ? 3 : 1));
      round.collected++;
      burst(token.x, token.y, 25, token.kind === "lucky" ? "#8bffca" : "#ffd24d");
      if (has("sidequest") && round.collected >= 5 && !round.questDone) {
        round.questDone = true; earnPoints(500); toast("QUEST COMPLETE: +500 POINTS");
      }
      return true;
    }
    function collectAt(x, y) {
      cursor = { x, y };
      if (!api.isRunning() || api.isPaused() || !round) return false;
      const index = tokens.findIndex((token) => Math.hypot(token.x - x, token.y - y) < 27);
      return index >= 0 ? collect(index) : round.inBonus;
    }
    function anchor() {
      const s = getState();
      if (getGame() === "maze" && s.player) return { x: (W - s.cols * s.cell) / 2 + s.player.x * s.cell + 10,
        y: (H - s.rows * s.cell) / 2 + 8 + s.player.y * s.cell + 10 };
      if (getGame() === "jelly-jump") return { x: 105, y: s.y - 18 };
      if (getGame() === "neon") return { x: 210 + s.lane * 110, y: H - 55 };
      if (s.ball) return s.ball;
      if (s.shipX !== undefined) return { x: s.shipX, y: H - 48 };
      if (s.variant === "catch") return { x: s.playerX, y: s.ground - 20 };
      if (s.variant === "dodge") return { x: 213 + s.lane * 107, y: H - 40 };
      return cursor;
    }
    function every(key, interval, dt, action) {
      round.clocks[key] = (round.clocks[key] || 0) + dt;
      if (round.clocks[key] >= interval) { round.clocks[key] -= interval; action(); }
    }
    function update(dt) {
      if (noticeTimer > 0) { noticeTimer -= dt; if (noticeTimer <= 0) notice.hidden = true; }
      if (!round) return;
      round.elapsed += dt;
      round.invincible = Math.max(0, round.invincible - dt);
      round.charge = Math.max(0, round.charge - dt);
      Object.keys(round.cooldowns).forEach((key) => round.cooldowns[key] = Math.max(0, round.cooldowns[key] - dt));
      particles.forEach((p) => { p.x += p.vx * dt / 1000; p.y += p.vy * dt / 1000; p.vy += 60 * dt / 1000; p.life -= dt / 1000; });
      particles = particles.filter((p) => p.life > 0);
      const a = anchor();
      tokens.forEach((token) => {
        token.age += dt;
        if (has("magnet")) { const dx = a.x - token.x, dy = a.y - token.y, d = Math.hypot(dx, dy);
          if (d > 0) { const step = Math.min(d, dt * .2); token.x += dx / d * step; token.y += dy / d * step; } }
      });
      for (let i = tokens.length - 1; i >= 0; i--) if (Math.hypot(tokens[i].x - a.x, tokens[i].y - a.y) < 24) collect(i);
      tokens = tokens.filter((token) => token.age < 16000);
      if (round.inBonus) {
        every("bonusToken", 450, dt, () => spawnToken());
        round.bonusTime -= dt;
        refresh(); return;
      }
      if (has("magnet") || has("sidequest") || has("crystal") || has("starfield") || has("p2") || has("pinkpower"))
        every("tokens", has("starfield") ? 1400 : 2800, dt, () => spawnToken());
      if (has("mint")) every("mint", 10000, dt, () => { round.shields = Math.min(20, round.shields + 1); toast("MINT REGEN: +1 SHIELD"); });
      if (has("petals")) every("petals", 15000, dt, () => { round.shields = Math.min(20, round.shields + 2); burst(W / 2, 65, 100, "#ffa5d4", "petal"); toast("PETAL HEALING: +2 SHIELDS"); });
      if (has("aura")) every("aura", 15000, dt, () => { round.invincible = Math.max(round.invincible, 5000); toast("FORCEFIELD ACTIVE: 5 SECONDS"); });
      if (has("comet")) every("comet", 8000, dt, () => { gainScore(500); burst(W - 60, 70, 80, "#70e4ff", "comet"); toast("COMET STRIKE: +500 SCORE"); });
      if (has("cherrycrown")) every("cherrycrown", 20000, dt, () => { gainScore(1000); burst(W / 2, H / 2, 100, "#ff74ab", "petal"); toast("CHERRY STORM: +1,000 SCORE"); });
      if (has("lanes")) every("lanes", 4000, dt, () => {
        const s = getState();
        if (getGame() === "neon") s.items = s.items.filter((item) => item.type === "energy" || item.lane !== s.lane);
        if (s.variant === "dodge") s.hazards = s.hazards.filter((hazard) => hazard.lane !== s.lane);
        if (getGame() === "neon" || s.variant === "dodge") burst(a.x, a.y, 40, "#8bffca");
      });
      if (has("p2")) every("drone", 2000, dt, () => { if (tokens.length) collect(0);
        const s = getState(); if (s.variant === "defender") { const target = s.enemies[0]; s.shots.push({ x: target ? target.x : s.shipX, y: H - 65 }); } });
      if (has("music")) every("music", 220, dt, () => {
        const notes = [220, 330, 440, 330, 294, 440, 587, 440, 262, 392, 524, 392, 294, 440, 330, 220];
        api.tone(notes[Math.floor(round.elapsed / 220) % notes.length], .16, "triangle");
      });
      if (has("blossom") || has("firefly") || has("turbo") || has("spark")) every("trail", 90, dt, () => {
        if (has("blossom")) burst(a.x, a.y, 3, "#ffadd8", "petal");
        if (has("firefly")) burst(a.x, a.y, 3, "#c9ff64", "firefly");
        if (has("turbo")) burst(a.x, a.y, 3, "#ff744f", "comet");
        if (has("spark")) burst(a.x, a.y, 2, ["#ff71b9", "#72fce0", "#ffd24d"][Math.floor(round.elapsed / 90) % 3]);
      });
      refresh();
    }
    function onScore() {
      if (!round) return;
      round.actions++;
      const a = anchor();
      if (has("lucky") && round.actions % 5 === 0) { spawnToken("lucky"); toast("LUCKY JACKPOT: COLLECT THE GREEN TOKEN"); }
      if (has("spark")) burst(a.x, a.y, 35, ["#ff71b9", "#72fce0", "#ffd24d"][round.actions % 3]);
      if (has("fireworks") && api.getScore() > round.oldRecord) {
        round.oldRecord = api.getScore(); burst(W / 2, H / 3, 100, "#ffd24d");
      }
    }
    function clearHazards() {
      const s = getState();
      if (s.hazards) s.hazards = [];
      if (s.obstacles) s.obstacles = [];
      if (s.enemies) s.enemies = [];
      if (getGame() === "neon") s.items = s.items.filter((item) => item.type === "energy");
      if (s.ghosts) { s.ghosts.forEach((g, i) => { g.x = 18; g.y = i ? 15 : 1; }); }
      if (s.board) { s.board.splice(-5); while (s.board.length < s.rows) s.board.unshift(Array(s.cols).fill(null)); }
      if (s.balance !== undefined) { s.balance = 0; s.balanceVelocity = 0; }
    }
    function protect() {
      if (!round) return false;
      if (api.isOwner()) { burst(anchor().x, anchor().y, 25, "#ff83c9"); return true; }
      if (round.invincible > 0 || round.shields > 0) {
        if (round.invincible <= 0) { round.shields--; round.invincible = 1800; }
        if (has("coral")) gainScore(500);
        burst(anchor().x, anchor().y, 45, "#74e3ff");
        toast(round.invincible > 1800 ? "FORCEFIELD BLOCKED THE HIT" : `HIT BLOCKED: ${round.shields} SHIELDS LEFT`);
        return true;
      }
      return false;
    }
    function revive() {
      if (!round || !has("continue") || round.revives <= 0) return false;
      round.revives--; clearHazards(); round.invincible = 5000;
      const s = getState();
      if (s.lives !== undefined) s.lives = Math.max(1, s.lives);
      if (s.player) { s.player.x = 1; s.player.y = 1; }
      if (s.mode === "jelly") { s.y = s.ground; s.vy = 0; }
      if (s.variant === "stack") { const top = s.stack[s.stack.length - 1]; s.block.x = top.x; }
      toast(`REVIVED WITH YOUR SCORE: ${round.revives} REVIVES LEFT`); return true;
    }
    function usePower(kind) {
      if (!api.isRunning() || api.isPaused() || !round || round.inBonus || !has(kind) || round.cooldowns[kind] > 0) return;
      if (kind === "cherry") { clearHazards(); gainScore(250); round.invincible = Math.max(round.invincible, 2500); round.cooldowns[kind] = 10000; burst(W / 2, H / 2, 100, "#ff5a87"); toast("CHERRY BOMB: FIELD CLEARED"); }
      if (kind === "patch") { round.charge = 5000; round.cooldowns[kind] = 15000; toast("SUPERCHARGE: +8 SCORE MULTIPLIER"); burst(W / 2, H / 2, 60, "#8affcd"); }
      if (kind === "master" && round.blasts > 0) { round.blasts--; clearHazards(); gainScore(2000); round.invincible = Math.max(round.invincible, 5000); round.cooldowns[kind] = 1000; burst(W / 2, H / 2, 140, "#ffdf68"); toast(`MASTER BLAST: ${round.blasts} BLASTS LEFT`); }
      refresh();
    }
    function renderControls() {
      const buttons = [["cherry", "BOMB", "Cherry Bomb"], ["patch", "CHARGE", "Supercharge"], ["master", "BLAST", "Master Blast"]];
      powerButtons.innerHTML = buttons.filter(([effect]) => has(effect)).map(([effect, label, title]) =>
        `<button type="button" data-power="${effect}" title="${title}"><span aria-hidden="true">${effect === "cherry" ? "*" : effect === "patch" ? "+" : "!"}</span><b>${label}</b></button>`).join("");
      document.getElementById("saveVault").hidden = !has("cloud");
    }
    powerButtons.addEventListener("click", (event) => { const b = event.target.closest("[data-power]"); if (b) usePower(b.dataset.power); });
    function refresh() {
      const chips = [];
      if (api.isOwner()) chips.push("OWNER: UNLIMITED SHIELDS");
      if (round) {
        if (round.shields || has("heart") || has("chrome") || has("mint")) chips.push(`${round.shields} SHIELDS`);
        if (round.invincible > 0) chips.push(`IMMUNE ${Math.ceil(round.invincible / 1000)}s`);
        if (has("continue")) chips.push(`${round.revives} REVIVES`);
        if (has("sidequest")) chips.push(`QUEST ${Math.min(5, round.collected)}/5`);
        if (round.inBonus) chips.push(`BONUS ${Math.ceil(Math.max(0, round.bonusTime) / 1000)}s`);
      }
      if (multiplier() > 1) chips.push(`${multiplier()}X SCORE`);
      if (api.isOwner() || has("timer")) chips.push("3X TIME");
      if (has("turbo")) chips.push("2X MOVE");
      stats.textContent = chips.join("  |  ");
      stats.hidden = !chips.length;
      powerButtons.querySelectorAll("[data-power]").forEach((b) => {
        const effect = b.dataset.power, cooldown = round ? round.cooldowns[effect] || 0 : 0;
        b.disabled = !api.isRunning() || api.isPaused() || !round || round.inBonus || cooldown > 0 || effect === "master" && round.blasts <= 0;
        b.querySelector("b").textContent = cooldown > 0 ? `${Math.ceil(cooldown / 1000)}s` : effect === "master" && round ? `BLAST ${round.blasts}` : effect === "cherry" ? "BOMB" : "CHARGE";
      });
      recordBoard.hidden = !has("frame");
      if (has("frame")) recordBoard.innerHTML = `<span>PERSONAL RECORD <b>${api.getRecord().toLocaleString()}</b></span><span>THIS ROUND <b>${api.getScore().toLocaleString()}</b></span><span>ROUNDS PLAYED <b>${api.getPlayed()}</b></span>`;
    }
    function draw() {
      ctx.save(); ctx.setLineDash([]); ctx.globalAlpha = 1; ctx.lineWidth = 2;
      const a = anchor(), theme = api.getTheme(), p = palettes[theme], t = round ? round.elapsed / 1000 : 0;
      if (p) {
        ctx.fillStyle = p[1]; ctx.globalAlpha = .12; ctx.fillRect(0, 55, 18, H - 55); ctx.fillRect(W - 18, 55, 18, H - 55); ctx.globalAlpha = 1;
        if (theme === "sunset") { ctx.fillStyle = p[2]; ctx.globalAlpha = .35; ctx.beginPath(); ctx.arc(W - 60, 100, 45, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
        if (["galaxy", "starfield", "midnight"].includes(theme)) {
          ctx.fillStyle = p[2]; ctx.globalAlpha = .5;
          for (let i = 0; i < 40; i++) ctx.fillRect((i * 73) % W, 65 + (i * 41 + t * 12) % (H - 65), i % 3 ? 2 : 4, i % 3 ? 2 : 4);
          ctx.globalAlpha = 1;
        }
      }
      if (has("scanline")) { ctx.fillStyle = "rgba(0,0,0,.22)"; for (let y = 0; y < H; y += 5) ctx.fillRect(0, y, W, 2); }
      if (has("crown") || has("cherrycrown")) {
        const size = has("cherrycrown") ? 28 : 18;
        ctx.fillStyle = has("cherrycrown") ? "#ff7ba9" : "#ffdf68";
        ctx.beginPath(); ctx.moveTo(a.x - size, a.y - 24); ctx.lineTo(a.x - size, a.y - 43);
        ctx.lineTo(a.x - size / 2, a.y - 33); ctx.lineTo(a.x, a.y - 49);
        ctx.lineTo(a.x + size / 2, a.y - 33); ctx.lineTo(a.x + size, a.y - 43); ctx.lineTo(a.x + size, a.y - 24); ctx.fill();
      }
      if (has("aura") || round && (round.shields > 0 || round.invincible > 0)) {
        ctx.strokeStyle = round && round.invincible > 0 ? "#ffd24d" : "#71f5df"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(a.x, a.y, 30 + Math.sin(t * 4) * 5, 0, Math.PI * 2); ctx.stroke();
      }
      if (has("p2")) {
        const dx = a.x + 40 + Math.sin(t * 2) * 12, dy = a.y - 25;
        ctx.fillStyle = "#72fce0"; ctx.fillRect(dx - 11, dy - 7, 22, 14);
        ctx.fillStyle = "#08090c"; ctx.fillRect(dx - 6, dy - 3, 4, 4); ctx.fillRect(dx + 3, dy - 3, 4, 4);
        ctx.strokeStyle = "#72fce0"; ctx.beginPath(); ctx.moveTo(dx - 19, dy - 12); ctx.lineTo(dx + 19, dy - 12); ctx.stroke();
      }
      tokens.forEach((token) => {
        ctx.fillStyle = token.kind === "lucky" ? "#8bffca" : "#ffdf68"; ctx.beginPath(); ctx.arc(token.x, token.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = has("crystal") ? "#89f9ff" : "#ffdf68"; ctx.beginPath(); ctx.arc(token.x, token.y, 23 + Math.sin(token.age / 150) * 3, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#100e18"; ctx.textAlign = "center"; ctx.font = "bold 12px Courier New"; ctx.fillText(String(token.value * (has("crystal") ? 3 : 1)), token.x, token.y + 4);
      });
      particles.forEach((particle) => {
        ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife); ctx.fillStyle = particle.color;
        if (particle.type === "petal") { ctx.beginPath(); ctx.ellipse(particle.x, particle.y, 6, 3, particle.life, 0, Math.PI * 2); ctx.fill(); }
        else if (particle.type === "comet") ctx.fillRect(particle.x, particle.y, 18, 3);
        else { ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.type === "firefly" ? 4 : 3, 0, Math.PI * 2); ctx.fill(); }
      });
      ctx.restore();
    }
    function drawHints() {
      const s = getState(); ctx.save(); ctx.setLineDash([]); ctx.lineWidth = 2; ctx.strokeStyle = "#a3ff77"; ctx.fillStyle = "#a3ff77"; ctx.font = "bold 12px Courier New";
      if (api.isOwner() || has("goggles")) {
        let hint = s.question ? `ANSWER: ${s.question.answer}` : getGame() === "color" && s.answer ? `INK: ${s.answer.name}` : s.variant === "typing" ? `ANSWER: ${s.answer || ""}` : s.variant === "sequence" ? `ORDER: ${s.sequence.map((n) => n + 1).join(" - ")}` : "";
        if (hint) { ctx.fillStyle = "#0b241a"; ctx.fillRect(12, H - 34, W - 24, 26); ctx.fillStyle = "#a3ff77"; ctx.fillText(hint, 22, H - 16); }
      }
      if (has("grid") && getGame() === "maze") {
        const p = s.player, ox = (W - s.cols * s.cell) / 2, oy = (H - s.rows * s.cell) / 2 + 8;
        const queue = [[p.x, p.y]], seen = new Set([`${p.x},${p.y}`]), parents = new Map(); let end;
        for (let i = 0; i < queue.length; i++) { const [x, y] = queue[i], key = `${x},${y}`; if (s.dots.includes(key)) { end = key; break; }
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { const nx = x + dx, ny = y + dy, next = `${nx},${ny}`;
            if (s.map[ny]?.[nx] && s.map[ny][nx] !== "#" && !seen.has(next)) { seen.add(next); parents.set(next, key); queue.push([nx, ny]); } }); }
        if (end) { ctx.beginPath(); while (end) { const [x, y] = end.split(",").map(Number); ctx.lineTo(ox + x * s.cell + 10, oy + y * s.cell + 10); end = parents.get(end); } ctx.stroke(); }
      }
      if (has("grid") && getGame() === "blocks" && s.piece) {
        const ghost = { ...s.piece }; while (!api.blockCollides(ghost, 0, 1)) ghost.y++;
        const ox = (W - s.cols * s.cell) / 2;
        ghost.shape.forEach((row, y) => row.forEach((v, x) => { if (v) ctx.strokeRect(ox + (ghost.x + x) * s.cell + 2, 34 + (ghost.y + y) * s.cell + 2, s.cell - 4, s.cell - 4); }));
      }
      if (has("firefly")) (s.hazards || s.enemies || []).forEach((enemy) => {
        const x = enemy.x !== undefined ? enemy.x : 213 + enemy.lane * 107;
        ctx.strokeStyle = "#c9ff64"; ctx.beginPath(); ctx.arc(x, enemy.y, 25, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.restore();
    }
    function startBonus() {
      round.inBonus = true; round.bonusUsed = true; round.bonusTime = 20000; tokens = [];
      toast("SECRET STAGE: 20 SECONDS OF GOLD TOKENS");
      for (let i = 0; i < 5; i++) spawnToken();
      api.resumeRound();
    }
    function finish() {
      if (!round || round.finished) return;
      round.finished = true;
      if (has("gold") && api.getScore() > 0) earnPoints(300);
      refresh();
    }
    function equipped(effect) {
      if (round && api.isRunning()) {
        if (effect === "chrome") round.shields += 5;
        if (effect === "heart") { round.shields += 3; if (getGame() === "maze") getState().lives += 6; }
        if (effect === "jacket") round.shields += 3;
        if (effect === "hoodie") round.invincible = 12000;
        if (effect === "continue") round.revives += 3;
        if (effect === "crown") gainScore(1000);
      }
      renderControls(); refresh();
    }
    return { reset, update, onScore, multiplier, draw, drawHints, collectAt, protect, revive, toast,
      usePower, renderControls, refresh, equipped, startBonus, finish,
      pointer: (x, y) => { cursor = { x, y }; },
      isBonus: () => Boolean(round && round.inBonus),
      bonusFinished: () => round && round.inBonus && round.bonusTime <= 0,
      canBonus: () => Boolean(round && !round.bonusUsed && has("secret") && api.getScore() > 0),
      motion: () => api.isOwner() ? .4 : (has("midnight") ? .5 : 1) * (has("boss") ? 2 : 1),
      movement: () => has("turbo") ? 2 : 1,
      steering: () => (has("turbo") ? 2 : 1) * (has("joystick") ? 3 : 1),
      tolerance: () => api.isOwner() ? 3 : has("keys") || has("prism") ? 2 : 1,
      targetSize: () => api.isOwner() || has("bubble") ? 2 : 1
    };
  };
})();
