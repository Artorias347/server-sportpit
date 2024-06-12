require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const WebSocket = require('ws'); // Импортируем модуль WebSocket

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Создаем WebSocket-сервер
const wss = new WebSocket.Server({ noServer: true });

// Обработка входящих соединений на WebSocket-сервере
wss.on('connection', function connection(ws) {
  console.log('New WebSocket connection established.');

  ws.on('message', function incoming(message) {
    console.log('Received message:', message);
  });

  ws.on('close', function close() {
    console.log('WebSocket connection closed.');
  });
});

// Добавляем обработчик WebSocket-соединений к серверу Express
app.server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Добавляем обработчик для обновления запросов на WebSocket-сервер
app.server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log(e)
    }
}

start()

module.exports = app; // Экспортируем app для возможности тестирования
