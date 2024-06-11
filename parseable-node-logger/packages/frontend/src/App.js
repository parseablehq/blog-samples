import Home from "../src/pages/Home";
import useGlobalEventListener from "./hooks/useGlobalEventTracker";
import { LoggerService } from "./logger/logger-service";

import "./App.css";

function App() {
  useGlobalEventListener(LoggerService);
  return <Home />;
}

export default App;
