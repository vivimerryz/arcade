(() => {
  "use strict";

  window.createTaskTracker = ({ games, onChange }) => {
    const storageKey = "pixelPlayTaskProgress";
    const gameIds = new Set(games.map((game) => game.id));
    let tasks = [], completedTotal = 0, unlockedGames = [];
    let nextId = 1;
    const input = document.getElementById("taskInput");
    const list = document.getElementById("taskList");
    const status = document.getElementById("taskRewardStatus");

    function load(saved) {
      if (!saved || !Array.isArray(saved.tasks) || !Number.isSafeInteger(saved.completedTotal) || saved.completedTotal < 0 || !Array.isArray(saved.unlockedGames)) return false;
      const ids = new Set();
      tasks = saved.tasks.filter((task) => task && Number.isSafeInteger(task.id) && task.id > 0 && typeof task.text === "string" && task.text.trim() && typeof task.completed === "boolean" && typeof task.credited === "boolean" && !ids.has(task.id) && ids.add(task.id))
        .map((task) => ({ id: task.id, text: task.text.trim().slice(0, 200), completed: task.completed, credited: task.credited }));
      completedTotal = Math.max(saved.completedTotal, tasks.filter((task) => task.credited).length);
      unlockedGames = [...new Set(saved.unlockedGames.filter((id) => gameIds.has(id)))].slice(0, Math.floor(completedTotal / 10));
      nextId = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
      return true;
    }
    try { load(JSON.parse(localStorage.getItem(storageKey) || "null")); } catch { /* Ignore a damaged task save without affecting arcade purchases. */ }

    const availableUnlocks = () => Math.max(0, Math.min(games.length - unlockedGames.length, Math.floor(completedTotal / 10) - unlockedGames.length));
    const isUnlocked = (id) => unlockedGames.includes(id);
    const snapshot = () => ({ tasks: tasks.map((task) => ({ ...task })), completedTotal, unlockedGames: [...unlockedGames] });

    function render() {
      const scrollTop = list.scrollTop;
      list.replaceChildren();
      tasks.forEach((task) => {
        const row = document.createElement("li");
        row.className = `task-row${task.completed ? " is-complete" : ""}`;
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox"; checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggle(task.id));
        const text = document.createElement("span"); text.textContent = task.text;
        label.append(checkbox, text);
        const removeButton = document.createElement("button");
        removeButton.type = "button"; removeButton.className = "task-delete";
        removeButton.textContent = "\u00d7";
        removeButton.title = "Delete task"; removeButton.setAttribute("aria-label", `Delete ${task.text}`);
        removeButton.addEventListener("click", () => remove(task.id));
        row.append(label, removeButton); list.append(row);
      });
      list.scrollTop = scrollTop;
      document.getElementById("taskEmpty").hidden = tasks.length > 0;
      document.getElementById("taskCount").textContent = `${tasks.filter((task) => !task.completed).length} TO DO`;
      document.getElementById("tasksCompleted").textContent = completedTotal;
      document.getElementById("gamesUnlocked").textContent = unlockedGames.length;
      const ready = availableUnlocks(), allUnlocked = unlockedGames.length === games.length;
      const progress = allUnlocked ? 10 : completedTotal % 10;
      document.getElementById("taskProgress").value = progress;
      document.getElementById("taskProgressLabel").textContent = `${progress} / 10`;
      status.textContent = allUnlocked ? "The whole arcade is unlocked!" : ready ? `${ready} game unlock${ready === 1 ? "" : "s"} ready. Choose a game below!` : `${10 - progress} task${10 - progress === 1 ? "" : "s"} to ${completedTotal < 10 ? "your first" : "the next"} game.`;
      status.classList.toggle("is-ready", ready > 0 || allUnlocked);
    }
    function save() { localStorage.setItem(storageKey, JSON.stringify(snapshot())); }
    function changed() { save(); render(); onChange(); }
    function add(text) {
      const trimmed = String(text || "").trim().slice(0, 200);
      if (!trimmed) return false;
      tasks.push({ id: nextId++, text: trimmed, completed: false, credited: false });
      changed(); return true;
    }
    function toggle(id) {
      const task = tasks.find((entry) => entry.id === id); if (!task) return false;
      task.completed = !task.completed;
      if (task.completed && !task.credited) { task.credited = true; completedTotal++; }
      changed();
      const checkbox = list.querySelectorAll("input")[tasks.indexOf(task)];
      checkbox?.focus({ preventScroll: true });
      return true;
    }
    function remove(id) {
      const index = tasks.findIndex((task) => task.id === id); if (index === -1) return false;
      tasks.splice(index, 1); changed();
      const nextCheckbox = list.querySelectorAll("input")[Math.min(index, tasks.length - 1)];
      (nextCheckbox || input).focus({ preventScroll: true });
      return true;
    }
    function unlock(id) {
      if (!gameIds.has(id) || isUnlocked(id) || !availableUnlocks()) return false;
      unlockedGames.push(id); changed(); return true;
    }
    function reset() { tasks = []; completedTotal = 0; unlockedGames = []; nextId = 1; input.value = ""; changed(); }
    function restore(saved) { if (!load(saved)) return false; changed(); return true; }

    document.getElementById("taskForm").addEventListener("submit", (event) => {
      event.preventDefault();
      if (add(input.value)) input.value = "";
      input.focus({ preventScroll: true });
    });
    render();
    return { add, toggle, remove, unlock, isUnlocked, availableUnlocks, snapshot, reset, restore };
  };
})();
