const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const powersSource = fs.readFileSync(path.join(root, "shop-powers.js"), "utf8");
const scriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");

// Exercise the actual game code without adding testing hooks to the website.
function arcade(saved = {}) {
  const elements = new Map();
  const storage = new Map(Object.entries(saved).map(([key, value]) => [key, String(value)]));
  const drawing = [];
  const keyboardListeners = [];
  const ctx = new Proxy({}, {
    get(target, key) {
      return target[key] || ((...args) => {
        drawing.push([key, ...args]);
        for (const arg of args) if (typeof arg === "number") assert.ok(Number.isFinite(arg), `Invalid ${key} coordinate`);
      });
    }
  });
  function element(id) {
    if (elements.has(id)) return elements.get(id);
    const classes = new Set();
    const listeners = new Map();
    const node = {
      id, width: 640, height: 400, hidden: ["shopModal", "ownerModal", "pauseBadge"].includes(id),
      textContent: "", innerHTML: "", dataset: {}, style: { setProperty() {} },
      classList: {
        add: (name) => classes.add(name), remove: (name) => classes.delete(name), contains: (name) => classes.has(name),
        toggle(name, on) { if (on === undefined) on = !classes.has(name); if (on) classes.add(name); else classes.delete(name); }
      },
      getContext: () => ctx, getBoundingClientRect: () => ({ left: 10, top: 20, width: 320, height: 200 }), setAttribute() {}, querySelector: (selector) => element(`${id}:${selector}`),
      querySelectorAll: () => [], focus(options) { document.activeElement = node; node.focusOptions = options; }, reset() { node.values = {}; }, scrollIntoView() {}, append() {}, remove() {}, matches: () => false,
      addEventListener(name, callback) { const list = listeners.get(name) || []; list.push(callback); listeners.set(name, list); },
      fire(name, event = {}) { return Promise.all((listeners.get(name) || []).map((callback) => callback({ preventDefault() {}, currentTarget: node, target: node, ...event }))); }
    };
    elements.set(id, node);
    return node;
  }
  const document = {
    getElementById: element, querySelector: element, querySelectorAll: () => [], createElement: element,
    addEventListener() {}, body: element("body")
  };
  const context = vm.createContext({
    document, console, Math, Date, Set, Map, Number, String, JSON, Blob,
    FormData: class { constructor(form) { this.values = form.values; } get(name) { return this.values[name]; } },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)), removeItem: (key) => storage.delete(key) },
    performance: { now: () => 0 }, requestAnimationFrame: () => 1, cancelAnimationFrame() {}, setInterval() {}, setTimeout() {},
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    window: { confirm: () => true, addEventListener(name, handler, options) { keyboardListeners.push({ name, handler, options }); } }
  });
  vm.runInContext(powersSource, context, { filename: "shop-powers.js" });
  const hooks = `window.testArcade = {
    games, shopItems, powers, selectGame, beginGame, endGame, buyShopItem, setPoints,
    updateGame, drawCurrent, handleKey, jumpJelly, resetProgress, openOwner, closeOwner, moveScanner, hitScanner, scannerRadius, detectorReading,
    getState: () => state, getScore: () => score, isRunning: () => gameRunning,
    getPoints: () => points, isOwner: () => ownerVerified,
    owned: () => ownedShopItems, equipped: () => equippedShopItems
  };`;
  const source = scriptSource.replace(/\}\)\(\);\s*$/, `${hooks}\n})();`);
  vm.runInContext(source, context, { filename: "script.js" });
  return { ...context.window.testArcade, element, storage, drawing, keyboardListeners, document };
}

function verify(app, answers = { name: "Felicia", color: "pink", secondColor: "purple", thirdColor: "blue", gender: "girl" }) {
  app.element("ownerForm").values = answers;
  return app.element("ownerForm").fire("submit");
}

test("Game takes keyboard focus without moving the page", () => {
  const app = arcade();
  app.beginGame();
  assert.equal(app.document.activeElement, app.element("gameCanvas"));
  assert.equal(app.element("gameCanvas").focusOptions.preventScroll, true);
  app.document.activeElement = app.element("pauseButton");
  app.element("gameCanvas").fire("pointerdown");
  assert.equal(app.document.activeElement, app.element("gameCanvas"));
});

