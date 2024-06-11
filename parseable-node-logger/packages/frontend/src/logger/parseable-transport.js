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
        "X-P-META-Tag": "hxl-rec",
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
