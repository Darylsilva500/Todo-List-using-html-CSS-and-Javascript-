const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const completedTasksList = document.getElementById("completedTasksList");

let undoStack = [];
let redoStack = [];
let completedTasks = [];


function addTask() {
    if (taskInput.value.trim() === "") {
        alert("Please enter a task");
    } else {
        let taskText = taskInput.value.trim();

      
        let listItem = document.createElement("li");
        listItem.textContent = taskText;
        taskList.appendChild(listItem);

       
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "\u00D7";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = function() {
            listItem.remove();
            removeCompletedTask(taskText); 
            updateLocalStorageAndUI();
        };
        listItem.appendChild(deleteButton);

      
        listItem.addEventListener("click", function() {
            toggleCompleted(listItem, taskText);
            updateLocalStorageAndUI();
        });

        taskInput.value = "";
        undoStack.push(getTaskListHTML());
        updateLocalStorageAndUI();
    }
}


function toggleCompleted(listItem, taskText) {
    listItem.classList.toggle("completed");
    if (listItem.classList.contains("completed")) {
        completedTasks.push(taskText);
        displayCompletedTasks();
    } else {
        removeCompletedTask(taskText);
    }
}


function removeCompletedTask(taskText) {
    completedTasks = completedTasks.filter(task => task !== taskText);
    displayCompletedTasks();
}

function displayCompletedTasks() {
    completedTasksList.innerHTML = ""; 
    completedTasks.forEach(task => {
        let completedItem = document.createElement("li");
        completedItem.textContent = task;
        completedTasksList.appendChild(completedItem);
    });
}


function deleteAllTasks() {
    taskList.innerHTML = "";
    completedTasks = [];
    completedTasksList.innerHTML = "";
    undoStack.push("");
    redoStack = [];
    updateLocalStorageAndUI();
}


document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.key === "z") {
        redoStack.push(undoStack.pop());
        taskList.innerHTML = undoStack[undoStack.length - 1] || "";
        displayCompletedTasks();
        updateLocalStorage();
    } else if (e.ctrlKey && e.key === "y") {
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop());
            taskList.innerHTML = undoStack[undoStack.length - 1];
            displayCompletedTasks();
            updateLocalStorage();
        }
    }
});


function updateLocalStorage() {
    localStorage.setItem("tasks", taskList.innerHTML);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}


function updateLocalStorageAndUI() {
    updateLocalStorage();
    undoStack.push(getTaskListHTML());
    displayCompletedTasks();
}


function getTaskListHTML() {
    return taskList.innerHTML;
}


function loadTasksFromLocalStorage() {
    taskList.innerHTML = localStorage.getItem("tasks") || "";
    completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    displayCompletedTasks();
    undoStack.push(getTaskListHTML());
}


loadTasksFromLocalStorage();


taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});
