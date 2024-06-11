import axios from "axios";

const backendURL = "http://localhost:4444"; // Replace with your backend

export class LoggerService {
  trackEvent(eventType, payload) {
    axios({
      method: "POST",
      baseURL: backendURL,
      url: `/logger`,
      headers: {
        "x-source": "ReactApp",
        "x-event-type": eventType,
      },
      data: payload,
    });
  }
}