test("Arrow keys and Space cancel scrolling early and still control the game", () => {
  const app = arcade();
  app.selectGame("neon"); app.beginGame();
  const listener = app.keyboardListeners.find((entry) => entry.name === "keydown");
  assert.equal(listener.options.capture, true);
  assert.equal(listener.options.passive, false);
  function press(key) {
    let prevented = false, stopped = false;
    listener.handler({ key, target: app.element("gameCanvas"), preventDefault() { prevented = true; }, stopPropagation() { stopped = true; } });
    assert.equal(prevented, true, key);
    assert.equal(stopped, true, key);
  }
  press("ArrowRight"); assert.equal(app.getState().lane, 2);
  press("ArrowLeft"); assert.equal(app.getState().lane, 1);
  for (const key of ["ArrowUp", "ArrowDown", " "]) press(key);
  app.element("pauseButton").fire("click");
  press("ArrowRight"); assert.equal(app.getState().lane, 1);
});

test("Game key handling preserves form editing, dialog navigation and Tab", () => {
  const app = arcade();
  app.selectGame("neon"); app.beginGame();
  const listener = app.keyboardListeners.find((entry) => entry.name === "keydown");
  function press(key, target = app.element("gameCanvas")) {
    let prevented = false, stopped = false;
    listener.handler({ key, target, preventDefault() { prevented = true; }, stopPropagation() { stopped = true; } });
    assert.equal(prevented, false);
    assert.equal(stopped, false);
    assert.equal(app.getState().lane, 1);
  }
  press("ArrowRight", { matches: () => true });
  press("ArrowRight", { isContentEditable: true, matches: () => false });
  press("Tab");
  app.openOwner(); press("ArrowRight"); app.closeOwner();
  app.element("shopModal").hidden = false; press("ArrowRight");
});

