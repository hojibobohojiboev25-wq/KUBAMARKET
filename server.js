const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Determine the file path
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Get the file extension
    const ext = path.extname(filePath);

    // Set content type based on file extension
    const contentTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };

    const contentType = contentTypes[ext] || 'text/plain';

    // Read and serve the file
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve 404
                fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content || '<h1>404 - Страница не найдена</h1>', 'utf-8');
                });
            } else {
                // Server error
                res.writeHead(500);
                res.end('Ошибка сервера: ' + err.code);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════╗
║           🚀 KUBAMARKET 🚀           ║
║       Магазин ножей запущен!        ║
╠══════════════════════════════════════╣
║ Сервер запущен на порту: ${PORT}        ║
║ Откройте в браузере: http://localhost:${PORT} ║
╚══════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Сервер KUBAMARKET остановлен');
    server.close(() => {
        process.exit(0);
    });
});