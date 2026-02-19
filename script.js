const addTaskBtn = document.getElementById("addTaskBtn");
const taskModal = document.getElementById("taskModal");
const closeModal = document.getElementById("closeModal");
const taskForm = document.getElementById("taskForm");
const modalTitle = document.getElementById("modalTitle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingId = null;

/* SALVAR */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* RENDERIZAR */
function renderTasks() {
  document.querySelectorAll(".task-list").forEach(col => col.innerHTML = "");

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.classList.add("task");
    div.draggable = true;
    div.dataset.id = task.id;

    div.innerHTML = `
      <div>
        <strong>${task.title}</strong><br>
        <small>${task.date || ""}</small>
      </div>
      <div style="margin-top:8px;">
        <button onclick="editTask(${task.id})">✏️</button>
        <button onclick="deleteTask(${task.id})">🗑️</button>
      </div>
    `;

    const column = document.getElementById(task.status);

    if (column) {
      column.appendChild(div);
      addDragEvents(div);
    }
  });
}

/* ABRIR MODAL */
addTaskBtn.addEventListener("click", () => {
  editingId = null;
  modalTitle.textContent = "Nova Tarefa";
  taskForm.reset();
  taskModal.style.display = "flex";
});

/* FECHAR */
closeModal.addEventListener("click", () => {
  taskModal.style.display = "none";
});

/* SALVAR (CRIAR OU EDITAR) */
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("taskTitle").value;
  const date = document.getElementById("taskDate").value;
  const status = document.getElementById("taskStatus").value;

  if (editingId) {
    const task = tasks.find(t => t.id === editingId);
    task.title = title;
    task.date = date;
    task.status = status;
  } else {
    tasks.push({
      id: Date.now(),
      title,
      date,
      status
    });
  }

  saveTasks();
  renderTasks();
  taskModal.style.display = "none";
});

/* EDITAR */
function editTask(id) {
  const task = tasks.find(t => t.id === id);

  editingId = id;
  modalTitle.textContent = "Editar Tarefa";

  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDate").value = task.date;
  document.getElementById("taskStatus").value = task.status;

  taskModal.style.display = "flex";
}

/* DELETAR */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

/* DRAG */
function addDragEvents(task) {
  task.addEventListener("dragstart", () => {
    task.classList.add("dragging");
  });

  task.addEventListener("dragend", () => {
    task.classList.remove("dragging");

    const id = Number(task.dataset.id);
    const parentColumn = task.parentElement;

    const t = tasks.find(t => t.id === id);
    if (t) {
      t.status = parentColumn.id;
      saveTasks();
    }
  });
}

/* DRAG ENTRE COLUNAS */
document.querySelectorAll(".task-list").forEach(column => {

  column.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    if (!dragging) return;
    column.appendChild(dragging);
  });

});

/* INICIALIZA */
renderTasks();
