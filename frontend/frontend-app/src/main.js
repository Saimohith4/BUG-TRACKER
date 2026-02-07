import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import Sortable from 'sortablejs';

document.querySelector('#app').innerHTML = `
  <h2>Bug Tracker Dashboard</h2>
  <button id="load">Load Tickets</button>
  <div id="list"></div>
`;

const API = "http://127.0.0.1:8000";

/* ---------- APP LAYOUT ---------- */
function layout(content) {
  document.querySelector('#app').innerHTML = `
    <div style="display:flex;height:100vh;font-family:Segoe UI">

      <div style="width:220px;background:#111827;color:white;padding:20px;">
        <h2>BugTracker</h2>
        <hr>
        <div id="navDash" style="cursor:pointer;margin:10px 0;">Dashboard</div>
        <div id="navProj" style="cursor:pointer;margin:10px 0;">Projects</div>
        <div id="logout" style="cursor:pointer;margin:10px 0;">Logout</div>
      </div>

      <div style="flex:1;padding:20px;background:#f3f4f6;overflow:auto;">
        ${content}
      </div>
    </div>
  `;

  navDash.onclick = showDashboard;
  navProj.onclick = showProjects;
  logout.onclick = () => {
    localStorage.removeItem("token");
    showLogin();
  };
}

/* ---------- LOGIN ---------- */
function showLogin() {
  document.querySelector('#app').innerHTML = `
    <div class="login-page">
      <div class="login-card">
        <h2>Bug Tracker</h2>
        <p class="subtitle">Sign in to continue</p>

        <input id="email" placeholder="Email">
        <input id="password" type="password" placeholder="Password">

        <button id="loginBtn" class="primary">Login</button>
        <button id="registerBtn" class="secondary">Register</button>
      </div>
    </div>
  `;

  loginBtn.onclick = async () => {
    const res = await fetch(API + "/users/login", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      showDashboard();
    } else alert("Login failed");
  };

  registerBtn.onclick = async () => {
    const res = await fetch(API + "/users/register", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    if (res.ok) alert("Registered successfully!");
    else alert("Registration failed");
  };
}


/* ---------- DASHBOARD ---------- */
function showDashboard() {
  layout(`
    <h2>Dashboard</h2>

    <div style="display:flex;gap:20px;margin-bottom:20px;">
      <div class="metric" id="totalBox">Total</div>
      <div class="metric" id="todoBox">To Do</div>
      <div class="metric" id="progressBox">In Progress</div>
      <div class="metric" id="doneBox">Done</div>
    </div>

    <h3>Create Ticket</h3>
    <input id="title" placeholder="Title"><br><br>
    <textarea id="desc" placeholder="Description"></textarea><br><br>

    <label>Project:</label>
    <select id="project"></select><br><br>

    <input id="assignee" placeholder="User ID"><br><br>
    <button id="create">Create Ticket</button>

    <hr>

    <button id="load">Refresh Board</button>

    <div class="board">
      <div class="column"><h3>To Do</h3><div id="todo"></div></div>
      <div class="column"><h3>In Progress</h3><div id="progress"></div></div>
      <div class="column"><h3>Done</h3><div id="done"></div></div>
    </div>
  `);

  create.onclick = createTicket;
  load.onclick = loadTickets;

  loadProjects();
  loadTickets();
  setupDrag();
}

/* ---------- PROJECT PAGE ---------- */
function showProjects() {
  layout(`
    <h2>Projects</h2>

    <input id="pname" placeholder="Project Name">
    <input id="owner" placeholder="Owner ID">
    <button id="createProject">Create Project</button>

    <div id="projectList"></div>
  `);

  createProject.onclick = createProjectFn;
  loadProjectList();
}

async function createProjectFn() {
  await fetch(API + "/projects/", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      name: pname.value,
      owner_id: parseInt(owner.value)
    })
  });

  loadProjectList();
}

/* ---------- PROJECT DROPDOWN ---------- */
async function loadProjects() {
  const res = await fetch(API + "/projects/");
  const projects = await res.json();

  project.innerHTML = "";
  projects.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    project.appendChild(opt);
  });
}

async function loadProjectList() {
  const res = await fetch(API + "/projects/");
  const projects = await res.json();

  projectList.innerHTML = "<h3>Project List</h3>";
  projects.forEach(p => {
    projectList.innerHTML += `<div>• ${p.name}</div>`;
  });
}

/* ---------- CREATE TICKET ---------- */
async function createTicket() {
  await fetch(API + "/tickets/", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      title: title.value,
      description: desc.value,
      project_id: parseInt(project.value),
      assignee_id: parseInt(assignee.value)
    })
  });

  loadTickets();
}

/* ---------- LOAD TICKETS ---------- */
async function loadTickets() {
  const res = await fetch(API + "/tickets/");
  const tickets = await res.json();

  todo.innerHTML = "";
  progress.innerHTML = "";
  done.innerHTML = "";

  let t1=0,t2=0,t3=0;

  tickets.forEach(t => {
    const div = document.createElement("div");
    div.className = "ticket";
    div.innerText = t.title;
    div.dataset.id = t.id;

    div.onclick = () => showModal(t);

    if (t.status === "To Do") { todo.appendChild(div); t1++; }
    else if (t.status === "In Progress") { progress.appendChild(div); t2++; }
    else { done.appendChild(div); t3++; }
  });

  totalBox.innerText = "Total: " + tickets.length;
  todoBox.innerText = "To Do: " + t1;
  progressBox.innerText = "In Progress: " + t2;
  doneBox.innerText = "Done: " + t3;
}

/* ---------- MODAL ---------- */
function showModal(t) {
  const modal = document.createElement("div");
  modal.style = "position:fixed;inset:0;background:#0008;display:flex;align-items:center;justify-content:center;";

  modal.innerHTML = `
    <div style="background:white;padding:20px;border-radius:10px;width:300px;">
      <h3>${t.title}</h3>
      <p>${t.description}</p>
      <p>Status: ${t.status}</p>
      <button id="close">Close</button>
    </div>
  `;

  document.body.appendChild(modal);
  close.onclick = () => modal.remove();
}

/* ---------- DRAG ---------- */
async function updateStatus(id, status) {
  await fetch(API + `/tickets/${id}/status`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({status})
  });
}

function setupDrag() {
  new Sortable(todo,{group:"tickets",onAdd:e=>updateStatus(e.item.dataset.id,"To Do")});
  new Sortable(progress,{group:"tickets",onAdd:e=>updateStatus(e.item.dataset.id,"In Progress")});
  new Sortable(done,{group:"tickets",onAdd:e=>updateStatus(e.item.dataset.id,"Done")});
}

/* ---------- START ---------- */
if (localStorage.getItem("token")) showDashboard();
else showLogin();