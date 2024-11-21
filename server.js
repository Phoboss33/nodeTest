const express = require("express");
const app = express();

app.use(express.json()); // Для обработки JSON в POST-запросах

let servers = [];

// Обработка GET-запроса для получения списка серверов
app.get("/servers", (req, res) => {
    res.json(servers);
});

// Обработка POST-запроса для добавления нового сервера
app.post("/servers/add", (req, res) => {
    const { port } = req.body; // Получаем порт из тела запроса
    const ip = req.ip.replace("::ffff:", ""); // Получаем IP клиента (с небольшим преобразованием)

    if (port && !servers.find(s => s.ip === ip && s.port === port)) {
        servers.push({ ip, port });
        res.status(201).send("Server added.");
    } else {
        res.status(400).send("Server already exists or invalid data.");
    }
});

app.get("/servers/onDestroy", (req, res) => {
    console.log(req.ip.replace("::ffff:", "") + " Условно удален")
})

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
