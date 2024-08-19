// Retrieve todo from local storage or initialize an empty array, so when refresh page or exit page, when you come back its all still there
//json is sorta like a formatter, poarse is making json from string to an object
let todo = JSON.parse(localStorage.getItem("todo")) || []; //this is getting the info from the storage from the todo list, so if there were todos, then it is keeping that, if it doesnt exist, it is an empty array
const todoInput = document.getElementById("todoInput"); //grabbing todoInput id from html doc
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const themeToggleButton = document.getElementById("themeToggle");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

function showDeleteButton(index) {
  document.getElementById(`deleteTask-${index}`).style.display = "inline";
}

function hideDeleteButton(index) {
  document.getElementById(`deleteTask-${index}`).style.display = "none";
}

//initialize inputs
document.addEventListener("DOMContentLoaded", function () {
  const currentTheme = localStorage.getItem("theme"); //dark mode
  if (currentTheme) {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }
  //  Set the button's icon based on the theme
  themeToggleButton.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
});

// Toggle dark mode when the button is clicked
themeToggleButton.addEventListener("click", function () {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggleButton.textContent = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    themeToggleButton.textContent = "☀️";
  }
});

function addTask() {
  //add task to todo list
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({
      text: newTask,
      disabled: false,
    }); //if there is new todo add it to the todo array
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function deleteTask(index) {
  todo.splice(index, 1); // Remove the task at the specified index
  saveToLocalStorage(); // Save the updated list to localStorage
  displayTasks(); // Update the task list display
}

function deleteAllTasks() {
  todo = []; //empty tasks array
  saveToLocalStorage();
  displayTasks();
}

// This function will update the counter based on the number of non-disabled tasks
function updateTaskCount() {
  const activeTasks = todo.filter((task) => !task.disabled).length; //the filter method is called on todo array, creating a new array containing all elements of todo array that meet condition specified : (if task is not disabled). this is shown because it is saying for each task in the todo array, it checks if the task.disabled property is false, if task.disabled is false, it will include it in the array.
  todoCount.textContent = activeTasks; // Update the text content to reflect the number of active tasks
}

function displayTasks() {
  todoList.innerHTML = ""; // Clear the list first
  todo.forEach((item, index) => {
    const p = document.createElement("p"); // Create a new HTML paragraph
    p.innerHTML = `
      <div class="todo-container">
        <span class="task-number">${index + 1}. </span> <!-- Task number -->
        <input type="checkbox" class="todo-checkbox" id="input-${index}" ${
      item.disabled ? "checked" : ""
    }>
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">
          ${item.text}
        </p>
        <button id="deleteTask-${index}" class="delete-btn" onclick="deleteTask(${index})">X</button>
      </div>
    `; // HTML code
    p.querySelector(".todo-checkbox").addEventListener("change", () => {
      toggleTask(index);
    });
    todoList.appendChild(p);
  });

  // Call updateTaskCount whenever the tasks are displayed or modified
  updateTaskCount();
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`); //todo item is the todo text that we click on
  const existingText = todo[index].text; //existing text is the the text in it
  const inputElement = document.createElement("input");

  inputElement.value = existingText; //input value is the existing text
  todoItem.replaceWith(inputElement); //replace item with input element
  inputElement.focus(); //when changing this, do not type in the "new todo" bar, but a new type where the todo is

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
      displayTasks();
    }
  });
}

function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled; //sets task to not be disabled if not diabled when clicked, and the opposite if it is
  saveToLocalStorage(); //saves it so it will stay when reloaded
  displayTasks(); //display
  updateTaskCount(); // Update the task counter
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}
