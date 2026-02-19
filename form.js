document.addEventListener('DOMContentLoaded', function() {

    const form = document.getElementById('taskForm');
    const notesField = document.getElementById('taskNotes');
    const charCount = document.getElementById('charCount');
    const formMsg = document.getElementById('formMsg');

    // live character count for the notes textarea
    notesField.addEventListener('input', function() {
        const len = notesField.value.length;
        charCount.textContent = len + ' / 300';
        if (len > 270) {
            charCount.style.color = '#ef4444'; 
        } else {
        CCHARCOUNT .style.color = '';
        }
    });

    // handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 

        // clear previous errors first
        clearErrors();

        const title = document.getElementById('taskTitle').value.trim();
        const subject = document.getElementById('taskSubject').value.trim();
        const deadline = document.getElementById('taskDeadline').value;
        const priority = document.getElementById('taskPriority').value;
        const notes = notesField.value.trim();

        // run validation
        let valid = true;

        if (!title) {
            showError('titleError', 'taskTitle', 'Title is required.');
            valid = false;
        } else if (title.length < 3) {
            showError('titleError', 'taskTitle', 'Title must be at least 3 characters.');
            valid = false;
        }

        if (!subject) {
            showError('subjectError', 'taskSubject', 'Subject is required.');
            valid = false;
        }

        if (!deadline) {
            showError('deadlineError', 'taskDeadline', 'Please pick a deadline.');
            valid = false;
        } else {
            // check deadline is not in the past
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const picked = new Date(deadline + 'T00:00:00');
            if (picked < today) {
                showError('deadlineError', 'taskDeadline', 'Deadline cannot be in the past.');
                valid = false;
            }
        }

        if (!valid) {
            showFormMsg('Please fix the errors above before saving.', 'error');
            return;
        }

        // build the task object
        const newTask = {
            id: generateId(),
            title: title,
            subject: subject,
            deadline: deadline,
            priority: priority,
            notes: notes,
            done: false,
            createdAt: Date.now()
        };

        // save to localStorage
        addTask(newTask);

        // show success message and reset the form
        showFormMsg('Task saved successfully! 🎉', 'success');
        form.reset();
        charCount.textContent = '0 / 300';

        // scroll to top of form so user sees the message
        formMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // clear the form when reset button is clicked
    document.getElementById('clearBtn').addEventListener('click', function() {
        clearErrors();
        hideFormMsg();
        charCount.textContent = '0 / 300';
        charCount.style.color = '';
    });

    // ---- helper functions ----

    function showError(errorElId, inputId, message) {
        document.getElementById(errorElId).textContent = message;
        document.getElementById(inputId).classList.add('invalid');
    }

    function clearErrors() {
        // clear error messages
        ['titleError', 'subjectError', 'deadlineError'].forEach(function(id) {
            document.getElementById(id).textContent = '';
        });
        // remove red borders
        ['taskTitle', 'taskSubject', 'taskDeadline'].forEach(function(id) {
            document.getElementById(id).classList.remove('invalid');
        });
    }

    function showFormMsg(text, type) {
        formMsg.textContent = text;
        formMsg.className = 'form-msg ' + type;
        formMsg.classList.remove('hidden');
    }

    function hideFormMsg() {
        formMsg.classList.add('hidden');
        formMsg.className = 'form-msg hidden';
    }

    // remove red border when user starts typing in a field
    ['taskTitle', 'taskSubject', 'taskDeadline'].forEach(function(id) {
        const el = document.getElementById(id);
        el.addEventListener('input', function() {
            el.classList.remove('invalid');
        });
    });

});