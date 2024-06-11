import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import packageJson from "../../package.json";

const useGlobalEventListener = (loggerService) => {
  const logger = new loggerService();

  const location = useLocation();
  useEffect(() => {
    const captureClickEvent = (event) => {
      let element = event.target;
      // Traverse up the DOM tree until we find an element with the data-component-name attribute
      while (element && !element.dataset.componentName) {
        element = element.parentElement;
      }
      let componentName = "NA";
      if (element) {
        componentName = element.dataset.componentName;
      }

      const { innerText, className } = event.target;

      const metadata = {
        event: "click",
        component: componentName,
        class: className,
        content: innerText,
        appVersion: packageJson.version,
        url: location.pathname,
      };

      logger.trackEvent("click", metadata);
    };

    document.addEventListener("click", captureClickEvent);

    return () => {
      document.removeEventListener("click", captureClickEvent);
    };
  }, []);
};

export default useGlobalEventListener;
