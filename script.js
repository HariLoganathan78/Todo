let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentUser = localStorage.getItem("user");

function loadDashboard() {
  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("userName").innerText = currentUser;
  displayTasks("all");
}

function addTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const dueDate = document.getElementById("taskDue").value;
  const priority = document.getElementById("taskPriority").value;
  const status = document.getElementById("taskStatus").value;
  const sharedWith = document.getElementById("taskShare").value.trim();

  if (!title || !dueDate) {
    alert("Please fill in task title and due date.");
    return;
  }

  const task = {
    id: Date.now(),
    user: currentUser,
    title,
    dueDate,
    priority,
    status,
    sharedWith
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  clearForm();
  displayTasks("all");
}

function displayTasks(filter) {
  const listContainer = document.getElementById("taskList");
  listContainer.innerHTML = "";

  let filtered = tasks.filter((t) => t.user === currentUser);

  if (filter === "today") {
    const today = new Date().toISOString().split("T")[0];
    filtered = filtered.filter((t) => t.dueDate === today);
  } else if (filter === "completed") {
    filtered = filtered.filter((t) => t.status === "completed");
  } else if (filter === "in-progress") {
    filtered = filtered.filter((t) => t.status === "in-progress");
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = "<p style='color:white;'>No tasks found.</p>";
    return;
  }

  filtered.forEach((task) => {
    const div = document.createElement("div");
    div.className = "task-item";
    div.innerHTML = `
      <div>
        <strong>${task.title}</strong><br>
        <div class="task-meta">
          Due: ${task.dueDate} |
          Priority: <span class="priority-badge ${task.priority}">${task.priority}</span> |
          Status: <span class="status-badge ${task.status}">${task.status.replace("-", " ")}</span>
        </div>
        ${task.sharedWith ? `<div class="task-meta">Shared with: ${task.sharedWith}</div>` : ""}
      </div>
      <div class="task-actions">
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
        ${task.status !== "completed" ? `<button onclick="markCompleted(${task.id})">Mark as Completed 🎉</button>` : ""}
      </div>
    `;
    listContainer.appendChild(div);
  });
}

function markCompleted(id) {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = "completed";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks("all");
    launchConfetti();
  }
}

function launchConfetti() {
  confetti({
    particleCount: 120,
    spread: 90,
    origin: { y: 0.6 },
    colors: ['#00e676', '#ffeb3b', '#ff4081', '#03a9f4']
  });
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks("all");
  }
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDue").value = task.dueDate;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskStatus").value = task.status;
  document.getElementById("taskShare").value = task.sharedWith;

  deleteTask(id); 
}

function clearForm() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDue").value = "";
  document.getElementById("taskPriority").value = "medium";
  document.getElementById("taskStatus").value = "in-progress";
  document.getElementById("taskShare").value = "";
}

function filterTasks(type) {
  displayTasks(type);
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
