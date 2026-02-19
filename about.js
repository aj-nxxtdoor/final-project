Documents.addEventListener('DOMContentLoaded', function() {

    const tasks = getTasks();

    // total tasks count
    document.getElementById('aboutTotal').textContent = tasks.length;

    // how many are done
    const doneCount = tasks.filter(t => t.done).length;
    document.getElementById('aboutDone').textContent = doneCount;

    // unique subjects - use a Set to filter duplicates
    const subjectSet = new Set(tasks.map(t => t.subject.toLowerCase().trim()));
    document.getElementById('aboutSubjects').textContent = subjectSet.size;

});