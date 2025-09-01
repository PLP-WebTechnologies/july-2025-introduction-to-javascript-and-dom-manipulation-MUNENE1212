// ========================================
// PART 1: VARIABLE DECLARATIONS AND CONDITIONALS
// ========================================

// Array to store all tasks
let tasks = [];
let taskIdCounter = 1;
let currentFilter = 'all'; // Track current filter state

// Task priority levels with associated colors and weights
const priorityLevels = {
    'high': { weight: 3, color: 'red' },
    'medium': { weight: 2, color: 'orange' },
    'low': { weight: 1, color: 'green' }
};

// Application settings
const appSettings = {
    maxTaskLength: 100,
    allowEmptyTasks: false,
    autoSave: true
};

// ========================================
// PART 2: CUSTOM FUNCTIONS (At least 2)
// ========================================

/**
 * Function 1: Add a new task to the list
 * Includes input validation and conditional logic
 */
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    
    // Get and trim the task text
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    // Conditional validation
    if (!taskText) {
        alert('Please enter a task!');
        return;
    }
    
    if (taskText.length > appSettings.maxTaskLength) {
        alert(`Task is too long! Maximum ${appSettings.maxTaskLength} characters.`);
        return;
    }
    
    // Check for duplicate tasks (conditional logic)
    const isDuplicate = tasks.some(task => 
        task.text.toLowerCase() === taskText.toLowerCase() && !task.completed
    );
    
    if (isDuplicate) {
        const confirmAdd = confirm('A similar task already exists. Add anyway?');
        if (!confirmAdd) return;
    }
    
    // Create new task object
    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        priority: priority,
        completed: false,
        createdAt: new Date().toLocaleString()
    };
    
    // Add task to array
    tasks.push(newTask);
    
    // Clear input
    taskInput.value = '';
    
    // Update display
    renderTasks();
    updateStats();
}

/**
 * Function 2: Filter tasks based on completion status
 * Uses conditional logic to determine which tasks to show
 */
function filterTasks(filterType) {
    currentFilter = filterType;
    
    // Conditional filtering based on type
    let filteredTasks;
    
    if (filterType === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filterType === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else {
        // Default to 'all'
        filteredTasks = tasks;
    }
    
    return filteredTasks;
}

/**
 * Function 3: Calculate task statistics
 * Uses conditional counting and returns an object
 */
function calculateStats() {
    const stats = {
        total: tasks.length,
        completed: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0
    };
    
    // Count tasks by status and priority
    tasks.forEach(task => {
        if (task.completed) {
            stats.completed++;
        } else {
            stats.pending++;
        }
        
        // Count by priority
        if (task.priority === 'high') stats.highPriority++;
        else if (task.priority === 'medium') stats.mediumPriority++;
        else if (task.priority === 'low') stats.lowPriority++;
    });
    
    return stats;
}

// ========================================
// PART 3: LOOPS (At least 2 examples)
// ========================================

/**
 * Loop Example 1: Render all tasks using forEach loop
 * Demonstrates iteration over array with DOM manipulation
 */
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const filteredTasks = filterTasks(currentFilter);
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Check if no tasks to display
    if (filteredTasks.length === 0) {
        const emptyMessage = currentFilter === 'all' 
            ? 'No tasks yet. Add one above to get started!'
            : `No ${currentFilter} tasks found.`;
        
        taskList.innerHTML = `<p>${emptyMessage}</p>`;
        return;
    }
    
    // Loop through filtered tasks and create DOM elements
    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <div>
                <strong>${task.text}</strong><br>
                <small>Priority: ${task.priority.toUpperCase()} | Added: ${task.createdAt}</small>
            </div>
            <div class="task-actions">
                <button class="complete-btn" onclick="toggleTask(${task.id})">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        
        taskList.appendChild(taskElement);
    });
}

/**
 * Loop Example 2: Sort tasks by priority using for loop
 * Demonstrates traditional for loop with comparison logic
 */
function sortTasksByPriority() {
    // Create a copy of tasks array to avoid modifying original during iteration
    const sortedTasks = [...tasks];
    
    // Bubble sort implementation using nested for loops
    for (let i = 0; i < sortedTasks.length - 1; i++) {
        for (let j = 0; j < sortedTasks.length - i - 1; j++) {
            const currentPriority = priorityLevels[sortedTasks[j].priority].weight;
            const nextPriority = priorityLevels[sortedTasks[j + 1].priority].weight;
            
            // Sort in descending order (high priority first)
            if (currentPriority < nextPriority) {
                // Swap tasks
                const temp = sortedTasks[j];
                sortedTasks[j] = sortedTasks[j + 1];
                sortedTasks[j + 1] = temp;
            }
        }
    }
    
    // Update the main tasks array
    tasks = sortedTasks;
    
    // Re-render tasks
    renderTasks();
}

/**
 * Loop Example 3: Clear completed tasks using while loop
 * Demonstrates while loop with conditional removal
 */
function clearCompletedTasks() {
    const completedCount = tasks.filter(task => task.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }
    
    const confirmClear = confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`);
    if (!confirmClear) return;
    
    // Use while loop to remove completed tasks
    let i = 0;
    while (i < tasks.length) {
        if (tasks[i].completed) {
            tasks.splice(i, 1); // Remove task at index i
            // Don't increment i since array length changed
        } else {
            i++; // Only increment if no removal
        }
    }
    
    renderTasks();
    updateStats();
}

// ========================================
// PART 4: DOM INTERACTIONS (At least 3)
// ========================================

/**
 * DOM Interaction 1: Toggle task completion status
 * Modifies DOM classes and updates task data
 */
function toggleTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        // Toggle completion status
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        
        // Update DOM and stats
        renderTasks();
        updateStats();
    }
}

/**
 * DOM Interaction 2: Delete task
 * Removes task from array and updates DOM
 */
function deleteTask(taskId) {
    const confirmDelete = confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;
    
    // Find and remove task
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        
        // Update DOM and stats
        renderTasks();
        updateStats();
    }
}

/**
 * DOM Interaction 3: Update statistics display
 * Updates multiple DOM elements with calculated values
 */
function updateStats() {
    const stats = calculateStats();
    
    // Update DOM elements with new stats
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('completedTasks').textContent = stats.completed;
    document.getElementById('pendingTasks').textContent = stats.pending;
}

// Filter function implementations for button clicks
function showAllTasks() {
    currentFilter = 'all';
    renderTasks();
}

function showCompletedTasks() {
    currentFilter = 'completed';
    renderTasks();
}

function showPendingTasks() {
    currentFilter = 'pending';
    renderTasks();
}

// ========================================
// EVENT LISTENERS AND INITIALIZATION
// ========================================

// Add Enter key support for task input
document.getElementById('taskInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add some sample tasks for demonstration
    tasks = [
        {
            id: taskIdCounter++,
            text: "Complete JavaScript assignment",
            priority: "high",
            completed: false,
            createdAt: new Date().toLocaleString()
        },
        {
            id: taskIdCounter++,
            text: "Study for exam",
            priority: "medium",
            completed: false,
            createdAt: new Date().toLocaleString()
        },
        {
            id: taskIdCounter++,
            text: "Buy groceries",
            priority: "low",
            completed: true,
            createdAt: new Date().toLocaleString()
        }
    ];
    
    // Initial render
    renderTasks();
    updateStats();
});
