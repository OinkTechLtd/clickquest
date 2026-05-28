// Link page JavaScript - handles the duck and task verification

let taskCompleted = false;
let taskOpened = false;
let taskOpenTime = null;
const MIN_TASK_TIME = 5000; // 5 seconds minimum after opening task
let countdownInterval = null;
let longUrl = null;

function initLinkPage(shortCode) {
    const duck = document.getElementById('duck');
    const duckMessage = document.getElementById('duckMessage');
    const loadingSection = document.getElementById('loadingSection');
    const taskSection = document.getElementById('taskSection');
    const redirectSection = document.getElementById('redirectSection');
    const errorSection = document.getElementById('errorSection');
    const timerElement = document.getElementById('timer');
    const verifyBtn = document.getElementById('verifyBtn');
    
    let timeLeft = 60;
    let hasTask = false;
    let taskData = null;

    // Fetch link info
    fetch('/api/link/' + shortCode)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showError('Ссылка не найдена или истекла');
                return;
            }

            longUrl = data.link.longUrl;
            
            // Track click
            fetch('/api/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shortCode })
            }).catch(() => {});

            if (data.task) {
                hasTask = true;
                taskData = data.task;
                showTask(taskData);
            } else {
                startCountdown();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Произошла ошибка при загрузке ссылки');
        });

    function showTask(task) {
        loadingSection.style.display = 'none';
        taskSection.style.display = 'block';

        const taskIcon = document.getElementById('taskIcon');
        const taskTitle = document.getElementById('taskTitle');
        const taskDescription = document.getElementById('taskDescription');
        const taskLink = document.getElementById('taskLink');

        // Set icon based on task type
        switch(task.type) {
            case 'youtube':
                taskIcon.textContent = '📺';
                taskTitle.textContent = 'YouTube задание';
                break;
            case 'social':
                taskIcon.textContent = '👥';
                taskTitle.textContent = 'Социальная сеть';
                break;
            default:
                taskIcon.textContent = '🌐';
                taskTitle.textContent = 'Посетите сайт';
        }

        taskDescription.textContent = task.description || 'Автор ссылки просит вас выполнить это задание';
        taskLink.href = task.url;

        // Track when user opens the task
        taskLink.addEventListener('click', function() {
            taskOpened = true;
            taskOpenTime = Date.now();
            
            // Start verification button timer
            setTimeout(() => {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Я выполнил задание';
            }, MIN_TASK_TIME);
        });

        // Verify button
        verifyBtn.addEventListener('click', function() {
            if (!taskOpened) {
                makeDuckCry('Сначала откройте ссылку с заданием!');
                return;
            }

            const timeSinceOpen = Date.now() - taskOpenTime;
            if (timeSinceOpen < MIN_TASK_TIME) {
                makeDuckCry('Подождите немного дольше!');
                return;
            }

            // Verify task completion
            verifyTaskCompletion(task.id);
        });
    }

    function verifyTaskCompletion(taskId) {
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Проверка...';

        fetch('/api/verify-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                redirectToDestination();
            } else {
                makeDuckCry('Задание не выполнено! Попробуйте еще раз.');
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'Я выполнил задание';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            makeDuckCry('Ошибка проверки. Попробуйте еще раз.');
            verifyBtn.disabled = false;
            verifyBtn.textContent = 'Я выполнил задание';
        });
    }

    function startCountdown() {
        loadingSection.style.display = 'block';
        
        countdownInterval = setInterval(function() {
            timeLeft--;
            timerElement.textContent = timeLeft;

            if (timeLeft <= 10) {
                timerElement.style.color = '#ef4444';
            }

            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                redirectToDestination();
            }
        }, 1000);
    }

    function redirectToDestination() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        loadingSection.style.display = 'none';
        taskSection.style.display = 'none';
        redirectSection.style.display = 'block';

        setTimeout(function() {
            window.location.href = longUrl;
        }, 1500);
    }

    function showError(message) {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        loadingSection.style.display = 'none';
        taskSection.style.display = 'none';
        errorSection.style.display = 'block';
        document.getElementById('errorMessage').textContent = message;
    }

    function makeDuckCry(message) {
        duck.classList.remove('duck-normal');
        duck.classList.add('duck-crying');
        duckMessage.textContent = message || 'Утка плачет! 😢';
        
        setTimeout(function() {
            duck.classList.remove('duck-crying');
            duck.classList.add('duck-normal');
            duckMessage.textContent = '';
        }, 3000);
    }

    // Prevent leaving page early
    window.addEventListener('beforeunload', function(e) {
        if (!taskCompleted && timeLeft > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Handle back button
    history.pushState(null, null, location.href);
    window.onpopstate = function() {
        if (!taskCompleted && timeLeft > 0) {
            makeDuckCry('Не уходите раньше времени! Утка плачет! 😢');
            history.pushState(null, null, location.href);
        }
    };
}
