const { Launcher } = require("@loybung/launcher");
const { resolve } = require("path");
const express = require("express");
const cron = require("node-cron");

const starting = express();
const port = 3000;

starting.get('/', (req, res) => {
  res.redirect('http://4levy.xyz/');
});

starting.listen(port, () => {
  console.log(`🔗 Listening to port : http://localhost:${port}`);
});

const app = new Launcher("https://loybung.vercel.app/api/project/streaming");
app.setPath(resolve(__dirname, "./app.js"));
app.setExpire(null);

function startApp() {
  app.Run().catch((err) => {
    console.error(err.message);
    console.log("Restarting the application...");
    startApp();
  });
}

startApp();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.log("Restarting the application due to an uncaught exception...");
  startApp();
});

cron.schedule("*/5 * * * *", () => {
  console.log("Restarting the application...");
  startApp();
});
