// Create page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const createForm = document.getElementById('createForm');
    const resultSection = document.getElementById('resultSection');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');
    const shortUrlInput = document.getElementById('shortUrlInput');
    const copyBtn = document.getElementById('copyBtn');

    if (createForm) {
        createForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const longUrl = document.getElementById('longUrl').value;
            const taskType = document.getElementById('taskType').value;
            const taskUrl = document.getElementById('taskUrl').value;
            const taskDescription = document.getElementById('taskDescription').value;

            // Validate
            if (!longUrl) {
                showError('Введите длинную ссылку');
                return;
            }

            if (taskType && !taskUrl) {
                showError('Введите URL для задания');
                return;
            }

            // Submit
            try {
                const response = await fetch('/api/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        longUrl,
                        taskType: taskType || null,
                        taskUrl: taskUrl || null,
                        taskDescription: taskDescription || null
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showResult(data.shortUrl);
                } else {
                    showError(data.error || 'Ошибка при создании ссылки');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('Произошла ошибка. Попробуйте позже.');
            }
        });
    }

    function showResult(shortUrl) {
        createForm.style.display = 'none';
        resultSection.style.display = 'block';
        shortUrlInput.value = shortUrl;
    }

    function showError(message) {
        errorSection.style.display = 'block';
        errorMessage.textContent = message;
        setTimeout(() => {
            errorSection.style.display = 'none';
        }, 5000);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            shortUrlInput.select();
            document.execCommand('copy');
            
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Скопировано!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    }
});
