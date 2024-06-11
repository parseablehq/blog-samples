const express = require("express");
const path = require("path");
const logger = require("./logger-utils/logger");

const app = express();
const port = 4444;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  // To handle global events on request (Optional)
  // logger.info(`${req.method} ${req.url}`);
  next();
});

// Handle React Frontend App rendering
app.use(express.static(path.join(__dirname, "../frontend/build")));

// API to handle log process
app.post("/logger", (req, res) => {
  const { body = {} } = req;
  const ip = req.ip;
  const userAgent = req.get("User-Agent");
  logger.info({
    ...body,
    userAgent,
    host: ip,
  });
  res.json({
    message: "Log Triggered successfully!",
  });
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
