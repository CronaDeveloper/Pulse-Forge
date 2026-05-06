const SUPABASE_URL = "https://eldusrjwdmvfkiasifci.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fvu0qoPbxKJpqoTUG74NUQ_rCPdnqj2";
const OWNER_EMAILS = ["cronadeveloper@gmail.com", "cronadeveloper@outlook.com", "cronadeveloper@yahoo.com"];
const CONTENT_TABLE = "pulseforge_content";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentData = null;
let currentUser = null;

function setText(id, value) {
  document.getElementById(id).textContent = value;
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
  setText("last-build", `Latest Build: ${meta.latestBuild}`);
  setText("last-push", `Last pushed update: ${meta.lastPushedUpdate}`);
}

function renderDashboard(data) {
  currentData = data;
  renderMeta(data.meta);
  renderStatus(data.statusCards);
  renderUpdates(data.updates);
  renderRoadmap(data.roadmap);
  renderIssues(data.knownIssues);
  renderLinks(data.links);
  renderNotes(data.devNotes);
}

function isOwner(user) {
  if (!user || !user.email) {
    return false;
  }
  return OWNER_EMAILS.includes(user.email.toLowerCase());
}

function updateAuthUi() {
  const ownerEditor = document.getElementById("owner-editor");
  if (!currentUser) {
    setText("auth-state", "Not logged in");
    ownerEditor.classList.add("hidden");
    return;
  }
  setText("auth-state", `Logged in as ${currentUser.email}`);
  if (isOwner(currentUser)) {
    ownerEditor.classList.remove("hidden");
    document.getElementById("editor-json").value = JSON.stringify(currentData, null, 2);
  } else {
    ownerEditor.classList.add("hidden");
  }
}

function setMessage(id, text, color) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.style.color = color;
}

async function loadFallbackData() {
  const response = await fetch("data.json");
  if (!response.ok) {
    throw new Error("Could not load data.json");
  }
  return response.json();
}

async function loadDashboardData() {
  const { data, error } = await supabaseClient.from(CONTENT_TABLE).select("payload").eq("id", 1).maybeSingle();
  if (!error && data && data.payload) {
    return data.payload;
  }
  return loadFallbackData();
}

async function saveDashboardData(payload) {
  const { error } = await supabaseClient.from(CONTENT_TABLE).upsert({ id: 1, payload }, { onConflict: "id" });
  if (error) {
    throw error;
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    setMessage("auth-message", error.message, "#ef5454");
    return;
  }
  setMessage("auth-message", "Account created. Confirm email if required, then login.", "#35d07f");
  event.target.reset();
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    setMessage("auth-message", error.message, "#ef5454");
    return;
  }
  currentUser = data.user;
  updateAuthUi();
  setMessage("auth-message", "Login successful.", "#35d07f");
  event.target.reset();
}

async function handleLogout() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setMessage("auth-message", error.message, "#ef5454");
    return;
  }
  currentUser = null;
  updateAuthUi();
  setMessage("auth-message", "Logged out.", "#98a6cb");
}

async function handleSave() {
  if (!currentUser || !isOwner(currentUser)) {
    setMessage("save-message", "Only owner accounts can save data.", "#ef5454");
    return;
  }
  const raw = document.getElementById("editor-json").value;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    setMessage("save-message", "Invalid JSON format.", "#ef5454");
    return;
  }
  try {
    await saveDashboardData(parsed);
    renderDashboard(parsed);
    setMessage("save-message", "Saved to Supabase.", "#35d07f");
  } catch (error) {
    setMessage("save-message", error.message, "#ef5454");
  }
}

async function initSession() {
  const { data } = await supabaseClient.auth.getUser();
  currentUser = data.user;
  updateAuthUi();
}

function bindEvents() {
  document.getElementById("signup-form").addEventListener("submit", handleSignup);
  document.getElementById("login-form").addEventListener("submit", handleLogin);
  document.getElementById("logout-btn").addEventListener("click", handleLogout);
  document.getElementById("save-content-btn").addEventListener("click", handleSave);
  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session ? session.user : null;
    updateAuthUi();
  });
}

async function bootstrap() {
  try {
    const data = await loadDashboardData();
    renderDashboard(data);
    await initSession();
    bindEvents();
  } catch (error) {
    const layout = document.querySelector(".layout");
    layout.innerHTML = `<section class="panel"><h2>Failed to load dashboard</h2><p class="soft">${error.message}</p></section>`;
  }
}

bootstrap();
