# Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and we are using Tailwind CSS.

## Available Scripts

In the project directory, you can run:

```
# Runs the app in the development mode Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

npm start

# To build production app
npm run build

```

## Parseable backend

You can set up your own self-hosted Parseable instance to store logs, or you can use demo.parseable.com for development purposes only. We recommend setting up your own Parseable instance to manage CORS/pre-flight checks and custom headers according to your specific requirements.

We need following details of parseable instance

```
URL: https://demo.parseable.com
username: admin
password: admin
streamname: 'ANY_STREAM_YOU_HAVE_CREATED'

```

### Setup to avoid CORS issue (nginx configuration)

below code help you to avoid CORS error

```
location / {
     proxy_pass http://YOUR_PARSEABLE_INSTANCE_IP:PORT;
    # proxy_set_header Host $host;
     proxy_set_header Host $host;
     proxy_set_header X-Real-IP $remote_addr;
     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
     proxy_set_header X-Forwarded-Proto $scheme;

    if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
     }

     add_header 'Access-Control-Allow-Origin' '*';
     add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, DELETE, PUT';
     add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range, Authorization';

   }
```

## Set up your React app to send errors, events, and logs to Parseable.

1. To capture errors, you can utilize React ErrorBoundary or any other React error boundary handler. Below is the code snippet we're employing. We currently use Sentry, but React ErrorBoundary will also serve the purpose effectively.(optional)

```
<ErrorBoundary>
    <App />
 <ErrorBoundary>
```

2. We have created axios instance to send logs/events to parseable (axios-parseable-instance.js and parseable-transport.js)

```
import axios from "axios";
const parseableURL = "https://demo.parseable.com";

export const parseableAxiosInstance = axios.create({
  baseURL: parseableURL,
});

parseableAxiosInstance.interceptors.request.use(
  (config) => {
    // Alternatively, add to request body
    if (config.method === "post" || config.method === "put") {
      let user = localStorage.getItem("profile");
      if (user) {
        user = JSON.parse(user);
        config.data = {
          ...config.data,
        };
      }
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
```

```
/**
 * Name:ParseableTransport
 * description: Parseable Transport to send events, logs, and errors to parseable backend
 */

import { parseableAxiosInstance } from "../utils/axios-parseable-instance";
import { Buffer } from "buffer";

const username = "admin"; // parseable username
const password = "admin"; // parseable password

const basicAuth =
  "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

export default class ParseableTransport {
  // Send logs
  static log(info) {
    const streamName = "eventstream"; // parseable event stream
    const config = {
      method: "post",
      url: `/api/v1/logstream/${streamName}`,
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/json",
      },
      data: {
        level: info.level || "error",
        timestamp: new Date(),
        message: info.message,
        stack: info,
      },
    };

    parseableAxiosInstance(config)
      .then(function (response) {
        console.log(
          `Parseable logs sent with status with code ${response.status}`
        );
      })
      .catch(function (error) {
        console.log("axios error", error);
      });
  }

  // Send Events
  static event(info) {
    const streamName = "eventstream"; // parseable event stream
    console.log("basicAuth", basicAuth);
    const config = {
      method: "post",
      url: `/api/v1/logstream/${streamName}`,
      headers: {
        Authorization: basicAuth,
        "Content-Type": "application/json",
      },
      data: {
        timestamp: new Date(),
        ...info,
      },
    };

    parseableAxiosInstance(config)
      .then(function (response) {
        console.log(
          `Parseable logs sent with status with code ${response.status}`
        );
      })
      .catch(function (error) {
        console.log("axios error", error);
      });
  }
}

```

3. We can use parseable Transport to send logs/errors

```
type log: Error;
ParseableTransport.log(log);

type event: Record<string:string>
ParseableTransport.event(event);

```

4. To get component name to your event you need to add a data component name like below, it help you to get component information

```
<div data-component-name="DashboardCard"></div>
```

5. To identify IP address we need to create a service to fetch IP

```
export const fetchIpAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return null;
  }
};

```

For more implementation you can check demo app