test("Owner rejects wrong answers and accepts trimmed, case-insensitive correct answers", async () => {
  const app = arcade();
  await verify(app, { name: "Wrong", color: "pink", secondColor: "purple", thirdColor: "blue", gender: "girl" });
  assert.equal(app.isOwner(), false);
  assert.match(app.element("ownerResult").textContent, /don't match/);
  await verify(app, { name: " FELICIA ", color: " PINK ", secondColor: " PURPLE ", thirdColor: " BLUE ", gender: " GIRL " });
  assert.equal(app.isOwner(), true);
  assert.match(app.element("ownerResult").innerHTML, /Congrats! We verified you're the owner/);
  assert.equal(app.storage.get("pixelPlayOwnerVerified"), undefined);
  assert.equal(app.element("pointsLabel").textContent, "\u221e");
});

test("Owner requires blue as the third favorite color", async () => {
  const app = arcade();
  const answers = { name: "Felicia", color: "pink", secondColor: "purple", gender: "girl" };
  await verify(app, answers);
  assert.equal(app.isOwner(), false);
  await verify(app, { ...answers, thirdColor: "red" });
  assert.equal(app.isOwner(), false);
  await verify(app, { ...answers, thirdColor: "blue" });
  assert.equal(app.isOwner(), true);
});

test("Owner has unlimited spending without storing Infinity or NaN", async () => {
  const app = arcade();
  app.setPoints(12);
  await verify(app);
  app.buyShopItem("master-key");
  app.buyShopItem("pixel-vip");
  assert.equal(app.owned().length, 50);
  assert.equal(app.getPoints(), 12);
  assert.equal(app.element("shopPointsLabel").textContent, "\u221e");
  assert.ok(Number.isFinite(Number(app.storage.get("pixelPlayPoints"))));
  const reloaded = arcade(Object.fromEntries(app.storage));
  assert.equal(reloaded.isOwner(), false);
  assert.equal(reloaded.owned().length, 50);
  assert.equal(reloaded.element("pointsLabel").textContent, "12");
  await verify(reloaded);
  assert.equal(reloaded.isOwner(), true);
  assert.equal(reloaded.element("pointsLabel").textContent, "\u221e");
});

test("Refreshing removes old saved Owner status while keeping points, purchases and records", () => {
  const app = arcade({ pixelPlayOwnerVerified: "true", pixelPlayPoints: 500, pixelPlayBest: 2500, pixelPlayGames: 5, pixelPlayShopItems: '["token-magnet"]' });
  assert.equal(app.isOwner(), false);
  assert.equal(app.element("ownerButton").textContent, "OWNER");
  assert.equal(app.storage.get("pixelPlayOwnerVerified"), undefined);
  assert.equal(app.getPoints(), 500);
  assert.equal(app.owned()[0], "token-magnet");
  assert.equal(app.storage.get("pixelPlayBest"), "2500");
  assert.equal(app.storage.get("pixelPlayGames"), "5");
});

test("Owner quiz can verify independently on different computers without a shared login lock", async () => {
  const firstComputer = arcade(), secondComputer = arcade();
  await verify(firstComputer); await verify(secondComputer);
  assert.equal(firstComputer.isOwner(), true);
  assert.equal(secondComputer.isOwner(), true);
});

test("Normal players earn 50 points per round and cannot buy unaffordable items", () => {
  const app = arcade();
  app.beginGame();
  assert.equal(app.getPoints(), 50);
  app.buyShopItem("token-magnet");
  assert.equal(app.owned().length, 0);
  assert.equal(app.getPoints(), 50);
  app.setPoints(150);
  app.buyShopItem("token-magnet");
  assert.equal(app.getPoints(), 0);
  app.beginGame();
  assert.equal(app.getPoints(), 150);
  app.buyShopItem("token-magnet");
  app.beginGame();
  assert.equal(app.getPoints(), 200);
});

test("VIP price totals all other items and includes all compatible powers", () => {
  const app = arcade();
  const vip = app.shopItems.find((item) => item.id === "pixel-vip");
  assert.equal(vip.price, app.shopItems.filter((item) => item !== vip).reduce((sum, item) => sum + item.price, 0));
  app.setPoints(vip.price);
  app.buyShopItem(vip.id);
  assert.equal(app.getPoints(), 0);
  assert.equal(app.owned().length, 50);
  assert.equal(app.equipped().filter((id) => app.shopItems.find((item) => item.id === id).group === "theme").length, 1);
  assert.equal(app.powers.multiplier(), 18);
  app.beginGame();
  assert.equal(app.getPoints(), 2600);
  assert.ok(app.getScore() >= 18000);
});

test("Owner slows hazards, enlarges targets, widens timing windows and blocks every collision", async () => {
  const app = arcade();
  await verify(app);
  assert.equal(app.powers.motion(), .4);
  assert.equal(app.powers.tolerance(), 3);
  assert.equal(app.powers.targetSize(), 2);
  for (let i = 0; i < 100; i++) assert.equal(app.powers.protect(), true);
  app.selectGame("reflex");
  assert.equal(app.getState().target.size, 54);
  app.selectGame("memory");
  app.drawing.length = 0;
  app.drawCurrent();
  assert.equal(app.drawing.filter(([method, text]) => method === "fillText" && text === "+").length, 0);
});

test("Turbo Timer drains clocks at one-third speed without slowing motion or ending early", () => {
  const app = arcade({ pixelPlayShopItems: '["turbo-timer"]' });
  app.selectGame("reflex"); app.beginGame();
  app.updateGame(60);
  assert.equal(app.getState().time, 29980);
  assert.equal(app.powers.motion(), 1);
  app.getState().time = 20;
  app.updateGame(30);
  assert.equal(app.getState().time, 10);
  assert.equal(app.isRunning(), true);
  app.updateGame(60);
  assert.equal(app.isRunning(), false);
});

test("Shields absorb damage and Extra Continue revives three times while preserving score", () => {
  const app = arcade({ pixelPlayShopItems: '["chrome-cabinet","extra-continue"]' });
  app.beginGame();
  for (let i = 0; i < 5; i++) { assert.equal(app.powers.protect(), true); app.powers.update(1900); }
  assert.equal(app.powers.protect(), false);
  for (let i = 0; i < 3; i++) assert.equal(app.powers.revive(), true);
  assert.equal(app.powers.revive(), false);
});

test("Cherry Bomb clears hazards, Supercharge adds +8 multiplier and Master Blast has three charges", () => {
  const app = arcade({ pixelPlayShopItems: '["cherry-buttons","power-up-patch","master-key"]' });
  app.selectGame("neon"); app.beginGame();
  app.getState().items = [{ type: "glitch", lane: 1, y: 100 }, { type: "energy", lane: 0, y: 100 }];
  app.powers.usePower("cherry");
  assert.equal(app.getState().items.length, 1);
  assert.equal(app.getState().items[0].type, "energy");
  const normalMultiplier = app.powers.multiplier();
  app.powers.usePower("patch");
  assert.equal(app.powers.multiplier(), normalMultiplier + 8);
  for (let i = 0; i < 3; i++) { app.powers.usePower("master"); app.powers.update(1100); }
  const exhaustedScore = app.getScore();
  app.powers.usePower("master");
  assert.equal(app.getScore(), exhaustedScore);
});

test("Moon Boots adds an air jump and Jelly Jump stays within the screen", () => {
  const app = arcade({ pixelPlayShopItems: '["moon-boots"]' });
  app.selectGame("jelly-jump"); app.beginGame();
  app.jumpJelly(); app.updateGame(100); app.jumpJelly();
  assert.equal(app.getState().jumps, 2);
  app.jumpJelly();
  assert.equal(app.getState().jumps, 2);
  for (let i = 0; i < 15; i++) app.updateGame(50);
  assert.ok(app.getState().y >= 62);
});

test("Signal Scan has 21 distinct, separated treasures inside the search box", () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
  const state = app.getState(), box = state.searchBox;
  assert.equal(state.time, 120000);
  assert.equal(new Set(state.scanObjects.map((item) => item.name)).size, 21);
  assert.equal(new Set(state.scanObjects.map((item) => item.pixels.join(""))).size, 21);
  for (const item of state.scanObjects) {
    assert.ok(item.x - 12 >= box.x && item.x + 12 <= box.x + box.width);
    assert.ok(item.y - 12 >= box.y && item.y + 12 <= box.y + box.height);
    assert.equal(item.found, false);
    for (const other of state.scanObjects) if (other !== item) assert.ok(Math.hypot(item.x - other.x, item.y - other.y) > 40);
  }
  assert.equal(state.scan, undefined);
  assert.equal(state.scanGoal, undefined);
});

test("The metal detector finds stationary buried items; each can be dug up only once", () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
  const state = app.getState();
  const item = state.scanObjects.find((entry) => Math.hypot(entry.x - state.scanner.x, entry.y - state.scanner.y) > app.scannerRadius());
  app.hitScanner(item.x, item.y);
  assert.equal(state.hits, 0);
  app.moveScanner(item.x, item.y);
  assert.equal(state.hits, 0);
  app.hitScanner(item.x, item.y);
  assert.equal(item.found, true);
  assert.equal(state.hits, 1);
  assert.equal(app.getScore(), 120);
  app.hitScanner(item.x, item.y);
  assert.equal(state.hits, 1);
  assert.equal(app.getScore(), 120);
  const oldPosition = { x: item.x, y: item.y }; app.updateGame(500);
  assert.equal(item.x, oldPosition.x); assert.equal(item.y, oldPosition.y);
});

