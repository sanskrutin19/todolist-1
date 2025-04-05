document.addEventListener("DOMContentLoaded", function () {
    let currentCategory = "Study"; // Default category
    const categories = document.querySelectorAll(".category");
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const categoryTitle = document.getElementById("categoryTitle");

    function loadTasks() {
        taskList.innerHTML = "";
        let tasks = JSON.parse(localStorage.getItem(currentCategory)) || [];

        tasks = tasks.filter(task => task.text.trim() !== "");
        localStorage.setItem(currentCategory, JSON.stringify(tasks));

        tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    }

    function addTaskToDOM(taskText, completed = false) {
        if (!taskText.trim()) return;

        const li = document.createElement("li");
        li.classList.add("task-item");
        if (completed) li.classList.add("completed");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task-checkbox");
        checkbox.checked = completed;
        checkbox.addEventListener("change", () => toggleTaskStatus(checkbox, taskText));

        const taskSpan = document.createElement("span");
        taskSpan.classList.add("task-text");
        taskSpan.textContent = taskText;

        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        taskList.appendChild(li);
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        let tasks = JSON.parse(localStorage.getItem(currentCategory)) || [];
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem(currentCategory, JSON.stringify(tasks));

        addTaskToDOM(taskText);
        taskInput.value = "";
    }

    function toggleTaskStatus(checkbox, taskText) {
        let tasks = JSON.parse(localStorage.getItem(currentCategory)) || [];
        tasks = tasks.map(task => {
            if (task.text === taskText) {
                task.completed = checkbox.checked;
                if (task.completed) task.text = "";
            }
            return task;
        });

        tasks = tasks.filter(task => task.text.trim() !== "");
        localStorage.setItem(currentCategory, JSON.stringify(tasks));

        loadTasks();
    }

    categories.forEach(category => {
        category.addEventListener("click", function () {
            categories.forEach(cat => cat.classList.remove("active"));
            this.classList.add("active");

            currentCategory = this.getAttribute("data-category");
            categoryTitle.textContent = `${currentCategory} Tasks`;
            loadTasks();
        });
    });

    addTaskBtn.addEventListener("click", addTask);
    loadTasks();
});
