// Function to add a new task
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() === '') {
        alert('Please enter a task');
        return;
    }

    const li = document.createElement('li');
    li.textContent = taskInput.value;
    li.addEventListener('click', toggleTask); // Add click listener for toggle

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function(event) {
        event.stopPropagation(); // Prevent li toggle when clicking delete button
        taskList.removeChild(li);
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    console.log(taskInput.value);
    taskInput.value = '';
}

// Function to toggle task completion
function toggleTask() {
    this.classList.toggle('completed');
}
