class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
        this.taskIdCounter = parseInt(localStorage.getItem('taskIdCounter')) || 1;
        this.editingTaskId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    initializeElements() {
        this.taskInput = document.getElementById('taskInput');
        this.addBtn = document.getElementById('addBtn');
        this.tasksContainer = document.getElementById('tasksContainer');
        this.noTasks = document.getElementById('noTasks');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.totalTasks = document.getElementById('totalTasks');
        this.completedTasks = document.getElementById('completedTasks');
        this.remainingTasks = document.getElementById('remainingTasks');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        this.clearAllBtn.addEventListener('click', () => this.clearAllTasks());
    }

    addTask() {
        const taskText = this.taskInput.value.trim();
        
        if (!taskText) {
            this.taskInput.focus();
            return;
        }

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, taskText);
            this.editingTaskId = null;
            this.addBtn.textContent = 'Add Task';
        } else {
            const newTask = {
                id: this.taskIdCounter++,
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.tasks.unshift(newTask);
        }

        this.taskInput.value = '';
        this.saveToLocalStorage();
        this.renderTasks();
        this.updateStats();
    }

    updateTask(taskId, newText) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].text = newText;
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.renderTasks();
            this.updateStats();
        }
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveToLocalStorage();
        this.renderTasks();
        this.updateStats();
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.taskInput.value = task.text;
            this.taskInput.focus();
            this.editingTaskId = taskId;
            this.addBtn.textContent = 'Update Task';
        }
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            this.tasks = [];
            this.saveToLocalStorage();
            this.renderTasks();
            this.updateStats();
        }
    }

    renderTasks() {
        if (this.tasks.length === 0) {
            this.noTasks.style.display = 'block';
            this.clearAllBtn.disabled = true;
            return;
        }

        this.noTasks.style.display = 'none';
        this.clearAllBtn.disabled = false;

        const tasksHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                     onclick="todoApp.toggleTask(${task.id})"></div>
                <span class="task-text ${task.completed ? 'completed' : ''}">${this.escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="btn edit-btn" onclick="todoApp.editTask(${task.id})" 
                            ${task.completed ? 'disabled' : ''}>Edit</button>
                    <button class="btn delete-btn" onclick="todoApp.deleteTask(${task.id})">Delete</button>
                </div>
            </div>
        `).join('');

        this.tasksContainer.innerHTML = tasksHTML;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        this.totalTasks.textContent = total;
        this.completedTasks.textContent = completed;
        this.remainingTasks.textContent = remaining;
    }

    saveToLocalStorage() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        localStorage.setItem('taskIdCounter', this.taskIdCounter.toString());
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const todoApp = new TodoApp();