test("Signal Scan pointer events scale correctly and support touch-to-find", async () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
  const item = app.getState().scanObjects[0];
  const event = { clientX: 10 + item.x / 2, clientY: 20 + item.y / 2 };
  await app.element("gameCanvas").fire("pointermove", event);
  assert.ok(Math.abs(app.getState().scanner.x - item.x) < .001);
  assert.ok(Math.abs(app.getState().scanner.y - item.y) < .001);
  await app.element("gameCanvas").fire("pointerleave");
  assert.equal(app.getState().scanner.active, false);
  await app.element("gameCanvas").fire("pointerdown", event);
  await app.element("gameCanvas").fire("click", { ...event, stopImmediatePropagation() {} });
  assert.equal(item.found, true);
  assert.equal(app.getState().hits, 1);
});

test("Signal Scan rejects searches outside the box, while paused and before a round", () => {
  const app = arcade(); app.selectGame("signal-scan");
  let item = app.getState().scanObjects[0]; app.moveScanner(item.x, item.y); app.hitScanner(item.x, item.y);
  assert.equal(item.found, false);
  app.beginGame(); item = app.getState().scanObjects[0];
  app.moveScanner(0, 0); app.hitScanner(item.x, item.y);
  assert.equal(item.found, false);
  app.element("pauseButton").fire("click");
  app.moveScanner(item.x, item.y); app.hitScanner(item.x, item.y);
  assert.equal(item.found, false);
});

