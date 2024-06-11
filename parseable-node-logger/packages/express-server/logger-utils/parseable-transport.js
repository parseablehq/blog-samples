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
