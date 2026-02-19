document.addEventListener('DOMContentLoaded', function() {

    // grab the filter and sort dropdowns
    const filterSelect = document.getElementById('filterSelect');
    const sortSelect = document.getElementById('sortSelect');

    // render tasks when page loads
    renderPage();

    // re-render when filters change
    filterSelect.addEventListener('change', renderPage);
    sortSelect.addEventListener('change', renderPage);

    function renderPage() {
        const tasks = getTasks();
        updateStats(tasks);
        const filtered = applyFilter(tasks, filterSelect.value);
        const sorted = applySort(filtered, sortSelect.value);
        renderTaskList(sorted);
    }

    // update the 3 stat numbers at the top
    function updateStats(tasks) {
        document.getElementById('totalCount').textContent = tasks.length;
        document.getElementById('pendingCount').textContent = tasks.filter(t => !t.done).length;
        document.getElementById('doneCount').textContent = tasks.filter(t => t.done).length;
    }

    // filter tasks based on selected filter value
    function applyFilter(tasks, filter) {
        switch(filter) {
            case 'pending':
                return tasks.filter(t => !t.done);
            case 'done':
                return tasks.filter(t => t.done);
            case 'high':
                return tasks.filter(t => t.priority === 'high');
            case 'medium':
                return tasks.filter(t => t.priority === 'medium');
            case 'low':
                return tasks.filter(t => t.priority === 'low');
            default:
                return tasks; // 'all'
        }
    }

    // sort the task list
    function applySort(tasks, sort) {
        // make a copy so we don't mutate the original
        const copy = [...tasks];
        if (sort === 'newest') {
            copy.sort((a, b) => b.createdAt - a.createdAt);
        } else if (sort === 'oldest') {
            copy.sort((a, b) => a.createdAt - b.createdAt);
        } else if (sort === 'deadline') {
            copy.sort((a, b) => {
                // tasks without a deadline go to the end
                if (!a.deadline) return 1;
                if (!b.deadline) return -1;
                return new Date(a.deadline) - new Date(b.deadline);
            });
        }
        return copy;
    }

    // render the task cards into the DOM
    function renderTaskList(tasks) {
        const listEl = document.getElementById('taskList');
        const emptyMsg = document.getElementById('emptyMsg');
        listEl.innerHTML = ''; // clear previous

        if (tasks.length === 0) {
            emptyMsg.classList.remove('hidden');
            return;
        }

        emptyMsg.classList.add('hidden');

        tasks.forEach(function(task) {
            const card = createTaskCard(task);
            listEl.appendChild(card);
        });
    }

    // build a single task card element
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = 'task-card priority-' + task.priority;
        if (task.done) card.classList.add('done');
        card.setAttribute('data-id', task.id);

        // format the deadline nicely
        let deadlineStr = 'No deadline';
        if (task.deadline) {
            // adding T00:00:00 prevents timezone issues with date parsing
            const d = new Date(task.deadline + 'T00:00:00');
            deadlineStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        }

        const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);

        card.innerHTML = `
            <div class="task-info">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span>📖 ${escapeHtml(task.subject)}</span>
                    <span>📅 ${deadlineStr}</span>
                    <span class="priority-badge ${task.priority}">${priorityLabel}</span>
                </div>
                ${task.notes ? `<div class="task-notes">${escapeHtml(task.notes)}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="btn-done" data-id="${task.id}">${task.done ? 'Undo' : 'Done ✓'}</button>
                <button class="btn-delete" data-id="${task.id}">Delete</button>
            </div>
        `;

        // mark done/undone
        card.querySelector('.btn-done').addEventListener('click', function() {
            toggleDone(task.id);
            renderPage(); 
        });

        // delete task
        card.querySelector('.btn-delete').addEventListener('click', function() {
            if (confirm('Delete this task?')) {
                deleteTask(task.id);
                renderPage();
            }
        });

        return card;
    }

    // simple HTML escape to avoid XSS when rendering user input
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

});