test("Signal Scan keyboard and action controls dig at the metal detector, not a timing line", () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
  const item = app.getState().scanObjects[0];
  for (const key of ["ArrowLeft", "ArrowUp", " "]) app.handleKey({ key, preventDefault() {} });
  assert.equal(item.found, true);
  const next = app.getState().scanObjects[1]; app.moveScanner(next.x, next.y);
  app.element("actionButton").fire("click");
  assert.equal(next.found, true);
});

test("Signal Scan ends when all 21 objects are found and resets on replay", () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
  const state = app.getState();
  for (const item of state.scanObjects) { app.moveScanner(item.x, item.y); app.hitScanner(item.x, item.y); }
  assert.equal(state.hits, 21);
  assert.equal(app.isRunning(), false);
  assert.match(app.element("overlayText").textContent, /ALL 21 OBJECTS FOUND/);
  assert.ok(app.getScore() > 1000);
  assert.equal(app.storage.get("pixelPlayGames"), "1");
  app.beginGame();
  assert.equal(app.getState().hits, 0);
  assert.ok(app.getState().scanObjects.every((item) => !item.found));
  assert.equal(app.getState().time, 120000);
});

test("Signal Scan expiry reports found objects; shop powers visibly improve the search", () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame(); app.updateGame(120000);
  assert.equal(app.isRunning(), false);
  assert.match(app.element("overlayText").textContent, /0 OF 21 OBJECTS FOUND/);
  const upgraded = arcade({ pixelPlayShopItems: '["bubble-text","glitch-goggles"]' });
  upgraded.selectGame("signal-scan"); upgraded.beginGame();
  assert.equal(upgraded.scannerRadius(), app.scannerRadius() * 3);
  const state = upgraded.getState();
  const distant = state.scanObjects.find((item) => Math.hypot(item.x - state.scanner.x, item.y - state.scanner.y) > 60);
  upgraded.hitScanner(distant.x, distant.y);
  assert.equal(distant.found, false);
  upgraded.moveScanner(distant.x, distant.y);
  assert.equal(upgraded.detectorReading().strength, 100);
  upgraded.hitScanner(distant.x, distant.y);
  assert.equal(distant.found, true);
  upgraded.drawCurrent();
});

test("Buried objects are invisible even under the detector and with goggles equipped", () => {
  for (const saved of [{}, { pixelPlayShopItems: '["glitch-goggles"]' }]) {
    const app = arcade(saved); app.selectGame("signal-scan"); app.beginGame();
    const item = app.getState().scanObjects[0]; app.moveScanner(item.x, item.y);
    const spritePixels = () => app.drawing.filter(([method, , , width, height]) => method === "fillRect" && width === 3 && height === 3).length;
    app.drawing.length = 0; app.drawCurrent();
    assert.equal(spritePixels(), 0);
    assert.equal(item.found, false);
    app.hitScanner(item.x, item.y);
    app.drawing.length = 0; app.drawCurrent();
    assert.equal(spritePixels(), item.pixels.join("").replace(/0/g, "").length);
  }
});

test("Metal detector signal grows closer to buried metal and ignores dug-up items", () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
  const state = app.getState();
  const item = { ...state.scanObjects[0], x: 200, y: 240 };
  const second = { ...state.scanObjects[1], x: 500, y: 240 };
  state.scanObjects = [item, second];
  app.moveScanner(350, 240); assert.equal(app.detectorReading().strength, 0);
  app.moveScanner(280, 240); const weak = app.detectorReading().strength;
  app.moveScanner(250, 240); assert.ok(app.detectorReading().strength > weak);
  app.moveScanner(220, 240); assert.equal(app.detectorReading().strength, 100);
  app.hitScanner(220, 240);
  assert.equal(item.found, true);
  assert.equal(app.detectorReading().strength, 0);
  app.moveScanner(0, 0); assert.equal(app.detectorReading().strength, 0);
});

