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

        let deleteButton = createDeleteButton(listItem, taskText);
        listItem.appendChild(deleteButton);

        listItem.addEventListener("click", function() {
            toggleCompleted(listItem, taskText);
            updateLocalStorageAndUI();
        });

        console.log(`Task added: ${taskText}`);
        taskInput.value = "";
        undoStack.push(getTaskListHTML());
        updateLocalStorageAndUI();
    }
}


function toggleCompleted(listItem, taskText) {
    listItem.classList.toggle("completed");
    if (listItem.classList.contains("completed")) {
        completedTasks.push(taskText);
        console.log(`Task marked as completed: ${taskText}`);
        displayCompletedTasks();
    } else {
        removeCompletedTask(taskText);
    }
}


function removeCompletedTask(taskText) {
    completedTasks = completedTasks.filter(task => task !== taskText);
    console.log(`Task removed from completed: ${taskText}`);
    displayCompletedTasks();
}


function createDeleteButton(listItem, taskText) {
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "\u00D7";
    deleteButton.className = "delete-btn";
    deleteButton.onclick = function(e) {
        e.stopPropagation(); 
        listItem.remove();
        removeCompletedTask(taskText);
        console.log(`Task deleted: ${taskText}`);
        updateLocalStorageAndUI();
    };
    return deleteButton;
}


function displayCompletedTasks() {
    completedTasksList.innerHTML = "";
    completedTasks.forEach(task => {
        let completedItem = document.createElement("li");
        completedItem.textContent = task;

        let deleteButton = createDeleteButton(completedItem, task);
        completedItem.appendChild(deleteButton);

        completedTasksList.appendChild(completedItem);
    });
}


function deleteAllTasks() {
    taskList.innerHTML = "";
    undoStack.push("");
    redoStack = [];
    console.log("All tasks deleted");
    updateLocalStorageAndUI();
}


document.addEventListener("keydown", function(e) {
    if (e.ctrlKey && e.key === "z") {
        redoStack.push(undoStack.pop());
        taskList.innerHTML = undoStack[undoStack.length - 1] || "";
        displayCompletedTasks();
        updateLocalStorage();
        console.log("Undo operation");
    } else if (e.ctrlKey && e.key === "y") {
        if (redoStack.length > 0) {
            undoStack.push(redoStack.pop());
            taskList.innerHTML = undoStack[undoStack.length - 1];
            displayCompletedTasks();
            updateLocalStorage();
            console.log("Redo operation");
        }
    }
});


function updateLocalStorage() {
    localStorage.setItem("tasks", taskList.innerHTML);
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    console.log("Local storage updated");
}


function updateLocalStorageAndUI() {
    updateLocalStorage();
    undoStack.push(getTaskListHTML());
    displayCompletedTasks();
    console.log("UI updated");
}


function getTaskListHTML() {
    return taskList.innerHTML;
}


function loadTasksFromLocalStorage() {
    taskList.innerHTML = localStorage.getItem("tasks") || "";
    completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    displayCompletedTasks();
    undoStack.push(getTaskListHTML());
    console.log("Tasks loaded from local storage");
}


loadTasksFromLocalStorage();


taskInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});
