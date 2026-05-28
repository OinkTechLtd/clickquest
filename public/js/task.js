// Task page JavaScript

let taskOpened = false;
let taskOpenTime = null;
const MIN_TASK_TIME = 5000; // 5 seconds minimum
let finalUrl = null;

function initTaskPage(taskId) {
    const duck = document.getElementById('duck');
    const duckMessage = document.getElementById('duckMessage');
    const taskContent = document.getElementById('taskContent');
    const successSection = document.getElementById('successSection');
    const verifyBtn = document.getElementById('verifyBtn');
    const taskLink = document.getElementById('taskLink');

    // Fetch task info from API
    // In a real implementation, you would fetch task details here
    // For now, we simulate the task flow

    // Load task data
    loadTaskData(taskId);

    function loadTaskData(id) {
        // This would normally be an API call
        // Simulating task data for demo
        setTimeout(() => {
            const taskIcon = document.getElementById('taskIcon');
            const taskTitle = document.getElementById('taskTitle');
            const taskDescription = document.getElementById('taskDescription');

            // Set default values (in real app, fetch from API)
            taskIcon.textContent = '📋';
            taskTitle.textContent = 'Задание от автора';
            taskDescription.textContent = 'Выполните задание чтобы продолжить';

            // Enable task link
            taskLink.addEventListener('click', function() {
                taskOpened = true;
                taskOpenTime = Date.now();

                // Start verification button timer
                setTimeout(() => {
                    verifyBtn.disabled = false;
                    verifyBtn.textContent = 'Я выполнил задание';
                }, MIN_TASK_TIME);
            });
        }, 500);
    }

    // Verify button
    verifyBtn.addEventListener('click', function() {
        if (!taskOpened) {
            makeDuckCry(duck, duckMessage, 'Сначала откройте ссылку с заданием!');
            return;
        }

        const timeSinceOpen = Date.now() - taskOpenTime;
        if (timeSinceOpen < MIN_TASK_TIME) {
            makeDuckCry(duck, duckMessage, 'Подождите немного дольше!');
            return;
        }

        // Verify task completion
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Проверка...';

        // Simulate verification (in real app, call API)
        setTimeout(() => {
            taskContent.style.display = 'none';
            successSection.style.display = 'block';
            makeDuckHappy(duck, duckMessage);
        }, 1000);
    });

    // Prevent leaving early
    window.addEventListener('beforeunload', function(e) {
        if (taskContent.style.display !== 'none') {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Handle back button
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
        if (taskContent.style.display !== 'none') {
            makeDuckCry(duck, duckMessage, 'Не уходите раньше времени! Утка плачет! 😢');
            history.pushState(null, null, location.href);
        }
    };
}

function makeDuckCry(duck, duckMessage, message) {
    duck.classList.remove('duck-normal');
    duck.classList.add('duck-crying');
    duckMessage.textContent = message || 'Утка плачет! 😢';

    setTimeout(function() {
        duck.classList.remove('duck-crying');
        duck.classList.add('duck-normal');
        duckMessage.textContent = '';
    }, 3000);
}

function makeDuckHappy(duck, duckMessage) {
    duck.classList.remove('duck-normal', 'duck-crying');
    duck.classList.add('duck-happy');
    duckMessage.textContent = 'Утка довольна! 🎉';
}
