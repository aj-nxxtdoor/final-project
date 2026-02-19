// ---- localStorage helpers ----

const STORAGE_KEY = 'studytrack_tasks';

// get all tasks from localStorage
function getTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to parse tasks from localStorage', e);
        return [];
    }
}

// save tasks array back to localStorage
function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// add a single task and persist
function addTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    saveTasks(tasks);
}

// delete task by id
function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
}

// toggle the done status of a task
function toggleDone(id) {
    const tasks = getTasks();
    const target = tasks.find(t => t.id === id);
    if (target) {
        target.done = !target.done;
    }
    saveTasks(tasks);
}

// generate a simple unique id using timestamp + random number
function generateId() {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

// ---- Mobile nav toggle ---- (used on every page)
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
        });
    }
});