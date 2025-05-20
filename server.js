// server.js
const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(express.json()); // парсим JSON

// Параметры dedicated серверов: через DEDICATED_PORTS или дефолты
// Теперь запускаем 4 сервера
const portsEnv = process.env.DEDICATED_PORTS || "7778,7779,7780,7781,6666";
const dedicatedPorts = portsEnv.split(",").map(p => p.trim()).filter(p => p).map(Number);
const dedicatedPath = path.join(__dirname, "DedicatedServer", "netcode.exe");

// Запускаем каждый dedicated сервер
dedicatedPorts.forEach(port => {
    console.log(`Starting dedicated server: ${dedicatedPath} -port ${port}`);
    const proc = spawn(dedicatedPath, ["-port", String(port)], {
        cwd: path.dirname(dedicatedPath),
        stdio: "inherit"
    });
    console.log(`Dedicated server PID: ${proc.pid} on port ${port}`);
});

// Массив зарегистрированных серверов по API
let servers = [];

// GET /servers — вернуть список серверов
app.get("/servers", (req, res) => {
    console.log("GET /servers →", servers);
    res.json(servers);
});

// POST /servers/add — добавить новый сервер
app.post("/servers/add", (req, res) => {
    const { port } = req.body;
    const ip = req.ip.replace("::ffff:", "");
    console.log("POST /servers/add body:", req.body);

    const portNum = Number(port);
    if (!port || isNaN(portNum)) {
        console.log("Add failed: invalid port");
        return res.status(400).send("Invalid data: port is required.");
    }

    if (servers.find(s => s.ip === ip && s.port === portNum)) {
        console.log("Add failed: duplicate");
        return res.status(400).send("Server already exists.");
    }

    servers.push({ ip, port: portNum });
    console.log("Added:", { ip, port: portNum });
    console.log("Current servers list:", servers);
    return res.status(201).send("Server added.");
});

// Запуск мастер-сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Master-server is running on http://localhost:${PORT}`));