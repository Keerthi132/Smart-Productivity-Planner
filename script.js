document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  let taskInput = document.getElementById("taskInput");
  let taskText = taskInput.value.trim();
  if (taskText === "") return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.unshift({ text: taskText, completed: false });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  loadTasks();
}

function loadTasks() {
  let taskList = document.getElementById("taskList");
  let completedTasks = document.getElementById("completedTasks");
  let noTasksBox = document.getElementById("noTasksBox");
  let noCompletedTasksBox = document.getElementById("noCompletedTasksBox");

  taskList.innerHTML = "";
  completedTasks.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let hasPending = false;
  let hasCompleted = false;

  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
      <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
      <input type="text" class="edit-input" value="${task.text}" onblur="saveEdit(${index}, this)">
      ${task.completed ? '' : `
        <button class="edit-btn" onclick="editTask(this)">✏️ Edit</button>
        <button class="save-btn" onclick="saveEdit(${index}, this.previousElementSibling)">✔ Save</button>
        <button class="delete-btn" onclick="deleteTask(${index})">❌ Delete</button>
      `}
    `;

    if (task.completed) {
      hasCompleted = true;
      completedTasks.appendChild(li);
    } else {
      hasPending = true;
      taskList.appendChild(li);
    }
  });

  noTasksBox.style.display = hasPending ? "none" : "block";
  noCompletedTasksBox.style.display = hasCompleted ? "none" : "block";
}

function toggleTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const confirmation = confirm("Are you sure you want to delete this task?");
  if (confirmation) {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function editTask(button) {
  let li = button.parentElement;
  let span = li.querySelector(".task-text");
  let input = li.querySelector(".edit-input");
  let saveBtn = li.querySelector(".save-btn");
  span.style.display = "none";
  input.style.display = "inline-block";
  input.focus();
  saveBtn.style.display = "inline-block";
}

function saveEdit(index, input) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index].text = input.value.trim();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function clearCompletedTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(task => !task.completed);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}
