document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList  = document.getElementById('task-list');

taskForm.addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const taskItem = createTaskElement(taskText);
    taskList.appendChild(taskItem);
    saveTask(taskText);
    taskInput.value = '';
}

function createTaskElement(text, completed = false) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = text;
    li.appendChild(span);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = 'Complete';
    completeBtn.addEventListener('click', () => toggleComplete(li, text));

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTask(li, span, text));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(li, text));

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(actions);

    return li;
}

function toggleComplete(taskItem, text) {
    taskItem.classList.toggle('completed');
    updateTaskStatus(text, taskItem.classList.contains('completed'));
}

function editTask(taskItem, span, oldText) {
    const newText = prompt('Edit your task:', span.textContent);
    if (newText && newText.trim() !== '') {
        span.textContent = newText.trim();
        updateTaskText(oldText, newText.trim());
    }
}

function deleteTask(taskItem, text) {
    if (confirm('Are you sure you want to delete this task?')) {
        taskItem.remove();
        removeTask(text);
    }
}

function saveTask(text) {
    const tasks = getTasksFromStorage();
    tasks.push({ text, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => {
        const taskItem = createTaskElement(task.text, task.completed);
        taskList.appendChild(taskItem);
    });
}

function updateTaskStatus(text, completed) {
    const tasks = getTasksFromStorage();
    const index = tasks.findIndex(task => task.text === text);
    if (index > -1) {
        tasks[index].completed = completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTaskText(oldText, newText) {
    const tasks = getTasksFromStorage();
    const index = tasks.findIndex(task => task.text === oldText);
    if (index > -1) {
        tasks[index].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function removeTask(text) {
    let tasks = getTasksFromStorage();
    tasks = tasks.filter(task => task.text !== text);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