test("Detector pulses and beeps speed up as signal gets stronger", () => {
  function probe(distance) {
    const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
    const state = app.getState(); state.scanObjects = [{ ...state.scanObjects[0], x: 200, y: 240 }];
    app.moveScanner(200 + distance, 240); app.updateGame(200);
    return state;
  }
  assert.equal(probe(80).detectorPulse, 0);
  assert.ok(probe(0).detectorPulse > 0);
  assert.equal(probe(150).beepTimer, 0);
});

test("Digging collects the nearest buried item when upgraded dig ranges overlap", () => {
  const app = arcade({ pixelPlayShopItems: '["bubble-text"]' }); app.selectGame("signal-scan"); app.beginGame();
  const state = app.getState();
  const farther = { ...state.scanObjects[0], x: 250, y: 240 };
  const nearer = { ...state.scanObjects[1], x: 180, y: 240 };
  state.scanObjects = [farther, nearer];
  app.moveScanner(210, 240); app.hitScanner(210, 240);
  assert.equal(nearer.found, true);
  assert.equal(farther.found, false);
});

test("Treasures use brighter colors without changing their original sprite size", () => {
  const app = arcade(); app.selectGame("signal-scan"); app.beginGame();
  const key = app.getState().scanObjects.find((item) => item.name === "KEY");
  const brightness = (color) => color.slice(1).match(/../g).reduce((sum, channel) => sum + parseInt(channel, 16), 0);
  assert.ok(brightness(key.color) > brightness("#ffd24d"));
  assert.equal(key.pixels.length, 8);
  assert.ok(key.pixels.every((row) => row.length === 8));
  app.moveScanner(key.x, key.y); app.hitScanner(key.x, key.y);
  app.drawing.length = 0; app.drawCurrent();
  assert.ok(app.drawing.some(([method, , , w, h]) => method === "fillRect" && w === 3 && h === 3));
  assert.ok(!app.drawing.some(([method, , , w, h]) => method === "fillRect" && w === 4 && h === 4));
});

test("Reset clears wallet, shop, records and Owner mode together", async () => {
  const app = arcade({ pixelPlayBest: 2500, pixelPlayGames: 5, pixelPlayPoints: 500, pixelPlayOwnerVerified: "true", pixelPlayShopItems: '["pixel-vip"]' });
  await verify(app);
  app.resetProgress();
  assert.equal(app.isOwner(), false);
  assert.equal(app.getPoints(), 0);
  assert.equal(app.owned().length, 0);
  assert.equal(app.equipped().length, 0);
  assert.equal(app.getScore(), 0);
  assert.equal(app.storage.get("pixelPlayOwnerVerified"), undefined);
  assert.equal(app.storage.get("pixelPlayBest"), undefined);
});

test("All 29 games initialize, update and draw with each of the 50 shop items and Owner mode", async () => {
  const catalog = arcade();
  assert.equal(catalog.games.length, 29);
  assert.equal(catalog.shopItems.length, 50);
  let checked = 0;
  for (const item of [null, ...catalog.shopItems]) {
    const saved = item ? { pixelPlayShopItems: JSON.stringify([item.id]) } : {};
    const app = arcade(saved);
    for (const game of app.games) {
      try {
        app.selectGame(game.id); app.beginGame();
        for (let i = 0; i < 4; i++) {
          app.powers.update(50); app.updateGame(50 * app.powers.motion()); app.drawCurrent();
        }
        checked++;
      } catch (error) { throw new Error(`${game.title} with ${item?.name || "no upgrade"}: ${error.message}`); }
    }
  }
  const owner = arcade();
  await verify(owner);
  for (const game of owner.games) { owner.selectGame(game.id); owner.beginGame(); owner.updateGame(20); owner.drawCurrent(); checked++; }
  assert.equal(checked, 1508);
});
