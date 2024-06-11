### Capture & send event stream from your frontend App to Parseable logger with help of your nodejs backend

This repo contains two app

1. Frontend - A CRA based react app
2. Backend - A Express js backend service

##### Example/Demo

To run demo you need to run below commands in your terminal

```bash

# Build production version of your react app
# cd packages/frontend
npm run build

# start express app in dev mode
# cd packages/express-server

npm run start:dev

```

#### How it works!

1. Click on the button on app and you will get logs to your backend parseable dashboard with nodejs backend
2. You can also send customized request logs

#### Express server implementation code snippet

1. Create a Parseable Transport

```js
const axios = require("axios");
const Transport = require("winston-transport");

const BASE_URL = "https://demo.parseable.com";

const auth = Buffer.from("admin:admin").toString("base64");
const streamName = "backend";

class WinstonParseableTransport extends Transport {
  constructor(opts) {
    super(opts);
    this.name = opts.name || "customTransport";
  }

  log(info, callback) {
    console.log("info", info);
    const config = {
      method: "POST",
      baseURL: BASE_URL,
      url: `/api/v1/logstream/${streamName}`,
      headers: {
        "X-P-META-Tag": "a4abs",
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      data: {},
    };

    axios(config)
      .then(function (response) {
        console.log(
          `Custom Transport:sent with status with code ${response.status}`
        );
      })
      .catch(function (error) {
        console.log("axios error", error);
      });
    callback();
  }
}

module.exports = WinstonParseableTransport;
```

2. Create logger configuration to capture logs in backend

```js
// packages/express-server/logger.js
const { createLogger, format, transports } = require("winston");
const WinstonParseableTransport = require("./parseable-transport");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
    new WinstonParseableTransport({ name: "customTransport" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

module.exports = logger;
```

3. Setup an express server to enable a API to receive click event

```js
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
```
