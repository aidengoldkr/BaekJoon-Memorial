const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const COMMENTS_FILE = path.join(__dirname, 'memory__comments.json');
const MAX_COMMENTS = 300;

function loadComments() {
    try {
        if (!fs.existsSync(COMMENTS_FILE)) {
            return [];
        }
        const raw = fs.readFileSync(COMMENTS_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('댓글 파일 읽기 실패:', error);
        return [];
    }
}

function saveComments(comments) {
    try {
        fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf8');
    } catch (error) {
        console.error('댓글 파일 저장 실패:', error);
    }
}

function createPosition(existingComments) {
    const minDistance = 8;
    const maxTry = 30;

    for (let i = 0; i < maxTry; i += 1) {
        const x = Math.random() * 90;
        const y = Math.random() * 90;
        const overlapped = existingComments.some((comment) => {
            const dx = comment.x - x;
            const dy = comment.y - y;
            return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });

        if (!overlapped) {
            return { x, y };
        }
    }

    return {
        x: Math.random() * 90,
        y: Math.random() * 90
    };
}

const comments = loadComments();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'memory.html'));
});

io.on('connection', (socket) => {
    console.log('유저 접속');
    socket.emit('comments:init', comments);

    socket.on('comment', (data) => {
        const text = (data?.text || '').trim();
        if (!text) {
            return;
        }

        const { x, y } = createPosition(comments);
        const comment = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            text: text.slice(0, 120),
            x,
            y,
            createdAt: new Date().toISOString()
        };

        comments.push(comment);
        if (comments.length > MAX_COMMENTS) {
            comments.splice(0, comments.length - MAX_COMMENTS);
        }

        saveComments(comments);
        io.emit('comment:new', comment);
    });
});

server.listen(3000, () => {
    console.log('서버 실행중');
});
