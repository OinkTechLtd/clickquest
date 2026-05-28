const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const DATA_FILE = path.join(__dirname, '../data/links.json');

// Helper functions for data storage
function loadLinks() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error loading links:', err);
    }
    return { links: [], tasks: [] };
}

function saveLinks(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error saving links:', err);
    }
}

// Generate short code using is.gd API
async function generateShortCode(longUrl) {
    try {
        const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
        const data = await response.json();
        if (data.shorturl) {
            // Extract the short code from the URL
            const shortCode = data.shorturl.split('/').pop();
            return shortCode;
        }
    } catch (err) {
        console.error('Error generating short code:', err);
    }
    // Fallback to UUID
    return uuidv4().substring(0, 8);
}

// Create a new link with optional task
router.post('/create', async (req, res) => {
    try {
        const { longUrl, taskType, taskUrl, taskDescription } = req.body;

        if (!longUrl) {
            return res.status(400).json({ error: 'URL обязателен' });
        }

        const shortCode = await generateShortCode(longUrl);
        const taskId = taskType && taskUrl ? uuidv4() : null;

        const linkData = {
            shortCode,
            longUrl,
            taskId,
            createdAt: new Date().toISOString(),
            clicks: 0
        };

        if (taskId) {
            const taskData = {
                id: taskId,
                type: taskType,
                url: taskUrl,
                description: taskDescription || '',
                required: true
            };
            
            const data = loadLinks();
            data.tasks.push(taskData);
            saveLinks(data);
        }

        const data = loadLinks();
        data.links.push(linkData);
        saveLinks(data);

        res.json({ 
            success: true, 
            shortCode,
            shortUrl: `http://localhost:${process.env.PORT || 3000}/link/${shortCode}`,
            taskId
        });
    } catch (err) {
        console.error('Error creating link:', err);
        res.status(500).json({ error: 'Ошибка при создании ссылки' });
    }
});

// Get link info
router.get('/link/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const data = loadLinks();
    const link = data.links.find(l => l.shortCode === shortCode);

    if (!link) {
        return res.status(404).json({ error: 'Ссылка не найдена' });
    }

    let task = null;
    if (link.taskId) {
        task = data.tasks.find(t => t.id === link.taskId);
    }

    res.json({
        link,
        task
    });
});

// Verify task completion
router.post('/verify-task', (req, res) => {
    const { taskId, userId } = req.body;

    if (!taskId) {
        return res.status(400).json({ error: 'ID задания обязателен' });
    }

    const data = loadLinks();
    const task = data.tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Задание не найдено' });
    }

    // In a real implementation, we would verify the task was completed
    // For now, we'll simulate verification with a simple check
    // The actual verification happens on the frontend by tracking user behavior
    
    res.json({
        success: true,
        message: 'Задание выполнено'
    });
});

// Track click
router.post('/track-click', (req, res) => {
    const { shortCode } = req.body;
    const data = loadLinks();
    const link = data.links.find(l => l.shortCode === shortCode);

    if (link) {
        link.clicks = (link.clicks || 0) + 1;
        saveLinks(data);
    }

    res.json({ success: true });
});

module.exports = router;
