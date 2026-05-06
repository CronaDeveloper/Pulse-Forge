async function loadData() {
  const response = await fetch("data.json");
  if (!response.ok) {
    throw new Error("Could not load data.json");
  }
  return response.json();
}

function renderStatus(statusItems) {
  const grid = document.getElementById("status-grid");
  grid.innerHTML = "";
  statusItems.forEach((item) => {
    const card = document.createElement("article");
    card.className = "status-card";
    card.innerHTML = `<p class="status-title">${item.name}</p><p class="status-value"><span class="dot ${item.indicator}"></span>${item.value}</p>`;
    grid.appendChild(card);
  });
}

function renderUpdates(updates) {
  const list = document.getElementById("updates-list");
  list.innerHTML = "";
  updates.forEach((update) => {
    const entry = document.createElement("article");
    entry.className = "update-item";
    const points = update.items.map((point) => `<li>${point}</li>`).join("");
    entry.innerHTML = `<h3>${update.version}</h3><ul>${points}</ul>`;
    list.appendChild(entry);
  });
}

function renderRoadmap(roadmap) {
  const grid = document.getElementById("roadmap-grid");
  grid.innerHTML = "";
  const columns = [
    { title: "Planned", items: roadmap.planned },
    { title: "In Progress", items: roadmap.inProgress },
    { title: "Done", items: roadmap.done }
  ];
  columns.forEach((column) => {
    const wrapper = document.createElement("article");
    wrapper.className = "roadmap-col";
    wrapper.innerHTML = `<h3>${column.title}</h3>`;
    const list = document.createElement("ul");
    column.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    wrapper.appendChild(list);
    grid.appendChild(wrapper);
  });
}

function renderIssues(issues) {
  const list = document.getElementById("issues-list");
  list.innerHTML = "";
  issues.forEach((issue) => {
    const li = document.createElement("li");
    li.textContent = issue;
    list.appendChild(li);
  });
}

function renderLinks(links) {
  const grid = document.getElementById("links-grid");
  grid.innerHTML = "";
  links.forEach((link) => {
    const a = document.createElement("a");
    a.className = "link-btn";
    a.href = link.url;
    a.textContent = link.name;
    grid.appendChild(a);
  });
}

function renderNotes(notes) {
  const box = document.getElementById("notes-content");
  box.innerHTML = notes.map((note) => `<p>${note}</p>`).join("");
}

function renderMeta(meta) {
  document.getElementById("last-build").textContent = `Latest Build: ${meta.latestBuild}`;
  document.getElementById("last-push").textContent = `Last pushed update: ${meta.lastPushedUpdate}`;
}

async function bootstrap() {
  try {
    const data = await loadData();
    renderMeta(data.meta);
    renderStatus(data.statusCards);
    renderUpdates(data.updates);
    renderRoadmap(data.roadmap);
    renderIssues(data.knownIssues);
    renderLinks(data.links);
    renderNotes(data.devNotes);
  } catch (error) {
    const layout = document.querySelector(".layout");
    layout.innerHTML = `<section class="panel"><h2>Failed to load dashboard data</h2><p class="soft">${error.message}</p></section>`;
  }
}

bootstrap();
