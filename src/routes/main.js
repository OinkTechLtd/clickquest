const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index', { 
        title: 'ClickQuest - Главная',
        currentPage: 'home'
    });
});

router.get('/faq', (req, res) => {
    res.render('pages/faq', { 
        title: 'ClickQuest - FAQ',
        currentPage: 'faq'
    });
});

router.get('/docs', (req, res) => {
    res.render('pages/docs', { 
        title: 'ClickQuest - Документация',
        currentPage: 'docs'
    });
});

router.get('/terms', (req, res) => {
    res.render('pages/terms', { 
        title: 'ClickQuest - Условия использования',
        currentPage: 'terms'
    });
});

router.get('/privacy', (req, res) => {
    res.render('pages/privacy', { 
        title: 'ClickQuest - Политика конфиденциальности',
        currentPage: 'privacy'
    });
});

router.get('/create', (req, res) => {
    res.render('pages/create', { 
        title: 'ClickQuest - Создать задание',
        currentPage: 'create'
    });
});

router.get('/link/:shortCode', (req, res) => {
    res.render('pages/link', { 
        title: 'ClickQuest - Переход по ссылке',
        currentPage: 'link',
        shortCode: req.params.shortCode
    });
});

router.get('/task/:taskId', (req, res) => {
    res.render('pages/task', { 
        title: 'ClickQuest - Задание',
        currentPage: 'task',
        taskId: req.params.taskId
    });
});

module.exports = router;
